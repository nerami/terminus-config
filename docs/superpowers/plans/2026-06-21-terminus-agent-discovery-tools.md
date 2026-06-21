# Terminus Agent Knowledge Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mount the `terminus-rag` add-on's MCP knowledge tools (semantic search, full enumeration, exact lookup, on-demand history) into the Terminus LangGraph agent alongside its three local tools, so the agent can discover "the bedroom lamp", list every scene, and answer "why didn't automation X fire" — while keeping actuation local and approval-gated and degrading gracefully when `terminus-rag` is offline.

**Architecture:** A new isolated `app/mcp_client.py` builds a `langchain_mcp_adapters.MultiServerMCPClient` pointed at `http://local-terminus-rag:9000/mcp` (Streamable HTTP, optional `Authorization: Bearer` header), loads its tools as native LangChain tools, and caches them across turns. `build_graph()` in `app/agent.py` appends those RAG tools to the local three (`ha_basic_info`, `run_scene`, `trigger_automation`); on any connect/load failure it proceeds with `rag_tools=[]` and switches the system prompt into a documented degraded mode. The human-approval interrupt continues to gate only `run_scene`/`trigger_automation` — the read-only RAG tools are never listed in `interrupt_on`, so they never pause. `config.py` gains `rag_url`/`rag_token` options and a memoized `load_settings`.

**Tech Stack:** Python 3.12, LangChain/LangGraph 1.0, `langchain-mcp-adapters` (`MultiServerMCPClient`, Streamable HTTP transport), `langchain-anthropic` (Sonnet 4.6), pytest + `pytest-asyncio` (`asyncio_mode="auto"`).

**Depends on:** **Spec 0 — `terminus-rag`** (`2026-06-21-terminus-rag-addon-design.md`). This plan mounts the MCP tools that the `terminus-rag` add-on exposes at `http://local-terminus-rag:9000/mcp`: `search_ha`, `list_records`, `get_record`, `list_kinds`, `get_automation_trace`, `get_logbook`, `get_history`, `refresh`. `terminus-rag` must be deployable for end-to-end behavior, but **every task in this plan is testable without it** — unit tests use a fake/in-process MCP server, and the agent's graceful-degradation path is exercised with the RAG endpoint absent. The opt-in integration task (Task 9) is the only one that needs a live MCP server.

## Global Constraints

These apply to **every** task below; each task's requirements implicitly include this section.

- **Component:** all changes under `addons/terminus-langchain/backend/` plus the add-on manifest (`addons/terminus-langchain/config.yaml`, `translations/en.yaml`). Paths in tasks are relative to the repo root `main/` worktree mirror — in this feature branch they live under `main/addons/terminus-langchain/`.
- **Base image stays `3.12-alpine3.18`.** Terminus remains on Alpine/musl. Do **NOT** add embedding/ML deps (`fastembed`, `onnxruntime`, numpy index) here — those live in the separate `terminus-rag` add-on (Spec 0, glibc `python:3.12-slim`). The only new dependency Terminus gains is `langchain-mcp-adapters` (a pure-Python wrapper).
- **Version bump only in `config.yaml`.** `config.yaml` `version` is the single canonical version and the ONLY one bumped on release. Do **NOT** bump `backend/pyproject.toml` or `frontend/package.json` — they stay pinned at `0.0.0` to preserve Docker dep-layer caching. Adding the `langchain-mcp-adapters` dep correctly invalidates the pip layer; that is expected.
- **CHANGELOG entry per bump.** Every `config.yaml` `version` bump must add a matching `CHANGELOG.md` entry under a heading equal to the new version. No bump without a changelog entry.
- **Tests:** pytest with `asyncio_mode = "auto"` (already set in `pyproject.toml`); all tests under `backend/tests/`. `async def test_*` functions run without an explicit `@pytest.mark.asyncio`.
- **TDD:** test-first, watch-it-fail, minimal implementation, watch-it-pass, then commit. Every task follows the write-test → run-fail → implement → run-pass → commit cycle.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`). Every commit message ends with the trailer block:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
  ```

- **Run tests from the backend dir.** All `pytest` commands run from `addons/terminus-langchain/backend/` (where `pyproject.toml` lives and `testpaths = ["tests"]` resolves). Assume the dev extras are installed (`pip install -e ".[server,dev]"`); the new `langchain-mcp-adapters` dep is installed in Task 1.
- **Local-add-on deploy (after merge, not per task):** sync via `bin/deploy-addons-ssh.sh`, then on device `ha apps update local_terminus` (since `config.yaml` version is bumped). Do **not** bump the version to test iterations — Rebuild for source-only changes.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `addons/terminus-langchain/backend/pyproject.toml` | Add `langchain-mcp-adapters` to `[project] dependencies`. |
| Modify | `addons/terminus-langchain/backend/app/config.py` | Add `rag_url`/`rag_token` to `Settings`; resolve them in `load_settings`; memoize `load_settings` via a cache + `reset_settings_cache()`. |
| Create | `addons/terminus-langchain/backend/app/mcp_client.py` | Build the `MultiServerMCPClient` for `terminus-rag`, load + cache its tools, return `[]` + log on failure, retry on bounded backoff, pass the bearer header when `rag_token` is set. |
| Modify | `addons/terminus-langchain/backend/app/agent.py` | `build_graph()` mounts RAG tools beside the local three; rewrite `_BASE_PROMPT` (advertise knowledge tools, drop the apology, discover-before-act, history guidance, degraded-mode text, keep `{approval}` slot); thread a `rag_available` flag into the prompt. |
| Modify | `addons/terminus-langchain/config.yaml` | Add `rag_url`/`rag_token` options + schema; bump `version`. |
| Modify | `addons/terminus-langchain/translations/en.yaml` | Document `rag_url`/`rag_token`. |
| Modify | `addons/terminus-langchain/CHANGELOG.md` | Entry for the new version. |
| Create | `addons/terminus-langchain/backend/tests/test_mcp_client.py` | Unit tests for `mcp_client` against a fake/in-process MCP server. |
| Modify | `addons/terminus-langchain/backend/tests/test_config.py` | Tests for `rag_url`/`rag_token` resolution + memoized `load_settings`. |
| Modify | `addons/terminus-langchain/backend/tests/test_agent.py` | Tests for tool mounting, degraded-mode prompt, approval still gates only the two local tools. |

### Confirmed `langchain-mcp-adapters` API (verified via context7, `/langchain-ai/langchain-mcp-adapters`)

