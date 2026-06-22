"""Resolve add-on options and the Home Assistant connection details.

Inside the Supervisor the add-on talks to Core through the Supervisor proxy
(``ws://supervisor/core/websocket``) authenticated with ``SUPERVISOR_TOKEN``.
For local development outside the Supervisor we fall back to an explicit HA URL
plus a long-lived access token.
"""

from __future__ import annotations

import json
import logging
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
DEFAULT_RAG_URL = "http://local-terminus-rag:9000/mcp"

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Settings:
    ws_url: str
    ha_token: str | None
    anthropic_api_key: str
    model: str
    use_supervisor: bool
    auto_run_tools: bool = False
    title_model: str = DEFAULT_TITLE_MODEL
    rag_url: str = DEFAULT_RAG_URL
    rag_token: str | None = None
    # Optional Langfuse tracing (default OFF). Resolved by load_settings; the
    # activation policy lives in app.tracing.should_trace.
    langfuse_tracing: bool = False
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_host: str = ""


def _as_bool(value: object) -> bool:
    """Parse an add-on option / env var into a bool (HA passes strings)."""
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ("true", "1", "yes", "on")


_WS_SCHEMES = ("https://", "http://", "wss://", "ws://")


def _normalize_ws_url(raw: str) -> str:
    """Turn any HA URL form into a ``ws(s)://host/api/websocket`` endpoint.

    Scheme matching is case-insensitive; ``user:pass@`` credentials are
    preserved. A scheme-only / empty input (no host) is logged (a misconfigured
    dev URL) but still returns a string rather than raising.
    """
    stripped = raw.strip()
    # Detect "no host" BEFORE slash-stripping (which would collapse ``https://``
    # into ``https:`` and make the host indistinguishable from a real one).
    no_host = stripped == "" or stripped.lower() in _WS_SCHEMES

    url = stripped.rstrip("/")
    if url.endswith("/api/websocket"):
        url = url[: -len("/api/websocket")]

    lower = url.lower()
    if lower.startswith("https://"):
        base = "wss://" + url[len("https://") :]
    elif lower.startswith("http://"):
        base = "ws://" + url[len("http://") :]
    elif lower.startswith("wss://"):
        base = "wss://" + url[len("wss://") :]
    elif lower.startswith("ws://"):
        base = "ws://" + url[len("ws://") :]
    else:
        base = "ws://" + url

    if no_host:
        logger.warning("ws url has no host: %r", raw)

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
    lower = base.lower()
    if lower.startswith("wss://"):
        base = "https://" + base[len("wss://") :]
    elif lower.startswith("ws://"):
        base = "http://" + base[len("ws://") :]
    return base, settings.ha_token


def load_options(path: Path = OPTIONS_PATH) -> dict:
    """Load add-on options from ``/data/options.json``.

    A missing file is expected (dev / first run) and silent. A present-but-
    unparseable file is a real misconfiguration and is logged before degrading
    to ``{}``.
    """
    try:
        return json.loads(path.read_text())
    except FileNotFoundError:
        return {}
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("failed to parse options at %s: %s", path, exc)
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

    rag_url = str(
        options.get("rag_url") or env.get("RAG_URL") or DEFAULT_RAG_URL
    )
    rag_token_raw = (
        options.get("rag_token") or env.get("RAG_TOKEN") or None
    )
    rag_token = str(rag_token_raw) if rag_token_raw else None

    langfuse_tracing = _as_bool(
        options.get("langfuse_tracing")
        if options.get("langfuse_tracing") is not None
        else env.get("LANGFUSE_TRACING", "")
    )
    langfuse_public_key = str(
        options.get("langfuse_public_key") or env.get("LANGFUSE_PUBLIC_KEY", "")
    )
    langfuse_secret_key = str(
        options.get("langfuse_secret_key") or env.get("LANGFUSE_SECRET_KEY", "")
    )
    langfuse_host = str(
        options.get("langfuse_host") or env.get("LANGFUSE_HOST", "")
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
            rag_url=rag_url,
            rag_token=rag_token,
            langfuse_tracing=langfuse_tracing,
            langfuse_public_key=langfuse_public_key,
            langfuse_secret_key=langfuse_secret_key,
            langfuse_host=langfuse_host,
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
        rag_url=rag_url,
        rag_token=rag_token,
        langfuse_tracing=langfuse_tracing,
        langfuse_public_key=langfuse_public_key,
        langfuse_secret_key=langfuse_secret_key,
        langfuse_host=langfuse_host,
    )


# Add-on options live in /data/options.json and only change on add-on
# restart, so a process-lifetime cache of the resolved Settings is safe.
# Tools/agent call get_settings() for the cached value; tests (and any code
# that needs a fresh read) call reset_settings_cache() first. Changing options
# in the UI requires an add-on restart/rebuild to take effect — documented.
_SETTINGS_CACHE: Settings | None = None


def get_settings() -> Settings:
    """Return the process-cached Settings, loading once on first call."""
    global _SETTINGS_CACHE
    if _SETTINGS_CACHE is None:
        _SETTINGS_CACHE = load_settings()
    return _SETTINGS_CACHE


def reset_settings_cache() -> None:
    """Clear the cached Settings (process restart equivalent; test hook)."""
    global _SETTINGS_CACHE
    _SETTINGS_CACHE = None
