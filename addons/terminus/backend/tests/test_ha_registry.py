import asyncio
import json
import logging
import time

import httpx
import pytest

from app import ha_registry
from app.config import Settings
from app.ha_registry import (
    HARegistryError,
    _command,
    build_topology,
    fetch_automation,
    fetch_topology,
    referenced_ids,
)


class FakeWS:
    """Minimal stand-in for a websockets client connection."""

    def __init__(self, incoming):
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


def _settings(ws_url="ws://x"):
    return Settings(
        ws_url=ws_url,
        ha_token="token",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


AREAS = [
    {"area_id": "kitchen", "name": "Kitchen"},
    {"area_id": "living", "name": "Living Room"},
]
DEVICES = [
    {"id": "dev1", "name": "Hue Bridge", "area_id": "living"},
]
ENTITIES = [
    {"entity_id": "light.kitchen", "area_id": "kitchen", "device_id": None},
    # area resolved through the device, not the entity
    {"entity_id": "light.lamp", "area_id": None, "device_id": "dev1"},
    {"entity_id": "scene.movie", "area_id": "living", "device_id": None},
    {"entity_id": "automation.night", "area_id": None, "device_id": None},
]
STATES = [
    {"entity_id": "light.kitchen", "attributes": {"friendly_name": "Kitchen Light"}},
    {"entity_id": "light.lamp", "attributes": {"friendly_name": "Lamp"}},
    {
        "entity_id": "scene.movie",
        "attributes": {
            "friendly_name": "Movie",
            "entity_id": ["light.lamp", "light.kitchen"],
        },
    },
    {
        "entity_id": "automation.night",
        "attributes": {"friendly_name": "Night", "id": "1699"},
    },
]


def test_build_topology_normalizes_and_resolves_areas():
    topo = build_topology(AREAS, DEVICES, ENTITIES, STATES)

    assert [a["area_id"] for a in topo["areas"]] == ["kitchen", "living"]

    by_id = {e["entity_id"]: e for e in topo["entities"]}
    assert by_id["light.kitchen"]["name"] == "Kitchen Light"
    assert by_id["light.kitchen"]["area_id"] == "kitchen"
    # area inherited from the device registry entry
    assert by_id["light.lamp"]["area_id"] == "living"
    assert by_id["light.lamp"]["device_name"] == "Hue Bridge"

    assert topo["scenes"][0]["entities"] == ["light.lamp", "light.kitchen"]
    assert topo["automations"][0]["numeric_id"] == "1699"


def test_build_topology_handles_unregistered_entity():
    # entity present in states but absent from the registry still appears
    topo = build_topology(
        [], [], [], [{"entity_id": "sensor.temp", "attributes": {}}]
    )
    assert topo["entities"][0]["entity_id"] == "sensor.temp"
    assert topo["entities"][0]["area_id"] is None
    assert topo["entities"][0]["name"] == "sensor.temp"


def test_referenced_ids_walks_nested_config():
    config = {
        "trigger": [{"platform": "state", "entity_id": "binary_sensor.door"}],
        "condition": [{"condition": "state", "entity_id": "input_boolean.home"}],
        "action": [
            {"service": "light.turn_on", "target": {"entity_id": ["light.lamp"]}},
            {"scene": "scene.movie"},
            {
                "choose": [
                    {
                        "conditions": [],
                        "sequence": [
                            {
                                "service": "scene.turn_on",
                                "target": {"entity_id": "scene.away"},
                            },
                            {"service": "x", "target": {"device_id": "dev1"}},
                        ],
                    }
                ]
            },
        ],
    }
    refs = referenced_ids(config)
    assert refs["entities"] == [
        "binary_sensor.door",
        "input_boolean.home",
        "light.lamp",
    ]
    assert refs["scenes"] == ["scene.away", "scene.movie"]
    assert refs["devices"] == ["dev1"]


async def test_fetch_topology_runs_commands_and_enriches_automations():
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": AREAS},
            {"id": 2, "type": "result", "success": True, "result": DEVICES},
            {"id": 3, "type": "result", "success": True, "result": ENTITIES},
            {"id": 4, "type": "result", "success": True, "result": STATES},
            # search/related for automation.night (mid 5)
            {
                "id": 5,
                "type": "result",
                "success": True,
                "result": {
                    "entity": ["light.lamp"],
                    "scene": ["scene.movie"],
                    "device": ["dev1"],
                },
            },
        ]
    )

    topo = await fetch_topology(_settings(), fake_connect(ws))
    assert [m.get("type") for m in ws.sent] == [
        "auth",
        "config/area_registry/list",
        "config/device_registry/list",
        "config/entity_registry/list",
        "get_states",
        "search/related",
    ]
    related = ws.sent[-1]
    assert related["item_type"] == "automation"
    assert related["item_id"] == "automation.night"
    assert len(topo["entities"]) == 2
    assert topo["automations"][0]["references"] == {
        "entities": ["light.lamp"],
        "scenes": ["scene.movie"],
        "devices": ["dev1"],
    }


