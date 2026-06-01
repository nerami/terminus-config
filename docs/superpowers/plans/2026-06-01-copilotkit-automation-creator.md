# CopilotKit Automation Creator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a Terminus user describe an automation in plain English and have it write a validated, sanity-checked entry into `automations.yaml`, live via HA REST.

**Architecture:** New HA local add-on `addons/terminus-copilot/` hosts a Node Express + `@copilotkit/runtime` + `AnthropicAdapter` endpoint at `/api/copilotkit`, exposed via HA Ingress. Terminus React panel adds `<CopilotKit>` + `<CopilotSidebar>` and three CopilotKit tools (`get_entity_state`, `propose_automation`, `commit_automation`). The browser writes the final YAML via HA REST under the user's existing auth — the runtime never touches HA's REST. Grounding is hybrid: catalog (entity_ids, areas, scenes, scripts, aliases) is preloaded via `useCopilotReadable`; live state is fetched on demand via `get_entity_state`.

**Tech Stack:** Add-on: Node 22-alpine, Express, `@copilotkit/runtime`, `@anthropic-ai/sdk`, `js-yaml`, `typescript`, `vitest`. Frontend (existing): React 19, Vite 8, Tailwind 4, shadcn, vitest + happy-dom + `@testing-library/react`. Frontend adds: `@copilotkit/react-core`, `@copilotkit/react-ui`, `js-yaml`.

**Spec:** `docs/superpowers/specs/2026-06-01-copilotkit-automation-creator-design.md`

**Repo layout note:** This repo is a bare worktree setup. All paths below are relative to the `main/` worktree root (which is the HA config root the existing CLAUDE.md describes).

---

## File Map

### New: `addons/terminus-copilot/`

| File | Responsibility |
|---|---|
| `config.yaml` | HA add-on manifest. Declares ingress on port 3000, options schema for `anthropic_api_key`. |
| `Dockerfile` | Multi-stage `node:22-alpine` build. Installs deps, copies compiled JS, runs `node dist/server.js`. |
| `package.json` | Deps: `express`, `@copilotkit/runtime`, `@anthropic-ai/sdk`. Dev deps: `typescript`, `vitest`, `@types/express`, `@types/node`. Scripts: `build`, `dev`, `test`, `test:run`. |
| `pnpm-workspace.yaml` | Stub so pnpm treats the add-on as its own workspace (separate from `terminus/`). |
| `tsconfig.json` | NodeNext modules, `strict`, `outDir: dist`. |
| `src/runtime.ts` | Exports `buildRuntime({apiKey})` → returns Express handler at base path `/`. Wires `AnthropicAdapter` with `claude-haiku-4-5` and `promptCaching.enabled: true`. |
| `src/runtime.test.ts` | Smoke test: builds runtime with fake key (Anthropic SDK mocked), asserts handler is a function. |
| `src/server.ts` | Express app boot. Mounts `/api/copilotkit`. Health route `GET /health` returns `{ok:true}`. Reads `ANTHROPIC_API_KEY` from env. |
| `src/server.test.ts` | Spawns app on ephemeral port, hits `/health`, asserts 200 + `{ok:true}`. |
| `README.md` | Install + config instructions (HA Settings → Add-ons → "Local add-ons" → paste API key). |

### New: `terminus/src/lib/`

| File | Responsibility |
|---|---|
| `automationWriter.ts` | Pure module. Exports `validate(yamlObj, registry)`, `serialize(yamlObj)`, `commit(yamlObj, registry, fetchImpl?)` → `{ok, id?, error?}`. Handles slug+hash id, id-conflict precheck, entity_id validation, YAML serialize, POST, reload. |
| `automationWriter.test.ts` | Validation, slug deterministic, id_conflict precheck, fetch mock for write+reload, error branches. |
| `copilot.tsx` | Exports `<CopilotProvider>` wrapping `<CopilotKit runtimeUrl=…>`. Resolves runtime URL from `window.location.pathname` (HA ingress prefix); dev fallback to `VITE_COPILOT_RUNTIME_URL` or `http://localhost:3000/api/copilotkit`. |
| `copilot.test.tsx` | URL resolver unit tests: ingress prefix parsed; dev fallback; renders children. |

### New: `terminus/src/copilot/`

| File | Responsibility |
|---|---|
| `readable.tsx` | `<CopilotCatalog>` component that calls `useCopilotReadable` with the catalog object (areas, entity_ids, scenes, scripts, alias glossary, current time, user location). Pulls from manifest + registry context. |
| `readable.test.tsx` | Renders component inside fixture providers, asserts the readable payload shape. |
| `actions.tsx` | `<CopilotActions>` component that registers the three `useCopilotAction` hooks. `propose_automation` declares a custom `render` pointing at `<PreviewCard>`. |
| `actions.test.tsx` | Each tool: schema validates, handler returns expected shape. Uses CopilotKit testing utilities or invokes handlers directly. |
| `PreviewCard.tsx` | Renders proposed YAML in `<pre>`, Approve + Reject buttons. Calls back into the tool result. |
| `PreviewCard.test.tsx` | Renders with sample proposal, Approve fires `{approved:true}`, Reject fires `{approved:false}`. |

### Modified: `terminus/`

| File | Change |
|---|---|
| `package.json` | Add deps: `@copilotkit/react-core`, `@copilotkit/react-ui`, `js-yaml`. Dev dep: `@types/js-yaml`. |
| `src/App.tsx` | Wrap `<Shell>` in `<CopilotProvider>` → `<RegistryProvider>` → `<CopilotCatalog>` + `<CopilotActions>`. Mount `<CopilotSidebar>` inside the shell. |
| `src/main.tsx` | Inject CopilotKit CSS into shadow root the same way Tailwind's `style.css` is injected. |

---

## Conventions for every task

- Commit at end of every task using Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`). Subject ≤72 chars. Use heredoc `git commit -m "$(cat <<'EOF' … EOF)"`. Include `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer when an agent did the work.
- Run from the `main/` worktree root unless a step says otherwise.
- Use `pnpm` for both subprojects — never `npm` / `yarn`. The terminus subproject is pnpm-locked; the add-on subproject will be too.
- After each frontend change, run `pnpm --filter terminus test:run` (or `pnpm test:run` from `terminus/`) — must stay green.
- After each add-on change, run `pnpm test:run` from `addons/terminus-copilot/`.
- TDD: write failing test, watch it fail with the expected message, write minimal code, watch it pass, commit.

---

## Task 1: Scaffold add-on directory

**Files:**
- Create: `addons/terminus-copilot/config.yaml`
- Create: `addons/terminus-copilot/Dockerfile`
- Create: `addons/terminus-copilot/package.json`
- Create: `addons/terminus-copilot/pnpm-workspace.yaml`
- Create: `addons/terminus-copilot/tsconfig.json`
- Create: `addons/terminus-copilot/.gitignore`
- Create: `addons/terminus-copilot/.dockerignore`

- [ ] **Step 1: Create directory.**

```bash
mkdir -p addons/terminus-copilot/src
```

- [ ] **Step 2: Write `addons/terminus-copilot/config.yaml`.**

```yaml
name: Terminus Copilot
version: "0.1.0"
slug: terminus_copilot
description: CopilotKit runtime for natural-language automation creation in Terminus.
arch:
  - aarch64
  - amd64
init: false
ingress: true
ingress_port: 3000
panel_icon: mdi:robot
options:
  anthropic_api_key: ""
schema:
  anthropic_api_key: password
```

- [ ] **Step 3: Write `addons/terminus-copilot/Dockerfile`.**

