import json

import httpx

from app.config import Settings
from app.embedder import FakeEmbedder
from app.index import VectorIndex
from app.main import build_app, build_state
from app.mcp_app import (
    AppState,
    BearerAuthMiddleware,
    build_tools,
    health_payload,
)
from app.records import IndexRecord
from app.refresher import Refresher


def _settings(api_token=""):
    return Settings(
        ws_url="ws://x", ha_token="t", use_supervisor=False, api_token=api_token,
        refresh_interval=600, embed_model="bge", top_k_default=10, log_level="info",
    )


def _state(api_token=""):
    emb = FakeEmbedder(dim=8)
    idx = VectorIndex(emb)
    idx.upsert([
        IndexRecord(id="entity:light.bed", kind="entity",
                    text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
        IndexRecord(id="scene:scene.movie", kind="scene",
                    text="Movie Night | scene",
                    metadata={"name": "Movie Night", "area": "Living"}),
    ])
    settings = _settings(api_token)
    refresher = Refresher(idx, settings, connect=lambda u: None, fetch=None)
    return AppState(settings=settings, index=idx, refresher=refresher)


def test_search_ha_tool_returns_ranked_hits():
    tools = build_tools(_state())
    hits = tools["search_ha"]("Bedroom Lamp | light")
    assert hits[0]["id"] == "entity:light.bed"
    assert "score" in hits[0]


def test_search_ha_respects_top_k_default():
    tools = build_tools(_state())
    hits = tools["search_ha"]("anything")  # top_k None -> settings.top_k_default
    assert len(hits) <= 10


def test_list_records_and_kinds_tools():
    tools = build_tools(_state())
    assert {r["id"] for r in tools["list_records"]("entity")} == {"entity:light.bed"}
    kinds = {k["kind"]: k["count"] for k in tools["list_kinds"]()}
    assert kinds == {"entity": 1, "scene": 1}


def test_get_record_tool():
    tools = build_tools(_state())
    assert tools["get_record"]("scene:scene.movie", "scene")["area"] == "Living"
    assert "error" in tools["get_record"]("nope", "entity")


def test_health_payload_states():
    state = _state()
    p = health_payload(state)
    assert p["indexed"] == 2
    assert p["model"] == "bge"
    assert p["status"] in ("ok", "warming")
    # empty index, no refresh -> warming
    empty = AppState(settings=_settings(), index=VectorIndex(FakeEmbedder(dim=8)),
                     refresher=state.refresher)
    assert health_payload(empty)["status"] == "warming"


async def _asgi_status(mw, headers, path="/mcp"):
    """Drive the ASGI middleware and capture the response status."""
    scope = {"type": "http", "path": path, "method": "POST",
             "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()]}
    sent = []

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(msg):
        sent.append(msg)

    await mw(scope, receive, send)
    start = next((m for m in sent if m["type"] == "http.response.start"), None)
    return start["status"] if start else None


async def test_bearer_middleware_open_when_no_token():
    inner_called = {"v": False}

    async def inner(scope, receive, send):
        inner_called["v"] = True
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="").settings)
    # No token: everything is open, including /mcp and playground paths.
    assert await _asgi_status(mw, {}, path="/mcp") == 200
    assert await _asgi_status(mw, {}, path="/playground/tools") == 200
    assert await _asgi_status(mw, {}, path="/") == 200
    assert inner_called["v"] is True


async def test_bearer_middleware_mcp_gated_when_token_set():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}, path="/mcp") == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer wrong"}, path="/mcp") == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer secret"}, path="/mcp") == 200


async def test_bearer_middleware_health_always_open():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}, path="/health") == 200
    assert await _asgi_status(mw, {}, path="/health/") == 200


async def test_bearer_middleware_playground_ingress_guarded_when_token_set():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    # Non-/mcp, non-/health paths require the HA ingress header; no bearer needed.
    assert await _asgi_status(mw, {}, path="/playground/tools") == 404
    assert await _asgi_status(mw, {}, path="/") == 404
    assert await _asgi_status(
        mw, {"X-Ingress-Path": "/api/hassio_ingress/abc"}, path="/playground/tools"
    ) == 200
    assert await _asgi_status(
        mw, {"X-Ingress-Path": "/api/hassio_ingress/abc"}, path="/"
    ) == 200


