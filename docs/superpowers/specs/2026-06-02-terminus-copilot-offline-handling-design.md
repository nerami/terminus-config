# Terminus Copilot — Offline Agent Handling

**Date:** 2026-06-02  
**Status:** Approved

## Problem

When `terminus-agent` is not running:
- `SafeHttpAgent.catchError` emits a synthetic error message into the SSE stream
- CopilotKit frontend silently drops the message — no visible error shown
- No fallback to `BuiltInAgent` — user gets no response at all
- POST to `/api/copilotkit` still returns 200 (correct for SSE), masking the failure

## Solution 1: BuiltInAgent Fallback in SafeHttpAgent

**File:** `addons/terminus-copilot/src/runtime.ts`

`SafeHttpAgent` accepts a `fallback: BuiltInAgent` at construction. On `catchError`, instead of returning a synthetic message Observable, it delegates to `fallback.run(input)`. This gives the user a real working Haiku-backed agent when terminus-agent is offline.

`buildRuntime` creates the `BuiltInAgent` unconditionally (it's always needed as fallback or default), then wraps it in `SafeHttpAgent` only when `TERMINUS_AGENT_URL` is set.

```
TERMINUS_AGENT_URL set?
  yes → SafeHttpAgent(url, fallbackAgent).run()
          ↳ error? → fallbackAgent.run()
  no  → BuiltInAgent.run()
```

No change to the HTTP response shape, SSE protocol, or CopilotKit API.

## Solution 2: Health Endpoint + Frontend Offline Badge

### Backend — `addons/terminus-copilot/src/server.ts`

New route: `GET /health`  
- If no `TERMINUS_AGENT_URL`: `{ status: "ok", agent: "builtin" }`  
- If `TERMINUS_AGENT_URL` set: probe `${TERMINUS_AGENT_URL}/health` with 2s `AbortSignal.timeout`
  - Reachable → `{ status: "ok", agent: "external" }`
  - Unreachable → `{ status: "degraded", agent: "offline" }`
- Always returns HTTP 200 (health endpoint itself is always reachable)

### Frontend — `terminus/src/lib/copilot.tsx` + `terminus/src/App.tsx`

`useCopilotRuntimeUrl` already resolves the ingress URL. Extend the hook (or add `useCopilotHealth`) to:
1. Poll `<ingressUrl>/health` every 30s after URL is resolved
2. Expose `agentStatus: "ok" | "degraded" | "offline" | "unknown"` alongside the URL state

`App.tsx` renders a visible badge when `agentStatus === "offline"` or `"degraded"`:

```
⚠️ Terminus Agent offline — responses use fallback model
```

Badge sits in the copilot panel header, not blocking the chat input.

### terminus-agent — `terminus-agent/src/index.ts`

Add `GET /health` returning `{ status: "ok" }` — required for the copilot health probe to succeed.

## Data Flow

```
Frontend (30s poll)
  → GET <ingressUrl>/health
    → terminus-copilot /health handler
      → fetch terminus-agent /health (2s timeout)
        reachable  → 200 { status:"ok",    agent:"external" }
        unreachable→ 200 { status:"degraded", agent:"offline" }
  → frontend shows badge if degraded
```

## Error Handling

- Health probe timeout (2s) prevents slow-fail blocking the response
- Frontend badge is informational — does not block chat usage
- Fallback agent (Solution 1) activates independently of health polling
- If health endpoint itself is unreachable (copilot down), `useCopilotHealth` stays in `"unknown"` state — no badge shown (copilot URL resolution already shows its own error)

## Files Changed

| File | Change |
|------|--------|
| `addons/terminus-copilot/src/runtime.ts` | `SafeHttpAgent` takes fallback; `buildRuntime` wires it |
| `addons/terminus-copilot/src/server.ts` | Add `GET /health` route |
| `terminus/src/lib/copilot.tsx` | Add `useCopilotHealth` hook |
| `terminus/src/App.tsx` | Render offline badge |
| `terminus-agent/src/index.ts` | Add `GET /health` route |

## Out of Scope

- HA `binary_sensor` for agent liveness (backlog in AGENTS.md — separate feature)
- Automatic terminus-agent restart on failure
- Retry logic in `SafeHttpAgent` (single catchError → fallback is sufficient)
