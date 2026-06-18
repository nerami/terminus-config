"""Resolve add-on options and the Home Assistant connection details.

Inside the Supervisor the add-on talks to Core through the Supervisor proxy
(``ws://supervisor/core/websocket``) authenticated with ``SUPERVISOR_TOKEN``.
For local development outside the Supervisor we fall back to an explicit HA URL
plus a long-lived access token (mirrors ``terminus/apps/agent``).
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


@dataclass(frozen=True)
class Settings:
    ws_url: str
    ha_token: str | None
    anthropic_api_key: str
    model: str
    use_supervisor: bool


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

    supervisor_token = env.get("SUPERVISOR_TOKEN")
    if supervisor_token:
        return Settings(
            ws_url=SUPERVISOR_WS_URL,
            ha_token=supervisor_token,
            anthropic_api_key=anthropic_api_key,
            model=model,
            use_supervisor=True,
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
    )
