"""FastAPI app: the add-on's public face behind Home Assistant ingress.

Responsibilities:
  * ``GET /ha/status`` - the live Home Assistant websocket connection status.
  * ``/api/*``         - reverse proxy to the local LangGraph server (added in Plan 2).
  * ``/``              - the built SPA (static files), with a catch-all
                         fallback to ``index.html`` for client-side routes;
                         registered last so it never shadows the routes above.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from pydantic import BaseModel
from starlette.background import BackgroundTask

from .config import Settings, load_settings
from .ha_client import HAClient
from .logging_setup import configure_logging
from . import ha_registry

logger = logging.getLogger(__name__)

STATIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "dist"
LANGGRAPH_URL = os.environ.get("LANGGRAPH_URL", "http://127.0.0.1:2025")

# The add-on's own version, surfaced to the frontend (sidebar badge) via
# ``/ha/status``. Baked into the image as an ENV from the Supervisor's
# ``BUILD_VERSION`` build-arg (which equals config.yaml's ``version``); ``None``
# outside the Supervisor build (e.g. ``vite dev`` / bare backend), where the
# frontend simply hides the badge. config.yaml stays the single source of truth.
TERMINUS_VERSION = os.environ.get("TERMINUS_VERSION") or None

# Bounded proxy timeouts (H2). A wedged upstream must not pin a connection
# forever. ``read`` is the per-chunk inactivity bound: generous enough for a
# slow LLM token stream, finite so an SSE stream that goes silent eventually
# raises httpx.ReadTimeout instead of hanging.
_PROXY_TIMEOUT = httpx.Timeout(
    None,  # default (overridden below per-phase)
    connect=10.0,
    read=120.0,
    write=30.0,
    pool=10.0,
)

# Response headers managed by StreamingResponse / the transport itself.
_HOP_BY_HOP = {
    "content-length",
    "content-encoding",
    "transfer-encoding",
    "connection",
    "keep-alive",
}

# Request headers we never forward upstream (H2): the caller's HA-ingress
# auth must not reach the langgraph dev server, and hop-by-hop headers must
# not let a client desync/inject on the upstream connection. httpx recomputes
# content-length from the body it actually sends.
# Headers stripped above that httpx re-adds correctly and must be kept for the
# upstream request (host and content-length are recomputed by httpx).
_REQUEST_KEEP_HEADERS = ("host", "content-length")
_REQUEST_STRIP_HEADERS = frozenset(
    {
        "host",
        "authorization",
        "proxy-authorization",
        "content-length",
        "connection",
        "keep-alive",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
    }
)

# --- LangGraph proxy allowlist (H1) --------------------------------------
# Exactly the (method, path) pairs the frontend SDK calls, derived from
# frontend/src/providers/{thread,stream}.tsx + the bundled
# @langchain/langgraph-sdk client. Paths are matched AFTER the "/api" prefix
# is stripped. Anything not listed is rejected (403) BEFORE any upstream call,
# so thread enumeration/deletion, store, and cron admin surfaces stay closed.
# {id} segments are opaque url-safe tokens (no slash).
_ID = r"[^/\s]+"
_PROXY_ALLOWLIST: tuple[tuple[str, "re.Pattern[str]"], ...] = (
    ("GET", re.compile(r"^/info$")),
    ("POST", re.compile(r"^/threads$")),
    ("POST", re.compile(r"^/threads/search$")),
    ("GET", re.compile(rf"^/threads/{_ID}$")),
    ("PATCH", re.compile(rf"^/threads/{_ID}$")),
    ("GET", re.compile(rf"^/threads/{_ID}/state$")),
    ("POST", re.compile(rf"^/threads/{_ID}/history$")),
    ("POST", re.compile(rf"^/threads/{_ID}/runs/stream$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}$")),
    ("POST", re.compile(rf"^/threads/{_ID}/runs/{_ID}/cancel$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}/join$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}/stream$")),
)


def _is_allowed(method: str, path: str) -> bool:
    """True iff (method, path) is in the proxy allowlist.

    ``path`` is the proxy's captured ``{path:path}`` (no leading slash); we
    normalize to a single leading slash before matching.
    """
    norm = "/" + path.lstrip("/")
    method = method.upper()
    return any(m == method and pat.match(norm) for m, pat in _PROXY_ALLOWLIST)


_NOT_CONFIGURED = {
    "status": "disconnected",
    "ha_version": None,
    "last_connected": None,
    "error": "Home Assistant connection not configured",
    "url": "",
}

_NOT_CONFIGURED_ERROR = {"error": "Home Assistant connection not configured"}


class _TitleRequest(BaseModel):
    """Body for ``POST /api/title``: the chat's first user message."""

    message: str

