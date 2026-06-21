# Terminus Observability & Error-Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retrofit structured logging at every degradation point in the Terminus backend, broaden the P0 tool-error catch so tool failures are reported (not crashed) into the agent graph, distinguish "empty" from "failed", and fix the correctness sharp edges (`referenced_ids` recursion, `build_topology` non-str sort, URL parsing, import-time key crash).

**Architecture:** The backend (`addons/terminus-langchain/backend/app/`) is a FastAPI process plus a LangGraph dev server. It currently has zero logging and several broad `except` blocks that swallow failures into empty-but-successful responses. Each module gains a `logging.getLogger(__name__)`; the root level is configured once at FastAPI startup (`web.py`) from a `log_level` option threaded through `run.sh`. Logs go to stdout, which the Supervisor captures via `ha apps logs local_terminus`. Broad catches that degrade gain a `logger.warning`/`logger.exception` before returning the fallback; "fallback" catches are narrowed to their expected exception type so a real ws/auth failure propagates to `web.py`'s `502` handler instead of returning empty-200.

**Tech Stack:** Python 3.12, FastAPI, httpx, websockets, LangChain/LangGraph, langchain-anthropic, pytest + pytest-asyncio (`asyncio_mode = "auto"`), pytest `caplog` for log assertions.

## Global Constraints

- **Base image tag:** `3.12-alpine3.18` — never bare `:3.12`. (No Dockerfile edit in this plan, but do not introduce 3.11-incompatible syntax that the base would reject; the floor bump in Task 11 codifies this.)
- **`requires-python` bumps to `>=3.12`** (`backend/pyproject.toml`) — matches the only supported runtime.
- **Version lives ONLY in `config.yaml`.** Do NOT bump `backend/pyproject.toml` `version` (stays `0.0.0`) or `frontend/package.json` `version`. The single canonical version is `config.yaml: version`; current is `0.10.0`, this feature releases as `0.11.0`. **Cross-plan release coordination:** the three `terminus-langchain` plans share this branch and bump the same `config.yaml`; in the recommended order C → B → A they release `0.11.0` / `0.12.0` / `0.13.0`. This is Spec C, first in sequence → `0.11.0`. `terminus-rag` is a separate add-on versioned independently (`0.1.0`).
- **Every `config.yaml` version bump adds a matching `CHANGELOG.md` entry** under a heading equal to the new version. No bump without a changelog entry.
- **`pytest` config:** `asyncio_mode = "auto"`, `testpaths = ["tests"]` (already set in `pyproject.toml`). All tests live under `addons/terminus-langchain/backend/tests/`. Async tests need no `@pytest.mark.asyncio` decorator.
- **Logging sink:** stdout only — no file handlers, no `logging.FileHandler`, no Prometheus/OTel. The Supervisor captures stdout (`ha apps logs local_terminus`). Use `logging.getLogger(__name__)` per module; configure the root level once in `web.py`.
- **TDD:** every change is test-first — write the failing test, run it and watch it fail, write the minimal implementation, run it and watch it pass, commit. Use pytest `caplog` to assert log lines.
- **Conventional Commits** with this exact trailer on every commit:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
  ```

- **Working directory for all commands:** `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend`. Paths below are absolute. Run tests from this `backend/` directory (where `pyproject.toml` lives) so `app` and `tests` import cleanly.
- **Worktree:** all work happens on branch `features/terminus-rag` in `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/`. The addon source there is byte-identical to the deployed `main/` copy; all line numbers below were verified against it.

---

### Task 1: Logging infrastructure (per-module loggers + startup level wiring)

This task comes **first** — every later task adds `logger.*` calls and asserts them with `caplog`, so the module-level loggers and the startup-level config must exist before anything else. No behavior changes here beyond loggers existing and the root level being settable; the actual `logger.warning`/`logger.exception` calls at degradation points land in Tasks 2-10.

**Files:**
- Create: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/logging_setup.py`
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/web.py:69-81` (inside `create_app`, before `lifespan` is defined)
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/run.sh:7-13` (add `LOG_LEVEL` export)
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/config.yaml:19-37` (add `log_level` option + schema)
- Add module-level `logger = logging.getLogger(__name__)` to each of:
  `app/tools.py`, `app/ha_registry.py`, `app/config.py`, `app/agent.py`, `app/ha_client.py`, `app/title.py`, `app/web.py`
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_logging_setup.py`

**Interfaces:**
- Produces: `app.logging_setup.configure_logging(level: str | None = None) -> None` — reads `level` (falls back to `os.environ["LOG_LEVEL"]`, default `"info"`), maps the case-insensitive name to a `logging` level via `logging.getLevelName(level.upper())`, and calls `logging.basicConfig(level=..., stream=sys.stdout, format="%(asctime)s %(levelname)s %(name)s %(message)s", force=True)`. An unrecognized level falls back to `logging.INFO` and emits one `logger.warning`. Idempotent (`force=True` re-applies cleanly).
- Produces: each module exposes a module-level `logger` (`logging.getLogger(__name__)`) that later tasks call.
- Consumes: nothing (first task).

- [ ] **Step 1: Write the failing test**

Create `tests/test_logging_setup.py`:

```python
import logging
import sys

from app.logging_setup import configure_logging


def test_configure_logging_sets_root_level_from_arg():
    configure_logging("warning")
    assert logging.getLogger().level == logging.WARNING


def test_configure_logging_defaults_to_info(monkeypatch):
    monkeypatch.delenv("LOG_LEVEL", raising=False)
    configure_logging(None)
    assert logging.getLogger().level == logging.INFO


def test_configure_logging_reads_env_when_arg_none(monkeypatch):
    monkeypatch.setenv("LOG_LEVEL", "error")
    configure_logging(None)
    assert logging.getLogger().level == logging.ERROR


def test_configure_logging_is_case_insensitive():
    configure_logging("DEBUG")
    assert logging.getLogger().level == logging.DEBUG


def test_configure_logging_bad_level_falls_back_to_info(caplog):
    with caplog.at_level(logging.WARNING, logger="app.logging_setup"):
        configure_logging("not-a-level")
    assert logging.getLogger().level == logging.INFO
    assert any("not-a-level" in r.message for r in caplog.records)


def test_configure_logging_streams_to_stdout():
    configure_logging("info")
    handlers = logging.getLogger().handlers
    assert any(
        isinstance(h, logging.StreamHandler) and h.stream is sys.stdout
        for h in handlers
    )


def test_modules_expose_named_loggers():
    import app.tools
    import app.ha_registry
    import app.config
    import app.agent
    import app.ha_client
    import app.title
    import app.web

    for mod, name in [
        (app.tools, "app.tools"),
        (app.ha_registry, "app.ha_registry"),
        (app.config, "app.config"),
        (app.agent, "app.agent"),
        (app.ha_client, "app.ha_client"),
        (app.title, "app.title"),
        (app.web, "app.web"),
    ]:
        assert isinstance(mod.logger, logging.Logger)
        assert mod.logger.name == name
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_logging_setup.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.logging_setup'`.

- [ ] **Step 3: Write minimal implementation**

Create `app/logging_setup.py`:

```python
"""Configure root logging once at startup; log to stdout for the Supervisor.

The Supervisor captures the add-on's stdout (`ha apps logs local_terminus`),
so there is no handler gymnastics here: a single stdout StreamHandler at a
level resolved from the `log_level` add-on option / `LOG_LEVEL` env var.
"""

from __future__ import annotations

import logging
import os
import sys

logger = logging.getLogger(__name__)

_DEFAULT_LEVEL = "info"
_FORMAT = "%(asctime)s %(levelname)s %(name)s %(message)s"


def configure_logging(level: str | None = None) -> None:
    """Set up root logging to stdout at ``level`` (default ``info``).

    ``level`` falls back to ``$LOG_LEVEL`` then ``info``. An unrecognized
    name degrades to ``INFO`` with a warning. Idempotent (``force=True``).
    """
    name = (level or os.environ.get("LOG_LEVEL") or _DEFAULT_LEVEL).upper()
    resolved = logging.getLevelName(name)
    bad = not isinstance(resolved, int)
    if bad:
        resolved = logging.INFO
    logging.basicConfig(
        level=resolved, stream=sys.stdout, format=_FORMAT, force=True
    )
    if bad:
        logger.warning("unknown log level %r; defaulting to INFO", name)
```

Add `import logging` and `logger = logging.getLogger(__name__)` to each of the seven modules. For each, insert `import logging` into the existing import block and add the `logger = ...` line immediately after the imports. Concretely:

- `app/tools.py`: after line 7 (`import httpx`) the import block ends; add `import logging` to the stdlib group (after line 5 `import json`) and add `logger = logging.getLogger(__name__)` after line 13 (`_TIMEOUT = 10.0`) → place it right before `_TIMEOUT` or after it; put it after `_TIMEOUT = 10.0`.
- `app/ha_registry.py`: add `import logging` after line 16 (`import json`); add `logger = logging.getLogger(__name__)` after the `ConnectFn = ...` line (line 24).
- `app/config.py`: add `import logging` after line 11 (`import json`); add `logger = logging.getLogger(__name__)` after the `DEFAULT_TITLE_MODEL` constant (line 22).
- `app/agent.py`: add `import logging` after line 11 (in the import block); add `logger = logging.getLogger(__name__)` after the imports (after line 20).
- `app/ha_client.py`: add `import logging` after line 13 (`import json`); add `logger = logging.getLogger(__name__)` after the `ConnectFn = ...` line (line 32).
- `app/title.py`: add `import logging` after line 15 (`import re`); add `logger = logging.getLogger(__name__)` after the `_default: object | None = None` line (line 39).
- `app/web.py`: add `import logging` after line 13 (`import asyncio`); add `logger = logging.getLogger(__name__)` after the imports (after line 28).

In `app/web.py`, call `configure_logging()` inside `create_app` so the level is applied when the app is built. Add the import `from .logging_setup import configure_logging` to the import block and insert the call at the start of `create_app`'s body (currently line 79, `settings = settings or load_settings()`):

```python
def create_app(
    *,
    settings: Optional[Settings] = None,
    ...
) -> FastAPI:
    configure_logging()
    settings = settings or load_settings()
    registry_connect = registry_connect or _ws_connect
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_logging_setup.py -v`
Expected: PASS (7 passed).

- [ ] **Step 5: Wire `run.sh` + `config.yaml` (no test — shell/yaml; validated by deploy)**

In `run.sh`, after line 13 (`export AUTO_RUN_TOOLS=...`), add:

```bash
# Root log level for the backend (debug|info|warning|error). Captured on stdout
# by the Supervisor (`ha apps logs local_terminus`).
export LOG_LEVEL="$(bashio::config 'log_level')"
```

In `config.yaml`, under `options:` (after `auto_run_tools: false`, currently line 24) add:

```yaml
  log_level: info
```

and under `schema:` (after `auto_run_tools: bool`, currently line 35) add:

```yaml
  log_level: list(debug|info|warning|error)?
```

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest -q`
Expected: all tests PASS (existing suite + new `test_logging_setup.py`).

- [ ] **Step 7: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/logging_setup.py \
        addons/terminus-langchain/backend/app/tools.py \
        addons/terminus-langchain/backend/app/ha_registry.py \
        addons/terminus-langchain/backend/app/config.py \
        addons/terminus-langchain/backend/app/agent.py \
        addons/terminus-langchain/backend/app/ha_client.py \
        addons/terminus-langchain/backend/app/title.py \
        addons/terminus-langchain/backend/app/web.py \
        addons/terminus-langchain/backend/tests/test_logging_setup.py \
        addons/terminus-langchain/run.sh \
        addons/terminus-langchain/config.yaml
git commit -m "feat(terminus): add stdout logging infrastructure with per-module loggers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 2: `tools.py` P0 — broaden tool catches (JSONDecodeError + InvalidURL) with logging

The three `@tool` functions catch only `httpx.HTTPError`. `json.JSONDecodeError` (from `.json()` after `raise_for_status()` on a malformed body) and `httpx.InvalidURL` (a bad base URL) are **not** subclasses of `httpx.HTTPError`, so today they escape as unhandled exceptions into the LangGraph ReAct loop on the **state-changing** path. Broaden each catch to also handle these two, log the failure, and return the structured `{"error": ...}` the agent prompt expects.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/tools.py:66-70` (`ha_basic_info` try/except)
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/tools.py:90-94` (`run_scene` try/except)
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/tools.py:120-126` (`trigger_automation` try/except)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_tools.py` (append)

**Interfaces:**
- Consumes: `app.tools.logger` (from Task 1); the module-level `import json` already present at line 5.
- Produces: a module-level catch tuple `_TOOL_ERRORS = (httpx.HTTPError, httpx.InvalidURL, json.JSONDecodeError)` used by all three tools; each tool returns `json.dumps({"error": f"Home Assistant unreachable: {exc}"})` and logs `logger.warning("tool %s failed: %s", <toolname>, exc)` before returning.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_tools.py`:

```python
import logging


def test_run_scene_handles_decode_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise json.JSONDecodeError("bad", "", 0)

    monkeypatch.setattr(tools, "call_service", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(run_scene.invoke({"scene_id": "scene.evening"}))
    assert "error" in payload
    assert any("run_scene" in r.message for r in caplog.records)


def test_trigger_automation_handles_invalid_url(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise httpx.InvalidURL("bad url")

    monkeypatch.setattr(tools, "call_service", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(
            trigger_automation.invoke({"automation_id": "automation.night"})
        )
    assert "error" in payload
    assert any("trigger_automation" in r.message for r in caplog.records)


def test_ha_basic_info_handles_decode_error(monkeypatch, caplog):
    monkeypatch.setattr(tools, "load_settings", _dev_settings)

    def boom(*args, **kwargs):
        raise json.JSONDecodeError("bad", "", 0)

    monkeypatch.setattr(tools, "fetch_basic_info", boom)
    with caplog.at_level(logging.WARNING, logger="app.tools"):
        payload = json.loads(ha_basic_info.invoke({}))
    assert "error" in payload
    assert any("ha_basic_info" in r.message for r in caplog.records)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_tools.py -v -k "decode_error or invalid_url"`
Expected: FAIL — the uncaught `json.JSONDecodeError` / `httpx.InvalidURL` propagates out of `.invoke()` (error, not a clean `{"error": ...}` dict).

- [ ] **Step 3: Write minimal implementation**

Add a module-level catch tuple after `_TIMEOUT = 10.0` (line 13, next to the new `logger` from Task 1):

```python
_TOOL_ERRORS = (httpx.HTTPError, httpx.InvalidURL, json.JSONDecodeError)
```

Replace `ha_basic_info`'s try/except (lines 66-70):

```python
    try:
        info = fetch_basic_info(base, token)
    except _TOOL_ERRORS as exc:
        logger.warning("tool ha_basic_info failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps(info)
```

Replace `run_scene`'s try/except (lines 90-94):

