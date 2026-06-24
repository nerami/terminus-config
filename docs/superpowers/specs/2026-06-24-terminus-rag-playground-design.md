# Terminus RAG playground — design

**Date:** 2026-06-24
**Status:** Approved (brainstorm), pending implementation plan
**Add-on:** `terminus-rag` (slug `local_terminus_rag`), target version `0.2.0`

## Problem

The Terminus RAG add-on is a headless MCP server (FastMCP / Streamable HTTP on
`:9000`, eight knowledge tools). There is no way to interactively exercise the
tools — inspect retrieval quality, enumerate the index, or call the
history/trace tools — without an external MCP client. We want an embedded
"tool console" UI for testing, reachable on the real device.

## Decisions (from brainstorming)

1. **Access:** on-device via **HA ingress** (behind HA authentication).
2. **Scope:** **full tool console** — all 8 tools
   (`search_ha`, `list_records`, `list_kinds`, `get_record`,
   `get_automation_trace`, `get_logbook`, `get_history`, `refresh`).
3. **Execution:** **schema-driven forms + in-process callable execution** —
   forms are generated from each tool's MCP `inputSchema`; execution calls the
   in-process `build_tools(state)` callables (no browser-side MCP transport).
4. **Frontend:** **React/Vite SPA** served as static files (Approach C).
5. **Stack:** **mirror the Terminus add-on frontend** (Vite + React + TS +
   Tailwind + pnpm) and **reuse the `@terminus` UI registry** + theme.
6. **Auth hardening:** playground routes are guarded by the HA
   **`X-Ingress-Path`** header (see Auth).

## Architecture

The add-on keeps a single uvicorn/Starlette app on `:9000` (no new process, no
second port). HA ingress proxies to `:9000`; the SPA is the ingress entry
point. The Terminus agent continues to call `local-terminus-rag:9000/mcp`
directly over the internal hassio network — UI and MCP coexist on one app.

```
Browser ──HA ingress (authed)──> :9000 Starlette ──> GET /                 → SPA (static dist)
                                                  ├─ GET  /playground/tools → tool schemas
                                                  └─ POST /playground/call  → build_tools(state)[name](...)
Terminus agent ──internal net──> :9000 /mcp   (unchanged, bearer-token gated)
```

### config.yaml

