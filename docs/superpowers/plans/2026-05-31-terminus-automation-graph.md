# Terminus Automation Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a read-only React Flow visualization in the terminus HA panel that renders all automations, scripts, scenes, and the entities they reference as a system map, with a hash-routed per-automation `trigger → condition → action` DAG drill-in.

**Architecture:** A new vite plugin parses `packages/*.yaml` + `automations.yaml` + `scripts.yaml` + `scenes.yaml` at build time, runs dagre to compute node positions, and emits a single `graph.json` next to the bundle. Runtime loads the manifest once, renders React Flow with custom node types, and subscribes to `hassConnection` for live entity-state badges. No backend, no live YAML reads.

**Tech Stack:** React 19, Vite (lib mode), Tailwind v4, shadcn UI, `home-assistant-js-websocket`, `@xyflow/react` (React Flow), `@dagrejs/dagre`, `yaml`, `fast-glob`, `vitest` + `happy-dom`.

**Spec:** `docs/superpowers/specs/2026-05-31-terminus-automation-graph-design.md`

---

## File map

### New files

- `terminus/vite-plugin-graph.ts` — build-time YAML → manifest plugin
- `terminus/vite-plugin-graph.test.ts` — plugin unit tests
- `terminus/vitest.config.ts` — test config
- `terminus/__fixtures__/packages/sample.yaml` — fixture for plugin tests
- `terminus/__fixtures__/automations.yaml` — fixture
- `terminus/__fixtures__/scripts.yaml` — fixture
- `terminus/__fixtures__/scenes.yaml` — fixture
- `terminus/src/types/manifest.ts` — shared `Manifest` / `GraphNode` / `GraphEdge` types
- `terminus/src/lib/router.ts` — hash router store
- `terminus/src/lib/graph.ts` — manifest loader (single cached fetch)
- `terminus/src/lib/liveState.tsx` — `HassEntities` React context + hooks
- `terminus/src/lib/area.ts` — `inferArea()` (shared between plugin & runtime)
- `terminus/src/routes/SystemMap.tsx` — top-level React Flow canvas
- `terminus/src/routes/AutomationView.tsx` — per-automation DAG view
- `terminus/src/components/nodes/AutomationNode.tsx`
- `terminus/src/components/nodes/EntityNode.tsx`
- `terminus/src/components/nodes/ScriptNode.tsx`
- `terminus/src/components/nodes/SceneNode.tsx`
- `terminus/src/components/nodes/index.ts` — `nodeTypes` map for React Flow
- `terminus/src/components/EmptyState.tsx`
- `terminus/src/lib/router.test.ts`
- `terminus/src/lib/area.test.ts`
- `terminus/src/routes/SystemMap.test.tsx`

### Modified files

- `terminus/package.json` — new deps + `test` / `test:run` scripts
- `terminus/vite.config.ts` — register `graphManifestPlugin`
- `terminus/tsconfig.app.json` — include `__fixtures__` exclusion + vitest types
- `terminus/src/App.tsx` — replace entity-list scaffold with router + live-state provider
- `terminus/src/main.tsx` — no change expected; verify
- `terminus/src/index.css` — import React Flow CSS

### Conventions

- All new code uses `verbatimModuleSyntax` (existing tsconfig setting): `import type { Foo } from "..."` for type-only imports.
- Tests live alongside source for components / lib (`*.test.ts(x)` next to file). Plugin test sits at repo terminus root next to the plugin.
- Each task commits its own change set. Commit messages follow Conventional Commits (`feat(terminus):`, `test(terminus):`, `chore(terminus):`).

---

## Task 1: Add dependencies and vitest scaffolding

**Files:**
- Modify: `terminus/package.json`
- Create: `terminus/vitest.config.ts`

- [ ] **Step 1: Install runtime + build deps**

Run from `terminus/`:

```bash
pnpm add @xyflow/react
pnpm add -D @dagrejs/dagre yaml fast-glob vitest happy-dom @testing-library/react @testing-library/dom @types/dagrejs__dagre
```

If `@types/dagrejs__dagre` is unavailable (dagre is JS-only), drop it; we'll use `// @ts-expect-error` at the single dagre import site in Task 6.

- [ ] **Step 2: Add test scripts**

Edit `terminus/package.json` `"scripts"` to add:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

- [ ] **Step 3: Write vitest config**

Create `terminus/vitest.config.ts`:

```ts
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "vite-plugin-graph.test.ts"],
  },
})
```

- [ ] **Step 4: Verify install + config**

Run from `terminus/`:

```bash
pnpm test:run
```

Expected: vitest reports `No test files found`. Exit code 0. (Empty test run is success.)

- [ ] **Step 5: Commit**

```bash
git add terminus/package.json terminus/pnpm-lock.yaml terminus/vitest.config.ts
git commit -m "chore(terminus): add react-flow, dagre, vitest deps"
```

---

## Task 2: Manifest types + area inference

**Files:**
- Create: `terminus/src/types/manifest.ts`
- Create: `terminus/src/lib/area.ts`
- Create: `terminus/src/lib/area.test.ts`

- [ ] **Step 1: Write area inference test**

Create `terminus/src/lib/area.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { inferArea } from "./area"

describe("inferArea", () => {
  it.each([
    ["light.mb_led_one", "mb"],
    ["switch.lr_lamp", "lr"],
    ["scene.lr_dim", "lr"],
    ["light.abi_ceiling", "abi"],
    ["sensor.light_sensor_samsung_illuminance", "common"],
    ["binary_sensor.is_dark", "common"],
    ["sun.sun", "common"],
    ["bluish", "common"], // bare scene slug w/o prefix
    ["mb_bluish", "mb"],  // bare scene slug w/ prefix
  ])("maps %s -> %s", (input, expected) => {
    expect(inferArea(input)).toBe(expected)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run src/lib/area.test.ts`
Expected: FAIL — `Failed to resolve import "./area"`.

- [ ] **Step 3: Write manifest types**

Create `terminus/src/types/manifest.ts`:

```ts
export type AreaId = "mb" | "lr" | "abi" | "common" | "system"

export type NodeKind = "automation" | "script" | "scene" | "entity" | "template"

export type EdgeKind =
  | "trigger"
  | "condition"
  | "action"
  | "script_call"
  | "scene_call"
  | "template"

export type GraphNode = {
  id: string
  kind: NodeKind
  label: string
  area: AreaId
  source: { file: string; line: number }
  position: { x: number; y: number }
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  kind: EdgeKind
}

export type AutomationDetail = {
  id: string
  alias: string
  mode: "single" | "restart" | "queued" | "parallel"
  triggers: unknown[]
  conditions: unknown[]
  actions: unknown[]
  flowNodes: GraphNode[]
  flowEdges: GraphEdge[]
}

export type Manifest = {
  version: 1
  generatedAt: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  automations: Record<string, AutomationDetail>
}
```

