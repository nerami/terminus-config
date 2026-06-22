"""Custom LangChain tools exposed to the agent."""

from __future__ import annotations

import json
import logging

import httpx
from langchain_core.tools import tool

from .config import load_settings, rest_target
from .ha_client import extract_basic_info

logger = logging.getLogger(__name__)

_TIMEOUT = 10.0
_TOOL_ERRORS = (httpx.HTTPError, httpx.InvalidURL, json.JSONDecodeError)

# Bounded direct entity control. ``control_entity`` maps on/off/toggle to the
# universal ``homeassistant.turn_on/turn_off/toggle`` services (which dispatch to
# each entity's own domain), so it works across these domains without a per-domain
# branch. The allowlist keeps the blast radius small and excludes domains where the
# universal services don't map cleanly (e.g. lock uses lock/unlock, not turn_on).
_CONTROL_ACTIONS = {"on": "turn_on", "off": "turn_off", "toggle": "toggle"}
_CONTROL_DOMAINS = {"light", "switch", "fan", "media_player", "cover", "climate"}


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


def fetch_entity_state(
    base: str,
    token: str,
    entity_id: str,
    *,
    transport: httpx.BaseTransport | None = None,
) -> dict:
    """Fetch one entity's state via ``GET /api/states/{entity_id}``."""
    headers = {"Authorization": f"Bearer {token}"}
    with httpx.Client(timeout=_TIMEOUT, transport=transport) as client:
        resp = client.get(f"{base}/api/states/{entity_id}", headers=headers)
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
    except _TOOL_ERRORS as exc:
        logger.warning("tool ha_basic_info failed: %s", exc)
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
    except _TOOL_ERRORS as exc:
        logger.warning("tool run_scene failed: %s", exc)
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
    except _TOOL_ERRORS as exc:
        logger.warning("tool trigger_automation failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "automation": automation_id})


@tool
def control_entity(entity_id: str, action: str) -> str:
    """Turn a single Home Assistant entity on, off, or toggle it.

    Use this for direct device control the user asks for (e.g. "turn the lamp
    off", "toggle the fan"). ``entity_id`` is the entity to control (e.g.
    ``switch.mb_lamp``) and ``action`` is one of ``on``, ``off`` or ``toggle``.
    Supported domains are light, switch, fan, media_player, cover and climate.
    This changes the state of the home, so it requires the user's approval
    before it runs. Returns a JSON object with the result or an error.
    """
    service = _CONTROL_ACTIONS.get(action)
    if service is None:
        return json.dumps(
            {
                "error": (
                    f"'{action}' is not a valid action "
                    "(expected 'on', 'off' or 'toggle')"
                )
            }
        )
    domain = entity_id.split(".", 1)[0] if "." in entity_id else ""
    if domain not in _CONTROL_DOMAINS:
        allowed = ", ".join(sorted(_CONTROL_DOMAINS))
        return json.dumps(
            {
                "error": (
                    f"'{entity_id}' is not a controllable entity id "
                    f"(supported domains: {allowed})"
                )
            }
        )
    settings = load_settings()
    base, token = rest_target(settings)
    if not base or not token:
        return json.dumps({"error": "Home Assistant connection not configured"})
    try:
        # The universal homeassistant.* service dispatches to the entity's own
        # domain, so the same call works for every allowlisted domain.
        call_service(base, token, "homeassistant", service, {"entity_id": entity_id})
    except _TOOL_ERRORS as exc:
        logger.warning("tool control_entity failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "entity_id": entity_id, "action": action})


@tool
def get_entity_state(entity_id: str) -> str:
    """Read one entity's current state and attributes, as JSON.

    Use this to check or confirm what a device is doing (e.g. "is the lamp
    off?") before or after acting. ``entity_id`` is the entity to read (e.g.
    ``switch.mb_lamp``). This only reads; it never changes the home. Returns
    the entity's state JSON or an error.
    """
    if "." not in entity_id:
        return json.dumps(
            {"error": f"'{entity_id}' is not an entity id (expected 'domain.object')"}
        )
    settings = load_settings()
    base, token = rest_target(settings)
    if not base or not token:
        return json.dumps({"error": "Home Assistant connection not configured"})
    try:
        state = fetch_entity_state(base, token, entity_id)
    except _TOOL_ERRORS as exc:
        logger.warning("tool get_entity_state failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps(state)