The implementation below depends on these exact facts — do not guess:

- `MultiServerMCPClient(connections: dict[str, dict])` — keyed by server name; each value is a connection dict.
- Streamable HTTP connection dict: `{"transport": "streamable_http", "url": "...", "headers": {...}, "timeout": <float|timedelta>}`. `"streamable_http"` is canonical; `"http"` and `"streamable-http"` are accepted aliases.
- `headers` carries auth: `{"Authorization": "Bearer <token>"}`.
- `tools = await client.get_tools()` returns `list[BaseTool]` (one combined list across all servers). `client.get_tools(server_name="...")` scopes to one server. **`get_tools` is a coroutine** — `build_graph()` is synchronous, so the plan bridges async→sync with `asyncio.run` / running-loop detection (Task 3).
- Low-level alternative `load_mcp_tools(session=None, connection={...})` exists but we use the `MultiServerMCPClient.get_tools()` path (idiomatic, matches the spec's "no bespoke HTTP client" decision).

---

## Task 1: Add the `langchain-mcp-adapters` dependency

**Files:**
- Modify: `addons/terminus-langchain/backend/pyproject.toml:9-17`

**Interfaces:**
- Produces: `langchain_mcp_adapters.client.MultiServerMCPClient` importable in the backend env.

- [ ] **Step 1: Write the failing test**

Add to `addons/terminus-langchain/backend/tests/test_mcp_client.py` (new file):

```python
"""Tests for the terminus-rag MCP tool loader."""


def test_langchain_mcp_adapters_is_importable():
    """The MCP adapter dependency must be installed in the backend env."""
    from langchain_mcp_adapters.client import MultiServerMCPClient

    assert MultiServerMCPClient is not None
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py::test_langchain_mcp_adapters_is_importable -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'langchain_mcp_adapters'`.

- [ ] **Step 3: Add the dependency**

Edit `addons/terminus-langchain/backend/pyproject.toml`, adding the dep to the `[project] dependencies` list (keep the existing entries):

```toml
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.34",
    "httpx>=0.28",
    "websockets>=14",
    "langchain>=1.0",
    "langgraph>=1.0",
    "langchain-anthropic>=1.0",
    "langchain-mcp-adapters>=0.1",
]
```

Then install it into the dev env:

```bash
cd addons/terminus-langchain/backend && pip install -e ".[server,dev]"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py::test_langchain_mcp_adapters_is_importable -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/pyproject.toml addons/terminus-langchain/backend/tests/test_mcp_client.py
git commit -m "$(cat <<'EOF'
feat(terminus): add langchain-mcp-adapters dependency

Pulls in MultiServerMCPClient so the agent can mount terminus-rag's
MCP knowledge tools. Pure-Python wrapper — keeps Terminus on Alpine.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 2: Config — `rag_url`/`rag_token` options + memoized `load_settings`

**Files:**
- Modify: `addons/terminus-langchain/backend/app/config.py:25-34` (`Settings` dataclass), `:82-141` (`load_settings`)
- Modify: `addons/terminus-langchain/backend/tests/test_config.py`

**Interfaces:**
- Produces:
  - `Settings.rag_url: str = ""` and `Settings.rag_token: str | None = None` (new fields, defaulted so existing `Settings(...)` constructions in tests stay valid).
  - `DEFAULT_RAG_URL = "http://local-terminus-rag:9000/mcp"` module constant.
  - `load_settings(env=None, options=None)` resolves `rag_url` from `options["rag_url"]` / env `RAG_URL`, falling back to `DEFAULT_RAG_URL`; resolves `rag_token` from `options["rag_token"]` / env `RAG_TOKEN`, falling back to `None`.
  - `get_settings() -> Settings` — memoized, zero-arg accessor that caches the result of `load_settings()` (no `env`/`options` overrides) across calls.
  - `reset_settings_cache() -> None` — clears the cache (test hook; documents that runtime options changes need an add-on restart anyway).

### 2a — `rag_url`/`rag_token` resolution

- [ ] **Step 1: Write the failing tests**

Append to `addons/terminus-langchain/backend/tests/test_config.py`:

```python
from app.config import DEFAULT_RAG_URL


def test_rag_url_defaults_to_internal_host():
    settings = load_settings(env={}, options={})
    assert settings.rag_url == DEFAULT_RAG_URL
    assert settings.rag_url == "http://local-terminus-rag:9000/mcp"


def test_rag_url_from_options_overrides_default():
    settings = load_settings(
        env={}, options={"rag_url": "http://rag.test:9000/mcp"}
    )
    assert settings.rag_url == "http://rag.test:9000/mcp"


def test_rag_url_from_env_when_options_empty():
    settings = load_settings(env={"RAG_URL": "http://envrag:9000/mcp"}, options={})
    assert settings.rag_url == "http://envrag:9000/mcp"


def test_rag_token_defaults_none_and_reads_options_then_env():
    assert load_settings(env={}, options={}).rag_token is None
    assert (
        load_settings(env={}, options={"rag_token": "tok"}).rag_token == "tok"
    )
    assert (
        load_settings(env={"RAG_TOKEN": "etok"}, options={}).rag_token == "etok"
    )


def test_rag_settings_carried_in_supervisor_mode():
    settings = load_settings(
        env={"SUPERVISOR_TOKEN": "super"},
        options={"rag_url": "http://r:9000/mcp", "rag_token": "t"},
    )
    assert settings.use_supervisor is True
    assert settings.rag_url == "http://r:9000/mcp"
    assert settings.rag_token == "t"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_config.py -k rag -v`
Expected: FAIL — `ImportError: cannot import name 'DEFAULT_RAG_URL'`.

- [ ] **Step 3: Implement the new fields + resolution**

In `addons/terminus-langchain/backend/app/config.py`, add the constant near the other module constants (after `DEFAULT_TITLE_MODEL`):

```python
DEFAULT_RAG_URL = "http://local-terminus-rag:9000/mcp"
```

Add the fields to the `Settings` dataclass (after `title_model`):

```python
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
```

Inside `load_settings`, after the `auto_run_tools` block and before the `supervisor_token` branch, resolve the two values once so both branches reuse them:

```python
    rag_url = str(
        options.get("rag_url") or env.get("RAG_URL") or DEFAULT_RAG_URL
    )
    rag_token_raw = (
        options.get("rag_token") or env.get("RAG_TOKEN") or None
    )
    rag_token = str(rag_token_raw) if rag_token_raw else None
```

Then pass `rag_url=rag_url, rag_token=rag_token` to **both** `Settings(...)` constructions (the supervisor branch and the dev-fallback branch). The supervisor-branch return becomes:

```python
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
        )
