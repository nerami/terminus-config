# URL as single source of truth — Stage B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `window.location` the single runtime source for the topology graph view, deleting `graphViewBaseAtom` (the Jotai+localStorage store) and `TopologyUrlSync` (the reconciler).

**Architecture:** A new `useGraphView()` hook derives the `GraphView` from the `?group/area/scene/automation` URL params (nuqs) and writes them back on navigation, clearing `selectedNodeAtom` (preserving the old `graphViewAtom` setter side-effect). The layout↔view coupling — *closing the topology clears the view params* — moves into `usePanelLayout`, which now owns all five nav params (`layout` + the four view keys) via one `useQueryStates`, so `closeTopology` clears the view atomically with setting `?layout=chat`. With no second store to reconcile, `TopologyUrlSync` and its mounted-ref/loop-prevention apparatus are deleted.

**Tech Stack:** React, TypeScript, Jotai (further reduced), nuqs (History adapter), Vitest, `@testing-library/react`, `nuqs/adapters/testing`.

## Global Constraints

- Frontend uses **pnpm**; do not run `npm install`.
- **Do NOT bump** `frontend/package.json` / `backend/pyproject.toml` (stay `0.0.0`). Release version is `config.yaml` only; bump + CHANGELOG entry only at the end (Task 7).
- TDD, red-first: every new function/hook gets a failing test before implementation. Test output pristine.
- `useGraphView()` returns the tuple `[GraphView, (view: GraphView) => void]` — same shape as the old `useAtom(graphViewAtom)`, so consumers change only the hook call.
- The four view URL params are exactly `group`, `area`, `scene`, `automation` (all `parseAsString`, nullable). `viewFromParams` / `viewToParams` are the only crossover between `GraphView` and those params.
- `selectedNodeAtom`, `entityModalAtom`, `chatHistoryOpenAtom`, the position atoms, and the pure helpers `GraphView`/`GraphGrouping`/`groupingOf`/`rootViewFor`/`viewKey`/`viewScope` all STAY in `atoms.ts`. Only `graphViewBaseAtom` + `graphViewAtom` are removed.
- nuqs v2 testing recipe (from Stage A): `withNuqsTestingAdapter` is in-memory (doesn't touch `window.location`); seed via `searchParams`, assert writes via `onUrlUpdate.mock.calls.at(-1)![0].queryString`; drain batched writes with `vi.useFakeTimers()` + `await act(async () => { …; vi.runAllTimersAsync(); })`; add `hasMemory: true` when state must persist across acts.
- Verify after each task: `npx tsc --noEmit` clean, `npx vitest run` green, `npx eslint <changed files>` clean. Run from `addons/terminus/frontend/`.

---

## Migration safety (why this task order)

`TopologyUrlSync` keeps `graphViewAtom` ↔ URL params in sync until Task 5 deletes it. So during Tasks 1-4 a consumer reading the atom and a consumer reading `useGraphView` (URL) see the same view — the reconciler bridges both ways. Order: add `useGraphView` (T1) → move the close-coupling into `usePanelLayout` (T2) → migrate view consumers one at a time (T3, T4) → migrate the last consumer and delete the reconciler (T5) → drop the now-unused atom (T6) → release (T7).

## File Structure

**New:**
- `src/lib/ha-graph/use-graph-view.ts` — `viewFromParams`, `viewToParams`, `useGraphView()`.
- `src/lib/ha-graph/use-graph-view.test.tsx`

**Modified:**
- `src/lib/ha-graph/use-panel-layout.ts` + `.test.tsx` — own all five nav params; `closeTopology`/`setLayout('chat')` clear the view params.
- `src/components/graph/topology-url-sync.tsx` — import `viewFromParams` from `use-graph-view` (T1); deleted in T5.
- `src/components/graph/group-by-controls.tsx` — `useGraphView` instead of `useAtom(graphViewAtom)`.
- `src/lib/ha-graph/use-topology-graph.ts` + `src/lib/ha-graph/use-topology-graph.test.ts` — `useGraphView` instead of `useAtom(graphViewAtom)`.
- `src/components/thread/thread.tsx` — `useGraphView` for the context-chip read; remove the `TopologyUrlSync` mount/import.
- `src/lib/ha-graph/atoms.ts` — remove `graphViewBaseAtom` + `graphViewAtom`.

**Deleted:**
- `src/components/graph/topology-url-sync.tsx` (no test file exists).

---

## Task 1: `useGraphView` hook + `viewFromParams`/`viewToParams`

**Files:**
- Create: `src/lib/ha-graph/use-graph-view.ts`
- Test: `src/lib/ha-graph/use-graph-view.test.tsx`
- Modify: `src/components/graph/topology-url-sync.tsx` (import `viewFromParams` from the new module instead of its local copy)

**Interfaces:**
- Produces:
  - `viewFromParams(group, area, scene, automation): GraphView` (moved verbatim from `topology-url-sync.tsx`)
  - `viewToParams(view: GraphView): { group: string | null; area: string | null; scene: string | null; automation: string | null }`
  - `useGraphView(): [GraphView, (view: GraphView) => void]`

- [ ] **Step 1: Write the failing test**

```tsx
// src/lib/ha-graph/use-graph-view.test.tsx
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { selectedNodeAtom } from './atoms';
import { useGraphView, viewFromParams, viewToParams } from './use-graph-view';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function makeWrapper(store: ReturnType<typeof createStore>, searchParams: string, onUrlUpdate: OnUrlUpdateFunction) {
  const Nuqs = withNuqsTestingAdapter({ searchParams, onUrlUpdate });
  return ({ children }: { children: ReactNode }) => (
    <Nuqs>
      <Provider store={store}>{children}</Provider>
    </Nuqs>
  );
}

describe('viewFromParams', () => {
  it('maps params to the GraphView (areas default; area/scene/automation drill-down)', () => {
    expect(viewFromParams(null, null, null, null)).toEqual({ kind: 'areas' });
    expect(viewFromParams(null, 'a1', null, null)).toEqual({ kind: 'area', areaId: 'a1' });
    expect(viewFromParams(null, 'a1', 's1', null)).toEqual({ kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' });
    expect(viewFromParams('scenes', null, 's1', null)).toEqual({ kind: 'scene', areaId: '', sceneId: 's1', via: 'scenes' });
    expect(viewFromParams('automations', null, null, 'x1')).toEqual({ kind: 'automation', areaId: '', automationId: 'x1', via: 'automations' });
    expect(viewFromParams('entities', null, null, null)).toEqual({ kind: 'entities' });
  });
});

describe('viewToParams', () => {
  it('is the inverse: default area grouping omitted, ids only where relevant', () => {
    expect(viewToParams({ kind: 'areas' })).toEqual({ group: null, area: null, scene: null, automation: null });
    expect(viewToParams({ kind: 'area', areaId: 'a1' })).toEqual({ group: null, area: 'a1', scene: null, automation: null });
    expect(viewToParams({ kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' })).toEqual({ group: null, area: 'a1', scene: 's1', automation: null });
    expect(viewToParams({ kind: 'scenes' })).toEqual({ group: 'scenes', area: null, scene: null, automation: null });
    expect(viewToParams({ kind: 'automation', areaId: '', automationId: 'x1', via: 'automations' })).toEqual({ group: 'automations', area: null, scene: null, automation: 'x1' });
  });

  it('round-trips every view through params and back', () => {
    for (const v of [
      { kind: 'areas' } as const,
      { kind: 'area', areaId: 'a1' } as const,
      { kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' } as const,
      { kind: 'scene', areaId: '', sceneId: 's1', via: 'scenes' } as const,
      { kind: 'automation', areaId: 'a1', automationId: 'x1', via: 'area' } as const,
      { kind: 'automations' } as const,
      { kind: 'entities' } as const,
    ]) {
      const p = viewToParams(v);
      expect(viewFromParams(p.group, p.area, p.scene, p.automation)).toEqual(v);
    }
  });
});

describe('useGraphView', () => {
  it('derives the view from the URL params', () => {
    const store = createStore();
    const { result } = renderHook(() => useGraphView(), {
      wrapper: makeWrapper(store, '?area=a1', vi.fn<OnUrlUpdateFunction>()),
    });
    expect(result.current[0]).toEqual({ kind: 'area', areaId: 'a1' });
  });

  it('navigating writes the inverse params and clears the selected node', async () => {
    const store = createStore();
    store.set(selectedNodeAtom, 'node-7');
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useGraphView(), {
      wrapper: makeWrapper(store, '?area=a1', onUrlUpdate),
    });
    await act(async () => {
      result.current[1]({ kind: 'scene', areaId: 'a1', sceneId: 's9', via: 'area' });
      await vi.runAllTimersAsync();
    });
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('scene=s9');
    expect(store.get(selectedNodeAtom)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ha-graph/use-graph-view.test.tsx`
Expected: FAIL — `Cannot find module './use-graph-view'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/ha-graph/use-graph-view.ts
import { useCallback, useMemo } from 'react';

import { useSetAtom } from 'jotai';
import { parseAsString, useQueryStates } from 'nuqs';

import { type GraphView, groupingOf, selectedNodeAtom } from './atoms';

/**
 * Derive a `GraphView` from the topology query params. `group` selects the
 * grouping dimension; within it the present ids imply how deep we've navigated.
 */
export function viewFromParams(
  group: string | null,
  area: string | null,
  scene: string | null,
  automation: string | null,
): GraphView {
  if (group === 'scenes') {
    if (scene) return { kind: 'scene', areaId: '', sceneId: scene, via: 'scenes' };
    return { kind: 'scenes' };
  }
  if (group === 'automations') {
    if (automation) return { kind: 'automation', areaId: '', automationId: automation, via: 'automations' };
    return { kind: 'automations' };
  }
  if (group === 'entities') return { kind: 'entities' };

  // Default: Area grouping.
  if (scene && area) return { kind: 'scene', areaId: area, sceneId: scene, via: 'area' };
  if (automation && area) return { kind: 'automation', areaId: area, automationId: automation, via: 'area' };
  if (area) return { kind: 'area', areaId: area };
  return { kind: 'areas' };
}

/** The inverse: the URL params for a view. Default (Area) grouping is omitted for clean links. */
export function viewToParams(view: GraphView): {
  group: string | null;
  area: string | null;
  scene: string | null;
  automation: string | null;
} {
  const grouping = groupingOf(view);
  return {
    group: grouping !== 'area' ? grouping : null,
    area: 'areaId' in view && view.areaId ? view.areaId : null,
    scene: view.kind === 'scene' ? view.sceneId : null,
    automation: view.kind === 'automation' ? view.automationId : null,
  };
}

/**
 * The topology graph view, sourced directly from the `?group/area/scene/automation`
 * URL params — there is no separate store. Navigating writes the inverse params and
 * clears the node selection (so the new canvas starts all-dimmed), matching the old
 * `graphViewAtom` setter. Returns the `[view, setView]` tuple shape of `useAtom`.
 */
export function useGraphView(): [GraphView, (view: GraphView) => void] {
  const [params, setParams] = useQueryStates({
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  const setSelectedNode = useSetAtom(selectedNodeAtom);

  const view = useMemo(
    () => viewFromParams(params.group, params.area, params.scene, params.automation),
    [params.group, params.area, params.scene, params.automation],
  );

  const setView = useCallback(
    (next: GraphView) => {
      void setParams(viewToParams(next));
      setSelectedNode(null);
    },
    [setParams, setSelectedNode],
  );

  return [view, setView];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ha-graph/use-graph-view.test.tsx`
Expected: PASS.

- [ ] **Step 5: Point `topology-url-sync.tsx` at the shared `viewFromParams`**

The reconciler still runs (until Task 5) and has its own copy of `viewFromParams`. Remove that local copy and import the shared one so there is a single definition. In `src/components/graph/topology-url-sync.tsx`:

- Delete the local `function viewFromParams(...) { … }` block.
- Add `viewFromParams` to the import from `@/lib/ha-graph/use-graph-view`:

```tsx
import { viewFromParams } from '@/lib/ha-graph/use-graph-view';
```

(Keep its existing imports of `graphViewAtom`, `groupingOf`, `viewKey` from `@/lib/ha-graph/atoms`.)

- [ ] **Step 6: Verify + commit**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests PASS (the reconciler now uses the shared `viewFromParams`).

```bash
git add src/lib/ha-graph/use-graph-view.ts src/lib/ha-graph/use-graph-view.test.tsx src/components/graph/topology-url-sync.tsx
git commit -m "feat(terminus): useGraphView hook over ?group/area/scene/automation"
```

---

## Task 2: `usePanelLayout` owns the nav params; close clears the view

**Files:**
- Modify: `src/lib/ha-graph/use-panel-layout.ts`
- Modify: `src/lib/ha-graph/use-panel-layout.test.tsx`

**Interfaces:**
- Public API unchanged: `usePanelLayout(): { layout; setLayout; openTopology; closeTopology; enterFullscreen; exitFullscreen }`.
- New behavior: `closeTopology()` and `setLayout('chat')` clear `group/area/scene/automation` atomically with setting `?layout=chat`. The other transitions touch only `?layout`.

- [ ] **Step 1: Write the failing test (add to the existing suite)**

Add these cases to `src/lib/ha-graph/use-panel-layout.test.tsx`. They need the fake-timer + `onUrlUpdate` pattern; if the existing file doesn't already set up fake timers, add `beforeEach(() => vi.useFakeTimers())` / `afterEach(() => vi.useRealTimers())` and import `OnUrlUpdateFunction`. The existing `renderLayout(search)` helper must thread an `onUrlUpdate` into the adapter — extend it to `renderLayout(search, onUrlUpdate?)`.

```tsx
it('closeTopology clears the view params along with setting layout=chat', async () => {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
  const { result } = renderLayout('?layout=split&area=a1&scene=s1', onUrlUpdate);
  await act(async () => {
    result.current.closeTopology();
    await vi.runAllTimersAsync();
  });
  const qs = onUrlUpdate.mock.calls.at(-1)![0].queryString;
  expect(qs).toContain('layout=chat');
  expect(qs).not.toContain('area=a1');
  expect(qs).not.toContain('scene=s1');
});

it('openTopology / enterFullscreen leave existing view params intact', async () => {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
  const { result } = renderLayout('?layout=split&area=a1', onUrlUpdate);
  await act(async () => {
    result.current.enterFullscreen();
    await vi.runAllTimersAsync();
  });
  const qs = onUrlUpdate.mock.calls.at(-1)![0].queryString;
  expect(qs).toContain('layout=topology');
  expect(qs).toContain('area=a1');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ha-graph/use-panel-layout.test.tsx`
Expected: FAIL — `closeTopology` currently sets only `?layout`, so `area=a1`/`scene=s1` remain in the query string.

- [ ] **Step 3: Rewrite the hook to own all five nav params**

```typescript
// src/lib/ha-graph/use-panel-layout.ts
import { useCallback, useMemo } from 'react';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

/**
 * The panel layout, sourced directly from the `?layout` URL param — there is no
 * separate store. The value IS the URL token.
 *  - chat:     topology not shown (chat occupies the row; an artifact may still
 *              open the right column — tracked separately).
 *  - split:    chat + topology side by side.
 *  - topology: topology fills the row, chat hidden.
 *
 * This hook owns all the topology-nav URL params (`layout` + the view keys
 * `group/area/scene/automation`) so that closing the topology can clear the view
 * atomically with the layout. The view itself is read/navigated via `useGraphView`;
 * the only place layout transitions touch the view params is the close path here.
 */
export type PanelLayout = 'chat' | 'topology' | 'split';

const LAYOUTS = ['chat', 'topology', 'split'] as const;

/** The view params, all null — written when the topology closes. */
const CLEARED_VIEW = { group: null, area: null, scene: null, automation: null } as const;

export function usePanelLayout(): {
  layout: PanelLayout;
  setLayout: (l: PanelLayout) => void;
  openTopology: () => void;
  closeTopology: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
} {
  const [nav, setNav] = useQueryStates({
    layout: parseAsStringLiteral(LAYOUTS),
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  const layout: PanelLayout = nav.layout ?? 'chat';

  const setLayout = useCallback(
    (l: PanelLayout) => void setNav(l === 'chat' ? { layout: 'chat', ...CLEARED_VIEW } : { layout: l }),
    [setNav],
  );

  const actions = useMemo(
    () => ({
      openTopology: () =>
        setNav((cur) => ((cur.layout ?? 'chat') === 'chat' ? { layout: 'split' } : {})),
      closeTopology: () => setNav({ layout: 'chat', ...CLEARED_VIEW }),
      enterFullscreen: () => setNav({ layout: 'topology' }),
      exitFullscreen: () => setNav((cur) => (cur.layout === 'topology' ? { layout: 'split' } : {})),
    }),
    [setNav],
  );

  return { layout, setLayout, ...actions };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/ha-graph/use-panel-layout.test.tsx`
Expected: PASS — the new close-clears-view and open-keeps-view cases plus all the Stage A action-semantics cases. If a Stage A case asserted an exact full query string, loosen it to `toContain('layout=…')` (the setter now also manages the view keys); do not change what layout value each action targets.

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests PASS.

```bash
git add src/lib/ha-graph/use-panel-layout.ts src/lib/ha-graph/use-panel-layout.test.tsx
git commit -m "feat(terminus): usePanelLayout owns nav params; close clears the view"
```

---

## Task 3: Rewire `group-by-controls` to `useGraphView`

**Files:**
- Modify: `src/components/graph/group-by-controls.tsx:1,5,21`

**Interfaces:**
- Consumes: `useGraphView` (Task 1).

- [ ] **Step 1: Update the component**

Replace the atom import and hook call. In `src/components/graph/group-by-controls.tsx`:

```tsx
// remove: import { useAtom } from 'jotai';
// remove: import { graphViewAtom } from '@/lib/ha-graph/atoms';
import { useGraphView } from '@/lib/ha-graph/use-graph-view';
```

```tsx
// was: const [view, setView] = useAtom(graphViewAtom);
const [view, setView] = useGraphView();
```

Everything else (the `navLevels(topology, view)` call and `setView(level.select(value))`) is unchanged — `useGraphView` returns the same tuple shape.

- [ ] **Step 2: Verify + commit**

This component has no test; verify via types + the full suite (the reconciler still bridges so other consumers stay consistent).

Run: `npx tsc --noEmit && npx vitest run && npx eslint src/components/graph/group-by-controls.tsx`
Expected: types clean; all tests PASS; lint clean.

```bash
git add src/components/graph/group-by-controls.tsx
git commit -m "refactor(terminus): group-by-controls view via useGraphView"
```

---

## Task 4: Rewire `use-topology-graph` to `useGraphView`

**Files:**
- Modify: `src/lib/ha-graph/use-topology-graph.ts:3,6,62`
- Modify: `src/lib/ha-graph/use-topology-graph.test.ts`

**Interfaces:**
- Consumes: `useGraphView` (Task 1). `viewScope`, `selectedNodeAtom`, `entityModalAtom` still come from `atoms.ts`.

- [ ] **Step 1: Update the hook**

In `src/lib/ha-graph/use-topology-graph.ts`:

- Line 6 — drop `graphViewAtom` from the `atoms` import (keep `entityModalAtom`, `selectedNodeAtom`, `viewScope`):

```typescript
import { entityModalAtom, selectedNodeAtom, viewScope } from '@/lib/ha-graph/atoms';
import { useGraphView } from '@/lib/ha-graph/use-graph-view';
```

- Line 62 — swap the atom for the hook (identical tuple destructure):

```typescript
const [view, setView] = useGraphView();
```

- Line 3 — `useAtom` is still used (for `selectedNodeAtom` on line 63), so keep `import { useAtom, useSetAtom } from 'jotai';`. Everything else (the `setView({...})` drill-down calls, `viewScope(view)`, the `view.kind` checks) is unchanged.

- [ ] **Step 2: Rewrite the test to drive the view via the URL**

`src/lib/ha-graph/use-topology-graph.test.ts` currently seeds the view with `store.set(graphViewAtom, initialView)` and asserts drill-down by reading the atom. Rewrite it to:
- Seed the initial view via the nuqs adapter's `searchParams` (use `viewToParams` to compute the query string for the desired initial `GraphView`, or write the params literally, e.g. `?area=a1`).
- Wrap `renderHook` with `withNuqsTestingAdapter({ searchParams, onUrlUpdate })` nested over the Jotai `Provider` (the hook still uses `selectedNodeAtom`/`entityModalAtom` from the store) — same dual-provider shape as `use-resizable-split.test.tsx`.
- Assert drill-down navigation via `onUrlUpdate.mock.calls.at(-1)![0].queryString` (e.g. activating an area node writes `area=<id>`), draining with `vi.useFakeTimers()` + `await act(async () => { …; vi.runAllTimersAsync(); })`.
- Keep every existing test intent (drill-in on area, first-click-selects/second-click-acts, modal open, highlight-set computation). The highlight-set and selection tests use `selectedNodeAtom` on the store and are unaffected by the view source — keep them, just seed the view via the URL instead of the atom.

Rename the file to `use-topology-graph.test.tsx` (it now contains JSX for the wrapper). Use `git mv` to preserve history:

```bash
git mv src/lib/ha-graph/use-topology-graph.test.ts src/lib/ha-graph/use-topology-graph.test.tsx
```

- [ ] **Step 3: Verify + commit**

Run: `npx vitest run src/lib/ha-graph/use-topology-graph.test.tsx && npx tsc --noEmit`
Expected: PASS; types clean.

```bash
git add src/lib/ha-graph/use-topology-graph.ts src/lib/ha-graph/use-topology-graph.test.ts src/lib/ha-graph/use-topology-graph.test.tsx
git commit -m "refactor(terminus): use-topology-graph view via useGraphView"
```

---

## Task 5: Rewire `thread.tsx` and delete `TopologyUrlSync`

**Files:**
- Modify: `src/components/thread/thread.tsx` (the `graphViewAtom` read, the `TopologyUrlSync` import + mount)
- Delete: `src/components/graph/topology-url-sync.tsx`

**Interfaces:**
- Consumes: `useGraphView` (Task 1). After this task no component renders `TopologyUrlSync`, and `graphViewAtom` has no remaining consumers.

- [ ] **Step 1: Update `thread.tsx`**

- Remove `graphViewAtom` from the `@/lib/ha-graph/atoms` import (keep `selectedNodeAtom`):

```tsx
import { selectedNodeAtom } from '@/lib/ha-graph/atoms';
import { useGraphView } from '@/lib/ha-graph/use-graph-view';
```

- Replace the read (was `const graphView = useAtomValue(graphViewAtom);`) with the tuple hook:

```tsx
const [graphView] = useGraphView();
```

- Remove the `TopologyUrlSync` import (`import { TopologyUrlSync } from '../graph/topology-url-sync';`) and its `<TopologyUrlSync />` mount in the JSX.
- If `useAtomValue` is now unused in the file, drop it from the `jotai` import; if other atoms still use it, keep it. (`selectedNodeAtom` is read elsewhere in `thread.tsx` — verify whether via `useAtomValue`.)

Behavior note: when the topology is closed (`?layout=chat`), the view params are absent, so `useGraphView` yields `{ kind: 'areas' }`. The chat context chips therefore reflect the areas overview while the topology is closed, rather than the last drilled-in view the atom used to retain. This is the intended consequence of the URL being the single source.

- [ ] **Step 2: Delete the reconciler**

```bash
git rm src/components/graph/topology-url-sync.tsx
```

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npx vitest run && grep -rn "TopologyUrlSync" src`
Expected: types clean; all tests PASS; grep returns nothing.

```bash
git add src/components/thread/thread.tsx
git commit -m "refactor(terminus): thread view via useGraphView, delete TopologyUrlSync"
```

---

## Task 6: Remove `graphViewAtom` + `graphViewBaseAtom` from `atoms.ts`

**Files:**
- Modify: `src/lib/ha-graph/atoms.ts` (remove the two atoms; keep everything else)

**Interfaces:**
- After this task `atoms.ts` no longer exports `graphViewAtom`. `graphViewBaseAtom` (file-local) is gone. `GraphView`, `GraphGrouping`, `groupingOf`, `rootViewFor`, `viewKey`, `viewScope`, `selectedNodeAtom`, `entityModalAtom`, `chatHistoryOpenAtom`, and the position atoms remain.

- [ ] **Step 1: Confirm no remaining consumers**

Run from the frontend dir:
```bash
grep -rn "graphViewAtom\|graphViewBaseAtom" src --include="*.ts" --include="*.tsx"
```
Expected: matches ONLY inside `atoms.ts` (and possibly a mock in `graph-canvas.test.tsx`). If any real consumer remains, STOP and report BLOCKED — a migration was missed.

If `components/graph/graph-canvas.test.tsx` mocks `graphViewAtom: {}`, that mock is now dead; remove just that mock line (it referenced the now-removed export).

- [ ] **Step 2: Remove the atoms**

In `src/lib/ha-graph/atoms.ts`, delete `graphViewBaseAtom` (the `atomWithStorage<GraphView>('terminus-graph-view', …)` line) and the `graphViewAtom` definition (the read/write `atom(...)` with the `selectedNodeAtom`-clearing setter). Keep `selectedNodeAtom` and `entityModalAtom` (defined nearby) and the `atom`/`atomWithStorage` imports (still used by `selectedNodeAtom`, `entityModalAtom`, `chatHistoryOpenAtom`, and the position atoms).

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npx vitest run && npx eslint src/lib/ha-graph/atoms.ts`
Expected: types clean; all tests PASS; lint clean.

```bash
git add src/lib/ha-graph/atoms.ts src/components/graph/graph-canvas.test.tsx
git commit -m "refactor(terminus): drop graphViewAtom (URL is the source for the view)"
```

---

## Task 7: Full verification + release bump

**Files:**
- Modify: `addons/terminus/config.yaml` (version)
- Modify: `addons/terminus/CHANGELOG.md` (new entry)

- [ ] **Step 1: Full frontend gate**

From `addons/terminus/frontend/`:
```bash
npx tsc --noEmit && npx eslint src && npx vitest run && npm run build
```
Expected: all clean/green; build succeeds. (The pre-existing chunk-size >500kB warning from `npm run build` is NOT a failure.)

- [ ] **Step 2: Grep for leftovers**

```bash
grep -rn "graphViewAtom\|graphViewBaseAtom\|TopologyUrlSync\|terminus-graph-view" src --include="*.ts" --include="*.tsx"
```
Expected: no matches.

- [ ] **Step 3: Bump version + changelog**

Set `addons/terminus/config.yaml` `version: "0.20.0"`. Add a `CHANGELOG.md` entry at the top of the entry list:

```markdown
## 0.20.0

- **The topology view lives entirely in the URL.** The current diagram view —
  the area / scene / automation you've drilled into — is now encoded in the
  `?group/area/scene/automation` params, so deep links, refresh, and
  back/forward restore it exactly. Closing the topology resets it to the areas
  overview. (Completes the move of all navigation to the URL; the old in-memory
  view store is gone.)
```

- [ ] **Step 4: Commit**

```bash
git add addons/terminus/config.yaml addons/terminus/CHANGELOG.md
git commit -m "chore(terminus): release 0.20.0 — graph view URL-driven (Stage B)"
```

---

## Self-Review (completed)

- **Spec coverage:** graph view → URL via `useGraphView` (T1) ✓; `viewFromParams`/inverse moved out of the reconciler (T1) ✓; layout↔view coupling moved into `usePanelLayout` setters (T2) ✓; `setView` `selectedNode`-clear preserved (T1) ✓; all `graphViewAtom` consumers rewired (T3 group-by-controls, T4 use-topology-graph, T5 thread) ✓; `TopologyUrlSync` deleted (T5) ✓; `graphViewBaseAtom`/`graphViewAtom` + localStorage removed (T6) ✓; `viewKey`/`viewScope`/`groupingOf`/`rootViewFor` kept pure in `atoms.ts` ✓; `selectedNode`/`entityModal`/preferences untouched ✓.
- **Placeholder scan:** none — full code for the two hooks; precise edit lists for the mechanical rewires (each names the exact import/line change).
- **Type consistency:** `useGraphView` returns `[GraphView, (view: GraphView) => void]` (T1), consumed with identical tuple destructure in T3/T4/T5; `viewToParams` return shape matches the `useQueryStates` keys in T1 and the `CLEARED_VIEW` keys in T2; `usePanelLayout` public API unchanged so Stage A's layout consumers/tests are untouched.
- **Behavior change noted:** with the topology closed, chat-context chips reflect `{areas}` rather than the last drilled-in view (the atom no longer retains it). Documented in T5 and the changelog. This is the intended consequence of URL-as-single-source.
- **Migration safety:** `TopologyUrlSync` bridges atom↔URL through T1-T4; deleted only in T5 after the last consumer (thread) is migrated.
