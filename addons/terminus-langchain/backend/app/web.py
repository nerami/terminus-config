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
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from starlette.background import BackgroundTask

from .config import Settings, load_settings
from .ha_client import HAClient
from . import ha_registry

STATIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "dist"
LANGGRAPH_URL = os.environ.get("LANGGRAPH_URL", "http://127.0.0.1:2025")

# Response headers managed by StreamingResponse / the transport itself.
_HOP_BY_HOP = {
    "content-length",
    "content-encoding",
    "transfer-encoding",
    "connection",
    "keep-alive",
}

_NOT_CONFIGURED = {
    "status": "disconnected",
    "ha_version": None,
    "last_connected": None,
    "error": "Home Assistant connection not configured",
    "url": "",
}

_NOT_CONFIGURED_ERROR = {"error": "Home Assistant connection not configured"}

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
) -> FastAPI:
    settings = settings or load_settings()
    registry_connect = registry_connect or _ws_connect

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        ha = client
        if ha is None and settings.ws_url:
            ha = HAClient(settings.ws_url, settings.ha_token, _ws_connect)
        app.state.ha = ha
        app.state.topology_cache = None  # (monotonic_ts, data)
        app.state.http = httpx.AsyncClient(
            base_url=LANGGRAPH_URL, transport=proxy_transport, timeout=None
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

    @app.get("/ha/status")
    async def ha_status():
        ha = getattr(app.state, "ha", None)
        if ha is None:
            return JSONResponse(_NOT_CONFIGURED)
        return JSONResponse(ha.get_status())

    @app.get("/ha/topology")
    async def ha_topology():
        if not settings.ws_url:
            return JSONResponse(_NOT_CONFIGURED_ERROR, status_code=503)
        cached = getattr(app.state, "topology_cache", None)
        if cached is not None and (time.monotonic() - cached[0]) < _TOPOLOGY_TTL:
            return JSONResponse(cached[1])
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

    @app.api_route(
        "/api/{path:path}",
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )
    async def langgraph_proxy(path: str, request: Request):
        """Reverse-proxy LangGraph SDK calls to the local langgraph server.

        Strips the ``/api`` prefix and streams the response so SSE run streams
        flow through unbuffered.
        """
        client_http: httpx.AsyncClient = app.state.http
        headers = {
            k: v for k, v in request.headers.items() if k.lower() != "host"
        }
        upstream = client_http.build_request(
            request.method,
            f"/{path}",
            params=request.query_params,
            headers=headers,
            content=await request.body(),
        )
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