# ---------------------------------------------------------------------------
# Integration tests — assembled app driven through real ASGI stack
# ---------------------------------------------------------------------------

_MCP_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
}


async def _noop_fetch(settings, connect):
    """Stand-in for ha_source.fetch_all: returns empty records with no errors."""
    return [], []


def _assembled_app(tmp_path, api_token=""):
    """Build the fully assembled Starlette app (real factory pipeline)."""
    state = build_state(
        _settings(api_token=api_token),
        embedder=FakeEmbedder(dim=8),
        connect=lambda u: None,
        persist_dir=tmp_path,
    )
    # Patch the refresher to use a no-op fetch so run_loop won't error.
    state.refresher._fetch = _noop_fetch
    state.index.upsert([
        IndexRecord(id="entity:light.bed", kind="entity",
                    text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
    ])
    return build_app(state)


async def test_assembled_app_health_and_mcp_route(tmp_path):
    """Assembled app: GET /health → 200 with expected payload; POST /mcp → not 404;
    tools/list returns all 8 tool names; lifespan starts and stops cleanly."""
    app = _assembled_app(tmp_path)
    transport = httpx.ASGITransport(app=app)

    # Use localhost:8000 — FastMCP's DNS-rebinding allow-list includes "localhost:*".
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=transport, base_url="http://localhost:8000") as client:
            # 1. GET /health → 200 with required status fields.
            r = await client.get("/health")
            assert r.status_code == 200
            body = r.json()
            assert "status" in body
            assert "indexed" in body
            assert "model" in body

            # 2. POST /mcp (initialize) → route is MOUNTED (not 404).
            init_payload = json.dumps({
                "jsonrpc": "2.0", "id": 1, "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "test", "version": "0.1"},
                },
            }).encode()
            r2 = await client.post("/mcp", content=init_payload, headers=_MCP_HEADERS)
            assert r2.status_code != 404, f"/mcp returned 404 — mount is missing from assembled app"

            # 3. POST /mcp (tools/list) → all 8 tool names present.
            tools_payload = json.dumps(
                {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
            ).encode()
            r3 = await client.post("/mcp", content=tools_payload, headers=_MCP_HEADERS)
            assert r3.status_code == 200
            names = {t["name"] for t in r3.json().get("result", {}).get("tools", [])}
            expected = {
                "search_ha", "list_records", "list_kinds", "get_record",
                "get_automation_trace", "get_logbook", "get_history", "refresh",
            }
            assert names == expected


async def test_assembled_app_auth_gate(tmp_path):
    """Assembled app with api_token set: GET /health open; POST /mcp without token → 401."""
    app = _assembled_app(tmp_path, api_token="s3cr3t")
    transport = httpx.ASGITransport(app=app)

    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=transport, base_url="http://localhost:8000") as client:
            # /health stays open even when api_token is configured.
            r = await client.get("/health")
            assert r.status_code == 200

            # POST /mcp with no Authorization → auth gate returns 401.
            init_payload = json.dumps({
                "jsonrpc": "2.0", "id": 1, "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "test", "version": "0.1"},
                },
            }).encode()
            r2 = await client.post("/mcp", content=init_payload,
                                   headers={k: v for k, v in _MCP_HEADERS.items()
                                            if k != "Authorization"})
            assert r2.status_code == 401


async def test_mcp_accepts_internal_addon_host(tmp_path):
    """POST /mcp with Host: local-terminus-rag:9000 must NOT be rejected with 421.

    FastMCP's DNS-rebinding protection by default only allows localhost/127.0.0.1/[::1].
    When the add-on hostname is not allow-listed the MCP transport returns 421
    Misdirected Request and every tool call from Terminus fails. After the fix the
    internal hostname must be accepted (200/400/406 all prove the host passed the
    security check; 421 means it was still rejected).
    """
    app = _assembled_app(tmp_path)
    transport = httpx.ASGITransport(app=app)

    tools_payload = json.dumps(
        {"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}
    ).encode()

    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://local-terminus-rag:9000",
        ) as client:
            r = await client.post(
                "/mcp",
                content=tools_payload,
                headers={**_MCP_HEADERS, "Host": "local-terminus-rag:9000"},
            )
            assert r.status_code != 421, (
                f"MCP transport rejected Host: local-terminus-rag:9000 with 421 — "
                f"add the host to FastMCP transport_security allowed_hosts"
            )