```dockerfile
ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:latest
FROM ${BUILD_FROM} AS base

RUN apk add --no-cache nodejs npm \
 && npm install -g pnpm@9

WORKDIR /app
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY src ./src
RUN pnpm build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

- [ ] **Step 4: Write `addons/terminus-copilot/package.json`.**

```json
{
  "name": "terminus-copilot-addon",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsx src/server.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.0",
    "@copilotkit/runtime": "^1.10.0",
    "express": "^5.0.0",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^24.0.0",
    "@types/supertest": "^6.0.0",
    "supertest": "^7.0.0",
    "tsx": "^4.19.0",
    "typescript": "~5.6.0",
    "vitest": "^4.1.7"
  }
}
```

- [ ] **Step 5: Write `addons/terminus-copilot/pnpm-workspace.yaml`.**

```yaml
packages: []
```

(Empty workspace declaration — keeps this dir from joining `terminus/`'s workspace if pnpm walks up.)

- [ ] **Step 6: Write `addons/terminus-copilot/tsconfig.json`.**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] **Step 7: Write `addons/terminus-copilot/.gitignore`.**

```
node_modules/
dist/
*.log
```

- [ ] **Step 8: Write `addons/terminus-copilot/.dockerignore`.**

```
node_modules
dist
*.test.ts
**/__tests__
.git
.gitignore
README.md
```

- [ ] **Step 9: Install deps to produce lockfile.**

```bash
cd addons/terminus-copilot && pnpm install
```

Expected: `pnpm-lock.yaml` written, `node_modules/` populated. If `@copilotkit/runtime` version drifted, take whatever current major is and update `package.json` to match. Re-run install. Verify `pnpm typecheck` exits 0 (no source yet, so it's a no-op).

- [ ] **Step 10: Commit.**

```bash
git add addons/terminus-copilot/
git commit -m "$(cat <<'EOF'
feat(terminus-copilot): scaffold HA add-on for CopilotKit runtime

Empty Node 22-alpine container with Express + @copilotkit/runtime +
Anthropic SDK; no source yet. Add-on exposes ingress port 3000;
ANTHROPIC_API_KEY sourced from add-on options.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add-on runtime builder (TDD)

**Files:**
- Create: `addons/terminus-copilot/src/runtime.ts`
- Create: `addons/terminus-copilot/src/runtime.test.ts`

- [ ] **Step 1: Write failing test.**

```ts
// addons/terminus-copilot/src/runtime.test.ts
import { describe, expect, it, vi } from "vitest"

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ name: "fake-anthropic" })),
}))

import { buildRuntime } from "./runtime"

describe("buildRuntime", () => {
  it("returns an Express handler function when given an api key", () => {
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("throws when apiKey is empty", () => {
    expect(() => buildRuntime({ apiKey: "" })).toThrow(/api key/i)
  })
})
```

- [ ] **Step 2: Run test, watch it fail.**

```bash
cd addons/terminus-copilot && pnpm test:run src/runtime.test.ts
```

Expected: FAIL — `Cannot find module './runtime'`.

- [ ] **Step 3: Write minimal `addons/terminus-copilot/src/runtime.ts`.**

```ts
import Anthropic from "@anthropic-ai/sdk"
import { CopilotRuntime, AnthropicAdapter } from "@copilotkit/runtime"
import { createCopilotEndpointExpress } from "@copilotkit/runtime/express"
import type { RequestHandler } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export function buildRuntime({ apiKey }: RuntimeOptions): RequestHandler {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const anthropic = new Anthropic({ apiKey })
  const adapter = new AnthropicAdapter({
    anthropic,
    promptCaching: { enabled: true, debug: false },
  })
  const runtime = new CopilotRuntime({ intelligence: adapter })

  return createCopilotEndpointExpress({ runtime, basePath: "/" })
}
```

- [ ] **Step 4: Run test, watch it pass.**

```bash
cd addons/terminus-copilot && pnpm test:run src/runtime.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Verify typecheck.**

```bash
cd addons/terminus-copilot && pnpm typecheck
```

Expected: exit 0. If `createCopilotEndpointExpress` is exported under a different name in the installed `@copilotkit/runtime` version, swap to whatever the equivalent is (the patterns are: a runtime instance, an LLM adapter, and an Express-compatible handler). Update tests if the public signature changed.

- [ ] **Step 6: Commit.**

```bash
git add addons/terminus-copilot/src/
git commit -m "$(cat <<'EOF'
feat(terminus-copilot): buildRuntime wires AnthropicAdapter + CopilotRuntime

Returns an Express handler bound to AnthropicAdapter with prompt
caching enabled. Throws on missing API key.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add-on Express server (TDD)

**Files:**
- Create: `addons/terminus-copilot/src/server.ts`
- Create: `addons/terminus-copilot/src/server.test.ts`

- [ ] **Step 1: Write failing test.**

```ts
// addons/terminus-copilot/src/server.test.ts
import { describe, expect, it, vi } from "vitest"
import request from "supertest"

vi.mock("./runtime", () => ({
  buildRuntime: vi.fn(() => (_req: unknown, res: { json: (body: unknown) => void }) =>
    res.json({ stub: "runtime" })
  ),
}))

import { createApp } from "./server"

describe("createApp", () => {
  it("responds 200 on /health", async () => {
    const app = createApp({ apiKey: "sk-test" })
    const res = await request(app).get("/health")
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
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
})
```

- [ ] **Step 2: Run test, watch it fail.**

```bash
cd addons/terminus-copilot && pnpm test:run src/server.test.ts
```

Expected: FAIL — `Cannot find module './server'`.

- [ ] **Step 3: Write minimal `addons/terminus-copilot/src/server.ts`.**

```ts
import express, { type Express } from "express"
import { buildRuntime } from "./runtime"

export type ServerOptions = {
  apiKey: string
}

export function createApp({ apiKey }: ServerOptions): Express {
  if (!apiKey) throw new Error("createApp: anthropic api key is required")

  const app = express()
  app.use(express.json({ limit: "1mb" }))

  app.get("/health", (_req, res) => {
    res.json({ ok: true })
  })

  app.use("/api/copilotkit", buildRuntime({ apiKey }))

  return app
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? readOptionsApiKey()
  const port = Number(process.env.PORT ?? 3000)
  createApp({ apiKey }).listen(port, () => {
    console.log(`terminus-copilot listening on :${port}`)
  })
}

function readOptionsApiKey(): string {
  // HA add-on options are mounted at /data/options.json at runtime.
  try {
    const opts = require("/data/options.json") as { anthropic_api_key?: string }
    return opts.anthropic_api_key ?? ""
  } catch {
    return ""
  }
}
```

- [ ] **Step 4: Run test, watch it pass.**

```bash
cd addons/terminus-copilot && pnpm test:run src/server.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Run full suite + typecheck.**

```bash
cd addons/terminus-copilot && pnpm test:run && pnpm typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit.**

```bash
git add addons/terminus-copilot/src/
git commit -m "$(cat <<'EOF'
feat(terminus-copilot): Express app mounts CopilotKit runtime + /health

Reads ANTHROPIC_API_KEY from env, falling back to /data/options.json
for the HA add-on bind mount. Exposes /health for ingress probe.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Add-on README

**Files:**
- Create: `addons/terminus-copilot/README.md`

- [ ] **Step 1: Write README.**

```markdown
# Terminus Copilot — HA Add-on

CopilotKit runtime for the Terminus panel. Exposes `POST /api/copilotkit` over HA Ingress on port 3000. Holds the Anthropic API key; the browser never sees it.

## Install (local add-on)

