# Terminus Agent — HA Config CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a Home Assistant user create / edit / delete automations, scenes, and scripts by talking to the laptop-hosted Terminus agent, via HA's Config API.

**Architecture:** Two phases. **Phase A** upgrades `@terminus/agent` from pre-1.0 LangChain to 1.x (`createReactAgent` → `createAgent`), as the foundation. **Phase B** adds six tools (`ha_read_manifest` kept + four `ha_config_*` CRUD + `ha_automation_set_enabled`) that wrap HA's Config API (`/api/config/<domain>/config/<id>`) over Tailscale. HA owns validation; the agent uses a prompt-driven soft gate before destructive writes and clones-into-runtime when asked to edit a packages-managed automation.

**Tech Stack:** TypeScript, Express, LangChain 1.x (`langchain` `createAgent` + `@langchain/anthropic` + `@langchain/langgraph` + `@langchain/core` `tool()`), zod, vitest, pnpm. Spec: `docs/superpowers/specs/2026-06-09-agent-ha-crud-design.md`.

**Working dir for all commands:** `/Users/zrmn/Documents/home-assistant/main/terminus` (the pnpm workspace root) unless stated otherwise. App lives in `apps/agent`.

---

## File Structure

| File | Responsibility | Phase |
|---|---|---|
| `apps/agent/vitest.config.ts` | vitest node-env config | A |
| `apps/agent/package.json` | dep bumps + `test`/`test:run` scripts | A |
| `apps/agent/src/agent.ts` | export `aguiToLangchain` for testing (otherwise unchanged) | A |
| `apps/agent/src/agent.test.ts` | regression test for AG-UI → LangChain message mapping | A |
| `apps/agent/src/graph.ts` | migrate to `createAgent`; drop `topP` hack; wire CRUD tools; expand prompt | A + B |
| `apps/agent/src/graph.test.ts` | `createGraph` returns a streamable agent | A |
| `apps/agent/src/lib/ha-client.ts` | `haFetch` REST helper (auth, timeout, error normalization) | B |
| `apps/agent/src/lib/ha-client.test.ts` | unit tests for `haFetch` | B |
| `apps/agent/src/tools/ha-config-api.ts` | the 5 CRUD/control tools | B |
| `apps/agent/src/tools/ha-config-api.test.ts` | unit tests for each tool (mocked `fetch`) | B |

Existing `apps/agent/src/tools/ha-manifest.ts`, `src/index.ts` are unchanged.

---

# Phase A — LangChain 1.x upgrade

## Task A1: Add vitest infra + AG-UI mapping regression test

Establish the test harness (needed by every later task) and lock the current AG-UI → LangChain message conversion with a test **before** the migration, so a regression is caught.

**Files:**
- Create: `apps/agent/vitest.config.ts`
- Modify: `apps/agent/package.json` (add dev dep + scripts)
- Modify: `apps/agent/src/agent.ts` (export `aguiToLangchain`)
- Test: `apps/agent/src/agent.test.ts`

- [ ] **Step 1: Add vitest config**

Create `apps/agent/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
```

- [ ] **Step 2: Add vitest dep + test scripts**

In `apps/agent/package.json`, add to `devDependencies`:

```json
"vitest": "^3"
```

And add to `scripts` (keep existing dev/build/start/typecheck):

```json
"test": "vitest",
"test:run": "vitest run"
```

Then install:

Run: `pnpm install`
Expected: completes; `vitest` resolves in `apps/agent`.

- [ ] **Step 3: Export the function under test**

In `apps/agent/src/agent.ts`, change the declaration of `aguiToLangchain` (currently `function aguiToLangchain(...)`) to be exported. The body is unchanged:

```typescript
export function aguiToLangchain(messages: AguiMessage[]): BaseMessage[] {
```

- [ ] **Step 4: Write the failing test**

Create `apps/agent/src/agent.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { HumanMessage, AIMessage, ToolMessage, SystemMessage } from "@langchain/core/messages"
import { aguiToLangchain } from "./agent.js"

describe("aguiToLangchain", () => {
  it("maps a user message to HumanMessage", () => {
    const out = aguiToLangchain([{ role: "user", content: "hi" }])
    expect(out).toHaveLength(1)
    expect(out[0]).toBeInstanceOf(HumanMessage)
    expect(out[0].content).toBe("hi")
  })

  it("maps an assistant tool call to AIMessage with tool_calls", () => {
    const out = aguiToLangchain([
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "tc1", function: { name: "ha_read_manifest", arguments: "{}" } }],
      },
    ])
    expect(out[0]).toBeInstanceOf(AIMessage)
    expect((out[0] as AIMessage).tool_calls).toEqual([
      { id: "tc1", name: "ha_read_manifest", args: {}, type: "tool_call" },
    ])
  })

  it("maps a tool result to ToolMessage", () => {
    const out = aguiToLangchain([{ role: "tool", content: "result", toolCallId: "tc1", name: "ha_read_manifest" }])
    expect(out[0]).toBeInstanceOf(ToolMessage)
    expect((out[0] as ToolMessage).tool_call_id).toBe("tc1")
  })

  it("maps system and developer roles to SystemMessage", () => {
    const out = aguiToLangchain([
      { role: "system", content: "sys" },
      { role: "developer", content: "dev" },
    ])
    expect(out[0]).toBeInstanceOf(SystemMessage)
    expect(out[1]).toBeInstanceOf(SystemMessage)
  })
})
```

