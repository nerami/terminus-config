"""FastMCP (Streamable HTTP) app exposing the eight knowledge tools, an optional
bearer-token gate on /mcp, an open GET /health, and a lifespan that runs the MCP
session manager plus the refresher poll loop.

The tools are built as plain callables bound to an ``AppState`` (so they're unit
testable without the MCP transport) and then registered on the FastMCP server.
"""

from __future__ import annotations

import asyncio
import contextlib
import logging
import os
import secrets
from dataclasses import dataclass

from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

from .config import Settings
from .history import (
    get_automation_trace as _hist_trace,
    get_history as _hist_history,
    get_logbook as _hist_logbook,
)
from .index import VectorIndex
from .refresher import Refresher

logger = logging.getLogger(__name__)


@dataclass
class AppState:
    settings: Settings
    index: VectorIndex
    refresher: Refresher


STATE: AppState | None = None


def health_payload(state: AppState) -> dict:
    indexed = len(state.index)
    if state.refresher.last_error:
        status = "degraded"
    elif indexed == 0 and state.refresher.last_refresh is None:
        status = "warming"
    else:
        status = "ok"
    return {
        "status": status,
        "indexed": indexed,
        "kinds": state.index.list_kinds(),
        "last_refresh": state.refresher.last_refresh,
        "model": state.settings.embed_model,
    }


def _numeric_resolver(state: AppState):
    """Resolve an automation entity id to its numeric id via the index.

    ``build_scene_script_automation_records`` stores automations under
    ``id=f"automation:{entity_id}"`` (e.g. ``"automation:automation.night"``) with
    ``metadata["numeric_id"]``."""
    def resolve(entity_id: str) -> str | None:
        rec = state.index.get(f"automation:{entity_id}", "automation")
        return rec.get("numeric_id") if rec else None
    return resolve


def build_tools(state: AppState) -> dict:
    """Return the eight tool callables bound to ``state`` (also registered on FastMCP)."""

    def search_ha(query: str, kind: str | None = None, area: str | None = None,
                  top_k: int | None = None) -> list[dict]:
        k = state.settings.top_k_default if top_k is None else top_k
        vec = state.index.embed_query(query)
        return state.index.search(vec, kind=kind, area=area, top_k=k)

    def list_records(kind: str, area: str | None = None) -> list[dict]:
        return state.index.list_records(kind=kind, area=area)

    def list_kinds() -> list[dict]:
        return state.index.list_kinds()

    def get_record(id: str, kind: str) -> dict:
        rec = state.index.get(id, kind)
        return rec if rec is not None else {"error": f"no {kind} record with id {id}"}

    async def get_automation_trace(automation: str, run_id: str | None = None) -> dict:
        from websockets.asyncio.client import connect as ws_connect
        return await _hist_trace(
            state.settings, ws_connect, automation, run_id,
            numeric_resolver=_numeric_resolver(state),
        )

    async def get_logbook(start: str, end: str | None = None,
                          entity_id: str | None = None) -> dict:
        return await _hist_logbook(state.settings, start, end, entity_id)

    async def get_history(entity_id: str, start: str, end: str | None = None) -> dict:
        return await _hist_history(state.settings, entity_id, start, end)

    async def refresh() -> dict:
        return await state.refresher.refresh_once()

    return {
        "search_ha": search_ha,
        "list_records": list_records,
        "list_kinds": list_kinds,
        "get_record": get_record,
        "get_automation_trace": get_automation_trace,
        "get_logbook": get_logbook,
        "get_history": get_history,
        "refresh": refresh,
    }