1. SSH into the HA Green: `ssh root@terminus.tanuki-mirzam.ts.net -p 22222`.
2. Confirm `addons/terminus-copilot/` is present at the config repo root (deploy via the repo's normal flow — `git push` then `bin/deploy-ssh.sh`).
3. In HA: Settings → Add-ons → Add-on Store → ⋮ → Local add-ons → "Terminus Copilot" → Install.
4. Open the add-on, Configuration tab, paste the Anthropic API key from `secrets.yaml: anthropic_api_key`. Save.
5. Start the add-on. Watch the log: should see `terminus-copilot listening on :3000`.
6. Reload the Terminus panel. The sidebar opens against the running runtime.

## Dev (local laptop)

```bash
cd addons/terminus-copilot
pnpm install
ANTHROPIC_API_KEY=sk-... pnpm dev
# server on http://localhost:3000
# point the terminus dev panel at it via VITE_COPILOT_RUNTIME_URL
```

## Tests

```bash
pnpm test:run        # vitest
pnpm typecheck       # tsc --noEmit
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness probe — returns `{ok:true}`. |
| POST | `/api/copilotkit` | CopilotKit GraphQL/SSE endpoint. |

## Security

- Anthropic key lives in add-on options (`/data/options.json`, root-readable).
- Ingress provides same-origin HA auth. No public port.
- Runtime is stateless. No DB, no logs of prompts.
```

- [ ] **Step 2: Commit.**

```bash
git add addons/terminus-copilot/README.md
git commit -m "$(cat <<'EOF'
docs(terminus-copilot): add install + dev README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Frontend deps — add CopilotKit packages

**Files:**
- Modify: `terminus/package.json`

- [ ] **Step 1: Add dependencies.**

```bash
cd terminus && pnpm add @copilotkit/react-core @copilotkit/react-ui js-yaml
cd terminus && pnpm add -D @types/js-yaml
```

- [ ] **Step 2: Confirm install succeeded.**

```bash
cd terminus && pnpm typecheck
```

Expected: exit 0 (no source uses the new deps yet).

- [ ] **Step 3: Run existing test suite to confirm no regression.**

```bash
cd terminus && pnpm test:run
```

Expected: all existing tests still pass.

- [ ] **Step 4: Commit.**

```bash
git add terminus/package.json terminus/pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
chore(terminus): add CopilotKit + js-yaml deps

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: automationWriter — id generation (TDD)

**Files:**
- Create: `terminus/src/lib/automationWriter.ts`
- Create: `terminus/src/lib/automationWriter.test.ts`

- [ ] **Step 1: Write failing test.**

```ts
// terminus/src/lib/automationWriter.test.ts
import { describe, expect, it } from "vitest"
import { generateAutomationId } from "./automationWriter"

describe("generateAutomationId", () => {
  it("slugifies the alias and appends a stable 6-char hash", () => {
    const id = generateAutomationId("LR lamp off at 22:00")
    expect(id).toMatch(/^lr_lamp_off_at_22_00_[a-z0-9]{6}$/)
  })

  it("is deterministic for the same alias", () => {
    expect(generateAutomationId("foo bar")).toBe(generateAutomationId("foo bar"))
  })

  it("differs for different aliases", () => {
    expect(generateAutomationId("foo bar")).not.toBe(generateAutomationId("baz qux"))
  })

  it("collapses repeated separators and trims edges", () => {
    expect(generateAutomationId("  Multi   space___test  ")).toMatch(
      /^multi_space_test_[a-z0-9]{6}$/
    )
  })
})
```

- [ ] **Step 2: Run, watch fail.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: FAIL — `Cannot find module './automationWriter'`.

- [ ] **Step 3: Write minimal `terminus/src/lib/automationWriter.ts`.**

```ts
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function hash6(input: string): string {
  // FNV-1a 32-bit → base36, padded
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(6, "0").slice(-6)
}

export function generateAutomationId(alias: string): string {
  const slug = slugify(alias) || "automation"
  return `${slug}_${hash6(alias)}`
}
```

- [ ] **Step 4: Run, watch pass.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/lib/automationWriter.ts terminus/src/lib/automationWriter.test.ts
git commit -m "$(cat <<'EOF'
feat(terminus): automationWriter — deterministic slug+hash id generator

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: automationWriter — entity_id validation (TDD)

**Files:**
- Modify: `terminus/src/lib/automationWriter.ts`
- Modify: `terminus/src/lib/automationWriter.test.ts`

- [ ] **Step 1: Add failing test cases.**

Append to `terminus/src/lib/automationWriter.test.ts`:

```ts
import { validateAutomation, type AutomationProposal } from "./automationWriter"

const sampleProposal: AutomationProposal = {
  alias: "LR lamp off at 22:00",
  description: "Turn off LR lamp every night",
  mode: "single",
  triggers: [{ platform: "time", at: "22:00:00" }],
  conditions: [],
  actions: [{ service: "switch.turn_off", target: { entity_id: "switch.lr_lamp" } }],
}

describe("validateAutomation", () => {
  it("returns ok when all referenced entities exist", () => {
    const known = new Set(["switch.lr_lamp"])
    expect(validateAutomation(sampleProposal, known)).toEqual({ ok: true })
  })

  it("rejects unknown entity_id with kind unknown_entity", () => {
    const known = new Set<string>()
    const res = validateAutomation(sampleProposal, known)
    expect(res).toEqual({
      ok: false,
      error: { kind: "unknown_entity", detail: "switch.lr_lamp" },
    })
  })

  it("rejects missing alias with kind missing_field", () => {
    const bad = { ...sampleProposal, alias: "" }
    const res = validateAutomation(bad, new Set())
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("missing_field")
  })

  it("walks plural triggers/conditions/actions keys", () => {
    const plural: AutomationProposal = {
      alias: "x",
      mode: "single",
      triggers: [],
      conditions: [],
      actions: [
        {
          choose: [
            {
              conditions: [{ condition: "state", entity_id: "binary_sensor.unknown" }],
              sequence: [],
            },
          ],
        },
      ],
    }
    const res = validateAutomation(plural, new Set())
    expect(res).toEqual({
      ok: false,
      error: { kind: "unknown_entity", detail: "binary_sensor.unknown" },
    })
  })
})
```

- [ ] **Step 2: Run, watch fail.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: FAIL — `validateAutomation` not exported.

- [ ] **Step 3: Extend `terminus/src/lib/automationWriter.ts`.**

Add to the file:

```ts
export type AutomationProposal = {
  alias: string
  description?: string
  mode: "single" | "restart" | "queued" | "parallel"
  triggers: unknown[]
  conditions: unknown[]
  actions: unknown[]
}

export type ValidateError =
  | { kind: "missing_field"; detail: string }
  | { kind: "unknown_entity"; detail: string }
  | { kind: "yaml_parse"; detail: string }
  | { kind: "id_conflict"; detail: string }
  | { kind: "ha_rest"; detail: string }

export type ValidateResult =
  | { ok: true }
  | { ok: false; error: ValidateError }

const ENTITY_ID_RE = /\b([a-z_]+)\.[a-z0-9_]+\b/g

function collectEntityIds(node: unknown, out: Set<string>): void {
  if (typeof node === "string") {
    for (const match of node.matchAll(ENTITY_ID_RE)) out.add(match[0])
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) collectEntityIds(item, out)
    return
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectEntityIds(value, out)
  }
}

export function validateAutomation(
  proposal: AutomationProposal,
  knownEntityIds: Set<string>
): ValidateResult {
  if (!proposal.alias?.trim()) {
    return { ok: false, error: { kind: "missing_field", detail: "alias" } }
  }
  const refs = new Set<string>()
  collectEntityIds(proposal.triggers, refs)
  collectEntityIds(proposal.conditions, refs)
  collectEntityIds(proposal.actions, refs)
  for (const ref of refs) {
    if (!knownEntityIds.has(ref)) {
      return { ok: false, error: { kind: "unknown_entity", detail: ref } }
    }
  }
  return { ok: true }
}
```

- [ ] **Step 4: Run, watch pass.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: PASS (all 8 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/lib/automationWriter.ts terminus/src/lib/automationWriter.test.ts
git commit -m "$(cat <<'EOF'
feat(terminus): automationWriter — entity_id + missing-field validation

Recursively walks triggers/conditions/actions; matches \`domain.slug\`
strings against the known-entity set; structured \`{kind, detail}\`
errors so the LLM can react differentially.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: automationWriter — commit flow with id-conflict precheck (TDD)

**Files:**
- Modify: `terminus/src/lib/automationWriter.ts`
- Modify: `terminus/src/lib/automationWriter.test.ts`

- [ ] **Step 1: Add failing tests.**

Append to `terminus/src/lib/automationWriter.test.ts`:

```ts
import { commitAutomation } from "./automationWriter"

type Call = { url: string; init?: RequestInit }

function mockFetch(handlers: Record<string, (call: Call) => Response>): {
  fetch: typeof fetch
  calls: Call[]
} {
  const calls: Call[] = []
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.toString()
    calls.push({ url, init })
    for (const [pattern, handler] of Object.entries(handlers)) {
      if (url.includes(pattern)) return handler({ url, init })
    }
    return new Response("not mocked", { status: 500 })
  }
  return { fetch: fetchImpl, calls }
}

describe("commitAutomation", () => {
  const known = new Set(["switch.lr_lamp"])

  it("rejects with id_conflict when GET returns 200", async () => {
    const { fetch } = mockFetch({
      "/api/config/automation/config/": () => new Response("{}", { status: 200 }),
    })
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("id_conflict")
  })

  it("writes and reloads when GET returns 404", async () => {
    const { fetch, calls } = mockFetch({
      "GET /api/config/automation/config/": () =>
        new Response("not found", { status: 404 }),
      "/api/config/automation/config/": () =>
        new Response("{}", { status: 200 }),
      "/api/services/automation/reload": () =>
        new Response("[]", { status: 200 }),
    })
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.id).toMatch(/^lr_lamp_off_at_22_00_/)

    const methods = calls.map((c) => `${c.init?.method ?? "GET"} ${c.url}`)
    expect(methods.some((m) => m.startsWith("GET ") && m.includes("/automation/config/"))).toBe(true)
    expect(methods.some((m) => m.startsWith("POST ") && m.includes("/automation/config/"))).toBe(true)
    expect(methods.some((m) => m.includes("/services/automation/reload"))).toBe(true)
  })

  it("rejects with unknown_entity before any fetch when validation fails", async () => {
    const { fetch, calls } = mockFetch({})
    const res = await commitAutomation(sampleProposal, new Set(), { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("unknown_entity")
    expect(calls).toEqual([])
  })

  it("surfaces ha_rest error on POST failure", async () => {
    const { fetch } = mockFetch({
      "GET /api/config/automation/config/": () =>
        new Response("not found", { status: 404 }),
      "/api/config/automation/config/": () =>
        new Response("boom", { status: 500 }),
    })
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error.kind).toBe("ha_rest")
      expect(res.error.detail).toContain("500")
    }
  })
})
```

Note: the mock matches the substring `GET /api/config/...` by inspecting `init?.method`. The handler pattern as written matches plain URL substrings; rewrite slightly to method-aware matching:

Replace the `mockFetch` factory above with:

```ts
function mockFetch(handlers: { method: "GET" | "POST"; pattern: string; res: () => Response }[]): {
  fetch: typeof fetch
  calls: Call[]
} {
  const calls: Call[] = []
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.toString()
    const method = (init?.method ?? "GET").toUpperCase()
    calls.push({ url, init })
    for (const h of handlers) {
      if (method === h.method && url.includes(h.pattern)) return h.res()
    }
    return new Response("not mocked", { status: 500 })
  }
  return { fetch: fetchImpl, calls }
}
```

And rewrite the test handlers:

```ts
// id_conflict case
mockFetch([{ method: "GET", pattern: "/automation/config/", res: () => new Response("{}", { status: 200 }) }])

