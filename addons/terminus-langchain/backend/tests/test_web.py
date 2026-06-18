import asyncio

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
