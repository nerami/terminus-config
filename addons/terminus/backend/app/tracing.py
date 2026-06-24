"""Optional Langfuse tracing for the agent graph — default OFF, opt-in.

Tracing ships prompts (live HA state + the user's messages) off-device, so the
gate is fail-closed: ``build_tracer`` returns ``None`` (no tracing) on any
doubt, and tracing never blocks or crashes the agent.

Wiring: ``agent.py:build_graph`` calls ``build_tracer(settings)`` once and, if
it returns a handler, attaches it with ``graph.with_config({"callbacks":[h]})``
so every LangGraph-dev-server invocation traces automatically.
"""

from __future__ import annotations

import logging
from ipaddress import ip_address
from urllib.parse import urlparse

from app.config import Settings

logger = logging.getLogger(__name__)


def build_tracer(settings: Settings):
    """Return a Langfuse ``CallbackHandler`` if tracing is on & safe, else ``None``.

    Guards the import so a missing ``langfuse`` dependency degrades to "no
    tracing" instead of an ImportError at graph-build time.
    """
    if not should_trace(settings):
        return None
    try:
        from langfuse import Langfuse
        from langfuse.langchain import CallbackHandler
    except ImportError:
        logger.warning("langfuse not installed; tracing requested but disabled")
        return None

    # SDK v4: configure the singleton client once; CallbackHandler() reads it.
    Langfuse(
        public_key=settings.langfuse_public_key,
        secret_key=settings.langfuse_secret_key,
        base_url=settings.langfuse_base_url,
    )
    logger.info("Langfuse tracing enabled → %s", settings.langfuse_base_url)
    return CallbackHandler()


def should_trace(settings: Settings) -> bool:
    """Decide whether tracing should activate — fail-closed, private-LAN only.

    Returns True only when tracing is explicitly switched on, fully
    credentialed, AND pointed at a private-LAN host. Every other path returns
    False and logs WHY (no silent no-op). A non-IP hostname can't be proven
    local, so it is refused (fail-closed); ``127.0.0.1`` and RFC1918 ranges
    pass. Refusing public hosts is the point of self-hosting over LangSmith.
    """
    if not settings.langfuse_tracing:
        return False
    if not (
        settings.langfuse_public_key
        and settings.langfuse_secret_key
        and settings.langfuse_base_url
    ):
        logger.warning(
            "langfuse_tracing is on but credentials/base_url are incomplete; "
            "tracing disabled"
        )
        return False
    host = urlparse(settings.langfuse_base_url).hostname or ""
    try:
        is_private = ip_address(host).is_private
    except ValueError:
        # Not a literal IP (hostname / empty) — can't prove it's local.
        is_private = False
    if not is_private:
        logger.warning(
            "langfuse_base_url %r is not a private-LAN address; tracing disabled",
            settings.langfuse_base_url,
        )
        return False
    return True