// happy path
mockFetch([
  { method: "GET", pattern: "/automation/config/", res: () => new Response("not found", { status: 404 }) },
  { method: "POST", pattern: "/automation/config/", res: () => new Response("{}", { status: 200 }) },
  { method: "POST", pattern: "/services/automation/reload", res: () => new Response("[]", { status: 200 }) },
])

// ha_rest case
mockFetch([
  { method: "GET", pattern: "/automation/config/", res: () => new Response("not found", { status: 404 }) },
  { method: "POST", pattern: "/automation/config/", res: () => new Response("boom", { status: 500 }) },
])
```

- [ ] **Step 2: Run, watch fail.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: FAIL — `commitAutomation` not exported.

- [ ] **Step 3: Extend `terminus/src/lib/automationWriter.ts`.**

Add to the top:

```ts
import { dump as yamlDump } from "js-yaml"
```

Add to bottom:

```ts
export type CommitOptions = {
  fetch: typeof fetch
  token: string
  baseUrl?: string
}

export type CommitResult =
  | { ok: true; id: string }
  | { ok: false; error: ValidateError }

export async function commitAutomation(
  proposal: AutomationProposal,
  knownEntityIds: Set<string>,
  { fetch, token, baseUrl = "" }: CommitOptions
): Promise<CommitResult> {
  const validated = validateAutomation(proposal, knownEntityIds)
  if (!validated.ok) return validated

  const id = generateAutomationId(proposal.alias)
  const configPath = `${baseUrl}/api/config/automation/config/${id}`
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const existing = await fetch(configPath, { method: "GET", headers })
  if (existing.status === 200) {
    return { ok: false, error: { kind: "id_conflict", detail: id } }
  }

  let body: string
  try {
    const yamlObj = {
      id,
      alias: proposal.alias,
      description: proposal.description ?? "",
      mode: proposal.mode,
      triggers: proposal.triggers,
      conditions: proposal.conditions,
      actions: proposal.actions,
    }
    // HA's REST endpoint takes JSON, not YAML — js-yaml round-trip is for
    // preview UX. Here we POST the structured object directly as JSON.
    body = JSON.stringify(yamlObj)
  } catch (e) {
    return {
      ok: false,
      error: { kind: "yaml_parse", detail: e instanceof Error ? e.message : String(e) },
    }
  }

  const write = await fetch(configPath, { method: "POST", headers, body })
  if (write.status >= 300) {
    return {
      ok: false,
      error: { kind: "ha_rest", detail: `POST automation/config: ${write.status}` },
    }
  }

  const reload = await fetch(`${baseUrl}/api/services/automation/reload`, {
    method: "POST",
    headers,
    body: "{}",
  })
  if (reload.status >= 300) {
    return {
      ok: false,
      error: { kind: "ha_rest", detail: `POST automation/reload: ${reload.status}` },
    }
  }

  return { ok: true, id }
}

export function serializeYamlPreview(proposal: AutomationProposal): string {
  const obj = {
    id: generateAutomationId(proposal.alias),
    alias: proposal.alias,
    description: proposal.description ?? "",
    mode: proposal.mode,
    triggers: proposal.triggers,
    conditions: proposal.conditions,
    actions: proposal.actions,
  }
  return yamlDump(obj, { lineWidth: 100, noRefs: true })
}
```

- [ ] **Step 4: Run, watch pass.**

```bash
cd terminus && pnpm test:run src/lib/automationWriter.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Add a small test for `serializeYamlPreview`.**

