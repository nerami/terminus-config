"""Custom LangChain tools exposed to the agent."""

from __future__ import annotations

import json

import httpx
from langchain_core.tools import tool

from .config import load_settings, rest_target
from .ha_client import extract_basic_info

_TIMEOUT = 10.0


def fetch_basic_info(
    base: str,
    token: str,
    *,
    transport: httpx.BaseTransport | None = None,
) -> dict:
    """Fetch HA ``/api/config`` and ``/api/states`` and summarise them."""
    headers = {"Authorization": f"Bearer {token}"}
    with httpx.Client(timeout=_TIMEOUT, transport=transport) as client:
        config = client.get(f"{base}/api/config", headers=headers)
        config.raise_for_status()
        states = client.get(f"{base}/api/states", headers=headers)
        states.raise_for_status()
    return extract_basic_info(config.json(), states.json())


def call_service(
    base: str,
    token: str,
    domain: str,
    service: str,
    data: dict,
    *,
    transport: httpx.BaseTransport | None = None,
) -> list:
    """Call a Home Assistant service via ``POST /api/services/{domain}/{service}``."""
    headers = {"Authorization": f"Bearer {token}"}
    with httpx.Client(timeout=_TIMEOUT, transport=transport) as client:
        resp = client.post(
            f"{base}/api/services/{domain}/{service}",
            headers=headers,
            json=data,
        )
        resp.raise_for_status()
        return resp.json()


@tool
def ha_basic_info() -> str:
    """Get basic information about this Home Assistant instance, as JSON.

    Returns the Home Assistant version, location name, time zone, country,
    currency, unit system, and a count of entities grouped by domain. Use this
    whenever the user asks about the Home Assistant setup, how many
    entities/devices exist, or details of the instance's configuration.
    """
    settings = load_settings()
    base, token = rest_target(settings)
    if not base or not token:
        return json.dumps({"error": "Home Assistant connection not configured"})
    try:
        info = fetch_basic_info(base, token)
    except httpx.HTTPError as exc:
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps(info)


@tool
def run_scene(scene_id: str) -> str:
    """Activate a Home Assistant scene by its entity id.

    Use this to apply a scene the user asks for (e.g. "turn on the evening
    scene"). ``scene_id`` must be a scene entity id such as ``scene.evening``.
    This changes the state of the home, so it requires the user's approval
    before it runs. Returns a JSON object with the result or an error.
    """
    if not scene_id.startswith("scene."):
        return json.dumps(
            {"error": f"'{scene_id}' is not a scene entity id (expected 'scene.*')"}
        )
    settings = load_settings()
    base, token = rest_target(settings)
    if not base or not token:
        return json.dumps({"error": "Home Assistant connection not configured"})
    try:
        call_service(base, token, "scene", "turn_on", {"entity_id": scene_id})
    except httpx.HTTPError as exc:
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "scene": scene_id})


@tool
def trigger_automation(automation_id: str) -> str:
    """Trigger (run) a Home Assistant automation by its entity id.

    Use this to manually run an automation the user asks for (e.g. "run the
    night automation"). ``automation_id`` must be an automation entity id such
    as ``automation.night``. This actually executes the automation's actions,
    so it requires the user's approval before it runs. Returns a JSON object
    with the result or an error.
    """
    if not automation_id.startswith("automation."):
        return json.dumps(
            {
                "error": (
                    f"'{automation_id}' is not an automation entity id "
                    "(expected 'automation.*')"
                )
            }
        )
    settings = load_settings()
    base, token = rest_target(settings)
    if not base or not token:
        return json.dumps({"error": "Home Assistant connection not configured"})
    try:
        call_service(
            base, token, "automation", "trigger", {"entity_id": automation_id}
        )
    except httpx.HTTPError as exc:
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "automation": automation_id})
