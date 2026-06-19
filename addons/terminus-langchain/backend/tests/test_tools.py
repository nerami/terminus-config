import json

import httpx

from app import tools
from app.tools import (
    call_service,
    fetch_basic_info,
    ha_basic_info,
    run_scene,
    trigger_automation,
)


def _dev_settings():
    from app.config import Settings

    return Settings(
        ws_url="wss://hass.local:8123/api/websocket",
        ha_token="llt",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


def _unconfigured_settings():
    from app.config import Settings

    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )

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
    monkeypatch.setattr(tools, "load_settings", _unconfigured_settings)
    payload = json.loads(ha_basic_info.invoke({}))
    assert "not configured" in payload["error"]


# -- run_scene / trigger_automation ---------------------------------------


def _service_transport(expected_path: str, captured: dict):
    """A MockTransport asserting a POST to ``expected_path`` and capturing body."""

    def handler(request: httpx.Request) -> httpx.Response:
        captured["method"] = request.method
        captured["path"] = request.url.path
        captured["json"] = json.loads(request.content or b"{}")
        if request.method == "POST" and request.url.path.endswith(expected_path):
            return httpx.Response(200, json=[])
        return httpx.Response(404)

    return httpx.MockTransport(handler)


def test_call_service_posts_to_home_assistant():
    captured: dict = {}
    call_service(
        "http://supervisor/core",
        "token",
        "scene",
        "turn_on",
        {"entity_id": "scene.evening"},
        transport=_service_transport("/api/services/scene/turn_on", captured),
    )
    assert captured["method"] == "POST"
    assert captured["path"].endswith("/api/services/scene/turn_on")
    assert captured["json"] == {"entity_id": "scene.evening"}


def test_run_scene_calls_turn_on(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    captured: dict = {}
    monkeypatch.setattr(
        tools,
        "call_service",
        lambda base, token, domain, service, data: captured.update(
            domain=domain, service=service, data=data
        ),
    )
    payload = json.loads(run_scene.invoke({"scene_id": "scene.evening"}))
    assert payload["success"] is True
    assert payload["scene"] == "scene.evening"
    assert captured == {
        "domain": "scene",
        "service": "turn_on",
        "data": {"entity_id": "scene.evening"},
    }


def test_trigger_automation_calls_trigger(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    captured: dict = {}
    monkeypatch.setattr(
        tools,
        "call_service",
        lambda base, token, domain, service, data: captured.update(
            domain=domain, service=service, data=data
        ),
    )
    payload = json.loads(
        trigger_automation.invoke({"automation_id": "automation.night"})
    )
    assert payload["success"] is True
    assert payload["automation"] == "automation.night"
    assert captured == {
        "domain": "automation",
        "service": "trigger",
        "data": {"entity_id": "automation.night"},
    }


def test_run_tools_have_name_and_description():
    assert run_scene.name == "run_scene"
    assert "scene" in run_scene.description.lower()
    assert trigger_automation.name == "trigger_automation"
    assert "automation" in trigger_automation.description.lower()


def test_run_scene_validates_entity_domain(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    payload = json.loads(run_scene.invoke({"scene_id": "light.kitchen"}))
    assert "error" in payload


def test_trigger_automation_validates_entity_domain(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    payload = json.loads(trigger_automation.invoke({"automation_id": "scene.x"}))
    assert "error" in payload


def test_run_scene_reports_when_unconfigured(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _unconfigured_settings)
    payload = json.loads(run_scene.invoke({"scene_id": "scene.evening"}))
    assert "not configured" in payload["error"]


def test_run_scene_handles_http_error(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise httpx.ConnectError("nope")

    monkeypatch.setattr(tools, "call_service", boom)
    payload = json.loads(run_scene.invoke({"scene_id": "scene.evening"}))
    assert "unreachable" in payload["error"].lower()
