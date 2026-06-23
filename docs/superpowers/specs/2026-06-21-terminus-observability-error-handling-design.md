# Terminus — Observability & Error-Handling Robustness

**Date:** 2026-06-21
**Status:** Approved (design)
**Component:** `addons/terminus/backend/app/` (all modules)
**Spec:** C of 4 — independent of Spec 0/A/B. Retrofits the existing Terminus backend.

## Goal

The Terminus backend has **zero logging** and several broad `except` blocks that swallow failures into
empty-but-successful responses, plus a few correctness sharp edges and one P0 where tool errors crash
the agent graph instead of being reported. This spec adds structured logging at every degradation
point, broadens the tool error catch (P0), distinguishes "empty" from "failed", and fixes the
correctness edges — turning silent failures into observable, debuggable ones. (`terminus-rag` bakes
these in from the start per Spec 0; this spec is the retrofit for the existing code.)

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Logging | **Module-level loggers; log at every broad `except` before degrading** | The backend is currently dark; the Supervisor's `ha apps logs local_terminus` is the natural sink. |
| Tool error catch (P0) | **Broaden `tools.py` catches to include decode/URL errors** | `json.JSONDecodeError` / `httpx.InvalidURL` don't subclass `httpx.HTTPError`; today they escape as unhandled exceptions into LangGraph on the **state-changing** path. |
| Expected vs real failure | **Narrow "fallback" catches; propagate real failures** | `fetch_automation`'s REST 404→trace fallback should catch `HTTPStatusError`, not bare `Exception`; a real ws/auth failure should reach the `502` handler, not return empty-200. |
| Startup key guard | **No import-time `ChatAnthropic` crash; graceful, logged** | A missing/invalid key currently fails LangGraph server *load*, giving opaque proxy 502s instead of a clear message. |
| Correctness edges | **Bound recursion; guard non-str names; harden URL parsing** | `referenced_ids` unbounded recursion; `build_topology` `.lower()` on a non-str area name; `_normalize_ws_url`/`rest_target` string surgery. |
| Python floor | **Bump `requires-python` to `>=3.12`** | Matches the only supported runtime (`3.12-alpine3.18`); prevents 3.11-incompatible drift going unnoticed. |

## Changes (by module)

### Logging infrastructure (all modules)
- A `logging.getLogger(__name__)` per module; configure level from a `log_level` option/env in
  `web.py`/`run.sh` startup (default `info`). No handler gymnastics — log to stdout, which the
  Supervisor captures.
- At **every** broad `except` that degrades, add a `logger.warning`/`logger.exception` with context
  (entity/automation id, the exception) **before** returning the fallback. Covers the audit's findings
  in `ha_registry.py` (per-automation enrichment, trace fallback, outer ws), `web.py` (lifespan, the
  `502` endpoints), `title.py`, `config.py`, `ha_client.py`.

### `tools.py` — P0 broaden catch
- In `ha_basic_info`, `run_scene`, `trigger_automation`, broaden the `except httpx.HTTPError` to also
  catch `json.JSONDecodeError` and `httpx.InvalidURL` (or catch `Exception` narrowly with logging) so a
  malformed body / bad URL returns the structured `{"error": ...}` the agent prompt expects instead of
  crashing the ReAct loop. `.json()` after `raise_for_status()` is the likely culprit. Log the failure.

### `ha_registry.py` — expected vs real failure + correctness
- `fetch_automation` REST step: catch `httpx.HTTPStatusError` (the real 404→trace signal), not bare
  `Exception`, so a genuine bug doesn't masquerade as "fall back". Log the trace/related fallbacks.
- Distinguish empty-vs-failed at the outermost `except`: a real ws/auth failure should propagate to the
  `web.py` `502` handler (which surfaces to the UI) rather than returning `{"config": {}, ...}` empty-200.
- `referenced_ids`: bound the `walk()` recursion depth (explicit depth guard) so a pathological config
  can't `RecursionError`; log if the bound is hit.
- `build_topology`: guard the area-name sort against a non-str `name` (coerce/skip) so `.lower()` can't
  raise and blow up the whole snapshot.

### `config.py` — URL hardening + corrupt-options visibility
- `_normalize_ws_url` / `rest_target`: tolerate credentials, uppercase schemes, and obviously-malformed
  input (validate; log a warning on unparseable dev URLs) instead of silent string surgery producing a
  bad ws URL.
- `load_options`: log a **warning** when `/data/options.json` exists but fails to parse (distinguish
  "missing, fine" from "corrupt, broken") before returning `{}`.

### `agent.py` — startup key guard
- Don't let `ChatAnthropic(...)` construct-at-import crash server load when the key is absent/invalid.
  Guard in `build_graph` (clear, logged error / lazy construction) so the failure mode is a clean
  message, not opaque proxy 502s. (`title.py` already guards; mirror it.)

### `ha_client.py` — auth/transport visibility
- `run_forever`: log auth failures (`HAAuthError`) and transport errors at WARNING/ERROR (not just into
  the `_error` field read only via `/ha/status`). An auth-failed reconnect loop should be loud.

### `pyproject.toml`
- `requires-python = ">=3.12"`.

## Test backfill (TDD)

Beyond tests for each fix above, backfill the audit's untested critical paths:
- `clean_title`: truncation word-boundary branch; all-punctuation→empty collapse; non-str input
  degrades via the caller's guard.
- `_normalize_ws_url` / `rest_target`: every input form (http/https/ws/wss/bare/uppercase/credentials/
  trailing slash/`/api/websocket` suffix) — currently entirely uncovered.
- `fetch_automation` fallback ladder: REST-success, REST-404→trace-config, trace-absent→search/related,
  all-fail→empty (with the new propagation semantics).
- Approval middleware **resume**: the approve/edit/reject `Command(resume=...)` continuation round-trip
  (only interrupt-creation is covered today).
- Each new log line asserted where it matters (e.g. caplog shows a warning on corrupt options, on a
  swallowed enrichment failure, on auth failure).

## Error-handling philosophy (applied)

- **Tools return errors, never raise** into the graph (P0 fix makes this true on all paths).
- **Degrade to stale/empty only after logging**, never silently.
- **Empty ≠ failed**: a real failure is observable (log + correct status), not a 200 with empty data.

## Out of scope

- Metrics/tracing beyond stdout logging (no Prometheus/OTel here).
- Replacing the broad-`except` resilience *strategy* (it's correct for per-item degradation; we add
  visibility, not a rewrite).
- `terminus-rag` observability (built in via Spec 0).
