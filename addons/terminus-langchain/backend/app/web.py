"""FastAPI app: the add-on's public face behind Home Assistant ingress.

Responsibilities:
  * ``GET /ha/status`` - the live Home Assistant websocket connection status.
  * ``/api/*``         - reverse proxy to the local LangGraph server (added in Plan 2).
  * ``/``              - the built SPA (static files), mounted last so it never
                         shadows the API routes above.
"""

from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask

from .config import Settings, load_settings
from .ha_client import HAClient

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


def _ws_connect(url: str):
    import websockets

    return websockets.connect(url, ping_interval=20, ping_timeout=20)


def create_app(
    *,
    settings: Optional[Settings] = None,
    client: Optional[HAClient] = None,
    static_dir: Path = STATIC_DIR,
    proxy_transport: Optional[httpx.BaseTransport] = None,
) -> FastAPI:
    settings = settings or load_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        ha = client
        if ha is None and settings.ws_url:
            ha = HAClient(settings.ws_url, settings.ha_token, _ws_connect)
        app.state.ha = ha
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

    if static_dir.is_dir():
        app.mount("/", StaticFiles(directory=static_dir, html=True), name="spa")

    return app


app = create_app()