async def test_fetch_topology_degrades_when_related_unreadable():
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": AREAS},
            {"id": 2, "type": "result", "success": True, "result": DEVICES},
            {"id": 3, "type": "result", "success": True, "result": ENTITIES},
            {"id": 4, "type": "result", "success": True, "result": STATES},
            # search/related fails for this automation -> empty references
            {
                "id": 5,
                "type": "result",
                "success": False,
                "error": {"message": "nope"},
            },
        ]
    )

    topo = await fetch_topology(_settings(), fake_connect(ws))
    assert topo["automations"][0]["references"] == {
        "entities": [],
        "scenes": [],
        "devices": [],
    }


async def test_fetch_topology_raises_on_auth_failure():
    ws = FakeWS([{"type": "auth_required"}, {"type": "auth_invalid"}])
    with pytest.raises(HARegistryError):
        await fetch_topology(_settings(), fake_connect(ws))


async def test_fetch_automation_returns_config_and_refs():
    automation = {
        "id": "1699",
        "alias": "Night",
        "trigger": [{"platform": "state", "entity_id": "sun.sun"}],
        "action": [{"service": "scene.turn_on", "target": {"entity_id": "scene.movie"}}],
    }

    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/api/config/automation/config/1699"
        assert request.headers["Authorization"] == "Bearer token"
        return httpx.Response(200, json=automation)

    result = await fetch_automation(
        _settings(), "1699", transport=httpx.MockTransport(handler)
    )
    assert result["config"]["alias"] == "Night"
    assert result["referenced"]["entities"] == ["sun.sun"]
    assert result["referenced"]["scenes"] == ["scene.movie"]


