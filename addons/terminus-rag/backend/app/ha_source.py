"""Short-lived authenticated HA websocket reads + per-domain normalizers that turn
registry JSON into IndexRecords. Each normalizer is pure and unit-tested; ``fetch_all``
runs them under isolated try/except so one failing source is logged and skipped while
the others still index.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Callable

from .config import Settings
from .records import HELPER_DOMAINS, IndexRecord, compose_text

logger = logging.getLogger(__name__)

ConnectFn = Callable[[str], Any]

_COMMAND_TIMEOUT = 15.0


class HASourceError(Exception):
    pass


# -- ws helpers -----------------------------------------------------------
async def _authenticate(ws, token: str | None) -> None:
    try:
        msg = json.loads(await asyncio.wait_for(ws.recv(), _COMMAND_TIMEOUT))
    except asyncio.TimeoutError as exc:
        raise HASourceError(f"websocket authentication timed out after {_COMMAND_TIMEOUT}s") from exc
    if msg.get("type") != "auth_required":
        raise HASourceError(f"unexpected greeting: {msg.get('type')!r}")
    await ws.send(json.dumps({"type": "auth", "access_token": token}))
    try:
        msg = json.loads(await asyncio.wait_for(ws.recv(), _COMMAND_TIMEOUT))
    except asyncio.TimeoutError as exc:
        raise HASourceError(f"websocket authentication timed out after {_COMMAND_TIMEOUT}s") from exc
    if msg.get("type") != "auth_ok":
        raise HASourceError(msg.get("message", "authentication failed"))


async def _command(ws, mid: int, payload: dict) -> Any:
    await ws.send(json.dumps({"id": mid, **payload}))

    async def _await_reply():
        while True:
            msg = json.loads(await ws.recv())
            if msg.get("id") == mid:
                if not msg.get("success", True):
                    raise HASourceError((msg.get("error") or {}).get("message", "command failed"))
                return msg.get("result")

    try:
        return await asyncio.wait_for(_await_reply(), _COMMAND_TIMEOUT)
    except asyncio.TimeoutError as exc:
        raise HASourceError(
            f"websocket command {payload.get('type', mid)!r} timed out after {_COMMAND_TIMEOUT}s"
        ) from exc


# -- normalizers (pure) ---------------------------------------------------
def build_area_records(areas: list[dict]) -> list[IndexRecord]:
    out = []
    for a in areas:
        aid = a.get("area_id")
        if not aid:
            continue
        name = a.get("name") or aid
        meta = {"area_id": aid, "name": name, "labels": a.get("labels") or []}
        out.append(IndexRecord(
            id=f"area:{aid}", kind="area",
            text=compose_text("area", name=name), metadata=meta,
        ))
    return out


def build_label_records(labels: list[dict]) -> list[IndexRecord]:
    out = []
    for lb in labels:
        lid = lb.get("label_id")
        if not lid:
            continue
        name = lb.get("name") or lid
        meta = {"label_id": lid, "name": name, "color": lb.get("color")}
        out.append(IndexRecord(
            id=f"label:{lid}", kind="label",
            text=compose_text("label", name=name), metadata=meta,
        ))
    return out


def build_device_records(devices: list[dict]) -> list[IndexRecord]:
    out = []
    for d in devices:
        did = d.get("id")
        if not did:
            continue
        name = d.get("name_by_user") or d.get("name") or did
        meta = {
            "device_id": did, "name": name,
            "manufacturer": d.get("manufacturer"), "model": d.get("model"),
            "area_id": d.get("area_id"),
        }
        out.append(IndexRecord(
            id=f"device:{did}", kind="device",
            text=compose_text(
                "device", name=name,
                extra=[p for p in [d.get("manufacturer"), d.get("model")] if p],
            ),
            metadata=meta,
        ))
    return out


def build_entity_records(
    entities: list[dict], states: list[dict], areas: list[dict], devices: list[dict]
) -> list[IndexRecord]:
    area_name = {a["area_id"]: (a.get("name") or a["area_id"]) for a in areas if a.get("area_id")}
    dev_by_id = {d["id"]: d for d in devices if d.get("id")}
    state_by_id = {s["entity_id"]: s for s in states if s.get("entity_id")}

    out = []
    for e in entities:
        eid = e.get("entity_id")
        if not eid or "." not in eid:
            continue
        domain = eid.split(".", 1)[0]
        # registry editor automations/scenes/scripts are covered by the state-based
        # builder; skip them here so we don't double-index.
        if domain in ("automation", "scene", "script"):
            continue
        kind = "helper" if domain in HELPER_DOMAINS else "entity"

        dev = dev_by_id.get(e.get("device_id")) if e.get("device_id") else None
        aid = e.get("area_id") or (dev.get("area_id") if dev else None)
        a_name = area_name.get(aid) if aid else None
        d_name = (dev.get("name_by_user") or dev.get("name")) if dev else None

        attrs = (state_by_id.get(eid) or {}).get("attributes") or {}
        name = (
            attrs.get("friendly_name") or e.get("name")
            or e.get("original_name") or eid
        )
        aliases = [a for a in (e.get("aliases") or []) if a]

        meta = {
            "entity_id": eid, "name": name, "domain": domain,
            "area_id": aid, "area_name": a_name,
            "device_id": e.get("device_id"), "device_name": d_name,
            "aliases": aliases,
        }
        out.append(IndexRecord(
            id=f"{kind}:{eid}", kind=kind,
            text=compose_text(
                kind, name=name, domain=domain, area_name=a_name,
                device_name=d_name, aliases=aliases or None,
                original_name=e.get("original_name"),
            ),
            metadata=meta,
        ))
    return out


def build_scene_script_automation_records(states: list[dict]) -> list[IndexRecord]:
    out = []
    for s in states:
        eid = s.get("entity_id")
        if not eid or "." not in eid:
            continue
        domain = eid.split(".", 1)[0]
        if domain not in ("scene", "script", "automation"):
            continue
        attrs = s.get("attributes") or {}
        name = attrs.get("friendly_name") or eid
        meta: dict = {"entity_id": eid, "name": name}
        if domain == "scene":
            meta["entities"] = list(attrs.get("entity_id") or [])
        elif domain == "automation":
            meta["numeric_id"] = attrs.get("id")
        out.append(IndexRecord(
            id=f"{domain}:{eid}", kind=domain,
            text=compose_text(domain, name=name), metadata=meta,
        ))
    return out


def build_blueprint_records(blueprints: dict) -> list[IndexRecord]:
    out = []
    for domain, entries in (blueprints or {}).items():
        if not isinstance(entries, dict):
            continue
        for path, info in entries.items():
            meta_in = (info or {}).get("metadata") or {}
            name = meta_in.get("name") or path
            meta = {
                "path": path, "domain": domain, "name": name,
                "source_url": meta_in.get("source_url"),
            }
            out.append(IndexRecord(
                id=f"blueprint:{domain}:{path}", kind="blueprint",
                text=compose_text("blueprint", name=name, extra=[f"domain: {domain}"]),
                metadata=meta,
            ))
    return out


# -- orchestration --------------------------------------------------------
async def fetch_all(settings: Settings, connect: ConnectFn) -> tuple[list[IndexRecord], list[str]]:
    """Open one short-lived ws, fetch every source, normalize each in isolation.

    Returns ``(records, errors)``; ``errors`` lists the sources that failed (logged).
    A normalizer raising does not abort the others.
    """
    records: list[IndexRecord] = []
    errors: list[str] = []

    async with connect(settings.ws_url) as ws:
        await _authenticate(ws, settings.ha_token)
        areas = await _command(ws, 1, {"type": "config/area_registry/list"}) or []
        labels = await _command(ws, 2, {"type": "config/label_registry/list"}) or []
        devices = await _command(ws, 3, {"type": "config/device_registry/list"}) or []
        entities = await _command(ws, 4, {"type": "config/entity_registry/list"}) or []
        states = await _command(ws, 5, {"type": "get_states"}) or []
        try:
            blueprints = await _command(ws, 6, {"type": "blueprint/list"}) or {}
        except Exception as exc:  # noqa: BLE001 - blueprints optional; log + skip
            logger.warning("blueprint/list failed: %s", exc)
            blueprints = {}
            errors.append("blueprint")

    sources = [
        ("area", lambda: build_area_records(areas)),
        ("label", lambda: build_label_records(labels)),
        ("device", lambda: build_device_records(devices)),
        ("entity", lambda: build_entity_records(entities, states, areas, devices)),
        ("scene_script_automation", lambda: build_scene_script_automation_records(states)),
        ("blueprint", lambda: build_blueprint_records(blueprints)),
    ]
    for name, fn in sources:
        try:
            records.extend(fn())
        except Exception as exc:  # noqa: BLE001 - isolate per-source failure
            logger.warning("source %s normalization failed: %s", name, exc)
            errors.append(name)

    return records, errors