- [ ] **Step 5: Run the test (should pass — it's a characterization test of existing code)**

Run: `pnpm --filter @terminus/agent test:run src/agent.test.ts`
Expected: 4 passing. (If it fails, the export in Step 3 is wrong — fix before continuing.)

- [ ] **Step 6: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/vitest.config.ts terminus/apps/agent/package.json terminus/apps/agent/src/agent.ts terminus/apps/agent/src/agent.test.ts terminus/pnpm-lock.yaml
git commit -m "test(agent): add vitest + AG-UI message mapping regression test"
```

---

## Task A2: Bump LangChain deps to 1.x

**Files:**
- Modify: `apps/agent/package.json` (dependencies)

- [ ] **Step 1: Update dependency versions**

In `apps/agent/package.json` `dependencies`, change the three langchain packages and add `langchain`:

```json
"@langchain/anthropic": "^1",
"@langchain/core": "^1",
"@langchain/langgraph": "^1",
"langchain": "^1",
```

(Leave `@terminus/manifest`, `express`, `js-yaml`, `uuid`, `zod` untouched.)

- [ ] **Step 2: Install**

Run: `pnpm install`
Expected: resolves `@langchain/core@1.x`, `@langchain/langgraph@1.x`, `@langchain/anthropic@1.x`, `langchain@1.x`.

- [ ] **Step 3: Typecheck (expected to FAIL on graph.ts)**

Run: `pnpm --filter @terminus/agent typecheck`
Expected: FAIL — errors in `src/graph.ts` referencing `createReactAgent` from `@langchain/langgraph/prebuilt` and/or `stateModifier`. (This is the migration surface; fixed in Task A3.) If `agent.ts` also errors on message imports, note them for A3.

- [ ] **Step 4: Commit the version bump**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/package.json terminus/pnpm-lock.yaml
git commit -m "chore(agent): bump langchain to 1.x"
```

---

## Task A3: Migrate `graph.ts` to `createAgent`, drop the topP hack

LangChain 1.x replaces the LangGraph `createReactAgent` prebuilt with `createAgent` from the `langchain` package. `systemPrompt` replaces `stateModifier`. The `topP` workaround existed only for the `@langchain/anthropic@0.3.34` sonnet-4-6 null-guard bug — removed here and proven gone by the live smoke in Task A4.

**Files:**
- Modify: `apps/agent/src/graph.ts` (full rewrite of the construction)
- Test: `apps/agent/src/graph.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/agent/src/graph.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { createGraph } from "./graph.js"

describe("createGraph", () => {
  it("returns an agent exposing streamEvents (LangGraph-compiled)", () => {
    const agent = createGraph("test-api-key")
    expect(typeof agent.streamEvents).toBe("function")
    expect(typeof agent.invoke).toBe("function")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/graph.test.ts`
Expected: FAIL — compile error (`createReactAgent`/`stateModifier`) or `streamEvents` undefined.

- [ ] **Step 3: Rewrite `graph.ts`**

Replace the entire contents of `apps/agent/src/graph.ts` with:

```typescript
import { ChatAnthropic } from "@langchain/anthropic"
import { createAgent } from "langchain"
import { haManifestTools } from "./tools/ha-manifest.js"

const SYSTEM_PROMPT = `You are Terminus, a Home Assistant configuration expert and smart home automation agent.

You have access to:
- Config manifest (ha_read_manifest) — all automations with full YAML, scenes, entities, source file+line

Use ha_read_manifest to understand what exists and how it's structured before answering questions or proposing changes.

Be concise and precise.`

export function createGraph(apiKey: string) {
  const model = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    apiKey,
    streaming: true,
  })

  const tools = [...haManifestTools]

  return createAgent({
    model,
    tools,
    systemPrompt: SYSTEM_PROMPT,
  })
}
```

(The `topP` hack and the `createReactAgent` import are gone. The CRUD tools and prompt expansion are added in Task B7 — keep the prompt and tool list as above for now.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/graph.test.ts`
Expected: PASS.

- [ ] **Step 5: Full typecheck + test suite**

Run: `pnpm --filter @terminus/agent typecheck && pnpm --filter @terminus/agent test:run`
Expected: typecheck clean; all tests pass. If `agent.ts` errors on `graph.streamEvents(...)` typing, change the `graph` param type in `handleAgentRequest` to `any` (it is already `any` per the existing eslint-disable) — no change needed if so.

- [ ] **Step 6: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/graph.ts terminus/apps/agent/src/graph.test.ts
git commit -m "refactor(agent): migrate to langchain 1.x createAgent, drop topP hack"
```

---

## Task A4: Live streaming smoke (manual checkpoint)

The AG-UI SSE bridge in `agent.ts` consumes `streamEvents({version:"v2"})`. Core event names (`on_chat_model_stream`, `on_chat_model_end`, `on_tool_end`, `on_tool_error`) are stable across the core bump, but `createAgent`'s internal node names (used by the `STEP_STARTED`/`STEP_FINISHED` filter `name !== "LangGraph"`) may differ from the old prebuilt. This task proves text + tool streaming still works against a real model.

**Files:** none (verification only). Requires `apps/agent/.env` populated (`ANTHROPIC_API_KEY`, `HASS_SERVER`, `HASS_TOKEN`, `REPO_ROOT`).

- [ ] **Step 1: Start the agent**

Run (in `apps/agent`): `pnpm dev`
Expected: logs `terminus-agent listening on :3001`.

- [ ] **Step 2: Send a text-only request and watch the stream**

In a second terminal:

```bash
curl -N -s http://localhost:3001/ \
  -H "Content-Type: application/json" \
  -d '{"threadId":"t1","runId":"r1","messages":[{"role":"user","content":"Say hello in five words."}]}'
```

Expected SSE frames, in order: `RUN_STARTED` → one or more `TEXT_MESSAGE_START` / `TEXT_MESSAGE_CONTENT` / `TEXT_MESSAGE_END` → `RUN_FINISHED`. No `RUN_ERROR`. (A `top_p: -1` regression would surface here as an Anthropic 400 inside `RUN_ERROR` — its absence confirms the hack was safe to remove.)

- [ ] **Step 3: Send a tool-using request**

```bash
curl -N -s http://localhost:3001/ \
  -H "Content-Type: application/json" \
  -d '{"threadId":"t2","runId":"r2","messages":[{"role":"user","content":"List the automations you can see in the manifest."}]}'
```

Expected: a `TOOL_CALL_START` with `toolCallName:"ha_read_manifest"`, then `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`, followed by `TEXT_MESSAGE_*` and `RUN_FINISHED`.

- [ ] **Step 4: Decision — STEP event names**

If `STEP_STARTED`/`STEP_FINISHED` frames are absent or noisy (because `createAgent`'s node name is now `"LangGraph"` or differs), it does NOT break the UI (those events are advisory). Leave `agent.ts` as-is unless the Copilot panel visibly misbehaves. If it does, note the actual `name` values seen in the stream and adjust the filter in `agent.ts:117-119` accordingly in a follow-up commit. Record the observation here:

```
Observed chain node name(s): __________________
Action taken: none / adjusted filter
```

- [ ] **Step 5: Stop the dev server** (Ctrl-C). No commit (verification only).

---

# Phase B — HA Config CRUD

## Task B1: `lib/ha-client.ts` — the `haFetch` REST helper

One place for HA REST plumbing: base URL, bearer auth, JSON, 10s timeout, and error normalization so tools can return readable errors instead of throwing.

**Files:**
- Create: `apps/agent/src/lib/ha-client.ts`
- Test: `apps/agent/src/lib/ha-client.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `apps/agent/src/lib/ha-client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { haFetch } from "./ha-client.js"

const ORIG = { ...process.env }

beforeEach(() => {
  process.env.HASS_SERVER = "https://ha.test"
  process.env.HASS_TOKEN = "tok"
})
afterEach(() => {
  vi.unstubAllGlobals()
  process.env = { ...ORIG }
})

describe("haFetch", () => {
  it("sends bearer auth + JSON headers to the right URL and parses JSON", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ result: "ok" }), { status: 200 }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const res = await haFetch("/api/states")

    expect(res).toEqual({ ok: true, status: 200, data: { result: "ok" } })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://ha.test/api/states")
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok")
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json")
  })

  it("returns ok:false with status + body on non-2xx", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad config", { status: 400 })))
    const res = await haFetch("/api/config/automation/config/1", { method: "POST", body: "{}" })
    expect(res).toEqual({ ok: false, status: 400, error: "bad config" })
  })

  it("reports HA unreachable on abort/timeout", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      const e = new Error("aborted")
      e.name = "AbortError"
      throw e
    }))
    const res = await haFetch("/api/states")
    expect(res.ok).toBe(false)
    expect(res.error).toContain("unreachable")
  })

  it("returns ok:false when env is missing", async () => {
    delete process.env.HASS_TOKEN
    const res = await haFetch("/api/states")
    expect(res.ok).toBe(false)
    expect(res.error).toContain("HASS_")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/lib/ha-client.test.ts`
Expected: FAIL — `Cannot find module './ha-client.js'`.

- [ ] **Step 3: Implement `ha-client.ts`**

Create `apps/agent/src/lib/ha-client.ts`:

```typescript
export type HaFetchResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string }

const TIMEOUT_MS = 10_000

export async function haFetch(path: string, init: RequestInit = {}): Promise<HaFetchResult> {
  const server = process.env.HASS_SERVER
  const token = process.env.HASS_TOKEN
  if (!server || !token) {
    return { ok: false, status: 0, error: "HASS_SERVER/HASS_TOKEN not set" }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${server}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    })

    const text = await res.text()
    let data: unknown = text || null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // non-JSON body — keep raw text
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof data === "string" ? data : JSON.stringify(data),
      }
    }
    return { ok: true, status: res.status, data }
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError"
    const msg = aborted
      ? "HA unreachable (timeout)"
      : err instanceof Error
        ? `HA unreachable: ${err.message}`
        : "HA unreachable"
    return { ok: false, status: 0, error: msg }
  } finally {
    clearTimeout(timer)
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/lib/ha-client.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/lib/ha-client.ts terminus/apps/agent/src/lib/ha-client.test.ts
git commit -m "feat(agent): add haFetch HA REST client helper"
```

---

## Task B2: `ha_config_list` tool

Lists entities of a domain from `/api/states`, classifying automations against the manifest as `packages_managed`.

**Files:**
- Create: `apps/agent/src/tools/ha-config-api.ts`
- Test: `apps/agent/src/tools/ha-config-api.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/agent/src/tools/ha-config-api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("@terminus/manifest", () => ({
  buildManifest: async () => ({
    automations: { "111": { id: "111" } },
    nodes: [],
  }),
}))

import { haConfigTools } from "./ha-config-api.js"

const byName = (n: string) => haConfigTools.find((t) => t.name === n)!
const ORIG = { ...process.env }

beforeEach(() => {
  process.env.HASS_SERVER = "https://ha.test"
  process.env.HASS_TOKEN = "tok"
  process.env.REPO_ROOT = "/tmp/repo"
})
afterEach(() => {
  vi.unstubAllGlobals()
  process.env = { ...ORIG }
})

describe("ha_config_list", () => {
  it("filters by domain and flags packages-managed automations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            { entity_id: "automation.yard", state: "on", attributes: { id: "111", friendly_name: "Yard" } },
            { entity_id: "automation.dim", state: "on", attributes: { id: "222", friendly_name: "Dim" } },
            { entity_id: "light.lr_lamp", state: "off", attributes: {} },
          ]),
          { status: 200 },
        ),
      ),
    )

    const out = JSON.parse(await byName("ha_config_list").invoke({ domain: "automation" }))
    expect(out).toHaveLength(2)
    expect(out.find((r: any) => r.id === "111").packages_managed).toBe(true)
    expect(out.find((r: any) => r.id === "222").packages_managed).toBe(false)
  })

  it("uses object_id as id for scripts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            { entity_id: "script.good_morning", state: "off", attributes: { friendly_name: "Good Morning" } },
          ]),
          { status: 200 },
        ),
      ),
    )
    const out = JSON.parse(await byName("ha_config_list").invoke({ domain: "script" }))
    expect(out[0].id).toBe("good_morning")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: FAIL — `Cannot find module './ha-config-api.js'`.

