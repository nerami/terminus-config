# Terminus Copilot Offline Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When terminus-agent is unreachable, silently fall back to BuiltInAgent (Haiku) and show a visible offline badge in the Terminus panel.

**Architecture:** Two changes run independently: (1) backend `SafeHttpAgent` gains a `BuiltInAgent` fallback so users get real responses instead of silence; (2) terminus-copilot exposes a `/health` endpoint that probes terminus-agent, and the frontend polls it every 30 s to show an offline badge.

**Tech Stack:** TypeScript, Node/Express, RxJS (rxjs catchError), vitest, supertest, React hooks, CopilotKit v2

---

## File Map

| File | Change |
|------|--------|
| `addons/terminus-copilot/src/runtime.ts` | Export `SafeHttpAgent`; constructor takes `fallback: BuiltInAgent`; `catchError` delegates to fallback instead of synthetic message; `buildRuntime` always constructs `BuiltInAgent` and passes as fallback |
| `addons/terminus-copilot/src/runtime.test.ts` | Add tests: SafeHttpAgent falls back on error; buildRuntime with TERMINUS_AGENT_URL set uses SafeHttpAgent |
| `addons/terminus-copilot/src/server.ts` | Enhance `GET /health` to probe `TERMINUS_AGENT_URL/health` with 2 s timeout; return `{ status, agent }` |
| `addons/terminus-copilot/src/server.test.ts` | Add tests: health returns builtin when no agent URL; returns external when agent up; returns degraded when agent down |
| `terminus/src/lib/copilot.tsx` | Add `AgentHealth` type; add `useCopilotHealth(runtimeUrl)` hook; export both |
| `terminus/src/lib/copilot.test.tsx` | Add tests for `useCopilotHealth`: checking → ok, checking → degraded, fetch error → error |
| `terminus/src/App.tsx` | Add `CopilotAgentStatus` component; use in `CopilotIsland` |

---

## Task 1: Export SafeHttpAgent with BuiltInAgent fallback

**Files:**
- Modify: `addons/terminus-copilot/src/runtime.ts`

- [ ] **Step 1: Write the failing test**

Add to `addons/terminus-copilot/src/runtime.test.ts`:

```typescript
import { describe, expect, it, vi } from "vitest"

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ name: "fake-anthropic" })),
}))

const mockFallbackRun = vi.fn()

vi.mock("@copilotkit/runtime/v2", () => ({
  BuiltInAgent: class MockBuiltInAgent {
    run(input: unknown) {
      return mockFallbackRun(input)
    }
  },
  CopilotSseRuntime: class {
    constructor(public opts: unknown) {}
  },
}))

vi.mock("@copilotkit/runtime/langgraph", () => ({
  LangGraphHttpAgent: class {
    constructor(public opts: { url: string }) {}
    run(_input: unknown) {
      // Returns an object with .pipe() that errors — simulates unreachable agent
      return {
        pipe: (op: (src: unknown) => unknown) =>
          op({ subscribe: () => {} }),
      }
    }
  },
}))

vi.mock("@copilotkit/runtime/v2/express", () => ({
  createCopilotExpressHandler: vi.fn(() => (_req: unknown, res: { json: (b: unknown) => void }) =>
    res.json({ stub: "runtime" })
  ),
}))

import { SafeHttpAgent, buildRuntime } from "./runtime"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd addons/terminus-copilot && pnpm test:run src/runtime.test.ts
```

Expected: FAIL — `SafeHttpAgent` not exported from `./runtime`

- [ ] **Step 3: Rewrite runtime.ts**

Replace the full contents of `addons/terminus-copilot/src/runtime.ts`:

```typescript
import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph"
import { catchError } from "rxjs"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export class SafeHttpAgent extends LangGraphHttpAgent {
  constructor(
    opts: { url: string },
    private fallback: BuiltInAgent,
  ) {
    super(opts)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override run(input: any): any {
    return super.run(input).pipe(
      catchError((err: Error) => {
        console.error("terminus-agent unreachable, falling back to built-in:", err.message)
        return this.fallback.run(input)
      }),
    )
  }
}

export function buildRuntime({ apiKey }: RuntimeOptions): Router {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const agentUrl = process.env.TERMINUS_AGENT_URL

  const builtIn = new BuiltInAgent({
    model: "anthropic/claude-haiku-4-5",
    apiKey,
    providerOptions: {
      anthropic: { cacheControl: { type: "ephemeral" } },
    },
  })

  const defaultAgent = agentUrl
    ? new SafeHttpAgent({ url: agentUrl }, builtIn)
    : builtIn

  if (agentUrl) {
    console.log(`terminus-copilot: routing to external agent at ${agentUrl}`)
  }

  const runtime = new CopilotSseRuntime({ agents: { default: defaultAgent } })

  // single-route: CopilotKit client POSTs a JSON envelope {method,...} to
  // the base URL. Default multi-route mode expects per-operation paths
  // (GET /info, POST /agent/<id>/run, etc); the v2 react client speaks
  // single-route only — multi-route here means every call 404s.
  return createCopilotExpressHandler({
    runtime,
    basePath: "/",
    mode: "single-route",
  })
}
```

- [ ] **Step 4: Add the test body**

Replace the full contents of `addons/terminus-copilot/src/runtime.test.ts` with:

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { of, throwError } from "rxjs"

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ name: "fake-anthropic" })),
}))

const mockFallbackRun = vi.fn()

vi.mock("@copilotkit/runtime/v2", () => ({
  BuiltInAgent: class MockBuiltInAgent {
    run(input: unknown) {
      return mockFallbackRun(input)
    }
  },
  CopilotSseRuntime: class {
    constructor(public opts: unknown) {}
  },
}))

vi.mock("@copilotkit/runtime/langgraph", () => ({
  LangGraphHttpAgent: class {
    constructor(public opts: { url: string }) {}
    run(_input: unknown) {
      return throwError(() => new Error("connect ECONNREFUSED 127.0.0.1:3001"))
    }
  },
}))

vi.mock("@copilotkit/runtime/v2/express", () => ({
  createCopilotExpressHandler: vi.fn(
    () =>
      (_req: unknown, res: { json: (b: unknown) => void }) =>
        res.json({ stub: "runtime" }),
  ),
}))

import { SafeHttpAgent, buildRuntime } from "./runtime"
import type { BuiltInAgent } from "@copilotkit/runtime/v2"

describe("SafeHttpAgent", () => {
  beforeEach(() => {
    mockFallbackRun.mockReturnValue(of({ type: "RUN_FINISHED" }))
  })

  it("delegates to fallback when LangGraphHttpAgent.run() errors", async () => {
    const fallback = { run: mockFallbackRun } as unknown as BuiltInAgent
    const agent = new SafeHttpAgent({ url: "http://localhost:3001" }, fallback)
    const input = { threadId: "t1", runId: "r1" }

    // collect emitted values
    const results: unknown[] = []
    await new Promise<void>((resolve) => {
      agent.run(input).subscribe({
        next: (v: unknown) => results.push(v),
        complete: resolve,
      })
    })

    expect(mockFallbackRun).toHaveBeenCalledWith(input)
    expect(results).toEqual([{ type: "RUN_FINISHED" }])
  })
})

