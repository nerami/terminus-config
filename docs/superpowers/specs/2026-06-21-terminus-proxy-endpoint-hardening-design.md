# Terminus — Proxy & Endpoint Hardening

**Date:** 2026-06-21
**Status:** Approved (design)
**Component:** `addons/terminus-langchain/backend/app/web.py`, `app/ha_registry.py`
**Spec:** B of 4 — independent of Spec 0/A. Carries the two HIGH-severity findings from the backend audit.

## Goal

Close the security and resource-exhaustion gaps in Terminus's FastAPI layer: the LangGraph reverse
proxy that blind-forwards the entire (unauthenticated) dev-server admin surface, the unbounded proxy
timeouts and request-header passthrough, the topology cache stampede, and the unbounded/timeout-free
Home Assistant websocket commands. None of this touches `terminus-rag` (separate add-on, hardened in
Spec 0); this is strictly Terminus's own public surface behind HA ingress.

## Background (verified)

`run.sh` launches **`langgraph dev`** — the in-memory *dev* server — on loopback `:2025`, persisting
threads under `/data/langgraph`. It has **no auth of its own** and threads are **not user-scoped**.
`web.py`'s `langgraph_proxy` forwards every method on `/api/{path}` to it, so any authenticated HA
ingress user can reach the full LangGraph SDK admin surface (`/threads`, thread delete/search,
assistants, store, crons) across *all* users' chats. HA ingress only proves "some HA user".

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Proxy exposure (H1) | **Path/method allowlist** of exactly what the frontend uses; reject the rest | Stops cross-user thread enumeration/deletion via ingress. Minimal, surgical; no LangGraph server swap. |
| Dev-server-in-prod | **Documented residual risk, not replaced here** | Migrating off `langgraph dev` is a larger architectural change; out of scope for this hardening pass but recorded. |
| Request headers (H2) | **Strip sensitive + hop-by-hop request headers before forwarding** | `host` already stripped; also drop `authorization`, `content-length`, `connection` so client can't desync/inject upstream. |
| Proxy timeouts (H2) | **Bounded connect/read; generous-but-finite stream read** | Replace `timeout=None`; a wedged upstream must not pin a connection forever. |
| Topology cache (M1) | **Single-flight the miss path** (`asyncio.Lock` / in-flight task) | Concurrent `/ha/topology` misses currently each run the expensive 4-call + per-automation fetch and open N websockets. |
| WS command timeout (M2) | **Per-command `asyncio.wait_for`; bound enrichment** | `_command`'s `while True` can block forever; per-automation `search/related` is serial and unbounded. |

## Changes

### H1 — LangGraph proxy allowlist (`web.py:langgraph_proxy`)

- Define an explicit allowlist of `(method, path-pattern)` pairs the **frontend SDK actually calls**:
  run/stream create + cancel, thread create, thread get/state for the caller, assistant get for the
  configured `assistantId`, and the SSE stream endpoints. (The exact set is enumerated from the
  frontend `Client` usage during planning; `/api/title` is already intercepted locally.)
- Requests outside the allowlist → `403` (or `404`) **before** forwarding. In particular, thread
  *search*, thread *delete* across ids, store, and cron endpoints are not forwarded.
- The allowlist is a small, well-commented table so future frontend needs extend it deliberately.

### H2 — request hygiene + timeouts (`web.py`)

- Forwarded request headers: extend the current `host`-only strip to also remove `authorization`,
  `content-length`, `connection`, and other hop-by-hop names (reuse/extend `_HOP_BY_HOP` for the
  request direction). Let httpx recompute length from the body.
- Replace `httpx.AsyncClient(..., timeout=None)` with a bounded `httpx.Timeout` (short connect, modest
  read for non-stream; for SSE streaming use a generous but finite read/inactivity bound, not infinite).
- Response side unchanged (already strips hop-by-hop, streams raw).

### M1 — topology cache single-flight (`web.py:ha_topology`)

- Add an `asyncio.Lock` (or a shared in-flight `asyncio.Task`/future on `app.state`) guarding the miss
  path: on cache miss, the first request runs `fetch_topology` while concurrent misses await the same
  result, then all read the freshly-populated cache. TTL semantics unchanged (`_TOPOLOGY_TTL`).

### M2 — websocket command timeouts (`ha_registry.py`)

- Wrap `_command`'s send/await-matching-id in `asyncio.wait_for` with a per-command timeout; on timeout
  raise a clear `HARegistryError` so callers degrade (and, per Spec C, log) instead of hanging.
- Bound the per-automation `search/related` enrichment: cap concurrency or total time (e.g. gather with
  a timeout), so a slow/wedged Core can't stall the whole `/ha/topology` request indefinitely.

## Error handling

- Allowlist rejections return a clear status with a short body; no upstream contact.
- Proxy timeouts surface as a `502/504` to the client (not a hang); logged (Spec C).
- WS command timeout → `HARegistryError` → existing endpoint handlers already map to `502` for the UI;
  Spec C adds the log line.

## Testing (TDD)

**Unit / app tests (`test_proxy.py`, `test_web.py`, `test_ha_registry.py`):**
- Allowlist: an allowed `(method, path)` forwards (fake upstream transport); a disallowed one
  (`DELETE /api/threads/<id>`, `POST /api/threads/search`, store/cron paths) is rejected **without**
  hitting the upstream (assert no upstream call).
- Header hygiene: forwarded request omits `authorization`/`content-length`/`host`/`connection`; body
  preserved.
- Timeouts: a stalling upstream transport yields a bounded error, not an unbounded await.
- Topology single-flight: two concurrent misses ⇒ exactly one `fetch_topology` invocation (assert call
  count) and both responses equal; a hit within TTL does not refetch.
- WS command timeout: a fake ws that never returns the matching id ⇒ `HARegistryError` within the
  timeout, not a hang; enrichment cap honored.

## Out of scope

- Replacing `langgraph dev` with a production LangGraph server / per-user thread namespacing (recorded
  as residual risk; larger change).
- Any auth change to HA ingress itself.
- `terminus-rag`'s own server hardening (lives in Spec 0).
