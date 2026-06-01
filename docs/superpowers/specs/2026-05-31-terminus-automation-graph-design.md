# Terminus Automation Graph — Design

**Status:** approved
**Date:** 2026-05-31
**Scope:** Read-only React Flow visualization of automations + scripts + scenes + referenced entities inside the existing `terminus/` HA custom panel. NL automation creator is a separate spec.

---

## 1. Goals

- Render a system-wide graph of all automations, scripts, scenes, and the entities they reference, drilling into per-automation `trigger → condition → action` DAGs on demand.
- Build artifact only: zero new backend services, zero new HA add-ons. Data is baked into the bundle at `pnpm build` time.
- Live overlay limited to entity-state badges via the existing `hassConnection`.
- Reuses current terminus stack: React 19, Vite lib mode, Tailwind v4, shadcn UI, `home-assistant-js-websocket`.

## 2. Non-goals

- Editing or dragging nodes to rewire automations.
- Generating new automations via natural language (deferred to a separate spec).
- Trace history overlays (`last_triggered` glow / fire animation).
- Compound area parent containers (React Flow subflows).
- Jinja template evaluation for trigger / condition / action targets.
- Mobile-optimized layout. Touch zoom/pan via React Flow defaults is sufficient.
- elkjs auto-layout (dagre is enough for this graph size).

## 3. Architecture

```
repo/                            device/
├─ packages/*.yaml ─┐            └─ /config/www/terminus/
├─ automations.yaml │  vite           ├─ index.js         ← React bundle
├─ scripts.yaml     ├─ build ──→     ├─ style.css
├─ scenes.yaml      │                 └─ graph.json       ← baked manifest
└─ terminus/        │
   ├─ vite-plugin-graph.ts  ← parses YAML → dagre layout → graph.json
   └─ src/
      ├─ App.tsx              ← hash-router: '' = map, '#/auto/<id>' = DAG
      ├─ routes/
      │  ├─ SystemMap.tsx     ← React Flow w/ baked nodes+positions
      │  └─ AutomationView.tsx← React Flow w/ DAG from manifest[id]
      ├─ lib/
      │  ├─ ha.ts             (existing)
      │  ├─ graph.ts          ← load /local/terminus/graph.json
      │  ├─ liveState.ts      ← subscribes entities, returns Map<id,state>
      │  └─ router.ts         ← hash-route store
      └─ components/
         ├─ AutomationNode.tsx ← area color-band + enabled badge
         ├─ EntityNode.tsx     ← live state badge
         ├─ ScriptNode.tsx
         └─ SceneNode.tsx
```

Build artifact is one JSON manifest plus the existing bundle. Runtime is read-only against `hassConnection` for live badges. Pure additive to the current terminus codebase.

## 4. Manifest schema (`graph.json`)

Baked by the vite plugin. Frozen contract between build and runtime.

```ts
type AreaId = "mb" | "lr" | "abi" | "common" | "system"

type Manifest = {
  version: 1
  generatedAt: string                          // ISO; debug only
  nodes: GraphNode[]
  edges: GraphEdge[]
  automations: Record<string, AutomationDetail> // for #/auto/<id> view
}

type GraphNode = {
  id: string                                    // entity_id OR `auto:<id>` / `script:<slug>` / `scene:<slug>`
  kind: "automation" | "script" | "scene" | "entity"
  label: string                                 // friendly_name or last entity_id segment
  area: AreaId                                  // prefix-derived; "common" fallback
  source: { file: string; line: number }        // for future "open in editor" affordance
  position: { x: number; y: number }            // dagre-computed at build time
}

type GraphEdge = {
  id: string
  source: string                                // node id
  target: string
  kind: "trigger" | "condition" | "action" | "script_call" | "scene_call" | "template"
}

type AutomationDetail = {
  id: string
  alias: string
  mode: "single" | "restart" | "queued" | "parallel"
  // Raw HA automation sub-trees, passed through unchanged from the source YAML.
  // Used by AutomationView only to render side-panel text; not used for graph layout.
  triggers: unknown[]
  conditions: unknown[]
  actions: unknown[]
  flowNodes: GraphNode[]                        // per-automation DAG, pre-laid-out
  flowEdges: GraphEdge[]
}
```

Notes:

- Entity nodes are emitted **only if referenced** by some automation, script, or scene. No orphan entities. Node count tracks automation surface area, not the full HA state table.
- `source.{file,line}` is captured for every node so we can later wire "jump to YAML" without re-parsing.
- `kind: "template"` edges represent Jinja-templated targets that the plugin cannot resolve; target is a synthetic `template:<n>` node so the graph still renders.

## 5. Vite plugin (`vite-plugin-graph.ts`)

Runs on `pnpm build` and on `pnpm dev` via a chokidar watcher. Emits `terminus/public/graph.json`, which vite copies to `outDir`.

### Pipeline

1. **Discover YAML.** `fast-glob` over `../packages/*.yaml`, `../automations.yaml`, `../scripts.yaml`, `../scenes.yaml` (paths relative to `terminus/`).
2. **Parse.** `yaml` package with line tracking. Extract `automation:`, `script:`, `scene:`, `template:` blocks. Capture line numbers for `source.line`. Respect YAML anchors / merge keys natively.
3. **Walk for entity refs.** Recursive scan of trigger / condition / action subtrees. Pluck strings matching `^[a-z_]+\.[a-z0-9_]+$` from known keys: `entity_id`, `target.entity_id`, `service` (for `scene.turn_on` and `script.<slug>`), `to`, `from`, condition `state`.
4. **Build nodes.**
   - One per automation (`id: auto:<auto.id>`).
   - One per script slug, scene slug.
   - One per referenced entity_id (deduped).
5. **Build edges** by reference kind (data-flow direction):
   - trigger entity → auto
   - auto → action entity
   - condition entity → auto (rendered dashed)
   - auto → `script:<slug>` for `service: script.<slug>` or shorthand `action: <slug>`
   - auto → `scene:<slug>` for `service: scene.turn_on` with `entity_id: scene.<slug>`
   - auto → `template:<n>` for Jinja-templated targets that cannot be statically resolved
6. **Area inference.** Entity-id prefix split: `mb_*` → `mb`, `lr_*` → `lr`, `abi_*` → `abi`. Automations/scripts/scenes follow the same rule against their slugs. Everything else → `common`.
7. **Layout.** `@dagrejs/dagre`, `rankdir: LR`, `nodesep: 40`, `ranksep: 80` for the system map. Per-automation DAGs use `rankdir: TB`. Layout is deterministic for a given input.
8. **Write.** Pretty-printed JSON (2-space) to `terminus/public/graph.json`.

### Validation surface

- Plugin **warns** (does not error) on unknown entity references — typo signal. Summary printed at end of build. Manifest still emitted.
- Plugin errors only on YAML parse failure.

### Dev mode

- `configureServer` hook registers a chokidar watcher on `packages/`, `automations.yaml`, `scripts.yaml`, `scenes.yaml`.
- On change: rewrite `graph.json`. Runtime cache-busts by appending `?t=${Date.now()}` to the fetch URL in dev only.

### Dependencies added (build-only)

- `yaml`
- `@dagrejs/dagre`
- `fast-glob`

## 6. Runtime

### Hash router (`lib/router.ts`)

Minimal, no router dep:

```ts
type Route = { name: "map" } | { name: "auto"; id: string }
function parse(hash: string): Route
function useRoute(): Route        // useSyncExternalStore on 'hashchange'
function navigate(r: Route): void
```

HA panels own their URL hash safely — the outer HA route lives in the path component. App.tsx renders `<SystemMap>` or `<AutomationView id=...>` based on `useRoute()`. Back button performs real navigation.

### Manifest loader (`lib/graph.ts`)

```ts
let cached: Promise<Manifest> | null = null
export function loadManifest(): Promise<Manifest> {
  if (!cached) {
    const url = "/local/terminus/graph.json" + (import.meta.env.DEV ? `?t=${Date.now()}` : "")
    cached = fetch(url).then((r) => r.json())
  }
  return cached
}
```

Single fetch per session. Dev mode appends a timestamp for HMR cache-bust.

### Live state (`lib/liveState.ts`)

- One `subscribeEntities` call at the App root (already present).
- React context holds the `HassEntities` map.
- Node components subscribe via `useEntityState(entity_id)` and `useAutomationEnabled(auto_id)` — re-rendering only the affected node when its entity changes. React Flow memoization of node components stays intact.

### Node components (React Flow custom types)