- [ ] **Step 4: Write area inference**

Create `terminus/src/lib/area.ts`:

```ts
import type { AreaId } from "@/types/manifest"

const AREA_PREFIXES: ReadonlyArray<[string, AreaId]> = [
  ["mb_", "mb"],
  ["lr_", "lr"],
  ["abi_", "abi"],
]

// Accept either a full entity_id ("light.mb_led_one") or a bare slug ("mb_led_one").
export function inferArea(idOrSlug: string): AreaId {
  const slug = idOrSlug.includes(".") ? idOrSlug.slice(idOrSlug.indexOf(".") + 1) : idOrSlug
  for (const [prefix, area] of AREA_PREFIXES) {
    if (slug.startsWith(prefix)) return area
  }
  return "common"
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test:run src/lib/area.test.ts`
Expected: PASS, 9 assertions.

- [ ] **Step 6: Commit**

```bash
git add terminus/src/types terminus/src/lib/area.ts terminus/src/lib/area.test.ts
git commit -m "feat(terminus): manifest types + area inference"
```

---

## Task 3: Fixture YAML for plugin tests

**Files:**
- Create: `terminus/__fixtures__/packages/sample.yaml`
- Create: `terminus/__fixtures__/automations.yaml`
- Create: `terminus/__fixtures__/scripts.yaml`
- Create: `terminus/__fixtures__/scenes.yaml`

- [ ] **Step 1: Write packages/sample.yaml fixture**

Create `terminus/__fixtures__/packages/sample.yaml`. Covers: trigger entity, condition entity, action entity, script call, scene call, Jinja-templated target.

```yaml
automation:
  - id: mb_lamp_on_dark
    alias: 'MB: Lamp on when dark'
    mode: single
    trigger:
      - platform: state
        entity_id: binary_sensor.is_dark
        to: 'on'
    condition:
      - condition: state
        entity_id: person.norman
        state: home
    action:
      - service: light.turn_on
        target:
          entity_id: light.mb_led_one
      - service: scene.turn_on
        target:
          entity_id: scene.mb_bluish
      - service: script.lr_evening

  - id: lr_dynamic_target
    alias: 'LR: Dynamic target (templated)'
    mode: restart
    trigger:
      - platform: state
        entity_id: input_boolean.lr_movie
        to: 'on'
    action:
      - service: light.turn_off
        target:
          entity_id: "{{ states('input_text.lr_target') }}"

script:
  lr_evening:
    alias: 'LR: Evening'
    sequence:
      - service: light.turn_on
        target:
          entity_id: light.lr_lamp

scene:
  - id: scene.mb_bluish
    name: 'MB: Bluish'
    entities:
      light.mb_led_one:
        state: 'on'
        rgb_color: [50, 50, 200]
```

- [ ] **Step 2: Write automations.yaml fixture**

Create `terminus/__fixtures__/automations.yaml`:

```yaml
- id: ui_kitchen_off
  alias: 'Kitchen: off at midnight'
  trigger:
    - platform: time
      at: '00:00:00'
  action:
    - service: switch.turn_off
      target:
        entity_id: switch.kitchen_main
```

- [ ] **Step 3: Write scripts.yaml + scenes.yaml fixtures**

Create `terminus/__fixtures__/scripts.yaml`:

```yaml
ui_only_script:
  alias: 'UI only script'
  sequence:
    - service: notify.mobile_app_norman_s_iphone
      data:
        message: hi
```

Create `terminus/__fixtures__/scenes.yaml`:

```yaml
[]
```

- [ ] **Step 4: Commit**

```bash
git add terminus/__fixtures__
git commit -m "test(terminus): YAML fixtures for graph plugin"
```

---

## Task 4: Vite plugin — discover + parse YAML

**Files:**
- Create: `terminus/vite-plugin-graph.ts`
- Create: `terminus/vite-plugin-graph.test.ts`

- [ ] **Step 1: Write failing test for discovery + parse**

Create `terminus/vite-plugin-graph.test.ts`:

```ts
import path from "node:path"
import { describe, expect, it } from "vitest"
import { buildManifest } from "./vite-plugin-graph"

const FIXTURE_ROOT = path.resolve(__dirname, "__fixtures__")

describe("buildManifest", () => {
  it("parses automation, script, scene from fixtures", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)

    const autoIds = manifest.nodes
      .filter((n) => n.kind === "automation")
      .map((n) => n.id)
      .sort()
    expect(autoIds).toEqual([
      "auto:lr_dynamic_target",
      "auto:mb_lamp_on_dark",
      "auto:ui_kitchen_off",
    ])

    const scriptIds = manifest.nodes
      .filter((n) => n.kind === "script")
      .map((n) => n.id)
      .sort()
    expect(scriptIds).toEqual(["script:lr_evening", "script:ui_only_script"])

    const sceneIds = manifest.nodes.filter((n) => n.kind === "scene").map((n) => n.id)
    expect(sceneIds).toContain("scene:scene.mb_bluish")
  })

  it("captures source file + line for each automation", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const mbLamp = manifest.nodes.find((n) => n.id === "auto:mb_lamp_on_dark")
    expect(mbLamp).toBeDefined()
    expect(mbLamp!.source.file).toContain("packages/sample.yaml")
    expect(mbLamp!.source.line).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: FAIL — `Failed to resolve import "./vite-plugin-graph"`.

- [ ] **Step 3: Implement minimal plugin scaffolding**

Create `terminus/vite-plugin-graph.ts`:

```ts
import path from "node:path"
import fg from "fast-glob"
import { readFile } from "node:fs/promises"
import { parseDocument, type Document } from "yaml"

import type { AutomationDetail, GraphEdge, GraphNode, Manifest } from "./src/types/manifest"
import { inferArea } from "./src/lib/area"

type RawAutomation = {
  id: string
  alias?: string
  mode?: AutomationDetail["mode"]
  trigger?: unknown
  condition?: unknown
  action?: unknown
  __sourceFile: string
  __sourceLine: number
}

type RawScript = {
  slug: string
  alias?: string
  sequence?: unknown
  __sourceFile: string
  __sourceLine: number
}

type RawScene = {
  id: string
  name?: string
  entities?: Record<string, unknown>
  __sourceFile: string
  __sourceLine: number
}

type Parsed = {
  automations: RawAutomation[]
  scripts: RawScript[]
  scenes: RawScene[]
}

async function readYaml(file: string): Promise<Document> {
  const text = await readFile(file, "utf8")
  return parseDocument(text, { keepSourceTokens: true })
}