```python
    try:
        call_service(base, token, "scene", "turn_on", {"entity_id": scene_id})
    except _TOOL_ERRORS as exc:
        logger.warning("tool run_scene failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "scene": scene_id})
```

Replace `trigger_automation`'s try/except (lines 120-126):

```python
    try:
        call_service(
            base, token, "automation", "trigger", {"entity_id": automation_id}
        )
    except _TOOL_ERRORS as exc:
        logger.warning("tool trigger_automation failed: %s", exc)
        return json.dumps({"error": f"Home Assistant unreachable: {exc}"})
    return json.dumps({"success": True, "automation": automation_id})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_tools.py -v`
Expected: PASS (existing tests + the 3 new ones; note `test_run_scene_handles_http_error` at line 205 still passes since `httpx.ConnectError` ⊂ `httpx.HTTPError` ⊂ `_TOOL_ERRORS`).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/tools.py \
        addons/terminus-langchain/backend/tests/test_tools.py
git commit -m "fix(terminus): broaden tool error catch to decode/URL errors (P0)

json.JSONDecodeError and httpx.InvalidURL do not subclass httpx.HTTPError,
so they escaped as unhandled exceptions into the LangGraph loop on the
state-changing path. Catch them, log, and return the structured error.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 3: `ha_registry.fetch_automation` — narrow REST-fallback catch to `HTTPStatusError` + propagate real failures

The REST step (line 362) catches bare `Exception`, so a genuine bug (e.g. a `KeyError` in `referenced_ids`, an `httpx.ConnectError`) silently "falls back" to the websocket path. Narrow it to `httpx.HTTPStatusError` (the real 404→trace signal) and log. The outermost `except` (line 389) also catches bare `Exception` and returns empty-200; narrow it so a real ws/auth failure (`HARegistryError`, `ConnectionError`) propagates to `web.py`'s `502` handler, while only expected per-step degradation returns empty.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/ha_registry.py:356-390` (`fetch_automation` body)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_registry.py` (append)

**Interfaces:**
- Consumes: `app.ha_registry.logger` (Task 1); `HARegistryError` (line 27); `_empty_refs` (line 193); `referenced_ids` (line 152); `httpx`.
- Produces: `fetch_automation` now raises `HARegistryError` (and any `httpx.RequestError` that is *not* an HTTP status response) out of the outer block instead of swallowing it; the REST step catches only `httpx.HTTPStatusError`. Behavior on the documented 404→trace→related ladder is unchanged; `caplog` shows `logger.info`/`logger.warning` at each fallback.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_registry.py`:

```python
import logging


async def test_fetch_automation_propagates_ws_auth_failure():
    # REST 404s, then the websocket auth is rejected. That is a *real* failure
    # and must propagate (so web.py returns 502), not return empty-200.
    ws = FakeWS([{"type": "auth_required"}, {"type": "auth_invalid"}])

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    with pytest.raises(HARegistryError):
        await fetch_automation(
            _settings(),
            "1771085036395",
            fake_connect(ws),
            entity_id="automation.night",
            transport=httpx.MockTransport(handler),
        )


async def test_fetch_automation_logs_rest_fallback(caplog):
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": []},
            {
                "id": 3,
                "type": "result",
                "success": True,
                "result": {"entity": ["light.lamp"]},
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    with caplog.at_level(logging.INFO, logger="app.ha_registry"):
        result = await fetch_automation(
            _settings(),
            "1771085036395",
            fake_connect(ws),
            entity_id="automation.night",
            transport=httpx.MockTransport(handler),
        )
    assert result["referenced"]["entities"] == ["light.lamp"]
    assert any("REST" in r.message or "trace" in r.message for r in caplog.records)
```

Note: `test_fetch_automation_returns_config_and_refs` (line 222), `test_fetch_automation_uses_latest_trace_config_on_404` (line 243), and `test_fetch_automation_falls_back_to_related_when_no_traces` (line 294) must still pass — those exercise the success / 404→trace / 404→related ladder respectively. The new test adds the **propagation** case the spec calls out.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py -v -k "propagates_ws_auth_failure or logs_rest_fallback"`
Expected: `test_fetch_automation_propagates_ws_auth_failure` FAILS (currently the outer `except Exception` swallows the `HARegistryError` and returns `{"config": {}, ...}` instead of raising); `test_fetch_automation_logs_rest_fallback` FAILS (no log emitted yet).

- [ ] **Step 3: Write minimal implementation**

Replace the `fetch_automation` body from the REST `try` (line 357) through the outer `except` (line 390):

```python
    # 1. REST config (editor-managed automations).
    try:
        config = await _rest_get(
            settings, f"/api/config/automation/config/{numeric_id}", transport
        )
        return {"config": config, "referenced": referenced_ids(config)}
    except httpx.HTTPStatusError as exc:
        # A 404 is the expected "not editor-managed" signal; fall through to
        # the websocket ladder below. Any other status is logged too.
        logger.info(
            "REST automation config %s returned %s; falling back to trace",
            numeric_id,
            exc.response.status_code,
        )

    if connect is None:
        return {"config": {}, "referenced": _empty_refs()}

    async with connect(settings.ws_url) as ws:
        await _authenticate(ws, settings.ha_token)

        # 2. Structure from the most recent trace.
        config = None
        try:
            config = await _latest_trace_config(ws, numeric_id)
        except HARegistryError as exc:
            logger.warning(
                "trace lookup failed for %s; degrading to relationships: %s",
                numeric_id,
                exc,
            )
            config = None
        if config:
            return {"config": config, "referenced": referenced_ids(config)}

        # 3. Relationships only.
        refs = _empty_refs()
        if entity_id:
            try:
                refs = await _search_related(ws, 3, entity_id)
            except HARegistryError as exc:
                logger.warning(
                    "search/related failed for %s; returning empty refs: %s",
                    entity_id,
                    exc,
                )
                refs = _empty_refs()
        return {"config": {}, "referenced": refs}
```

Key changes vs the original: the REST catch is now `httpx.HTTPStatusError` (not bare `Exception`) and logs; the **outer** `try/except Exception` wrapping the whole `async with` block is **removed** so `_authenticate`'s `HARegistryError` and any transport `ConnectionError` propagate to `web.py`'s `502` handler; the inner trace/related catches are narrowed to `HARegistryError` and log.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS — all existing `fetch_automation` ladder tests plus the 2 new ones.

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/ha_registry.py \
        addons/terminus-langchain/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): narrow fetch_automation fallbacks; propagate real ws failures

REST step now catches only httpx.HTTPStatusError (the real 404->trace signal);
the outer bare-except is removed so a genuine ws/auth failure reaches the 502
handler instead of returning empty-200. Each fallback is logged.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 4: `ha_registry.fetch_topology` — log the per-automation enrichment fallback

The per-automation `search/related` enrichment (line 273) catches bare `Exception` and silently sets `_empty_refs()`. Keep degrading per-automation (correct — one bad automation must not break the snapshot), but log a warning first so the swallowed failure is observable.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/ha_registry.py:268-275` (enrichment loop)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_registry.py` (append)