describe("buildRuntime", () => {
  afterEach(() => {
    delete process.env.TERMINUS_AGENT_URL
  })

  it("returns an Express handler when given an api key", () => {
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("throws when apiKey is empty", () => {
    expect(() => buildRuntime({ apiKey: "" })).toThrow(/api key/i)
  })

  it("uses BuiltIn directly when TERMINUS_AGENT_URL is not set", () => {
    delete process.env.TERMINUS_AGENT_URL
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("uses SafeHttpAgent when TERMINUS_AGENT_URL is set", () => {
    process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })
})
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd addons/terminus-copilot && pnpm test:run src/runtime.test.ts
```

Expected: all tests PASS

- [ ] **Step 6: Typecheck**

```bash
cd addons/terminus-copilot && pnpm typecheck
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
cd main && git add addons/terminus-copilot/src/runtime.ts addons/terminus-copilot/src/runtime.test.ts
git commit -m "feat(terminus-copilot): fall back to BuiltInAgent when terminus-agent unreachable"
```

---

## Task 2: Enhance /health endpoint to probe terminus-agent

**Files:**
- Modify: `addons/terminus-copilot/src/server.ts`
- Modify: `addons/terminus-copilot/src/server.test.ts`

- [ ] **Step 1: Write the failing tests**

Replace `addons/terminus-copilot/src/server.test.ts` with:

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import request from "supertest"

vi.mock("./runtime", () => ({
  buildRuntime: vi.fn(
    () =>
      (_req: unknown, res: { json: (body: unknown) => void }) =>
        res.json({ stub: "runtime" }),
  ),
}))

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

import { createApp } from "./server"

describe("createApp", () => {
  afterEach(() => {
    delete process.env.TERMINUS_AGENT_URL
    mockFetch.mockReset()
  })

  it("mounts copilotkit handler at /api/copilotkit", async () => {
    const app = createApp({ apiKey: "sk-test" })
    const res = await request(app).post("/api/copilotkit").send({})
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ stub: "runtime" })
  })

  it("throws if api key missing", () => {
    expect(() => createApp({ apiKey: "" })).toThrow(/api key/i)
  })

  describe("GET /health", () => {
    it("returns { status: ok, agent: builtin } when TERMINUS_AGENT_URL is not set", async () => {
      delete process.env.TERMINUS_AGENT_URL
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "ok", agent: "builtin" })
    })

    it("returns { status: ok, agent: external } when terminus-agent responds", async () => {
      process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
      mockFetch.mockResolvedValueOnce({ ok: true })
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "ok", agent: "external" })
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/health",
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      )
    })

    it("returns { status: degraded, agent: offline } when terminus-agent is unreachable", async () => {
      process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
      mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"))
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "degraded", agent: "offline" })
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd addons/terminus-copilot && pnpm test:run src/server.test.ts
```

Expected: FAIL — existing `/health` returns `{ ok: true }`, not `{ status, agent }`

- [ ] **Step 3: Update server.ts health handler**

Replace the health route in `addons/terminus-copilot/src/server.ts` (lines 16–18):

Old:
```typescript
  app.get("/health", (_req, res) => {
    res.json({ ok: true })
  })
```

New:
```typescript
  app.get("/health", async (_req, res) => {
    const agentUrl = process.env.TERMINUS_AGENT_URL
    if (!agentUrl) {
      res.json({ status: "ok", agent: "builtin" })
      return
    }
    try {
      await fetch(`${agentUrl}/health`, { signal: AbortSignal.timeout(2000) })
      res.json({ status: "ok", agent: "external" })
    } catch {
      res.json({ status: "degraded", agent: "offline" })
    }
  })
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd addons/terminus-copilot && pnpm test:run src/server.test.ts
```

Expected: all tests PASS

- [ ] **Step 5: Typecheck**

```bash
cd addons/terminus-copilot && pnpm typecheck
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
cd main && git add addons/terminus-copilot/src/server.ts addons/terminus-copilot/src/server.test.ts
git commit -m "feat(terminus-copilot): health endpoint probes terminus-agent liveness"
```

---

## Task 3: Add useCopilotHealth hook to terminus

**Files:**
- Modify: `terminus/src/lib/copilot.tsx`
- Modify: `terminus/src/lib/copilot.test.tsx`

- [ ] **Step 1: Write the failing tests**

Replace the full contents of `terminus/src/lib/copilot.test.tsx` with:

```typescript
import { describe, expect, it, vi, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { resolveAddonIngressUrl, resolveRuntimeUrl, useCopilotHealth } from "./copilot"

// ── resolveRuntimeUrl ────────────────────────────────────────────────────────

describe("resolveRuntimeUrl", () => {
  it("derives ingress prefix from /api/hassio_ingress/<token>/", () => {
    expect(
      resolveRuntimeUrl({
        pathname: "/api/hassio_ingress/abc123token/index.html",
        fallback: "http://dev/api/copilotkit",
      })
    ).toBe("/api/hassio_ingress/abc123token/api/copilotkit")
  })

  it("falls back to dev URL when no ingress prefix present", () => {
    expect(
      resolveRuntimeUrl({
        pathname: "/lovelace/0",
        fallback: "http://dev/api/copilotkit",
      })
    ).toBe("http://dev/api/copilotkit")
  })

  it("uses default localhost dev URL when fallback not provided", () => {
    expect(resolveRuntimeUrl({ pathname: "/" })).toBe(
      "http://localhost:3000/api/copilotkit"
    )
  })
})

// ── resolveAddonIngressUrl ───────────────────────────────────────────────────

type WsMsg = { type: string; endpoint: string; method: string }

describe("resolveAddonIngressUrl", () => {
  it("calls supervisor/api for session + info via websocket, returns ingress URL", async () => {
    const calls: WsMsg[] = []
    const send = async <T,>(msg: WsMsg): Promise<T> => {
      calls.push(msg)
      if (msg.endpoint === "/ingress/session") return {} as T
      if (msg.endpoint === "/addons/terminus_copilot/info") {
        return { ingress_url: "/api/hassio_ingress/TOK/" } as T
      }
      throw new Error(`unexpected endpoint ${msg.endpoint}`)
    }

    const url = await resolveAddonIngressUrl("terminus_copilot", send)
    expect(url).toBe("/api/hassio_ingress/TOK/api/copilotkit")
    expect(calls).toEqual([
      { type: "supervisor/api", endpoint: "/ingress/session", method: "POST" },
      {
        type: "supervisor/api",
        endpoint: "/addons/terminus_copilot/info",
        method: "GET",
      },
    ])
  })

  it("throws when ingress/session command rejects", async () => {
    const send = async <T,>(_msg: WsMsg): Promise<T> => {
      throw { code: "unauthorized", message: "nope" }
    }
    await expect(
      resolveAddonIngressUrl("terminus_copilot", send)
    ).rejects.toThrow(/ingress\/session failed: unauthorized: nope/)
  })

  it("throws when info result lacks ingress_url", async () => {
    const send = async <T,>(_msg: WsMsg): Promise<T> => ({} as T)
    await expect(
      resolveAddonIngressUrl("terminus_copilot", send)
    ).rejects.toThrow(/no ingress_url/)
  })
})

// ── useCopilotHealth ─────────────────────────────────────────────────────────

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

describe("useCopilotHealth", () => {
  afterEach(() => {
    mockFetch.mockReset()
  })

  it("starts in checking state", () => {
    mockFetch.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    expect(result.current).toEqual({ status: "checking" })
  })

  it("transitions to ok/builtin when health returns { status: ok, agent: builtin }", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: "ok", agent: "builtin" }),
    })
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("ok"))
    expect(result.current).toEqual({ status: "ok", agent: "builtin" })
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/health",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it("transitions to degraded/offline when health returns { status: degraded, agent: offline }", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: "degraded", agent: "offline" }),
    })
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("degraded"))
    expect(result.current).toEqual({ status: "degraded", agent: "offline" })
  })

  it("transitions to error state when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"))
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("derives health URL by replacing /api/copilotkit with /health", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: "ok", agent: "external" }),
    })
    renderHook(() => useCopilotHealth("/api/hassio_ingress/TOKEN123/api/copilotkit"))
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/hassio_ingress/TOKEN123/health",
      expect.any(Object),
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd terminus && pnpm test:run src/lib/copilot.test.tsx
```

Expected: FAIL — `useCopilotHealth` not exported from `./copilot`

- [ ] **Step 3: Add AgentHealth type and useCopilotHealth hook to copilot.tsx**

Append to `terminus/src/lib/copilot.tsx` (after the closing brace of `CopilotProvider`):

```typescript
export type AgentHealth =
  | { status: "checking" }
  | { status: "ok"; agent: "builtin" | "external" }
  | { status: "degraded"; agent: "offline" }
  | { status: "error" }

const HEALTH_POLL_MS = 30_000

function healthUrl(runtimeUrl: string): string {
  return runtimeUrl.replace(/\/api\/copilotkit$/, "/health")
}

export function useCopilotHealth(runtimeUrl: string): AgentHealth {
  const [health, setHealth] = useState<AgentHealth>({ status: "checking" })

  useEffect(() => {
    let cancelled = false
    const url = healthUrl(runtimeUrl)

    async function probe() {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
        const body = (await res.json()) as { status?: string; agent?: string }
        if (!cancelled) {
          if (body.status === "degraded") {
            setHealth({ status: "degraded", agent: "offline" })
          } else {
            setHealth({
              status: "ok",
              agent: (body.agent ?? "builtin") as "builtin" | "external",
            })
          }
        }
      } catch {
        if (!cancelled) setHealth({ status: "error" })
      }
    }

    void probe()
    const id = setInterval(() => void probe(), HEALTH_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [runtimeUrl])

  return health
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd terminus && pnpm test:run src/lib/copilot.test.tsx
```

Expected: all tests PASS

- [ ] **Step 5: Typecheck**

```bash
cd terminus && pnpm typecheck
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
cd main && git add terminus/src/lib/copilot.tsx terminus/src/lib/copilot.test.tsx
git commit -m "feat(terminus): add useCopilotHealth hook to poll agent liveness"
```

---

## Task 4: Show offline badge in CopilotIsland

**Files:**
- Modify: `terminus/src/App.tsx`

- [ ] **Step 1: Update imports in App.tsx**

At the top of `terminus/src/App.tsx`, change the copilot import from:

```typescript
import { CopilotProvider, useCopilotRuntimeUrl } from "@/lib/copilot"
```

to:

```typescript
import { CopilotProvider, useCopilotRuntimeUrl, useCopilotHealth } from "@/lib/copilot"
```

- [ ] **Step 2: Add CopilotAgentStatus component**

Insert after the `CopilotStatusBadge` function (around line 124 in the current file), before `CopilotIsland`:

```typescript
function CopilotAgentStatus({ runtimeUrl }: { runtimeUrl: string }) {
  const health = useCopilotHealth(runtimeUrl)
  if (health.status !== "degraded") return null
  return (
    <CopilotStatusBadge>
      Terminus Agent offline — using fallback model
    </CopilotStatusBadge>
  )
}
```

- [ ] **Step 3: Use CopilotAgentStatus in CopilotIsland**

In `CopilotIsland`, change the return when `runtime.status === "ready"` from:

```typescript
  return (
    <CopilotProvider url={runtime.url}>
      <CopilotWiring manifest={manifest} />
      <CopilotSidebar
        defaultOpen
        labels={{
          modalHeaderTitle: "Terminus Copilot",
          welcomeMessageText:
            "Describe an automation. I'll propose YAML, you approve or reject.",
        }}
      />
    </CopilotProvider>
  )
```

to:

```typescript
  return (
    <CopilotProvider url={runtime.url}>
      <CopilotAgentStatus runtimeUrl={runtime.url} />
      <CopilotWiring manifest={manifest} />
      <CopilotSidebar
        defaultOpen
        labels={{
          modalHeaderTitle: "Terminus Copilot",
          welcomeMessageText:
            "Describe an automation. I'll propose YAML, you approve or reject.",
        }}
      />
    </CopilotProvider>
  )
```

- [ ] **Step 4: Typecheck**

```bash
cd terminus && pnpm typecheck
```

Expected: no errors

- [ ] **Step 5: Run full test suite**

```bash
cd terminus && pnpm test:run
```

Expected: all tests PASS (no regressions)

- [ ] **Step 6: Commit**

```bash
cd main && git add terminus/src/App.tsx
git commit -m "feat(terminus): show offline badge when terminus-agent is unreachable"
```

---

## Task 5: Deploy and verify

- [ ] **Step 1: Run all copilot addon tests**

```bash
cd addons/terminus-copilot && pnpm test:run
```

Expected: all tests PASS

- [ ] **Step 2: Build and deploy terminus-copilot addon**

```bash
cd main && bin/deploy-addons-ssh.sh
```

Then on device (via SSH):
```bash
ha store reload && ha apps update local_terminus_copilot
```

- [ ] **Step 3: Build terminus panel**

```bash
cd terminus && pnpm build
cd .. && bin/deploy-www-ssh.sh
```

- [ ] **Step 4: Verify with terminus-agent stopped**

Stop terminus-agent on the laptop (Ctrl+C the `pnpm dev` process), then open the Terminus panel in HA.

Expected:
- Amber badge appears: "Terminus Agent offline — using fallback model"
- Sending a message in Copilot chat gets a real response (from Haiku fallback)
- No silent failure

- [ ] **Step 5: Verify with terminus-agent running**

Start terminus-agent (`pnpm dev` in `terminus-agent/`), wait ~30 s for health poll.

Expected:
- Amber badge disappears
- Messages route to terminus-agent (check agent logs for incoming requests)
