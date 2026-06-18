import json

import httpx
import pytest

from app.config import Settings
from app.ha_registry import (
    HARegistryError,
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
