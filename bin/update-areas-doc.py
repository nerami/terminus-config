#!/usr/bin/env python3
"""Laptop tool: regenerate docs/areas.md from the live HA area/device/entity
registries and current entity states.

    bin/update-areas-doc.py

Requires HASS_SERVER / HASS_TOKEN in the environment (same as hass-cli) and
the `hass-cli` and `pyyaml` packages available on PATH / in the interpreter.
Disabled-by-default entities are omitted, matching what area_entities()
would return in a template.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import yaml

REPO_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_DIR / "docs" / "areas.md"

DOMAIN_GROUP = {
    "automation": "Automations",
    "scene": "Scenes",
    "script": "Scripts",
    "light": "Lights",
    "switch": "Switches",
    "media_player": "Media Players",
    "sensor": "Sensors",
    "binary_sensor": "Binary Sensors",
    "button": "Buttons",
    "number": "Numbers",
    "select": "Selects",
    "device_tracker": "Device Trackers",
    "calendar": "Calendars",
    "weather": "Weather",
    "notify": "Notify",
    "event": "Events",
    "image": "Images",
}
GROUP_ORDER = [
    "Automations", "Scenes", "Scripts", "Lights", "Switches", "Media Players",
    "Sensors", "Binary Sensors", "Buttons", "Numbers", "Selects",
    "Device Trackers", "Calendars", "Weather", "Notify", "Events", "Images",
    "Other",
]


def die(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def ws_list(command: str) -> list[dict]:
    """Call `hass-cli raw ws <command>/list` and return its `result` list."""
    try:
        proc = subprocess.run(
            ["hass-cli", "raw", "ws", f"{command}/list", "--json={}"],
            capture_output=True, text=True, check=True,
        )
    except FileNotFoundError:
        die("hass-cli not found on PATH")
    except subprocess.CalledProcessError as exc:
        die(f"hass-cli raw ws {command}/list failed:\n{exc.stderr}")
    parsed = yaml.safe_load(proc.stdout)
    if not parsed or not parsed.get("success"):
        die(f"{command}/list did not succeed: {parsed}")
    return parsed["result"]


def fetch_states(server: str, token: str) -> dict[str, str]:
    """Return entity_id -> friendly_name for every current state."""
    req = urllib.request.Request(
        f"{server}/api/states",
        headers={"Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(req) as resp:
        states = json.load(resp)
    return {
        s["entity_id"]: s.get("attributes", {}).get("friendly_name")
        for s in states
    }


UNASSIGNED_KEY = "_unassigned"


def build_area_data(areas, devices, entities):
    dev_by_id = {d["id"]: d for d in devices}
    data = {a["area_id"]: {"devices": [], "entities": []} for a in areas}
    data[UNASSIGNED_KEY] = {"devices": [], "entities": []}

    for dev in devices:
        area_id = dev.get("area_id")
        bucket = area_id if area_id in data else UNASSIGNED_KEY
        data[bucket]["devices"].append(dev)

    def effective_area(entity):
        if entity.get("area_id"):
            return entity["area_id"]
        dev = dev_by_id.get(entity.get("device_id"))
        return dev.get("area_id") if dev else None

    for entity in entities:
        if entity.get("disabled_by"):
            continue
        area_id = effective_area(entity)
        bucket = area_id if area_id in data else UNASSIGNED_KEY
        data[bucket]["entities"].append(entity)

    return data


def name_for(entity: dict, friendly: dict[str, str]) -> str:
    eid = entity["entity_id"]
    return (
        friendly.get(eid)
        or entity.get("name")
        or entity.get("original_name")
        or eid
    )


def render_section(heading: str, devs: list[dict], ents: list[dict], friendly: dict) -> list[str]:
    lines = [heading, ""]

    lines.append(f"### Devices ({len(devs)})")
    lines.append("")
    if devs:
        lines.append("| Name | Device ID |")
        lines.append("|---|---|")
        for dev in sorted(devs, key=lambda d: (d.get("name_by_user") or d.get("name") or "")):
            name = dev.get("name_by_user") or dev.get("name") or "_(unnamed)_"
            lines.append(f"| {name} | `{dev['id']}` |")
    else:
        lines.append("_No devices._")
    lines.append("")

    lines.append(f"### Entities ({len(ents)})")
    lines.append("")

    grouped: dict[str, list[dict]] = {}
    for entity in ents:
        domain = entity["entity_id"].split(".")[0]
        group = DOMAIN_GROUP.get(domain, "Other")
        grouped.setdefault(group, []).append(entity)

    for group in GROUP_ORDER:
        if group not in grouped:
            continue
        glist = sorted(grouped[group], key=lambda e: e["entity_id"])
        lines.append(f"#### {group} ({len(glist)})")
        lines.append("")
        lines.append("| Entity ID | Name |")
        lines.append("|---|---|")
        for entity in glist:
            lines.append(f"| `{entity['entity_id']}` | {name_for(entity, friendly)} |")
        lines.append("")

    return lines


def render(areas, data, friendly, generated_at: datetime) -> str:
    area_display = {a["area_id"]: a["name"] for a in areas}
    area_order = sorted(area_display, key=lambda a: area_display[a].lower())

    lines = [
        "# Home Assistant Areas — Devices & Entities",
        "",
        f"_Generated: {generated_at.strftime('%Y-%m-%d %H:%M:%S UTC')}_",
        "",
        "Auto-generated reference of every area's devices and entities, grouped by",
        "domain. Source of truth is the device/entity/area registries on the device",
        "(`.storage/`) — this file is a point-in-time snapshot, not synced automatically.",
        "Disabled-by-default entities are omitted for readability. A final",
        "\"Unassigned\" section lists devices/entities with no area — mostly",
        "system/integration infra, but worth a periodic skim for real gaps.",
        "",
        "Regenerate via `bin/update-areas-doc.py`.",
        "",
    ]

    total_devices = sum(len(data[a]["devices"]) for a in area_order)
    total_entities = sum(len(data[a]["entities"]) for a in area_order)
    unassigned_devices = len(data[UNASSIGNED_KEY]["devices"])
    unassigned_entities = len(data[UNASSIGNED_KEY]["entities"])
    lines.append(
        f"**{len(area_order)} areas, {total_devices} devices, {total_entities} entities** "
        f"(+ {unassigned_devices} unassigned devices, {unassigned_entities} unassigned entities)."
    )
    lines.append("")
    lines.append("| Area | ID | Devices | Entities |")
    lines.append("|---|---|---|---|")
    for area_id in area_order:
        lines.append(
            f"| {area_display[area_id]} | `{area_id}` | "
            f"{len(data[area_id]['devices'])} | {len(data[area_id]['entities'])} |"
        )
    lines.append(f"| _Unassigned_ | — | {unassigned_devices} | {unassigned_entities} |")
    lines.append("")

    for area_id in area_order:
        heading = f"## {area_display[area_id]} (`{area_id}`)"
        lines.extend(render_section(heading, data[area_id]["devices"], data[area_id]["entities"], friendly))

    lines.extend(render_section(
        "## Unassigned (no area)",
        data[UNASSIGNED_KEY]["devices"],
        data[UNASSIGNED_KEY]["entities"],
        friendly,
    ))

    return "\n".join(lines) + "\n"


def main() -> None:
    server = os.environ.get("HASS_SERVER")
    token = os.environ.get("HASS_TOKEN")
    if not server or not token:
        die("HASS_SERVER and HASS_TOKEN must be set in the environment")

    areas = ws_list("config/area_registry")
    devices = ws_list("config/device_registry")
    entities = ws_list("config/entity_registry")
    friendly = fetch_states(server, token)

    data = build_area_data(areas, devices, entities)
    content = render(areas, data, friendly, datetime.now(timezone.utc))

    OUTPUT_PATH.parent.mkdir(exist_ok=True)
    OUTPUT_PATH.write_text(content)

    unassigned_devices = len(data[UNASSIGNED_KEY]["devices"])
    unassigned_entities = len(data[UNASSIGNED_KEY]["entities"])
    total_devices = sum(len(v["devices"]) for k, v in data.items() if k != UNASSIGNED_KEY)
    total_entities = sum(len(v["entities"]) for k, v in data.items() if k != UNASSIGNED_KEY)
    print(f"Wrote {OUTPUT_PATH.relative_to(REPO_DIR)} "
          f"({len(areas)} areas, {total_devices} devices, {total_entities} entities; "
          f"{unassigned_devices} unassigned devices, {unassigned_entities} unassigned entities).")


if __name__ == "__main__":
    main()
