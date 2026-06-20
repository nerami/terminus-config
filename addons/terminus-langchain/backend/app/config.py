"""Resolve add-on options and the Home Assistant connection details.

Inside the Supervisor the add-on talks to Core through the Supervisor proxy
(``ws://supervisor/core/websocket``) authenticated with ``SUPERVISOR_TOKEN``.
For local development outside the Supervisor we fall back to an explicit HA URL
plus a long-lived access token.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

OPTIONS_PATH = Path("/data/options.json")
SUPERVISOR_WS_URL = "ws://supervisor/core/websocket"
DEFAULT_MODEL = "claude-sonnet-4-6"
# Chat titles are tiny, throwaway generations, so they default to a cheaper,
# faster model than the agent itself.
DEFAULT_TITLE_MODEL = "claude-haiku-4-5"


@dataclass(frozen=True)
class Settings:
    ws_url: str
    ha_token: str | None
    anthropic_api_key: str
    model: str
    use_supervisor: bool
    auto_run_tools: bool = False
    title_model: str = DEFAULT_TITLE_MODEL


def _as_bool(value: object) -> bool:
    """Parse an add-on option / env var into a bool (HA passes strings)."""
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ("true", "1", "yes", "on")


def _normalize_ws_url(raw: str) -> str:
    """Turn any HA URL form into a ``ws(s)://host/api/websocket`` endpoint."""
    url = raw.strip().rstrip("/")
    if url.endswith("/api/websocket"):
        url = url[: -len("/api/websocket")]

    if url.startswith("https://"):
        base = "wss://" + url[len("https://") :]
    elif url.startswith("http://"):
        base = "ws://" + url[len("http://") :]
    elif url.startswith(("ws://", "wss://")):
        base = url
    else:
        base = "ws://" + url

    return base + "/api/websocket"


def rest_target(settings: "Settings") -> tuple[str | None, str | None]:
    """The Home Assistant REST base URL and bearer token for the agent tool.

    Inside the Supervisor this is the Core proxy (``http://supervisor/core``);
    in dev it is derived from the configured websocket URL. Returns ``(None,
    None)`` when no connection is configured.
    """
    if settings.use_supervisor:
        return "http://supervisor/core", settings.ha_token
    if not settings.ws_url or not settings.ha_token:
        return None, None
    base = settings.ws_url
    if base.endswith("/api/websocket"):
        base = base[: -len("/api/websocket")]
    if base.startswith("wss://"):
        base = "https://" + base[len("wss://") :]
    elif base.startswith("ws://"):
        base = "http://" + base[len("ws://") :]
    return base, settings.ha_token


def load_options(path: Path = OPTIONS_PATH) -> dict:
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return {}


def load_settings(
    env: Mapping[str, str] | None = None,
    options: Mapping[str, object] | None = None,
) -> Settings:
    env = os.environ if env is None else env
    options = load_options() if options is None else options

    anthropic_api_key = str(
        options.get("anthropic_api_key") or env.get("ANTHROPIC_API_KEY", "")
    )
    model = str(options.get("model") or env.get("TLC_MODEL") or DEFAULT_MODEL)
    title_model = str(
        options.get("title_model")
        or env.get("TLC_TITLE_MODEL")
        or DEFAULT_TITLE_MODEL
    )

    auto_run_tools = _as_bool(
        options.get("auto_run_tools")
        if options.get("auto_run_tools") is not None
        else env.get("AUTO_RUN_TOOLS", "")
    )

    supervisor_token = env.get("SUPERVISOR_TOKEN")
    if supervisor_token:
        return Settings(
            ws_url=SUPERVISOR_WS_URL,
            ha_token=supervisor_token,
            anthropic_api_key=anthropic_api_key,
            model=model,
            use_supervisor=True,
            auto_run_tools=auto_run_tools,
            title_model=title_model,
        )

    raw_url = str(
        options.get("ha_url") or env.get("HASS_URL") or env.get("HA_URL") or ""
    )
    ha_token = (
        options.get("ha_token")
        or env.get("HASS_TOKEN")
        or env.get("HA_TOKEN")
        or None
    )
    return Settings(
        ws_url=_normalize_ws_url(raw_url) if raw_url else "",
        ha_token=str(ha_token) if ha_token else None,
        anthropic_api_key=anthropic_api_key,
        model=model,
        use_supervisor=False,
        auto_run_tools=auto_run_tools,
        title_model=title_model,
    )