function lineOf(doc: Document, nodePath: ReadonlyArray<string | number>): number {
  const node = doc.getIn(nodePath, true)
  if (node && typeof node === "object" && "range" in node && Array.isArray((node as { range?: unknown }).range)) {
    const range = (node as { range: [number, number, number] }).range
    // yaml v2 returns byte offsets; resolve to line by counting newlines up to start offset
    const src = doc.toString()
    const offset = range[0]
    return src.slice(0, offset).split("\n").length
  }
  return 1
}

async function collectFromFile(file: string, rel: string): Promise<Parsed> {
  const doc = await readYaml(file)
  const root = doc.toJSON()
  const out: Parsed = { automations: [], scripts: [], scenes: [] }

  // packages-style: top-level `automation:` / `script:` / `scene:` keys
  // root automations.yaml-style: top-level array of automations
  // scripts.yaml-style: top-level mapping of slug -> script body
  // scenes.yaml-style: top-level array of scenes

  if (Array.isArray(root) && rel.endsWith("automations.yaml")) {
    root.forEach((a: RawAutomation, i: number) => {
      if (a && typeof a === "object" && a.id) {
        out.automations.push({ ...a, __sourceFile: rel, __sourceLine: lineOf(doc, [i]) })
      }
    })
  } else if (Array.isArray(root) && rel.endsWith("scenes.yaml")) {
    root.forEach((s: RawScene, i: number) => {
      if (s && typeof s === "object" && s.id) {
        out.scenes.push({ ...s, __sourceFile: rel, __sourceLine: lineOf(doc, [i]) })
      }
    })
  } else if (root && typeof root === "object" && rel.endsWith("scripts.yaml")) {
    Object.entries(root as Record<string, RawScript>).forEach(([slug, body]) => {
      out.scripts.push({
        ...(body as RawScript),
        slug,
        __sourceFile: rel,
        __sourceLine: lineOf(doc, [slug]),
      })
    })
  } else if (root && typeof root === "object") {
    const r = root as { automation?: RawAutomation[]; script?: Record<string, RawScript>; scene?: RawScene[] }
    if (Array.isArray(r.automation)) {
      r.automation.forEach((a, i) => {
        if (a && a.id) {
          out.automations.push({ ...a, __sourceFile: rel, __sourceLine: lineOf(doc, ["automation", i]) })
        }
      })
    }
    if (r.script && typeof r.script === "object") {
      Object.entries(r.script).forEach(([slug, body]) => {
        out.scripts.push({
          ...(body as RawScript),
          slug,
          __sourceFile: rel,
          __sourceLine: lineOf(doc, ["script", slug]),
        })
      })
    }
    if (Array.isArray(r.scene)) {
      r.scene.forEach((s, i) => {
        if (s && s.id) {
          out.scenes.push({ ...s, __sourceFile: rel, __sourceLine: lineOf(doc, ["scene", i]) })
        }
      })
    }
  }

  return out
}

async function discoverAndParse(repoRoot: string): Promise<Parsed> {
  const files = await fg(
    ["packages/*.yaml", "automations.yaml", "scripts.yaml", "scenes.yaml"],
    { cwd: repoRoot, absolute: true }
  )

  const merged: Parsed = { automations: [], scripts: [], scenes: [] }
  for (const file of files) {
    const rel = path.relative(repoRoot, file)
    try {
      const p = await collectFromFile(file, rel)
      merged.automations.push(...p.automations)
      merged.scripts.push(...p.scripts)
      merged.scenes.push(...p.scenes)
    } catch (err) {
      console.error(`[graph plugin] failed to parse ${rel}:`, err)
      throw err
    }
  }
  return merged
}