- [ ] **Step 3: Implement the file with the list tool**

Create `apps/agent/src/tools/ha-config-api.ts`:

```typescript
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { join } from "node:path"
import { buildManifest } from "@terminus/manifest"
import { haFetch } from "../lib/ha-client.js"

const DOMAINS = ["automation", "scene", "script"] as const
const domainSchema = z.enum(DOMAINS)
type Domain = (typeof DOMAINS)[number]

function repoRoot(): string {
  return process.env.REPO_ROOT ?? join(process.cwd(), "..")
}

type HaState = { entity_id: string; state: string; attributes: Record<string, unknown> }

async function packageAutomationIds(): Promise<Set<string>> {
  try {
    const manifest = await buildManifest(repoRoot())
    return new Set(Object.values(manifest.automations).map((a) => String(a.id)))
  } catch {
    return new Set()
  }
}

const list = tool(
  async ({ domain }: { domain: Domain }) => {
    const res = await haFetch("/api/states")
    if (!res.ok) return JSON.stringify({ error: res.error, status: res.status })

    const states = res.data as HaState[]
    const prefix = `${domain}.`
    // packages_managed is reliable only for automations (manifest covers automation ids).
    // For scene/script it is best-effort false; a get/delete 404 is the authoritative signal.
    const pkgIds = domain === "automation" ? await packageAutomationIds() : new Set<string>()

    const rows = states
      .filter((s) => s.entity_id.startsWith(prefix))
      .map((s) => {
        const objectId = s.entity_id.slice(prefix.length)
        const id = domain === "script" ? objectId : (s.attributes.id as string | undefined) ?? null
        return {
          entity_id: s.entity_id,
          friendly_name: (s.attributes.friendly_name as string | undefined) ?? null,
          id,
          state: s.state,
          packages_managed: id != null && pkgIds.has(String(id)),
        }
      })

    return JSON.stringify(rows, null, 2)
  },
  {
    name: "ha_config_list",
    description:
      "List automations, scenes, or scripts currently in Home Assistant. Returns entity_id, friendly_name, id, state, and packages_managed (true = hand-authored in the repo and NOT editable via these tools). For scripts, id is the object_id (slug after 'script.'). Call this to resolve an id before get/upsert/delete.",
    schema: z.object({ domain: domainSchema }),
  },
)

export const haConfigTools = [list]
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/tools/ha-config-api.ts terminus/apps/agent/src/tools/ha-config-api.test.ts
git commit -m "feat(agent): add ha_config_list tool"
```

