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