async def test_fetch_automation_uses_latest_trace_config_on_404():
    # REST 404s (package/YAML automation), so structure comes from the newest
    # trace's embedded config. Two traces are offered; the later one must win.
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {
                "id": 1,
                "type": "result",
                "success": True,
                "result": [
                    {"run_id": "old", "timestamp": {"start": "2026-01-01T00:00:00"}},
                    {"run_id": "new", "timestamp": {"start": "2026-06-01T00:00:00"}},
                ],
            },
            {
                "id": 2,
                "type": "result",
                "success": True,
                "result": {
                    "config": {
                        "trigger": [{"platform": "state", "entity_id": "sun.sun"}],
                        "action": [
                            {"service": "scene.turn_on", "target": {"entity_id": "scene.movie"}}
                        ],
                    }
                },
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    result = await fetch_automation(
        _settings(),
        "1771085036395",
        fake_connect(ws),
        entity_id="automation.night",
        transport=httpx.MockTransport(handler),
    )
    # picked the most recent run
    trace_get = next(m for m in ws.sent if m.get("type") == "trace/get")
    assert trace_get["run_id"] == "new"
    # structure is sourced from the trace config
    assert result["config"]["trigger"][0]["entity_id"] == "sun.sun"
    assert result["referenced"]["entities"] == ["sun.sun"]
    assert result["referenced"]["scenes"] == ["scene.movie"]


async def test_fetch_automation_falls_back_to_related_when_no_traces():
    # REST 404s and there are no stored traces, so we degrade to relationships.
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": []},
            {
                "id": 3,
                "type": "result",
                "success": True,
                "result": {"entity": ["light.lamp"], "scene": ["scene.movie"]},
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    result = await fetch_automation(
        _settings(),
        "1771085036395",
        fake_connect(ws),
        entity_id="automation.night",
        transport=httpx.MockTransport(handler),
    )
    assert result["config"] == {}
    assert result["referenced"]["entities"] == ["light.lamp"]
    assert result["referenced"]["scenes"] == ["scene.movie"]


async def test_fetch_automation_propagates_ws_auth_failure():
    # REST 404s, then the websocket auth is rejected. That is a *real* failure
    # and must propagate (so web.py returns 502), not return empty-200.
    ws = FakeWS([{"type": "auth_required"}, {"type": "auth_invalid"}])

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    with pytest.raises(HARegistryError):
        await fetch_automation(
            _settings(),
            "1771085036395",
            fake_connect(ws),
            entity_id="automation.night",
            transport=httpx.MockTransport(handler),
        )


async def test_fetch_automation_logs_rest_fallback(caplog):
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": []},
            {
                "id": 3,
                "type": "result",
                "success": True,
                "result": {"entity": ["light.lamp"]},
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    with caplog.at_level(logging.INFO, logger="app.ha_registry"):
        result = await fetch_automation(
            _settings(),
            "1771085036395",
            fake_connect(ws),
            entity_id="automation.night",
            transport=httpx.MockTransport(handler),
        )
    assert result["referenced"]["entities"] == ["light.lamp"]
    assert any("REST" in r.message or "trace" in r.message for r in caplog.records)


async def test_fetch_topology_logs_enrichment_failure(caplog):
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": AREAS},
            {"id": 2, "type": "result", "success": True, "result": DEVICES},
            {"id": 3, "type": "result", "success": True, "result": ENTITIES},
            {"id": 4, "type": "result", "success": True, "result": STATES},
            {"id": 5, "type": "result", "success": False, "error": {"message": "nope"}},
        ]
    )
    with caplog.at_level(logging.WARNING, logger="app.ha_registry"):
        topo = await fetch_topology(_settings(), fake_connect(ws))
    assert topo["automations"][0]["references"] == {
        "entities": [],
        "scenes": [],
        "devices": [],
    }
    assert any("automation.night" in r.message for r in caplog.records)


def test_referenced_ids_bounds_recursion(caplog):
    # Build a config nested far deeper than the bound; it must not RecursionError.
    node: dict = {"entity_id": "light.deep"}
    for _ in range(5000):
        node = {"nested": node}
    with caplog.at_level(logging.WARNING, logger="app.ha_registry"):
        refs = referenced_ids(node)
    # Did not raise; bound was hit and logged.
    assert isinstance(refs["entities"], list)
    assert any("recursion bound" in r.message for r in caplog.records)


def test_referenced_ids_shallow_config_unaffected():
    config = {"trigger": [{"entity_id": "sun.sun"}]}
    assert referenced_ids(config)["entities"] == ["sun.sun"]


def test_build_topology_tolerates_non_str_area_name():
    areas = [
        {"area_id": "a1", "name": 12345},   # non-str name (malformed registry)
        {"area_id": "a2", "name": "Bedroom"},
    ]
    topo = build_topology(areas, [], [], [])
    names = {a["area_id"]: a["name"] for a in topo["areas"]}
    assert names["a1"] == 12345        # value preserved as-is
    assert names["a2"] == "Bedroom"
    # sorted without raising; int coerces to "12345" < "bedroom"
    assert [a["area_id"] for a in topo["areas"]] == ["a1", "a2"]


async def test_fetch_automation_trace_without_config_degrades_to_related():
    # REST 404s; a trace exists but its payload carries no `config`, so
    # _latest_trace_config returns None and we fall to search/related.
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            # trace/list (mid 1): one trace
            {
                "id": 1,
                "type": "result",
                "success": True,
                "result": [
                    {"run_id": "r1", "timestamp": {"start": "2026-06-01T00:00:00"}}
                ],
            },
            # trace/get (mid 2): no `config` key in the trace payload
            {"id": 2, "type": "result", "success": True, "result": {}},
            # search/related (mid 3)
            {
                "id": 3,
                "type": "result",
                "success": True,
                "result": {"entity": ["light.lamp"], "scene": ["scene.movie"]},
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    result = await fetch_automation(
        _settings(),
        "1771085036395",
        fake_connect(ws),
        entity_id="automation.night",
        transport=httpx.MockTransport(handler),
    )
    assert result["config"] == {}
    assert result["referenced"]["entities"] == ["light.lamp"]
    assert result["referenced"]["scenes"] == ["scene.movie"]


class HangingWS:
    """recv() blocks forever — simulates a Core that never answers an id."""

    def __init__(self):
        self.sent = []

    async def send(self, data):
        self.sent.append(json.loads(data))

    async def recv(self):
        await asyncio.Future()  # never resolves


async def test_command_times_out_to_ha_registry_error(monkeypatch):
    monkeypatch.setattr(ha_registry, "_COMMAND_TIMEOUT", 0.05)
    ws = HangingWS()
    with pytest.raises(HARegistryError):
        await _command(ws, 1, {"type": "config/area_registry/list"})


async def test_authenticate_times_out_to_ha_registry_error(monkeypatch):
    """_authenticate must raise HARegistryError when recv() never returns.

    HangingWS.recv() awaits asyncio.Future() forever; with _COMMAND_TIMEOUT
    monkeypatched to 0.05 the wait_for in _authenticate must fire and convert
    asyncio.TimeoutError -> HARegistryError within ~0.1 s.
    """
    monkeypatch.setattr(ha_registry, "_COMMAND_TIMEOUT", 0.05)
    ws = HangingWS()
    with pytest.raises(HARegistryError, match="timed out"):
        await ha_registry._authenticate(ws, "token")


async def test_command_returns_result_before_timeout(monkeypatch):
    # A normal, prompt reply still works under the timeout.
    monkeypatch.setattr(ha_registry, "_COMMAND_TIMEOUT", 5.0)
    ws = FakeWS(
        [{"id": 7, "type": "result", "success": True, "result": ["ok"]}]
    )
    result = await _command(ws, 7, {"type": "get_states"})
    assert result == ["ok"]


def _slow_related_ws(num_automations, per_call_delay):
    """A FakeWS where each search/related recv is artificially slow."""
    states = []
    for i in range(num_automations):
        states.append(
            {
                "entity_id": f"automation.a{i}",
                "attributes": {"friendly_name": f"A{i}", "id": str(1000 + i)},
            }
        )
    incoming = [
        {"type": "auth_required"},
        {"type": "auth_ok"},
        {"id": 1, "type": "result", "success": True, "result": []},   # areas
        {"id": 2, "type": "result", "success": True, "result": []},   # devices
        {"id": 3, "type": "result", "success": True, "result": []},   # entities
        {"id": 4, "type": "result", "success": True, "result": states},  # states
    ]
    for i in range(num_automations):
        incoming.append(
            {
                "id": 5 + i,
                "type": "result",
                "success": True,
                "result": {"entity": [f"light.l{i}"]},
            }
        )

    class SlowWS(FakeWS):
        async def recv(self):
            # Only the search/related replies (after the 4 list cmds + auth) are slow.
            if len(self.sent) > 5:
                await asyncio.sleep(per_call_delay)
            return await super().recv()

    return SlowWS(incoming)


async def test_fetch_topology_enrichment_respects_budget(monkeypatch):
    monkeypatch.setattr(ha_registry, "_ENRICH_BUDGET", 0.05)
    # Each related call sleeps 0.04s; with a 0.05s budget only the first one or
    # two run before the loop stops enriching and the rest get empty refs.
    ws = _slow_related_ws(num_automations=5, per_call_delay=0.04)
    started = time.monotonic()
    topo = await fetch_topology(_settings(), fake_connect(ws))
    elapsed = time.monotonic() - started

    # Returned without awaiting all 5 slow calls (5 * 0.04 = 0.20s).
    assert elapsed < 0.15
    # Every automation still has a references key (renders), even if empty.
    assert all("references" in a for a in topo["automations"])
    # At least one automation was skipped -> empty refs present.
    empties = [
        a for a in topo["automations"]
        if a["references"] == {"entities": [], "scenes": [], "devices": []}
    ]
    assert empties, "expected some automations to fall back to empty refs under budget"


def test_build_topology_carries_live_state():
    states = [
        {
            "entity_id": "automation.dead",
            "state": "unavailable",
            "attributes": {"friendly_name": "Dead", "id": "42"},
        },
        {"entity_id": "light.lamp", "state": "on", "attributes": {"friendly_name": "Lamp"}},
        {
            "entity_id": "scene.movie",
            "state": "2024-01-01T00:00:00",
            "attributes": {"friendly_name": "Movie", "entity_id": ["light.lamp"]},
        },
    ]
    topo = build_topology([], [], [], states)
    assert {a["entity_id"]: a["state"] for a in topo["automations"]} == {"automation.dead": "unavailable"}
    assert {e["entity_id"]: e["state"] for e in topo["entities"]} == {"light.lamp": "on"}
    assert {s["entity_id"]: s["state"] for s in topo["scenes"]} == {"scene.movie": "2024-01-01T00:00:00"}


def test_build_topology_state_defaults_to_none_when_absent():
    topo = build_topology([], [], [], [{"entity_id": "light.x", "attributes": {}}])
    assert topo["entities"][0]["state"] is None
