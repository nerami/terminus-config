"""Resolve add-on options and the Home Assistant connection.

Inside the Supervisor the add-on talks to Core through the Supervisor proxy
(``ws://supervisor/core/websocket``) authenticated with ``SUPERVISOR_TOKEN``. For
local development we fall back to an explicit HA URL plus long-lived token. Options
are read directly from ``/data/options.json`` (this is the glibc base — there is no
bashio to export them as env).
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

logger = logging.getLogger(__name__)

OPTIONS_PATH = Path("/data/options.json")
SUPERVISOR_WS_URL = "ws://supervisor/core/websocket"
DEFAULT_EMBED_MODEL = "BAAI/bge-small-en-v1.5"


@dataclass(frozen=True)
class Settings:
    ws_url: str
    ha_token: str | None
    use_supervisor: bool
    api_token: str
    refresh_interval: int
    embed_model: str
    top_k_default: int
    log_level: str


def _normalize_ws_url(raw: str) -> str:
    """Turn any HA URL form into a ``ws(s)://host/api/websocket`` endpoint."""
    url = raw.strip().rstrip("/")
    if url.endswith("/api/websocket"):
        url = url[: -len("/api/websocket")]

    if url.startswith("https://"):
        base = "wss://" + url[len("https://"):]
    elif url.startswith("http://"):
        base = "ws://" + url[len("http://"):]
    elif url.startswith(("ws://", "wss://")):
        base = url
    else:
        base = "ws://" + url
    return base + "/api/websocket"


def _as_int(value: object, default: int) -> int:
    try:
        return int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default


def rest_target(settings: "Settings") -> tuple[str | None, str | None]:
    """The HA REST base URL and bearer token, or ``(None, None)`` if unconfigured."""
    if settings.use_supervisor:
        return "http://supervisor/core", settings.ha_token
    if not settings.ws_url or not settings.ha_token:
        return None, None
    base = settings.ws_url
    if base.endswith("/api/websocket"):
        base = base[: -len("/api/websocket")]
    if base.startswith("wss://"):
        base = "https://" + base[len("wss://"):]
    elif base.startswith("ws://"):
        base = "http://" + base[len("ws://"):]
    return base, settings.ha_token


def load_options(path: Path = OPTIONS_PATH) -> dict:
    try:
        return json.loads(path.read_text())
    except FileNotFoundError:
        return {}
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("options.json present but unreadable: %s", exc)
        return {}


def load_settings(
    env: Mapping[str, str] | None = None,
    options: Mapping[str, object] | None = None,
) -> Settings:
    env = os.environ if env is None else env
    options = load_options() if options is None else options

    api_token = str(options.get("api_token") or env.get("RAG_API_TOKEN", ""))
    refresh_interval = _as_int(options.get("refresh_interval"), 600)
    embed_model = str(options.get("embed_model") or DEFAULT_EMBED_MODEL)
    top_k_default = _as_int(options.get("top_k_default"), 10)
    log_level = str(options.get("log_level") or env.get("LOG_LEVEL") or "info")

    supervisor_token = env.get("SUPERVISOR_TOKEN")
    if supervisor_token:
        return Settings(
            ws_url=SUPERVISOR_WS_URL,
            ha_token=supervisor_token,
            use_supervisor=True,
            api_token=api_token,
            refresh_interval=refresh_interval,
            embed_model=embed_model,
            top_k_default=top_k_default,
            log_level=log_level,
        )

    raw_url = str(options.get("ha_url") or env.get("HASS_URL") or env.get("HA_URL") or "")
    ha_token = (
        options.get("ha_token") or env.get("HASS_TOKEN") or env.get("HA_TOKEN") or None
    )
    return Settings(
        ws_url=_normalize_ws_url(raw_url) if raw_url else "",
        ha_token=str(ha_token) if ha_token else None,
        use_supervisor=False,
        api_token=api_token,
        refresh_interval=refresh_interval,
        embed_model=embed_model,
        top_k_default=top_k_default,
        log_level=log_level,
    )
