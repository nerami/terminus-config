import asyncio
import json

import httpx
from fastapi.testclient import TestClient

from app.config import Settings
from app.web import create_app


class StubHA:
    def __init__(self, status):
        self._status = status
        self.stopped = False
        self.started = False

    async def run_forever(self):
        self.started = True
        while not self.stopped:
            await asyncio.sleep(0.01)

    def stop(self):
        self.stopped = True

    def get_status(self):
        return self._status

    def get_basic_info(self):
        return None


def _settings(ws_url=""):
    return Settings(
        ws_url=ws_url,
        ha_token="t",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


def test_ha_status_returns_client_status():
    status = {
        "status": "connected",
        "ha_version": "2026.5.4",
        "last_connected": "2026-06-18T00:00:00+00:00",
        "error": None,
        "url": "ws://supervisor/core/websocket",
    }
    stub = StubHA(status)
    app = create_app(settings=_settings("ws://x"), client=stub)
    with TestClient(app) as tc:
        resp = tc.get("/ha/status")
        assert resp.status_code == 200
        assert resp.json() == status
    assert stub.started is True
    assert stub.stopped is True


def test_ha_status_not_configured_when_no_client():
    app = create_app(settings=_settings(""), client=None)
    with TestClient(app) as tc:
        resp = tc.get("/ha/status")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "disconnected"
        assert "not configured" in body["error"]


class _FakeWS:
    def __init__(self, incoming):
        self._incoming = [json.dumps(m) for m in incoming]

    async def send(self, data):  # noqa: D401 - test stub
        pass

    async def recv(self):
        if not self._incoming:
            raise ConnectionError("closed")
        return self._incoming.pop(0)


def _fake_connect(incoming):
    def _connect(url):
        ws = _FakeWS(list(incoming))

        class _CM:
            async def __aenter__(self):
                return ws

            async def __aexit__(self, *exc):
                return False

        return _CM()

    return _connect


def test_topology_not_configured_without_ws_url():
    app = create_app(settings=_settings(""), client=None)
    with TestClient(app) as tc:
        resp = tc.get("/ha/topology")
        assert resp.status_code == 503
        assert "not configured" in resp.json()["error"]


def test_topology_returns_normalized_snapshot():
    incoming = [
        {"type": "auth_required"},
        {"type": "auth_ok"},
        {
            "id": 1,
            "type": "result",
            "success": True,
            "result": [{"area_id": "kitchen", "name": "Kitchen"}],
        },
        {"id": 2, "type": "result", "success": True, "result": []},
        {
            "id": 3,
            "type": "result",
            "success": True,
            "result": [{"entity_id": "light.kitchen", "area_id": "kitchen"}],
        },
        {
            "id": 4,
            "type": "result",
            "success": True,
            "result": [
                {"entity_id": "light.kitchen", "attributes": {"friendly_name": "K"}}
            ],
        },
    ]
    app = create_app(
        settings=_settings("ws://x"),
        client=StubHA({"status": "connected"}),
        registry_connect=_fake_connect(incoming),
    )
    with TestClient(app) as tc:
        resp = tc.get("/ha/topology")
        assert resp.status_code == 200
        body = resp.json()
        assert body["areas"][0]["area_id"] == "kitchen"
        assert body["entities"][0]["name"] == "K"


INDEX_BODY = "<!doctype html><html><body>INDEX</body></html>"
ASSET_BODY = 'console.log("app")'


def _make_dist(tmp_path):
    tmp_path.mkdir(parents=True, exist_ok=True)
    (tmp_path / "index.html").write_text(INDEX_BODY)
    assets = tmp_path / "assets"
    assets.mkdir()
    (assets / "app.js").write_text(ASSET_BODY)
    return tmp_path


def test_spa_serves_index_at_root(tmp_path):
    app = create_app(settings=_settings(""), client=None, static_dir=_make_dist(tmp_path))
    with TestClient(app) as tc:
        resp = tc.get("/")
        assert resp.status_code == 200
        assert resp.text == INDEX_BODY


def test_spa_serves_real_asset(tmp_path):
    app = create_app(settings=_settings(""), client=None, static_dir=_make_dist(tmp_path))
    with TestClient(app) as tc:
        resp = tc.get("/assets/app.js")
        assert resp.status_code == 200
        assert resp.text == ASSET_BODY
        assert resp.text != INDEX_BODY


def test_spa_fallback_for_deep_path(tmp_path):
    app = create_app(settings=_settings(""), client=None, static_dir=_make_dist(tmp_path))
    with TestClient(app) as tc:
        resp = tc.get("/some-thread-uuid")
        assert resp.status_code == 200
        assert resp.text == INDEX_BODY


def test_spa_does_not_shadow_ha_status(tmp_path):
    status = {
        "status": "connected",
        "ha_version": "2026.5.4",
        "last_connected": None,
        "error": None,
        "url": "ws://x",
    }
    app = create_app(
        settings=_settings("ws://x"),
        client=StubHA(status),
        static_dir=_make_dist(tmp_path),
    )
    with TestClient(app) as tc:
        resp = tc.get("/ha/status")
        assert resp.status_code == 200
        assert resp.json() == status


def test_spa_does_not_shadow_api_proxy(tmp_path):
    from starlette.applications import Starlette
    from starlette.responses import JSONResponse as StarletteJSON
    from starlette.routing import Route

    async def info(_request):
        return StarletteJSON({"ok": True})

    upstream = Starlette(routes=[Route("/info", info, methods=["GET"])])

    app = create_app(
        settings=_settings(""),
        client=None,
        static_dir=_make_dist(tmp_path),
        proxy_transport=httpx.ASGITransport(app=upstream),
    )
    with TestClient(app) as tc:
        resp = tc.get("/api/info")
        assert resp.status_code == 200
        assert resp.json() == {"ok": True}
        assert resp.text != INDEX_BODY


def test_spa_path_traversal_is_safe(tmp_path):
    secret = tmp_path / "secret.txt"
    secret.write_text("TOPSECRET")
    dist = _make_dist(tmp_path / "dist")
    app = create_app(settings=_settings(""), client=None, static_dir=dist)
    with TestClient(app) as tc:
        resp = tc.get("/..%2f..%2fetc%2fpasswd")
        assert resp.status_code in (200, 404)
        assert "root:" not in resp.text
        assert "TOPSECRET" not in resp.text
        if resp.status_code == 200:
            assert resp.text == INDEX_BODY

        resp2 = tc.get("/../secret.txt")
        assert "TOPSECRET" not in resp2.text


def test_automation_returns_config_and_refs():
    automation = {
        "id": "42",
        "alias": "Test",
        "action": [
            {"service": "light.turn_on", "target": {"entity_id": "light.lamp"}}
        ],
    }

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=automation)

    app = create_app(
        settings=_settings("ws://x"),
        client=StubHA({"status": "connected"}),
        ha_rest_transport=httpx.MockTransport(handler),
    )
    with TestClient(app) as tc:
        resp = tc.get("/ha/automation/42")
        assert resp.status_code == 200
        body = resp.json()
        assert body["config"]["alias"] == "Test"
        assert body["referenced"]["entities"] == ["light.lamp"]
