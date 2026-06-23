import json
import logging

import httpx

from app import tools
from app.tools import (
    call_service,
    control_entity,
    fetch_basic_info,
    fetch_entity_state,
    get_entity_state,
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


def test_run_scene_handles_decode_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise json.JSONDecodeError("bad", "", 0)

    monkeypatch.setattr(tools, "call_service", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(run_scene.invoke({"scene_id": "scene.evening"}))
    assert "error" in payload
    assert any("run_scene" in r.message for r in caplog.records)


def test_trigger_automation_handles_invalid_url(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise httpx.InvalidURL("bad url")

    monkeypatch.setattr(tools, "call_service", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(
            trigger_automation.invoke({"automation_id": "automation.night"})
        )
    assert "error" in payload
    assert any("trigger_automation" in r.message for r in caplog.records)


def test_ha_basic_info_handles_decode_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise json.JSONDecodeError("bad", "", 0)

    monkeypatch.setattr(tools, "fetch_basic_info", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(ha_basic_info.invoke({}))
    assert "error" in payload
    assert any("ha_basic_info" in r.message for r in caplog.records)


# -- control_entity -------------------------------------------------------


def _control_capture(monkeypatch):
    """Patch settings + call_service to capture a control_entity service call."""
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    captured: dict = {}
    monkeypatch.setattr(
        tools,
        "call_service",
        lambda base, token, domain, service, data: captured.update(
            domain=domain, service=service, data=data
        ),
    )
    return captured


def test_control_entity_on_calls_turn_on(monkeypatch):
    captured = _control_capture(monkeypatch)
    payload = json.loads(
        control_entity.invoke({"entity_id": "switch.mb_lamp", "action": "on"})
    )
    assert payload["success"] is True
    assert payload["entity_id"] == "switch.mb_lamp"
    assert payload["action"] == "on"
    assert captured == {
        "domain": "homeassistant",
        "service": "turn_on",
        "data": {"entity_id": "switch.mb_lamp"},
    }


def test_control_entity_off_calls_turn_off(monkeypatch):
    captured = _control_capture(monkeypatch)
    payload = json.loads(
        control_entity.invoke({"entity_id": "light.kitchen", "action": "off"})
    )
    assert payload["success"] is True
    assert payload["entity_id"] == "light.kitchen"
    assert payload["action"] == "off"
    assert captured["service"] == "turn_off"
    assert captured["domain"] == "homeassistant"
    assert captured["data"] == {"entity_id": "light.kitchen"}


def test_control_entity_toggle_calls_toggle(monkeypatch):
    captured = _control_capture(monkeypatch)
    payload = json.loads(
        control_entity.invoke({"entity_id": "fan.office", "action": "toggle"})
    )
    assert payload["success"] is True
    assert payload["entity_id"] == "fan.office"
    assert payload["action"] == "toggle"
    assert captured["service"] == "toggle"
    assert captured["domain"] == "homeassistant"


def test_control_entity_allows_each_supported_domain(monkeypatch):
    for domain in ("light", "switch", "fan", "media_player", "cover", "climate"):
        captured = _control_capture(monkeypatch)
        payload = json.loads(
            control_entity.invoke({"entity_id": f"{domain}.thing", "action": "on"})
        )
        assert payload.get("success") is True, domain
        assert captured["data"] == {"entity_id": f"{domain}.thing"}


def test_control_entity_rejects_disallowed_domain(monkeypatch):
    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True)
    )
    for entity_id in ("lock.front_door", "automation.night", "scene.evening"):
        payload = json.loads(
            control_entity.invoke({"entity_id": entity_id, "action": "on"})
        )
        assert "error" in payload, entity_id
    assert called["ran"] is False


def test_control_entity_rejects_bad_entity_id(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    payload = json.loads(
        control_entity.invoke({"entity_id": "kitchenlamp", "action": "on"})
    )
    assert "error" in payload


def test_control_entity_rejects_invalid_action(monkeypatch):
    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True)
    )
    payload = json.loads(
        control_entity.invoke({"entity_id": "light.kitchen", "action": "dim"})
    )
    assert "error" in payload
    assert called["ran"] is False


def test_control_entity_reports_when_unconfigured(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _unconfigured_settings)
    payload = json.loads(
        control_entity.invoke({"entity_id": "light.kitchen", "action": "on"})
    )
    assert "not configured" in payload["error"]


def test_control_entity_handles_http_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise httpx.ConnectError("nope")

    monkeypatch.setattr(tools, "call_service", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(
            control_entity.invoke({"entity_id": "light.kitchen", "action": "on"})
        )
    assert "unreachable" in payload["error"].lower()
    assert any("control_entity" in r.message for r in caplog.records)


def test_control_entity_has_name_and_description():
    assert control_entity.name == "control_entity"
    assert "on" in control_entity.description.lower()


# -- get_entity_state -----------------------------------------------------


def _state_transport(expected_path: str, body: dict, captured: dict):
    """A MockTransport asserting a GET to ``expected_path`` and returning body."""

    def handler(request: httpx.Request) -> httpx.Response:
        captured["method"] = request.method
        captured["path"] = request.url.path
        if request.method == "GET" and request.url.path.endswith(expected_path):
            return httpx.Response(200, json=body)
        return httpx.Response(404)

    return httpx.MockTransport(handler)


STATE = {
    "entity_id": "switch.mb_lamp",
    "state": "off",
    "attributes": {"friendly_name": "MB: Lamp"},
}


def test_fetch_entity_state_gets_single_state():
    captured: dict = {}
    result = fetch_entity_state(
        "http://supervisor/core",
        "token",
        "switch.mb_lamp",
        transport=_state_transport(
            "/api/states/switch.mb_lamp", STATE, captured
        ),
    )
    assert captured["method"] == "GET"
    assert captured["path"].endswith("/api/states/switch.mb_lamp")
    assert result == STATE


def test_get_entity_state_returns_state(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    monkeypatch.setattr(
        tools, "fetch_entity_state", lambda base, token, entity_id: STATE
    )
    payload = json.loads(
        get_entity_state.invoke({"entity_id": "switch.mb_lamp"})
    )
    assert payload == STATE


def test_get_entity_state_rejects_bad_entity_id(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)
    payload = json.loads(get_entity_state.invoke({"entity_id": "mblamp"}))
    assert "error" in payload


def test_get_entity_state_reports_when_unconfigured(monkeypatch):
    monkeypatch.setattr(tools, "load_settings", _unconfigured_settings)
    payload = json.loads(
        get_entity_state.invoke({"entity_id": "switch.mb_lamp"})
    )
    assert "not configured" in payload["error"]


def test_get_entity_state_handles_http_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise httpx.ConnectError("nope")

    monkeypatch.setattr(tools, "fetch_entity_state", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(
            get_entity_state.invoke({"entity_id": "switch.mb_lamp"})
        )
    assert "unreachable" in payload["error"].lower()
    assert any("get_entity_state" in r.message for r in caplog.records)


def test_get_entity_state_has_name_and_description():
    assert get_entity_state.name == "get_entity_state"
    assert "state" in get_entity_state.description.lower()