Append:

```ts
import { serializeYamlPreview } from "./automationWriter"

describe("serializeYamlPreview", () => {
  it("dumps a valid YAML string with the generated id", () => {
    const yaml = serializeYamlPreview(sampleProposal)
    expect(yaml).toContain("alias: LR lamp off at 22:00")
    expect(yaml).toMatch(/^id: lr_lamp_off_at_22_00_/m)
    expect(yaml).toContain("entity_id: switch.lr_lamp")
  })
})
```

Run, watch pass.

- [ ] **Step 6: Commit.**

```bash
git add terminus/src/lib/automationWriter.ts terminus/src/lib/automationWriter.test.ts
git commit -m "$(cat <<'EOF'
feat(terminus): automationWriter — commit flow + YAML preview

GET id-conflict precheck → validate entity refs → POST config → POST
reload. Surfaces structured \`{kind, detail}\` errors at every gate so
the LLM can react. serializeYamlPreview is for UI rendering only.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: copilot.tsx — ingress URL resolver (TDD)

**Files:**
- Create: `terminus/src/lib/copilot.tsx`
- Create: `terminus/src/lib/copilot.test.tsx`

- [ ] **Step 1: Write failing test.**

```tsx
// terminus/src/lib/copilot.test.tsx
import { describe, expect, it } from "vitest"
import { resolveRuntimeUrl } from "./copilot"

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
```

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/lib/copilot.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `terminus/src/lib/copilot.tsx`.**

```tsx
import { CopilotKit } from "@copilotkit/react-core"
import type { ReactNode } from "react"

const DEFAULT_DEV_URL = "http://localhost:3000/api/copilotkit"
const INGRESS_RE = /^(\/api\/hassio_ingress\/[^/]+)\//

type ResolveOpts = { pathname: string; fallback?: string }

export function resolveRuntimeUrl({
  pathname,
  fallback = DEFAULT_DEV_URL,
}: ResolveOpts): string {
  const match = pathname.match(INGRESS_RE)
  if (!match) return fallback
  return `${match[1]}/api/copilotkit`
}

export function CopilotProvider({ children }: { children: ReactNode }) {
  const fallback =
    (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_COPILOT_RUNTIME_URL ?? DEFAULT_DEV_URL
  const runtimeUrl = resolveRuntimeUrl({
    pathname: window.location.pathname,
    fallback,
  })
  return <CopilotKit runtimeUrl={runtimeUrl}>{children}</CopilotKit>
}
```

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/lib/copilot.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/lib/copilot.tsx terminus/src/lib/copilot.test.tsx
git commit -m "$(cat <<'EOF'
feat(terminus): CopilotProvider + ingress-aware runtime URL resolver

Parses HA ingress prefix from window.location.pathname; falls back
to VITE_COPILOT_RUNTIME_URL or localhost:3000 for dev runs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: readable.tsx — catalog preload (TDD)

**Files:**
- Create: `terminus/src/copilot/readable.tsx`
- Create: `terminus/src/copilot/readable.test.tsx`

Goal: a `<CopilotCatalog>` component that, on every render, calls `useCopilotReadable` with a typed catalog object derived from the loaded manifest + the registry context.

- [ ] **Step 1: Write failing test.**

```tsx
// terminus/src/copilot/readable.test.tsx
import { describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import { buildCatalog } from "./readable"
import type { Manifest } from "@/types/manifest"

const fixtureManifest: Manifest = {
  generatedAt: "2026-06-01T00:00:00Z",
  nodes: [
    { id: "switch.lr_lamp", kind: "entity", label: "LR Lamp", areaId: "lr" },
    { id: "scene.lr_dim", kind: "scene", label: "LR Dim", areaId: "lr" },
    { id: "script.bedtime", kind: "script", label: "Bedtime", areaId: "common" },
    { id: "automation.foo", kind: "automation", label: "Foo", areaId: "lr" },
  ],
  edges: [],
  automations: {},
} as unknown as Manifest

describe("buildCatalog", () => {
  it("includes entities, scenes, scripts, areas, and time", () => {
    const cat = buildCatalog({
      manifest: fixtureManifest,
      now: new Date("2026-06-01T15:30:00-06:00"),
    })
    expect(cat.entities).toContain("switch.lr_lamp")
    expect(cat.entities).not.toContain("automation.foo")
    expect(cat.entities).not.toContain("scene.lr_dim")
    expect(cat.scenes).toContain("scene.lr_dim")
    expect(cat.scripts).toContain("script.bedtime")
    expect(cat.areas).toEqual({
      mb: "Master Bedroom",
      lr: "Living Room",
      abi: "Abi's room",
    })
    expect(cat.user_location).toContain("Costa Rica")
    expect(cat.current_time).toBe("2026-06-01T15:30:00.000-06:00")
  })
})
```

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/copilot/readable.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `terminus/src/copilot/readable.tsx`.**

```tsx
import { useCopilotReadable } from "@copilotkit/react-core"
import type { Manifest, GraphNode } from "@/types/manifest"

export type Catalog = {
  entities: string[]
  scenes: string[]
  scripts: string[]
  areas: Record<string, string>
  current_time: string
  user_location: string
}

const AREAS: Record<string, string> = {
  mb: "Master Bedroom",
  lr: "Living Room",
  abi: "Abi's room",
}
const USER_LOCATION = "Costa Rica, UTC-6, ~10°N (stable sun events; no DST)"

function isEntity(n: GraphNode): boolean {
  return n.kind === "entity"
}
function isScene(n: GraphNode): boolean {
  return n.kind === "scene"
}
function isScript(n: GraphNode): boolean {
  return n.kind === "script"
}

function toLocalIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const tzMin = -d.getTimezoneOffset()
  const sign = tzMin >= 0 ? "+" : "-"
  const tzh = pad(Math.floor(Math.abs(tzMin) / 60))
  const tzm = pad(Math.abs(tzMin) % 60)
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `.${String(d.getMilliseconds()).padStart(3, "0")}${sign}${tzh}:${tzm}`
  )
}

export function buildCatalog({
  manifest,
  now,
}: {
  manifest: Manifest
  now: Date
}): Catalog {
  const nodes = manifest.nodes ?? []
  return {
    entities: nodes.filter(isEntity).map((n) => n.id),
    scenes: nodes.filter(isScene).map((n) => n.id),
    scripts: nodes.filter(isScript).map((n) => n.id),
    areas: { ...AREAS },
    current_time: toLocalIso(now),
    user_location: USER_LOCATION,
  }
}

export function CopilotCatalog({ manifest }: { manifest: Manifest }) {
  const catalog = buildCatalog({ manifest, now: new Date() })
  useCopilotReadable({
    description:
      "Home Assistant entity catalog. Use the exact entity_id strings here. " +
      "Areas map short prefixes (mb/lr/abi) to friendly names.",
    value: catalog,
  })
  return null
}
```

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/copilot/readable.test.tsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Verify the existing `Manifest`/`GraphNode` types support these `kind` discriminators.**

```bash
cd terminus && pnpm typecheck
```

If `GraphNode.kind` doesn't include `"scene"`/`"script"`/`"entity"`/`"automation"`, fix by reading `src/types/manifest.ts` and matching its actual kinds (the manifest is built by `vite-plugin-graph.ts` — check which kinds it emits). Adjust the filters above to match; do not change `manifest.ts`.

- [ ] **Step 6: Commit.**

```bash
git add terminus/src/copilot/
git commit -m "$(cat <<'EOF'
feat(terminus): CopilotCatalog preloads entities/scenes/scripts/areas

