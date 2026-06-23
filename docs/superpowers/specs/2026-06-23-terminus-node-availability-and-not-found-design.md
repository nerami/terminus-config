# Terminus topology: flag unavailable/unknown nodes + not-found error

**Date:** 2026-06-23
**Add-on:** `local_terminus` (`addons/terminus/`)
**Status:** approved design

## Problem

Three related gaps in the Terminus topology diagram, surfaced while cleaning up
orphaned automation entities in Home Assistant:

1. **Orphaned/unavailable entities are rendered identically to healthy ones.**
   The HA entity registry keeps a row for every automation/scene/entity it has
   ever seen; deleting the backing config leaves a "restored" entity reporting
   `unavailable`. Terminus builds its graph from `get_states` with no state
   filter, so it faithfully surfaces these — but gives the user no visual signal
   that a node is degraded.

2. **Navigating to a deleted entity shows an empty canvas + a misleading hint.**
   `useAutomationDetail` returns a *truthy fallback* `AutomationDetail` for an
   automation that is absent from the topology snapshot. That makes
   `showAutomationHint` fire, so a deep-link (or stale URL) to a deleted
   automation renders an empty canvas with the "Run this automation to see its
   real flow" nudge — which is wrong; the automation no longer exists.

3. **The "run it once" hint sits at the top of the canvas**, where it overlaps
   the breadcrumb/controls region. It should sit at the bottom-middle.

The root cause of (1) and (2) is the same: **the topology snapshot drops live
state.** `build_topology` has each entity's `state` in hand but only extracts
`attributes`, so the frontend cannot distinguish healthy / unavailable / unknown
/ deleted.

## Scope

In scope:

- Thread live `state` through the topology snapshot (backend → types → node data).
- Visually flag `unavailable` and `unknown` nodes (2D react-flow + 3D reagraph).
- Replace the empty-canvas-with-hint behaviour for a deleted target with a
  proper not-found error + a back action.
- Move the automation hint to bottom-middle.

Out of scope (YAGNI):

- The entity detail modal. It is transient and not deep-linkable — it only opens
  from a node already present in the current graph, so it cannot target a
  deleted entity. (It fetches live state on open and can surface its own errors
  independently if that ever changes.)
- Auto-refreshing topology when an entity's state changes. The snapshot reflects
  state at fetch time; the existing reload affordance is sufficient.
- Filtering/hiding unavailable nodes. The decision is to *flag*, not hide — an
  ops view benefits from surfacing cruft.

## Design

### 1. Backend: state passthrough

`backend/app/ha_registry.py::build_topology` already iterates
`state_by_entity.items()` with the full `state` dict in scope. Add the live
state string to each normalized record:

- `out_entities`, `out_scenes`, `out_automations` each gain
  `"state": state.get("state")`.

No new IO; this is a pure-normalization change. The value is whatever HA reports
(`"on"`, `"off"`, `"unavailable"`, `"unknown"`, scene timestamps, etc.).

### 2. Types

`frontend/src/lib/ha-graph/types.ts` — add to `HaEntity`, `HaScene`,
`HaAutomation`:

```ts
state: string | null;
```

### 3. Availability derivation (pure)

New pure helper in `build.ts` (co-located with `GraphNodeData`/`NodeKind`):

```ts
export type Availability = 'ok' | 'unavailable' | 'unknown';

export function availabilityOf(state: string | null | undefined): Availability {
  if (state === 'unavailable') return 'unavailable';
  if (state === 'unknown') return 'unknown';
  return 'ok';
}
```

`GraphNodeData` (in `build.ts`) gains an optional field:

```ts
/** Live-state health for entity/scene/automation nodes (absent for flow steps,
 *  groups, and areas). */
availability?: Availability;
```

The node builders for **entity**, **scene**, and **automation** nodes
(`buildEntitiesGraph`, `buildScenesGraph`, `buildAutomationsGraph`,
`buildAreaGraph`, and the single-entity scene/automation builders where the node
represents a topology entity) set `availability: availabilityOf(item.state)`.
Flow-step nodes (trigger/condition/.../stop), group nodes, and area nodes do not
set it.

### 4. 2D rendering (`components/graph/nodes.tsx`)

`NodeShell` reads `data.availability`:

- **`unavailable`**: dashed border (`border-dashed`), muted icon tile (render the
  accent tile in a gray, e.g. the muted/slate tone rather than the kind accent),
  and an amber warning badge (`AlertTriangle`, lucide) pinned to the corner of
  the icon tile.
- **`unknown`**: solid border (unchanged), kind accent kept, with a distinct
  badge icon (`CircleHelp`, lucide) pinned to the icon-tile corner.
- **`ok`** / unset: unchanged.

The badge must not collide with the existing `dimmed` (opacity-25),
`emphasized` (ring), or `isSelected` (ring) decorations — it is an additive
overlay on the icon tile, and the border-style/tile-color changes are
independent of the ring decorations.

### 5. 3D rendering (`components/graph/graph-canvas-3d.tsx`, `graph-3d-style.ts`)

3D nodes are colored Platonic solids with a billboard ring — no borders or
badges. Map availability to color, mirroring the existing 2D-CSS-vars → 3D-hex
parallel-palette pattern. Two pure helpers in `graph-3d-style.ts`:

```ts
export function fill3dFor(kind: NodeKind, availability?: Availability): string;
export function ring3dFor(kind: NodeKind, availability?: Availability): string;
```

