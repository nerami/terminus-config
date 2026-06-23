# Terminus Proxy & Endpoint Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the two HIGH (H1 proxy over-exposure, H2 unbounded timeouts + request-header passthrough) and two MEDIUM (M1 topology cache stampede, M2 unbounded/timeout-free HA websocket commands) findings in Terminus's FastAPI layer — `web.py` and `ha_registry.py` — without swapping the LangGraph dev server.

**Architecture:** `web.py`'s `langgraph_proxy` gains a small, explicit `(method, path-pattern)` allowlist matched **before** any upstream contact; non-matching requests get `403` with no upstream call. Forwarded requests strip sensitive + hop-by-hop request headers, and the shared `httpx.AsyncClient` swaps `timeout=None` for a bounded `httpx.Timeout` (finite connect/read so SSE can't pin a wedged socket forever). `ha_topology` single-flights its cache-miss path with an `asyncio.Lock` so concurrent misses run `fetch_topology` exactly once. `ha_registry._command` wraps each send/await-id in `asyncio.wait_for`, and `fetch_topology`'s per-automation enrichment is bounded by a total wall-clock budget.

**Tech Stack:** Python 3.12, FastAPI, Starlette, httpx (async client + `ASGITransport`/`MockTransport` for tests), `websockets` (faked in tests), pytest + pytest-asyncio (`asyncio_mode = "auto"`).

## Global Constraints