Hybrid grounding: catalog is preloaded each render via
useCopilotReadable; live state is fetched on demand by the
get_entity_state tool (next task).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: actions.tsx — get_entity_state tool (TDD)

**Files:**
- Create: `terminus/src/copilot/actions.tsx`
- Create: `terminus/src/copilot/actions.test.tsx`

- [ ] **Step 1: Write failing test.**

```tsx
// terminus/src/copilot/actions.test.tsx
import { describe, expect, it } from "vitest"
import { runGetEntityStateHandler } from "./actions"

describe("get_entity_state handler", () => {
  const liveStates = new Map([
    ["switch.lr_lamp", { state: "off", attributes: { friendly_name: "LR Lamp" } }],
  ])

  it("returns state + attributes when entity exists", () => {
    const res = runGetEntityStateHandler(
      { entity_id: "switch.lr_lamp" },
      { liveStates }
    )
    expect(res).toEqual({
      state: "off",
      attributes: { friendly_name: "LR Lamp" },
    })
  })

  it("returns error shape when entity missing", () => {
    const res = runGetEntityStateHandler(
      { entity_id: "switch.nope" },
      { liveStates }
    )
    expect(res).toEqual({ error: "not_found" })
  })
})
```

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal `terminus/src/copilot/actions.tsx`.**

```tsx
export type LiveStateSnapshot = {
  state: string
  attributes: Record<string, unknown>
}

export type GetEntityStateDeps = {
  liveStates: Map<string, LiveStateSnapshot>
}

export type GetEntityStateResult =
  | { state: string; attributes: Record<string, unknown> }
  | { error: "not_found" }

export function runGetEntityStateHandler(
  args: { entity_id: string },
  deps: GetEntityStateDeps
): GetEntityStateResult {
  const snap = deps.liveStates.get(args.entity_id)
  if (!snap) return { error: "not_found" }
  return { state: snap.state, attributes: snap.attributes }
}
```

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/copilot/actions.tsx terminus/src/copilot/actions.test.tsx
git commit -m "$(cat <<'EOF'
feat(terminus): get_entity_state tool handler

Pure function that reads from a LiveStateSnapshot map and returns
state+attributes, or {error:'not_found'}. Wired into useCopilotAction
in the next task.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: actions.tsx — propose_automation tool (TDD)

**Files:**
- Modify: `terminus/src/copilot/actions.tsx`
- Modify: `terminus/src/copilot/actions.test.tsx`

`propose_automation` returns a promise that resolves when the user clicks Approve or Reject in `PreviewCard`. We expose this as a pure factory that returns `{handler, resolve}` so the test can drive resolution.

- [ ] **Step 1: Add failing test.**

Append to `terminus/src/copilot/actions.test.tsx`:

```tsx
import { createProposeAutomationController } from "./actions"
import type { AutomationProposal } from "@/lib/automationWriter"

const proposal: AutomationProposal = {
  alias: "x",
  mode: "single",
  triggers: [],
  conditions: [],
  actions: [],
}

describe("propose_automation controller", () => {
  it("resolves with approved:true when approve() is called", async () => {
    const ctl = createProposeAutomationController()
    const pending = ctl.handler(proposal)
    ctl.approve()
    await expect(pending).resolves.toEqual({ approved: true })
  })

  it("resolves with approved:false + feedback when reject() is called", async () => {
    const ctl = createProposeAutomationController()
    const pending = ctl.handler(proposal)
    ctl.reject("too aggressive")
    await expect(pending).resolves.toEqual({
      approved: false,
      feedback: "too aggressive",
    })
  })

  it("exposes the current pending proposal for the render layer", () => {
    const ctl = createProposeAutomationController()
    expect(ctl.pending).toBeNull()
    void ctl.handler(proposal)
    expect(ctl.pending).toEqual(proposal)
  })
})
```

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: FAIL — `createProposeAutomationController` missing.

- [ ] **Step 3: Extend `terminus/src/copilot/actions.tsx`.**

Add to the file:

```tsx
import type { AutomationProposal } from "@/lib/automationWriter"

export type ProposeResult =
  | { approved: true }
  | { approved: false; feedback?: string }

export type ProposeAutomationController = {
  handler: (proposal: AutomationProposal) => Promise<ProposeResult>
  approve: () => void
  reject: (feedback?: string) => void
  pending: AutomationProposal | null
}

export function createProposeAutomationController(): ProposeAutomationController {
  let resolver: ((r: ProposeResult) => void) | null = null
  const ctl: ProposeAutomationController = {
    pending: null,
    handler(proposal) {
      ctl.pending = proposal
      return new Promise<ProposeResult>((resolve) => {
        resolver = resolve
      })
    },
    approve() {
      if (!resolver) return
      resolver({ approved: true })
      resolver = null
      ctl.pending = null
    },
    reject(feedback) {
      if (!resolver) return
      resolver({ approved: false, feedback })
      resolver = null
      ctl.pending = null
    },
  }
  return ctl
}
```

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/copilot/actions.tsx terminus/src/copilot/actions.test.tsx
git commit -m "$(cat <<'EOF'
feat(terminus): propose_automation controller — promise-resolved gate

Returns a pending promise that the PreviewCard resolves via approve()
or reject(feedback). Pure factory so tests can drive resolution.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: actions.tsx — commit_automation tool + hook wiring (TDD)

**Files:**
- Modify: `terminus/src/copilot/actions.tsx`
- Modify: `terminus/src/copilot/actions.test.tsx`

- [ ] **Step 1: Add failing test.**

Append to `terminus/src/copilot/actions.test.tsx`:

```tsx
import { runCommitAutomationHandler } from "./actions"

describe("commit_automation handler", () => {
  it("delegates to commitAutomation and returns its result", async () => {
    const fakeCommit = vi.fn(async () => ({ ok: true as const, id: "lr_test_abc123" }))
    const res = await runCommitAutomationHandler(proposal, {
      known: new Set(["switch.lr_lamp"]),
      token: "t",
      fetch: vi.fn(),
      commitImpl: fakeCommit,
    })
    expect(res).toEqual({ ok: true, id: "lr_test_abc123" })
    expect(fakeCommit).toHaveBeenCalledOnce()
  })
})
```

Make sure `vi` is imported at the top of the file (`import { describe, expect, it, vi } from "vitest"`).

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: FAIL — `runCommitAutomationHandler` missing.

- [ ] **Step 3: Extend `terminus/src/copilot/actions.tsx`.**

```tsx
import {
  commitAutomation,
  type AutomationProposal,
  type CommitResult,
} from "@/lib/automationWriter"
import { useCopilotAction } from "@copilotkit/react-core"
import { useLiveState } from "@/lib/liveState"
import { useMemo } from "react"

export type CommitDeps = {
  known: Set<string>
  token: string
  fetch: typeof fetch
  commitImpl?: typeof commitAutomation
}

export function runCommitAutomationHandler(
  proposal: AutomationProposal,
  deps: CommitDeps
): Promise<CommitResult> {
  const impl = deps.commitImpl ?? commitAutomation
  return impl(proposal, deps.known, { fetch: deps.fetch, token: deps.token })
}
```

Also add a `CopilotActions` component that wires the three tools into CopilotKit via `useCopilotAction`. Live entity state + auth token come from existing providers.

