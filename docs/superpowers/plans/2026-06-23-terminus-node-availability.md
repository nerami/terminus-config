# Terminus Node Availability & Not-Found Error — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flag `unavailable`/`unknown` entities in the Terminus topology diagram, replace the empty-canvas+misleading-hint behaviour when navigating to a deleted entity with a proper not-found error, and move the automation hint to the bottom-middle.

**Architecture:** The topology snapshot currently drops live state. We thread `state` through the backend normalizer → topology types, derive an `Availability` per node via a single centralized decoration pass keyed on each node's `entityId`, and render it (2D: dashed border + badge; 3D: muted fill + ring). A pure `isMissingTarget` predicate drives a `CanvasNotFound` overlay and suppresses the hint.

**Tech Stack:** Python/FastAPI backend (pytest), React + Vite + TypeScript frontend (vitest, @testing-library/react, @xyflow/react, reagraph, jotai, nuqs).

## Global Constraints

- **Version:** `addons/terminus/config.yaml` `version` is the single canonical version — bump it once (`0.20.0` → `0.21.0`) and add a matching `CHANGELOG.md` entry. Do NOT bump `frontend/package.json` or `backend/pyproject.toml` (pinned `0.0.0`).
- **Package manager:** pnpm only (never `npm install`). Build uses `pnpm install --frozen-lockfile`.
- **TDD:** test first, watch it fail, implement minimal, watch it pass. Commit per task.
- **Commits:** Conventional Commits. End commit messages with the repo's `Co-Authored-By:` / `Claude-Session:` trailers.
- **`state` field is optional** (`state?: string | null`) on topology types so the 6 existing `Topology` fixtures don't need editing; a missing state derives `availability: 'ok'`.
- Frontend commands run from `addons/terminus/frontend`; backend from `addons/terminus/backend`; git from the repo worktree root.
- Branch: `features/terminus-node-availability` (already created; the spec commit is its first commit).

---

### Task 1: Backend — carry live `state` into the topology snapshot

**Files:**
- Modify: `addons/terminus/backend/app/ha_registry.py` (the `build_topology` loop, ~lines 146-174)
- Test: `addons/terminus/backend/tests/test_ha_registry.py`

**Interfaces:**
- Produces: each `out_scenes` / `out_automations` / `out_entities` record gains a `"state"` key (the raw HA state string, or `None` when absent).

- [ ] **Step 1: Write the failing test**

Add to `addons/terminus/backend/tests/test_ha_registry.py`:

```python
def test_build_topology_carries_live_state():
    states = [
        {
            "entity_id": "automation.dead",
            "state": "unavailable",
            "attributes": {"friendly_name": "Dead", "id": "42"},
        },
        {"entity_id": "light.lamp", "state": "on", "attributes": {"friendly_name": "Lamp"}},
        {
            "entity_id": "scene.movie",
            "state": "2024-01-01T00:00:00",
            "attributes": {"friendly_name": "Movie", "entity_id": ["light.lamp"]},
        },
    ]
    topo = build_topology([], [], [], states)
    assert {a["entity_id"]: a["state"] for a in topo["automations"]} == {"automation.dead": "unavailable"}
    assert {e["entity_id"]: e["state"] for e in topo["entities"]} == {"light.lamp": "on"}
    assert {s["entity_id"]: s["state"] for s in topo["scenes"]} == {"scene.movie": "2024-01-01T00:00:00"}


def test_build_topology_state_defaults_to_none_when_absent():
    topo = build_topology([], [], [], [{"entity_id": "light.x", "attributes": {}}])
    assert topo["entities"][0]["state"] is None
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py -k "carries_live_state or state_defaults" -v`
Expected: FAIL with `KeyError: 'state'`.

- [ ] **Step 3: Write minimal implementation**

In `addons/terminus/backend/app/ha_registry.py`, add `"state": state.get("state")` to each of the three appended dicts in the `for entity_id, state in state_by_entity.items()` loop:

```python
        if domain == "scene":
            out_scenes.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "entities": list(attrs.get("entity_id") or []),
                }
            )
        elif domain == "automation":
            out_automations.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "numeric_id": attrs.get("id"),
                }
            )
        else:
            out_entities.append(
                {
                    "entity_id": entity_id,
                    "name": name,
                    "domain": domain,
                    "area_id": area_id,
                    "state": state.get("state"),
                    "device_id": reg.get("device_id"),
                    "device_name": device_name(reg.get("device_id")),
                }
            )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/backend && python -m pytest tests/test_ha_registry.py -v`
