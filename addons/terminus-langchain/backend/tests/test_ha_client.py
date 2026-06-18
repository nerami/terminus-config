import json

import pytest

from app.ha_client import HAAuthError, HAClient, HAStatus, extract_basic_info


class FakeWS:
    """A minimal stand-in for a websockets client connection."""

    def __init__(self, incoming):
        # incoming: list of dict messages the server "sends" to the client.
        self._incoming = [json.dumps(m) for m in incoming]
        self.sent = []

    async def send(self, data):
        self.sent.append(json.loads(data))

    async def recv(self):
        if not self._incoming:
            raise ConnectionError("socket closed")
        return self._incoming.pop(0)


def fake_connect(ws):
    class _CM:
        async def __aenter__(self):
            return ws

        async def __aexit__(self, *exc):
            return False

    def _connect(url):
        return _CM()

    return _connect


GET_CONFIG_RESULT = {
    "version": "2026.5.4",
    "location_name": "Home",
    "time_zone": "America/Costa_Rica",
    "country": "CR",
    "currency": "USD",
    "unit_system": {"temperature": "°C", "length": "km"},
}

STATES_RESULT = [
    {"entity_id": "light.kitchen"},
    {"entity_id": "light.living"},
    {"entity_id": "sensor.temp"},
    {"entity_id": "binary_sensor.door"},
]


def test_extract_basic_info_counts_domains():
    info = extract_basic_info(GET_CONFIG_RESULT, STATES_RESULT)
    assert info["version"] == "2026.5.4"
    assert info["location_name"] == "Home"
    assert info["unit_system"]["temperature"] == "°C"
    assert info["entity_count"] == 4
    assert info["entities_by_domain"] == {
        "binary_sensor": 1,
        "light": 2,
        "sensor": 1,
    }


async def test_authenticate_success_records_version():
    ws = FakeWS(
        [
            {"type": "auth_required", "ha_version": "2026.5.4"},
            {"type": "auth_ok", "ha_version": "2026.5.4"},
        ]
    )
    client = HAClient("ws://x", "token", fake_connect(ws))
    await client._authenticate(ws)
    assert client._ha_version == "2026.5.4"
    assert ws.sent == [{"type": "auth", "access_token": "token"}]


async def test_authenticate_invalid_raises():
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_invalid", "message": "bad token"},
        ]
    )
    client = HAClient("ws://x", "token", fake_connect(ws))
    with pytest.raises(HAAuthError):
        await client._authenticate(ws)


async def test_refresh_populates_basic_info():
    ws = FakeWS(
        [
            {"id": 1, "type": "result", "success": True, "result": GET_CONFIG_RESULT},
            {"id": 2, "type": "result", "success": True, "result": STATES_RESULT},
        ]
    )
    client = HAClient("ws://x", "token", fake_connect(ws))
    await client._refresh(ws)
    info = client.get_basic_info()
    assert info["version"] == "2026.5.4"
    assert info["entity_count"] == 4
    # get_config then get_states, with incrementing ids
    assert [m["type"] for m in ws.sent] == ["get_config", "get_states"]
    assert [m["id"] for m in ws.sent] == [1, 2]


async def test_session_reaches_connected_then_stops():
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok", "ha_version": "2026.5.4"},
            {"id": 1, "type": "result", "success": True, "result": GET_CONFIG_RESULT},
            {"id": 2, "type": "result", "success": True, "result": STATES_RESULT},
        ]
    )
    client = HAClient("ws://x", "token", fake_connect(ws), refresh_interval=0.01)
    # Stop right away so the keepalive loop exits after the first refresh.
    client.stop()
    await client._session()
    status = client.get_status()
    assert status["status"] == HAStatus.connected.value
    assert status["ha_version"] == "2026.5.4"
    assert status["last_connected"] is not None
    assert status["error"] is None


def test_status_shape_before_connect():
    client = HAClient("ws://x", "token", fake_connect(FakeWS([])))
    status = client.get_status()
    assert status == {
        "status": "disconnected",
        "ha_version": None,
        "last_connected": None,
        "error": None,
        "url": "ws://x",
    }