**Interfaces:**
- Consumes: `app.ha_registry.logger`; `_empty_refs`; `_search_related`.
- Produces: enrichment still degrades to `_empty_refs()` per automation, now preceded by `logger.warning("enrichment failed for automation %s: %s", entity_id, exc)`. The catch is narrowed from bare `Exception` to `HARegistryError` (the only failure `_search_related` raises via `_command`).

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_registry.py` (reuses the existing module-level `import logging` added in Task 3):

```python
async def test_fetch_topology_logs_enrichment_failure(caplog):
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            {"id": 1, "type": "result", "success": True, "result": AREAS},
            {"id": 2, "type": "result", "success": True, "result": DEVICES},
            {"id": 3, "type": "result", "success": True, "result": ENTITIES},
            {"id": 4, "type": "result", "success": True, "result": STATES},
            {"id": 5, "type": "result", "success": False, "error": {"message": "nope"}},
        ]
    )
    with caplog.at_level(logging.WARNING, logger="app.ha_registry"):
        topo = await fetch_topology(_settings(), fake_connect(ws))
    assert topo["automations"][0]["references"] == {
        "entities": [],
        "scenes": [],
        "devices": [],
    }
    assert any("automation.night" in r.message for r in caplog.records)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py::test_fetch_topology_logs_enrichment_failure -v`
Expected: FAIL — no warning is emitted (the existing bare-except is silent).

- [ ] **Step 3: Write minimal implementation**

Replace the enrichment loop (lines 268-275):

```python
        mid = 5
        for automation in topology["automations"]:
            try:
                automation["references"] = await _search_related(
                    ws, mid, automation["entity_id"]
                )
            except HARegistryError as exc:
                logger.warning(
                    "enrichment failed for automation %s: %s",
                    automation["entity_id"],
                    exc,
                )
                automation["references"] = _empty_refs()
            mid += 1
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS (including the existing `test_fetch_topology_degrades_when_related_unreadable` at line 189 — the `search/related` failure raises `HARegistryError`, which the narrowed catch still handles).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/ha_registry.py \
        addons/terminus-langchain/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): log per-automation enrichment fallback in fetch_topology

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 5: `ha_registry.referenced_ids` — bound the `walk()` recursion depth

`walk()` (lines 172-187) recurses with no depth bound. A pathological/deeply-nested config can hit Python's recursion limit and raise `RecursionError`, blowing up the whole `fetch_automation` call. Add an explicit depth guard; stop descending past the bound and log once.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/ha_registry.py:152-190` (`referenced_ids`)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_registry.py` (append)

**Interfaces:**
- Consumes: `app.ha_registry.logger`.
- Produces: module-level `_MAX_WALK_DEPTH = 100`; `walk(node, depth)` takes a depth arg; recursion past `_MAX_WALK_DEPTH` is skipped and logged once per call via `logger.warning("referenced_ids recursion bound %d hit; truncating walk", _MAX_WALK_DEPTH)`. Return shape `{"entities", "scenes", "devices"}` is unchanged.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_registry.py`:

```python
def test_referenced_ids_bounds_recursion(caplog):
    # Build a config nested far deeper than the bound; it must not RecursionError.
    node: dict = {"entity_id": "light.deep"}
    for _ in range(5000):
        node = {"nested": node}
    with caplog.at_level(logging.WARNING, logger="app.ha_registry"):
        refs = referenced_ids(node)
    # Did not raise; bound was hit and logged.
    assert isinstance(refs["entities"], list)
    assert any("recursion bound" in r.message for r in caplog.records)