```tsx
export function CopilotActions({
  controller,
  knownEntityIds,
  token,
}: {
  controller: ProposeAutomationController
  knownEntityIds: Set<string>
  token: string
}) {
  const { states } = useLiveState()
  const liveMap = useMemo(() => {
    const m = new Map<string, LiveStateSnapshot>()
    for (const [id, s] of Object.entries(states)) {
      m.set(id, { state: s.state, attributes: s.attributes ?? {} })
    }
    return m
  }, [states])

  useCopilotAction({
    name: "get_entity_state",
    description: "Read current state and attributes of a Home Assistant entity.",
    parameters: [
      { name: "entity_id", type: "string", required: true },
    ],
    handler: async ({ entity_id }: { entity_id: string }) =>
      runGetEntityStateHandler({ entity_id }, { liveStates: liveMap }),
  })

  useCopilotAction({
    name: "propose_automation",
    description:
      "Propose a new automation. The user sees a YAML preview and approves or rejects. " +
      "Always call this before commit_automation.",
    parameters: [
      { name: "alias", type: "string", required: true },
      { name: "description", type: "string", required: false },
      {
        name: "mode",
        type: "string",
        enum: ["single", "restart", "queued", "parallel"],
        required: true,
      },
      { name: "triggers", type: "object[]", required: true },
      { name: "conditions", type: "object[]", required: true },
      { name: "actions", type: "object[]", required: true },
    ],
    handler: (proposal: AutomationProposal) => controller.handler(proposal),
  })

  useCopilotAction({
    name: "commit_automation",
    description:
      "Write the approved automation to Home Assistant. Only call after propose_automation " +
      "returned {approved:true}.",
    parameters: [
      { name: "alias", type: "string", required: true },
      { name: "description", type: "string", required: false },
      {
        name: "mode",
        type: "string",
        enum: ["single", "restart", "queued", "parallel"],
        required: true,
      },
      { name: "triggers", type: "object[]", required: true },
      { name: "conditions", type: "object[]", required: true },
      { name: "actions", type: "object[]", required: true },
    ],
    handler: (proposal: AutomationProposal) =>
      runCommitAutomationHandler(proposal, {
        known: knownEntityIds,
        token,
        fetch: window.fetch.bind(window),
      }),
  })

  return null
}
```

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/copilot/actions.test.tsx
```

Expected: all tests PASS.

- [ ] **Step 5: Verify typecheck.**

```bash
cd terminus && pnpm typecheck
```

If `useLiveState()` does not expose `states` in the shape above, read `terminus/src/lib/liveState.tsx` and adapt. Same for `useCopilotAction`'s `parameters` schema (check `@copilotkit/react-core` types if `"object[]"` is the wrong literal — falls back to `"object"`).

- [ ] **Step 6: Commit.**

```bash
git add terminus/src/copilot/actions.tsx terminus/src/copilot/actions.test.tsx
git commit -m "$(cat <<'EOF'
feat(terminus): CopilotActions registers three CopilotKit tools

Wires get_entity_state, propose_automation, and commit_automation via
useCopilotAction. Live state map flows from LiveStateProvider; HA auth
token threaded through props.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: PreviewCard (TDD)

**Files:**
- Create: `terminus/src/copilot/PreviewCard.tsx`
- Create: `terminus/src/copilot/PreviewCard.test.tsx`

- [ ] **Step 1: Write failing test.**

```tsx
// terminus/src/copilot/PreviewCard.test.tsx
import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PreviewCard } from "./PreviewCard"
import type { AutomationProposal } from "@/lib/automationWriter"

const proposal: AutomationProposal = {
  alias: "LR lamp off at 22:00",
  description: "",
  mode: "single",
  triggers: [{ platform: "time", at: "22:00:00" }],
  conditions: [],
  actions: [{ service: "switch.turn_off", target: { entity_id: "switch.lr_lamp" } }],
}

describe("PreviewCard", () => {
  it("renders the serialized YAML preview", () => {
    render(<PreviewCard proposal={proposal} onApprove={() => {}} onReject={() => {}} />)
    expect(screen.getByText(/alias: LR lamp off at 22:00/)).toBeDefined()
    expect(screen.getByText(/entity_id: switch\.lr_lamp/)).toBeDefined()
  })

  it("fires onApprove when Approve is clicked", () => {
    const onApprove = vi.fn()
    render(<PreviewCard proposal={proposal} onApprove={onApprove} onReject={() => {}} />)
    fireEvent.click(screen.getByRole("button", { name: /approve/i }))
    expect(onApprove).toHaveBeenCalledOnce()
  })

  it("fires onReject with feedback when Reject is clicked", () => {
    const onReject = vi.fn()
    render(<PreviewCard proposal={proposal} onApprove={() => {}} onReject={onReject} />)
    fireEvent.click(screen.getByRole("button", { name: /reject/i }))
    expect(onReject).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run, fail.**

```bash
cd terminus && pnpm test:run src/copilot/PreviewCard.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `terminus/src/copilot/PreviewCard.tsx`.**

```tsx
import { Button } from "@/components/ui/button"
import { serializeYamlPreview, type AutomationProposal } from "@/lib/automationWriter"

export function PreviewCard({
  proposal,
  onApprove,
  onReject,
}: {
  proposal: AutomationProposal
  onApprove: () => void
  onReject: (feedback?: string) => void
}) {
  const yaml = serializeYamlPreview(proposal)
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="text-sm font-medium">Proposed automation</div>
      <pre className="overflow-auto rounded bg-muted p-2 text-xs leading-snug">
        {yaml}
      </pre>
      <div className="flex gap-2">
        <Button size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => onReject()}>
          Reject
        </Button>
      </div>
    </div>
  )
}
```

If `@/components/ui/button` is not present (shadcn add not yet run for it), use a plain `<button className="…">` with Tailwind classes — keep the API the same.

- [ ] **Step 4: Run, pass.**

```bash
cd terminus && pnpm test:run src/copilot/PreviewCard.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit.**

```bash
git add terminus/src/copilot/PreviewCard.tsx terminus/src/copilot/PreviewCard.test.tsx
git commit -m "$(cat <<'EOF'
feat(terminus): PreviewCard renders YAML proposal + approve/reject

Pure presentational; resolution callbacks are passed in. Wired into
the propose_automation render layer in App.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Mount sidebar + providers in App.tsx

**Files:**
- Modify: `terminus/src/App.tsx`

- [ ] **Step 1: Read current `terminus/src/App.tsx`.**

You'll need to know the existing `<Shell>` shape (it already renders `<RegistryProvider>`-wrapped subtree per recent commits).

- [ ] **Step 2: Wire `<CopilotProvider>` + `<CopilotCatalog>` + `<CopilotActions>` + `<CopilotSidebar>`.**

Inside the existing `<App>` (or whatever root the top-level export wraps):

```tsx
import { CopilotSidebar } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"
import { CopilotProvider } from "@/lib/copilot"
import { CopilotCatalog } from "@/copilot/readable"
import { CopilotActions, createProposeAutomationController } from "@/copilot/actions"
import { PreviewCard } from "@/copilot/PreviewCard"
import { useMemo, useState } from "react"
import { useRegistry } from "@/lib/registry"
import { getAuthToken } from "@/lib/ha"

function CopilotWiring({ manifest }: { manifest: Manifest }) {
  const controller = useMemo(() => createProposeAutomationController(), [])
  const [, force] = useState(0)
  const registry = useRegistry()
  const token = getAuthToken()

  const knownIds = useMemo(
    () => new Set([...registry.entities.keys()]),
    [registry.entities]
  )

  controller.handler = ((orig) => (proposal: AutomationProposal) => {
    const p = orig(proposal)
    force((n) => n + 1)
    return p
  })(controller.handler)

  return (
    <>
      <CopilotCatalog manifest={manifest} />
      <CopilotActions controller={controller} knownEntityIds={knownIds} token={token} />
      {controller.pending && (
        <PreviewCard
          proposal={controller.pending}
          onApprove={() => {
            controller.approve()
            force((n) => n + 1)
          }}
          onReject={(fb) => {
            controller.reject(fb)
            force((n) => n + 1)
          }}
        />
      )}
    </>
  )
}
```

