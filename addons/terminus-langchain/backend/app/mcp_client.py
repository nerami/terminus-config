"""Mount the terminus-rag add-on's MCP knowledge tools into the agent.

terminus-rag (Spec 0) exposes an MCP server over Streamable HTTP at
``http://local-terminus-rag:9000/mcp`` with the read/discovery tools
``search_ha``, ``list_records``, ``get_record``, ``list_kinds``,
``get_automation_trace``, ``get_logbook``, ``get_history`` and ``refresh``.

This module builds a ``MultiServerMCPClient`` for that server, loads its tools
as native LangChain tools, and caches them across turns. terminus-rag is an
*optional* dependency: any connect/load failure logs a warning and yields an
empty tool list so the agent keeps its local actuation tools (graceful
degradation). A failed initial load is retried on a bounded backoff rather
than on every turn.
"""

from __future__ import annotations

import asyncio
import logging
import time

from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)

RAG_SERVER_NAME = "terminus_rag"

# How long to wait after a failed load before trying again (seconds). Bounded
# so a down RAG add-on does not trigger a connect attempt on every single turn.
_RETRY_BACKOFF_SECONDS = 60.0


def build_connection(settings: Settings) -> dict[str, dict]:
    """Build the MultiServerMCPClient connections mapping for terminus-rag."""
    server: dict[str, object] = {
        "transport": "streamable_http",
        "url": settings.rag_url,
    }
    if settings.rag_token:
        server["headers"] = {"Authorization": f"Bearer {settings.rag_token}"}
    return {RAG_SERVER_NAME: server}


def _default_client_factory(connections: dict[str, dict]) -> MultiServerMCPClient:
    return MultiServerMCPClient(connections)


async def load_rag_tools(
    settings: Settings,
    *,
    client_factory=_default_client_factory,
) -> list[BaseTool]:
    """Connect to terminus-rag and load its MCP tools as LangChain tools.

    Returns ``[]`` and logs a warning on any connect/load failure so the agent
    can degrade gracefully. ``client_factory`` is injectable for tests (a fake
    in-process client); production uses ``MultiServerMCPClient``.
    """
    connections = build_connection(settings)
    try:
        client = client_factory(connections)
        tools = await client.get_tools()
    except Exception as exc:  # noqa: BLE001 - degrade, never crash the agent
        cause = exc
        # anyio surfaces connect failures as a 1-child ExceptionGroup; unwrap for a clear log.
        while isinstance(cause, BaseExceptionGroup) and len(cause.exceptions) == 1:
            cause = cause.exceptions[0]
        logger.warning(
            "terminus-rag knowledge tools unavailable (%s: %s) at %s; "
            "agent will run in degraded mode.",
            type(cause).__name__,
            cause,
            settings.rag_url,
        )
        return []
    logger.info("Loaded %d terminus-rag knowledge tool(s).", len(tools))
    return list(tools)


# Cache the loaded tools across turns: the MCP client is built once and reused,
# not per request. A successful load caches the tool list; a failed load caches
# the empty result plus a timestamp so retries are bounded (see _RETRY_BACKOFF).
_TOOLS_CACHE: list[BaseTool] | None = None
_LAST_FAILED_AT: float | None = None


def _run_async(coro):
    """Run an async coroutine from sync code (build_graph is synchronous).

    build_graph runs at import time / on a worker thread with no running loop,
    so asyncio.run is correct here. If a loop is already running (unusual for
    build_graph), fall back to a dedicated loop in this thread.
    """
    try:
        return asyncio.run(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(coro)
        finally:
            loop.close()


def get_rag_tools(
    settings: Settings | None = None,
    *,
    force: bool = False,
) -> list[BaseTool]:
    """Return the cached terminus-rag tools, loading once across turns.

    Returns ``[]`` while degraded. After a failed load, retries are gated by a
    bounded backoff so a down RAG add-on is not re-probed on every turn.
    """
    global _TOOLS_CACHE, _LAST_FAILED_AT
    if settings is None:
        settings = get_settings()

    if not force and _TOOLS_CACHE:
        return _TOOLS_CACHE

    # We have no (or empty) cache. If the last attempt failed recently, stay
    # degraded without re-probing until the backoff window elapses.
    if (
        not force
        and _TOOLS_CACHE is not None
        and _LAST_FAILED_AT is not None
        and (time.monotonic() - _LAST_FAILED_AT) < _RETRY_BACKOFF_SECONDS
    ):
        return _TOOLS_CACHE

    tools = _run_async(load_rag_tools(settings))
    _TOOLS_CACHE = tools
    # Empty load is treated as failure: the terminus-rag contract guarantees ≥1 tool
    # (it exports 8), so empty means the server is unreachable/broken; backoff blocks retries.
    _LAST_FAILED_AT = None if tools else time.monotonic()
    return tools


def reset_rag_cache() -> None:
    """Clear the cached tools + failure timestamp (test hook)."""
    global _TOOLS_CACHE, _LAST_FAILED_AT
    _TOOLS_CACHE = None
    _LAST_FAILED_AT = None