- Add `ingress: true` and `ingress_port: 9000`.
- Bump `version` `0.1.1` → `0.2.0` (+ matching `CHANGELOG.md` entry — required
  by the add-on's release rule).

## Backend

New module **`backend/app/playground.py`** (keeps `mcp_app.py` focused).
`build_playground_routes(state, mcp)` returns Starlette routes:

- **`GET /playground/tools`** → `await mcp.list_tools()`, serialized to
  `[{name, description, inputSchema}]`. `inputSchema` is the JSON Schema FastMCP
  generated from each callable's type hints; the SPA renders forms from it.
- **`POST /playground/call`** → body `{tool, args}`:
  - Whitelist `tool` against `build_tools(state)`; unknown → `400 {error}`.
  - Invoke the callable; `await` it when it is a coroutine (history/trace/refresh
    are async; index tools are sync — detected via `inspect.iscoroutine` on the
    return / `iscoroutinefunction`).
  - Success → `200 {result}`. Tool raises (e.g. HA recorder unreachable, bad
    args) → caught → `200 {error: <sanitized message>}` so the SPA renders it
    uniformly in the result pane. Settings/token are never echoed.

**Static serving:** `Mount("/", StaticFiles(directory="/app/frontend/dist",
html=True))` registered **last**, so `/mcp`, `/health`, and `/playground/*`
match first. The
console is a single view, so `html=True` is sufficient — no SPA-router fallback
(add one only if client routes are introduced later).

### Wiring (`mcp_app.py`)

`build_app` appends the playground routes and the static mount to the Starlette
routes (after `inner.routes`), and applies the restructured middleware.

### Auth (`BearerAuthMiddleware`, restructured)

Classify each request by path:

| Path | `api_token` unset (dev) | `api_token` set (prod) |
|---|---|---|
| `/health` | open | open |
| `/mcp*` | open | require `Authorization: Bearer <token>` (unchanged) |
| everything else (SPA, `/playground/*`, assets) | open | allow **only if `X-Ingress-Path` header present**, else `404` |

- The playground never requires the bearer token (HA ingress authenticates the
  user; the browser cannot hold the token).
- When a token is set, the playground is reachable **only through ingress**.
  `404` (not `401`) hides the surface from non-ingress internal callers.

**Residual caveat (documented, accepted):** `X-Ingress-Path` is set by HA's
ingress proxy but is not cryptographically unspoofable — a co-installed add-on
*could* forge it. It raises the bar substantially (blocks casual/accidental
internal access) without a heavier auth scheme. The secret-bearing surface
(`/mcp`) stays bearer-token gated regardless.

## Frontend

New **`addons/terminus-rag/frontend/`**, scaffolded like the Terminus add-on:
Vite + React + TypeScript + Tailwind + pnpm, `pnpm-lock.yaml` as source of
truth, `components.json` pointing at the `@terminus` registry (`:63748`), shared
Tailwind theme. **`vite.config.ts` sets `base: './'`** (so all asset/data URLs
are relative and resolve under the ingress path prefix
`/api/hassio_ingress/<token>/`) and **`server.port: 63743`** with a dev proxy of
`/playground`, `/mcp`, `/health` → `http://localhost:9000` (mirrors the Terminus
Vite proxy to `:8099`).

Components (small, single-purpose):

| Unit | Responsibility |
|---|---|
| `lib/api.ts` | `getTools()` → `GET ./playground/tools`; `callTool(name, args)` → `POST ./playground/call`. Relative URLs only. |
| `components/ToolList` | Lists the 8 tools (name + description) from the schema fetch; selects the active tool. |
| `components/SchemaForm` | Renders inputs from a tool's JSON Schema: `string`→text, `integer`→number, `enum`→select, optional→not-required (omitted from args when blank); nested/complex → raw JSON textarea fallback. |
| `components/ResultView` | Pretty-prints the JSON result (collapsible); renders `{error}` responses distinctly. |
| `App` | Loads tools on mount; wires selection → form → call → result; loading/empty/error states. |

**Index-status header:** a compact bar showing `/health` (status, indexed count,
model, last refresh), reusing the existing open `/health` endpoint (no new
backend work).

**Data flow:** mount → `getTools()` → pick tool → fill `SchemaForm` →
`callTool` → `ResultView`. All fetches relative, so it behaves identically at
`localhost:9000` (dev) and under ingress.

**Registry note:** consume `@terminus` registry components (button, input, card,
etc.) rather than hand-rolling. The `@terminus` dev server (`:63748`) must be
running when adding components.

## Build

Multi-stage **`Dockerfile`** (current one is single-stage Python). Mirror the
Terminus add-on's manifest-before-source caching; keep classic-builder
constraints (no `# syntax=` header, no `RUN --mount=cache`):

```
Stage 1  node builder (match the Terminus add-on's node base image + pnpm version)
  COPY frontend/package.json frontend/pnpm-lock.yaml → pnpm install --frozen-lockfile
  COPY frontend/ → pnpm build            # → frontend/dist
Stage 2  python:3.12-slim (runtime, unchanged base)
  ...existing backend pip layers...
  COPY --from=builder /app/frontend/dist /app/frontend/dist
```

The exact node image tag and pnpm version are pinned in the implementation plan
to match `addons/terminus`'s Dockerfile (consistency + a known-good toolchain).

The heavy `node_modules` stay in the builder; the runtime image gains only the
small static `dist/`. `run.sh` is unchanged (`uvicorn app.main:app` now also
serves the SPA + playground routes).

**Deploy interplay:** `deploy-addons.sh` already `--exclude`s `node_modules/`,
`dist/`, `build/`, so the SPA is **built on-device** by the Supervisor's Docker
build (same as Terminus) — synced source carries only `frontend/` sources +
lockfile.

## Local development (`dev.sh`)

A new **`addons/terminus-rag/dev.sh`** (mirroring the Terminus add-on's, minus
LangGraph) runs the full playground stack locally with hot reload:

- Loads `.env` (`HASS_URL`/`HASS_TOKEN` to warm the index; `api_token` left
  blank → auth open locally, so no ingress header needed).
- `uv sync` the backend; `pnpm install` the frontend on first run.
- Runs the **backend** uvicorn on `:9000` — no `SUPERVISOR_TOKEN`, so it uses
  the `HASS_*` dev fallback and warms the index (`allowed_hosts` already permits
  localhost).
- Runs the **Vite** dev server on **`:63743`** (proxying `/playground`, `/mcp`,
  `/health` → `http://localhost:9000`).
- Opens `http://localhost:63743`.

**Dev ports — extends the 6374x laptop-dev convention** (backend stays on
`:9000`, its production/internal port):

| Port | Service |
|---|---|
| `63743` | terminus-rag Vite dev server (the one you open) |
| `63744` | terminus-rag Storybook (`storybook dev -p 63744`) |

Existing allocations: `63740` Vite (terminus), `63741` Storybook (terminus),
`63742` Langfuse, `63748`/`63749` terminus-ui — so `63743`/`63744` are the next
consecutive free ports. These are recorded in `addons/terminus-rag/CLAUDE.md`
(a short ports note) plus `frontend/vite.config.ts` and `frontend/package.json`.

A matching `.env.example` (`HASS_URL`, `HASS_TOKEN`, optional `api_token`) is
added so a fresh clone knows what `dev.sh` expects.

## Testing

**Backend (TDD)** — `backend/tests/test_playground.py` via Starlette
`TestClient`:

- `GET /playground/tools` returns all 8 tools; names match `build_tools` keys;
  each has an `inputSchema`.
- `POST /playground/call` dispatches a **sync** tool (`list_kinds`) and an
  **async** tool (e.g. `refresh` with a stubbed refresher) — proves the await
  path.
- Unknown tool → `400`; a tool that raises → `200 {error}` (no stacktrace leak).
- **Auth matrix** (with `api_token` set): `/mcp` → `401` without bearer;
  `/playground/tools` → `404` without `X-Ingress-Path`, `200` with it; `/health`
  always open. With no token: playground open.

**Frontend** — mirror Terminus's vitest + Storybook setup, proportionally:
unit tests for `SchemaForm` (schema→inputs, optional omission, enum→select, JSON
fallback) and `lib/api`; Storybook stories for `SchemaForm`/`ResultView`. No
exhaustive E2E — internal tool.

## Error handling (recap)

- Malformed request / unknown tool → `400 {error}`.
- Tool execution exception → `200 {error}` rendered in `ResultView`.
- `/tools` fetch failure → SPA error banner.
- Secrets/token never echoed in responses or logs.

## Files

- **New:** `backend/app/playground.py`, `backend/tests/test_playground.py`,
  `frontend/**` (Vite/React/TS/Tailwind, `components.json`, Storybook, tests),
  `dev.sh`, `.env.example`.
- **Changed:** `backend/app/mcp_app.py` (wire routes + restructured
  middleware), `Dockerfile`, `config.yaml` (ingress + version),
  `CHANGELOG.md`, `README.md`, `CLAUDE.md` (dev ports note).

## Out of scope (YAGNI)

- No RAG **evaluation** metrics/datasets (this is an interactive playground, not
  an eval harness; eval can ride on the existing self-hosted Langfuse later).
- No client-side routing / multi-page SPA.
- No exposed host port; ingress only.
- No new add-on options (no enable/disable toggle — ingress + `X-Ingress-Path`
  guard cover access).
