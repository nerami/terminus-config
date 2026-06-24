import httpx
import pytest
from starlette.applications import Starlette

from app.config import Settings
from app.embedder import FakeEmbedder
from app.index import VectorIndex
from app.mcp_app import AppState, build_app
from app.main import build_state
from app.playground import build_playground_routes
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
        IndexRecord(id="entity:light.bed", kind="entity", text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
        IndexRecord(id="scene:scene.movie", kind="scene", text="Movie Night | scene",
                    metadata={"name": "Movie Night", "area": "Living"}),
    ])
    settings = _settings(api_token)
    refresher = Refresher(idx, settings, connect=lambda u: None, fetch=None)
    return AppState(settings=settings, index=idx, refresher=refresher)


class _FakeTool:
    def __init__(self, name, description, schema):
        self.name = name
        self.description = description
        self.inputSchema = schema


class _FakeMcp:
    async def list_tools(self):
        return [
            _FakeTool("list_kinds", "Kinds and counts", {"type": "object", "properties": {}}),
            _FakeTool("search_ha", "Semantic search", {
                "type": "object",
                "properties": {"query": {"type": "string"}, "top_k": {"type": "integer"}},
                "required": ["query"],
            }),
        ]


def _app(state):
    return Starlette(routes=build_playground_routes(state, _FakeMcp()))


async def _client(app):
    return httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                             base_url="http://localhost")


async def test_tools_endpoint_returns_name_description_schema():
    async with await _client(_app(_state())) as c:
        r = await c.get("/playground/tools")
    assert r.status_code == 200
    tools = {t["name"]: t for t in r.json()["tools"]}
    assert tools["search_ha"]["description"] == "Semantic search"
    assert tools["search_ha"]["inputSchema"]["properties"]["query"]["type"] == "string"


async def test_call_dispatches_sync_tool():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    kinds = {k["kind"]: k["count"] for k in r.json()["result"]}
    assert kinds == {"entity": 1, "scene": 1}


async def test_call_dispatches_async_tool():
    state = _state()

    async def _fake_refresh():
        return {"added": 0, "changed": 0, "removed": 0, "total": 2, "took_ms": 1}

    state.refresher.refresh_once = _fake_refresh
    async with await _client(_app(state)) as c:
        r = await c.post("/playground/call", json={"tool": "refresh", "args": {}})
    assert r.status_code == 200
    assert r.json()["result"]["total"] == 2


async def test_call_passes_args():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call",
                         json={"tool": "search_ha", "args": {"query": "Bedroom Lamp | light"}})
    assert r.status_code == 200
    assert r.json()["result"][0]["id"] == "entity:light.bed"


async def test_call_unknown_tool_is_400():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call", json={"tool": "nope", "args": {}})
    assert r.status_code == 400
    assert "error" in r.json()


async def test_call_tool_error_is_200_with_error_field():
    state = _state()

    def _boom():
        raise RuntimeError("kaboom")

    # Replace list_kinds callable via the index to force an error path.
    state.index.list_kinds = _boom
    async with await _client(_app(state)) as c:
        r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    assert "kaboom" in r.json()["error"]


async def _assembled(tmp_path, api_token=""):
    state = build_state(_settings(api_token=api_token), embedder=FakeEmbedder(dim=8),
                        connect=lambda u: None, persist_dir=tmp_path)
    async def _noop_fetch(settings, connect):
        return [], []
    state.refresher._fetch = _noop_fetch
    state.index.upsert([
        IndexRecord(id="entity:light.bed", kind="entity", text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
    ])
    return build_app(state)


async def test_assembled_playground_tools_lists_all_eight(tmp_path):
    app = await _assembled(tmp_path)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            r = await c.get("/playground/tools")
    assert r.status_code == 200
    names = {t["name"] for t in r.json()["tools"]}
    assert names == {"search_ha", "list_records", "list_kinds", "get_record",
                     "get_automation_trace", "get_logbook", "get_history", "refresh"}


async def test_assembled_playground_call_runs_index_tool(tmp_path):
    app = await _assembled(tmp_path)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    assert r.json()["result"][0]["kind"] == "entity"


async def test_assembled_playground_ingress_guarded_with_token(tmp_path):
    app = await _assembled(tmp_path, api_token="s3cr3t")
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            blocked = await c.get("/playground/tools")
            allowed = await c.get("/playground/tools",
                                  headers={"X-Ingress-Path": "/api/hassio_ingress/abc"})
    assert blocked.status_code == 404
    assert allowed.status_code == 200
