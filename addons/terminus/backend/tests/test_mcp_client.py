"""Tests for the terminus-rag MCP tool loader."""


def test_langchain_mcp_adapters_is_importable():
    """The MCP adapter dependency must be installed in the backend env."""
    from langchain_mcp_adapters.client import MultiServerMCPClient

    assert MultiServerMCPClient is not None


from app.config import Settings


def _settings(rag_url="http://local-terminus-rag:9000/mcp", rag_token=None):
    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
        rag_url=rag_url,
        rag_token=rag_token,
    )


def test_build_connection_streamable_http_no_token():
    from app.mcp_client import RAG_SERVER_NAME, build_connection

    conn = build_connection(_settings())
    assert set(conn) == {RAG_SERVER_NAME}
    server = conn[RAG_SERVER_NAME]
    assert server["transport"] == "streamable_http"
    assert server["url"] == "http://local-terminus-rag:9000/mcp"
    assert "headers" not in server  # no token -> no auth header


def test_build_connection_adds_bearer_header_when_token_set():
    from app.mcp_client import RAG_SERVER_NAME, build_connection

    conn = build_connection(_settings(rag_token="secret-tok"))
    headers = conn[RAG_SERVER_NAME]["headers"]
    assert headers == {"Authorization": "Bearer secret-tok"}


import pytest
from langchain_core.tools import tool


@tool
def fake_search_ha(query: str) -> str:
    """Fake terminus-rag search tool for tests."""
    return "[]"


@tool
def fake_list_records(kind: str) -> str:
    """Fake terminus-rag enumeration tool for tests."""
    return "[]"


class FakeClient:
    """In-process stand-in for MultiServerMCPClient."""

    def __init__(self, connections, *, tools=None, error=None):
        self.connections = connections
        self._tools = tools or []
        self._error = error

    async def get_tools(self):
        if self._error is not None:
            raise self._error
        return list(self._tools)


async def test_load_rag_tools_returns_loaded_tools():
    from app.mcp_client import load_rag_tools

    captured = {}

    def factory(connections):
        captured["connections"] = connections
        return FakeClient(connections, tools=[fake_search_ha, fake_list_records])

    tools = await load_rag_tools(_settings(), client_factory=factory)

    assert [t.name for t in tools] == ["fake_search_ha", "fake_list_records"]
    assert captured["connections"]["terminus_rag"]["url"].endswith("/mcp")


async def test_load_rag_tools_returns_empty_and_logs_on_failure(caplog):
    from app.mcp_client import load_rag_tools

    def factory(connections):
        return FakeClient(connections, error=ConnectionError("rag down"))

    with caplog.at_level("WARNING"):
        tools = await load_rag_tools(_settings(), client_factory=factory)

    assert tools == []
    assert any(
        "terminus-rag" in r.message.lower() or "rag" in r.message.lower()
        for r in caplog.records
    )


async def test_load_rag_tools_unwraps_exception_group_in_log(caplog):
    """ExceptionGroup is unwrapped to show the real connect error in the log."""
    from app.mcp_client import load_rag_tools

    def factory(connections):
        # Simulate anyio TaskGroup wrapping a single connection error
        inner_error = ConnectionError("terminus-rag unreachable")
        wrapped = BaseExceptionGroup("unhandled errors in a TaskGroup (1 sub-exception)", [inner_error])
        return FakeClient(connections, error=wrapped)

    with caplog.at_level("WARNING"):
        tools = await load_rag_tools(_settings(), client_factory=factory)

    assert tools == []
    # Verify the log contains the unwrapped error type and message, not "TaskGroup"
    log_msg = " ".join(r.message for r in caplog.records)
    assert "ConnectionError" in log_msg
    assert "terminus-rag unreachable" in log_msg
    assert "TaskGroup" not in log_msg


def test_get_rag_tools_caches_across_calls(monkeypatch):
    """The tools are loaded once and reused across turns."""
    import app.mcp_client as mcp_client

    mcp_client.reset_rag_cache()
    calls = {"n": 0}

    async def fake_load(settings, *, client_factory=None):
        calls["n"] += 1
        return [fake_search_ha]

    monkeypatch.setattr(mcp_client, "load_rag_tools", fake_load)

    first = mcp_client.get_rag_tools(_settings())
    second = mcp_client.get_rag_tools(_settings())

    assert [t.name for t in first] == ["fake_search_ha"]
    assert first == second
    assert calls["n"] == 1  # loaded once, cached after
    mcp_client.reset_rag_cache()


def test_get_rag_tools_force_reloads(monkeypatch):
    import app.mcp_client as mcp_client

    mcp_client.reset_rag_cache()
    calls = {"n": 0}

    async def fake_load(settings, *, client_factory=None):
        calls["n"] += 1
        return [fake_search_ha]

    monkeypatch.setattr(mcp_client, "load_rag_tools", fake_load)
    mcp_client.get_rag_tools(_settings())
    mcp_client.get_rag_tools(_settings(), force=True)
    assert calls["n"] == 2
    mcp_client.reset_rag_cache()


def test_get_rag_tools_defaults_to_get_settings(monkeypatch):
    """With no settings passed, get_rag_tools pulls the cached Settings."""
    import app.config as config
    import app.mcp_client as mcp_client

    mcp_client.reset_rag_cache()
    config.reset_settings_cache()
    monkeypatch.setattr(
        config,
        "load_options",
        lambda path=config.OPTIONS_PATH: {"anthropic_api_key": "k"},
    )

    async def fake_load(settings, *, client_factory=None):
        assert settings.rag_url == config.DEFAULT_RAG_URL
        return [fake_list_records]

    monkeypatch.setattr(mcp_client, "load_rag_tools", fake_load)
    tools = mcp_client.get_rag_tools()
    assert [t.name for t in tools] == ["fake_list_records"]
    mcp_client.reset_rag_cache()
    config.reset_settings_cache()


def test_get_rag_tools_retries_after_backoff(monkeypatch):
    """A failed initial load is retried once the backoff window elapses."""
    import app.mcp_client as mcp_client

    mcp_client.reset_rag_cache()
    results = [[], [fake_search_ha]]  # first load fails (empty), then succeeds
    calls = {"n": 0}

    async def fake_load(settings, *, client_factory=None):
        out = results[min(calls["n"], len(results) - 1)]
        calls["n"] += 1
        return out

    monkeypatch.setattr(mcp_client, "load_rag_tools", fake_load)

    # First call: load fails -> degraded ([]), failure timestamp recorded.
    assert mcp_client.get_rag_tools(_settings()) == []
    assert calls["n"] == 1

    # Within the backoff window: no re-probe, stays degraded.
    assert mcp_client.get_rag_tools(_settings()) == []
    assert calls["n"] == 1

    # Simulate the backoff window elapsing, then it retries and succeeds.
    monkeypatch.setattr(
        mcp_client.time,
        "monotonic",
        lambda: mcp_client._LAST_FAILED_AT + 10_000.0,  # far past _RETRY_BACKOFF_SECONDS
    )
    tools = mcp_client.get_rag_tools(_settings())
    assert [t.name for t in tools] == ["fake_search_ha"]
    assert calls["n"] == 2
    mcp_client.reset_rag_cache()