---

## Task B3: `ha_config_get` tool

Reads one entity's editable config. A 404 means "not editable" (packages-managed or absent).

**Files:**
- Modify: `apps/agent/src/tools/ha-config-api.ts`
- Test: `apps/agent/src/tools/ha-config-api.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `apps/agent/src/tools/ha-config-api.test.ts`:

```typescript
describe("ha_config_get", () => {
  it("returns the config JSON on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ alias: "Yard", trigger: [] }), { status: 200 })),
    )
    const out = JSON.parse(await byName("ha_config_get").invoke({ domain: "automation", id: "222" }))
    expect(out.alias).toBe("Yard")
  })

  it("maps 404 to a not-editable message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Not found", { status: 404 })))
    const out = JSON.parse(await byName("ha_config_get").invoke({ domain: "automation", id: "999" }))
    expect(out.status).toBe(404)
    expect(out.error).toContain("not editable")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: FAIL — `byName("ha_config_get")` is undefined (tool not registered yet).

- [ ] **Step 3: Add the `get` tool**

In `apps/agent/src/tools/ha-config-api.ts`, add before the `export` line:

```typescript
const get = tool(
  async ({ domain, id }: { domain: Domain; id: string }) => {
    const res = await haFetch(`/api/config/${domain}/config/${encodeURIComponent(id)}`)
    if (!res.ok) {
      if (res.status === 404) {
        return JSON.stringify({
          error: "not editable / not found — likely packages-managed; check ha_read_manifest",
          status: 404,
        })
      }
      return JSON.stringify({ error: res.error, status: res.status })
    }
    return JSON.stringify(res.data, null, 2)
  },
  {
    name: "ha_config_get",
    description:
      "Read the editable config of one automation, scene, or script by id (for scripts, id is the object_id). Returns the full config object. A 404 means the entity is not editable via these tools (hand-authored in the repo) — do not retry; treat it as packages-managed.",
    schema: z.object({ domain: domainSchema, id: z.string() }),
  },
)
```