def test_referenced_ids_shallow_config_unaffected():
    config = {"trigger": [{"entity_id": "sun.sun"}]}
    assert referenced_ids(config)["entities"] == ["sun.sun"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py::test_referenced_ids_bounds_recursion -v`
Expected: FAIL with `RecursionError` (the unbounded `walk()` blows the stack).

- [ ] **Step 3: Write minimal implementation**

Add a constant near the top of the module (after the `logger = ...` line from Task 1):

```python
_MAX_WALK_DEPTH = 100
```

Replace `referenced_ids` (lines 152-190), changing only `walk` and its initial call:

```python
def referenced_ids(config: Any) -> dict:
    """Walk an automation config and collect the ids it references.

    Recurses through trigger / condition / action blocks (including nested
    ``choose`` / ``if`` / ``repeat`` / ``parallel`` structures) collecting every
    ``entity_id`` and ``device_id`` value plus legacy ``scene:`` action targets.
    Entity ids in the ``scene.`` domain are returned separately from other
    entities. The walk is depth-bounded so a pathological config can't
    ``RecursionError``.
    """
    entities: set[str] = set()
    devices: set[str] = set()
    bound_hit = False

    def add(value: Any, into: set[str]) -> None:
        if isinstance(value, str):
            into.add(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    into.add(item)

    def walk(node: Any, depth: int) -> None:
        nonlocal bound_hit
        if depth > _MAX_WALK_DEPTH:
            bound_hit = True
            return
        if isinstance(node, dict):
            for key, value in node.items():
                if key == "entity_id":
                    add(value, entities)
                elif key == "device_id":
                    add(value, devices)
                elif key == "scene" and isinstance(value, str):
                    entities.add(value)
                else:
                    walk(value, depth + 1)
        elif isinstance(node, list):
            for item in node:
                walk(item, depth + 1)

    walk(config, 0)
    if bound_hit:
        logger.warning(
            "referenced_ids recursion bound %d hit; truncating walk",
            _MAX_WALK_DEPTH,
        )
    scenes = sorted(e for e in entities if e.startswith("scene."))
    plain = sorted(e for e in entities if not e.startswith("scene."))
    return {"entities": plain, "scenes": scenes, "devices": sorted(devices)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS — including the existing `test_referenced_ids_walks_nested_config` (line 113), whose nesting is shallow (well under 100).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/ha_registry.py \
        addons/terminus-langchain/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): bound referenced_ids recursion depth

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 6: `ha_registry.build_topology` — guard the area-name sort against non-str names

The area sort (line 142) calls `a["name"].lower()`. `out_areas` builds `name` as `a.get("name") or a["area_id"]` (line 138), but a registry row could carry a non-str `name` (e.g. `null` is handled, but an int or dict from a malformed registry is not), making `.lower()` raise and blowing up the whole snapshot. Coerce the sort key to `str` so it can never raise.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/ha_registry.py:137-142` (`out_areas` build + sort)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_registry.py` (append)

**Interfaces:**
- Consumes: nothing new.
- Produces: the sort key becomes `key=lambda a: str(a["name"]).lower()`; a non-str `name` no longer raises. Output ordering for normal (str) names is unchanged.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_registry.py`:

```python
def test_build_topology_tolerates_non_str_area_name():
    areas = [
        {"area_id": "a1", "name": 12345},   # non-str name (malformed registry)
        {"area_id": "a2", "name": "Bedroom"},
    ]
    topo = build_topology(areas, [], [], [])
    names = {a["area_id"]: a["name"] for a in topo["areas"]}
    assert names["a1"] == 12345        # value preserved as-is
    assert names["a2"] == "Bedroom"
    # sorted without raising; int coerces to "12345" < "bedroom"
    assert [a["area_id"] for a in topo["areas"]] == ["a1", "a2"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py::test_build_topology_tolerates_non_str_area_name -v`
Expected: FAIL with `AttributeError: 'int' object has no attribute 'lower'`.

- [ ] **Step 3: Write minimal implementation**

Replace the sort (line 142):

```python
    out_areas.sort(key=lambda a: str(a["name"]).lower())
```

(Lines 137-141 building `out_areas` are unchanged; only the sort key is coerced.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS — including the existing `test_build_topology_normalizes_and_resolves_areas` (line 87), whose area ordering (`["kitchen", "living"]`) is unaffected by the `str()` coercion.

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/ha_registry.py \
        addons/terminus-langchain/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): guard build_topology area sort against non-str names

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 7: `config._normalize_ws_url` / `rest_target` — tolerate credentials, uppercase schemes, malformed input

`_normalize_ws_url` (lines 43-58) does case-sensitive `startswith` string surgery: an uppercase scheme (`HTTPS://`) falls through to the bare-host branch and yields `ws://HTTPS://...`; a `user:pass@host` credential prefix is passed through untouched (acceptable for ws) but never validated. `rest_target` (lines 61-79) has the symmetric case-sensitivity gap. Make both case-insensitive on the scheme, and have `_normalize_ws_url` log a warning when the input has no host after stripping (obviously-malformed dev URL).

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/config.py:43-79` (`_normalize_ws_url` + `rest_target`)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_config.py` (append)

**Interfaces:**
- Consumes: `app.config.logger` (Task 1).
- Produces: `_normalize_ws_url(raw: str) -> str` lower-cases the scheme before matching (so `HTTPS://h` → `wss://h/api/websocket`), preserves `user:pass@` credentials, and logs `logger.warning("ws url has no host: %r", raw)` when the post-strip remainder is empty. `rest_target` lower-cases the `wss://`/`ws://` prefix check. The existing variant outputs (`test_normalize_ws_url_variants` at line 58) are unchanged.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_config.py`:

```python
import logging

from app.config import _normalize_ws_url, rest_target


def test_normalize_ws_url_uppercase_scheme():
    assert _normalize_ws_url("HTTPS://h:8123") == "wss://h:8123/api/websocket"
    assert _normalize_ws_url("HTTP://h:8123") == "ws://h:8123/api/websocket"
    assert _normalize_ws_url("WSS://h:8123/api/websocket") == "wss://h:8123/api/websocket"


def test_normalize_ws_url_preserves_credentials():
    assert (
        _normalize_ws_url("https://user:pass@h:8123")
        == "wss://user:pass@h:8123/api/websocket"
    )


def test_normalize_ws_url_warns_on_empty_host(caplog):
    # A scheme-only dev URL (no host) is a misconfiguration: warn but don't raise.
    with caplog.at_level(logging.WARNING, logger="app.config"):
        out = _normalize_ws_url("https://")
    assert any("no host" in r.message for r in caplog.records)
    # still returns a (degenerate) string rather than raising
    assert out.endswith("/api/websocket")


def test_normalize_ws_url_no_warn_on_valid_host(caplog):
    with caplog.at_level(logging.WARNING, logger="app.config"):
        _normalize_ws_url("https://h:8123")
    assert not any("no host" in r.message for r in caplog.records)


def test_rest_target_handles_uppercase_ws_scheme():
    from app.config import Settings

    settings = Settings(
        ws_url="WSS://h:8123/api/websocket",
        ha_token="t",
        anthropic_api_key="k",
        model="m",
        use_supervisor=False,
    )
    assert rest_target(settings) == ("https://h:8123", "t")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v -k "uppercase or credentials or empty_host"`
Expected: FAIL — `HTTPS://h:8123` becomes `ws://HTTPS://h:8123/api/websocket` (no uppercase handling); no warning on empty host.

- [ ] **Step 3: Write minimal implementation**

Replace `_normalize_ws_url` (lines 43-58):

```python
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
```

Replace `rest_target`'s scheme checks (lines 75-78):

```python
    lower = base.lower()
    if lower.startswith("wss://"):
        base = "https://" + base[len("wss://") :]
    elif lower.startswith("ws://"):
        base = "http://" + base[len("ws://") :]
    return base, settings.ha_token
```

(The `endswith("/api/websocket")` strip at lines 73-74 is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v`
Expected: PASS — the new cases plus all existing `_normalize_ws_url` / `rest_target` tests (lines 41-64).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/config.py \
        addons/terminus-langchain/backend/tests/test_config.py
git commit -m "fix(terminus): harden ws/rest URL parsing (uppercase, credentials, no host)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 8: `config.load_options` — warn when `/data/options.json` is corrupt

`load_options` (lines 82-86) catches `FileNotFoundError`, `json.JSONDecodeError`, and `OSError` all the same way, returning `{}`. "Missing, fine" and "corrupt, broken" are indistinguishable in the logs. Split: a missing file is silent (expected in dev), but a present-but-unparseable file logs a warning before returning `{}`.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/config.py:82-86` (`load_options`)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_config.py` (append)

**Interfaces:**
- Consumes: `app.config.logger`.
- Produces: `load_options(path)` returns `{}` on a missing file silently; on a present file that fails to parse (`json.JSONDecodeError`) or read (`OSError` other than not-found) it logs `logger.warning("failed to parse options at %s: %s", path, exc)` then returns `{}`.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_config.py`:

```python
from pathlib import Path

from app.config import load_options


def test_load_options_missing_file_is_silent(caplog, tmp_path):
    missing = tmp_path / "nope.json"
    with caplog.at_level(logging.WARNING, logger="app.config"):
        assert load_options(missing) == {}
    assert not caplog.records


def test_load_options_corrupt_file_warns(caplog, tmp_path):
    corrupt = tmp_path / "options.json"
    corrupt.write_text("{not valid json")
    with caplog.at_level(logging.WARNING, logger="app.config"):
        assert load_options(corrupt) == {}
    assert any("failed to parse options" in r.message for r in caplog.records)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v -k "load_options"`
Expected: `test_load_options_corrupt_file_warns` FAILS — no warning is emitted today.

- [ ] **Step 3: Write minimal implementation**

Replace `load_options` (lines 82-86):

```python
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/config.py \
        addons/terminus-langchain/backend/tests/test_config.py
git commit -m "fix(terminus): warn on corrupt /data/options.json (missing stays silent)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 9: `agent.build_graph` — startup API-key guard (no import-time crash)

`build_graph` constructs `ChatAnthropic(model=settings.model)` at line 125, and `graph = build_graph()` runs at **import time** (line 144). A missing/invalid `ANTHROPIC_API_KEY` makes `ChatAnthropic(...)` raise during LangGraph server *load*, surfacing as an opaque proxy `502`. `title.py` already guards this (lazy build + key check at lines 42-56, 116-118). Mirror that: check `settings.anthropic_api_key` before constructing the model and raise a clear, logged `RuntimeError`.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/agent.py:117-144` (`build_graph` + module-level `graph`)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_agent.py` (append)

**Interfaces:**
- Consumes: `app.agent.logger` (Task 1); `app.config.load_settings`.
- Produces: when `model is None` and `settings.anthropic_api_key` is empty, `build_graph` logs `logger.error(...)` and raises `RuntimeError("ANTHROPIC_API_KEY is not configured")` **instead of** letting `ChatAnthropic` fail opaquely. When a `model` is injected (all tests do), the key is never checked — existing tests unaffected. The module-level `graph = build_graph()` (line 144) stays, but the guard turns its failure into a clear message.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_agent.py`:

```python
import logging

import pytest

from app.config import Settings
from app import agent as agent_mod


def _no_key_settings():
    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


def test_build_graph_raises_clear_error_without_key(monkeypatch, caplog):
    monkeypatch.setattr(agent_mod, "load_settings", _no_key_settings)
    with caplog.at_level(logging.ERROR, logger="app.agent"):
        with pytest.raises(RuntimeError, match="ANTHROPIC_API_KEY"):
            agent_mod.build_graph()  # no model injected -> would construct ChatAnthropic
    assert any("ANTHROPIC_API_KEY" in r.message for r in caplog.records)


def test_build_graph_with_injected_model_skips_key_check(monkeypatch):
    # An injected model must never trigger the key guard (tests rely on this).
    monkeypatch.setattr(agent_mod, "load_settings", _no_key_settings)
    graph = agent_mod.build_graph(model=CapturingModel(), auto_run=True)
    assert graph is not None
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v -k "without_key or injected_model_skips"`
Expected: `test_build_graph_raises_clear_error_without_key` FAILS — today `ChatAnthropic(model=...)` raises its own (non-`RuntimeError`, unmatched) error and no `app.agent` log is emitted.

- [ ] **Step 3: Write minimal implementation**

Replace the model-construction block in `build_graph` (lines 123-125):

```python
    settings = load_settings()
    if model is None:
        if not settings.anthropic_api_key:
            logger.error(
                "ANTHROPIC_API_KEY is not configured; the agent graph cannot "
                "build a model. Set the add-on's anthropic_api_key option."
            )
            raise RuntimeError("ANTHROPIC_API_KEY is not configured")
        model = ChatAnthropic(model=settings.model)
```

(The rest of `build_graph` — `auto_run` resolution, middleware, `create_agent`, and the module-level `graph = build_graph()` at line 144 — is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v`
Expected: PASS — the 2 new tests plus all existing agent tests (which inject a `model`, so the guard is skipped).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/agent.py \
        addons/terminus-langchain/backend/tests/test_agent.py
git commit -m "fix(terminus): guard missing ANTHROPIC_API_KEY in build_graph

A missing key made ChatAnthropic fail at import-time graph load, surfacing as
opaque proxy 502s. Raise a clear, logged RuntimeError instead — mirrors title.py.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 10: `ha_client.run_forever` — log auth/transport failures

`run_forever` (lines 146-153) records auth failures (`HAAuthError`) and transport errors only into `self._error` (read via `/ha/status`). An auth-failed reconnect loop should be loud. Add `logger.error` for auth failures and `logger.warning` for transport errors before continuing the reconnect loop.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/app/ha_client.py:146-153` (`run_forever` except arms)
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_client.py` (append)

**Interfaces:**
- Consumes: `app.ha_client.logger` (Task 1).
- Produces: in `run_forever`, the `HAAuthError` arm logs `logger.error("Home Assistant auth failed: %s", exc)`; the generic transport arm logs `logger.warning("Home Assistant connection error: %s: %s", type(exc).__name__, exc)`. Status/`_error` bookkeeping is unchanged.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_client.py`:

```python
import logging


async def test_run_forever_logs_auth_failure(caplog):
    # auth_required then auth_invalid => HAAuthError; stop immediately after.
    ws = FakeWS([{"type": "auth_required"}, {"type": "auth_invalid"}])
    client = HAClient("ws://x", "token", fake_connect(ws), reconnect_delay=0.0)
    client.stop()  # exit the loop after the first (failing) session attempt
    with caplog.at_level(logging.ERROR, logger="app.ha_client"):
        await client.run_forever()
    assert client.get_status()["status"] == HAStatus.auth_failed.value
    assert any("auth failed" in r.message for r in caplog.records)


async def test_run_forever_logs_transport_failure(caplog):
    # connect() raises a transport error => generic except arm.
    def boom_connect(url):
        raise ConnectionError("refused")

    client = HAClient("ws://x", "token", boom_connect, reconnect_delay=0.0)
    client.stop()
    with caplog.at_level(logging.WARNING, logger="app.ha_client"):
        await client.run_forever()
    assert client.get_status()["status"] == HAStatus.disconnected.value
    assert any("connection error" in r.message for r in caplog.records)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_client.py -v -k "logs_auth_failure or logs_transport_failure"`
Expected: FAIL — no `app.ha_client` log records emitted today.

- [ ] **Step 3: Write minimal implementation**

Replace the `except` arms in `run_forever` (lines 146-153):

```python
            except HAAuthError as exc:
                self._status = HAStatus.auth_failed
                self._error = str(exc)
                logger.error("Home Assistant auth failed: %s", exc)
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001 - surface any transport error
                self._status = HAStatus.disconnected
                self._error = f"{type(exc).__name__}: {exc}"
                logger.warning(
                    "Home Assistant connection error: %s: %s",
                    type(exc).__name__,
                    exc,
                )
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_client.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/app/ha_client.py \
        addons/terminus-langchain/backend/tests/test_ha_client.py
git commit -m "fix(terminus): log auth/transport failures in run_forever

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 11: `pyproject.toml` — bump `requires-python` to `>=3.12`

Match the only supported runtime (`3.12-alpine3.18`) and prevent 3.11-incompatible drift going unnoticed.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/pyproject.toml:8`
- Test: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_pyproject.py`

**Interfaces:**
- Consumes: nothing.
- Produces: `requires-python = ">=3.12"` in `[project]`. `version` stays `0.0.0` (frozen — see Global Constraints).

- [ ] **Step 1: Write the failing test**

Create `tests/test_pyproject.py`:

```python
import tomllib
from pathlib import Path

PYPROJECT = Path(__file__).resolve().parents[1] / "pyproject.toml"


def test_requires_python_floor_is_312():
    data = tomllib.loads(PYPROJECT.read_text())
    assert data["project"]["requires-python"] == ">=3.12"


def test_version_stays_frozen():
    # The canonical version lives in config.yaml; pyproject stays 0.0.0 to
    # preserve the Docker pip-cache layer.
    data = tomllib.loads(PYPROJECT.read_text())
    assert data["project"]["version"] == "0.0.0"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_pyproject.py -v`
Expected: `test_requires_python_floor_is_312` FAILS (`assert '>=3.11' == '>=3.12'`).

- [ ] **Step 3: Write minimal implementation**

In `pyproject.toml` line 8, change:

```toml
requires-python = ">=3.12"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_pyproject.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/pyproject.toml \
        addons/terminus-langchain/backend/tests/test_pyproject.py
git commit -m "chore(terminus): bump requires-python to >=3.12

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 12: Test backfill — `clean_title` truncation & all-punctuation collapse

`clean_title` (title.py lines 67-98) has an untested word-boundary branch (when the clamp boundary is at position ≤ 0, the full clip is kept) and an untested all-punctuation→empty collapse. Backfill both — these are characterization tests of existing behavior (no production change).

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_title.py` (append)

**Interfaces:**
- Consumes: `app.title.clean_title` (already imported at test line 11).
- Produces: tests only; asserts the existing behavior of `clean_title` at the `_MAX_LEN = 60` boundary (line 34) and the strip chain (lines 86-88).

- [ ] **Step 1: Write the test (characterizes existing behavior — expected to PASS once written against the real impl)**

Append to `tests/test_title.py`:

```python
def test_clean_title_no_space_in_clip_keeps_full_clip():
    # A 70-char run with no spaces: boundary == -1 (rfind returns -1), so the
    # 60-char clip is kept verbatim (the `boundary > 0` guard is not taken).
    raw = "a" * 70
    out = clean_title(raw)
    assert out == "a" * 60
    assert len(out) == 60


def test_clean_title_all_punctuation_collapses_to_empty():
    # rstrip(".!?:") then strip() removes everything -> empty title.
    assert clean_title("?!.:") == ""
    assert clean_title("'.'") == ""


def test_clean_title_trailing_punctuation_only_strips_one_run():
    # A single trailing run of .!?: is stripped; interior punctuation stays.
    assert clean_title("Lights On!!!") == "Lights On"
    assert clean_title("A.B.") == "A.B"
```

- [ ] **Step 2: Run test to verify behavior**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_title.py -v -k "no_space_in_clip or all_punctuation or trailing_punctuation_only"`
Expected: PASS — these characterize `clean_title`'s existing logic. (If `test_clean_title_no_space_in_clip_keeps_full_clip` were to fail, that reveals a real boundary bug to fix; per the impl at lines 90-96 the `boundary > 0` guard means a no-space clip keeps all 60 chars, so it passes.)

- [ ] **Step 3: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/tests/test_title.py
git commit -m "test(terminus): backfill clean_title truncation & all-punctuation cases

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 13: Test backfill — `agenerate_title` non-str input degrades via the caller's guard

The spec calls out `clean_title` non-str input degrading via the caller's guard. `agenerate_title` (title.py lines 101-127) does `message.strip()` at line 108, so a non-str `message` raises `AttributeError` at the call boundary — the FastAPI `_TitleRequest` model (web.py line 53) enforces `message: str`, so the guard is the Pydantic layer. Backfill a test that the route rejects a non-str body, characterizing the real guard.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_title.py` (append)

**Interfaces:**
- Consumes: `app.web.create_app` (imported at test line 12); `fastapi.testclient.TestClient` (line 7); `RunnableLambda` (line 8).
- Produces: tests only; asserts the `_TitleRequest` Pydantic model rejects a non-str `message` with `422`, which is the "caller's guard" that keeps a non-str from reaching `clean_title`.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_title.py`:

```python
def test_title_route_rejects_non_str_message():
    # The _TitleRequest model is the caller's guard: a non-str message never
    # reaches agenerate_title / clean_title; the route 422s instead.
    chain = RunnableLambda(lambda _: "X")
    app = create_app(settings=_settings(), client=None, title_chain=chain)
    with TestClient(app) as tc:
        resp = tc.post("/api/title", json={"message": {"not": "a string"}})
        assert resp.status_code == 422
```

- [ ] **Step 2: Run test to verify it passes (characterization)**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_title.py::test_title_route_rejects_non_str_message -v`
Expected: PASS — Pydantic's `message: str` coercion rejects the dict with `422`, confirming the guard. (No production change needed; this documents the boundary.)

- [ ] **Step 3: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/tests/test_title.py
git commit -m "test(terminus): assert title route rejects non-str message (caller guard)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 14: Test backfill — `_normalize_ws_url` / `rest_target` exhaustive input forms

The spec flags these as "currently entirely uncovered" beyond the single `test_normalize_ws_url_variants` (line 58). Task 7 added uppercase/credentials/empty-host cases; this task backfills the remaining documented forms (ws/wss bare, trailing slash, `/api/websocket` suffix, supervisor) as one explicit characterization block, so the full input space is covered in one place.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_config.py` (append)

**Interfaces:**
- Consumes: `app.config._normalize_ws_url`, `app.config.rest_target`, `app.config.Settings`.
- Produces: tests only; covers every input form the spec enumerates (http/https/ws/wss/bare/uppercase/credentials/trailing-slash/`/api/websocket` suffix) for `_normalize_ws_url`, and supervisor / dev-derived / wss / ws / trailing-slash for `rest_target`.

- [ ] **Step 1: Write the test (characterization — passes against Task 7's hardened impl)**

Append to `tests/test_config.py`:

```python
import pytest

from app.config import Settings


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("http://h:8123", "ws://h:8123/api/websocket"),
        ("https://h:8123", "wss://h:8123/api/websocket"),
        ("ws://h:8123", "ws://h:8123/api/websocket"),
        ("wss://h:8123", "wss://h:8123/api/websocket"),
        ("h:8123", "ws://h:8123/api/websocket"),
        ("HTTPS://h:8123", "wss://h:8123/api/websocket"),
        ("https://user:pass@h:8123", "wss://user:pass@h:8123/api/websocket"),
        ("https://h:8123/", "wss://h:8123/api/websocket"),
        ("https://h:8123/api/websocket", "wss://h:8123/api/websocket"),
        ("https://h:8123/api/websocket/", "wss://h:8123/api/websocket"),
    ],
)
def test_normalize_ws_url_all_forms(raw, expected):
    assert _normalize_ws_url(raw) == expected


def _dev(ws_url):
    return Settings(
        ws_url=ws_url,
        ha_token="t",
        anthropic_api_key="k",
        model="m",
        use_supervisor=False,
    )


@pytest.mark.parametrize(
    "ws_url,expected_base",
    [
        ("wss://h:8123/api/websocket", "https://h:8123"),
        ("ws://h:8123/api/websocket", "http://h:8123"),
        ("wss://h:8123", "https://h:8123"),
        ("ws://h:8123", "http://h:8123"),
    ],
)
def test_rest_target_all_dev_forms(ws_url, expected_base):
    assert rest_target(_dev(ws_url)) == (expected_base, "t")


def test_rest_target_supervisor_ignores_ws_url():
    settings = load_settings(env={"SUPERVISOR_TOKEN": "super"}, options={})
    assert rest_target(settings) == ("http://supervisor/core", "super")
```

- [ ] **Step 2: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_config.py -v -k "all_forms or all_dev_forms or supervisor_ignores"`
Expected: PASS (relies on Task 7's hardened `_normalize_ws_url` for the uppercase/credentials rows; the `load_settings`/`rest_target`/`_normalize_ws_url` imports are already at test line 1 + Task 7's appended imports).

- [ ] **Step 3: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/tests/test_config.py
git commit -m "test(terminus): cover all _normalize_ws_url / rest_target input forms

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 15: Test backfill — `fetch_automation` full fallback ladder (incl. new propagation semantics)

The spec asks for the complete ladder asserted in one place: REST-success / REST-404→trace-config / trace-absent→related / all-fail→propagate. Tasks in `test_ha_registry.py` cover the first three (lines 222, 243, 294) and Task 3 added the propagation case. This task adds the one remaining gap the spec names explicitly: **REST-404 + trace present but its config is absent → degrade to related** (the `_latest_trace_config` returns `None` path), so every rung is pinned.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_ha_registry.py` (append)

**Interfaces:**
- Consumes: `fetch_automation`, `FakeWS`, `fake_connect`, `_settings` (all already in `test_ha_registry.py`); `httpx`.
- Produces: tests only; pins the trace-present-but-no-config rung (trace list non-empty, but the trace's `config` is absent → `_latest_trace_config` returns `None` → falls to `search/related`).

- [ ] **Step 1: Write the failing test**

Append to `tests/test_ha_registry.py`:

```python
async def test_fetch_automation_trace_without_config_degrades_to_related():
    # REST 404s; a trace exists but its payload carries no `config`, so
    # _latest_trace_config returns None and we fall to search/related.
    ws = FakeWS(
        [
            {"type": "auth_required"},
            {"type": "auth_ok"},
            # trace/list (mid 1): one trace
            {
                "id": 1,
                "type": "result",
                "success": True,
                "result": [
                    {"run_id": "r1", "timestamp": {"start": "2026-06-01T00:00:00"}}
                ],
            },
            # trace/get (mid 2): no `config` key in the trace payload
            {"id": 2, "type": "result", "success": True, "result": {}},
            # search/related (mid 3)
            {
                "id": 3,
                "type": "result",
                "success": True,
                "result": {"entity": ["light.lamp"], "scene": ["scene.movie"]},
            },
        ]
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(404)

    result = await fetch_automation(
        _settings(),
        "1771085036395",
        fake_connect(ws),
        entity_id="automation.night",
        transport=httpx.MockTransport(handler),
    )
    assert result["config"] == {}
    assert result["referenced"]["entities"] == ["light.lamp"]
    assert result["referenced"]["scenes"] == ["scene.movie"]
```

- [ ] **Step 2: Run test to verify it passes (characterizes Task 3's narrowed impl)**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_ha_registry.py::test_fetch_automation_trace_without_config_degrades_to_related -v`
Expected: PASS — `_latest_trace_config` returns `None` when the trace has no `config` (line 334-335), so the related rung runs.

- [ ] **Step 3: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/tests/test_ha_registry.py
git commit -m "test(terminus): pin fetch_automation trace-without-config rung

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 16: Test backfill — approval-middleware RESUME round-trip (`Command(resume=...)`)

Today `test_run_scene_requires_human_approval` (test_agent.py line 177) covers only **interrupt creation**. The spec wants the approve/edit/reject continuation: resuming the interrupted graph with `Command(resume=...)` and asserting the gated tool then runs (approve) or is rejected.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend/tests/test_agent.py` (append)

**Interfaces:**
- Consumes: `build_graph`, `FakeRunsScene` (test_agent.py line 146), `_dev_settings` (line 225), `app.tools`; `langgraph.types.Command`, `langgraph.checkpoint.memory.InMemorySaver`.
- Produces: tests only; drives the `HumanInTheLoopMiddleware` resume path — `graph.invoke(Command(resume=[{"type": "approve"}]), config)` continues the run and the gated `call_service` fires; a `reject` decision continues without firing it.

- [ ] **Step 1: Write the failing test**

Append to `tests/test_agent.py`:

```python
def test_run_scene_resume_approve_executes(monkeypatch):
    """Resuming the approval interrupt with `approve` runs the gated tool."""
    from langgraph.checkpoint.memory import InMemorySaver
    from langgraph.types import Command

    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", lambda: _dev_settings(), raising=True)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True), raising=True
    )

    graph = build_graph(model=FakeRunsScene(), checkpointer=InMemorySaver())
    config = {"configurable": {"thread_id": "resume-approve"}}
    first = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}, config
    )
    assert first.get("__interrupt__")
    assert called["ran"] is False

    # Resume with an approve decision; the gated tool now executes.
    resumed = graph.invoke(
        Command(resume=[{"type": "approve"}]), config
    )
    assert called["ran"] is True
    assert not resumed.get("__interrupt__")


def test_run_scene_resume_reject_does_not_execute(monkeypatch):
    """Resuming with `reject` continues the run without running the tool."""
    from langgraph.checkpoint.memory import InMemorySaver
    from langgraph.types import Command

    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", lambda: _dev_settings(), raising=True)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True), raising=True
    )

    graph = build_graph(model=FakeRunsScene(), checkpointer=InMemorySaver())
    config = {"configurable": {"thread_id": "resume-reject"}}
    first = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}, config
    )
    assert first.get("__interrupt__")

    resumed = graph.invoke(
        Command(resume=[{"type": "reject"}]), config
    )
    assert called["ran"] is False
    assert not resumed.get("__interrupt__")