And in the existing top-level `<App>`:

```tsx
return (
  <CopilotProvider>
    <RegistryProvider>
      <LiveStateProvider>
        <Shell />
        {manifest && <CopilotWiring manifest={manifest} />}
        <CopilotSidebar
          labels={{
            title: "Terminus Copilot",
            initial: "Describe an automation. I'll propose YAML, you approve or reject.",
          }}
        />
      </LiveStateProvider>
    </RegistryProvider>
  </CopilotProvider>
)
```

If `RegistryProvider`/`LiveStateProvider` are already in `<Shell>`, hoist them out so `CopilotWiring` can read both. Do not duplicate providers.

Helper `getAuthToken`: if `terminus/src/lib/ha.ts` does not export one, add a tiny wrapper that returns the long-lived dev token from `import.meta.env.VITE_HA_TOKEN` in dev, or extracts it from `hassConnection.options.auth.accessToken` in HA. Stub it in this task; refine if needed.

- [ ] **Step 3: Typecheck + run all tests.**

```bash
cd terminus && pnpm typecheck && pnpm test:run
```

Expected: all green.

- [ ] **Step 4: Build the bundle to confirm Vite is happy.**

```bash
cd terminus && pnpm build
```

Expected: successful build, output in `../www/terminus/`.

- [ ] **Step 5: Commit (App edit only; the rebuilt bundle goes in the next task).**

```bash
git add terminus/src/App.tsx terminus/src/lib/ha.ts
git commit -m "$(cat <<'EOF'
feat(terminus): mount CopilotSidebar + tool wiring in App shell

Wraps Shell in CopilotProvider; registers catalog + tools per render;
PreviewCard appears as inline render for propose_automation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Inject CopilotKit CSS into shadow root

**Files:**
- Modify: `terminus/src/main.tsx`

- [ ] **Step 1: Read current `terminus/src/main.tsx` to locate the existing stylesheet injection (it injects `style.css` into the shadow root).**

- [ ] **Step 2: Add a second stylesheet link for CopilotKit alongside the existing one.**

The existing pattern is something like:

```ts
const link = document.createElement("link")
link.rel = "stylesheet"
link.href = "/local/terminus/style.css"
shadow.appendChild(link)
```

CopilotKit's stylesheet is imported by `App.tsx` via `import "@copilotkit/react-ui/styles.css"`, which Vite bundles into the same `style.css`. **No second link needed** — just confirm that the existing single `style.css` link in the shadow root contains CopilotKit's styles after `pnpm build`.

If CopilotKit's CSS is shipped as a separate file by Vite (check `../www/terminus/` contents after the build in Task 15), append a second link element pointing at that file.

```ts
const copilotLink = document.createElement("link")
copilotLink.rel = "stylesheet"
copilotLink.href = "/local/terminus/copilotkit.css"
shadow.appendChild(copilotLink)
```

- [ ] **Step 3: Rebuild.**

```bash
cd terminus && pnpm build
```

Expected: success.

- [ ] **Step 4: Run all tests.**

```bash
cd terminus && pnpm test:run
```

Expected: green.

- [ ] **Step 5: Commit the bundle + source.**

```bash
git add terminus/src/main.tsx www/terminus/
git commit -m "$(cat <<'EOF'
feat(terminus): bundle CopilotKit styles into shadow-root stylesheet

Vite rolls @copilotkit/react-ui/styles.css into the same style.css the
custom element already injects into its shadow root. Manual verify in
HA needed (vitest/happy-dom does not catch chrome bleed).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Manual deploy + acceptance smoke

This task has no automated steps — only a procedural checklist. Do not skip it; the spec calls it out as the only path that verifies shadow-DOM CSS, ingress routing, and the full LLM → write loop.

- [ ] **Step 1: Push branch.**

```bash
git push
```

- [ ] **Step 2: Deploy.**

```bash
bin/deploy-ssh.sh
```

Answer the prompts. Watch for clean `ha core check` pass.

- [ ] **Step 3: Install the new add-on.**

In HA UI: Settings → Add-ons → Add-on Store → ⋮ → Local add-ons → "Terminus Copilot" → Install. Paste `anthropic_api_key` from `secrets.yaml` into Configuration. Save. Start. Confirm log shows `terminus-copilot listening on :3000`.

- [ ] **Step 4: Reload Terminus panel.**

Open the Terminus sidebar panel. Sidebar should open against the running runtime. If it shows "Copilot unavailable", check add-on logs.

- [ ] **Step 5: Acceptance smoke.**

1. Type: **"Turn LR lamp off at 22:00 every weekday."** Preview card should appear with valid YAML using `switch.lr_lamp`.
2. Click **Approve**. Confirmation message in sidebar. Open Settings → Automations — new automation exists. Toggle it on if needed.
3. (Optional) Manually adjust HA clock or temporarily change trigger to `+1min` and verify it fires.
4. Type: **"Turn off the fridge light."** LLM should respond that no entity matches (or propose the closest); no bad write should occur.
5. Type a new request, click **Reject** in the preview. Conversation continues; no write occurred.
6. Try a duplicate alias (re-issue prompt 1). LLM should hit `id_conflict` and either pick a fresh alias or surface the conflict.

- [ ] **Step 6: Record results.**

If anything failed, file a follow-up in `terminus/BACKLOG.md`. If all six steps pass:

```bash
git commit --allow-empty -m "$(cat <<'EOF'
chore(terminus): acceptance smoke for CopilotKit automation creator passed

LR-lamp-22:00, unknown-entity, reject, duplicate-alias all behaved
per spec on first deploy.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage:**

- Add-on architecture (§Architecture): T1–T4.
- Frontend providers + sidebar (§Architecture): T5, T9, T15, T16.
- `useCopilotReadable` catalog (§Components, §Data Flow): T10.
- Three CopilotKit tools (§Components → tools table): T11 (`get_entity_state`), T12 (`propose_automation`), T13 (`commit_automation`).
- `PreviewCard` (§Components): T14.
- `automationWriter` validation + commit + id-conflict precheck (§Components, §Data Flow): T6–T8.
- Ingress URL resolution + dev fallback (§Architecture, §Data Flow boot): T9.
- Shadow-DOM CSS injection (§Architecture caveat): T16.
- Error branches (§Error Handling): T7 (`missing_field`, `unknown_entity`), T8 (`id_conflict`, `ha_rest`, `yaml_parse`).
- Acceptance smoke (§Testing): T17.

No spec section is unrepresented.

**Placeholder scan:** no "TBD", no "implement later", no "add appropriate error handling" without specifics. Code blocks present for every implementation step.

**Type consistency:**
- `AutomationProposal` defined T7, reused T8, T12, T13, T14 with same shape.
- `ValidateError` discriminants (`missing_field`, `unknown_entity`, `yaml_parse`, `id_conflict`, `ha_rest`) defined T7, reused in T8 mock responses and surfaced unchanged.
- `CommitResult` shape `{ok:true, id}` / `{ok:false, error}` defined T8, surfaced unchanged in T13.
- `ProposeResult` shape `{approved, feedback?}` defined T12, used in T14 callbacks.
- Function names stable across tasks: `validateAutomation`, `commitAutomation`, `generateAutomationId`, `serializeYamlPreview`, `runGetEntityStateHandler`, `createProposeAutomationController`, `runCommitAutomationHandler`, `CopilotCatalog`, `CopilotActions`, `CopilotProvider`, `PreviewCard`.

No gaps found.