And update the export:

```typescript
export const haConfigTools = [list, get]
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: PASS (4 tests total).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/tools/ha-config-api.ts terminus/apps/agent/src/tools/ha-config-api.test.ts
git commit -m "feat(agent): add ha_config_get tool"
```

---

## Task B4: `ha_config_upsert` tool

Creates (id omitted → generated) or overwrites an entity. Passes the config through to HA, which validates (400 surfaced verbatim) and auto-reloads.

**Files:**
- Modify: `apps/agent/src/tools/ha-config-api.ts`
- Test: `apps/agent/src/tools/ha-config-api.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `apps/agent/src/tools/ha-config-api.test.ts`:

```typescript
describe("ha_config_upsert", () => {
  it("POSTs to the supplied id and reports ok", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({
        domain: "automation",
        id: "222",
        config: { alias: "Yard", trigger: [], action: [] },
      }),
    )
    expect(out.result).toBe("ok")
    expect(out.id).toBe("222")
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://ha.test/api/config/automation/config/222")
    expect(init.method).toBe("POST")
    expect(JSON.parse(init.body as string)).toEqual({ alias: "Yard", trigger: [], action: [] })
  })

  it("generates an id when none is supplied and returns it", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({ domain: "automation", config: { alias: "New" } }),
    )
    expect(out.id).toMatch(/^\d+$/)
    expect((fetchMock.mock.calls[0][0] as string)).toContain(`/config/${out.id}`)
  })

  it("surfaces a 400 validation body for the model to fix", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("invalid trigger platform", { status: 400 })))
    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({ domain: "automation", id: "1", config: {} }),
    )
    expect(out.status).toBe(400)
    expect(out.error).toContain("invalid trigger")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: FAIL — `ha_config_upsert` undefined.

