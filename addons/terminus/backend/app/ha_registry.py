"""On-demand Home Assistant reads for the topology diagram.

The status client (:mod:`app.ha_client`) keeps one long-lived websocket open for
liveness. The diagram instead needs occasional, larger snapshots (the area /
device / entity registries and the current states), so this module opens a
short-lived authenticated websocket per request, runs the handful of list
commands, and normalizes the result into a shape the frontend can render.

Automation *config* is not available over the websocket registries, so it is
fetched over the REST API (``/api/config/automation/config/<id>``) and walked to
extract the entities, scenes and devices each automation references.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, Callable, Optional

import httpx

from .config import Settings, rest_target

# connect(url) -> async context manager yielding an object with async send/recv.
ConnectFn = Callable[[str], Any]

logger = logging.getLogger(__name__)

_MAX_WALK_DEPTH = 100

# Per-websocket-command timeout (M2). A command's send + await-matching-id
# must not block forever on a wedged Core; on timeout we raise HARegistryError
# so callers degrade (and, per Spec C, log) instead of hanging.
_COMMAND_TIMEOUT = 15.0

# Total wall-clock budget for the per-automation search/related enrichment in
# fetch_topology (M2). Once exceeded, remaining automations get empty refs so a
# slow/wedged Core can't stall /ha/topology indefinitely.
_ENRICH_BUDGET = 8.0


class HARegistryError(Exception):
    """Raised when a registry websocket session fails to authenticate."""


# -- websocket helpers ----------------------------------------------------
async def _authenticate(ws, token: Optional[str]) -> None:
    try:
        raw = await asyncio.wait_for(ws.recv(), _COMMAND_TIMEOUT)
    except asyncio.TimeoutError as exc:
        raise HARegistryError(
            f"websocket authentication timed out after {_COMMAND_TIMEOUT}s"
        ) from exc
    msg = json.loads(raw)
    if msg.get("type") != "auth_required":
        raise HARegistryError(f"unexpected greeting: {msg.get('type')!r}")
    await ws.send(json.dumps({"type": "auth", "access_token": token}))
    try:
        raw = await asyncio.wait_for(ws.recv(), _COMMAND_TIMEOUT)
    except asyncio.TimeoutError as exc:
        raise HARegistryError(
            f"websocket authentication timed out after {_COMMAND_TIMEOUT}s"
        ) from exc
    msg = json.loads(raw)
    if msg.get("type") != "auth_ok":
        raise HARegistryError(msg.get("message", "authentication failed"))


async def _command(ws, mid: int, payload: dict) -> Any:
    await ws.send(json.dumps({"id": mid, **payload}))

    async def _await_reply() -> Any:
        while True:
            msg = json.loads(await ws.recv())
            if msg.get("id") == mid:
                if not msg.get("success", True):
                    err = (msg.get("error") or {}).get("message", "command failed")
                    raise HARegistryError(err)
                return msg.get("result")

    try:
        return await asyncio.wait_for(_await_reply(), timeout=_COMMAND_TIMEOUT)
    except asyncio.TimeoutError as exc:
        raise HARegistryError(
            f"websocket command {payload.get('type', mid)!r} timed out "
            f"after {_COMMAND_TIMEOUT}s"
        ) from exc


# -- normalization (pure, unit-testable) ----------------------------------
def build_topology(
    areas: list[dict],
    devices: list[dict],
    entities: list[dict],
    states: list[dict],
) -> dict:
    """Combine the registry lists + states into a normalized snapshot.

    Entity area is resolved as ``entity.area_id`` falling back to the area of the
    entity's device. Friendly names prefer the live state attribute, then the
    registry name, then the entity id. Scenes carry the entities they control
    (from the state ``entity_id`` attribute); automations carry their numeric
    config id (from the state ``id`` attribute) for later config lookup.
    """
    device_by_id = {d["id"]: d for d in devices if d.get("id")}
    reg_by_entity = {
        e["entity_id"]: e for e in entities if e.get("entity_id")
    }
    state_by_entity = {
        s["entity_id"]: s for s in states if s.get("entity_id")
    }

    def device_name(device_id: Optional[str]) -> Optional[str]:
        dev = device_by_id.get(device_id) if device_id else None
        if not dev:
            return None
        return dev.get("name_by_user") or dev.get("name")

    def resolve_area(entity_id: str) -> Optional[str]:
        reg = reg_by_entity.get(entity_id) or {}
        if reg.get("area_id"):
            return reg["area_id"]
        dev = device_by_id.get(reg.get("device_id")) if reg.get("device_id") else None
        return dev.get("area_id") if dev else None

    out_entities: list[dict] = []
    out_scenes: list[dict] = []
    out_automations: list[dict] = []

    for entity_id, state in state_by_entity.items():
        if "." not in entity_id:
            continue
        domain = entity_id.split(".", 1)[0]
        attrs = state.get("attributes") or {}
        reg = reg_by_entity.get(entity_id) or {}
        name = (
            attrs.get("friendly_name")
            or reg.get("name")
            or reg.get("original_name")
            or entity_id
        )
        area_id = resolve_area(entity_id)

        if domain == "scene":
            out_scenes.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "entities": list(attrs.get("entity_id") or []),
                }
            )
        elif domain == "automation":
            out_automations.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "numeric_id": attrs.get("id"),
                }
            )
        else:
            out_entities.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "domain": domain,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "device_id": reg.get("device_id"),
                    "device_name": device_name(reg.get("device_id")),
                }
            )

    out_areas = [
        {"area_id": a["area_id"], "name": a.get("name") or a["area_id"]}
        for a in areas
        if a.get("area_id")
    ]
    out_areas.sort(key=lambda a: str(a["name"]).lower())

    return {
        "areas": out_areas,
        "entities": out_entities,
        "scenes": out_scenes,
        "automations": out_automations,
    }


def referenced_ids(config: Any) -> dict:
    """Walk an automation config and collect the ids it references.

    Recurses through trigger / condition / action blocks (including nested
    ``choose`` / ``if`` / ``repeat`` / ``parallel`` structures) collecting every
    ``entity_id`` and ``device_id`` value plus legacy ``scene:`` action targets.
    Entity ids in the ``scene.`` domain are returned separately from other
    entities. The walk is depth-bounded so a pathological config can't
    ``RecursionError``.
    """
    entities: set[str] = set()
    devices: set[str] = set()
    bound_hit = False

    def add(value: Any, into: set[str]) -> None:
        if isinstance(value, str):
            into.add(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    into.add(item)

    def walk(node: Any, depth: int) -> None:
        nonlocal bound_hit
        if depth > _MAX_WALK_DEPTH:
            bound_hit = True
            return
        if isinstance(node, dict):
            for key, value in node.items():
                if key == "entity_id":
                    add(value, entities)
                elif key == "device_id":
                    add(value, devices)
                elif key == "scene" and isinstance(value, str):
                    entities.add(value)
                else:
                    walk(value, depth + 1)
        elif isinstance(node, list):
            for item in node:
                walk(item, depth + 1)

    walk(config, 0)
    if bound_hit:
        logger.warning(
            "referenced_ids recursion bound %d hit; truncating walk",
            _MAX_WALK_DEPTH,
        )
    scenes = sorted(e for e in entities if e.startswith("scene."))
    plain = sorted(e for e in entities if not e.startswith("scene."))
    return {"entities": plain, "scenes": scenes, "devices": sorted(devices)}


def _empty_refs() -> dict:
    return {"entities": [], "scenes": [], "devices": []}


def _related_refs(result: Any) -> dict:
    """Map a ``search/related`` result into ``{entities, scenes, devices}``.

    Home Assistant returns related items keyed by item type (``entity``,
    ``scene``, ``script``, ``device``, ``area`` ...). We keep entity-like ids
    (entities and scripts as entities, scenes split out by their ``scene.``
    domain) and device ids; areas/config entries/the automation itself are
    ignored. Being tolerant of the exact shape keeps this working across HA
    versions.
    """
    entities: set[str] = set()
    scenes: set[str] = set()
    devices: set[str] = set()
    if isinstance(result, dict):
        for ent in result.get("entity") or []:
            if isinstance(ent, str):
                (scenes if ent.startswith("scene.") else entities).add(ent)
        for scr in result.get("script") or []:
            if isinstance(scr, str):
                entities.add(scr)
        for scn in result.get("scene") or []:
            if isinstance(scn, str):
                scenes.add(scn)
        for dev in result.get("device") or []:
            if isinstance(dev, str):
                devices.add(dev)
    return {
        "entities": sorted(entities),
        "scenes": sorted(scenes),
        "devices": sorted(devices),
    }


async def _search_related(ws, mid: int, entity_id: str) -> dict:
    """Ask HA which items an automation relates to (robust for all automations).

    Unlike the REST automation config endpoint - which only serves automations
    stored in the editor-managed ``automations.yaml`` and 404s for YAML / package
    / blueprint automations - ``search/related`` works for every automation, so
    it is the reliable source for the relationship graph.
    """
    result = await _command(
        ws,
        mid,
        {"type": "search/related", "item_type": "automation", "item_id": entity_id},
    )
    return _related_refs(result)


# -- IO entry points ------------------------------------------------------
async def fetch_topology(settings: Settings, connect: ConnectFn) -> dict:
    """Open a short-lived websocket and return the normalized topology.

    Automations are enriched with the entities/scenes they reference (via the
    ``search/related`` websocket command) so the diagram can draw automation
    relationships. Enrichment is resilient: an automation whose relations can't
    be read just gets empty references so the rest of the topology still renders.
    """
    async with connect(settings.ws_url) as ws:
        await _authenticate(ws, settings.ha_token)
        areas = await _command(ws, 1, {"type": "config/area_registry/list"}) or []
        devices = (
            await _command(ws, 2, {"type": "config/device_registry/list"}) or []
        )
        entities = (
            await _command(ws, 3, {"type": "config/entity_registry/list"}) or []
        )
        states = await _command(ws, 4, {"type": "get_states"}) or []
        topology = build_topology(areas, devices, entities, states)

        mid = 5
        enrich_deadline = time.monotonic() + _ENRICH_BUDGET
        for automation in topology["automations"]:
            if time.monotonic() >= enrich_deadline:
                # Out of budget: leave the rest unenriched so the diagram still
                # renders (M2). They keep empty references.
                automation["references"] = _empty_refs()
                continue
            try:
                automation["references"] = await _search_related(
                    ws, mid, automation["entity_id"]
                )
            except HARegistryError as exc:
                logger.warning(
                    "enrichment failed for automation %s: %s",
                    automation["entity_id"],
                    exc,
                )
                automation["references"] = _empty_refs()
            mid += 1

    return topology


async def _rest_get(settings: Settings, path: str, transport) -> Any:
    base, token = rest_target(settings)
    if not base:
        raise HARegistryError("Home Assistant connection not configured")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    async with httpx.AsyncClient(
        base_url=base, transport=transport, timeout=30
    ) as client:
        resp = await client.get(path, headers=headers)
        resp.raise_for_status()
        return resp.json()


async def _latest_trace_config(ws, numeric_id: str) -> Optional[dict]:
    """Return the config embedded in the automation's most recent trace.

    Package/YAML automations aren't in the editor store, so the REST config
    endpoint 404s for them. Their structure is, however, embedded in every
    trace, so we read the newest trace and hand back just its ``config`` (we
    ignore the execution data for now - this stays a structure-only view).
    Returns ``None`` when the automation has no stored traces.
    """
    traces = (
        await _command(
            ws,
            1,
            {"type": "trace/list", "domain": "automation", "item_id": numeric_id},
        )
        or []
    )
    if not traces:
        return None

    def started(t: dict) -> str:
        return ((t.get("timestamp") or {}).get("start")) or ""

    latest = max(traces, key=started)
    run_id = latest.get("run_id")
    if not run_id:
        return None

    trace = (
        await _command(
            ws,
            2,
            {
                "type": "trace/get",
                "domain": "automation",
                "item_id": numeric_id,
                "run_id": run_id,
            },
        )
        or {}
    )
    config = trace.get("config")
    return config if isinstance(config, dict) else None


async def fetch_automation(
    settings: Settings,
    numeric_id: str,
    connect: Optional[ConnectFn] = None,
    *,
    entity_id: Optional[str] = None,
    transport: Optional[httpx.BaseTransport] = None,
) -> dict:
    """Fetch one automation's detail for the drill-down ("trace") view.

    Resolution order:
      1. REST automation config - the full trigger/condition/action structure
         for editor-managed automations.
      2. The latest trace's embedded config - covers package/YAML automations
         (which 404 over REST) that have run at least once.
      3. ``search/related`` - relationships only, when no structure is available
         (e.g. a never-run package automation), so the view still renders.
    """
    # 1. REST config (editor-managed automations).
    try:
        config = await _rest_get(
            settings, f"/api/config/automation/config/{numeric_id}", transport
        )
        return {"config": config, "referenced": referenced_ids(config)}
    except httpx.HTTPStatusError as exc:
        # A 404 is the expected "not editor-managed" signal; fall through to
        # the websocket ladder below. Any other status is logged too.
        logger.info(
            "REST automation config %s returned %s; falling back to trace",
            numeric_id,
            exc.response.status_code,
        )

    if connect is None:
        return {"config": {}, "referenced": _empty_refs()}

    async with connect(settings.ws_url) as ws:
        await _authenticate(ws, settings.ha_token)

        # 2. Structure from the most recent trace.
        config = None
        try:
            config = await _latest_trace_config(ws, numeric_id)
        except HARegistryError as exc:
            logger.warning(
                "trace lookup failed for %s; degrading to relationships: %s",
                numeric_id,
                exc,
            )
            config = None
        if config:
            return {"config": config, "referenced": referenced_ids(config)}

        # 3. Relationships only.
        refs = _empty_refs()
        if entity_id:
            try:
                refs = await _search_related(ws, 3, entity_id)
            except HARegistryError as exc:
                logger.warning(
                    "search/related failed for %s; returning empty refs: %s",
                    entity_id,
                    exc,
                )
                refs = _empty_refs()
        return {"config": {}, "referenced": refs}


async def fetch_entity(
    settings: Settings,
    entity_id: str,
    *,
    transport: Optional[httpx.BaseTransport] = None,
) -> dict:
    """Fetch one entity's current state + attributes over REST."""
    return await _rest_get(settings, f"/api/states/{entity_id}", transport)