- **Base image:** `3.12-alpine3.18` — the `BUILD_FROM` ARG in `addons/terminus/Dockerfile` must stay `ghcr.io/home-assistant/aarch64-base-python:3.12-alpine3.18` (never bare `:3.12`). This plan does not touch the Dockerfile.
- **Single canonical version:** `addons/terminus/config.yaml` `version` is the ONLY version bumped. Do NOT bump `frontend/package.json` or `backend/pyproject.toml` (pinned `0.0.0` for Docker cache).
- **CHANGELOG per bump:** every `config.yaml` `version` bump adds a matching `CHANGELOG.md` heading. **Cross-plan release coordination:** the three `terminus` plans share this branch and bump the same `config.yaml`, so versions are assigned sequentially in the recommended order C → B → A: Spec C releases `0.11.0`, **this plan (B) releases `0.12.0`**, Spec A releases `0.13.0`. (If B is run standalone before C, it is `0.10.0` → `0.11.0` instead.) `terminus-rag` is a separate add-on at its own `0.1.0` — no conflict.
- **Tests:** pytest with `asyncio_mode = "auto"` (set in `backend/pyproject.toml:36`) — async tests need no `@pytest.mark.asyncio`. All tests live under `addons/terminus/backend/tests/`. Run from `addons/terminus/backend/`.
- **HTTP layer:** httpx + FastAPI/Starlette only. Tests use fake transports (`httpx.ASGITransport`, `httpx.MockTransport`) and fake websockets (no live HA, no live `langgraph dev`).
- **TDD:** every behavior change is failing-test-first → run & watch fail → minimal impl → pass → commit.
- **Commits:** Conventional Commits. Every commit message ends with the trailer:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
  ```

  (The trailer is omitted from the short `git commit -m "..."` lines below for brevity; **always append it** — use a second `-m` block or a heredoc.)

---

## Background facts pinned for the implementer

These are the exact lines this plan changes. Read them before starting.

**`addons/terminus/backend/app/web.py`:**
- `_HOP_BY_HOP` set — `web.py:34-40` (currently: `content-length`, `content-encoding`, `transfer-encoding`, `connection`, `keep-alive`). This is used for the **response** direction at `web.py:197-201`.
- `_TOPOLOGY_TTL = 15.0` — `web.py:60`.
- Lifespan creates the shared proxy client with `timeout=None` — `web.py:89-91`:
  ```python
  app.state.http = httpx.AsyncClient(
      base_url=LANGGRAPH_URL, transport=proxy_transport, timeout=None
  )
  ```
- `ha_topology` cache-miss path — `web.py:117-131` (reads `app.state.topology_cache`, calls `ha_registry.fetch_topology`, writes cache). No single-flight guard.
- `langgraph_proxy` — `web.py:175-207`. The `@app.api_route("/api/{path:path}", methods=[...])` decorator and handler. Request headers stripped only of `host` at `web.py:186-188`. No allowlist. Builds + sends upstream at `web.py:189-196`.
- `/api/title` is intercepted locally **before** the proxy — `web.py:168-173`. It must stay reachable (it is not a LangGraph path).

**`addons/terminus/backend/app/ha_registry.py`:**
- `_command(ws, mid, payload)` — `ha_registry.py:42-50`. The `while True:` recv loop has no timeout (line 44).
- `fetch_topology` — `ha_registry.py:247-277`. Per-automation `search/related` enrichment loop `for automation in topology["automations"]:` at `ha_registry.py:268-275` is serial and unbounded.
- `HARegistryError` — `ha_registry.py:27-28`. Reused for the new timeout error.

**Test style to match** (`addons/terminus/backend/tests/`):
- `test_proxy.py` — `_upstream_transport()` builds a `Starlette` app wrapped in `httpx.ASGITransport`; `create_app(..., proxy_transport=...)`; drives via `fastapi.testclient.TestClient`.
- `test_web.py` — `_fake_connect(incoming)` returns a `_connect(url)` yielding a `_FakeWS` from an async CM; `StubHA`; `httpx.MockTransport(handler)` for REST.
- `test_ha_registry.py` — `FakeWS` (records `.sent`, pops `._incoming`), `fake_connect(ws)`, async tests with no marker (auto mode).

## H1 allowlist — enumerated from REAL frontend usage

Derived by reading the frontend and the bundled SDK in `frontend/node_modules/@langchain/langgraph-sdk@1.9.23` (specifier `^1.8.10`):

- **Direct SDK calls** (`frontend/src/providers/thread.tsx`): `client.threads.search` (line 55), `client.threads.update` (lines 70, 84).
- **`useStream` hook** (`frontend/src/providers/stream.tsx:81`, `useTypedStream`), whose internals (`node_modules/@langchain/langgraph-sdk/dist/react/stream.lgp.js`) call: `client.threads.create`, `client.threads.get`, `client.threads.getState`, `client.threads.getHistory`, `client.runs.stream`, `client.runs.cancel`, `client.runs.join`, `client.runs.joinStream`, `client.runs.get`.
- **Plain `fetch`** (not SDK, already handled locally / separately): `GET {apiUrl}/info` (graph-ready poll, `stream.tsx:55`) and `POST {apiUrl}/title` (`thread.tsx:99`, intercepted at `web.py:168` — never reaches the proxy).

Mapping each SDK method to its concrete `(method, path)` (from `dist/client/threads/index.js`, `dist/client/runs/index.js`, `dist/client/assistants/index.js`) gives the allowlist below. Paths are **after** the `/api` prefix is stripped (the proxy already strips `/api`, so it matches against `/threads/...`, `/runs/...`, `/info`). `{id}` segments are opaque url-safe id tokens (uuid or langgraph thread/run id).

| Method | Path pattern (post-`/api`) | Source (frontend → SDK endpoint) |
|---|---|---|
| `GET`  | `/info` | graph-ready poll (`stream.tsx:55`) — needed for the warming-up gate |
| `POST` | `/threads` | `threads.create` (`stream.lgp.js` → `dist/client/threads/index.js:31`) |
| `GET`  | `/threads/{id}` | `threads.get` (`threads/index.js:15`) |
| `PATCH`| `/threads/{id}` | `threads.update` (`thread.tsx:70,84` → `threads/index.js:66`) |
| `POST` | `/threads/search` | `threads.search` (`thread.tsx:55` → `threads/index.js:115`) |
| `GET`  | `/threads/{id}/state` | `threads.getState` (`threads/index.js:172`) |
| `POST` | `/threads/{id}/history` | `threads.getHistory` (`threads/index.js:222`) |
| `POST` | `/threads/{id}/runs/stream` | `runs.stream` (`runs/index.js:36`) |
| `GET`  | `/threads/{id}/runs/{id}` | `runs.get` (`runs/index.js:185`) |
| `POST` | `/threads/{id}/runs/{id}/cancel` | `runs.cancel` (`runs/index.js:197`) |
| `GET`  | `/threads/{id}/runs/{id}/join` | `runs.join` (`runs/index.js:232`) |
| `GET`  | `/threads/{id}/runs/{id}/stream` | `runs.joinStream` (`runs/index.js:249`) |

**Explicitly NOT forwarded** (rejected with `403`, no upstream call): `DELETE /threads/{id}` (cross-id thread delete), `POST /threads/search` is allowed but `DELETE`/`POST /threads/prune`, `POST /threads/count`, `/store/*`, `/runs/crons` / `/crons/*`, `/assistants/*` (the frontend never calls assistants over the proxy — `assistantId` is a static config value), and any method on a path not in the table.

`OPTIONS` (CORS preflight) is **not** in the allowlist and not needed: the SPA is same-origin under HA ingress, so browsers issue no preflight. `OPTIONS` therefore falls through to `403`.

---

## File structure

- **Modify** `addons/terminus/backend/app/web.py`:
  - Add `_PROXY_ALLOWLIST` table + `_is_allowed(method, path)` helper (module level, near `_HOP_BY_HOP`).
  - Add `_REQUEST_STRIP_HEADERS` set + reuse in `langgraph_proxy`.
  - Add `_PROXY_TIMEOUT = httpx.Timeout(...)`; use it in the lifespan client.
  - Reject non-allowlisted requests in `langgraph_proxy` before building the upstream request.
  - Single-flight `ha_topology` via a new `asyncio.Lock` stored on `app.state.topology_lock`.
- **Modify** `addons/terminus/backend/app/ha_registry.py`:
  - Add `_COMMAND_TIMEOUT` + `_ENRICH_BUDGET` module constants.
  - Wrap `_command`'s recv loop in `asyncio.wait_for`; raise `HARegistryError` on timeout.
  - Bound `fetch_topology`'s enrichment loop with a wall-clock budget.
- **Create/extend tests** under `addons/terminus/backend/tests/`:
  - `test_proxy.py` — allowlist (allow/reject + no-upstream-call assertion), header hygiene, timeout.
  - `test_web.py` — topology single-flight (exactly one fetch under concurrent misses; hit within TTL no refetch).
  - `test_ha_registry.py` — `_command` timeout → `HARegistryError`; enrichment budget honored.
- **Modify** `addons/terminus/config.yaml` (`version: "0.12.0"`) and `CHANGELOG.md` (final task).

---

## Task 1: H1 — reject non-allowlisted proxy requests before forwarding

**Files:**
- Modify: `addons/terminus/backend/app/web.py` (add allowlist near `web.py:34-40`; gate inside `langgraph_proxy` at `web.py:179-196`)
- Test: `addons/terminus/backend/tests/test_proxy.py` (extend existing file)

**Interfaces:**
- Produces (module-level in `web.py`):
  - `_PROXY_ALLOWLIST: tuple[tuple[str, re.Pattern[str]], ...]` — `(method, compiled-path-regex)` pairs.
  - `_is_allowed(method: str, path: str) -> bool` — `path` is the post-`/api` path **without** a leading slash (the proxy's `path` param) OR with one; the helper normalizes by matching against a leading-slash-tolerant regex. Returns `True` iff some allowlist entry matches.
- Consumes: the existing `langgraph_proxy(path: str, request: Request)` signature at `web.py:179`.

- [ ] **Step 1: Write the failing test**

Add to `addons/terminus/backend/tests/test_proxy.py`. First extend `_upstream_transport()` to record calls and to serve the allowed endpoints used by the tests, then add the allow/reject tests.

Replace the existing `_upstream_transport()` with a call-recording version and add new tests at the end of the file:

```python
def _recording_upstream():
    """Streaming stand-in for LangGraph that records every path it is asked to serve."""
    calls: list[tuple[str, str]] = []

    async def record(request):
        calls.append((request.method, request.url.path))
        return StarletteJSON({"ok": True})

    async def runs_stream(request):
        calls.append((request.method, request.url.path))

        async def gen():
            yield b"event: messages\ndata: {\"x\":1}\n\n"

        return StreamingResponse(gen(), media_type="text/event-stream")

    app = Starlette(
        routes=[
            Route("/threads", record, methods=["POST"]),
            Route("/threads/search", record, methods=["POST"]),
            Route("/threads/t1", record, methods=["GET", "PATCH"]),
            Route("/threads/t1/state", record, methods=["GET"]),
            Route("/threads/t1/runs/stream", runs_stream, methods=["POST"]),
            Route("/threads/t1/runs/r1/cancel", record, methods=["POST"]),
        ]
    )
    return httpx.ASGITransport(app=app), calls


def test_proxy_allows_thread_search():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/search", json={"limit": 10})
        assert resp.status_code == 200
    assert ("POST", "/threads/search") in calls


def test_proxy_rejects_thread_delete_without_upstream_call():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.request("DELETE", "/api/threads/t1")
        assert resp.status_code == 403
    # The whole point: a rejected request never touches the upstream.
    assert calls == []


def test_proxy_rejects_thread_prune_and_store_and_crons():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        assert tc.post("/api/threads/prune").status_code == 403
        assert tc.post("/api/threads/count").status_code == 403
        assert tc.get("/api/store/items").status_code == 403
        assert tc.get("/api/runs/crons").status_code == 403
        assert tc.get("/api/assistants/agent").status_code == 403
    assert calls == []


def test_proxy_allows_run_stream_and_cancel():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        assert tc.post("/api/threads/t1/runs/stream", json={}).status_code == 200
        assert tc.post("/api/threads/t1/runs/r1/cancel").status_code == 200
    assert ("POST", "/threads/t1/runs/stream") in calls
    assert ("POST", "/threads/t1/runs/r1/cancel") in calls
```

The two original tests (`test_proxy_forwards_and_strips_api_prefix`, `test_proxy_streams_sse_body`) used the now-removed `_upstream_transport()` and posted to bare `/api/runs/stream`, which is **not** allowlisted (the frontend always streams with a threadId → `/threads/{id}/runs/stream`; the bare `/runs/stream` SDK path fires only when `threadId == null`, which `useStream` never does because it creates the thread first). Rewrite the two original tests to use `_recording_upstream()` and allowlisted paths:

```python
def test_proxy_forwards_and_strips_api_prefix():
    transport, _calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/search", json={"limit": 10})
        assert resp.status_code == 200
        assert resp.json() == {"ok": True}


def test_proxy_streams_sse_body():
    transport, _calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/t1/runs/stream", json={})
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers["content-type"]
        assert b"event: messages" in resp.content
```

`_recording_upstream`'s `/threads/t1/runs/stream` route is the SSE-yielding `runs_stream` handler, so the streaming assertion holds. Delete the old `_upstream_transport()` helper.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py -v`
Expected: `test_proxy_rejects_*` FAIL — the proxy currently forwards everything, so `DELETE /api/threads/t1` returns the upstream's `405`/`404` (or `calls` is non-empty), not `403`. `NameError`/route errors if `_recording_upstream` references are incomplete — fix those first.

- [ ] **Step 3: Write minimal implementation**

In `web.py`, add `import re` to the imports (top of file, alongside `import os`). Then add the allowlist + helper directly after the `_HOP_BY_HOP` block (after `web.py:40`):

```python
# --- LangGraph proxy allowlist (H1) --------------------------------------
# Exactly the (method, path) pairs the frontend SDK calls, derived from
# frontend/src/providers/{thread,stream}.tsx + the bundled
# @langchain/langgraph-sdk client. Paths are matched AFTER the "/api" prefix
# is stripped. Anything not listed is rejected (403) BEFORE any upstream call,
# so thread enumeration/deletion, store, and cron admin surfaces stay closed.
# {id} segments are opaque url-safe tokens (no slash).
_ID = r"[^/]+"
_PROXY_ALLOWLIST: tuple[tuple[str, "re.Pattern[str]"], ...] = (
    ("GET", re.compile(r"^/info$")),
    ("POST", re.compile(r"^/threads$")),
    ("POST", re.compile(r"^/threads/search$")),
    ("GET", re.compile(rf"^/threads/{_ID}$")),
    ("PATCH", re.compile(rf"^/threads/{_ID}$")),
    ("GET", re.compile(rf"^/threads/{_ID}/state$")),
    ("POST", re.compile(rf"^/threads/{_ID}/history$")),
    ("POST", re.compile(rf"^/threads/{_ID}/runs/stream$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}$")),
    ("POST", re.compile(rf"^/threads/{_ID}/runs/{_ID}/cancel$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}/join$")),
    ("GET", re.compile(rf"^/threads/{_ID}/runs/{_ID}/stream$")),
)


def _is_allowed(method: str, path: str) -> bool:
    """True iff (method, path) is in the proxy allowlist.

    ``path`` is the proxy's captured ``{path:path}`` (no leading slash); we
    normalize to a single leading slash before matching.
    """
    norm = "/" + path.lstrip("/")
    method = method.upper()
    return any(m == method and pat.match(norm) for m, pat in _PROXY_ALLOWLIST)
```

Then gate the proxy. In `langgraph_proxy` (`web.py:179`), insert the rejection at the very top of the function body, before reading `app.state.http`:

```python
    async def langgraph_proxy(path: str, request: Request):
        """Reverse-proxy LangGraph SDK calls to the local langgraph server.

        Strips the ``/api`` prefix and streams the response so SSE run streams
        flow through unbuffered. Only the explicit ``_PROXY_ALLOWLIST`` of
        (method, path) pairs the frontend uses is forwarded; everything else is
        rejected here, before any upstream contact.
        """
        if not _is_allowed(request.method, path):
            return JSONResponse(
                {"error": "not allowed"}, status_code=403
            )
        client_http: httpx.AsyncClient = app.state.http
        # ... rest unchanged (web.py:186 onward)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py -v`
Expected: PASS (all allow/reject tests green; the two original tests still pass).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/web.py \
        addons/terminus/backend/tests/test_proxy.py
git commit -m "feat(terminus): allowlist the langgraph proxy (H1)"
```

(Append the required trailer block.)

---

## Task 2: H2 — strip sensitive + hop-by-hop request headers before forwarding

**Files:**
- Modify: `addons/terminus/backend/app/web.py` (add `_REQUEST_STRIP_HEADERS`; use it at the header-build step `web.py:186-188`)
- Test: `addons/terminus/backend/tests/test_proxy.py` (extend)

**Interfaces:**
- Produces: `_REQUEST_STRIP_HEADERS: frozenset[str]` — lowercase header names dropped from the **forwarded request**: `host`, `authorization`, `content-length`, `connection`, `keep-alive`, `proxy-authorization`, `te`, `trailer`, `transfer-encoding`, `upgrade`.
- Consumes: `_is_allowed`/allowlist from Task 1 (header test reuses an allowed path).

- [ ] **Step 1: Write the failing test**

Add to `test_proxy.py`. An upstream that echoes back the headers it received lets us assert the strip.

```python
def _header_echo_upstream():
    async def echo(request):
        # Echo the headers the proxy actually forwarded.
        return StarletteJSON({"headers": dict(request.headers)})

    app = Starlette(routes=[Route("/threads/search", echo, methods=["POST"])])
    return httpx.ASGITransport(app=app)


def test_proxy_strips_sensitive_request_headers():
    app = create_app(
        settings=_settings(), client=None, proxy_transport=_header_echo_upstream()
    )
    with TestClient(app) as tc:
        resp = tc.post(
            "/api/threads/search",
            json={"limit": 10},
            headers={
                "Authorization": "Bearer leak-me",
                "Connection": "keep-alive",
                "X-Api-Key": "keep-me",
            },
        )
        assert resp.status_code == 200
        fwd = {k.lower(): v for k, v in resp.json()["headers"].items()}
    # Sensitive + hop-by-hop request headers are gone...
    assert "authorization" not in fwd
    assert "host" not in fwd or fwd.get("host") != "testserver"
    assert "connection" not in fwd
    # ...but a benign app header is preserved, and httpx recomputed the body length.
    assert fwd.get("x-api-key") == "keep-me"
    assert fwd.get("content-length") is not None  # recomputed by httpx, not desynced
```

Note on `host`: httpx sets `host` to the upstream (`127.0.0.1:2025` / the ASGI transport host) when it rebuilds the request, so the client's `testserver` host never leaks. The assertion tolerates httpx's own host.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py::test_proxy_strips_sensitive_request_headers -v`
Expected: FAIL — `authorization` is currently forwarded (only `host` is stripped at `web.py:186-188`), so `"authorization" not in fwd` fails.

- [ ] **Step 3: Write minimal implementation**

In `web.py`, add after the `_PROXY_ALLOWLIST` block:

```python
# Request headers we never forward upstream (H2): the caller's HA-ingress
# auth must not reach the langgraph dev server, and hop-by-hop headers must
# not let a client desync/inject on the upstream connection. httpx recomputes
# content-length from the body it actually sends.
_REQUEST_STRIP_HEADERS = frozenset(
    {
        "host",
        "authorization",
        "proxy-authorization",
        "content-length",
        "connection",
        "keep-alive",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
    }
)
```

Then replace the header dict-comprehension in `langgraph_proxy` (`web.py:186-188`):

```python
        headers = {
            k: v
            for k, v in request.headers.items()
            if k.lower() not in _REQUEST_STRIP_HEADERS
        }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py -v`
Expected: PASS (new header test green; allowlist + original proxy tests still pass).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/web.py \
        addons/terminus/backend/tests/test_proxy.py
git commit -m "fix(terminus): strip sensitive + hop-by-hop request headers in proxy (H2)"
```

---

## Task 3: H2 — bounded proxy timeouts (replace `timeout=None`)

**Files:**
- Modify: `addons/terminus/backend/app/web.py` (add `_PROXY_TIMEOUT`; use at lifespan client `web.py:89-91`)
- Test: `addons/terminus/backend/tests/test_proxy.py` (extend)

**Interfaces:**
- Produces: `_PROXY_TIMEOUT: httpx.Timeout` — finite `connect`/`read`/`write`/`pool`. `read` is the per-chunk inactivity bound; finite so a wedged SSE upstream raises `httpx.ReadTimeout` instead of hanging forever.
- Consumes: the lifespan `httpx.AsyncClient(...)` at `web.py:89-91`.

- [ ] **Step 1: Write the failing test**

A transport whose response body never yields a chunk must surface a bounded error (not hang). We override the timeout to a tiny value via a module-level monkeypatch so the test is fast.

```python
import asyncio

import pytest


def _stalling_upstream():
    """Upstream that opens an SSE stream then never sends a byte."""

    async def stall(_request):
        async def gen():
            # Never yields; the read timeout must fire.
            await asyncio.sleep(3600)
            yield b""  # pragma: no cover

        return StreamingResponse(gen(), media_type="text/event-stream")

    app = Starlette(routes=[Route("/threads/t1/runs/stream", stall, methods=["POST"])])
    return httpx.ASGITransport(app=app)


def test_proxy_bounded_read_timeout(monkeypatch):
    from app import web

    # Shrink the read timeout so the test finishes in well under a second.
    monkeypatch.setattr(
        web, "_PROXY_TIMEOUT", httpx.Timeout(0.1, connect=0.1)
    )
    app = create_app(
        settings=_settings(), client=None, proxy_transport=_stalling_upstream()
    )
    with TestClient(app) as tc:
        with pytest.raises(httpx.TimeoutException):
            tc.post("/api/threads/t1/runs/stream", json={})
```

The proxy sends with `stream=True` (`web.py:196`) and the read timeout fires while awaiting the first chunk. Under `TestClient` (which runs the app via its own ASGI portal), the `httpx.ReadTimeout` raised inside `langgraph_proxy` propagates out of `client_http.send(...)`. Asserting `httpx.TimeoutException` (the base class of `ReadTimeout`/`ConnectTimeout`) keeps it robust.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py::test_proxy_bounded_read_timeout -v`
Expected: FAIL — `_PROXY_TIMEOUT` does not exist yet (`AttributeError` on the `monkeypatch.setattr`). After it exists but before the lifespan uses it, the test would hang on the 3600s sleep, proving the timeout is load-bearing.

- [ ] **Step 3: Write minimal implementation**

In `web.py`, add near the other module constants (after `LANGGRAPH_URL`, `web.py:31`):

```python
# Bounded proxy timeouts (H2). A wedged upstream must not pin a connection
# forever. ``read`` is the per-chunk inactivity bound: generous enough for a
# slow LLM token stream, finite so an SSE stream that goes silent eventually
# raises httpx.ReadTimeout instead of hanging.
_PROXY_TIMEOUT = httpx.Timeout(
    None,  # default (overridden below per-phase)
    connect=10.0,
    read=120.0,
    write=30.0,
    pool=10.0,
)
```

Note: `httpx.Timeout`'s first positional is the default for any phase not named; we name all four, so the positional `None` is never used. (Equivalently `httpx.Timeout(connect=10.0, read=120.0, write=30.0, pool=10.0)`.) Then change the lifespan client (`web.py:89-91`):

```python
        app.state.http = httpx.AsyncClient(
            base_url=LANGGRAPH_URL, transport=proxy_transport, timeout=_PROXY_TIMEOUT
        )
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/backend && python -m pytest tests/test_proxy.py -v`
Expected: PASS — the stalling-upstream test raises `httpx.TimeoutException` within ~0.1s; all other proxy tests still pass.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/web.py \
        addons/terminus/backend/tests/test_proxy.py
git commit -m "fix(terminus): bound proxy httpx timeouts, drop timeout=None (H2)"
```

---

## Task 4: M1 — single-flight the topology cache miss path

**Files:**
- Modify: `addons/terminus/backend/app/web.py` (init `app.state.topology_lock` in lifespan near `web.py:88`; guard the miss path in `ha_topology` at `web.py:117-131`)
- Test: `addons/terminus/backend/tests/test_web.py` (extend)

**Interfaces:**
- Produces: `app.state.topology_lock: asyncio.Lock` (created in the lifespan). `ha_topology` acquires it on a miss, double-checks the cache after acquiring, runs `ha_registry.fetch_topology` once, writes the cache, releases.
- Consumes: existing `app.state.topology_cache` tuple `(monotonic_ts, data)` and `_TOPOLOGY_TTL` (`web.py:60`), and `ha_registry.fetch_topology(settings, registry_connect)`.

- [ ] **Step 1: Write the failing test**

Add to `test_web.py`. A `registry_connect` that counts how many times it is invoked, plus a small per-call delay, lets two concurrent `/ha/topology` requests race the miss path. We drive concurrency with `httpx.AsyncClient(ASGITransport)` + `asyncio.gather` (the sync `TestClient` serializes requests, so it can't expose the stampede).

```python
import asyncio

from httpx import ASGITransport, AsyncClient


def _counting_connect(incoming, counter, delay=0.05):
    """A registry connect fn that records each open and stalls briefly,
    widening the window for a cache stampede."""

    def _connect(url):
        counter["opens"] += 1

        class _CM:
            async def __aenter__(self):
                await asyncio.sleep(delay)
                return _FakeWS(list(incoming))

            async def __aexit__(self, *exc):
                return False

        return _CM()

    return _connect


_TOPO_INCOMING = [
    {"type": "auth_required"},
    {"type": "auth_ok"},
    {"id": 1, "type": "result", "success": True,
     "result": [{"area_id": "kitchen", "name": "Kitchen"}]},
    {"id": 2, "type": "result", "success": True, "result": []},
    {"id": 3, "type": "result", "success": True,
     "result": [{"entity_id": "light.kitchen", "area_id": "kitchen"}]},
    {"id": 4, "type": "result", "success": True,
     "result": [{"entity_id": "light.kitchen", "attributes": {"friendly_name": "K"}}]},
]


async def test_topology_single_flight_under_concurrent_misses():
    counter = {"opens": 0}
    app = create_app(
        settings=_settings("ws://x"),
        client=StubHA({"status": "connected"}),
        registry_connect=_counting_connect(_TOPO_INCOMING, counter),
    )
    transport = ASGITransport(app=app)
    async with app.router.lifespan_context(app):
        async with AsyncClient(transport=transport, base_url="http://t") as ac:
            r1, r2 = await asyncio.gather(
                ac.get("/ha/topology"), ac.get("/ha/topology")
            )
    assert r1.status_code == 200 and r2.status_code == 200
    assert r1.json() == r2.json()
    # The whole point of M1: concurrent misses fetch exactly once.
    assert counter["opens"] == 1


async def test_topology_hit_within_ttl_does_not_refetch():
    counter = {"opens": 0}
    app = create_app(
        settings=_settings("ws://x"),
        client=StubHA({"status": "connected"}),
        registry_connect=_counting_connect(_TOPO_INCOMING, counter, delay=0.0),
    )
    transport = ASGITransport(app=app)
    async with app.router.lifespan_context(app):
        async with AsyncClient(transport=transport, base_url="http://t") as ac:
            await ac.get("/ha/topology")  # miss -> fetch
            await ac.get("/ha/topology")  # hit within TTL -> no fetch
    assert counter["opens"] == 1
```

These tests use `app.router.lifespan_context(app)` so `app.state.topology_lock` / `app.state.http` get created exactly as in production startup. `_FakeWS` and `StubHA` already exist in `test_web.py`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus/backend && python -m pytest tests/test_web.py::test_topology_single_flight_under_concurrent_misses -v`
Expected: FAIL — `counter["opens"] == 2` (both concurrent misses run `fetch_topology`, opening two websockets) because there is no single-flight guard.

- [ ] **Step 3: Write minimal implementation**

In `web.py`, add `app.state.topology_lock` to the lifespan. After `app.state.topology_cache = None` (`web.py:88`), add:

```python
        app.state.topology_cache = None  # (monotonic_ts, data)
        app.state.topology_lock = asyncio.Lock()
```

Then rewrite the `ha_topology` miss path (`web.py:117-131`) to double-check under the lock:

```python
    @app.get("/ha/topology")
    async def ha_topology():
        if not settings.ws_url:
            return JSONResponse(_NOT_CONFIGURED_ERROR, status_code=503)

        def _fresh_cache():
            cached = getattr(app.state, "topology_cache", None)
            if cached is not None and (time.monotonic() - cached[0]) < _TOPOLOGY_TTL:
                return cached[1]
            return None

        hit = _fresh_cache()
        if hit is not None:
            return JSONResponse(hit)

        # Cache miss: single-flight so concurrent misses don't each run the
        # expensive 4-call + per-automation fetch and open N websockets (M1).
        async with app.state.topology_lock:
            hit = _fresh_cache()  # another waiter may have populated it
            if hit is not None:
                return JSONResponse(hit)
            try:
                data = await ha_registry.fetch_topology(settings, registry_connect)
            except Exception as exc:  # noqa: BLE001 - surface as a 502 to the UI
                return JSONResponse(
                    {"error": f"{type(exc).__name__}: {exc}"}, status_code=502
                )
            app.state.topology_cache = (time.monotonic(), data)
            return JSONResponse(data)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/backend && python -m pytest tests/test_web.py -v`
Expected: PASS — `counter["opens"] == 1` in both new tests; the existing `test_topology_*` tests still pass.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/web.py \
        addons/terminus/backend/tests/test_web.py
git commit -m "fix(terminus): single-flight the topology cache miss path (M1)"
```

---

## Task 5: M2a — per-command websocket timeout in `_command`

**Files:**
- Modify: `addons/terminus/backend/app/ha_registry.py` (add `_COMMAND_TIMEOUT`; wrap the recv loop in `_command` at `ha_registry.py:42-50`)
- Test: `addons/terminus/backend/tests/test_ha_registry.py` (extend)

**Interfaces:**
- Produces: `_COMMAND_TIMEOUT: float` (seconds) module constant; `_command` raises `HARegistryError` when no matching-id reply arrives within `_COMMAND_TIMEOUT`.
- Consumes: existing `_command(ws, mid, payload)` and `HARegistryError` (`ha_registry.py:27`).

- [ ] **Step 1: Write the failing test**

Add to `test_ha_registry.py`. A `FakeWS` whose `recv()` never returns the matching id (it blocks) must yield `HARegistryError` within the timeout, not hang. We need a `recv` that *awaits forever* to exercise `asyncio.wait_for`, so add a hanging fake and monkeypatch the timeout small.

```python
import asyncio

from app import ha_registry
from app.ha_registry import _command


class HangingWS:
    """recv() blocks forever — simulates a Core that never answers an id."""

    def __init__(self):
        self.sent = []

    async def send(self, data):
        self.sent.append(json.loads(data))

    async def recv(self):
        await asyncio.Future()  # never resolves


async def test_command_times_out_to_ha_registry_error(monkeypatch):
    monkeypatch.setattr(ha_registry, "_COMMAND_TIMEOUT", 0.05)
    ws = HangingWS()
    with pytest.raises(HARegistryError):
        await _command(ws, 1, {"type": "config/area_registry/list"})


async def test_command_returns_result_before_timeout(monkeypatch):
    # A normal, prompt reply still works under the timeout.
    monkeypatch.setattr(ha_registry, "_COMMAND_TIMEOUT", 5.0)
    ws = FakeWS(
        [{"id": 7, "type": "result", "success": True, "result": ["ok"]}]
    )
    result = await _command(ws, 7, {"type": "get_states"})
    assert result == ["ok"]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py::test_command_times_out_to_ha_registry_error -v`
Expected: FAIL — `_COMMAND_TIMEOUT` does not exist (`AttributeError` on `monkeypatch.setattr`). Without the timeout the test would hang on the never-resolving future, proving the wrap is load-bearing.

- [ ] **Step 3: Write minimal implementation**

In `ha_registry.py`, add `import asyncio` (top, alongside `import json`) and a module constant after the `ConnectFn` type alias (`ha_registry.py:24`):

```python
# Per-websocket-command timeout (M2). A command's send + await-matching-id
# must not block forever on a wedged Core; on timeout we raise HARegistryError
# so callers degrade (and, per Spec C, log) instead of hanging.
_COMMAND_TIMEOUT = 15.0
```

Then wrap the recv loop in `_command` (`ha_registry.py:42-50`):

```python
async def _command(ws, mid: int, payload: dict) -> Any:
    await ws.send(json.dumps({"id": mid, **payload}))

    async def _await_reply() -> Any:
        while True:
            msg = json.loads(await ws.recv())
            if msg.get("id") == mid:
                if not msg.get("success", True):
                    err = (msg.get("error") or {}).get("message", "command failed")
                    raise HARegistryError(err)
                return msg.get("result")

    try:
        return await asyncio.wait_for(_await_reply(), timeout=_COMMAND_TIMEOUT)
    except asyncio.TimeoutError as exc:
        raise HARegistryError(
            f"websocket command {payload.get('type', mid)!r} timed out "
            f"after {_COMMAND_TIMEOUT}s"
        ) from exc
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS — the hanging case raises `HARegistryError` within ~0.05s; the prompt case returns `["ok"]`; all existing `ha_registry` tests still pass (they reply promptly, well under 15s).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/ha_registry.py \
        addons/terminus/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): per-command websocket timeout in ha_registry (M2)"
```

---

## Task 6: M2b — bound the per-automation enrichment in `fetch_topology`

**Files:**
- Modify: `addons/terminus/backend/app/ha_registry.py` (add `_ENRICH_BUDGET`; bound the enrichment loop at `ha_registry.py:267-275`)
- Test: `addons/terminus/backend/tests/test_ha_registry.py` (extend)

**Interfaces:**
- Produces: `_ENRICH_BUDGET: float` (seconds) module constant. `fetch_topology`'s per-automation `search/related` loop stops enriching once the cumulative wall-clock spent in enrichment exceeds `_ENRICH_BUDGET`; automations not reached get `_empty_refs()` so the topology still renders. The registry-list phase (areas/devices/entities/states) is unaffected — only the enrichment loop is budgeted.
- Consumes: `_search_related`, `_empty_refs`, `_command` (now timeout-bounded from Task 5), and the existing `topology["automations"]` list.

- [ ] **Step 1: Write the failing test**

Add to `test_ha_registry.py`. Build a topology with several automations where each `search/related` reply is delayed; with a tiny budget, only the first automation (or none) gets real references and the rest fall back to empty — and crucially the call returns promptly rather than awaiting every automation.

```python
import time


def _slow_related_ws(num_automations, per_call_delay):
    """A FakeWS where each search/related recv is artificially slow."""
    states = []
    for i in range(num_automations):
        states.append(
            {
                "entity_id": f"automation.a{i}",
                "attributes": {"friendly_name": f"A{i}", "id": str(1000 + i)},
            }
        )
    incoming = [
        {"type": "auth_required"},
        {"type": "auth_ok"},
        {"id": 1, "type": "result", "success": True, "result": []},   # areas
        {"id": 2, "type": "result", "success": True, "result": []},   # devices
        {"id": 3, "type": "result", "success": True, "result": []},   # entities
        {"id": 4, "type": "result", "success": True, "result": states},  # states
    ]
    for i in range(num_automations):
        incoming.append(
            {
                "id": 5 + i,
                "type": "result",
                "success": True,
                "result": {"entity": [f"light.l{i}"]},
            }
        )

    class SlowWS(FakeWS):
        async def recv(self):
            # Only the search/related replies (after the 4 list cmds + auth) are slow.
            if len(self.sent) > 5:
                await asyncio.sleep(per_call_delay)
            return await super().recv()

    return SlowWS(incoming)


async def test_fetch_topology_enrichment_respects_budget(monkeypatch):
    monkeypatch.setattr(ha_registry, "_ENRICH_BUDGET", 0.05)
    # Each related call sleeps 0.04s; with a 0.05s budget only the first one or
    # two run before the loop stops enriching and the rest get empty refs.
    ws = _slow_related_ws(num_automations=5, per_call_delay=0.04)
    started = time.monotonic()
    topo = await fetch_topology(_settings(), fake_connect(ws))
    elapsed = time.monotonic() - started

    # Returned without awaiting all 5 slow calls (5 * 0.04 = 0.20s).
    assert elapsed < 0.15
    # Every automation still has a references key (renders), even if empty.
    assert all("references" in a for a in topo["automations"])
    # At least one automation was skipped -> empty refs present.
    empties = [
        a for a in topo["automations"]
        if a["references"] == {"entities": [], "scenes": [], "devices": []}
    ]
    assert empties, "expected some automations to fall back to empty refs under budget"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py::test_fetch_topology_enrichment_respects_budget -v`
Expected: FAIL — `_ENRICH_BUDGET` does not exist (`AttributeError`). The current loop enriches all 5 automations, so `elapsed` would be ~0.20s and `empties` would be empty.

- [ ] **Step 3: Write minimal implementation**

In `ha_registry.py`, add the budget constant next to `_COMMAND_TIMEOUT`:

```python
# Total wall-clock budget for the per-automation search/related enrichment in
# fetch_topology (M2). Once exceeded, remaining automations get empty refs so a
# slow/wedged Core can't stall /ha/topology indefinitely.
_ENRICH_BUDGET = 8.0
```

Then bound the enrichment loop in `fetch_topology` (`ha_registry.py:267-275`). Add `import time` at the top if not present (it is not). Replace the loop:

```python
        mid = 5
        enrich_deadline = time.monotonic() + _ENRICH_BUDGET
        for automation in topology["automations"]:
            if time.monotonic() >= enrich_deadline:
                # Out of budget: leave the rest unenriched so the diagram still
                # renders (M2). They keep empty references.
                automation["references"] = _empty_refs()
                continue
            try:
                automation["references"] = await _search_related(
                    ws, mid, automation["entity_id"]
                )
            except Exception:  # noqa: BLE001 - degrade gracefully per automation
                automation["references"] = _empty_refs()
            mid += 1
```

Add `import time` to the imports block at the top of `ha_registry.py` (after `import json`):

```python
import asyncio
import json
import time
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS — budget test returns in <0.15s with some empty-ref automations; existing `test_fetch_topology_*` tests still pass (they have ≤1 automation, replied promptly, well under the 8s budget, so all get real refs).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/ha_registry.py \
        addons/terminus/backend/tests/test_ha_registry.py
git commit -m "fix(terminus): bound topology enrichment wall-clock budget (M2)"
```

---

## Task 7: Full suite green + release (version bump + CHANGELOG)

**Files:**
- Modify: `addons/terminus/config.yaml` (`version: "0.11.0"` → `"0.12.0"`)
- Modify: `addons/terminus/CHANGELOG.md` (add `## 0.12.0` heading at top, under the intro)

**Interfaces:** none (release bookkeeping).

- [ ] **Step 1: Run the full backend suite**

Run: `cd addons/terminus/backend && python -m pytest -v`
Expected: PASS — every test in `tests/` green (proxy allowlist/headers/timeout, web topology single-flight, ha_registry command-timeout + enrichment-budget, plus all pre-existing tests). If anything is red, fix it before bumping (do not bump on red).

- [ ] **Step 2: Bump the canonical version**

Edit `addons/terminus/config.yaml`:

```yaml
version: "0.12.0"
```

- [ ] **Step 3: Add the CHANGELOG entry**

In `addons/terminus/CHANGELOG.md`, insert immediately above the `## 0.11.0` heading (added by Spec C; if running standalone, above `## 0.10.0`):

```markdown
## 0.12.0

### Security & hardening — proxy & endpoints (Spec B)

- **H1 — LangGraph proxy allowlist.** `/api/*` now forwards only the explicit
  `(method, path)` pairs the frontend actually calls (thread create/get/update/
  search/state/history; run stream/get/cancel/join/joinStream; `GET /info`).
  Everything else — thread delete/prune/count, store, crons, assistants — is
  rejected with `403` **before** any upstream call.
- **H2 — request hygiene + bounded timeouts.** Forwarded requests now strip
  `authorization`, `content-length`, `host`, `connection`, and other hop-by-hop
  headers. The proxy `httpx.AsyncClient` replaces `timeout=None` with a bounded
  `httpx.Timeout` (finite connect/read), so a wedged upstream can't pin a
  connection forever.
- **M1 — topology cache single-flight.** Concurrent `/ha/topology` misses now
  run `fetch_topology` exactly once behind an `asyncio.Lock` instead of each
  opening its own websocket and running the full 4-call + enrichment fetch.
- **M2 — websocket command timeouts.** Each Home Assistant websocket command is
  wrapped in `asyncio.wait_for` (raises `HARegistryError` on timeout instead of
  hanging), and the per-automation enrichment loop is bounded by a wall-clock
  budget so a slow Core can't stall the topology request indefinitely.
```

- [ ] **Step 4: Verify the bump + changelog agree**

Run:
```bash
cd addons/terminus && \
  grep -E '^version:' config.yaml && \
  grep -E '^## 0\.12\.0' CHANGELOG.md
```
Expected: both lines print (`version: "0.12.0"` and `## 0.12.0`).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/config.yaml \
        addons/terminus/CHANGELOG.md
git commit -m "chore(terminus): release 0.12.0 — proxy & endpoint hardening"
```

---

## Self-review notes (completed during planning)

- **Spec coverage:** H1 → Task 1; H2 (headers) → Task 2; H2 (timeouts) → Task 3; M1 → Task 4; M2 (`_command` timeout) → Task 5; M2 (enrichment bound) → Task 6; release bookkeeping → Task 7. Error-handling expectations (403 with short body and no upstream contact; topology miss still maps to 502 on failure; `HARegistryError` on ws timeout) are asserted in Tasks 1, 4, 5. "Out of scope" items (replacing `langgraph dev`, ingress auth, terminus-rag) are untouched.
- **Allowlist provenance:** derived from real usage in `frontend/src/providers/thread.tsx` + `stream.tsx` and the bundled SDK `@langchain/langgraph-sdk@1.9.23` (`dist/client/{threads,runs,assistants}/index.js`, `dist/react/stream.lgp.js`). `/info` is included because `stream.tsx:55` polls it; `/api/title` is excluded from the proxy because it is intercepted locally at `web.py:168` and never reaches the proxy.
- **Type/name consistency:** `_PROXY_ALLOWLIST`, `_is_allowed`, `_REQUEST_STRIP_HEADERS`, `_PROXY_TIMEOUT`, `app.state.topology_lock`, `_COMMAND_TIMEOUT`, `_ENRICH_BUDGET` are each introduced once and referenced consistently. `_command`'s signature is unchanged. `fetch_topology(settings, connect)` signature is unchanged.
- **No placeholders:** every code step shows complete, runnable code (allowlist as real compiled-regex tuples, the `asyncio.Lock` double-checked single-flight, the `asyncio.wait_for` wrap, the wall-clock-budget enrichment loop) and every run step shows the exact command + expected pass/fail.