- [ ] **Step 3: Add the `upsert` tool**

In `apps/agent/src/tools/ha-config-api.ts`, add before the `export` line:

```typescript
const upsert = tool(
  async ({ domain, id, config }: { domain: Domain; id?: string; config: Record<string, unknown> }) => {
    const finalId = id ?? String(Date.now())
    const res = await haFetch(`/api/config/${domain}/config/${encodeURIComponent(finalId)}`, {
      method: "POST",
      body: JSON.stringify(config),
    })
    if (!res.ok) {
      return JSON.stringify({
        error: res.error,
        status: res.status,
        ...(res.status === 400 ? { hint: "Home Assistant rejected the config — fix it and retry." } : {}),
      })
    }
    return JSON.stringify({ result: "ok", id: finalId, domain })
  },
  {
    name: "ha_config_upsert",
    description:
      "Create or overwrite an automation, scene, or script. Omit id to create (a fresh id is generated and returned); pass an existing id to overwrite. For scripts, id is the object_id (a slug). config is the full Home Assistant config object for that domain (e.g. an automation's alias/trigger/condition/action/mode). Home Assistant validates it; a 400 returns the validation error to fix. The change auto-reloads. NEVER overwrite an entity whose packages_managed is true. Before overwriting an existing entity, show the user the config and get confirmation.",
    schema: z.object({
      domain: domainSchema,
      id: z.string().optional(),
      config: z.record(z.any()),
    }),
  },
)
```

Update the export:

```typescript
export const haConfigTools = [list, get, upsert]
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: PASS (7 tests total).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/tools/ha-config-api.ts terminus/apps/agent/src/tools/ha-config-api.test.ts
git commit -m "feat(agent): add ha_config_upsert tool"
```

---

## Task B5: `ha_config_delete` tool

**Files:**
- Modify: `apps/agent/src/tools/ha-config-api.ts`
- Test: `apps/agent/src/tools/ha-config-api.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `apps/agent/src/tools/ha-config-api.test.ts`:

```typescript
describe("ha_config_delete", () => {
  it("DELETEs the id and reports ok", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const out = JSON.parse(await byName("ha_config_delete").invoke({ domain: "automation", id: "222" }))
    expect(out.result).toBe("ok")
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE")
  })

  it("maps 404 to a not-editable message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Not found", { status: 404 })))
    const out = JSON.parse(await byName("ha_config_delete").invoke({ domain: "automation", id: "999" }))
    expect(out.status).toBe(404)
    expect(out.error).toContain("not editable")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: FAIL — `ha_config_delete` undefined.

- [ ] **Step 3: Add the `del` tool**

In `apps/agent/src/tools/ha-config-api.ts`, add before the `export` line:

```typescript
const del = tool(
  async ({ domain, id }: { domain: Domain; id: string }) => {
    const res = await haFetch(`/api/config/${domain}/config/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      if (res.status === 404) {
        return JSON.stringify({
          error: "not editable / not found — likely packages-managed",
          status: 404,
        })
      }
      return JSON.stringify({ error: res.error, status: res.status })
    }
    return JSON.stringify({ result: "ok", id, domain })
  },
  {
    name: "ha_config_delete",
    description:
      "Delete an automation, scene, or script by id (for scripts, id is the object_id). A 404 means it is not editable (packages-managed) — do not retry. The change auto-reloads. This is recoverable only via a Home Assistant backup, so confirm with the user before calling.",
    schema: z.object({ domain: domainSchema, id: z.string() }),
  },
)
```

Update the export:

```typescript
export const haConfigTools = [list, get, upsert, del]
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: PASS (9 tests total).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/tools/ha-config-api.ts terminus/apps/agent/src/tools/ha-config-api.test.ts
git commit -m "feat(agent): add ha_config_delete tool"
```

---

## Task B6: `ha_automation_set_enabled` tool

Toggles an automation at runtime — used by the clone flow to silence the original. Runtime-only; resets on reload/restart.

**Files:**
- Modify: `apps/agent/src/tools/ha-config-api.ts`
- Test: `apps/agent/src/tools/ha-config-api.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `apps/agent/src/tools/ha-config-api.test.ts`:

```typescript
describe("ha_automation_set_enabled", () => {
  it("calls turn_off when disabling and warns it is runtime-only", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([]), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const out = JSON.parse(
      await byName("ha_automation_set_enabled").invoke({ entity_id: "automation.lr_tv", enabled: false }),
    )
    expect(out.result).toBe("ok")
    expect(out.note).toContain("runtime-only")
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://ha.test/api/services/automation/turn_off")
    expect(JSON.parse(init.body as string)).toEqual({ entity_id: "automation.lr_tv" })
  })

  it("calls turn_on when enabling", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([]), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    await byName("ha_automation_set_enabled").invoke({ entity_id: "automation.lr_tv", enabled: true })
    expect(fetchMock.mock.calls[0][0]).toBe("https://ha.test/api/services/automation/turn_on")
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: FAIL — `ha_automation_set_enabled` undefined.

- [ ] **Step 3: Add the `setEnabled` tool**

In `apps/agent/src/tools/ha-config-api.ts`, add before the `export` line:

```typescript
const setEnabled = tool(
  async ({ entity_id, enabled }: { entity_id: string; enabled: boolean }) => {
    const service = enabled ? "turn_on" : "turn_off"
    const res = await haFetch(`/api/services/automation/${service}`, {
      method: "POST",
      body: JSON.stringify({ entity_id }),
    })
    if (!res.ok) return JSON.stringify({ error: res.error, status: res.status })
    return JSON.stringify({
      result: "ok",
      entity_id,
      enabled,
      note: "runtime-only — the automation re-enables on HA restart/reload",
    })
  },
  {
    name: "ha_automation_set_enabled",
    description:
      "Enable or disable an automation at runtime by entity_id (e.g. automation.lr_tv). Used to silence a packages-managed original after cloning it into a runtime copy. NOTE: this is runtime-only and resets on HA restart/reload — always warn the user that to make it permanent they must edit the package file in the repo by hand.",
    schema: z.object({ entity_id: z.string(), enabled: z.boolean() }),
  },
)
```

Update the export:

```typescript
export const haConfigTools = [list, get, upsert, del, setEnabled]
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @terminus/agent test:run src/tools/ha-config-api.test.ts`
Expected: PASS (11 tests total).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/tools/ha-config-api.ts terminus/apps/agent/src/tools/ha-config-api.test.ts
git commit -m "feat(agent): add ha_automation_set_enabled tool"
```

---

## Task B7: Wire CRUD tools into the graph + expand the system prompt

Bind the five new tools and teach the agent the boundary rules, the soft gate, and the clone flow.

**Files:**
- Modify: `apps/agent/src/graph.ts`
- Test: `apps/agent/src/graph.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `apps/agent/src/graph.test.ts`:

```typescript
import { haConfigTools } from "./tools/ha-config-api.js"
import { haManifestTools } from "./tools/ha-manifest.js"

