import asyncio
import json

import pytest

from app.config import Settings
from app import ha_source
from app.ha_source import (
    build_area_records,
    build_blueprint_records,
    build_device_records,
    build_entity_records,
    build_label_records,
    build_scene_script_automation_records,
    fetch_all,
)


def _settings():
    return Settings(
        ws_url="ws://x", ha_token="tok", use_supervisor=False, api_token="",
        refresh_interval=600, embed_model="m", top_k_default=10, log_level="info",
    )


AREAS = [{"area_id": "mb", "name": "Master Bedroom", "labels": ["sleep"]}]
LABELS = [{"label_id": "sleep", "name": "Sleep", "color": "blue"}]
DEVICES = [{"id": "dev1", "name": "MB Strip", "manufacturer": "Acme",
            "model": "S1", "area_id": "mb"}]
ENTITIES = [
    {"entity_id": "light.mb_led", "area_id": None, "device_id": "dev1",
     "name": None, "original_name": "Led One", "aliases": ["bedside"]},
    {"entity_id": "timer.tea", "area_id": "mb", "device_id": None,
     "name": "Tea Timer", "original_name": None, "aliases": []},
]
STATES = [
    {"entity_id": "light.mb_led", "attributes": {"friendly_name": "MB LED One"}},
    {"entity_id": "timer.tea", "attributes": {"friendly_name": "Tea Timer"}},
    {"entity_id": "scene.movie",
     "attributes": {"friendly_name": "Movie", "entity_id": ["light.mb_led"]}},
    {"entity_id": "script.bedtime", "attributes": {"friendly_name": "Bedtime"}},
    {"entity_id": "automation.night",
     "attributes": {"friendly_name": "Night", "id": "1699"}},
]
BLUEPRINTS = {
    "automation": {
        "motion/light.yaml": {"metadata": {"name": "Motion Light",
                                           "source_url": "http://x"}},
    },
    "script": {},
}


def test_area_records():
    recs = build_area_records(AREAS)
    assert recs[0].id == "area:mb"
    assert recs[0].kind == "area"
    assert recs[0].metadata["name"] == "Master Bedroom"
    assert "Master Bedroom" in recs[0].text


def test_label_records():
    recs = build_label_records(LABELS)
    assert recs[0].id == "label:sleep"
    assert recs[0].metadata["color"] == "blue"


def test_device_records():
    recs = build_device_records(DEVICES)
    assert recs[0].id == "device:dev1"
    assert recs[0].metadata["manufacturer"] == "Acme"
    assert "MB Strip" in recs[0].text


def test_entity_records_area_fallback_and_helper_tagging():
    recs = build_entity_records(ENTITIES, STATES, AREAS, DEVICES)
    by_id = {r.id: r for r in recs}
    led = by_id["entity:light.mb_led"]
    assert led.kind == "entity"
    # area resolved via device dev1 -> mb -> "Master Bedroom"
    assert led.metadata["area_name"] == "Master Bedroom"
    assert led.metadata["device_name"] == "MB Strip"
    assert "bedside" in led.text  # alias embedded
    timer = by_id["helper:timer.tea"]
    assert timer.kind == "helper"
    assert timer.metadata["domain"] == "timer"


def test_scene_script_automation_records():
    recs = build_scene_script_automation_records(STATES)
    by_id = {r.id: r for r in recs}
    assert by_id["scene:scene.movie"].metadata["entities"] == ["light.mb_led"]
    assert by_id["automation:automation.night"].metadata["numeric_id"] == "1699"
    assert by_id["script:script.bedtime"].kind == "script"
    # entities/timers are NOT produced here (handled by build_entity_records)
    assert "entity:light.mb_led" not in by_id


def test_blueprint_records():
    recs = build_blueprint_records(BLUEPRINTS)
    assert recs[0].id == "blueprint:automation:motion/light.yaml"
    assert recs[0].metadata["domain"] == "automation"
    assert recs[0].metadata["source_url"] == "http://x"


class FakeWS:
    def __init__(self, results):
        # results: dict mapping command "type" -> result payload
        self._results = results
        self._queue = [json.dumps({"type": "auth_required"})]
        self._pending_id = None

    async def send(self, data):
        msg = json.loads(data)
        if msg.get("type") == "auth":
            self._queue.append(json.dumps({"type": "auth_ok"}))
            return
        result = self._results.get(msg["type"], [])
        self._queue.append(json.dumps({"id": msg["id"], "success": True, "result": result}))

    async def recv(self):
        return self._queue.pop(0)


def _fake_connect(ws):
    class _CM:
        async def __aenter__(self):
            return ws

        async def __aexit__(self, *exc):
            return False

    return lambda url: _CM()


async def test_fetch_all_assembles_all_kinds():
    ws = FakeWS({
        "config/area_registry/list": AREAS,
        "config/label_registry/list": LABELS,
        "config/device_registry/list": DEVICES,
        "config/entity_registry/list": ENTITIES,
        "get_states": STATES,
        "blueprint/list": BLUEPRINTS,
    })
    records, errors = await fetch_all(_settings(), _fake_connect(ws))
    assert errors == []
    kinds = {r.kind for r in records}
    assert kinds == {"area", "label", "device", "entity", "helper",
                     "scene", "script", "automation", "blueprint"}


class HangingWS:
    """A websocket whose recv() hangs forever — simulates a wedged Core."""

    async def recv(self):
        await asyncio.Future()  # never resolves

    async def send(self, data):
        pass  # no-op


async def test_authenticate_times_out(monkeypatch):
    monkeypatch.setattr(ha_source, "_COMMAND_TIMEOUT", 0.05)
    from app.ha_source import _authenticate, HASourceError
    ws = HangingWS()
    with pytest.raises(HASourceError, match="timed out"):
        await _authenticate(ws, "token")


async def test_command_times_out(monkeypatch):
    monkeypatch.setattr(ha_source, "_COMMAND_TIMEOUT", 0.05)
    from app.ha_source import _command, HASourceError
    ws = HangingWS()
    with pytest.raises(HASourceError, match="timed out"):
        await _command(ws, 1, {"type": "config/area_registry/list"})