- **AutomationNode** — pill with area color border-l-4 (`mb=teal`, `lr=amber`, `abi=violet`, `common=slate`), label, live `on/off` badge, `mode` chip if not `single`. Click → `navigate({ name: "auto", id })`.
- **EntityNode** — smaller pill, mono font for entity_id, live state badge.
- **ScriptNode / SceneNode** — distinct via icon (`lucide-react`) and border style. Same area-band rules.

### Edge styling (by `kind`)

| Kind          | Style                                      |
| ------------- | ------------------------------------------ |
| `trigger`     | Solid, arrow at automation                 |
| `condition`   | Dashed, arrow at automation                |
| `action`      | Solid, arrow at entity                     |
| `script_call` | Solid, icon mid-edge                       |
| `scene_call`  | Solid, icon mid-edge                       |
| `template`    | Dotted, arrow at synthetic `template:<n>`  |

### Empty + error states

- Manifest fetch 404: "Run `pnpm build` to generate the graph manifest."
- HA disconnected: existing status badge already covers it.
- Empty manifest (no autos parsed): CTA pointing at `packages/`.
- `generatedAt` older than 7 days: small banner "Manifest is N days old — run `bin/deploy-ssh.sh`."

### Dependencies added (runtime)

- `@xyflow/react` (React Flow v12+)

## 7. Testing

- **Vite plugin** — `vitest` unit tests against fixture YAML (a trimmed subset of real `packages/`). Assertions on manifest shape: node count by kind, edge kinds, area inference, line numbers. Layout `position` fields excluded from snapshots (dagre output is deterministic but visually noisy; covered by a separate "positions are finite numbers" smoke check).
- **Component smoke** — `<SystemMap manifest={fixture}>` rendered under `vitest` + `happy-dom`. Assert node count and that clicking an automation node calls `navigate`. No Playwright / e2e — overkill for a read-only panel.
- **Live state** — mock `connectHA` to return a canned `HassEntities` map. Assert badge updates on simulated state changes.
- **Pre-commit gate** — `pnpm typecheck && pnpm lint && pnpm build` on touched terminus files. `docker run ... check_config` on any `packages/` change remains the existing repo rule.

## 8. Risks + mitigations

1. **YAML edge cases.** `!include`, anchors, `service_template`, `data_template`, Jinja-templated entity_ids (`{{ trigger.entity_id }}`). Plugin handles anchors natively via `yaml`. Templated targets emit `kind: "template"` edges to a synthetic node. No Jinja evaluation.
2. **Area inference misses.** Refs without `mb_` / `lr_` / `abi_` prefix (e.g. `sun.sun`, `binary_sensor.is_dark`) fall into `common`. Acceptable; band stays neutral.
3. **Stale manifest after UI edit.** UI-edited automation in `automations.yaml` is only reflected after the next `pnpm build`. Documented; the 7-day banner is a cheap freshness signal.
4. **React Flow + Tailwind v4.** React Flow ships its own CSS; Tailwind v4 uses native CSS layers. Import React Flow CSS before Tailwind's layer to avoid override conflicts. Verify in `pnpm dev` and in the lib build before declaring done.
5. **Bundle size.** React Flow ≈ 80 KB gz. Dagre is build-only, not in the runtime bundle. Acceptable on a local network.

## 9. Out of scope (explicit cuts from brainstorm)

- Natural-language automation creator — separate spec, will use HA REST `POST /api/config/automation/config/<id>` directly with a dedicated admin LLAT (not the read-only MCP token).
- Node editing or drag-rewire.
- `last_triggered` glow / fire animation (deferred b3).
- Compound area parent nodes (deferred a2).
- elkjs auto-layout (dagre is enough).
- Trigger / condition / action Jinja evaluation.
- Mobile-specific layout.

## 10. Deliverables

1. `terminus/vite-plugin-graph.ts` — implementation per §5.
2. `terminus/src/lib/{router,graph,liveState}.ts`.
3. `terminus/src/routes/{SystemMap,AutomationView}.tsx`.
4. `terminus/src/components/{AutomationNode,EntityNode,ScriptNode,SceneNode}.tsx`.
5. `terminus/src/App.tsx` updated to host the router and replace the current entity-list scaffold.
6. Tests under `terminus/src/**/__tests__/` and `terminus/vite-plugin-graph.test.ts`.
7. Updated `terminus/package.json` with the new deps and a `test` script.