class BearerAuthMiddleware:
    """Pure ASGI middleware with three path branches.

    - ``/health`` — always open (liveness probe).
    - ``/mcp*`` — bearer-gated when ``settings.api_token`` is set: requires
      ``Authorization: Bearer <token>`` (constant-time compare). No token in logs.
    - Everything else (SPA + ``/playground/*``) — exempt from the bearer token but,
      when ``api_token`` is set, served only when the ``X-Ingress-Path`` header is
      present (HA ingress sets it). Requests without it receive 404 to hide the
      surface from non-ingress callers.
    """

    def __init__(self, app, settings: Settings) -> None:
        self.app = app
        self.settings = settings

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)

        path = scope.get("path", "")
        normalized = path.rstrip("/") or "/"

        # /health is always open (liveness probe).
        if normalized == "/health":
            return await self.app(scope, receive, send)

        token = self.settings.api_token

        # MCP endpoint: bearer-gated when a token is configured.
        if path.startswith("/mcp"):
            if not token:
                return await self.app(scope, receive, send)
            headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
            auth = headers.get("authorization", "")
            presented = auth[7:] if auth.startswith("Bearer ") else ""
            if presented and secrets.compare_digest(presented, token):
                return await self.app(scope, receive, send)
            resp = JSONResponse({"error": "unauthorized"}, status_code=401)
            return await resp(scope, receive, send)

        # Everything else (SPA + /playground/*): exempt from the bearer token,
        # but when a token is configured serve only ingress-proxied requests
        # (HA sets X-Ingress-Path). 404 hides the surface from non-ingress callers.
        if not token:
            return await self.app(scope, receive, send)
        headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
        if "x-ingress-path" in headers:
            return await self.app(scope, receive, send)
        resp = JSONResponse({"error": "not found"}, status_code=404)
        await resp(scope, receive, send)


def build_app(state: AppState) -> Starlette:
    from mcp.server.fastmcp import FastMCP
    from mcp.server.transport_security import TransportSecuritySettings

    global STATE
    STATE = state

    mcp = FastMCP(
        "terminus-rag",
        stateless_http=True,
        json_response=True,
        transport_security=TransportSecuritySettings(
            allowed_hosts=[
                # Internal add-on hostname used by Terminus when calling over the
                # hassio network (local-terminus-rag:<port>).
                "local-terminus-rag",
                "local-terminus-rag:*",
                # Keep localhost variants for local dev / tests.
                "127.0.0.1:*",
                "localhost",
                "localhost:*",
                "[::1]:*",
            ],
        ),
    )
    tools = build_tools(state)

    # Register each tool with a description (history descriptions note HA retention).
    mcp.tool(name="search_ha", description=(
        "Semantic search over HA registry items (entities, scenes, automations, "
        "etc.). Returns top-k {id, kind, name, domain, area, score, metadata}."
    ))(tools["search_ha"])
    mcp.tool(name="list_records", description=(
        "Full enumeration of every record of a kind (optionally filtered by area). "
        "No embedding — the complete-list path."
    ))(tools["list_records"])
    mcp.tool(name="list_kinds", description="What kinds are indexed and their counts.")(
        tools["list_kinds"]
    )
    mcp.tool(name="get_record", description="Exact metadata for one record by id+kind.")(
        tools["get_record"]
    )
    mcp.tool(name="get_automation_trace", description=(
        "Latest (or specified) automation trace. Accepts an entity id or numeric id. "
        "Reads HA's trace store — limited to the last ~stored_traces runs HA kept."
    ))(tools["get_automation_trace"])
    mcp.tool(name="get_logbook", description=(
        "Logbook events in a time range. Reads HA's recorder — limited to HA's "
        "retention window (~10 days by default)."
    ))(tools["get_logbook"])
    mcp.tool(name="get_history", description=(
        "State history for an entity in a time range. Reads HA's recorder — limited "
        "to HA's retention window (~10 days by default)."
    ))(tools["get_history"])
    mcp.tool(name="refresh", description=(
        "Force a registry rescan now. Returns {added, changed, removed, total, took_ms}."
    ))(tools["refresh"])

    @mcp.custom_route("/health", methods=["GET"])
    async def health(request: Request) -> Response:
        return JSONResponse(health_payload(state))

    inner = mcp.streamable_http_app()

    @contextlib.asynccontextmanager
    async def lifespan(app: Starlette):
        async with mcp.session_manager.run():
            task = asyncio.create_task(state.refresher.run_loop())
            try:
                yield
            finally:
                state.refresher.stop()
                task.cancel()
                with contextlib.suppress(asyncio.CancelledError):
                    await task

    from .playground import build_playground_routes

    routes = list(inner.routes) + build_playground_routes(state, mcp)

    # Serve the built SPA only when present (absent in backend-only tests and in
    # `dev.sh`, where Vite serves the frontend). StaticFiles errors at startup if
    # the directory is missing, so guard the mount.
    dist_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
    if os.path.isdir(dist_dir):
        routes.append(Mount("/", app=StaticFiles(directory=dist_dir, html=True)))

    app = Starlette(routes=routes, lifespan=lifespan)
    app.add_middleware(BearerAuthMiddleware, settings=state.settings)
    return app
