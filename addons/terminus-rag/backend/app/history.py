"""On-demand passthrough to HA's existing trace / logbook / recorder stores. These
inherit HA's retention (recorder ~10 days; automations keep ~stored_traces traces) —
the MCP tool descriptions say so. Every entry point returns a JSON-serializable dict
and degrades to ``{"error": ...}`` rather than raising.
"""

from __future__ import annotations

import logging

import httpx

from .config import Settings, rest_target
from .ha_source import ConnectFn, _authenticate, _command

logger = logging.getLogger(__name__)


async def _rest_get(settings: Settings, path: str, params: dict, transport) -> object:
    base, token = rest_target(settings)
    if not base:
        raise RuntimeError("Home Assistant connection not configured")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    async with httpx.AsyncClient(base_url=base, transport=transport, timeout=30) as client:
        resp = await client.get(path, params=params, headers=headers)
        resp.raise_for_status()
        return resp.json()


async def get_automation_trace(
    settings: Settings,
    connect: ConnectFn,
    automation: str,
    run_id: str | None = None,
    *,
    numeric_resolver=None,
) -> dict:
    """Latest (or specified) trace for an automation. Accepts an entity id
    (``automation.x``) or a numeric id."""
    numeric = automation
    if automation.startswith("automation."):
        if numeric_resolver is None:
            return {"error": "entity-id resolution requires a numeric_resolver"}
        numeric = numeric_resolver(automation)
        if not numeric:
            return {"error": f"could not resolve numeric id for {automation}"}

    try:
        async with connect(settings.ws_url) as ws:
            await _authenticate(ws, settings.ha_token)
            traces = await _command(
                ws, 1, {"type": "trace/list", "domain": "automation", "item_id": numeric}
            ) or []
            if not traces:
                return {"error": f"no traces for automation {numeric}"}

            chosen = None
            if run_id is not None:
                chosen = next((t for t in traces if t.get("run_id") == run_id), None)
                if chosen is None:
                    return {"error": f"run_id {run_id} not found"}
            else:
                chosen = max(traces, key=lambda t: (t.get("timestamp") or {}).get("start") or "")

            rid = chosen.get("run_id")
            trace = await _command(
                ws, 2,
                {"type": "trace/get", "domain": "automation", "item_id": numeric, "run_id": rid},
            ) or {}
            return {
                "run_id": rid,
                "config": trace.get("config"),
                "trace": trace.get("trace") or trace,
            }
    except Exception as exc:  # noqa: BLE001 - return structured error, never raise
        logger.warning("get_automation_trace(%s) failed: %s", automation, exc)
        return {"error": f"{type(exc).__name__}: {exc}"}


async def get_logbook(
    settings: Settings,
    start: str,
    end: str | None = None,
    entity_id: str | None = None,
    *,
    transport=None,
) -> dict:
    params: dict = {}
    if end:
        params["end_time"] = end
    if entity_id:
        params["entity"] = entity_id
    try:
        data = await _rest_get(settings, f"/api/logbook/{start}", params, transport)
        return {"events": data}
    except Exception as exc:  # noqa: BLE001 - structured error
        logger.warning("get_logbook failed: %s", exc)
        return {"error": f"{type(exc).__name__}: {exc}"}


async def get_history(
    settings: Settings,
    entity_id: str,
    start: str,
    end: str | None = None,
    *,
    transport=None,
) -> dict:
    params: dict = {"filter_entity_id": entity_id}
    if end:
        params["end_time"] = end
    try:
        data = await _rest_get(settings, f"/api/history/period/{start}", params, transport)
        return {"history": data}
    except Exception as exc:  # noqa: BLE001 - structured error
        logger.warning("get_history failed: %s", exc)
        return {"error": f"{type(exc).__name__}: {exc}"}
