import json

import httpx

from app import tools
from app.tools import fetch_basic_info, ha_basic_info

CONFIG = {
    "version": "2026.5.4",
    "location_name": "Home",
    "time_zone": "America/Costa_Rica",
    "country": "CR",
    "currency": "USD",
    "unit_system": {"temperature": "°C", "length": "km"},
}
STATES = [
    {"entity_id": "light.kitchen"},
    {"entity_id": "light.living"},
    {"entity_id": "sensor.temp"},
]


def _mock_transport():
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path.endswith("/api/config"):
            return httpx.Response(200, json=CONFIG)
        if request.url.path.endswith("/api/states"):
            return httpx.Response(200, json=STATES)
        return httpx.Response(404)

    return httpx.MockTransport(handler)


def test_fetch_basic_info_summarises_config_and_states():
    info = fetch_basic_info(
        "http://supervisor/core", "token", transport=_mock_transport()
    )
    assert info["version"] == "2026.5.4"
    assert info["location_name"] == "Home"
    assert info["entity_count"] == 3
    assert info["entities_by_domain"] == {"light": 2, "sensor": 1}


def test_tool_has_name_and_description():
    assert ha_basic_info.name == "ha_basic_info"
    assert "Home Assistant" in ha_basic_info.description


def test_tool_returns_json_payload(monkeypatch):
    from app.config import Settings

    monkeypatch.setattr(
        tools,
        "load_settings",
        lambda: Settings(
            ws_url="wss://hass.local:8123/api/websocket",
            ha_token="llt",
            anthropic_api_key="k",
            model="claude-sonnet-4-6",
            use_supervisor=False,
        ),
    )
    monkeypatch.setattr(
        tools, "fetch_basic_info", lambda base, token: {"version": "2026.5.4"}
    )
    payload = json.loads(ha_basic_info.invoke({}))
    assert payload == {"version": "2026.5.4"}


def test_tool_reports_when_unconfigured(monkeypatch):
    from app.config import Settings

    monkeypatch.setattr(
        tools,
        "load_settings",
        lambda: Settings(
            ws_url="",
            ha_token=None,
            anthropic_api_key="",
            model="claude-sonnet-4-6",
            use_supervisor=False,
        ),
    )
    payload = json.loads(ha_basic_info.invoke({}))
    assert "not configured" in payload["error"]