```

- [ ] **Step 2: Run test to verify it fails (or reveals the real resume payload shape)**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v -k "resume_approve or resume_reject"`
Expected: these are characterization tests of `HumanInTheLoopMiddleware`. If the resume payload shape differs from `[{"type": "approve"}]` in the installed `langchain` version, the test will fail with a clear error showing the expected decision schema — adjust the `resume=` payload to the documented shape for the pinned `langchain>=1.0` (the `allowed_decisions=["approve", "edit", "reject"]` configured at agent.py lines 73-74 defines the accepted `type` values). Once the payload matches, both tests PASS.

> Implementer note: if `langgraph.types.Command` is not importable in the pinned version, use `from langgraph.types import Command` vs `from langchain_core.runnables import ...` — confirm the import via `python -c "from langgraph.types import Command; print(Command)"` before writing, and use the resume schema from the installed `HumanInTheLoopMiddleware` (inspect with `python -c "from langchain.agents.middleware import HumanInTheLoopMiddleware; help(HumanInTheLoopMiddleware)"`). The decision `type` strings must be among the `allowed_decisions`.

- [ ] **Step 3: Run test to verify it passes**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest tests/test_agent.py -v`
Expected: PASS — full agent suite including the 2 resume round-trip tests.

- [ ] **Step 4: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/backend/tests/test_agent.py
git commit -m "test(terminus): cover approval-middleware resume round-trip

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

### Task 17: Release — bump `config.yaml` version + CHANGELOG

All fixes land; cut the release. Bump the single canonical version (`0.10.0` → `0.11.0`) and add the matching `CHANGELOG.md` entry. No code change — this is the release gate.

**Files:**
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/config.yaml` (the `version:` line, currently `"0.10.0"`)
- Modify: `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/CHANGELOG.md` (new `## 0.11.0` heading at the top, above `## 0.10.0`)

