"""Opt-in integration: mount a real in-process MCP server's tools.

Run with: pytest -m slow tests/test_mcp_integration.py

Stands up a minimal FastMCP server (same tool names as terminus-rag) on a
loopback port, then loads its tools through the real MultiServerMCPClient and
asserts they arrive as callable LangChain tools. No real terminus-rag add-on
needed.
"""

import asyncio
import contextlib
import socket
import threading
import time

import pytest

from app.config import Settings


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def _settings(url: str) -> Settings:
    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
        rag_url=url,
        rag_token=None,
    )


@pytest.mark.slow
async def test_real_mcp_server_tools_load():
    fastmcp = pytest.importorskip("mcp.server.fastmcp")
    from mcp.server.fastmcp import FastMCP

    from app.mcp_client import load_rag_tools

    server = FastMCP("terminus-rag-fake")

    @server.tool()
    def search_ha(query: str) -> str:
        """Semantic search over the HA knowledge index."""
        return '[{"id": "scene.evening", "name": "Evening"}]'

    @server.tool()
    def list_records(kind: str) -> str:
        """Enumerate all records of a kind."""
        return '[{"id": "scene.evening"}]'

    port = _free_port()
    url = f"http://127.0.0.1:{port}/mcp"

    # Run the FastMCP streamable-http app on a background thread.
    app = server.streamable_http_app()
    import uvicorn

    config = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="error")
    uv = uvicorn.Server(config)
    thread = threading.Thread(target=uv.run, daemon=True)
    thread.start()
    try:
        # Wait for the server to accept connections.
        for _ in range(100):
            with contextlib.suppress(OSError):
                with socket.create_connection(("127.0.0.1", port), timeout=0.2):
                    break
            time.sleep(0.1)

        tools = await load_rag_tools(_settings(url))
        names = {t.name for t in tools}
        assert "search_ha" in names
        assert "list_records" in names
    finally:
        uv.should_exit = True
        thread.join(timeout=5)
