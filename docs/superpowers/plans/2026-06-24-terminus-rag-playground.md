# Terminus RAG Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an embedded, HA-ingress-served "tool console" UI to the terminus-rag add-on so all 8 MCP tools can be exercised interactively from the browser.

**Architecture:** A React/Vite SPA (mirroring the Terminus add-on, consuming the `@terminus` UI registry) is served as static files by the existing Starlette app on `:9000`, alongside two new JSON endpoints (`/playground/tools`, `/playground/call`). Forms are generated from each tool's MCP `inputSchema`; execution calls the in-process `build_tools(state)` callables. Access is via HA ingress, guarded by the `X-Ingress-Path` header.

**Tech Stack:** Python 3.12 / Starlette / FastMCP (backend); React 19 + Vite + TypeScript + Tailwind v4 + pnpm + `@terminus` registry (frontend); multi-stage Docker (node:22-alpine builder → python:3.12-slim runtime).

## Global Constraints

- **Add-on version is canonical in `config.yaml` only.** Do NOT bump `backend/pyproject.toml` or `frontend/package.json` (both pinned `0.0.0`) — it busts Docker dep-cache layers.
- **Every `config.yaml` version bump requires a matching `CHANGELOG.md` entry.** Target version this plan ships: **`0.2.0`**.
- **Dockerfile: classic-builder safe** — no `# syntax=` header, no `RUN --mount=type=cache`. Runtime base stays `python:3.12-slim` (glibc).
- **Frontend toolchain mirrors Terminus:** node:22-alpine builder, `pnpm@10.33.0`, `pnpm install --frozen-lockfile`, `vite.config.ts` `base: './'`.
- **Dev ports (6374x convention):** Vite `63743`, Storybook `63744`. Backend stays `:9000`.
- **Registry-first frontend:** components use vendored `@terminus` primitives (`Button`, `Input`, `Card`) from `@/components/ui/*` (Task 4b). Frontend Tasks 4b–8 require the `@terminus` registry dev server running on `:63748` (in the `terminus-ui` repo: `pnpm dev`). Enum form fields keep a native `<select>` (the base-nova Select renders a popup, not a native control; native keeps the form simple/accessible and the tests query by tag).
- **Auth matrix:** `/health` open; `/mcp*` bearer-gated when `api_token` set; everything else (SPA + `/playground/*`) exempt from bearer but reachable only with HA's `X-Ingress-Path` header when `api_token` is set (else `404`). No token configured → all open (local dev).
- **Tests run with:** `cd backend && uv run pytest` (deps via `uv sync --extra dev`); pytest is configured `asyncio_mode=auto`.
- **Tool callables source of truth:** `build_tools(state)` in `app/mcp_app.py` returns the 8 callables keyed by name: `search_ha, list_records, list_kinds, get_record, get_automation_trace, get_logbook, get_history, refresh`. The async ones are `get_automation_trace, get_logbook, get_history, refresh`.

---

## File Structure

**Backend**
- `backend/app/mcp_app.py` (modify) — restructure `BearerAuthMiddleware`; wire playground routes + conditional static mount into `build_app`.
- `backend/app/playground.py` (create) — `build_playground_routes(state, mcp)` returning the `/playground/tools` + `/playground/call` Starlette routes.
- `backend/tests/test_mcp_app.py` (modify) — update middleware tests to the new 3-way matrix.
- `backend/tests/test_playground.py` (create) — unit + integration tests for the new routes.