**Interfaces:**
- Consumes: nothing.
- Produces: `config.yaml: version: "0.11.0"`; a `## 0.11.0` changelog section. The `test_pyproject.py::test_version_stays_frozen` from Task 11 guarantees `pyproject.toml` was NOT bumped.

- [ ] **Step 1: Bump the version**

In `config.yaml`, change the `version:` line to:

```yaml
version: "0.11.0"
```

- [ ] **Step 2: Add the CHANGELOG entry**

Insert at the top of `CHANGELOG.md`, immediately after the intro paragraph and before `## 0.10.0`:

```markdown
## 0.11.0

- **Observability:** the backend now logs to stdout (captured by
  `ha apps logs local_terminus`) at every degradation point. A new `log_level`
  add-on option (debug|info|warning|error, default info) sets the root level.
- **P0 fix:** the agent tools (`ha_basic_info`, `run_scene`, `trigger_automation`)
  now catch malformed-body (`json.JSONDecodeError`) and bad-URL
  (`httpx.InvalidURL`) failures and return a structured error instead of
  crashing the agent loop on the state-changing path.
- **Empty ≠ failed:** an automation drill-down now propagates a real
  websocket/auth failure as a 502 (surfaced in the UI) instead of returning an
  empty-but-successful 200; the REST 404→trace→related fallback ladder is each
  logged.
- **Hardening:** `referenced_ids` recursion is depth-bounded; the topology area
  sort tolerates non-string names; ws/REST URL parsing tolerates uppercase
  schemes and credentials; a corrupt `/data/options.json` is now logged.
- **Startup:** a missing `ANTHROPIC_API_KEY` now fails the agent graph with a
  clear, logged error instead of opaque proxy 502s.
- Python floor raised to `>=3.12` (matches the `3.12-alpine3.18` runtime).
```

- [ ] **Step 3: Run the full suite one last time**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest -q`
Expected: all tests PASS (every prior task's tests, green).

- [ ] **Step 4: Commit**

```bash
cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag
git add addons/terminus-langchain/config.yaml \
        addons/terminus-langchain/CHANGELOG.md
git commit -m "chore(terminus): release 0.11.0 — observability & error-handling robustness

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn"
```

---

## Final verification (after all tasks)

- [ ] **Run the complete suite:**

Run: `cd /Users/zrmn/Terminus/home-assistant/features/terminus-rag/addons/terminus-langchain/backend && python -m pytest -q`
Expected: all tests pass (existing + ~26 new test functions across Tasks 1-16).

- [ ] **Confirm the addon `check_config` is unaffected** (YAML untouched by this backend-only work, but `config.yaml` schema changed):

Run on device after deploy: `ha store reload && ha apps update local_terminus` (version bumped in Task 17) — verify the add-on starts and `ha apps logs local_terminus` shows the new `%(asctime)s %(levelname)s %(name)s %(message)s` format at info level.