- **`unavailable`**: fill → muted gray; ring → amber (`#f59e0b`) — strong warning.
- **`unknown`**: fill → kind fill (unchanged); ring → distinct slate tone — mild.
- **`ok`**: fill `KIND_FILL[kind]`, ring per existing logic.

The 3D node mapping (`fill`) and the custom node symbol's `ringColor` call these
helpers. The existing "hot/selected" highlight color still takes precedence over
the availability ring (selection feedback must remain legible).

### 6. Not-found error

**Detection (pure):** new helper in `atoms.ts` (alongside `GraphView` and
`viewScope`):

```ts
export function isMissingTarget(topology: Topology | null, view: GraphView): boolean;
```

Returns `true` only when `topology` is loaded (non-null) **and** the view targets
a specific id that is absent:

- `view.kind === 'automation'` and no `topology.automations` has that `entity_id`
- `view.kind === 'scene'` and no `topology.scenes` has that `entity_id`
- `view.kind === 'area'` and no `topology.areas` has that `area_id`

Returns `false` for list/aggregate views and while topology is still loading (so
the initial load does not flash a false "not found").

**Hook (`use-topology-graph.ts`):** expose

- `notFound: boolean` — `isMissingTarget(topology, view)`
- `goBack: () => void` — `setView` to the parent list of the current kind
  (`automation`→`automations`, `scene`→`scenes`, `area`→`areas`)

and **suppress the hint** when not found:

```ts
const showAutomationHint = !notFound && view.kind === 'automation' && /* …existing… */;
```

**Overlay (`components/graph/canvas-overlays.tsx`):** new
`CanvasNotFound({ kind, onBack })` — full-canvas centered message keyed to the
kind ("This automation no longer exists — it may have been deleted." /
scene / area wording) plus a back button wired to `onBack`. Both the 2D
(`graph-canvas.tsx`) and 3D (`graph-canvas-3d.tsx`) canvases render it when
`notFound` is true, in place of the empty graph and instead of the hint.

### 7. Move the hint (`canvas-overlays.tsx`)

`AutomationHint` container className: change `top-3` → `bottom-3`. Keep the
`sm:left-1/2 sm:-translate-x-1/2` horizontal centering, the dismiss button, and
the per-automation `key` reset behaviour.

## Data flow

```
HA get_states ─▶ build_topology (adds `state`) ─▶ /ha/topology JSON
   ─▶ react-query topology cache ─▶ useTopologyData
       ├─▶ build.ts node builders ─▶ data.availability ─▶ 2D/3D node decoration
       └─▶ isMissingTarget(topology, view) ─▶ notFound ─▶ CanvasNotFound / suppress hint
```

## Error handling & edge cases

- **Topology still loading**: `isMissingTarget` returns `false` (topology null) →
  no false not-found flash; existing spinner path is unchanged.
- **`numeric_id` present but config 404s**: unchanged — still a *present*
  automation, so the existing fallback/hint path applies (only the
  truly-absent-from-topology case is "not found").
- **Selection highlight vs availability ring (3D)**: selection/hot color wins
  over the availability ring.
- **`dimmed` + availability (2D)**: independent — a de-highlighted unavailable
  node is both faded and dashed/badged; acceptable.

## Testing (TDD — pure functions first)

1. `availabilityOf` — maps `unavailable`/`unknown`/other/null/undefined.
2. `isMissingTarget` — present id → false; absent id → true; null topology →
   false; list views → false; each of automation/scene/area.
3. `fill3dFor` / `ring3dFor` — color per (kind, availability).
4. Backend `tests/test_ha_registry.py` — normalized entities/scenes/automations
   carry `state`; an `unavailable` entity round-trips its state.
5. `build.ts` — entity/scene/automation nodes carry the derived `availability`;
   flow/group/area nodes do not.
6. 2D node render (`@testing-library/react`) — dashed border + warning badge for
   `unavailable`; solid border + distinct badge for `unknown`; nothing extra for
   `ok`.
7. 3D — `@react-three/test-renderer` scene-graph assertion that an unavailable
   node uses the gray fill / amber ring (or assert via the extracted pure helpers
   if the scene-graph assertion is too brittle).
8. Not-found behaviour — `useTopologyGraph` (or the canvas) renders
   `CanvasNotFound` and does **not** show the hint when the target is missing.

## Files touched

- `addons/terminus/backend/app/ha_registry.py` (+ `tests/test_ha_registry.py`)
- `addons/terminus/frontend/src/lib/ha-graph/types.ts`
- `addons/terminus/frontend/src/lib/ha-graph/build.ts` (+ test)
- `addons/terminus/frontend/src/lib/ha-graph/use-topology-graph.ts` (+ test)
- `addons/terminus/frontend/src/components/graph/nodes.tsx` (+ test)
- `addons/terminus/frontend/src/components/graph/graph-3d-style.ts` (+ test)
- `addons/terminus/frontend/src/components/graph/graph-canvas-3d.tsx`
- `addons/terminus/frontend/src/components/graph/graph-canvas.tsx`
- `addons/terminus/frontend/src/components/graph/canvas-overlays.tsx`
- `addons/terminus/frontend/src/lib/ha-graph/atoms.ts` (`isMissingTarget` + test)

## Release

Per `addons/terminus/CLAUDE.md`: bump `config.yaml` `version` once, add a matching
`CHANGELOG.md` entry. No per-iteration bumps.
