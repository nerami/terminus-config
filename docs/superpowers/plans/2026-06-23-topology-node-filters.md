# Plan: Topology node filters (search / status / domain) with highlight + dim

## Overview

Add per-node filters to the topology graph view. The group-by combobox chain
picks *which* nodes are in view; these filters operate *within* that set:
matching nodes stay lit, non-matching nodes dim (`opacity-25`), and edges
leaking to dimmed nodes mute. Filters reuse the **existing** decoration flags
(`data.dimmed`, `data.emphasized`, edge opacity) that selection-highlight
already drives in `graph-canvas.tsx`.

Three filters, all transient (jotai, reset on navigation):
- **Search** — case-insensitive substring on `label` / `entityId` / `domain`.
- **Status** — `All / OK / Unavailable / Unknown` vs `data.availability`.
- **Domain** — multi-select vs `data.domain`; only shown when the view has ≥2 domains.

Work happens in the add-on frontend:
`/Users/zrmn/Terminus/home-assistant/main/addons/terminus/frontend`.

## Global Constraints

- **TDD is mandatory.** Write the test, watch it fail for the right reason, then implement. Include RED/GREEN evidence.
- **Package manager is pnpm.** Run tests with `npx vitest run <path>`. Never `npm install`.
- **No new edge component and no new node visual vocabulary.** Reuse `data.dimmed` (→ `opacity-25`), `data.emphasized` (→ accent ring), and the edge-opacity pattern already in `graph-canvas.tsx` (active `1`, muted `0.06`, default `0.25`).
- **Filter overrides selection-highlight when active.** When a filter is active, dim/emphasis follow the filter, not `highlightSet`. The selected node still shows its `isSelected` ring and still opens the detail modal.
- **Visibility rule (exact):** a node is *visible* when `data.kind === 'group'` (structural) OR it is the selected node OR it is in the filter match set. Non-visible non-structural nodes are `dimmed`.
- **Edge rule (exact):** when a filter is active, an edge is active iff both endpoints are visible → opacity `1`; otherwise muted → opacity `0.06`. When no filter is active, edges keep today's selection-based behavior unchanged.
- **Combine semantics:** AND across the three filter types; OR within the domain multi-select. Missing `availability` is treated as `'ok'`.
- **Filters are transient.** They live in jotai atoms and reset to empty on navigation (in `useGraphView`'s `setView`, alongside the existing `selectedNode` clear). Not in the URL.
- **Controls use existing UI primitives:** search → `@/components/ui/input`; status → `@/components/ui/select`; domain multi-select → `@/components/ui/combobox` (`ComboboxChips`).
- **Do not bump `config.yaml` version** — this is iteration, not a release.
- **`tsc --noEmit` and `eslint` must pass** on changed files before committing.
- Match the surrounding code's style, naming, and comment density.

## Key existing interfaces (read these, do not redefine)

- `src/lib/ha-graph/build.ts`: `type Availability = 'ok' | 'unavailable' | 'unknown'`; `interface GraphNodeData { label, kind, domain?, entityId?, availability?, dimmed?, emphasized?, isSelected?, ... }`; `type RFNode = Node<GraphNodeData>`.
- `src/components/graph/graph-canvas.tsx`: existing `decoratedNodes` (lines ~66) and `decoratedEdges` (lines ~81) memos that set dim/emphasize/opacity from `highlightSet` + `selected`. `isStructural = n.data.kind === 'group'`.
- `src/lib/ha-graph/use-graph-view.ts`: `setView` already calls `setSelectedNode(null)`.
- `src/lib/ha-graph/atoms.ts`: existing `selectedNodeAtom`. Add the new atoms here.

---

## Task 1: Pure filter model — `node-filter.ts`

Create `src/lib/ha-graph/node-filter.ts` exporting a pure, dependency-free
(beyond types from `build.ts`) filter model. TDD with a new
`src/lib/ha-graph/node-filter.test.ts`.

Exact API:

```ts
import type { Availability, GraphNodeData, RFNode } from './build';

export type StatusFilter = Availability | 'all';

export interface NodeFilter {
  search: string;
  status: StatusFilter;
  domains: string[];
}

export const EMPTY_FILTER: NodeFilter = { search: '', status: 'all', domains: [] };

/** True when any filter dimension is narrowing the set. */
export function isFilterActive(f: NodeFilter): boolean;

/** Does one node's data satisfy ALL active filter dimensions? */
export function nodeMatchesFilter(data: GraphNodeData, f: NodeFilter): boolean;

/** Distinct, sorted domains present across the given nodes (for the multi-select). */
export function domainsOf(nodes: RFNode[]): string[];
```

Semantics (must be covered by tests):
- `isFilterActive`: false for `EMPTY_FILTER`; true if `search.trim()` non-empty, or `status !== 'all'`, or `domains.length > 0`.
- `nodeMatchesFilter`:
  - Search: case-insensitive substring; matches if the query is a substring of any of `label`, `entityId`, `domain` (skip undefined fields). Empty/whitespace search ⇒ this dimension passes.
  - Status: `status === 'all'` passes; else `(data.availability ?? 'ok') === status`.
  - Domain: empty `domains` passes; else `data.domain` must be present and included in `domains`.
  - All active dimensions must pass (AND).
- `domainsOf`: distinct, ascending sort; nodes without `domain` contribute nothing.

Tests to include (at least): inactive empty filter; search hit on label, on entityId, on domain, and a miss; case-insensitivity; status match + miss + missing-availability-treated-as-ok; domain OR membership + miss + node-without-domain; cross-type AND (passes one dim, fails another ⇒ false); `domainsOf` distinct+sorted, and empty when no domains.

**Acceptance:** `npx vitest run src/lib/ha-graph/node-filter.test.ts` green, output pristine; `tsc` + `eslint` clean.

---

## Task 2: Filter atoms + reset-on-navigation

In `src/lib/ha-graph/atoms.ts` add:

```ts
import { EMPTY_FILTER, type NodeFilter } from './node-filter';

/** Transient per-node filter (search/status/domain). Resets on navigation. */
export const nodeFilterAtom = atom<NodeFilter>(EMPTY_FILTER);

/** Domains present in the current view, published by the canvas for the domain multi-select. */
export const availableDomainsAtom = atom<string[]>([]);
```

In `src/lib/ha-graph/use-graph-view.ts`, make `setView` also reset the filter:
read `useSetAtom(nodeFilterAtom)` and call `setFilter(EMPTY_FILTER)` in the same
`setView` callback that already clears the selected node. Keep `setView`'s
external signature unchanged.

TDD: extend (or add) the test for `use-graph-view` to assert that calling
`setView` resets `nodeFilterAtom` to `EMPTY_FILTER` when it had been set to a
non-empty filter. Reuse the existing test harness/render pattern for that hook
(find how the current `use-graph-view` test renders the hook with nuqs +
jotai). If no such test file exists, add `use-graph-view.test.tsx` covering
just this reset behavior.

**Acceptance:** new/extended test green; `tsc` + `eslint` clean. Do not change any other `setView` behavior.

---

## Task 3: Graph-canvas integration — filterSet, publish domains, fold into decoration

Edit `src/components/graph/graph-canvas.tsx`. This is the integration seam.

1. Read the filter: `const filter = useAtomValue(nodeFilterAtom);` and
   `const filterActive = isFilterActive(filter);`.
2. Compute the match set over the current `nodes`:
   `const filterSet = useMemo(() => filterActive ? new Set(nodes.filter(n => nodeMatchesFilter(n.data, filter)).map(n => n.id)) : null, [nodes, filter, filterActive]);`
3. Publish available domains for the UI: in a `useEffect`, set
   `availableDomainsAtom` to `domainsOf(nodes)`, guarded so it only writes when
   the value actually changes (compare by join, or shallow-equal) to avoid
   render loops. Use `useSetAtom(availableDomainsAtom)`.
4. Fold the filter into the existing decoration memos. Define a visibility
   helper (per the Global Constraints visibility rule):
   `isVisible(node) = node.data.kind === 'group' || selected === node.id || (filterSet ? filterSet.has(node.id) : true)`.
   - In `decoratedNodes`: when `filterSet` is non-null, set
     `dimmed = !isVisible(n)` and `emphasized = false` (no ring-spam on matches;
     contrast carries the highlight). When `filterSet` is null, keep today's
     `highlightSet`-based dim/emphasize exactly as-is. `isSelected` unchanged.
   - In `decoratedEdges`: when `filterSet` is non-null, compute visibility of
     both endpoints (build an id→visible lookup or a `visibleIds` set once) and
     set opacity `1` if both visible else `0.06`. When `filterSet` is null, keep
     today's behavior exactly. Preserve all other edge style props.
   - Add `filterSet` (and anything it derives) to the relevant `useMemo`/dep arrays.

TDD: the existing `graph-canvas.test.tsx` stubs `@xyflow/react`'s `ReactFlow`
and captures the props it receives (`lastReactFlowProps`). Use that seam: with
`nodeFilterAtom` set to a filter that matches a subset, assert the `nodes`
prop has matching nodes un-dimmed (`data.dimmed` falsy) and non-matching
non-structural nodes `data.dimmed === true`, and the `edges` prop has edges
between two dimmed nodes at opacity `0.06` while an edge between two visible
nodes is `1`. Mock the new atoms/data as needed, following the file's existing
jotai/atoms mocking style. Keep the existing graph-canvas tests passing.

**Acceptance:** `npx vitest run src/components/graph/graph-canvas.test.tsx` green; `tsc` + `eslint` clean. No change to behavior when no filter is active (existing tests stay green).

---

## Task 4: TopologyFilters UI — search / status / domain controls

Edit `src/components/graph/topology-filters.tsx` to render a filter row beneath
the existing group-by combobox chain, bound to `nodeFilterAtom`. Extend
`src/components/graph/topology-filters.test.tsx`.

Controls (all update `nodeFilterAtom` via `useSetAtom`; read current via `useAtomValue`):
- **Search:** `Input` from `@/components/ui/input`, `aria-label="Filter nodes"`,
  placeholder e.g. `Filter…`. Writes `filter.search`.
- **Status:** `Select` from `@/components/ui/select` with options
  `All` (`all`), `OK` (`ok`), `Unavailable` (`unavailable`), `Unknown` (`unknown`),
  `aria-label="Filter by status"`. Writes `filter.status`.
- **Domain:** multi-select using `@/components/ui/combobox` `ComboboxChips`
  (base-ui `multiple`), `aria-label="Filter by domain"`. Options come from
  `useAtomValue(availableDomainsAtom)`. Writes `filter.domains`. **Render this
  control only when `availableDomains.length >= 2`** (otherwise omit it).

Layout: keep the existing nav combobox chain as the first row; put the three
filter controls in a second row inside the same floating container. Match the
existing container/styling idiom (e.g. `bg-card/95 shadow-sm backdrop-blur`).
Read `combobox.tsx` for the `ComboboxChips`/`multiple` API; read `select.tsx`
for the `Select` API (both are base-ui wrappers, opened by their trigger).

TDD: assert (1) the search input writes `nodeFilterAtom.search` on change;
(2) the status select writes `nodeFilterAtom.status`; (3) the domain control is
absent when `availableDomainsAtom` has <2 domains and present when it has ≥2.
Follow the existing `topology-filters.test.tsx` mocking style (it already mocks
`useTopologyData`, `useGraphView`, `navLevels`); mock/seed the new atoms as
needed. Keep the existing three tests passing. For base-ui open/interaction in
happy-dom, note: comboboxes open via their trigger button click, selects via
their trigger; reuse the `openCombobox` helper pattern already in that test.

**Acceptance:** `npx vitest run src/components/graph/topology-filters.test.tsx` green; `tsc` + `eslint` clean. Then run the full suite `npx vitest run` once — all green.