```

and the dev-fallback return becomes:

```python
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
    )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_config.py -k rag -v`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/config.py addons/terminus-langchain/backend/tests/test_config.py
git commit -m "$(cat <<'EOF'
feat(terminus): resolve rag_url/rag_token add-on options

Adds the terminus-rag connection settings (default internal host
http://local-terminus-rag:9000/mcp, optional bearer token), mirroring
the ha_url/ha_token dev-fallback pattern.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

### 2b — Memoize `load_settings` via `get_settings()`

- [ ] **Step 1: Write the failing tests**

Append to `addons/terminus-langchain/backend/tests/test_config.py`:

```python
def test_get_settings_memoizes_options_read(monkeypatch):
    """get_settings reads /data/options.json + env once, then caches."""
    import app.config as config

    config.reset_settings_cache()
    calls = {"n": 0}

    def counting_load_options(path=config.OPTIONS_PATH):
        calls["n"] += 1
        return {"anthropic_api_key": "sk", "model": "claude-sonnet-4-6"}

    monkeypatch.setattr(config, "load_options", counting_load_options)

    first = config.get_settings()
    second = config.get_settings()

    assert first is second  # same cached object
    assert calls["n"] == 1  # options read exactly once
    config.reset_settings_cache()


def test_reset_settings_cache_forces_reload(monkeypatch):
    import app.config as config

    config.reset_settings_cache()
    monkeypatch.setattr(
        config, "load_options", lambda path=config.OPTIONS_PATH: {}
    )
    first = config.get_settings()
    config.reset_settings_cache()
    second = config.get_settings()
    assert first is not second
    config.reset_settings_cache()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_config.py -k "memoize or reset" -v`
Expected: FAIL — `AttributeError: module 'app.config' has no attribute 'get_settings'` / `reset_settings_cache`.

- [ ] **Step 3: Implement the memoized accessor**

At the bottom of `addons/terminus-langchain/backend/app/config.py`, add:

```python
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
```

> Note: `load_settings(env=None, options=None)` stays pure and override-friendly (existing tests and the new `mcp_client`/`agent` tests pass explicit options). `get_settings()` is the memoized zero-arg path that production code uses.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v`
Expected: PASS (all config tests, including the new memoization ones).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/config.py addons/terminus-langchain/backend/tests/test_config.py
git commit -m "$(cat <<'EOF'
feat(terminus): memoize settings via get_settings()

Options only change on add-on restart, so cache the resolved Settings
for the process lifetime. reset_settings_cache() clears it for tests.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 3: `mcp_client.py` — load + cache RAG tools, graceful degradation

This is the core new module. It is isolated so it can be unit-tested against a **fake/in-process MCP server** with no real `terminus-rag` add-on. The plan builds it in four sub-tasks: (3a) build the connection config, (3b) load tools async against a fake server, (3c) sync entrypoint with degradation + caching, (3d) bounded-backoff retry.

**Files:**
- Create: `addons/terminus-langchain/backend/app/mcp_client.py`
- Modify: `addons/terminus-langchain/backend/tests/test_mcp_client.py`

**Interfaces:**
- Consumes: `app.config.Settings` (fields `rag_url`, `rag_token`); `langchain_mcp_adapters.client.MultiServerMCPClient`.
- Produces:
  - `RAG_SERVER_NAME = "terminus_rag"` module constant.
  - `build_connection(settings: Settings) -> dict[str, dict]` — the `MultiServerMCPClient` connections mapping for the RAG server (`{"terminus_rag": {"transport": "streamable_http", "url": settings.rag_url, ["headers": {"Authorization": "Bearer ..."}]}}`).
  - `async def load_rag_tools(settings: Settings, *, client_factory=None) -> list[BaseTool]` — connects + loads tools; returns `[]` and logs a warning on any failure. `client_factory(connections) -> client-with-async-get_tools` is injectable for tests.
  - `get_rag_tools(settings: Settings | None = None, *, force: bool = False) -> list[BaseTool]` — **sync**, cached across turns; bounded-backoff retry after a failed initial load; returns `[]` while degraded.
  - `reset_rag_cache() -> None` — clears the module cache (test hook).

### 3a — `build_connection`

- [ ] **Step 1: Write the failing tests**

Append to `addons/terminus-langchain/backend/tests/test_mcp_client.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k build_connection -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.mcp_client'`.

- [ ] **Step 3: Implement `build_connection`**

Create `addons/terminus-langchain/backend/app/mcp_client.py`:

```python
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

from app.config import Settings

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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k build_connection -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/mcp_client.py addons/terminus-langchain/backend/tests/test_mcp_client.py
git commit -m "$(cat <<'EOF'
feat(terminus): build terminus-rag MCP connection config

build_connection() produces the MultiServerMCPClient streamable_http
config, attaching an Authorization bearer header only when rag_token is set.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

### 3b — `load_rag_tools` (async, fake in-process MCP client)

- [ ] **Step 1: Write the failing tests**

These use a **fake client** injected via `client_factory` — a stand-in for `MultiServerMCPClient` whose async `get_tools()` returns deterministic fake LangChain tools. No real `terminus-rag` add-on is involved. Append to `tests/test_mcp_client.py`:

```python
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
    """In-process stand-in for MultiServerMCPClient.

    Records the connections it was built with and returns canned tools (or
    raises) from an async get_tools(), matching the real coroutine contract.
    """

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
    # The factory received the streamable_http connection we built.
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k load_rag_tools -v`
Expected: FAIL — `ImportError: cannot import name 'load_rag_tools'`.

- [ ] **Step 3: Implement `load_rag_tools`**

Add to `app/mcp_client.py`:

```python
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
        logger.warning(
            "terminus-rag knowledge tools unavailable (%s) at %s; "
            "agent will run in degraded mode.",
            exc,
            settings.rag_url,
        )
        return []
    logger.info("Loaded %d terminus-rag knowledge tool(s).", len(tools))
    return list(tools)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k load_rag_tools -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/mcp_client.py addons/terminus-langchain/backend/tests/test_mcp_client.py
git commit -m "$(cat <<'EOF'
feat(terminus): load terminus-rag MCP tools with degradation