describe("createGraph tool wiring", () => {
  it("binds the manifest + config tools", () => {
    // createAgent does not expose tools directly; assert the source arrays are non-empty
    // and named as expected so a regression in imports is caught.
    const names = [...haManifestTools, ...haConfigTools].map((t) => t.name)
    expect(names).toEqual(
      expect.arrayContaining([
        "ha_read_manifest",
        "ha_config_list",
        "ha_config_get",
        "ha_config_upsert",
        "ha_config_delete",
        "ha_automation_set_enabled",
      ]),
    )
    expect(names).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Run the guard test**

Run: `pnpm --filter @terminus/agent test:run src/graph.test.ts`
Expected: PASS — this test imports the tool arrays directly, so once B2–B6 are done it is green. It is a regression guard against a missing import/export or a renamed tool (e.g. a tool dropped from `haConfigTools`), not a red-first test. The actual work of this task is wiring those tools into `createGraph` and expanding the prompt (Step 3); the graph itself is exercised by the B8 live smoke. If this test is RED here, a tool name/export is wrong — fix it before proceeding.

- [ ] **Step 3: Wire tools + expand the prompt**

Replace the contents of `apps/agent/src/graph.ts` with:

```typescript
import { ChatAnthropic } from "@langchain/anthropic"
import { createAgent } from "langchain"
import { haManifestTools } from "./tools/ha-manifest.js"
import { haConfigTools } from "./tools/ha-config-api.js"

const SYSTEM_PROMPT = `You are Terminus, a Home Assistant configuration expert and smart home automation agent for a household in Costa Rica.

You can read the repo config and create/edit/delete runtime automations, scenes, and scripts in Home Assistant.

TOOLS
- ha_read_manifest — all repo (packages/) automations with full YAML, scenes, entities, source file+line. Read-only. Use it to understand existing infra before proposing changes.
- ha_config_list(domain) — list live automations/scenes/scripts. Each row has packages_managed.
- ha_config_get(domain, id) — read one editable config. A 404 means it is NOT editable.
- ha_config_upsert(domain, id?, config) — create (omit id) or overwrite. HA validates; auto-reloads.
- ha_config_delete(domain, id) — delete. Auto-reloads. Recoverable only via HA backup.
- ha_automation_set_enabled(entity_id, enabled) — runtime enable/disable; resets on restart.

BOUNDARIES
- You may only create/edit/delete RUNTIME entities (those the Config API owns). You CANNOT edit anything where packages_managed is true — those are hand-authored in the git repo. The Config API physically returns 404 for them.
- Before any overwrite or delete, state exactly what will change, show the config (YAML), and ask the user to confirm. Wait for confirmation before calling the tool. Pure creation of a new entity does not need confirmation.

EDITING A PACKAGES-MANAGED AUTOMATION (clone flow)
If the user asks to change an automation whose packages_managed is true:
1. Explain it is hand-authored in the repo and cannot be edited in place.
2. Offer to create a RUNTIME COPY with the requested change. Show the proposed config and ask to confirm.
3. On confirmation: call ha_config_upsert WITHOUT an id and WITHOUT the original 'id' field in the config (so a fresh id is assigned), then call ha_automation_set_enabled on the ORIGINAL entity_id with enabled=false so both do not fire.
4. Warn the user: the original re-enables on HA restart/reload; to remove it permanently they must edit the package file in the repo by hand.

Be concise and precise.`

export function createGraph(apiKey: string) {
  const model = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    apiKey,
    streaming: true,
  })

  const tools = [...haManifestTools, ...haConfigTools]

  return createAgent({
    model,
    tools,
    systemPrompt: SYSTEM_PROMPT,
  })
}
```

- [ ] **Step 4: Run the full suite + typecheck**

Run: `pnpm --filter @terminus/agent typecheck && pnpm --filter @terminus/agent test:run`
Expected: typecheck clean; all tests pass (agent + graph + ha-client + ha-config-api).

- [ ] **Step 5: Commit**

```bash
cd /Users/zrmn/Documents/home-assistant/main
git add terminus/apps/agent/src/graph.ts terminus/apps/agent/src/graph.test.ts
git commit -m "feat(agent): wire HA config CRUD tools + boundary/clone prompt"
```

---

## Task B8: Live end-to-end smoke (manual checkpoint)

Drive a real create → edit → clone → delete against the live HA on the laptop. This is the only check that exercises the actual Config API + auto-reload, which the unit tests mock.

**Files:** none. Requires `apps/agent/.env` populated and the laptop on the Tailnet.

- [ ] **Step 1: Start the agent**

Run (in `apps/agent`): `pnpm dev`
Expected: `terminus-agent listening on :3001`.

- [ ] **Step 2: Create**

```bash
curl -N -s http://localhost:3001/ -H "Content-Type: application/json" -d '{
  "threadId":"smoke","runId":"c1",
  "messages":[{"role":"user","content":"Create a test automation called TERMINUS SMOKE TEST that turns off light.lr_lamp every day at 03:04."}]
}'
```

Expected: a `ha_config_upsert` TOOL_CALL with `domain:"automation"` and no id, a `TOOL_CALL_RESULT` containing `"result":"ok"` and a generated `id`, then a text confirmation. Verify in HA:

Run: `hass-cli state list | grep -i "smoke"`
Expected: an `automation.terminus_smoke_test` (or similar) entity exists.

- [ ] **Step 3: Edit (gated)**

Send a follow-up in the same thread asking to change the time to 03:05, including the prior assistant/tool messages so the agent has context (or simply re-list). Confirm when the agent asks. Expected: `ha_config_get` then a gated `ha_config_upsert` reusing the same id; HA shows the updated trigger time.

- [ ] **Step 4: Clone (packages-managed path)**

```bash
curl -N -s http://localhost:3001/ -H "Content-Type: application/json" -d '{
  "threadId":"smoke2","runId":"cl1",
  "messages":[{"role":"user","content":"Edit the living room TV automation to also turn on the lamp."}]
}'
```

Expected: the agent identifies the packages-managed automation, declines in-place edit, and offers a clone (does NOT silently fail). It should NOT have created anything yet (it waits for confirmation).

- [ ] **Step 5: Delete (gated)**

```bash
curl -N -s http://localhost:3001/ -H "Content-Type: application/json" -d '{
  "threadId":"smoke3","runId":"d1",
  "messages":[{"role":"user","content":"Delete the TERMINUS SMOKE TEST automation. Yes, I confirm."}]
}'
```

Expected: `ha_config_list` to resolve the id, then `ha_config_delete`, `"result":"ok"`. Verify removal:

Run: `hass-cli state list | grep -i "smoke"`
Expected: no `terminus_smoke_test` entity.

- [ ] **Step 6: Record results + clean up**

Confirm no `TERMINUS SMOKE TEST` leftovers remain in HA. Stop the dev server (Ctrl-C). No commit (verification only). If any step failed, file the gap and return to the relevant task.

---

## Final verification

- [ ] Run the whole suite once more: `pnpm --filter @terminus/agent typecheck && pnpm --filter @terminus/agent test:run` → all green.
- [ ] `git log --oneline` shows the Phase A and Phase B commits in order.
- [ ] Spec requirements cross-checked (see Self-Review below). Deploying the agent to run persistently and packaging it as an in-HA add-on are explicitly out of scope (laptop dev) per the spec.
