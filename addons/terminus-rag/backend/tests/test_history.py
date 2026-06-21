import json

import httpx

from app.config import Settings
from app.history import get_automation_trace, get_history, get_logbook


def _settings(supervisor=True):
    if supervisor:
        return Settings(
            ws_url="ws://supervisor/core/websocket", ha_token="super",
            use_supervisor=True, api_token="", refresh_interval=600,
            embed_model="m", top_k_default=10, log_level="info",
        )
    return Settings(
        ws_url="", ha_token=None, use_supervisor=False, api_token="",
        refresh_interval=600, embed_model="m", top_k_default=10, log_level="info",
    )


class FakeWS:
    def __init__(self, results):
        self._results = results
        self._queue = [json.dumps({"type": "auth_required"})]

    async def send(self, data):
        msg = json.loads(data)
        if msg.get("type") == "auth":
            self._queue.append(json.dumps({"type": "auth_ok"}))
            return
        result = self._results.get(msg["type"], [])
        self._queue.append(json.dumps({"id": msg["id"], "success": True, "result": result}))

    async def recv(self):
        return self._queue.pop(0)


def _connect(ws):
    class _CM:
        async def __aenter__(self):
            return ws

        async def __aexit__(self, *exc):
            return False

    return lambda url: _CM()


async def test_get_automation_trace_picks_newest():
    ws = FakeWS({
        "trace/list": [
            {"run_id": "old", "timestamp": {"start": "2026-06-20T00:00:00Z"}},
            {"run_id": "new", "timestamp": {"start": "2026-06-21T00:00:00Z"}},
        ],
        "trace/get": {"config": {"alias": "Night"}, "trace": {"x": 1}},
    })
    out = await get_automation_trace(
        _settings(), _connect(ws), "1699",
    )
    assert out["run_id"] == "new"
    assert out["config"]["alias"] == "Night"


async def test_get_automation_trace_no_traces():
    ws = FakeWS({"trace/list": []})
    out = await get_automation_trace(_settings(), _connect(ws), "1699")
    assert "error" in out


async def test_get_automation_trace_resolves_entity_id():
    ws = FakeWS({
        "trace/list": [{"run_id": "r1", "timestamp": {"start": "2026-06-21T00:00:00Z"}}],
        "trace/get": {"config": {}, "trace": {}},
    })
    out = await get_automation_trace(
        _settings(), _connect(ws), "automation.night",
        numeric_resolver=lambda eid: "1699",
    )
    assert out["run_id"] == "r1"


async def test_get_logbook_shapes_request():
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["url"] = str(request.url)
        return httpx.Response(200, json=[{"name": "Lamp", "state": "on"}])

    out = await get_logbook(
        _settings(), "2026-06-20T00:00:00Z", end="2026-06-21T00:00:00Z",
        entity_id="light.bed", transport=httpx.MockTransport(handler),
    )
    assert out["events"][0]["name"] == "Lamp"
    assert "logbook/2026-06-20T00:00:00Z" in captured["url"]
    assert "entity=light.bed" in captured["url"]
    assert "end_time=" in captured["url"]


async def test_get_history_shapes_request():
    def handler(request: httpx.Request) -> httpx.Response:
        assert "history/period/2026-06-20T00:00:00Z" in str(request.url)
        assert "filter_entity_id=light.bed" in str(request.url)
        return httpx.Response(200, json=[[{"state": "on"}]])

    out = await get_history(
        _settings(), "light.bed", "2026-06-20T00:00:00Z",
        transport=httpx.MockTransport(handler),
    )
    assert out["history"] == [[{"state": "on"}]]


async def test_get_history_unreachable_returns_error():
    out = await get_history(
        _settings(supervisor=False), "light.bed", "2026-06-20T00:00:00Z",
    )
    assert "error" in out  # no connection configured


async def test_get_logbook_ha_failure_returns_error():
    """get_logbook must return {"error": ...} on HA failure, not raise."""
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500, text="Internal Server Error")

    out = await get_logbook(
        _settings(), "2026-06-20T00:00:00Z",
        transport=httpx.MockTransport(handler),
    )
    assert "error" in out