Expected: PASS (all tests, including the pre-existing ones).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/backend/app/ha_registry.py addons/terminus/backend/tests/test_ha_registry.py
git commit -m "feat(terminus): carry live entity state into the topology snapshot

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 2: Frontend types + `availabilityOf`

**Files:**
- Modify: `addons/terminus/frontend/src/lib/ha-graph/types.ts` (`HaEntity`, `HaScene`, `HaAutomation`)
- Modify: `addons/terminus/frontend/src/lib/ha-graph/build.ts` (add `Availability`, `availabilityOf`, `GraphNodeData.availability`)
- Test: `addons/terminus/frontend/src/lib/ha-graph/build.test.ts`

**Interfaces:**
- Consumes: backend `state` field (Task 1).
- Produces: `export type Availability = 'ok' | 'unavailable' | 'unknown'`; `export function availabilityOf(state: string | null | undefined): Availability`; `GraphNodeData.availability?: Availability`.

- [ ] **Step 1: Write the failing test**

Add to `addons/terminus/frontend/src/lib/ha-graph/build.test.ts` (extend the existing import from `./build` to include `availabilityOf`):

```ts
describe('availabilityOf', () => {
  it('flags unavailable and unknown, treats everything else as ok', () => {
    expect(availabilityOf('unavailable')).toBe('unavailable');
    expect(availabilityOf('unknown')).toBe('unknown');
    expect(availabilityOf('on')).toBe('ok');
    expect(availabilityOf(null)).toBe('ok');
    expect(availabilityOf(undefined)).toBe('ok');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/build.test.ts -t availabilityOf`
Expected: FAIL — `availabilityOf is not a function` / import error.

- [ ] **Step 3: Write minimal implementation**

In `types.ts`, add `state?: string | null;` to each interface:

```ts
export interface HaEntity {
  area_id: string | null;
  device_id: string | null;
  device_name: string | null;
  domain: string;
  entity_id: string;
  name: string;
  state?: string | null;
}

export interface HaScene {
  area_id: string | null;
  entities: string[];
  entity_id: string;
  name: string;
  state?: string | null;
}

export interface HaAutomation {
  area_id: string | null;
  entity_id: string;
  name: string;
  numeric_id: string | null;
  references: ReferencedIds;
  state?: string | null;
}
```

In `build.ts`, add near the top (after the `NodeKind` type) and a field to `GraphNodeData`:

```ts
export type Availability = 'ok' | 'unavailable' | 'unknown';

/** Map an HA state string to a node health bucket. Missing/other states are ok. */
export function availabilityOf(state: string | null | undefined): Availability {
  if (state === 'unavailable') return 'unavailable';
  if (state === 'unknown') return 'unknown';
  return 'ok';
}
```

```ts
export interface GraphNodeData {
  [key: string]: unknown;
  areaId?: string;
  automationId?: string;
  /** Live-state health for entity/scene/automation nodes (unset for flow steps,
   *  groups, and areas). Stamped by decorateAvailability. */
  availability?: Availability;
  dimmed?: boolean;
  // …existing fields unchanged…
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/build.test.ts -t availabilityOf`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/frontend/src/lib/ha-graph/types.ts addons/terminus/frontend/src/lib/ha-graph/build.ts addons/terminus/frontend/src/lib/ha-graph/build.test.ts
git commit -m "feat(terminus): add state to topology types + availabilityOf helper

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 3: `decorateAvailability` pass + wire into `useTopologyGraph`

**Files:**
- Modify: `addons/terminus/frontend/src/lib/ha-graph/build.ts` (add `decorateAvailability`)
- Modify: `addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.ts` (apply it to `baseGraph`)
- Test: `addons/terminus/frontend/src/lib/ha-graph/build.test.ts`

**Interfaces:**
- Consumes: `availabilityOf` (Task 2), `RFGraph`, `Topology`.
- Produces: `export function decorateAvailability(graph: RFGraph, topology: Topology): RFGraph` — returns a new graph with `data.availability` stamped on every node whose `data.entityId` is found in the topology's state map.

- [ ] **Step 1: Write the failing test**

Add to `build.test.ts` (extend the `./build` import to include `decorateAvailability` and the `RFGraph` type import):