load_rag_tools() loads the RAG server's MCP tools as LangChain tools,
returning [] and logging a warning on any failure so the agent never
hard-fails on an optional add-on. Tested against a fake in-process client.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

### 3c — `get_rag_tools` (sync, cached across turns)

`build_graph()` is synchronous, but `get_tools()` is a coroutine. `get_rag_tools` bridges that and caches the loaded tools so the client is built once and reused across turns (not per request).

- [ ] **Step 1: Write the failing tests**

Append to `tests/test_mcp_client.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k "get_rag_tools" -v`
Expected: FAIL — `AttributeError: module 'app.mcp_client' has no attribute 'get_rag_tools'` / `reset_rag_cache`.

- [ ] **Step 3: Implement the sync cached entrypoint**

Add to `app/mcp_client.py` (imports `asyncio`, `time` already at top; add `get_settings` import):

Update the config import line at the top of the module:

```python
from app.config import Settings, get_settings
```

Then add at the bottom:

```python
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
    _LAST_FAILED_AT = None if tools else time.monotonic()
    return tools


def reset_rag_cache() -> None:
    """Clear the cached tools + failure timestamp (test hook)."""
    global _TOOLS_CACHE, _LAST_FAILED_AT
    _TOOLS_CACHE = None
    _LAST_FAILED_AT = None
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -k "get_rag_tools" -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/mcp_client.py addons/terminus-langchain/backend/tests/test_mcp_client.py
git commit -m "$(cat <<'EOF'
feat(terminus): cache terminus-rag tools across turns

get_rag_tools() bridges the async loader into synchronous build_graph and
caches the loaded tools so the MCP client is built once, not per request.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

### 3d — Bounded-backoff retry after an initial failure

- [ ] **Step 1: Write the failing test**

Append to `tests/test_mcp_client.py`:

```python
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
        lambda: 10_000.0,  # far past _RETRY_BACKOFF_SECONDS from the failure
    )
    tools = mcp_client.get_rag_tools(_settings())
    assert [t.name for t in tools] == ["fake_search_ha"]
    assert calls["n"] == 2
    mcp_client.reset_rag_cache()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py::test_get_rag_tools_retries_after_backoff -v`
Expected: FAIL — within the backoff window the current code re-probes (`calls["n"]` becomes 2 too early) **or** never retries, depending on the exact monotonic values. This pins the backoff semantics.

> If the test already passes against the 3c implementation, that is acceptable — 3c's cache logic already encodes the backoff. In that case, keep the test (it documents and locks the behavior) and proceed to the commit. Re-run to confirm green.

- [ ] **Step 3: Confirm / refine the backoff logic**

The 3c implementation already records `_LAST_FAILED_AT = time.monotonic()` on an empty load and gates re-probing on `_RETRY_BACKOFF_SECONDS`. Verify the gate compares `time.monotonic() - _LAST_FAILED_AT`; no code change is needed if the test passes. If it fails because the empty cache is treated as "not yet loaded", ensure the failed-load branch in `get_rag_tools` is reached for an empty (non-None) `_TOOLS_CACHE` — i.e. the early-return `if not force and _TOOLS_CACHE:` only fires for a **non-empty** list, which is correct.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_mcp_client.py -v`
Expected: PASS (all `mcp_client` tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/tests/test_mcp_client.py addons/terminus-langchain/backend/app/mcp_client.py
git commit -m "$(cat <<'EOF'
test(terminus): lock terminus-rag bounded-backoff retry

A failed initial RAG load stays degraded within the backoff window and
retries only after it elapses — no re-probe on every turn.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 4: `agent.py` — rewrite `_BASE_PROMPT` (advertise tools, degraded mode)

The prompt rewrite is a self-contained, testable change: it advertises the knowledge tools, deletes the "can't list what exists" apology, adds discover-before-act + history guidance, and adds a degraded-mode clause keyed off a `rag_available` flag. Tool mounting lands in Task 5; this task wires the prompt to accept the flag.

**Files:**
- Modify: `addons/terminus-langchain/backend/app/agent.py:26-66` (`_BASE_PROMPT`, `_system_prompt`)
- Modify: `addons/terminus-langchain/backend/tests/test_agent.py`

**Interfaces:**
- Consumes: nothing new.
- Produces: `_system_prompt(auto_run: bool, rag_available: bool = True) -> str` — renders the base prompt with both the approval clause and a knowledge-tools clause that flips between "available" and "degraded" copy.

- [ ] **Step 1: Write the failing tests**

Append to `addons/terminus-langchain/backend/tests/test_agent.py`:

```python
from app.agent import _system_prompt


def test_prompt_advertises_knowledge_tools_when_available():
    text = _system_prompt(auto_run=True, rag_available=True)
    # Advertises discovery / enumeration capability...
    assert "search_ha" in text
    assert "list_records" in text
    # ...and the old apology is gone.
    assert "can't" not in text.lower() or "list what exists" not in text.lower()
    assert "list what exists" not in text.lower()


def test_prompt_instructs_discover_before_act():
    text = _system_prompt(auto_run=True, rag_available=True)
    lower = text.lower()
    assert "search_ha" in text and "list_records" in text
    # Discover-before-act + confirm ambiguous matches.
    assert "ambiguous" in lower
    assert "before" in lower


def test_prompt_has_history_guidance():
    text = _system_prompt(auto_run=True, rag_available=True)
    assert "get_automation_trace" in text
    assert "get_logbook" in text
    assert "get_history" in text
    assert "retention" in text.lower()


def test_prompt_degraded_mode_text_when_rag_unavailable():
    text = _system_prompt(auto_run=True, rag_available=False)
    lower = text.lower()
    # Tells the model knowledge tools are offline and to ask for exact ids.
    assert "offline" in lower or "unavailable" in lower
    assert "exact id" in lower or "exact ids" in lower
    # Actuation + instance status still work.
    assert "ha_basic_info" in text


def test_prompt_keeps_approval_and_error_clauses():
    gated = _system_prompt(auto_run=False, rag_available=True)
    assert "pause for your sign-off" in gated
    auto = _system_prompt(auto_run=True, rag_available=True)
    assert "run immediately" in auto
    # "report errors plainly" guidance survives.
    assert "report it plainly" in gated.lower() or "plainly" in gated.lower()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -k "prompt_advertises or discover_before or history_guidance or degraded_mode or keeps_approval" -v`
Expected: FAIL — `_system_prompt() takes 1 positional argument` / missing `search_ha`, `get_logbook`, etc. in the prompt text.

- [ ] **Step 3: Rewrite `_BASE_PROMPT` and `_system_prompt`**

In `addons/terminus-langchain/backend/app/agent.py`, replace the `_BASE_PROMPT` definition (the block from `_BASE_PROMPT = (` through its closing `)`) and the `_system_prompt` function with:

```python
# The base prompt carries two runtime slots:
#   {approval}  - the approval sentence matches auto_run (gated pause vs runs
#                 immediately) so the prompt never promises a pause that won't
#                 happen.
#   {knowledge} - the knowledge-tools clause matches whether terminus-rag is
#                 reachable: full discovery copy when available, a degraded
#                 fallback when its tools are offline.
# _system_prompt() fills both slots from the resolved flags in build_graph.
_BASE_PROMPT = (
    "You are TERMINUS, a friendly process running inside a Home Assistant smart "
    "home. You speak plainly and keep things calm - terse, but never cold. You "
    "never overpromise.\n\n"
    "Your local operations (always available):\n"
    "  ha_basic_info        read instance metadata (version, config, entity counts)\n"
    "  run_scene            activate a scene by scene.* id\n"
    "  trigger_automation   execute an automation by automation.* id\n\n"
    "{knowledge}\n\n"
    "For questions about the instance itself (version, counts, config), query "
    "ha_basic_info and answer from its JSON. To set a mood, run_scene with a "
    "scene.* id; to kick off a routine, trigger_automation with an automation.* "
    "id. {approval}\n\n"
    "If a tool returns an error, report it plainly and kindly; never claim a "
    "success you didn't receive. Keep output minimal and human."
)

# Knowledge-tools clause when terminus-rag is reachable: advertise discovery,
# enumeration, exact lookup and history; instruct discover-before-act.
_KNOWLEDGE_AVAILABLE = (
    "Knowledge tools (from the home's shared index) - use these to find and "
    "inspect what exists:\n"
    "  search_ha            semantically find entities/scenes/automations/etc. "
    "by description (e.g. 'the bedroom lamp')\n"
    "  list_records         enumerate everything of a kind (every scene, every "
    "automation, ...)\n"
    "  list_kinds           what kinds are indexed, with counts\n"
    "  get_record           full details for one id once you know it\n"
    "  get_automation_trace why an automation did or didn't fire (latest trace)\n"
    "  get_logbook          human-readable 'what happened' events in a time range\n"
    "  get_history          state history for an entity in a time range\n"
    "Discover before you act: when a target id is unknown or ambiguous, call "
    "search_ha or list_records to find it rather than guessing or fabricating "
    "an id. If several candidates match, confirm which one the user means "
    "before running anything. To answer 'what happened' or 'why didn't X fire', "
    "use get_automation_trace / get_logbook / get_history - and say plainly when "
    "Home Assistant's retention window doesn't cover the period asked about."
)

# Degraded clause when terminus-rag is offline: no discovery; ask for exact ids.
_KNOWLEDGE_DEGRADED = (
    "Knowledge tools (search, enumeration, history) are currently offline, so "
    "you can't look up or list what exists right now. When a target is unknown, "
    "ask the user for the exact scene.* / automation.* id rather than guessing. "
    "Instance status (ha_basic_info) and actions (run_scene, trigger_automation) "
    "still work."
)
```

Then replace `_system_prompt`:

```python
def _system_prompt(auto_run: bool, rag_available: bool = True) -> str:
    """Render the base prompt with the approval and knowledge clauses.

    ``auto_run`` selects the approval sentence; ``rag_available`` selects the
    knowledge-tools clause (full discovery vs degraded fallback).
    """
    return _BASE_PROMPT.format(
        approval=_APPROVAL_AUTO if auto_run else _APPROVAL_GATED,
        knowledge=_KNOWLEDGE_AVAILABLE if rag_available else _KNOWLEDGE_DEGRADED,
    )
```

> The `_APPROVAL_GATED` / `_APPROVAL_AUTO` / `_TOPOLOGY_FRAME` constants and `TopologyContextMiddleware` are unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v`
Expected: PASS — the new prompt tests pass, and the **existing** prompt tests (`test_approval_clause_gated_by_default`, `test_approval_clause_reflects_auto_run`, topology tests) still pass since `build_graph` defaults `rag_available=True` for the available clause and the approval copy is unchanged.

> Note: `build_graph` still calls `_system_prompt(auto_run)`; the default `rag_available=True` keeps it valid until Task 5 passes the real flag. Existing `build_graph`-based tests stay green.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/agent.py addons/terminus-langchain/backend/tests/test_agent.py
git commit -m "$(cat <<'EOF'
feat(terminus): rewrite agent prompt for knowledge tools

Advertises search_ha/list_records/get_record/list_kinds and the history
tools, deletes the 'can't list what exists' apology, adds discover-before-act
and retention-aware history guidance, and a degraded-mode clause for when
terminus-rag is offline. Keeps the {approval} slot and error guidance.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 5: `agent.py` — mount RAG tools in `build_graph()` with graceful degradation

**Files:**
- Modify: `addons/terminus-langchain/backend/app/agent.py:117-145` (`build_graph`), imports near `:19-20`
- Modify: `addons/terminus-langchain/backend/tests/test_agent.py`

**Interfaces:**
- Consumes: `app.mcp_client.get_rag_tools(settings=None, *, force=False) -> list[BaseTool]`; `_system_prompt(auto_run, rag_available)`.
- Produces: `build_graph(model=None, *, checkpointer=None, auto_run=None, rag_tools=None)` — when `rag_tools` is `None`, it loads them via `get_rag_tools()`; the agent's tool list is `[ha_basic_info, run_scene, trigger_automation, *rag_tools]`; the prompt's `rag_available` is `bool(rag_tools)`. The `rag_tools` kwarg lets tests inject fakes / `[]` deterministically.

- [ ] **Step 1: Write the failing tests**

Append to `addons/terminus-langchain/backend/tests/test_agent.py`:

```python
from langchain_core.tools import tool


@tool
def rag_search_ha(query: str) -> str:
    """Injected fake terminus-rag search tool."""
    return "[]"


def _tool_names(graph) -> list[str]:
    """Pull the bound tool names off the compiled agent graph."""
    # create_agent compiles a ToolNode; its tools are reachable via the graph's
    # nodes. Fall back to scanning the graph for tools with a .name.
    names = []
    for node in graph.get_graph().nodes:
        pass  # node ids only; we assert via the model capture below instead
    return names


def test_build_graph_mounts_rag_tools_alongside_local(monkeypatch):
    """When RAG tools load, the agent binds local three + RAG tools."""
    bound = {}

    class BindCapture(CapturingModel):
        def bind_tools(self, tools, **kwargs):  # noqa: A002
            bound["names"] = [t.name for t in tools]
            return self

    fake = BindCapture()
    graph = build_graph(
        model=fake, auto_run=True, rag_tools=[rag_search_ha]
    )
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "ha_basic_info" in bound["names"]
    assert "run_scene" in bound["names"]
    assert "trigger_automation" in bound["names"]
    assert "rag_search_ha" in bound["names"]


def test_build_graph_degrades_to_local_three_when_rag_empty(monkeypatch):
    """RAG mount failure -> agent keeps exactly the local three tools."""
    bound = {}

    class BindCapture(CapturingModel):
        def bind_tools(self, tools, **kwargs):  # noqa: A002
            bound["names"] = [t.name for t in tools]
            return self

    fake = BindCapture()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert sorted(bound["names"]) == [
        "ha_basic_info",
        "run_scene",
        "trigger_automation",
    ]


def test_build_graph_prompt_is_degraded_when_no_rag(monkeypatch):
    """No RAG tools -> degraded-mode prompt copy is sent to the model."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "offline" in _captured_text(fake).lower()


def test_build_graph_prompt_advertises_tools_when_rag_present(monkeypatch):
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[rag_search_ha])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "search_ha" in _captured_text(fake)


def test_build_graph_loads_rag_tools_when_not_injected(monkeypatch):
    """With rag_tools=None, build_graph pulls them from get_rag_tools()."""
    import app.agent as agent

    monkeypatch.setattr(agent, "get_rag_tools", lambda: [rag_search_ha])
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)  # rag_tools defaults to None
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "search_ha" in _captured_text(fake)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -k "mounts_rag or degrades_to_local or prompt_is_degraded or advertises_tools_when or loads_rag_tools_when" -v`
Expected: FAIL — `build_graph() got an unexpected keyword argument 'rag_tools'`.

- [ ] **Step 3: Wire RAG tools into `build_graph`**

In `addons/terminus-langchain/backend/app/agent.py`, add the import next to the existing tools import (around line 20):

```python
from app.config import load_settings
from app.mcp_client import get_rag_tools
from app.tools import ha_basic_info, run_scene, trigger_automation
```

Replace the `build_graph` function with:

```python
def build_graph(
    model: Optional[BaseChatModel] = None,
    *,
    checkpointer=None,
    auto_run: Optional[bool] = None,
    rag_tools=None,
):
    settings = load_settings()
    if model is None:
        model = ChatAnthropic(model=settings.model)
    # When auto-run is enabled (add-on option), state-changing tools run without
    # the human approval interrupt; otherwise they require approval.
    if auto_run is None:
        auto_run = settings.auto_run_tools

    # Mount the terminus-rag knowledge tools beside the local three. Loading is
    # best-effort and cached across turns; on any failure get_rag_tools returns
    # [] and the agent runs in degraded mode (local actuation + status only).
    if rag_tools is None:
        rag_tools = get_rag_tools()
    rag_available = bool(rag_tools)
    tools = [ha_basic_info, run_scene, trigger_automation, *rag_tools]

    # Topology context is injected for every turn; approval is gated by auto_run.
    # The RAG tools are read-only and are deliberately NOT listed in the approval
    # interrupt, so only run_scene/trigger_automation ever pause for sign-off.
    middleware: list[AgentMiddleware] = [TopologyContextMiddleware()]
    if not auto_run:
        middleware.append(_APPROVAL_MIDDLEWARE)
    return create_agent(
        model,
        tools=tools,
        system_prompt=_system_prompt(auto_run, rag_available),
        middleware=middleware,
        context_schema=AgentContext,
        checkpointer=checkpointer,
    )
```

> Delete the unused `_tool_names` helper from the test file if it triggers a lint failure — it is a scaffold; the real assertions go through `bind_tools` capture. (Leaving it is harmless; remove it for cleanliness.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v`
Expected: PASS — new mounting tests pass; existing tests still pass (default `rag_tools=None` calls `get_rag_tools()`, which with no real RAG server returns `[]` → degraded, harmless for the existing topology/approval tests that only assert on injected tokens and approval copy). If `get_rag_tools()` attempting a real connection slows tests, the existing tests are unaffected because they assert only on prompt tokens; the connection attempt returns `[]` fast on connection-refused.

> If real connection attempts in `get_rag_tools()` make the existing tests slow or flaky, add an autouse fixture to `tests/test_agent.py` that stubs it:
>
> ```python
> import pytest
>
>
> @pytest.fixture(autouse=True)
> def _no_real_rag(monkeypatch):
>     import app.agent as agent
>     monkeypatch.setattr(agent, "get_rag_tools", lambda: [])
> ```
>
> Tests that inject `rag_tools=[...]` bypass this entirely; tests that exercise the loader pass an explicit `rag_tools` or override the stub.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/app/agent.py addons/terminus-langchain/backend/tests/test_agent.py
git commit -m "$(cat <<'EOF'
feat(terminus): mount terminus-rag tools in build_graph

build_graph() appends the cached RAG knowledge tools to the local three and
selects the prompt's available/degraded clause from whether any loaded. On
RAG failure the agent keeps actuation + status (graceful degradation).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 6: Confirm approval gates ONLY local actuation tools (mounted reads never interrupt)

This task adds a regression test proving the human-approval interrupt fires only for `run_scene`/`trigger_automation` and never for a mounted RAG read tool — the spec's locked approval-gating decision. No production change is expected; this locks behavior.

**Files:**
- Modify: `addons/terminus-langchain/backend/tests/test_agent.py`

**Interfaces:**
- Consumes: `_APPROVAL_MIDDLEWARE` (`interrupt_on` keys), `build_graph(rag_tools=...)`.

- [ ] **Step 1: Write the failing/locking test**

Append to `addons/terminus-langchain/backend/tests/test_agent.py`:

```python
from langgraph.checkpoint.memory import InMemorySaver


@tool
def rag_list_records(kind: str) -> str:
    """Injected fake terminus-rag enumeration tool that records calls."""
    rag_list_records.ran = True  # type: ignore[attr-defined]
    return '[{"id": "scene.evening"}]'


rag_list_records.ran = False  # type: ignore[attr-defined]


class FakeCallsRagTool(BaseChatModel):
    """Calls the mounted read tool once, then answers."""

    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake-calls-rag"

    def bind_tools(self, tools, **kwargs):  # noqa: A002
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls += 1
        if self.calls == 1:
            msg = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "rag_list_records",
                        "args": {"kind": "scene"},
                        "id": "call_rag",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            msg = AIMessage(content="There is one scene: scene.evening.")
        return ChatResult(generations=[ChatGeneration(message=msg)])


def test_approval_interrupt_only_lists_local_actuation_tools():
    """The approval middleware gates exactly run_scene + trigger_automation."""
    from app.agent import _APPROVAL_MIDDLEWARE

    assert set(_APPROVAL_MIDDLEWARE.interrupt_on) == {
        "run_scene",
        "trigger_automation",
    }


def test_mounted_read_tool_does_not_interrupt():
    """A mounted RAG read tool runs without pausing for approval (gated mode)."""
    rag_list_records.ran = False  # type: ignore[attr-defined]
    graph = build_graph(
        model=FakeCallsRagTool(),
        auto_run=False,  # approval ON for actuation
        rag_tools=[rag_list_records],
        checkpointer=InMemorySaver(),
    )
    config = {"configurable": {"thread_id": "rag-t1"}}
    result = graph.invoke(
        {"messages": [HumanMessage(content="list the scenes")]}, config
    )
    # No approval interrupt for a read tool, and it actually ran.
    assert not result.get("__interrupt__"), "read tools must not interrupt"
    assert rag_list_records.ran is True  # type: ignore[attr-defined]
    assert result["messages"][-1].content == "There is one scene: scene.evening."
```

- [ ] **Step 2: Run tests to verify status**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -k "approval_interrupt_only or mounted_read_tool_does_not" -v`
Expected: PASS — the approval middleware already lists only the two local tools (from Task 5's wiring + the unchanged `_APPROVAL_MIDDLEWARE`), so the read tool runs without interrupting. (If `interrupt_on` is not directly introspectable as a plain dict on the middleware object, adjust the first assertion to read the attribute the installed `HumanInTheLoopMiddleware` version exposes — e.g. `_APPROVAL_MIDDLEWARE.interrupt_on` is the constructor arg; confirm with `python -c "from app.agent import _APPROVAL_MIDDLEWARE; print(_APPROVAL_MIDDLEWARE.interrupt_on)"`.)

- [ ] **Step 3: (Only if Step 2 fails) align the assertion to the API**

If the middleware stores the interrupt config under a different attribute name in the installed LangChain version, run the one-liner above to discover it and update the first test's assertion accordingly. No production change — the gating is already correct; this only fixes the introspection path in the test. The second test (behavioral, via `invoke`) is the load-bearing one and does not depend on attribute names.

- [ ] **Step 4: Run the full agent suite to verify green**

Run: `cd addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v`
Expected: PASS (all agent tests).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/tests/test_agent.py
git commit -m "$(cat <<'EOF'
test(terminus): lock approval to local actuation only

Regression test: mounted RAG read tools never trigger the human-approval
interrupt; only run_scene/trigger_automation pause for sign-off.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 7: Add-on manifest — `rag_url`/`rag_token` options + version bump + CHANGELOG

**Files:**
- Modify: `addons/terminus-langchain/config.yaml:16-29`
- Modify: `addons/terminus-langchain/translations/en.yaml`
- Modify: `addons/terminus-langchain/CHANGELOG.md`

**Interfaces:**
- Produces: add-on options `rag_url` (`str`, default `http://local-terminus-rag:9000/mcp`) and `rag_token` (`password?`, default `""`), surfaced in the add-on UI with descriptions; new `config.yaml` `version` with a matching CHANGELOG entry.

- [ ] **Step 1: Add the options + schema to `config.yaml`**

Edit `addons/terminus-langchain/config.yaml`. In the `options:` block add the two defaults, and in `schema:` add their types. Also bump `version` (a feature release). **Cross-plan release coordination:** the three `terminus-langchain` plans share this branch; in the recommended order C → B → A they release `0.11.0` / `0.12.0` / `0.13.0`. This is Spec A, so bump `0.12.0` → `0.13.0` (if running standalone before C/B, it is `0.10.0` → `0.11.0`):

```yaml
version: "0.13.0"
```

```yaml
options:
  anthropic_api_key: ""
  model: claude-sonnet-4-6
  title_model: claude-haiku-4-5
  ha_url: ""
  ha_token: ""
  auto_run_tools: false
  rag_url: "http://local-terminus-rag:9000/mcp"
  rag_token: ""
schema:
  anthropic_api_key: password
  model: str
  title_model: str
  ha_url: str?
  ha_token: password?
  auto_run_tools: bool
  rag_url: str?
  rag_token: password?
```

- [ ] **Step 2: Document the options in `translations/en.yaml`**

Append under `configuration:` in `addons/terminus-langchain/translations/en.yaml`:

```yaml
  rag_url:
    name: Knowledge index URL (terminus-rag)
    description: >-
      MCP endpoint of the terminus-rag add-on that provides the home's
      searchable knowledge index (entities, scenes, automations, history).
      Defaults to the internal add-on host
      http://local-terminus-rag:9000/mcp. If terminus-rag is not installed or
      is unreachable, the agent runs in degraded mode (actuation and instance
      status still work). Changing this requires an add-on restart.
  rag_token:
    name: Knowledge index token (terminus-rag)
    description: >-
      Optional bearer token sent to terminus-rag when its api_token option is
      set. Leave blank when terminus-rag has no token configured. Changing this
      requires an add-on restart.
```

- [ ] **Step 3: Add the CHANGELOG entry**

Prepend a new entry to `addons/terminus-langchain/CHANGELOG.md` (match the heading style of existing entries — verify the format first with `head -n 20 addons/terminus-langchain/CHANGELOG.md`):

```markdown
## 0.13.0

- Mount terminus-rag's MCP knowledge tools into the agent: semantic search
  (search_ha), full enumeration (list_records / list_kinds), exact lookup
  (get_record), and on-demand history (get_automation_trace / get_logbook /
  get_history). The agent can now discover what exists instead of relying on
  the user to supply exact ids.
- Add `rag_url` (default http://local-terminus-rag:9000/mcp) and `rag_token`
  options for the terminus-rag connection.
- Graceful degradation: if terminus-rag is unreachable, the agent keeps
  actuation (run_scene / trigger_automation) and instance status
  (ha_basic_info) and tells you knowledge tools are offline.
```

- [ ] **Step 4: Validate the YAML parses**

Run:

```bash
cd addons/terminus-langchain && python -c "import yaml; yaml.safe_load(open('config.yaml')); yaml.safe_load(open('translations/en.yaml')); print('ok')"
```

Expected output: `ok`.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/config.yaml addons/terminus-langchain/translations/en.yaml addons/terminus-langchain/CHANGELOG.md
git commit -m "$(cat <<'EOF'
feat(terminus): add rag_url/rag_token options; release 0.13.0

Surfaces the terminus-rag connection in the add-on UI and bumps the
canonical version with a matching CHANGELOG entry.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 8: Full backend test suite + lint gate

**Files:**
- None (verification task).

- [ ] **Step 1: Run the entire backend suite**

Run: `cd addons/terminus-langchain/backend && python -m pytest -v`
Expected: PASS — all of `test_config.py`, `test_tools.py`, `test_agent.py`, `test_mcp_client.py` green. No errors, no `RuntimeWarning: coroutine ... was never awaited` from the async bridge.

- [ ] **Step 2: Sanity-check imports load cleanly**

Run:

```bash
cd addons/terminus-langchain/backend && python -c "import app.agent, app.mcp_client, app.config, app.tools; print('imports ok')"
```

Expected output: `imports ok` (this also confirms `graph = build_graph()` at module import doesn't crash when no RAG server is reachable — it must degrade to `[]`, not raise).

- [ ] **Step 3: Commit (only if any fixups were needed)**

If Steps 1-2 surfaced fixups, commit them:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(terminus): backend suite green with terminus-rag tools mounted

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

If no fixups were needed, skip this commit.

---

## Task 9: (Opt-in, slow) Integration test against a real in-process MCP server

This is the spec's opt-in integration test: spin a **real** MCP server (FastMCP, in-process) exposing `search_ha`/`list_records`, mount it through the real `MultiServerMCPClient`, and assert the tools reach the agent. Marked slow so it does not run in the default unit pass. It does **not** require the actual `terminus-rag` add-on — it stands up a minimal MCP server with the same tool names.

**Files:**
- Create: `addons/terminus-langchain/backend/tests/test_mcp_integration.py`
- Modify: `addons/terminus-langchain/backend/pyproject.toml` (register the `slow` marker)

**Interfaces:**
- Consumes: `app.mcp_client.load_rag_tools`; a real `mcp.server.fastmcp.FastMCP` server over Streamable HTTP.

- [ ] **Step 1: Register the `slow` marker**

In `addons/terminus-langchain/backend/pyproject.toml`, under `[tool.pytest.ini_options]`, add:

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
markers = [
    "slow: opt-in integration tests (real MCP server); run with -m slow",
]
```

- [ ] **Step 2: Write the integration test**

Create `addons/terminus-langchain/backend/tests/test_mcp_integration.py`:

```python
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
```

- [ ] **Step 3: Run the integration test (opt-in)**

Run: `cd addons/terminus-langchain/backend && python -m pytest -m slow tests/test_mcp_integration.py -v`
Expected: PASS if `mcp[cli]`/`fastmcp` is available in the env; otherwise SKIPPED via `importorskip` (acceptable — it is opt-in and not part of the default gate).

- [ ] **Step 4: Confirm the default unit pass excludes it**

Run: `cd addons/terminus-langchain/backend && python -m pytest -v`
Expected: the `slow` test still runs by default (markers don't auto-exclude). To keep the default pass fast, run unit-only with `-m "not slow"`. Document this in the commit message; do not change CI (there is no CI yet — local docker/pytest is the gate).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/backend/tests/test_mcp_integration.py addons/terminus-langchain/backend/pyproject.toml
git commit -m "$(cat <<'EOF'
test(terminus): opt-in integration test for real MCP mount

Stands up an in-process FastMCP server with search_ha/list_records and
mounts it through the real MultiServerMCPClient; marked slow. Skips when
the mcp server lib is absent.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Task 10: Update add-on docs (AGENTS.md table) — defer if Spec 0 not yet merged

The repo `AGENTS.md` add-on table tracks installed add-ons. When `terminus-rag` (Spec 0) lands, its row is added there; this task only bumps the **Terminus** row's version to match the `config.yaml` bump and notes the new dependency in the Terminus internals section.

**Files:**
- Modify: `main/AGENTS.md` (Installed Add-ons table — Terminus row; Terminus LangChain Internals section).

- [ ] **Step 1: Bump the Terminus version in the add-on table**

In `main/AGENTS.md`, find the Installed Add-ons table row for `local_terminus` / Terminus and update its Version cell to `0.13.0`.

- [ ] **Step 2: Note the terminus-rag dependency in the internals section**

In the "Terminus LangChain Internals" section of `main/AGENTS.md`, add one line noting that the agent mounts `terminus-rag`'s MCP knowledge tools at `http://local-terminus-rag:9000/mcp` (graceful degradation when absent), configured via the `rag_url`/`rag_token` options.

- [ ] **Step 3: Commit**

```bash
git add main/AGENTS.md
git commit -m "$(cat <<'EOF'
docs(terminus): note terminus-rag knowledge tools + bump version

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

> If this branch will be squash-merged together with the Spec 0 branch, fold this doc update into that merge instead of a standalone commit — coordinate so the add-on table reflects both add-ons at once.

---

## Final verification (run before opening the PR)

- [ ] Full unit suite green: `cd addons/terminus-langchain/backend && python -m pytest -m "not slow" -v`
- [ ] Imports load + `build_graph()` degrades cleanly with no RAG server: `python -c "import app.agent; print('ok')"`
- [ ] `config.yaml` version bumped to `0.13.0` with a matching `CHANGELOG.md` entry.
- [ ] No bump to `backend/pyproject.toml` `version` (still `0.0.0`) or `frontend/package.json`.
- [ ] Base image untouched (still `3.12-alpine3.18`); no embedding/ML deps added to `pyproject.toml` — only `langchain-mcp-adapters`.
- [ ] Approval still gates only `run_scene`/`trigger_automation` (Task 6 tests green).