export async function buildManifest(repoRoot: string): Promise<Manifest> {
  const parsed = await discoverAndParse(repoRoot)

  const nodes: GraphNode[] = []

  for (const a of parsed.automations) {
    nodes.push({
      id: `auto:${a.id}`,
      kind: "automation",
      label: a.alias ?? a.id,
      area: inferArea(a.id),
      source: { file: a.__sourceFile, line: a.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }
  for (const s of parsed.scripts) {
    nodes.push({
      id: `script:${s.slug}`,
      kind: "script",
      label: s.alias ?? s.slug,
      area: inferArea(s.slug),
      source: { file: s.__sourceFile, line: s.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }
  for (const sc of parsed.scenes) {
    nodes.push({
      id: `scene:${sc.id}`,
      kind: "scene",
      label: sc.name ?? sc.id,
      area: inferArea(sc.id),
      source: { file: sc.__sourceFile, line: sc.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes,
    edges: [],
    automations: {},
  }
}
```

> The plugin lives at `terminus/vite-plugin-graph.ts` and imports via **relative paths** (`./src/...`). The `@` alias only resolves inside the vite/vitest pipeline; the plugin file itself is loaded by Node before vite's alias config applies, so relative paths are required here.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: PASS — both `it` blocks. If "Cannot find module '@/types/manifest'" fires, change the plugin's imports to relative paths (`./src/types/manifest`, `./src/lib/area`) and re-run.

- [ ] **Step 5: Commit**

```bash
git add terminus/vite-plugin-graph.ts terminus/vite-plugin-graph.test.ts
git commit -m "feat(terminus): plugin discovers + parses automations/scripts/scenes"
```

---

## Task 5: Vite plugin — walk entity refs + build edges

**Files:**
- Modify: `terminus/vite-plugin-graph.ts`
- Modify: `terminus/vite-plugin-graph.test.ts`

- [ ] **Step 1: Extend test for edges + referenced entities**

Append to `terminus/vite-plugin-graph.test.ts`:

```ts
describe("buildManifest edges", () => {
  it("emits trigger/condition/action edges in data-flow direction", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const auto = "auto:mb_lamp_on_dark"

    const triggers = manifest.edges.filter((e) => e.kind === "trigger" && e.target === auto)
    expect(triggers.map((e) => e.source)).toEqual(["binary_sensor.is_dark"])

    const conditions = manifest.edges.filter(
      (e) => e.kind === "condition" && e.target === auto
    )
    expect(conditions.map((e) => e.source)).toEqual(["person.norman"])

    const actions = manifest.edges.filter((e) => e.kind === "action" && e.source === auto)
    expect(actions.map((e) => e.target).sort()).toEqual(["light.mb_led_one"])
  })

  it("emits script_call + scene_call edges", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const auto = "auto:mb_lamp_on_dark"
    expect(
      manifest.edges.some(
        (e) => e.kind === "script_call" && e.source === auto && e.target === "script:lr_evening"
      )
    ).toBe(true)
    expect(
      manifest.edges.some(
        (e) =>
          e.kind === "scene_call" && e.source === auto && e.target === "scene:scene.mb_bluish"
      )
    ).toBe(true)
  })

  it("emits template edges for jinja-templated targets", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const tmpls = manifest.edges.filter(
      (e) => e.kind === "template" && e.source === "auto:lr_dynamic_target"
    )
    expect(tmpls).toHaveLength(1)
    expect(tmpls[0].target).toMatch(/^template:/)
    expect(manifest.nodes.some((n) => n.id === tmpls[0].target && n.kind === "template")).toBe(true)
  })

  it("only emits entity nodes that are referenced", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const referenced = new Set<string>()
    manifest.edges.forEach((e) => {
      referenced.add(e.source)
      referenced.add(e.target)
    })
    const entityNodes = manifest.nodes.filter((n) => n.kind === "entity")
    for (const en of entityNodes) {
      expect(referenced.has(en.id)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: FAIL on edge assertions — `edges` is empty.

- [ ] **Step 3: Implement ref walker + edge builder**

In `terminus/vite-plugin-graph.ts`, add helpers above `buildManifest` and extend the function:

```ts
const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/
const JINJA_RE = /\{\{[\s\S]*?\}\}/

type Ref = { kind: "entity"; id: string } | { kind: "template" }

function refsFromValue(v: unknown): Ref[] {
  if (v == null) return []
  if (typeof v === "string") {
    if (JINJA_RE.test(v)) return [{ kind: "template" }]
    if (ENTITY_ID_RE.test(v)) return [{ kind: "entity", id: v }]
    return []
  }
  if (Array.isArray(v)) return v.flatMap(refsFromValue)
  return []
}

function collectEntityRefs(node: unknown, keys: ReadonlySet<string>): Ref[] {
  const out: Ref[] = []
  function walk(n: unknown) {
    if (n == null || typeof n !== "object") return
    if (Array.isArray(n)) {
      n.forEach(walk)
      return
    }
    for (const [k, v] of Object.entries(n as Record<string, unknown>)) {
      if (keys.has(k)) out.push(...refsFromValue(v))
      else if (k === "target" && v && typeof v === "object") {
        const t = v as Record<string, unknown>
        out.push(...refsFromValue(t.entity_id))
      }
      walk(v)
    }
  }
  walk(node)
  return out
}

const TRIGGER_KEYS = new Set(["entity_id"])
const CONDITION_KEYS = new Set(["entity_id"])
const ACTION_KEYS = new Set(["entity_id"])

type ServiceCall = { kind: "script_call" | "scene_call"; targetId: string }

function serviceCallsFromAction(action: unknown): ServiceCall[] {
  const out: ServiceCall[] = []
  function walk(a: unknown) {
    if (a == null || typeof a !== "object") return
    if (Array.isArray(a)) {
      a.forEach(walk)
      return
    }
    const obj = a as Record<string, unknown>
    const svc = typeof obj.service === "string" ? obj.service : undefined
    if (svc && svc.startsWith("script.")) {
      out.push({ kind: "script_call", targetId: `script:${svc.slice("script.".length)}` })
    }
    if (svc === "scene.turn_on") {
      const tgt = (obj.target as { entity_id?: unknown } | undefined)?.entity_id
      const ids = Array.isArray(tgt) ? tgt : tgt ? [tgt] : []
      for (const id of ids) {
        if (typeof id === "string" && id.startsWith("scene.")) {
          out.push({ kind: "scene_call", targetId: `scene:${id}` })
        }
      }
    }
    // shorthand: `- service: script.foo` already covered above; also `- action: <slug>` legacy
    for (const v of Object.values(obj)) walk(v)
  }
  walk(action)
  return out
}
```

Then replace `buildManifest`'s body (after the `nodes` initial population for automation/script/scene) and before the return, with:

```ts
  const edges: GraphEdge[] = []
  const automations: Record<string, AutomationDetail> = {}
  const entityNodeIds = new Set<string>()
  let templateCounter = 0

  function ensureEntityNode(id: string, file: string, line: number) {
    if (entityNodeIds.has(id)) return
    entityNodeIds.add(id)
    nodes.push({
      id,
      kind: "entity",
      label: id.split(".").slice(-1)[0],
      area: inferArea(id),
      source: { file, line },
      position: { x: 0, y: 0 },
    })
  }

  function ensureTemplateNode(file: string, line: number): string {
    const id = `template:${++templateCounter}`
    nodes.push({
      id,
      kind: "template",
      label: "templated",
      area: "common",
      source: { file, line },
      position: { x: 0, y: 0 },
    })
    return id
  }

  for (const a of parsed.automations) {
    const autoId = `auto:${a.id}`

    const triggerRefs = collectEntityRefs(a.trigger, TRIGGER_KEYS)
    for (const r of triggerRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::t::${r.id}`, source: r.id, target: autoId, kind: "trigger" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::t::${tid}`, source: tid, target: autoId, kind: "template" })
      }
    }

    const conditionRefs = collectEntityRefs(a.condition, CONDITION_KEYS)
    for (const r of conditionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::c::${r.id}`, source: r.id, target: autoId, kind: "condition" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::c::${tid}`, source: tid, target: autoId, kind: "template" })
      }
    }

    const actionRefs = collectEntityRefs(a.action, ACTION_KEYS)
    for (const r of actionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::a::${r.id}`, source: autoId, target: r.id, kind: "action" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::a::${tid}`, source: autoId, target: tid, kind: "template" })
      }
    }

    for (const sc of serviceCallsFromAction(a.action)) {
      edges.push({
        id: `${autoId}::${sc.kind}::${sc.targetId}`,
        source: autoId,
        target: sc.targetId,
        kind: sc.kind,
      })
    }

    automations[a.id] = {
      id: a.id,
      alias: a.alias ?? a.id,
      mode: a.mode ?? "single",
      triggers: toArr(a.trigger),
      conditions: toArr(a.condition),
      actions: toArr(a.action),
      flowNodes: [],
      flowEdges: [],
    }
  }

  // Scripts can reference entities too — emit script -> entity action edges.
  for (const s of parsed.scripts) {
    const scriptId = `script:${s.slug}`
    const actionRefs = collectEntityRefs(s.sequence, ACTION_KEYS)
    for (const r of actionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, s.__sourceFile, s.__sourceLine)
        edges.push({
          id: `${scriptId}::a::${r.id}`,
          source: scriptId,
          target: r.id,
          kind: "action",
        })
      }
    }
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    automations,
  }
}

function toArr(v: unknown): unknown[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}
```

Remove the prior premature `return { ... edges: [], automations: {} }` if still present — single return now sits at the bottom of `buildManifest`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: PASS — all edge / referenced-entity / template assertions.

- [ ] **Step 5: Commit**

```bash
git add terminus/vite-plugin-graph.ts terminus/vite-plugin-graph.test.ts
git commit -m "feat(terminus): plugin walks refs + builds edges"
```

---

## Task 6: Vite plugin — dagre layout + per-automation flow

**Files:**
- Modify: `terminus/vite-plugin-graph.ts`
- Modify: `terminus/vite-plugin-graph.test.ts`

- [ ] **Step 1: Extend test for layout + per-auto detail**

Append:

```ts
describe("buildManifest layout + detail", () => {
  it("assigns finite positions to every node", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    for (const n of manifest.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true)
      expect(Number.isFinite(n.position.y)).toBe(true)
    }
  })

  it("emits per-automation flowNodes + flowEdges", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const detail = manifest.automations["mb_lamp_on_dark"]
    expect(detail).toBeDefined()
    // Expect at least: 1 trigger + 1 condition + 2 action nodes + 1 automation root
    expect(detail.flowNodes.length).toBeGreaterThanOrEqual(5)
    expect(detail.flowEdges.length).toBeGreaterThan(0)
    for (const n of detail.flowNodes) {
      expect(Number.isFinite(n.position.x)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: FAIL on layout positions (all zero) and `automations` detail (flow nodes empty).

- [ ] **Step 3: Add dagre layout helper**

In `terminus/vite-plugin-graph.ts`, add near top:

```ts
// `@dagrejs/dagre` ships its own .d.ts. If types fail to resolve on your
// setup, add `// @ts-expect-error` on the import line.
import dagre from "@dagrejs/dagre"

function layout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  opts: { rankdir: "LR" | "TB"; nodeWidth: number; nodeHeight: number }
): GraphNode[] {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: opts.rankdir, nodesep: 40, ranksep: 80, marginx: 20, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const n of nodes) {
    g.setNode(n.id, { width: opts.nodeWidth, height: opts.nodeHeight })
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target)
  }
  dagre.layout(g)

  return nodes.map((n) => {
    const out = g.node(n.id)
    return { ...n, position: { x: out.x - opts.nodeWidth / 2, y: out.y - opts.nodeHeight / 2 } }
  })
}
```

- [ ] **Step 4: Build per-automation DAG + run layout**

Inside the automation loop (after `automations[a.id] = { ... }`), replace with:

```ts
    const flowNodes: GraphNode[] = []
    const flowEdges: GraphEdge[] = []
    const rootId = `${autoId}::root`
    flowNodes.push({
      id: rootId,
      kind: "automation",
      label: a.alias ?? a.id,
      area: inferArea(a.id),
      source: { file: a.__sourceFile, line: a.__sourceLine },
      position: { x: 0, y: 0 },
    })

    function addFlow(kind: "trigger" | "condition" | "action", ref: Ref, idx: number) {
      const nid =
        ref.kind === "entity"
          ? `${rootId}::${kind}::${ref.id}::${idx}`
          : `${rootId}::${kind}::tmpl::${idx}`
      const label = ref.kind === "entity" ? ref.id : "templated"
      flowNodes.push({
        id: nid,
        kind: ref.kind === "template" ? "template" : "entity",
        label,
        area: ref.kind === "entity" ? inferArea(ref.id) : "common",
        source: { file: a.__sourceFile, line: a.__sourceLine },
        position: { x: 0, y: 0 },
      })
      if (kind === "action") {
        flowEdges.push({ id: `${nid}::edge`, source: rootId, target: nid, kind })
      } else {
        flowEdges.push({ id: `${nid}::edge`, source: nid, target: rootId, kind })
      }
    }

    triggerRefs.forEach((r, i) => addFlow("trigger", r, i))
    conditionRefs.forEach((r, i) => addFlow("condition", r, i))
    actionRefs.forEach((r, i) => addFlow("action", r, i))

    const laidFlow = layout(flowNodes, flowEdges, { rankdir: "TB", nodeWidth: 200, nodeHeight: 56 })

    automations[a.id] = {
      id: a.id,
      alias: a.alias ?? a.id,
      mode: a.mode ?? "single",
      triggers: toArr(a.trigger),
      conditions: toArr(a.condition),
      actions: toArr(a.action),
      flowNodes: laidFlow,
      flowEdges,
    }
```

Then before the final return of `buildManifest`, layout the system map:

```ts
  const laid = layout(nodes, edges, { rankdir: "LR", nodeWidth: 220, nodeHeight: 56 })
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes: laid,
    edges,
    automations,
  }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test:run vite-plugin-graph.test.ts`
Expected: PASS — all 7+ assertions.

- [ ] **Step 6: Commit**

```bash
git add terminus/vite-plugin-graph.ts terminus/vite-plugin-graph.test.ts
git commit -m "feat(terminus): dagre layout + per-automation flow"
```

---

## Task 7: Vite plugin — write graph.json + register in vite.config.ts

**Files:**
- Modify: `terminus/vite-plugin-graph.ts`
- Modify: `terminus/vite.config.ts`

- [ ] **Step 1: Add vite plugin wrapper**

At the bottom of `terminus/vite-plugin-graph.ts`, add:

```ts
import { writeFile, mkdir } from "node:fs/promises"
import type { Plugin } from "vite"

export function graphManifestPlugin(opts?: { repoRoot?: string }): Plugin {
  const repoRoot = opts?.repoRoot ?? path.resolve(process.cwd(), "..")
  const publicDir = path.resolve(process.cwd(), "public")
  const target = path.join(publicDir, "graph.json")

  async function rebuild() {
    const manifest = await buildManifest(repoRoot)
    await mkdir(publicDir, { recursive: true })
    await writeFile(target, JSON.stringify(manifest, null, 2))
    return manifest
  }

  return {
    name: "terminus-graph-manifest",
    async buildStart() {
      const m = await rebuild()
      this.info(
        `graph.json: ${m.nodes.length} nodes, ${m.edges.length} edges, ${
          Object.keys(m.automations).length
        } automations`
      )
    },
    configureServer(server) {
      const watched = [
        path.join(repoRoot, "packages"),
        path.join(repoRoot, "automations.yaml"),
        path.join(repoRoot, "scripts.yaml"),
        path.join(repoRoot, "scenes.yaml"),
      ]
      for (const w of watched) server.watcher.add(w)
      server.watcher.on("change", async (file) => {
        if (!watched.some((w) => file === w || file.startsWith(w + path.sep))) return
        try {
          await rebuild()
          server.ws.send({ type: "full-reload" })
        } catch (err) {
          server.config.logger.error(`[graph plugin] rebuild failed: ${(err as Error).message}`)
        }
      })
    },
  }
}
```

- [ ] **Step 2: Register plugin in vite.config.ts**

Modify `terminus/vite.config.ts`. Replace `plugins: [react(), tailwindcss()],` with:

```ts
import { graphManifestPlugin } from "./vite-plugin-graph"

// ...
  plugins: [react(), tailwindcss(), graphManifestPlugin()],
```

Keep the rest of the file unchanged.

- [ ] **Step 3: Verify build emits graph.json**

Run:

```bash
pnpm build
```

Expected: build succeeds, `terminus/../www/terminus/graph.json` exists and parses as JSON.

Sanity check:

```bash
node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('../www/terminus/graph.json','utf8'))))"
```

Expected: `[ 'version', 'generatedAt', 'nodes', 'edges', 'automations' ]`.

- [ ] **Step 4: Commit**

```bash
git add terminus/vite-plugin-graph.ts terminus/vite.config.ts www/terminus/graph.json
git commit -m "feat(terminus): plugin emits graph.json + dev watcher"
```

---

## Task 8: Runtime — hash router

**Files:**
- Create: `terminus/src/lib/router.ts`
- Create: `terminus/src/lib/router.test.ts`

- [ ] **Step 1: Write failing test**

Create `terminus/src/lib/router.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { parseRoute, formatRoute } from "./router"

describe("router", () => {
  it("parses empty hash as map", () => {
    expect(parseRoute("")).toEqual({ name: "map" })
    expect(parseRoute("#")).toEqual({ name: "map" })
    expect(parseRoute("#/")).toEqual({ name: "map" })
  })

  it("parses /auto/<id>", () => {
    expect(parseRoute("#/auto/mb_lamp_on_dark")).toEqual({
      name: "auto",
      id: "mb_lamp_on_dark",
    })
  })

  it("decodes URL-encoded ids", () => {
    expect(parseRoute("#/auto/foo%2Fbar")).toEqual({ name: "auto", id: "foo/bar" })
  })

  it("falls back to map for unknown routes", () => {
    expect(parseRoute("#/nope")).toEqual({ name: "map" })
  })

  it("formats route to hash", () => {
    expect(formatRoute({ name: "map" })).toBe("#/")
    expect(formatRoute({ name: "auto", id: "mb_lamp_on_dark" })).toBe("#/auto/mb_lamp_on_dark")
    expect(formatRoute({ name: "auto", id: "foo/bar" })).toBe("#/auto/foo%2Fbar")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run src/lib/router.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement router**

Create `terminus/src/lib/router.ts`:

```ts
import { useSyncExternalStore } from "react"

export type Route = { name: "map" } | { name: "auto"; id: string }

export function parseRoute(hash: string): Route {
  const stripped = hash.replace(/^#\/?/, "")
  if (stripped === "") return { name: "map" }
  const [head, ...rest] = stripped.split("/")
  if (head === "auto" && rest.length === 1 && rest[0] !== "") {
    return { name: "auto", id: decodeURIComponent(rest[0]) }
  }
  return { name: "map" }
}

export function formatRoute(r: Route): string {
  if (r.name === "map") return "#/"
  return `#/auto/${encodeURIComponent(r.id)}`
}

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener)
  return () => window.removeEventListener("hashchange", listener)
}
function getSnapshot() {
  return window.location.hash
}
function getServerSnapshot() {
  return ""
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return parseRoute(hash)
}

export function navigate(r: Route): void {
  const target = formatRoute(r)
  if (window.location.hash !== target.replace(/^#/, "#")) {
    window.location.hash = target
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run src/lib/router.test.ts`
Expected: PASS, 5 cases.

- [ ] **Step 5: Commit**

```bash
git add terminus/src/lib/router.ts terminus/src/lib/router.test.ts
git commit -m "feat(terminus): hash router with map + per-automation routes"
```

---

## Task 9: Runtime — manifest loader

**Files:**
- Create: `terminus/src/lib/graph.ts`

- [ ] **Step 1: Implement loader**

Create `terminus/src/lib/graph.ts`:

```ts
import type { Manifest } from "@/types/manifest"

let cached: Promise<Manifest> | null = null

export function loadManifest(): Promise<Manifest> {
  if (cached) return cached
  const url = "/local/terminus/graph.json" + (import.meta.env.DEV ? `?t=${Date.now()}` : "")
  cached = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`graph.json: HTTP ${r.status}`)
    return r.json() as Promise<Manifest>
  })
  return cached
}

// Test-only reset hook.
export function __resetManifestCache() {
  cached = null
}
```

- [ ] **Step 2: Smoke check via typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add terminus/src/lib/graph.ts
git commit -m "feat(terminus): manifest loader with module-level cache"
```

---

## Task 10: Runtime — live state context

**Files:**
- Create: `terminus/src/lib/liveState.tsx`

- [ ] **Step 1: Implement provider + hooks**

Create `terminus/src/lib/liveState.tsx`:

```tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { HassEntities } from "home-assistant-js-websocket"
import { connectHA, watchEntities } from "@/lib/ha"

type LiveState = {
  status: "connecting" | "connected" | "error"
  error: string | null
  entities: HassEntities
}

const Ctx = createContext<LiveState | null>(null)

export function LiveStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LiveState["status"]>("connecting")
  const [error, setError] = useState<string | null>(null)
  const [entities, setEntities] = useState<HassEntities>({})

  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    connectHA()
      .then((conn) => {
        if (cancelled) {
          conn.close()
          return
        }
        setStatus("connected")
        unsubscribe = watchEntities(conn, (next) => setEntities({ ...next }))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setStatus("error")
        setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => ({ status, error, entities }), [status, error, entities])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLiveState(): LiveState {
  const v = useContext(Ctx)
  if (!v) throw new Error("useLiveState must be used inside <LiveStateProvider>")
  return v
}

export function useEntityState(entityId: string | undefined): string | undefined {
  const { entities } = useLiveState()
  if (!entityId) return undefined
  return entities[entityId]?.state
}

export function useAutomationEnabled(autoId: string): boolean {
  const state = useEntityState(`automation.${autoId}`)
  return state === "on"
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add terminus/src/lib/liveState.tsx
git commit -m "feat(terminus): live state context + entity hooks"
```

---

## Task 11: Node components

**Files:**
- Create: `terminus/src/components/nodes/AutomationNode.tsx`
- Create: `terminus/src/components/nodes/EntityNode.tsx`
- Create: `terminus/src/components/nodes/ScriptNode.tsx`
- Create: `terminus/src/components/nodes/SceneNode.tsx`
- Create: `terminus/src/components/nodes/index.ts`
- Modify: `terminus/src/index.css`

- [ ] **Step 1: Import React Flow CSS**

Edit `terminus/src/index.css`. At the very top (before any Tailwind directives), add:

```css
@import "@xyflow/react/dist/style.css";
```

- [ ] **Step 2: Write AutomationNode**

Create `terminus/src/components/nodes/AutomationNode.tsx`:

```tsx
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { useAutomationEnabled } from "@/lib/liveState"
import { navigate } from "@/lib/router"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type AutomationNodeData = {
  autoId: string
  label: string
  area: AreaId
  mode: "single" | "restart" | "queued" | "parallel"
}

export function AutomationNode({ data }: NodeProps<AutomationNodeData>) {
  const enabled = useAutomationEnabled(data.autoId)
  const border = AREA_BORDER[data.area]

  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-sm border-l-4 ${border} cursor-pointer hover:bg-accent`}
      onClick={() => navigate({ name: "auto", id: data.autoId })}
    >
      <Handle type="target" position={Position.Left} />
      <span className="text-sm font-medium">{data.label}</span>
      <Badge variant={enabled ? "default" : "secondary"} className="text-[10px]">
        {enabled ? "on" : "off"}
      </Badge>
      {data.mode !== "single" && (
        <Badge variant="outline" className="text-[10px]">
          {data.mode}
        </Badge>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
```

- [ ] **Step 3: Write EntityNode**

Create `terminus/src/components/nodes/EntityNode.tsx`:

```tsx
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { useEntityState } from "@/lib/liveState"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type EntityNodeData = {
  entityId: string
  label: string
  area: AreaId
}

export function EntityNode({ data }: NodeProps<EntityNodeData>) {
  const state = useEntityState(data.entityId)
  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs border-l-4 ${AREA_BORDER[data.area]}`}
    >
      <Handle type="target" position={Position.Left} />
      <span className="font-mono">{data.entityId}</span>
      {state && (
        <Badge variant="secondary" className="font-mono text-[10px]">
          {state}
        </Badge>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
```

- [ ] **Step 4: Write ScriptNode + SceneNode**

Create `terminus/src/components/nodes/ScriptNode.tsx`:

```tsx
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { ScrollText } from "lucide-react"
import type { AreaId } from "@/types/manifest"

export type ScriptNodeData = { label: string; area: AreaId }

export function ScriptNode({ data }: NodeProps<ScriptNodeData>) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed bg-card px-3 py-2 text-sm">
      <Handle type="target" position={Position.Left} />
      <ScrollText className="size-4" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
```

Create `terminus/src/components/nodes/SceneNode.tsx`:

```tsx
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Sparkles } from "lucide-react"
import type { AreaId } from "@/types/manifest"

export type SceneNodeData = { label: string; area: AreaId }

export function SceneNode({ data }: NodeProps<SceneNodeData>) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <Handle type="target" position={Position.Left} />
      <Sparkles className="size-4" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
```

- [ ] **Step 5: Write nodeTypes map**

Create `terminus/src/components/nodes/index.ts`:

```ts
import type { NodeTypes } from "@xyflow/react"
import { AutomationNode } from "./AutomationNode"
import { EntityNode } from "./EntityNode"
import { ScriptNode } from "./ScriptNode"
import { SceneNode } from "./SceneNode"

export const nodeTypes: NodeTypes = {
  automation: AutomationNode,
  entity: EntityNode,
  script: ScriptNode,
  scene: SceneNode,
  // template uses the entity renderer (it's just a placeholder pill).
  template: EntityNode,
}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add terminus/src/components/nodes terminus/src/index.css
git commit -m "feat(terminus): node components for graph"
```

---

## Task 12: SystemMap route

**Files:**
- Create: `terminus/src/components/EmptyState.tsx`
- Create: `terminus/src/routes/SystemMap.tsx`
- Create: `terminus/src/routes/SystemMap.test.tsx`

- [ ] **Step 1: Write EmptyState**

Create `terminus/src/components/EmptyState.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="m-6 max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Write SystemMap render test**

Create `terminus/src/routes/SystemMap.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { SystemMap } from "./SystemMap"
import type { Manifest } from "@/types/manifest"
import { LiveStateProvider } from "@/lib/liveState"

vi.mock("@/lib/ha", () => ({
  connectHA: () => new Promise(() => {}), // never resolves
  watchEntities: () => () => {},
}))

const manifest: Manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "auto:mb_lamp_on_dark",
      kind: "automation",
      label: "MB: Lamp on when dark",
      area: "mb",
      source: { file: "packages/sample.yaml", line: 2 },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  automations: {
    mb_lamp_on_dark: {
      id: "mb_lamp_on_dark",
      alias: "MB: Lamp on when dark",
      mode: "single",
      triggers: [],
      conditions: [],
      actions: [],
      flowNodes: [],
      flowEdges: [],
    },
  },
}

describe("SystemMap", () => {
  it("renders automation node label from manifest", async () => {
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} />
      </LiveStateProvider>
    )
    expect(await screen.findByText("MB: Lamp on when dark")).toBeTruthy()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test:run src/routes/SystemMap.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement SystemMap**

Create `terminus/src/routes/SystemMap.tsx`:

```tsx
import { useMemo } from "react"
import { ReactFlow, Background, Controls, type Edge, type Node } from "@xyflow/react"
import type { Manifest } from "@/types/manifest"
import { nodeTypes } from "@/components/nodes"

const EDGE_STYLE: Record<string, { stroke: string; strokeDasharray?: string }> = {
  trigger: { stroke: "var(--color-emerald-500)" },
  condition: { stroke: "var(--color-amber-500)", strokeDasharray: "4 4" },
  action: { stroke: "var(--color-sky-500)" },
  script_call: { stroke: "var(--color-fuchsia-500)" },
  scene_call: { stroke: "var(--color-pink-500)" },
  template: { stroke: "var(--color-zinc-500)", strokeDasharray: "2 2" },
}

export function SystemMap({ manifest }: { manifest: Manifest }) {
  const nodes: Node[] = useMemo(
    () =>
      manifest.nodes.map((n) => {
        const data =
          n.kind === "automation"
            ? {
                autoId: n.id.replace(/^auto:/, ""),
                label: n.label,
                area: n.area,
                mode: manifest.automations[n.id.replace(/^auto:/, "")]?.mode ?? "single",
              }
            : n.kind === "entity" || n.kind === "template"
              ? { entityId: n.id, label: n.label, area: n.area }
              : { label: n.label, area: n.area }
        return {
          id: n.id,
          type: n.kind,
          position: n.position,
          data,
        }
      }),
    [manifest]
  )

  const edges: Edge[] = useMemo(
    () =>
      manifest.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        style: EDGE_STYLE[e.kind],
        animated: false,
      })),
    [manifest]
  )

  return (
    <div className="h-[calc(100svh-4rem)] w-full">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test:run src/routes/SystemMap.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add terminus/src/components/EmptyState.tsx terminus/src/routes/SystemMap.tsx terminus/src/routes/SystemMap.test.tsx
git commit -m "feat(terminus): system map route"
```

---

## Task 13: AutomationView route

**Files:**
- Create: `terminus/src/routes/AutomationView.tsx`

- [ ] **Step 1: Implement AutomationView**

Create `terminus/src/routes/AutomationView.tsx`:

```tsx
import { useMemo } from "react"
import { ReactFlow, Background, Controls, type Edge, type Node } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Manifest } from "@/types/manifest"
import { navigate } from "@/lib/router"
import { nodeTypes } from "@/components/nodes"
import { EmptyState } from "@/components/EmptyState"

export function AutomationView({ manifest, autoId }: { manifest: Manifest; autoId: string }) {
  const detail = manifest.automations[autoId]

  const nodes = useMemo<Node[]>(() => {
    if (!detail) return []
    return detail.flowNodes.map((n) => ({
      id: n.id,
      type: n.kind === "automation" ? "automation" : n.kind === "template" ? "template" : "entity",
      position: n.position,
      data:
        n.kind === "automation"
          ? { autoId, label: n.label, area: n.area, mode: detail.mode }
          : { entityId: n.label, label: n.label, area: n.area },
    }))
  }, [detail, autoId])

  const edges = useMemo<Edge[]>(
    () =>
      detail?.flowEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })) ?? [],
    [detail]
  )

  if (!detail) {
    return (
      <EmptyState
        title={`Unknown automation: ${autoId}`}
        body="The manifest does not include this automation. Rebuild the panel and re-deploy."
      />
    )
  }

  return (
    <div className="flex h-[calc(100svh-4rem)] w-full">
      <div className="flex-1">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <aside className="flex w-96 flex-col border-l">
        <div className="flex items-center justify-between border-b p-3">
          <div>
            <div className="text-sm font-medium">{detail.alias}</div>
            <div className="text-xs text-muted-foreground">mode: {detail.mode}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "map" })}>
            Back
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">{JSON.stringify(detail.triggers, null, 2)}</pre>
            </CardContent>
          </Card>
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">{JSON.stringify(detail.conditions, null, 2)}</pre>
            </CardContent>
          </Card>
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">{JSON.stringify(detail.actions, null, 2)}</pre>
            </CardContent>
          </Card>
        </ScrollArea>
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add terminus/src/routes/AutomationView.tsx
git commit -m "feat(terminus): per-automation DAG view + side panel"
```

---

## Task 14: App wiring — router + provider + manifest + staleness banner

**Files:**
- Modify: `terminus/src/App.tsx`

- [ ] **Step 1: Replace App.tsx**

Replace `terminus/src/App.tsx` with:

```tsx
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { LiveStateProvider, useLiveState } from "@/lib/liveState"
import { loadManifest } from "@/lib/graph"
import { useRoute } from "@/lib/router"
import { SystemMap } from "@/routes/SystemMap"
import { AutomationView } from "@/routes/AutomationView"
import { EmptyState } from "@/components/EmptyState"
import type { Manifest } from "@/types/manifest"

const STALE_DAYS = 7

function StatusBadge() {
  const { status } = useLiveState()
  const label =
    status === "connecting" ? "Connecting…" : status === "connected" ? "Connected" : "Error"
  const variant =
    status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{label}</Badge>
}

function StalenessBanner({ generatedAt }: { generatedAt: string }) {
  const days = Math.floor((Date.now() - Date.parse(generatedAt)) / (1000 * 60 * 60 * 24))
  if (days < STALE_DAYS) return null
  return (
    <div className="border-b bg-amber-100 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Manifest is {days} days old — run <code>bin/deploy-ssh.sh</code> to refresh.
    </div>
  )
}

function Shell() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const route = useRoute()

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  if (error) {
    return (
      <EmptyState
        title="Graph manifest missing"
        body="Run `pnpm build` in terminus/ to generate `www/terminus/graph.json`."
      />
    )
  }
  if (!manifest) return null

  return (
    <div className="flex h-svh flex-col">
      <StalenessBanner generatedAt={manifest.generatedAt} />
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-base font-semibold">Terminus</h1>
        <StatusBadge />
      </header>
      <main className="flex-1">
        {route.name === "map" ? (
          <SystemMap manifest={manifest} />
        ) : (
          <AutomationView manifest={manifest} autoId={route.id} />
        )}
      </main>
    </div>
  )
}

export function App() {
  return (
    <LiveStateProvider>
      <Shell />
    </LiveStateProvider>
  )
}

export default App
```

- [ ] **Step 2: Verify build + typecheck**

Run from `terminus/`:

```bash
pnpm typecheck
pnpm build
```

Expected: both succeed. `www/terminus/index.js`, `style.css`, `graph.json` present.

- [ ] **Step 3: Run all tests**

Run: `pnpm test:run`
Expected: PASS — area, router, plugin, SystemMap tests all green.

- [ ] **Step 4: Commit**

```bash
git add terminus/src/App.tsx www/terminus
git commit -m "feat(terminus): wire router, manifest loader, staleness banner"
```

---

## Task 15: Final verification

**Files:** none modified — verification only.

- [ ] **Step 1: Full test + lint + build**

Run from `terminus/`:

```bash
pnpm lint && pnpm typecheck && pnpm test:run && pnpm build
```

Expected: all four green. No `// @ts-expect-error` complaints unused.

- [ ] **Step 2: Repo-side HA config check**

Run from repo root:

```bash
docker run --rm -v "$PWD":/config ghcr.io/home-assistant/home-assistant:stable \
  python -m homeassistant --script check_config -c /config
```

Expected: `Configuration valid!` (touching `packages/` is not in scope of this plan, so no failure expected).

- [ ] **Step 3: Manual smoke — dev mode**

Run from `terminus/`:

```bash
pnpm dev
```

Open the printed URL. Confirm:
- No console errors.
- Manifest fetch returns the expected node count.
- Clicking an automation node updates the URL hash and renders the DAG view.
- Editing a fixture YAML triggers full-reload via the dev watcher.

Stop dev server.

- [ ] **Step 4: Manual smoke — deployed bundle**

Deploy via existing flow:

```bash
git push
bin/deploy-ssh.sh
```

Open `https://terminus.tanuki-mirzam.ts.net/terminus` (panel URL). Confirm system map renders, live entity badges update, drill-in works.

- [ ] **Step 5: Final commit if anything tweaked**

If any file changed during smoke (unlikely), commit. Else nothing to do.

---

## Acceptance criteria (against the spec)

- ✅ System map renders all automations + scripts + scenes + referenced entities (§3, §4).
- ✅ Per-automation DAG via `#/auto/<id>` (§3, §6).
- ✅ Manifest baked at build time, single fetch at runtime (§3, §5, §6).
- ✅ Live entity-state + automation-enabled badges via `hassConnection` (§4, §6).
- ✅ Data-flow direction on edges; `trigger`, `condition`, `action`, `script_call`, `scene_call`, `template` kinds (§5).
- ✅ Area color-band (no compound parents), entity badges only (overlay choice a3 + b2) (§9).
- ✅ Empty / disconnected / stale-manifest states (§6).
- ✅ Dagre layout at build time, finite positions for every node (§5).
- ✅ No live YAML reads, no backend, no addon (§3).
- ✅ Vitest coverage for plugin (parse, refs, edges, layout, detail) + router + area + SystemMap smoke (§7).