```ts
describe('decorateAvailability', () => {
  it('stamps availability on nodes by entityId and leaves flow steps untouched', () => {
    const topo: Topology = {
      areas: [],
      entities: [
        { entity_id: 'light.x', name: 'X', domain: 'light', area_id: null, device_id: null, device_name: null, state: 'unavailable' },
      ],
      scenes: [],
      automations: [],
    };
    const graph: RFGraph = {
      nodes: [
        { id: 'light.x', position: { x: 0, y: 0 }, data: { kind: 'entity', label: 'X', entityId: 'light.x' } },
        { id: 'action/0', position: { x: 0, y: 0 }, data: { kind: 'action', label: 'do' } },
      ],
      edges: [],
    };
    const out = decorateAvailability(graph, topo);
    expect(out.nodes[0].data.availability).toBe('unavailable');
    expect(out.nodes[1].data.availability).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/build.test.ts -t decorateAvailability`
Expected: FAIL — `decorateAvailability is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `build.ts`:

```ts
/**
 * Stamp `data.availability` onto every entity/scene/automation node by looking
 * up the node's `entityId` in the topology's live-state map. Nodes without an
 * `entityId` in that map (flow steps, group headers, areas) are left untouched.
 * Pure: returns a new graph, mutates nothing.
 */
export function decorateAvailability(graph: RFGraph, topology: Topology): RFGraph {
  const stateById = new Map<string, string | null | undefined>();
  for (const e of topology.entities) stateById.set(e.entity_id, e.state);
  for (const s of topology.scenes) stateById.set(s.entity_id, s.state);
  for (const a of topology.automations) stateById.set(a.entity_id, a.state);

  const nodes = graph.nodes.map((n) => {
    const id = n.data.entityId;
    if (!id || !stateById.has(id)) return n;
    return { ...n, data: { ...n.data, availability: availabilityOf(stateById.get(id)) } };
  });
  return { nodes, edges: graph.edges };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/build.test.ts -t decorateAvailability`
Expected: PASS.

- [ ] **Step 5: Wire it into the hook**

In `use-topology-graph.ts`, add `decorateAvailability` to the import from `@/lib/ha-graph/build`, then replace the `baseGraph` useMemo body so every view's graph is decorated before return:

```ts
  const baseGraph = useMemo<RFGraph>(() => {
    if (!topology) return EMPTY_GRAPH;
    let g: RFGraph = EMPTY_GRAPH;
    if (view.kind === 'areas') g = buildAreasGraph(topology);
    else if (view.kind === 'area') g = buildAreaGraph(topology, view.areaId);
    else if (view.kind === 'scene') {
      const scene = topology.scenes.find((s) => s.entity_id === view.sceneId);
      g = scene ? buildSceneGraph(topology, scene) : EMPTY_GRAPH;
    } else if (view.kind === 'automation') {
      const automation = topology.automations.find((a) => a.entity_id === view.automationId);
      g = automation && automationDetail ? buildAutomationGraph(topology, automation, automationDetail) : EMPTY_GRAPH;
    } else if (view.kind === 'scenes') g = buildScenesGraph(topology);
    else if (view.kind === 'automations') g = buildAutomationsGraph(topology);
    else if (view.kind === 'entities') g = buildEntitiesGraph(topology);
    return decorateAvailability(g, topology);
  }, [topology, view, automationDetail]);
```

- [ ] **Step 6: Run the hook + build tests to verify nothing broke**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/build.test.ts src/lib/ha-graph/use-topology-graph.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add addons/terminus/frontend/src/lib/ha-graph/build.ts addons/terminus/frontend/src/lib/ha-graph/build.test.ts addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.ts
git commit -m "feat(terminus): stamp node availability from live topology state

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 4: 2D node rendering — dashed border + badge

**Files:**
- Modify: `addons/terminus/frontend/src/components/graph/nodes.tsx` (`NodeShell`)
- Test: `addons/terminus/frontend/src/components/graph/nodes.test.tsx`

**Interfaces:**
- Consumes: `GraphNodeData.availability` (Task 2/3).
- Produces: an `unavailable` node renders with `border-dashed`, a gray icon tile, and a badge labelled `Unavailable`; an `unknown` node keeps a solid border and renders a badge labelled `Unknown state`.

- [ ] **Step 1: Write the failing test**

In `nodes.test.tsx`, extend the `TestNodeProps` type to allow `availability`, then add a describe block:

```ts
type TestNodeProps = {
  data: { label: string; sublabel?: string; interactive?: boolean; availability?: 'ok' | 'unavailable' | 'unknown' };
};
```

```ts
describe('availability flags', () => {
  it('marks an unavailable node with a dashed border and a warning badge', () => {
    const { container } = render(
      <ReactFlowProvider>
        <EntityNode data={{ label: 'Dead', interactive: false, availability: 'unavailable' }} />
      </ReactFlowProvider>,
    );
    expect(screen.getByLabelText('Unavailable')).toBeInTheDocument();
    expect(container.querySelector('.border-dashed')).not.toBeNull();
  });

  it('marks an unknown node with its own badge and keeps a solid border', () => {
    const { container } = render(
      <ReactFlowProvider>
        <EntityNode data={{ label: 'Hmm', interactive: false, availability: 'unknown' }} />
      </ReactFlowProvider>,
    );
    expect(screen.getByLabelText('Unknown state')).toBeInTheDocument();
    expect(container.querySelector('.border-dashed')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/nodes.test.tsx -t "availability flags"`
Expected: FAIL — no element labelled `Unavailable`.

- [ ] **Step 3: Write minimal implementation**

In `nodes.tsx`, add `AlertTriangle` and `CircleHelp` to the lucide import, and rewrite `NodeShell`:

```tsx
function NodeShell({
  accent,
  className,
  data,
  icon: Icon,
}: {
  data: GraphNodeData;
  accent: string;
  icon: LucideIcon;
  className?: string;
}) {
  const unavailable = data.availability === 'unavailable';
  const unknown = data.availability === 'unknown';
  return (
    <div
      className={cn(
        'bg-card flex max-w-[220px] min-w-[150px] items-center gap-2 border px-3 py-2 shadow-sm transition-all',
        data.interactive && 'cursor-pointer hover:shadow-md',
        data.dimmed && 'opacity-25',
        data.emphasized && 'ring-2 ring-offset-1',
        data.isSelected && 'ring-primary ring-2 ring-offset-2',
        unavailable && 'border-dashed',
        className,
      )}
      style={data.emphasized && !data.isSelected ? ({ '--tw-ring-color': accent } as React.CSSProperties) : undefined}
    >
      <span
        className="relative flex size-7 shrink-0 items-center justify-center text-white"
        style={{ backgroundColor: unavailable ? 'var(--muted-foreground)' : accent }}
      >
        <Icon className="size-4" />
        {(unavailable || unknown) && (
          <span
            aria-label={unavailable ? 'Unavailable' : 'Unknown state'}
            className={cn(
              'absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full text-white',
              unavailable ? 'bg-amber-500' : 'bg-slate-400',
            )}
          >
            {unavailable ? <AlertTriangle className="size-2.5" /> : <CircleHelp className="size-2.5" />}
          </span>
        )}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{data.label}</div>
        {data.sublabel && <div className="text-muted-foreground truncate text-xs">{data.sublabel}</div>}
      </div>
    </div>
  );
}
```

Note: the pre-existing "has no rounded utility classes" tests render nodes *without* an `availability`, so no badge (and no `rounded-full`) is emitted for them — they keep passing.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/nodes.test.tsx`
Expected: PASS (new + pre-existing).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/frontend/src/components/graph/nodes.tsx addons/terminus/frontend/src/components/graph/nodes.test.tsx
git commit -m "feat(terminus): flag unavailable/unknown nodes in the 2D diagram

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 5: 3D rendering — `fill3dFor` / `ring3dFor`

**Files:**
- Modify: `addons/terminus/frontend/src/components/graph/graph-3d-style.ts`
- Modify: `addons/terminus/frontend/src/components/graph/graph-canvas-3d.tsx`
- Test: `addons/terminus/frontend/src/components/graph/graph-3d-style.test.ts`

**Interfaces:**
- Consumes: `Availability`, `NodeKind`, `KIND_FILL`.
- Produces: `export function fill3dFor(kind: NodeKind, availability?: Availability): string`; `export function ring3dFor(kind: NodeKind, availability?: Availability): string`.

- [ ] **Step 1: Write the failing test**

In `graph-3d-style.test.ts`, extend the import to include `KIND_FILL, fill3dFor, ring3dFor` and add:

```ts
describe('fill3dFor', () => {
  it('grays out unavailable nodes and keeps the kind fill otherwise', () => {
    expect(fill3dFor('entity', 'unavailable')).toBe('#64748b');
    expect(fill3dFor('entity', 'unknown')).toBe(KIND_FILL.entity);
    expect(fill3dFor('entity', 'ok')).toBe(KIND_FILL.entity);
    expect(fill3dFor('entity', undefined)).toBe(KIND_FILL.entity);
  });
});

describe('ring3dFor', () => {
  it('uses an amber ring for unavailable and a slate ring for unknown', () => {
    expect(ring3dFor('entity', 'unavailable')).toBe('#f59e0b');
    expect(ring3dFor('entity', 'unknown')).toBe('#94a3b8');
    expect(ring3dFor('entity', 'ok')).toBe(KIND_FILL.entity);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/graph-3d-style.test.ts -t "fill3dFor or ring3dFor"`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Write minimal implementation**

In `graph-3d-style.ts`, add the `Availability` type to the existing `import type { NodeKind } from '@/lib/ha-graph/build';` line (→ `import type { Availability, NodeKind } from '@/lib/ha-graph/build';`) and append:

```ts
// Degraded-node tones. 3D solids can't show the 2D dashed border / badge, so we
// signal health through fill + ring color instead (same spirit as the 2D→3D
// palette parallel above).
const UNAVAILABLE_FILL = '#64748b'; // slate-500
const WARN_RING = '#f59e0b'; // amber-500
const UNKNOWN_RING = '#94a3b8'; // slate-400

/** Solid fill for a 3D node: gray when unavailable, the kind color otherwise. */
export function fill3dFor(kind: NodeKind, availability?: Availability): string {
  return availability === 'unavailable' ? UNAVAILABLE_FILL : KIND_FILL[kind];
}

/** Resting ring color: amber (unavailable), slate (unknown), else the kind color. */
export function ring3dFor(kind: NodeKind, availability?: Availability): string {
  if (availability === 'unavailable') return WARN_RING;
  if (availability === 'unknown') return UNKNOWN_RING;
  return KIND_FILL[kind];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/graph-3d-style.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire into the 3D canvas**

In `graph-canvas-3d.tsx`:
- Change the import `import { KIND_FILL, KIND_ORDER, sizeForKind } from './graph-3d-style';` to `import { KIND_ORDER, sizeForKind, fill3dFor, ring3dFor } from './graph-3d-style';` (KIND_FILL is no longer referenced after the two edits below).
- In the `nodes` useMemo, change `fill: KIND_FILL[data.kind],` to `fill: fill3dFor(data.kind, data.availability),`.
- In `renderNode`, replace the kind/ring lines:

```ts
      const { kind, availability } = node.data as GraphNodeData;
      const hot = sel || active;
      const ringColor = hot ? color : ring3dFor(kind, availability);
```

- [ ] **Step 6: Typecheck + 3D-related tests**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/graph-3d-style.test.ts && pnpm exec tsc --noEmit`
Expected: PASS, no type errors (confirms `KIND_FILL` removal left no dangling refs).

- [ ] **Step 7: Commit**

```bash
git add addons/terminus/frontend/src/components/graph/graph-3d-style.ts addons/terminus/frontend/src/components/graph/graph-3d-style.test.ts addons/terminus/frontend/src/components/graph/graph-canvas-3d.tsx
git commit -m "feat(terminus): flag unavailable/unknown nodes in the 3D diagram

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 6: `isMissingTarget` predicate

**Files:**
- Modify: `addons/terminus/frontend/src/lib/ha-graph/atoms.ts`
- Test: `addons/terminus/frontend/src/lib/ha-graph/atoms.test.ts` (create)

**Interfaces:**
- Produces: `export function isMissingTarget(topology: Topology | null, view: GraphView): boolean` — true only when topology is loaded and the view targets an automation/scene/area id absent from it (the `__unassigned__` pseudo-area counts as present).

- [ ] **Step 1: Write the failing test**

Create `addons/terminus/frontend/src/lib/ha-graph/atoms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import type { Topology } from './types';

import { isMissingTarget } from './atoms';
import { UNASSIGNED_AREA_ID } from './types';

const topo: Topology = {
  areas: [{ area_id: 'living', name: 'Living' }],
  entities: [],
  scenes: [{ entity_id: 'scene.movie', name: 'Movie', area_id: 'living', entities: [] }],
  automations: [
    { entity_id: 'automation.night', name: 'Night', area_id: 'living', numeric_id: '1', references: { entities: [], scenes: [], devices: [] } },
  ],
};

describe('isMissingTarget', () => {
  it('returns false while topology is loading', () => {
    expect(isMissingTarget(null, { kind: 'automation', areaId: '', automationId: 'automation.x' })).toBe(false);
  });

  it('flags an automation/scene/area absent from topology', () => {
    expect(isMissingTarget(topo, { kind: 'automation', areaId: '', automationId: 'automation.ghost' })).toBe(true);
    expect(isMissingTarget(topo, { kind: 'scene', areaId: '', sceneId: 'scene.ghost' })).toBe(true);
    expect(isMissingTarget(topo, { kind: 'area', areaId: 'attic' })).toBe(true);
  });

  it('passes present targets, list views, and the unassigned pseudo-area', () => {
    expect(isMissingTarget(topo, { kind: 'automation', areaId: '', automationId: 'automation.night' })).toBe(false);
    expect(isMissingTarget(topo, { kind: 'automations' })).toBe(false);
    expect(isMissingTarget(topo, { kind: 'area', areaId: UNASSIGNED_AREA_ID })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/atoms.test.ts`
Expected: FAIL — `isMissingTarget is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `atoms.ts`, add imports and the function:

```ts
import { UNASSIGNED_AREA_ID, type Topology } from './types';
```

```ts
/**
 * Whether the view targets a specific id (automation/scene/area) that is absent
 * from the loaded topology — i.e. the entity was deleted. Returns false while
 * topology is still loading (null) and for list/aggregate views, so a fresh load
 * never flashes a false "not found". The synthetic unassigned area always counts
 * as present.
 */
export function isMissingTarget(topology: Topology | null, view: GraphView): boolean {
  if (!topology) return false;
  switch (view.kind) {
    case 'automation':
      return !topology.automations.some((a) => a.entity_id === view.automationId);
    case 'scene':
      return !topology.scenes.some((s) => s.entity_id === view.sceneId);
    case 'area':
      return view.areaId !== UNASSIGNED_AREA_ID && !topology.areas.some((a) => a.area_id === view.areaId);
    default:
      return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/atoms.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/frontend/src/lib/ha-graph/atoms.ts addons/terminus/frontend/src/lib/ha-graph/atoms.test.ts
git commit -m "feat(terminus): add isMissingTarget predicate for deleted entities

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 7: Hook wiring — `notFoundKind`, `goBack`, suppress hint

**Files:**
- Modify: `addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.ts`
- Test: `addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.test.tsx`

**Interfaces:**
- Consumes: `isMissingTarget`, `groupingOf`, `rootViewFor` (from `./atoms`).
- Produces: on `TopologyGraph` — `notFoundKind: 'automation' | 'scene' | 'area' | null` and `goBack: () => void`; `showAutomationHint` is forced false when the target is missing.

- [ ] **Step 1: Write the failing test**

Add to `use-topology-graph.test.tsx` (note: an `automation` view requires `group=automations`, per `viewFromParams`):

```ts
it('flags a deleted automation as not found and suppresses the hint', () => {
  const { result } = setup('?group=automations&automation=automation.ghost');
  expect(result.current.notFoundKind).toBe('automation');
  expect(result.current.showAutomationHint).toBe(false);
});

it('reports no missing target for a healthy list view', () => {
  const { result } = setup('?group=automations');
  expect(result.current.notFoundKind).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/use-topology-graph.test.tsx -t "not found"`
Expected: FAIL — `notFoundKind` is `undefined`.

- [ ] **Step 3: Write minimal implementation**

In `use-topology-graph.ts`:
- Extend the `./atoms` import: `import { entityModalAtom, groupingOf, isMissingTarget, rootViewFor, selectedNodeAtom, viewScope } from '@/lib/ha-graph/atoms';`
- Add to the `TopologyGraph` interface:

```ts
  /** Navigate to the parent list view (used by the not-found overlay). */
  goBack: () => void;
  /** The kind of a deleted/absent target, or null when the view is healthy. */
  notFoundKind: 'automation' | 'scene' | 'area' | null;
```

- Inside the hook, after `automationId` is computed:

```ts
  const notFound = isMissingTarget(topology, view);
  const notFoundKind =
    notFound && (view.kind === 'automation' || view.kind === 'scene' || view.kind === 'area') ? view.kind : null;
  const goBack = useCallback(() => setView(rootViewFor(groupingOf(view))), [setView, view]);
```

- Change `showAutomationHint` to short-circuit when not found:

```ts
  const showAutomationHint =
    !notFoundKind &&
    view.kind === 'automation' &&
    !automationLoading &&
    !!automationDetail &&
    !automationHasStructure(automationDetail);
```

- Add `goBack` and `notFoundKind` to the returned object.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/lib/ha-graph/use-topology-graph.test.tsx`
Expected: PASS (new + pre-existing).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.ts addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.test.tsx
git commit -m "feat(terminus): expose notFoundKind + goBack, suppress hint when missing

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 8: `CanvasNotFound` overlay + reposition hint + render in both canvases

**Files:**
- Modify: `addons/terminus/frontend/src/components/graph/canvas-overlays.tsx`
- Modify: `addons/terminus/frontend/src/components/graph/graph-canvas.tsx`
- Modify: `addons/terminus/frontend/src/components/graph/graph-canvas-3d.tsx`
- Test: `addons/terminus/frontend/src/components/graph/canvas-overlays.test.tsx` (create)

**Interfaces:**
- Consumes: `notFoundKind`, `goBack` (Task 7).
- Produces: `export function CanvasNotFound({ kind, onBack }: { kind: 'automation' | 'scene' | 'area'; onBack: () => void })`; `AutomationHint` pinned to `bottom-3`.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus/frontend/src/components/graph/canvas-overlays.test.tsx`:

```ts
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AutomationHint, CanvasNotFound } from './canvas-overlays';

describe('CanvasNotFound', () => {
  it('shows a deleted-entity message and calls onBack when the button is clicked', () => {
    const onBack = vi.fn();
    render(<CanvasNotFound kind="automation" onBack={onBack} />);
    expect(screen.getByText(/no longer exists/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /back to automations/i }).click();
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('AutomationHint', () => {
  it('is pinned to the bottom of the canvas', () => {
    const { container } = render(<AutomationHint />);
    expect(container.querySelector('.bottom-3')).not.toBeNull();
    expect(container.querySelector('.top-3')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/canvas-overlays.test.tsx`
Expected: FAIL — `CanvasNotFound` not exported / `bottom-3` absent.

- [ ] **Step 3: Write minimal implementation**

In `canvas-overlays.tsx`:
- Change the `AutomationHint` container `className` from `... absolute top-3 right-3 left-3 z-10 ...` to `... absolute bottom-3 right-3 left-3 z-10 ...` (only `top-3` → `bottom-3`).
- Add `SearchX` to the lucide import and append the component:

```tsx
const NOT_FOUND_COPY: Record<'automation' | 'scene' | 'area', { body: string; back: string }> = {
  automation: { body: 'This automation no longer exists — it may have been deleted.', back: 'Back to automations' },
  scene: { body: 'This scene no longer exists — it may have been deleted.', back: 'Back to scenes' },
  area: { body: 'This area no longer exists — it may have been deleted.', back: 'Back to areas' },
};

/** Full-canvas error shown when the URL targets an entity absent from topology. */
export function CanvasNotFound({ kind, onBack }: { kind: 'automation' | 'scene' | 'area'; onBack: () => void }) {
  const copy = NOT_FOUND_COPY[kind];
  return (
    <div className="bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center backdrop-blur-sm">
      <SearchX className="text-muted-foreground size-10" />
      <p className="text-muted-foreground max-w-xs text-sm">{copy.body}</p>
      <button
        type="button"
        onClick={onBack}
        className="border-border hover:bg-muted cursor-pointer border px-3 py-1.5 text-sm font-medium shadow-sm"
      >
        {copy.back}
      </button>
    </div>
  );
}
```

In `graph-canvas.tsx`:
- Import: `import { AutomationHint, CanvasNotFound, CanvasSpinner } from './canvas-overlays';`
- Destructure `goBack` and `notFoundKind` from `useTopologyGraph()`.
- Add before the closing `</div>` of the canvas wrapper (next to the other overlays):

```tsx
      {notFoundKind && <CanvasNotFound kind={notFoundKind} onBack={goBack} />}
```

In `graph-canvas-3d.tsx`:
- Add `CanvasNotFound` to the `./canvas-overlays` import.
- Destructure `goBack` and `notFoundKind` from `useTopologyGraph()`.
- Render `{notFoundKind && <CanvasNotFound kind={notFoundKind} onBack={goBack} />}` alongside the existing `AutomationHint` / `CanvasSpinner` overlays in its returned JSX.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd addons/terminus/frontend && pnpm exec vitest run src/components/graph/canvas-overlays.test.tsx && pnpm exec tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus/frontend/src/components/graph/canvas-overlays.tsx addons/terminus/frontend/src/components/graph/canvas-overlays.test.tsx addons/terminus/frontend/src/components/graph/graph-canvas.tsx addons/terminus/frontend/src/components/graph/graph-canvas-3d.tsx
git commit -m "feat(terminus): not-found overlay for deleted entities + hint to bottom

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

### Task 9: Release — version bump, changelog, full verification

**Files:**
- Modify: `addons/terminus/config.yaml`
- Modify: `addons/terminus/CHANGELOG.md`

**Interfaces:** none (release bookkeeping).

- [ ] **Step 1: Bump the canonical version**

In `addons/terminus/config.yaml`, change `version: "0.20.0"` → `version: "0.21.0"`.

- [ ] **Step 2: Add the changelog entry**

In `addons/terminus/CHANGELOG.md`, insert directly above `## 0.20.0`:

```markdown
## 0.21.0

- **Unavailable and unknown entities are now flagged in the topology diagram.**
  Orphaned/offline nodes (state `unavailable`) render with a dashed border and an
  amber warning badge; entities reporting `unknown` get their own badge and keep a
  solid border. The 3D view mirrors this with a gray fill + amber ring
  (unavailable) and a slate ring (unknown).
- **Navigating to a deleted automation / scene / area now shows a clear "no
  longer exists" message with a back button**, instead of an empty canvas with a
  misleading "run it once" hint.
- The automation "run it once" hint moved from the top to the bottom-middle of
  the canvas so it no longer overlaps the breadcrumb and controls.
```

- [ ] **Step 3: Run the full verification suite**

Run (frontend):
```bash
cd addons/terminus/frontend && pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm lint && pnpm build
```
Expected: all tests pass, no type errors, lint clean, build succeeds.

Run (backend):
```bash
cd addons/terminus/backend && python -m pytest -q
```
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add addons/terminus/config.yaml addons/terminus/CHANGELOG.md
git commit -m "chore(terminus): release 0.21.0 — node availability flags + not-found error

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01NHCnjAqnfoU5XFcLnb452R"
```

---

## Self-Review

**Spec coverage:**
- Backend state passthrough → Task 1 ✓
- Types `state` field → Task 2 ✓
- `availabilityOf` → Task 2 ✓; `GraphNodeData.availability` → Task 2 ✓
- Node-builder availability (realized as centralized `decorateAvailability`) → Task 3 ✓
- 2D dashed border + amber badge (unavailable) / solid + distinct badge (unknown) → Task 4 ✓
- 3D `fill3dFor`/`ring3dFor` + wiring → Task 5 ✓
- `isMissingTarget` (incl. unassigned-area carve-out) → Task 6 ✓
- Hook `notFound`/`goBack` + hint suppression → Task 7 ✓
- `CanvasNotFound` + render in 2D & 3D + hint reposition → Task 8 ✓
- Release/changelog → Task 9 ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code.

**Type consistency:** `availabilityOf` / `Availability` (Task 2) consumed by `decorateAvailability` (Task 3), `fill3dFor`/`ring3dFor` (Task 5), and `GraphNodeData.availability` (rendered Task 4, read Task 5). `isMissingTarget` (Task 6) → `notFoundKind` (Task 7) → `CanvasNotFound kind` prop (Task 8) all use the same `'automation' | 'scene' | 'area'` union. `goBack` produced in Task 7, consumed in Task 8. Names consistent across tasks.

**Implementation note (refines spec):** The spec described per-builder availability stamping; the plan realizes the identical behaviour via a single `decorateAvailability` pass (DRY — every entity/scene/automation node already carries `data.entityId`). `state` is modeled as optional on the topology types to avoid editing six existing `Topology` test fixtures; a missing state derives `'ok'`.