# Topology snapshots are relatively expensive (four registry/state list calls),
# so cache the last result briefly to absorb rapid view switches in the UI.
_TOPOLOGY_TTL = 15.0


def _ws_connect(url: str):
    import websockets

    return websockets.connect(url, ping_interval=20, ping_timeout=20)


def create_app(
    *,
    settings: Optional[Settings] = None,
    client: Optional[HAClient] = None,
    static_dir: Path = STATIC_DIR,
    proxy_transport: Optional[httpx.BaseTransport] = None,
    registry_connect: Optional[ha_registry.ConnectFn] = None,
    ha_rest_transport: Optional[httpx.BaseTransport] = None,
    title_chain=None,
    terminus_version: Optional[str] = TERMINUS_VERSION,
) -> FastAPI:
    configure_logging()
    settings = settings or load_settings()
    registry_connect = registry_connect or _ws_connect

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        ha = client
        if ha is None and settings.ws_url:
            ha = HAClient(settings.ws_url, settings.ha_token, _ws_connect)
        app.state.ha = ha
        app.state.topology_cache = None  # (monotonic_ts, data)
        app.state.topology_lock = asyncio.Lock()
        app.state.http = httpx.AsyncClient(
            base_url=LANGGRAPH_URL, transport=proxy_transport, timeout=_PROXY_TIMEOUT
        )
        task = asyncio.create_task(ha.run_forever()) if ha is not None else None
        try:
            yield
        finally:
            if ha is not None:
                ha.stop()
            if task is not None:
                task.cancel()
                try:
                    await task
                except (asyncio.CancelledError, Exception):  # noqa: BLE001
                    pass
            await app.state.http.aclose()

    app = FastAPI(title="Terminus LangChain", lifespan=lifespan)
    # Optional injected title chain (tests pass a fake); None => lazy default.
    app.state.title_chain = title_chain

    @app.get("/ha/status")
    async def ha_status():
        ha = getattr(app.state, "ha", None)
        status = _NOT_CONFIGURED if ha is None else ha.get_status()
        # Merge the add-on version in (non-destructively) so the sidebar badge
        # can read it from the same poll the status dot already uses.
        return JSONResponse({**status, "terminus_version": terminus_version})

    @app.get("/ha/topology")
    async def ha_topology():
        if not settings.ws_url:
            return JSONResponse(_NOT_CONFIGURED_ERROR, status_code=503)

        def _fresh_cache():
            cached = getattr(app.state, "topology_cache", None)
            if cached is not None and (time.monotonic() - cached[0]) < _TOPOLOGY_TTL:
                return cached[1]
            return None

        hit = _fresh_cache()
        if hit is not None:
            return JSONResponse(hit)

        # Cache miss: single-flight so concurrent misses don't each run the
        # expensive 4-call + per-automation fetch and open N websockets (M1).
        async with app.state.topology_lock:
            hit = _fresh_cache()  # another waiter may have populated it
            if hit is not None:
                return JSONResponse(hit)
            try:
                data = await ha_registry.fetch_topology(settings, registry_connect)
            except Exception as exc:  # noqa: BLE001 - surface as a 502 to the UI
                return JSONResponse(
                    {"error": f"{type(exc).__name__}: {exc}"}, status_code=502
                )
            app.state.topology_cache = (time.monotonic(), data)
            return JSONResponse(data)

    @app.get("/ha/automation/{numeric_id}")
    async def ha_automation(numeric_id: str, entity_id: Optional[str] = None):
        if not settings.ws_url:
            return JSONResponse(_NOT_CONFIGURED_ERROR, status_code=503)
        try:
            data = await ha_registry.fetch_automation(
                settings,
                numeric_id,
                registry_connect,
                entity_id=entity_id,
                transport=ha_rest_transport,
            )
        except Exception as exc:  # noqa: BLE001 - surface as a 502 to the UI
            return JSONResponse(
                {"error": f"{type(exc).__name__}: {exc}"}, status_code=502
            )
        return JSONResponse(data)

    @app.get("/ha/entity/{entity_id}")
    async def ha_entity(entity_id: str):
        if not settings.ws_url:
            return JSONResponse(_NOT_CONFIGURED_ERROR, status_code=503)
        try:
            data = await ha_registry.fetch_entity(
                settings, entity_id, transport=ha_rest_transport
            )
        except Exception as exc:  # noqa: BLE001 - surface as a 502 to the UI
            return JSONResponse(
                {"error": f"{type(exc).__name__}: {exc}"}, status_code=502
            )
        return JSONResponse(data)

    # Registered BEFORE the /api/{path} proxy so it is handled locally.
    # /api/title is not a real LangGraph resource, so intercepting it here
    # (rather than forwarding it upstream) is safe.
    @app.post("/api/title")
    async def generate_title(req: _TitleRequest):
        from .title import agenerate_title

        title = await agenerate_title(req.message, chain=app.state.title_chain)
        return JSONResponse({"title": title})

    @app.api_route(
        "/api/{path:path}",
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )
    async def langgraph_proxy(path: str, request: Request):
        """Reverse-proxy LangGraph SDK calls to the local langgraph server.

        Strips the ``/api`` prefix and streams the response so SSE run streams
        flow through unbuffered. Only the explicit ``_PROXY_ALLOWLIST`` of
        (method, path) pairs the frontend uses is forwarded; everything else is
        rejected here, before any upstream contact.
        """
        if not _is_allowed(request.method, path):
            return JSONResponse(
                {"error": "not allowed"}, status_code=403
            )
        client_http: httpx.AsyncClient = app.state.http
        headers = {
            k: v
            for k, v in request.headers.items()
            if k.lower() not in _REQUEST_STRIP_HEADERS
        }
        upstream = client_http.build_request(
            request.method,
            f"/{path}",
            params=request.query_params,
            headers=headers,
            content=await request.body(),
        )
        # httpx re-adds some hop-by-hop headers (e.g. connection) plus the correct
        # upstream host and a recomputed content-length. Strip the hop-by-hop ones
        # it added, but KEEP the host and content-length httpx set for the upstream.
        for stripped_header in _REQUEST_STRIP_HEADERS:
            if stripped_header not in _REQUEST_KEEP_HEADERS and stripped_header in upstream.headers:
                del upstream.headers[stripped_header]
        resp = await client_http.send(upstream, stream=True)
        out_headers = {
            k: v
            for k, v in resp.headers.items()
            if k.lower() not in _HOP_BY_HOP
        }
        return StreamingResponse(
            resp.aiter_raw(),
            status_code=resp.status_code,
            headers=out_headers,
            background=BackgroundTask(resp.aclose),
        )

    # Serve the built SPA. Registered LAST so it never shadows the explicit
    # /ha/* and /api/* routes above (FastAPI matches in registration order).
    if static_dir.is_dir():
        index_file = static_dir / "index.html"
        root = static_dir.resolve()

        @app.get("/{full_path:path}")
        async def spa_fallback(full_path: str):
            """Serve real static files; fall back to index.html for SPA routes.

            Path-traversal safe: a resolved candidate must live under
            ``static_dir`` before it is served, so requests containing ``..``
            can never reach a file outside the dist directory.
            """
            candidate = (static_dir / full_path).resolve()
            if (
                candidate == root or root in candidate.parents
            ) and candidate.is_file():
                return FileResponse(candidate)
            if index_file.is_file():
                return FileResponse(index_file)
            raise HTTPException(status_code=404)

    return app


app = create_app()