**Frontend** (`backend`-sibling new dir `frontend/`)
- `frontend/package.json`, `frontend/pnpm-lock.yaml`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/index.html`, `frontend/components.json`
- `frontend/src/main.tsx`, `frontend/src/index.css`, `frontend/src/test-setup.ts`
- `frontend/src/lib/api.ts` (+ `api.test.ts`)
- `frontend/src/components/SchemaForm.tsx` (+ `.test.tsx`, `.stories.tsx`)
- `frontend/src/components/ResultView.tsx` (+ `.test.tsx`, `.stories.tsx`)
- `frontend/src/components/ToolList.tsx`
- `frontend/src/App.tsx` (+ `App.test.tsx`)
- `frontend/src/lib/utils.ts` — `cn()` class-merge helper (shadcn components import it; created by `shadcn add`).
- `frontend/src/components/ui/**` — `@terminus` registry components (`button`, `input`, `card`)
  vendored via `shadcn add @terminus/<name>` in **Task 4b** (requires the registry dev server on
  `:63748`). Tasks 6–8 import `Button`/`Input`/`Card` from `@/components/ui/*`; enum fields keep a
  native `<select>`. `components.json` is wired in Task 4.

**Build / config / ops**
- `Dockerfile` (modify) — add frontend builder stage + `COPY --from`.
- `config.yaml` (modify) — `ingress`, `ingress_port`, version `0.2.0`.
- `CHANGELOG.md`, `README.md`, `CLAUDE.md` (modify).
- `dev.sh` (create), `.env.example` (create).

---

## Task 1: Restructure `BearerAuthMiddleware` to the 3-way auth matrix

**Files:**
- Modify: `backend/app/mcp_app.py` (class `BearerAuthMiddleware`, ~lines 120-144)
- Test: `backend/tests/test_mcp_app.py` (replace the middleware unit tests)

**Interfaces:**
- Consumes: `Settings.api_token` (str).
- Produces: `BearerAuthMiddleware(app, settings)` with behavior: `/health[/]` → pass; path startswith `/mcp` → bearer-gated when token set (unchanged); any other path → pass when no token, else pass only if header `x-ingress-path` present, else `404`.

- [ ] **Step 1: Replace the middleware unit tests with the new matrix**

In `backend/tests/test_mcp_app.py`, replace `test_bearer_middleware_open_when_no_token`, `test_bearer_middleware_401_without_token`, `test_bearer_middleware_health_open_with_token_set`, and `test_bearer_middleware_health_exact_match_only` with:

```python
async def test_bearer_middleware_open_when_no_token():
    inner_called = {"v": False}

    async def inner(scope, receive, send):
        inner_called["v"] = True
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="").settings)
    # No token: everything is open, including /mcp and playground paths.
    assert await _asgi_status(mw, {}, path="/mcp") == 200
    assert await _asgi_status(mw, {}, path="/playground/tools") == 200
    assert await _asgi_status(mw, {}, path="/") == 200
    assert inner_called["v"] is True


async def test_bearer_middleware_mcp_gated_when_token_set():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}, path="/mcp") == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer wrong"}, path="/mcp") == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer secret"}, path="/mcp") == 200


async def test_bearer_middleware_health_always_open():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}, path="/health") == 200
    assert await _asgi_status(mw, {}, path="/health/") == 200


async def test_bearer_middleware_playground_ingress_guarded_when_token_set():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    # Non-/mcp, non-/health paths require the HA ingress header; no bearer needed.
    assert await _asgi_status(mw, {}, path="/playground/tools") == 404
    assert await _asgi_status(mw, {}, path="/") == 404
    assert await _asgi_status(
        mw, {"X-Ingress-Path": "/api/hassio_ingress/abc"}, path="/playground/tools"
    ) == 200
    assert await _asgi_status(
        mw, {"X-Ingress-Path": "/api/hassio_ingress/abc"}, path="/"
    ) == 200
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd backend && uv run pytest tests/test_mcp_app.py -k bearer_middleware -v`
Expected: FAIL — the new `playground_ingress_guarded` test fails (old middleware returns 401, not 404, for non-/mcp paths) and `mcp_gated`/`open_when_no_token` assertions on new paths fail.

- [ ] **Step 3: Rewrite `BearerAuthMiddleware.__call__`**

Replace the body of `__call__` in `backend/app/mcp_app.py` with:

```python
    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)

        path = scope.get("path", "")
        normalized = path.rstrip("/") or "/"

        # /health is always open (liveness probe).
        if normalized == "/health":
            return await self.app(scope, receive, send)

        token = self.settings.api_token

        # MCP endpoint: bearer-gated when a token is configured.
        if path.startswith("/mcp"):
            if not token:
                return await self.app(scope, receive, send)
            headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
            auth = headers.get("authorization", "")
            presented = auth[7:] if auth.startswith("Bearer ") else ""
            if presented and secrets.compare_digest(presented, token):
                return await self.app(scope, receive, send)
            resp = JSONResponse({"error": "unauthorized"}, status_code=401)
            return await resp(scope, receive, send)

        # Everything else (SPA + /playground/*): exempt from the bearer token,
        # but when a token is configured serve only ingress-proxied requests
        # (HA sets X-Ingress-Path). 404 hides the surface from non-ingress callers.
        if not token:
            return await self.app(scope, receive, send)
        headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
        if "x-ingress-path" in headers:
            return await self.app(scope, receive, send)
        resp = JSONResponse({"error": "not found"}, status_code=404)
        await resp(scope, receive, send)
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd backend && uv run pytest tests/test_mcp_app.py -k bearer_middleware -v`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the full mcp_app test file to catch regressions**

Run: `cd backend && uv run pytest tests/test_mcp_app.py -v`
Expected: PASS. (`test_assembled_app_auth_gate` still passes: it only checks `/health` open + `/mcp` 401.)

- [ ] **Step 6: Commit**

```bash
git add backend/app/mcp_app.py backend/tests/test_mcp_app.py
git commit -m "refactor(terminus-rag): 3-way auth matrix (health/mcp/ingress-guarded)"
```

---

## Task 2: Playground routes — `/playground/call` and `/playground/tools`

**Files:**
- Create: `backend/app/playground.py`
- Test: `backend/tests/test_playground.py`

**Interfaces:**
- Consumes: `build_tools(state) -> dict[str, Callable]` (from `app.mcp_app`); `AppState`; a FastMCP instance exposing `async list_tools() -> list[Tool]` where each `Tool` has `.name`, `.description`, `.inputSchema` (dict).
- Produces: `build_playground_routes(state, mcp) -> list[starlette.routing.Route]` with `GET /playground/tools` and `POST /playground/call`.

- [ ] **Step 1: Write the failing tests**

Create `backend/tests/test_playground.py`:

```python
import json

import httpx
import pytest
from starlette.applications import Starlette

from app.config import Settings
from app.embedder import FakeEmbedder
from app.index import VectorIndex
from app.mcp_app import AppState, build_app
from app.main import build_state
from app.playground import build_playground_routes
from app.records import IndexRecord
from app.refresher import Refresher


def _settings(api_token=""):
    return Settings(
        ws_url="ws://x", ha_token="t", use_supervisor=False, api_token=api_token,
        refresh_interval=600, embed_model="bge", top_k_default=10, log_level="info",
    )


def _state(api_token=""):
    emb = FakeEmbedder(dim=8)
    idx = VectorIndex(emb)
    idx.upsert([
        IndexRecord(id="entity:light.bed", kind="entity", text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
        IndexRecord(id="scene:scene.movie", kind="scene", text="Movie Night | scene",
                    metadata={"name": "Movie Night", "area": "Living"}),
    ])
    settings = _settings(api_token)
    refresher = Refresher(idx, settings, connect=lambda u: None, fetch=None)
    return AppState(settings=settings, index=idx, refresher=refresher)


class _FakeTool:
    def __init__(self, name, description, schema):
        self.name = name
        self.description = description
        self.inputSchema = schema


class _FakeMcp:
    async def list_tools(self):
        return [
            _FakeTool("list_kinds", "Kinds and counts", {"type": "object", "properties": {}}),
            _FakeTool("search_ha", "Semantic search", {
                "type": "object",
                "properties": {"query": {"type": "string"}, "top_k": {"type": "integer"}},
                "required": ["query"],
            }),
        ]


def _app(state):
    return Starlette(routes=build_playground_routes(state, _FakeMcp()))


async def _client(app):
    return httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                             base_url="http://localhost")


async def test_tools_endpoint_returns_name_description_schema():
    async with await _client(_app(_state())) as c:
        r = await c.get("/playground/tools")
    assert r.status_code == 200
    tools = {t["name"]: t for t in r.json()["tools"]}
    assert tools["search_ha"]["description"] == "Semantic search"
    assert tools["search_ha"]["inputSchema"]["properties"]["query"]["type"] == "string"


async def test_call_dispatches_sync_tool():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    kinds = {k["kind"]: k["count"] for k in r.json()["result"]}
    assert kinds == {"entity": 1, "scene": 1}


async def test_call_dispatches_async_tool():
    state = _state()

    async def _fake_refresh():
        return {"added": 0, "changed": 0, "removed": 0, "total": 2, "took_ms": 1}

    state.refresher.refresh_once = _fake_refresh
    async with await _client(_app(state)) as c:
        r = await c.post("/playground/call", json={"tool": "refresh", "args": {}})
    assert r.status_code == 200
    assert r.json()["result"]["total"] == 2


async def test_call_passes_args():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call",
                         json={"tool": "search_ha", "args": {"query": "Bedroom Lamp | light"}})
    assert r.status_code == 200
    assert r.json()["result"][0]["id"] == "entity:light.bed"


async def test_call_unknown_tool_is_400():
    async with await _client(_app(_state())) as c:
        r = await c.post("/playground/call", json={"tool": "nope", "args": {}})
    assert r.status_code == 400
    assert "error" in r.json()


async def test_call_tool_error_is_200_with_error_field():
    state = _state()

    def _boom():
        raise RuntimeError("kaboom")

    # Replace list_kinds callable via the index to force an error path.
    state.index.list_kinds = _boom
    async with await _client(_app(state)) as c:
        r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    assert "kaboom" in r.json()["error"]
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd backend && uv run pytest tests/test_playground.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.playground'`.

- [ ] **Step 3: Implement `playground.py`**

Create `backend/app/playground.py`:

```python
"""Browser-facing playground routes: list the MCP tool schemas and execute a
tool in-process via the same ``build_tools(state)`` callables the MCP server
wraps. Mounted on the existing Starlette app; access control is handled by
``BearerAuthMiddleware`` (ingress-guarded)."""

from __future__ import annotations

import inspect
import logging

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

from .mcp_app import AppState, build_tools

logger = logging.getLogger(__name__)


def build_playground_routes(state: AppState, mcp) -> list[Route]:
    tools = build_tools(state)

    async def list_tools_route(request: Request) -> JSONResponse:
        defs = await mcp.list_tools()
        return JSONResponse({
            "tools": [
                {"name": t.name, "description": t.description, "inputSchema": t.inputSchema}
                for t in defs
            ]
        })

    async def call_tool_route(request: Request) -> JSONResponse:
        try:
            body = await request.json()
        except Exception:
            return JSONResponse({"error": "invalid JSON body"}, status_code=400)

        name = body.get("tool")
        args = body.get("args") or {}
        if not isinstance(args, dict):
            return JSONResponse({"error": "'args' must be an object"}, status_code=400)
        fn = tools.get(name)
        if fn is None:
            return JSONResponse({"error": f"unknown tool: {name!r}"}, status_code=400)

        try:
            result = fn(**args)
            if inspect.isawaitable(result):
                result = await result
        except Exception as exc:  # tool-level failure → render in the UI, not a 500
            logger.info("playground tool %s failed: %s", name, exc)
            return JSONResponse({"error": str(exc)})
        return JSONResponse({"result": result})

    return [
        Route("/playground/tools", list_tools_route, methods=["GET"]),
        Route("/playground/call", call_tool_route, methods=["POST"]),
    ]
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd backend && uv run pytest tests/test_playground.py -v`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/app/playground.py backend/tests/test_playground.py
git commit -m "feat(terminus-rag): playground tools+call routes (schema list, in-process exec)"
```

---

## Task 3: Wire playground routes + conditional static mount into `build_app`

**Files:**
- Modify: `backend/app/mcp_app.py` (`build_app`, ~lines 209-225)
- Test: `backend/tests/test_playground.py` (append integration tests)

**Interfaces:**
- Consumes: `build_playground_routes(state, mcp)` (Task 2); FastMCP `mcp` built inside `build_app`.
- Produces: assembled app where `GET /playground/tools` and `POST /playground/call` work end-to-end; static SPA mounted at `/` **only when** `frontend/dist` exists.

- [ ] **Step 1: Append the integration tests**

Add to `backend/tests/test_playground.py`:

```python
async def _assembled(tmp_path, api_token=""):
    state = build_state(_settings(api_token=api_token), embedder=FakeEmbedder(dim=8),
                        connect=lambda u: None, persist_dir=tmp_path)
    async def _noop_fetch(settings, connect):
        return [], []
    state.refresher._fetch = _noop_fetch
    state.index.upsert([
        IndexRecord(id="entity:light.bed", kind="entity", text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
    ])
    return build_app(state)


async def test_assembled_playground_tools_lists_all_eight(tmp_path):
    app = await _assembled(tmp_path)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            r = await c.get("/playground/tools")
    assert r.status_code == 200
    names = {t["name"] for t in r.json()["tools"]}
    assert names == {"search_ha", "list_records", "list_kinds", "get_record",
                     "get_automation_trace", "get_logbook", "get_history", "refresh"}


async def test_assembled_playground_call_runs_index_tool(tmp_path):
    app = await _assembled(tmp_path)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            r = await c.post("/playground/call", json={"tool": "list_kinds", "args": {}})
    assert r.status_code == 200
    assert r.json()["result"][0]["kind"] == "entity"


async def test_assembled_playground_ingress_guarded_with_token(tmp_path):
    app = await _assembled(tmp_path, api_token="s3cr3t")
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url="http://localhost") as c:
            blocked = await c.get("/playground/tools")
            allowed = await c.get("/playground/tools",
                                  headers={"X-Ingress-Path": "/api/hassio_ingress/abc"})
    assert blocked.status_code == 404
    assert allowed.status_code == 200
```

- [ ] **Step 2: Run to verify failure**

Run: `cd backend && uv run pytest tests/test_playground.py -k assembled -v`
Expected: FAIL — `/playground/tools` returns 404 (routes not yet wired into `build_app`).

- [ ] **Step 3: Wire routes + conditional static into `build_app`**

In `backend/app/mcp_app.py`, add imports near the top:

```python
import os

from starlette.routing import Mount
from starlette.staticfiles import StaticFiles
```

Then in `build_app`, replace the final assembly block (currently
`app = Starlette(routes=inner.routes, lifespan=lifespan)` … `return app`) with:

```python
    from .playground import build_playground_routes

    routes = list(inner.routes) + build_playground_routes(state, mcp)

    # Serve the built SPA only when present (absent in backend-only tests and in
    # `dev.sh`, where Vite serves the frontend). StaticFiles errors at startup if
    # the directory is missing, so guard the mount.
    dist_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
    if os.path.isdir(dist_dir):
        routes.append(Mount("/", app=StaticFiles(directory=dist_dir, html=True)))

    app = Starlette(routes=routes, lifespan=lifespan)
    app.add_middleware(BearerAuthMiddleware, settings=state.settings)
    return app
```

(`dist_dir` resolves to `/app/frontend/dist` in the image, matching the Dockerfile `COPY` target in Task 9.)

- [ ] **Step 4: Run to verify pass**

Run: `cd backend && uv run pytest tests/test_playground.py -v`
Expected: PASS (9 tests).

- [ ] **Step 5: Run the whole backend suite**

Run: `cd backend && uv run pytest -q`
Expected: PASS (existing suite + new playground tests).

- [ ] **Step 6: Commit**

```bash
git add backend/app/mcp_app.py backend/tests/test_playground.py
git commit -m "feat(terminus-rag): mount playground routes + conditional SPA static"
```

---

## Task 4: Scaffold the frontend (Vite + React + TS + Tailwind + pnpm)

**Files:**
- Create: `frontend/package.json`, `frontend/pnpm-lock.yaml`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/index.html`, `frontend/components.json`, `frontend/src/main.tsx`, `frontend/src/index.css`, `frontend/src/test-setup.ts`, `frontend/src/App.tsx`, `frontend/src/App.test.tsx`, `frontend/.gitignore`

**Interfaces:**
- Produces: a buildable SPA (`pnpm build` → `frontend/dist`), `pnpm dev` on port `63743` proxying to `:9000`, vitest configured with happy-dom. `App` renders a heading.

- [ ] **Step 1: Create `frontend/package.json`**

```json
{
  "name": "terminus-rag-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "storybook": "storybook dev -p 63744",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@base-ui/react": "^1.2.0",
    "@tailwindcss/vite": "^4.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@storybook/addon-docs": "^10.4.6",
    "@storybook/react-vite": "^10.4.6",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^24",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6",
    "happy-dom": "^20.9.0",
    "shadcn": "^4.11.0",
    "storybook": "^10.4.6",
    "typescript": "~5.9",
    "vite": "^8",
    "vitest": "^4.1.7"
  }
}
```

> Before installing, confirm the manifest parses: `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"`.

- [ ] **Step 2: Create the config files**

`frontend/vite.config.ts`:

```typescript
/// <reference types="vitest/config" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Served as a static SPA by the add-on's Starlette process behind HA ingress.
// base: './' keeps asset URLs relative so they resolve under the dynamic
// /api/hassio_ingress/<token>/ prefix.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 63743,
    proxy: {
      '/playground': { target: 'http://localhost:9000', changeOrigin: true },
      '/mcp': { target: 'http://localhost:9000', changeOrigin: true },
      '/health': { target: 'http://localhost:9000', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

`frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

`frontend/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

`frontend/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terminus RAG Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`frontend/components.json` (mirror the Terminus add-on, pointing at the `@terminus` registry):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "mist",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "registries": {
    "@terminus": "http://localhost:63748/r/{name}.json"
  }
}
```

`frontend/.gitignore`:

```
node_modules/
dist/
storybook-static/
```

- [ ] **Step 3: Create source entry + styles + test setup + minimal App**

`frontend/src/index.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
```

`frontend/src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`frontend/src/test-setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`frontend/src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-xl font-semibold">Terminus RAG Playground</h1>
    </main>
  );
}
```

`frontend/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import App from './App';

test('renders the playground heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /terminus rag playground/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: Install deps and generate the lockfile**

Run: `cd frontend && CI=true npx pnpm@10.33.0 install`
Expected: completes; creates `pnpm-lock.yaml`.

- [ ] **Step 5: Verify build, typecheck, and the smoke test pass**

Run: `cd frontend && npx pnpm@10.33.0 build && npx pnpm@10.33.0 test:run`
Expected: `dist/` produced; 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/pnpm-lock.yaml frontend/vite.config.ts \
  frontend/tsconfig.json frontend/tsconfig.node.json frontend/index.html \
  frontend/components.json frontend/.gitignore frontend/src
git commit -m "feat(terminus-rag): scaffold playground frontend (vite/react/ts/tailwind)"
```

---

## Task 4b: Vendor `@terminus` registry primitives

**Files:**
- Create (via `shadcn add`): `frontend/src/components/ui/button.tsx`, `frontend/src/components/ui/input.tsx`, `frontend/src/components/ui/card.tsx`, `frontend/src/lib/utils.ts`
- Modify (by `shadcn`): `frontend/package.json`, `frontend/pnpm-lock.yaml`

**Interfaces:**
- Produces: `Button` (`@/components/ui/button`), `Input` (`@/components/ui/input`), `Card`/`CardHeader`/`CardContent`/`CardTitle` (`@/components/ui/card`), `cn` (`@/lib/utils`) — used by Tasks 6–8.

**Prerequisite:** the `@terminus` registry dev server must be running on `:63748` (in the `terminus-ui` repo: `pnpm dev`).

- [ ] **Step 1: Verify the registry is reachable**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:63748/r/button.json`
Expected: `200`. If not, start the `terminus-ui` dev server before continuing.

- [ ] **Step 2: Vendor the primitives**

Run: `cd frontend && npx pnpm@10.33.0 dlx shadcn@latest add @terminus/button @terminus/input @terminus/card --yes`
Expected: files written under `src/components/ui/`; `src/lib/utils.ts` created; any peer deps (`clsx`, `tailwind-merge`, `class-variance-authority`, `@base-ui/react`) added to `package.json` + lockfile.

- [ ] **Step 3: Inspect the vendored APIs (Tasks 6–8 must match these)**

Run: `sed -n '1,40p' src/components/ui/button.tsx src/components/ui/input.tsx src/components/ui/card.tsx`
Note the exported component names and props. If an export name differs from `Button`/`Input`/`Card`/`CardContent`/`CardHeader`/`CardTitle`, use the actual names in Tasks 6–8 (the tests query by role/label/text, so they remain the contract).

- [ ] **Step 4: Verify build + existing smoke test still pass**

Run: `cd frontend && npx pnpm@10.33.0 build && npx pnpm@10.33.0 test:run`
Expected: build OK; the App smoke test passes.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui frontend/src/lib/utils.ts frontend/package.json frontend/pnpm-lock.yaml
git commit -m "feat(terminus-rag): vendor @terminus ui primitives (button, input, card)"
```

---

## Task 5: API client (`lib/api.ts`)

**Files:**
- Create: `frontend/src/lib/api.ts`, `frontend/src/lib/api.test.ts`

**Interfaces:**
- Produces:
  - `type ToolDef = { name: string; description: string; inputSchema: JsonSchema }`
  - `type JsonSchema = { type?: string; properties?: Record<string, JsonSchema>; required?: string[]; enum?: string[] }`
  - `getTools(): Promise<ToolDef[]>` → `GET ./playground/tools`
  - `callTool(name: string, args: Record<string, unknown>): Promise<{ result?: unknown; error?: string }>` → `POST ./playground/call`
- Relative URLs only (so they resolve under the ingress prefix).

- [ ] **Step 1: Write the failing tests**

`frontend/src/lib/api.test.ts`:

```ts
import { afterEach, expect, test, vi } from 'vitest';

import { callTool, getTools } from './api';

afterEach(() => vi.restoreAllMocks());

test('getTools fetches the relative tools URL and returns the tools array', async () => {
  const tools = [{ name: 'list_kinds', description: 'k', inputSchema: { type: 'object' } }];
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ tools }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const result = await getTools();
  expect(fetchMock).toHaveBeenCalledWith('./playground/tools');
  expect(result).toEqual(tools);
});

test('callTool posts tool+args to the relative call URL', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ result: [1, 2] }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const result = await callTool('search_ha', { query: 'lamp' });
  expect(fetchMock).toHaveBeenCalledWith('./playground/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'search_ha', args: { query: 'lamp' } }),
  });
  expect(result).toEqual({ result: [1, 2] });
});

test('getTools throws on non-ok response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  await expect(getTools()).rejects.toThrow(/500/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/lib/api.test.ts`
Expected: FAIL — `./api` has no exports.

- [ ] **Step 3: Implement `lib/api.ts`**

```ts
export type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  enum?: string[];
  description?: string;
};

export type ToolDef = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
};

export type CallResult = { result?: unknown; error?: string };

export async function getTools(): Promise<ToolDef[]> {
  const res = await fetch('./playground/tools');
  if (!res.ok) throw new Error(`getTools failed: ${res.status}`);
  const body = (await res.json()) as { tools: ToolDef[] };
  return body.tools;
}

export async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<CallResult> {
  const res = await fetch('./playground/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: name, args }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as CallResult;
    return { error: body.error ?? `call failed: ${res.status}` };
  }
  return (await res.json()) as CallResult;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/lib/api.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/api.ts frontend/src/lib/api.test.ts
git commit -m "feat(terminus-rag): playground API client (getTools, callTool)"
```

---

## Task 6: `SchemaForm` component

**Files:**
- Create: `frontend/src/components/SchemaForm.tsx`, `frontend/src/components/SchemaForm.test.tsx`, `frontend/src/components/SchemaForm.stories.tsx`

**Interfaces:**
- Consumes: `JsonSchema` (from `@/lib/api`).
- Produces: `SchemaForm({ schema, onSubmit }: { schema: JsonSchema; onSubmit: (args: Record<string, unknown>) => void })` — renders one input per `schema.properties` entry (`string`→text, `integer`→number, `enum`→select), marks `required` fields, omits blank optionals from the submitted args, coerces `integer` values to numbers.

- [ ] **Step 1: Write the failing tests**

`frontend/src/components/SchemaForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { SchemaForm } from './SchemaForm';

const schema = {
  type: 'object',
  properties: {
    query: { type: 'string' },
    top_k: { type: 'integer' },
    kind: { type: 'string', enum: ['entity', 'scene'] },
  },
  required: ['query'],
};

test('renders an input per property and a select for enums', () => {
  render(<SchemaForm schema={schema} onSubmit={() => {}} />);
  expect(screen.getByLabelText(/query/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/top_k/i)).toHaveAttribute('type', 'number');
  expect(screen.getByLabelText(/kind/i).tagName).toBe('SELECT');
});

test('omits blank optionals and coerces integers on submit', async () => {
  const onSubmit = vi.fn();
  render(<SchemaForm schema={schema} onSubmit={onSubmit} />);
  await userEvent.type(screen.getByLabelText(/query/i), 'lamp');
  await userEvent.type(screen.getByLabelText(/top_k/i), '5');
  await userEvent.click(screen.getByRole('button', { name: /run/i }));
  expect(onSubmit).toHaveBeenCalledWith({ query: 'lamp', top_k: 5 });
});

test('renders a run button even for a no-arg tool', () => {
  render(<SchemaForm schema={{ type: 'object', properties: {} }} onSubmit={() => {}} />);
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
});
```

Add `@testing-library/user-event` to `frontend/package.json` devDependencies (`"@testing-library/user-event": "^14.5.2"`) and re-run install before this test.

- [ ] **Step 2: Run to verify failure**

Run: `cd frontend && npx pnpm@10.33.0 install && npx pnpm@10.33.0 test:run src/components/SchemaForm.test.tsx`
Expected: FAIL — `./SchemaForm` has no exports.

- [ ] **Step 3: Implement `SchemaForm.tsx`**

> Registry-first: use the vendored `Input` (`@/components/ui/input`) and `Button` (`@/components/ui/button`) in place of the raw `<input>`/`<button>` below — keep the same `aria-label` and `type` props so the tests hold. Keep the native `<select>` for enum fields (the test asserts `tagName === 'SELECT'`). Match the actual props you saw in Task 4b Step 3.

```tsx
import { useState, type FormEvent } from 'react';

import type { JsonSchema } from '@/lib/api';

type Props = {
  schema: JsonSchema;
  onSubmit: (args: Record<string, unknown>) => void;
};

export function SchemaForm({ schema, onSubmit }: Props) {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const [values, setValues] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const args: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(properties)) {
      const raw = values[key];
      if (raw === undefined || raw === '') continue; // omit blank optionals
      args[key] = prop.type === 'integer' ? Number(raw) : raw;
    }
    onSubmit(args);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {Object.entries(properties).map(([key, prop]) => (
        <label key={key} className="flex flex-col gap-1 text-sm">
          <span>
            {key}
            {required.has(key) ? ' *' : ''}
          </span>
          {prop.enum ? (
            <select
              aria-label={key}
              className="rounded border px-2 py-1"
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            >
              <option value="">—</option>
              {prop.enum.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              aria-label={key}
              type={prop.type === 'integer' ? 'number' : 'text'}
              className="rounded border px-2 py-1"
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          )}
        </label>
      ))}
      <button type="submit" className="self-start rounded bg-blue-600 px-3 py-1 text-white">
        Run
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/components/SchemaForm.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Add a Storybook story**

`frontend/src/components/SchemaForm.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SchemaForm } from './SchemaForm';

const meta: Meta<typeof SchemaForm> = {
  title: 'Playground/SchemaForm',
  component: SchemaForm,
  args: { onSubmit: (args) => console.log('submit', args) },
};
export default meta;

export const SearchTool: StoryObj<typeof SchemaForm> = {
  args: {
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        top_k: { type: 'integer' },
        kind: { type: 'string', enum: ['entity', 'scene', 'automation'] },
      },
      required: ['query'],
    },
  },
};

export const NoArgs: StoryObj<typeof SchemaForm> = {
  args: { schema: { type: 'object', properties: {} } },
};
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/SchemaForm.tsx frontend/src/components/SchemaForm.test.tsx \
  frontend/src/components/SchemaForm.stories.tsx frontend/package.json frontend/pnpm-lock.yaml
git commit -m "feat(terminus-rag): schema-driven SchemaForm component"
```

---

## Task 7: `ResultView` component

**Files:**
- Create: `frontend/src/components/ResultView.tsx`, `frontend/src/components/ResultView.test.tsx`, `frontend/src/components/ResultView.stories.tsx`

**Interfaces:**
- Consumes: `CallResult` (from `@/lib/api`).
- Produces: `ResultView({ state }: { state: ResultState })` where `type ResultState = { status: 'idle' | 'loading' } | { status: 'done'; value: CallResult }`. Renders pretty-printed JSON for results, a distinct error block for `{error}`, a spinner label for loading, and a hint for idle.

- [ ] **Step 1: Write the failing tests**

`frontend/src/components/ResultView.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { ResultView } from './ResultView';

test('shows pretty JSON for a result', () => {
  render(<ResultView state={{ status: 'done', value: { result: { a: 1 } } }} />);
  expect(screen.getByText(/"a": 1/)).toBeInTheDocument();
});

test('shows an error block for an error result', () => {
  render(<ResultView state={{ status: 'done', value: { error: 'kaboom' } }} />);
  expect(screen.getByRole('alert')).toHaveTextContent('kaboom');
});

test('shows a loading label', () => {
  render(<ResultView state={{ status: 'loading' }} />);
  expect(screen.getByText(/running/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/components/ResultView.test.tsx`
Expected: FAIL — `./ResultView` has no exports.

- [ ] **Step 3: Implement `ResultView.tsx`**

> Registry-first: wrap the output in the vendored `Card`/`CardContent` (`@/components/ui/card`) for consistent styling. Keep `role="alert"` on the error block and the `<pre>` JSON (the tests query by role and text). Match the actual exports you saw in Task 4b Step 3.

```tsx
import type { CallResult } from '@/lib/api';

export type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; value: CallResult };

export function ResultView({ state }: { state: ResultState }) {
  if (state.status === 'idle') {
    return <p className="text-sm text-gray-500">Run a tool to see its result.</p>;
  }
  if (state.status === 'loading') {
    return <p className="text-sm text-gray-500">Running…</p>;
  }
  if (state.value.error !== undefined) {
    return (
      <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
        {state.value.error}
      </div>
    );
  }
  return (
    <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
      {JSON.stringify(state.value.result, null, 2)}
    </pre>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/components/ResultView.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Add a Storybook story**

`frontend/src/components/ResultView.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResultView } from './ResultView';

const meta: Meta<typeof ResultView> = {
  title: 'Playground/ResultView',
  component: ResultView,
};
export default meta;

export const Result: StoryObj<typeof ResultView> = {
  args: { state: { status: 'done', value: { result: { id: 'entity:light.bed', score: 0.92 } } } },
};
export const ErrorState: StoryObj<typeof ResultView> = {
  args: { state: { status: 'done', value: { error: 'HA recorder unreachable' } } },
};
export const Loading: StoryObj<typeof ResultView> = { args: { state: { status: 'loading' } } };
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/ResultView.tsx frontend/src/components/ResultView.test.tsx \
  frontend/src/components/ResultView.stories.tsx
git commit -m "feat(terminus-rag): ResultView component"
```

---

## Task 8: `ToolList` + `App` integration + health header

**Files:**
- Create: `frontend/src/components/ToolList.tsx`
- Modify: `frontend/src/App.tsx`, `frontend/src/App.test.tsx`

**Interfaces:**
- Consumes: `getTools`, `callTool`, `ToolDef` (`@/lib/api`); `SchemaForm`; `ResultView` + `ResultState`.
- Produces: `App` that loads tools on mount, lists them (`ToolList`), renders the selected tool's `SchemaForm`, runs `callTool` on submit, and shows the `ResultView`. `ToolList({ tools, selected, onSelect })`.

- [ ] **Step 1: Write the failing integration test**

Replace `frontend/src/App.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import App from './App';

afterEach(() => vi.restoreAllMocks());

const tools = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'search_ha',
    description: 'Semantic search',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
  },
];

test('loads tools, runs the selected one, and shows the result', async () => {
  const fetchMock = vi
    .fn()
    // getTools
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tools }) })
    // health header (App fetches ./health)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok', indexed: 2, model: 'bge' }) })
    // callTool
    .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [{ kind: 'entity', count: 2 }] }) });
  vi.stubGlobal('fetch', fetchMock);

  render(<App />);

  // Tools load and appear.
  await waitFor(() => expect(screen.getByText('list_kinds')).toBeInTheDocument());

  // list_kinds has no args; run it.
  await userEvent.click(screen.getByText('list_kinds'));
  await userEvent.click(screen.getByRole('button', { name: /run/i }));

  await waitFor(() => expect(screen.getByText(/"kind": "entity"/)).toBeInTheDocument());
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd frontend && npx pnpm@10.33.0 test:run src/App.test.tsx`
Expected: FAIL — App doesn't load tools yet.

- [ ] **Step 3: Implement `ToolList.tsx`**

> Registry-first: you may use the vendored `Button` (`@/components/ui/button`, e.g. `variant="ghost"`) for each tool row instead of the raw `<button>` — keep the tool `name` text rendered so the App test can click it by text.

```tsx
import type { ToolDef } from '@/lib/api';

type Props = {
  tools: ToolDef[];
  selected: string | null;
  onSelect: (name: string) => void;
};

export function ToolList({ tools, selected, onSelect }: Props) {
  return (
    <ul className="flex flex-col gap-1">
      {tools.map((t) => (
        <li key={t.name}>
          <button
            type="button"
            onClick={() => onSelect(t.name)}
            className={`w-full rounded px-2 py-1 text-left text-sm ${
              selected === t.name ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-mono">{t.name}</span>
            <span className="block text-xs text-gray-500">{t.description}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Implement `App.tsx`**

```tsx
import { useEffect, useMemo, useState } from 'react';

import { callTool, getTools, type ToolDef } from '@/lib/api';
import { ResultView, type ResultState } from '@/components/ResultView';
import { SchemaForm } from '@/components/SchemaForm';
import { ToolList } from '@/components/ToolList';

type Health = { status?: string; indexed?: number; model?: string };

export default function App() {
  const [tools, setTools] = useState<ToolDef[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState>({ status: 'idle' });
  const [health, setHealth] = useState<Health | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getTools()
      .then((t) => {
        setTools(t);
        setSelected((s) => s ?? t[0]?.name ?? null);
      })
      .catch((e) => setLoadError(String(e)));
    fetch('./health')
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const current = useMemo(() => tools.find((t) => t.name === selected) ?? null, [tools, selected]);

  async function run(args: Record<string, unknown>) {
    if (!current) return;
    setResult({ status: 'loading' });
    const value = await callTool(current.name, args);
    setResult({ status: 'done', value });
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">Terminus RAG Playground</h1>
        {health && (
          <span className="text-xs text-gray-500">
            {health.status} · {health.indexed} indexed · {health.model}
          </span>
        )}
      </header>

      {loadError ? (
        <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Failed to load tools: {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-[16rem_1fr] gap-6">
          <aside>
            <ToolList tools={tools} selected={selected} onSelect={setSelected} />
          </aside>
          <section className="flex flex-col gap-4">
            {current && <SchemaForm key={current.name} schema={current.inputSchema} onSubmit={run} />}
            <ResultView state={result} />
          </section>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Run the App test + full frontend suite**

Run: `cd frontend && npx pnpm@10.33.0 test:run`
Expected: PASS (all suites).

- [ ] **Step 6: Typecheck + build**

Run: `cd frontend && npx pnpm@10.33.0 typecheck && npx pnpm@10.33.0 build`
Expected: no type errors; `dist/` produced.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/ToolList.tsx frontend/src/App.tsx frontend/src/App.test.tsx
git commit -m "feat(terminus-rag): wire App (tool list + form + result + health header)"
```

---

## Task 9: Multi-stage Dockerfile

**Files:**
- Modify: `Dockerfile`

**Interfaces:**
- Consumes: `frontend/` sources + `frontend/pnpm-lock.yaml` (Task 4); the backend serves `/app/frontend/dist` via the conditional mount (Task 3).
- Produces: an image whose runtime layer contains `/app/frontend/dist`.

- [ ] **Step 1: Add the frontend builder stage and copy step**

Replace `Dockerfile` with:

```dockerfile
# Plain glibc Debian base — fastembed/onnxruntime ship manylinux (glibc) wheels
# only, so the Alpine/musl HA base images cannot install them. No bashio, no s6.
# No "# syntax=" header and no RUN --mount cache: the Supervisor's classic builder
# errors on them.

# ---- frontend builder ----
FROM node:22-alpine AS frontend
RUN npm install -g pnpm@10.33.0
WORKDIR /build
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---- runtime ----
FROM python:3.12-slim

WORKDIR /app

# Install backend dependencies first, keyed only on the dependency manifest.
# pyproject.toml's version is frozen at 0.0.0, so this layer is reused across
# version bumps and source-only edits; it re-runs only when deps change.
# setuptools needs a buildable package to read [project] metadata, so provide a
# stub package for this deps-only layer.
COPY backend/pyproject.toml /app/backend/pyproject.toml
RUN mkdir -p /app/backend/app \
    && touch /app/backend/app/__init__.py \
    && pip install --no-cache-dir "/app/backend"

# Copy the real backend source and reinstall just the project — dependencies are
# already cached above. This layer busts on any source edit but is cheap.
COPY backend/ /app/backend/
RUN pip install --no-cache-dir --no-deps --force-reinstall "/app/backend"

# The built SPA, served by the backend's conditional StaticFiles mount at /.
COPY --from=frontend /build/dist /app/frontend/dist

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 9000
CMD ["/run.sh"]
```

- [ ] **Step 2: Build the image locally to verify both stages**

Run: `docker build -t terminus-rag-test addons/terminus-rag` (from repo root; adjust path if building inside the add-on dir use `.`)
Expected: builds through the `frontend` stage (pnpm build) and the runtime stage; final image present.

- [ ] **Step 3: Verify the SPA is served by the running container**

Run:
```bash
docker run --rm -d -p 9000:9000 --name rag-test terminus-rag-test
sleep 3
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9000/   # SPA index → 200
curl -s http://localhost:9000/health | head -c 100                 # health JSON
docker rm -f rag-test
```
Expected: `/` → `200` (SPA served); `/health` → JSON. (The index will be `warming` with no HA connection — that's fine.)

- [ ] **Step 4: Commit**

```bash
git add Dockerfile
git commit -m "build(terminus-rag): multi-stage Dockerfile (build SPA, serve from backend)"
```

---

## Task 10: config.yaml ingress + version bump + docs

**Files:**
- Modify: `config.yaml`, `CHANGELOG.md`, `README.md`, `CLAUDE.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the add-on declares ingress; version `0.2.0`; docs describe the playground + dev ports.

- [ ] **Step 1: Add ingress + bump version in `config.yaml`**

Change the top-of-file metadata so the block reads:

```yaml
name: Terminus RAG
# Canonical add-on version — the ONLY version bumped on release. backend/pyproject.toml
# is intentionally pinned to "0.0.0" to preserve the Docker pip dependency-layer cache.
version: "0.2.0"
slug: terminus_rag
description: HA knowledge MCP server — semantic search + enumeration + history over the registry.
arch:
  - aarch64
  - amd64
init: false
homeassistant_api: true
ingress: true
ingress_port: 9000
boot: auto
startup: application
```

(Leave the `options:`/`schema:` blocks unchanged.)

- [ ] **Step 2: Add the CHANGELOG entry**

Insert at the top of `CHANGELOG.md`, above `## 0.1.1` (or above `## 0.1.0` if the labels branch has not merged):

```markdown
## 0.2.0

- **New: an in-app tool-console playground.** The add-on now exposes a Web UI
  (HA sidebar / ingress) to run every MCP tool — fill a form generated from each
  tool's schema and inspect the JSON result, plus an index-status header. The UI
  is reachable only through HA ingress (guarded by the `X-Ingress-Path` header);
  the `/mcp` endpoint stays bearer-token gated.
```

- [ ] **Step 3: Document the playground in `README.md`**

Append a section to `README.md`:

```markdown
## Playground UI

The add-on serves a tool-console Web UI through Home Assistant ingress (open it
from the add-on's "Open Web UI" / sidebar entry). It lists all MCP tools, renders
a form from each tool's input schema, runs it in-process, and shows the JSON
result, with an index-status header (`/health`).

Access control:
- The UI and its `/playground/*` endpoints are reachable only via HA ingress
  (requests carry the `X-Ingress-Path` header). Direct non-ingress calls get a
  `404` when `api_token` is set.
- The `/mcp` endpoint is unchanged: bearer-token gated when `api_token` is set.
- With no `api_token` configured (local dev), everything is open.
```

- [ ] **Step 4: Add a dev-ports note to `CLAUDE.md`**

Append to `addons/terminus-rag/CLAUDE.md`:

```markdown
## Dev ports

Laptop dev (6374x convention; backend stays on its real port :9000):

| Port | Service |
|---|---|
| `63743` | Vite dev server (playground SPA) — `frontend/vite.config.ts` |
| `63744` | Storybook — `frontend/package.json` |

`dev.sh` runs the backend (`:9000`) + Vite (`:63743`) together; open
`http://localhost:63743`.
```

- [ ] **Step 5: Validate YAML**

Run: `cd backend && uv run python -c "import yaml; yaml.safe_load(open('../config.yaml')); print('ok')"`
Expected: `ok`.

- [ ] **Step 6: Commit**

```bash
git add config.yaml CHANGELOG.md README.md CLAUDE.md
git commit -m "feat(terminus-rag): enable ingress + document playground (0.2.0)"
```

---

## Task 11: `dev.sh` + `.env.example`

**Files:**
- Create: `dev.sh`, `.env.example`

**Interfaces:**
- Consumes: `frontend/` (Task 4), backend uv project.
- Produces: a one-command local dev runner.

- [ ] **Step 1: Create `.env.example`**

```bash
# Local dev env for ./dev.sh. Copy to .env (gitignored) and fill in.
# The add-on connects to a real Home Assistant to build the index. Use a
# long-lived access token from your HA profile.
HASS_URL=https://homeassistant.local:8123
HASS_TOKEN=

# Optional: set to require a bearer token on /mcp (and to ingress-guard the
# playground). Leave blank for fully-open local dev.
RAG_API_TOKEN=
```

- [ ] **Step 2: Create `dev.sh`**

```bash
#!/usr/bin/env bash
# Local dev stack for terminus-rag: backend (uvicorn :9000) + Vite (:63743),
# both with reload. One command instead of two terminals.
#
#   cp .env.example .env   # fill in HASS_URL / HASS_TOKEN
#   ./dev.sh
#
# Open the Vite URL (http://localhost:63743). Ctrl-C stops everything.
set -euo pipefail

ADDON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ADDON_DIR/backend"
FRONTEND="$ADDON_DIR/frontend"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$*" >&2; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

if [ -f "$ADDON_DIR/.env" ]; then
  log "Loading $ADDON_DIR/.env"
  set -a; . "$ADDON_DIR/.env"; set +a
else
  warn "No .env found — copy .env.example to .env and add HASS_URL/HASS_TOKEN."
fi
[ -n "${HASS_TOKEN:-}" ] || warn "HASS_TOKEN is empty — the index cannot warm."

command -v uv   >/dev/null || fail "uv not found (https://docs.astral.sh/uv/)."
command -v pnpm >/dev/null || fail "pnpm not found (npm install -g pnpm@10.33.0)."

log "Syncing backend deps via uv"
( cd "$BACKEND" && uv sync --extra dev )

if [ ! -d "$FRONTEND/node_modules" ]; then
  log "Installing frontend deps (first run)"
  ( cd "$FRONTEND" && pnpm install )
fi

pids=()
cleanup() {
  trap - INT TERM EXIT
  log "Shutting down"
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
}
trap cleanup INT TERM EXIT

log "Backend (uvicorn --reload) → http://127.0.0.1:9000"
( cd "$BACKEND" && exec uv run uvicorn app.main:app --host 127.0.0.1 --port 9000 --reload ) &
pids+=($!)

log "Vite (HMR) → http://localhost:63743   <-- open this"
( cd "$FRONTEND" && exec pnpm dev ) &
pids+=($!)

wait
```

- [ ] **Step 3: Make it executable and smoke-check syntax**

Run: `chmod +x dev.sh && bash -n dev.sh && echo "syntax ok"`
Expected: `syntax ok`.

- [ ] **Step 4: Commit**

```bash
git add dev.sh .env.example
git commit -m "feat(terminus-rag): dev.sh + .env.example for local playground dev"
```

---

## Final verification

- [ ] Backend suite green: `cd backend && uv run pytest -q`
- [ ] Frontend suite green + builds: `cd frontend && npx pnpm@10.33.0 test:run && npx pnpm@10.33.0 typecheck && npx pnpm@10.33.0 build`
- [ ] Image builds and serves the SPA (Task 9 Step 3).
- [ ] `config.yaml` is `0.2.0` with a matching CHANGELOG entry.
