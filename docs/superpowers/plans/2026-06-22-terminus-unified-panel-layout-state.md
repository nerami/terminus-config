# Unified Panel-Layout State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the chat↔topology layout one authoritative state (`panelLayoutAtom`) that buttons, drag-to-collapse, and the URL all read/write, so they can never diverge.

**Architecture:** A single `PanelLayout` atom (`chat-full | split | topology-full`) replaces the two boolean atoms. Writes go through named action atoms; reads compare the layout. The resize hook gains drag-to-collapse write-back (loop-gated). The URL `layout` param lists visible panels. To keep every task's build green, Task 1 keeps the old atoms alive as **temporary derived shims** over `panelLayoutAtom`; each consumer migrates off them in turn; the final task deletes the shims.

**Tech Stack:** React 19 + TypeScript, Vite, jotai (`atom`, `atomWithStorage`), nuqs (URL params), `react-resizable-panels@4.11.2`, Vitest + happy-dom + @testing-library/react.

## Global Constraints

- All paths relative to `addons/terminus/frontend/`.
- Package manager **pnpm**; never `npm install`.
- **Do NOT bump** `config.yaml` / `package.json` / `pyproject.toml` versions; no `CHANGELOG.md` entry (non-release iteration).
- No new dependencies — `jotai`, `nuqs`, `react-resizable-panels` are already installed.
- Tests: `npx vitest run <path>` (happy-dom, globals on, setup `src/test-setup.ts`); import `describe/it/expect` (and `vi`) explicitly.
- Before committing any task that touches `.ts`/`.tsx`: `npx tsc -b` clean and `npx eslint <changed files>` clean (use `npx eslint --fix` for import-order/formatting).
- **Canonical vocabulary:** `PanelLayout = 'chat-full' | 'split' | 'topology-full'` (state) vs `SplitMode = 'chat-only' | 'split' | 'panel-only'` (the resize Group's derived visual arrangement) — two distinct vocabularies, kept separate.
- localStorage key for the canonical state is exactly `terminus-panel-layout`. The retired keys are `terminus-graph-panel-open` / `terminus-graph-fullscreen`.
- URL param is `layout`, a comma list of visible panel names; mapping: `chat-full↔['chat']`, `topology-full↔['topology']`, `split↔['chat','topology']`; parse order-independent; empty/garbage → `chat-full`. The old `topology` param is dropped (not aliased).
- **The shims added in Task 1 are temporary scaffolding; the end state (after Task 8) has no `graphPanelOpenAtom`/`graphFullscreenAtom`.**

## File Structure

- `src/lib/ha-graph/atoms.ts` *(modify)* — `PanelLayout`, `panelLayoutAtom`, `PanelName`, `PANEL_ORDER`, action atoms, `layoutToPanels`/`panelsToLayout`; temp shims (Task 1) then their deletion (Task 8).
- `src/lib/ha-graph/atoms.test.ts` *(modify)* — replace the retired storage-key test; add canonical/action/helper tests.
- `src/components/graph/graph-panel.tsx` + `.test.tsx` *(modify)* — migrate to `panelLayoutAtom` + actions.
- `src/components/sidebar/app-sidebar.tsx` + `.test.tsx` *(modify)* — migrate the topology toggle.
- `src/components/graph/topology-url-sync.tsx` *(modify)* — `layout` param via helpers.
- `src/components/thread/split-layout.ts` + `.test.ts` *(modify)* — add `actionFromDragged`.
- `src/components/thread/use-resizable-split.ts` + `.test.tsx` *(modify)* — new inputs, drag write-back, loop-gating.
- `src/components/thread/thread.tsx` *(modify)* — hook wiring (Task 6) + button/affordance migration (Task 7).

---

### Task 1: Canonical atom, action atoms, URL helpers (+ temporary shims)

**Files:**
- Modify: `src/lib/ha-graph/atoms.ts`
- Test: `src/lib/ha-graph/atoms.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type PanelLayout = 'chat-full' | 'split' | 'topology-full'`
  - `type PanelName = 'chat' | 'topology'`; `PANEL_ORDER: PanelName[]`
  - `panelLayoutAtom` (jotai `atomWithStorage<PanelLayout>`, key `terminus-panel-layout`)
  - `openTopologyAtom`, `closeTopologyAtom`, `enterFullscreenAtom`, `exitFullscreenAtom` (write-only `atom(null, …)`)
  - `layoutToPanels(layout): PanelName[]`, `panelsToLayout(names: readonly string[] | null): PanelLayout`
  - **Temporary** derived `graphPanelOpenAtom` / `graphFullscreenAtom` (read/write over `panelLayoutAtom`) — deleted in Task 8.

- [ ] **Step 1: Write the failing test**

Replace the entire body of `src/lib/ha-graph/atoms.test.ts` with:

```ts
import { createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';

import {
  closeTopologyAtom,
  enterFullscreenAtom,
  exitFullscreenAtom,
  layoutToPanels,
  openTopologyAtom,
  panelLayoutAtom,
  panelsToLayout,
} from './atoms';

afterEach(() => {
  window.localStorage.clear();
});

describe('panelLayoutAtom', () => {
  it('persists to terminus-panel-layout so it survives a reload', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    expect(window.localStorage.getItem('terminus-panel-layout')).toBe('"split"');
  });
});

describe('layout action atoms', () => {
  it('openTopology: chat-full -> split, otherwise unchanged', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    store.set(openTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('split');
    store.set(panelLayoutAtom, 'topology-full');
    store.set(openTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('closeTopology -> chat-full from any state', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'topology-full');
    store.set(closeTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });

  it('enterFullscreen -> topology-full from any state', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    store.set(enterFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('exitFullscreen: topology-full -> split, otherwise unchanged', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'topology-full');
    store.set(exitFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('split');
    store.set(panelLayoutAtom, 'chat-full');
    store.set(exitFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });
});

describe('layout <-> panel names', () => {
  it('layoutToPanels maps each layout to its visible panels', () => {
    expect(layoutToPanels('chat-full')).toEqual(['chat']);
    expect(layoutToPanels('topology-full')).toEqual(['topology']);
    expect(layoutToPanels('split')).toEqual(['chat', 'topology']);
  });

  it('panelsToLayout is order-independent and tolerant of garbage', () => {
    expect(panelsToLayout(['chat', 'topology'])).toBe('split');
    expect(panelsToLayout(['topology', 'chat'])).toBe('split');
    expect(panelsToLayout(['topology'])).toBe('topology-full');
    expect(panelsToLayout(['chat'])).toBe('chat-full');
    expect(panelsToLayout([])).toBe('chat-full');
    expect(panelsToLayout(null)).toBe('chat-full');
    expect(panelsToLayout(['bogus', 'chat', 'chat'])).toBe('chat-full');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ha-graph/atoms.test.ts`
Expected: FAIL — `panelLayoutAtom` / the action atoms / helpers are not exported.

- [ ] **Step 3: Write minimal implementation**

In `src/lib/ha-graph/atoms.ts`, replace the two old atom definitions:

```ts
/** Whether the diagram panel is open next to the chat. */
export const graphPanelOpenAtom = atomWithStorage('terminus-graph-panel-open', false);

/** Whether the topology panel is expanded full screen (hiding the chat). */
export const graphFullscreenAtom = atomWithStorage('terminus-graph-fullscreen', false);
```

with:

```ts
/**
 * Single source of truth for the chat<->topology layout relationship.
 *  - chat-full:     topology not shown (chat occupies the row; an artifact may
 *                   still open the right column — tracked separately).
 *  - split:         chat + topology side by side.
 *  - topology-full: topology fills the row, chat hidden.
 */
export type PanelLayout = 'chat-full' | 'split' | 'topology-full';

export const panelLayoutAtom = atomWithStorage<PanelLayout>('terminus-panel-layout', 'chat-full', undefined, {
  getOnInit: true,
});

/** Names of the two panels the layout param lists, in canonical URL order. */
export type PanelName = 'chat' | 'topology';
export const PANEL_ORDER: PanelName[] = ['chat', 'topology'];

/** Visible panels for a layout (already in canonical order for stable URLs). */
export function layoutToPanels(layout: PanelLayout): PanelName[] {
  switch (layout) {
    case 'chat-full':
      return ['chat'];
    case 'topology-full':
      return ['topology'];
    case 'split':
      return ['chat', 'topology'];
  }
}

/** Map a (possibly messy) list of visible panel names back to a layout. */
export function panelsToLayout(names: readonly string[] | null): PanelLayout {
  const set = new Set(names ?? []);
  const chat = set.has('chat');
  const topology = set.has('topology');
  if (chat && topology) return 'split';
  if (topology) return 'topology-full';
  return 'chat-full';
}

// Named write-only actions — the single write path for buttons, drag, and URL.
// Each no-ops when the target equals the current value (free equality-gating).
export const openTopologyAtom = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'chat-full') set(panelLayoutAtom, 'split');
});
export const closeTopologyAtom = atom(null, (_get, set) => set(panelLayoutAtom, 'chat-full'));
export const enterFullscreenAtom = atom(null, (_get, set) => set(panelLayoutAtom, 'topology-full'));
export const exitFullscreenAtom = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'topology-full') set(panelLayoutAtom, 'split');
});

// TEMPORARY migration shims — derived from panelLayoutAtom (no separate storage)
// so consumers keep compiling while they migrate. REMOVED in the final task once
// every consumer reads panelLayoutAtom directly. Do not add new uses.
export const graphPanelOpenAtom = atom(
  (get) => get(panelLayoutAtom) !== 'chat-full',
  (get, set, open: boolean) => {
    if (open) {
      if (get(panelLayoutAtom) === 'chat-full') set(panelLayoutAtom, 'split');
    } else {
      set(panelLayoutAtom, 'chat-full');
    }
  },
);
export const graphFullscreenAtom = atom(
  (get) => get(panelLayoutAtom) === 'topology-full',
  (get, set, full: boolean) => {
    if (full) set(panelLayoutAtom, 'topology-full');
    else if (get(panelLayoutAtom) === 'topology-full') set(panelLayoutAtom, 'split');
  },
);
```

(`atom` and `atomWithStorage` are already imported at the top of `atoms.ts`.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/ha-graph/atoms.test.ts`
Expected: PASS.
Then `npx vitest run` — the whole suite is green (existing `graph-panel.test.tsx` / `app-sidebar.test.tsx` still pass through the shims).

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc -b && npx eslint src/lib/ha-graph/atoms.ts src/lib/ha-graph/atoms.test.ts
git add src/lib/ha-graph/atoms.ts src/lib/ha-graph/atoms.test.ts
git commit -m "feat(terminus): panelLayoutAtom + action atoms + url helpers (temp shims)"
```

---

### Task 2: Migrate `graph-panel.tsx` to the canonical state

**Files:**
- Modify: `src/components/graph/graph-panel.tsx`
- Test: `src/components/graph/graph-panel.test.tsx`

**Interfaces:**
- Consumes (Task 1): `panelLayoutAtom`, `closeTopologyAtom`, `exitFullscreenAtom`.
- Produces: no new exports.

- [ ] **Step 1: Update the test to assert against `panelLayoutAtom`**

In `src/components/graph/graph-panel.test.tsx`, change the import and the seeding/assertions. Replace the import line:

```ts
import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';
```

with:

```ts
import { panelLayoutAtom } from '@/lib/ha-graph/atoms';
```

Replace the seed (currently around lines 26-27):

```ts
  store.set(graphPanelOpenAtom, true);
  store.set(graphFullscreenAtom, fullscreen);
```

with:

```ts
  store.set(panelLayoutAtom, fullscreen ? 'topology-full' : 'split');
```

Replace the two assertions in the "open chat" / close tests. Wherever the test reads
`store.get(graphFullscreenAtom)` / `store.get(graphPanelOpenAtom)`, express the
expectation as a single `panelLayoutAtom` read. The desktop "open chat" test (exit
fullscreen) becomes:

```ts
    expect(store.get(panelLayoutAtom)).toBe('split');
```

and the close test becomes:

```ts
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
```

(Match each existing `it(...)`: the one that asserted `graphFullscreen === false && graphPanelOpen === true` → `panelLayoutAtom === 'split'`; the one that asserted both `false` → `panelLayoutAtom === 'chat-full'`.)

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/graph/graph-panel.test.tsx`
Expected: FAIL — `graph-panel.tsx` still flips the shim atoms, so the asserted `panelLayoutAtom` transitions only partly match (and the removed imports are unused), or the assertions reference the new atom before the component drives it the same way. (It must be red before the impl change.)

- [ ] **Step 3: Migrate the component**

In `src/components/graph/graph-panel.tsx`:

Replace the import:

```ts
import { graphFullscreenAtom, graphPanelOpenAtom, topologyAtom } from '@/lib/ha-graph/atoms';
```

with:

```ts
import { closeTopologyAtom, exitFullscreenAtom, panelLayoutAtom, topologyAtom } from '@/lib/ha-graph/atoms';
```

Replace the atom hooks (currently lines 24-25):

```ts
  const setOpen = useSetAtom(graphPanelOpenAtom);
  const [fullscreen, setFullscreen] = useAtom(graphFullscreenAtom);
```

with:

```ts
  const layout = useAtomValue(panelLayoutAtom);
  const closeTopology = useSetAtom(closeTopologyAtom);
  const exitFullscreen = useSetAtom(exitFullscreenAtom);
  const fullscreen = layout === 'topology-full';
```

(`useAtom` may now be unused — switch its import to `useAtomValue`/`useSetAtom` as needed and let `eslint --fix` clean the import list.)

Replace `openChat` (currently lines 38-46):

```ts
  const openChat = () => {
    if (isMobile) {
      // No split view on small screens: go back to the chat.
      setFullscreen(false);
      setOpen(false);
    } else {
      // Reveal the chat alongside the diagram (split view).
      setFullscreen(false);
    }
  };
```

with:

```ts
  const openChat = () => {
    // Small screens never show the split: "open chat" closes the topology
    // entirely; on desktop it drops back to the side-by-side split.
    if (isMobile) closeTopology();
    else exitFullscreen();
  };
```

Replace the "Close topology" button handler (currently lines 71-74):

```ts
            onClick={() => {
              setFullscreen(false);
              setOpen(false);
            }}
```

with:

```ts
            onClick={closeTopology}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/graph/graph-panel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc -b && npx eslint src/components/graph/graph-panel.tsx src/components/graph/graph-panel.test.tsx
git add src/components/graph/graph-panel.tsx src/components/graph/graph-panel.test.tsx
git commit -m "refactor(terminus): graph-panel uses panelLayout actions"
```

---

### Task 3: Migrate `app-sidebar.tsx` topology toggle

**Files:**
- Modify: `src/components/sidebar/app-sidebar.tsx`
- Test: `src/components/sidebar/app-sidebar.test.tsx`

**Interfaces:**
- Consumes (Task 1): `panelLayoutAtom`, `closeTopologyAtom`, `enterFullscreenAtom`.

- [ ] **Step 1: Update the test to assert against `panelLayoutAtom`**

In `src/components/sidebar/app-sidebar.test.tsx`, replace the import:

```ts
import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';
```

with:

```ts
import { panelLayoutAtom } from '@/lib/ha-graph/atoms';
```

Replace the seed + assertions in the "opens the topology straight into full screen" test:

```ts
    const store = createStore();
    store.set(graphPanelOpenAtom, false);
    store.set(graphFullscreenAtom, false);
    renderSidebar(store);

    fireEvent.click(screen.getByRole('button', { name: /topology/i }));

    expect(store.get(graphPanelOpenAtom)).toBe(true);
    expect(store.get(graphFullscreenAtom)).toBe(true);
```

with:

```ts
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    renderSidebar(store);

    fireEvent.click(screen.getByRole('button', { name: /topology/i }));

    expect(store.get(panelLayoutAtom)).toBe('topology-full');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sidebar/app-sidebar.test.tsx`
Expected: FAIL — unused/removed imports and the component still writes the shim atoms (assertion on `panelLayoutAtom` mismatches until the component is migrated).

- [ ] **Step 3: Migrate the component**

In `src/components/sidebar/app-sidebar.tsx`:

Replace the import:

```ts
import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';
```

with:

```ts
import { closeTopologyAtom, enterFullscreenAtom, panelLayoutAtom } from '@/lib/ha-graph/atoms';
```

Replace the atom hooks:

```ts
  const [graphPanelOpen, setGraphPanelOpen] = useAtom(graphPanelOpenAtom);
  const [, setGraphFullscreen] = useAtom(graphFullscreenAtom);
```

with:

```ts
  const layout = useAtomValue(panelLayoutAtom);
  const enterFullscreen = useSetAtom(enterFullscreenAtom);
  const closeTopology = useSetAtom(closeTopologyAtom);
```

(Adjust the `jotai` import to bring in `useAtomValue` / `useSetAtom`; let `eslint --fix` tidy it.)

Replace `toggleGraphPanel` (the open-to-fullscreen / close-to-chat toggle):

```ts
  const toggleGraphPanel = () => {
    setGraphPanelOpen((prev) => {
      const next = !prev;
      if (next) {
        closeArtifact();
        setGraphFullscreen(true);
      } else {
        setGraphFullscreen(false);
      }
      return next;
    });
    closeOnMobile();
```

with:

```ts
  const toggleGraphPanel = () => {
    // Opening the diagram shows it full screen (and closes the artifact, since
    // they share the right column); closing returns to the chat.
    if (layout === 'chat-full') {
      closeArtifact();
      enterFullscreen();
    } else {
      closeTopology();
    }
    closeOnMobile();
```

(Leave the rest of `toggleGraphPanel`'s body — `closeOnMobile()` and any closing brace — unchanged.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/sidebar/app-sidebar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc -b && npx eslint src/components/sidebar/app-sidebar.tsx src/components/sidebar/app-sidebar.test.tsx
git add src/components/sidebar/app-sidebar.tsx src/components/sidebar/app-sidebar.test.tsx
git commit -m "refactor(terminus): sidebar topology toggle uses panelLayout actions"
```

---

### Task 4: URL `layout` param (panel-name list)

**Files:**
- Modify: `src/components/graph/topology-url-sync.tsx`

**Interfaces:**
- Consumes (Task 1): `panelLayoutAtom`, `layoutToPanels`, `panelsToLayout`, `PanelName`.

This task is wiring an effect-only component (no unit test today — the mapping logic it relies on is already covered by Task 1's helper tests). Verify via tsc/eslint/build; the deep-link behavior is part of the final manual check.

- [ ] **Step 1: Swap the boolean `topology` param for the `layout` array param**

In `src/components/graph/topology-url-sync.tsx`:

Update the nuqs import to add the array + literal parsers:

```ts
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
```

Update the atoms import — read/write `panelLayoutAtom`, keep the view atoms, and bring in the helpers:

```ts
import {
  type GraphView,
  groupingOf,
  layoutToPanels,
  type PanelName,
  panelLayoutAtom,
  panelsToLayout,
  viewKey,
} from '@/lib/ha-graph/atoms';
```

Replace the topology open param + panel atom hooks. The current:

```ts
  const [open, setOpenParam] = useQueryState('topology', parseAsBoolean.withDefault(false));
```

becomes (a comma-list of panel names; default empty):

```ts
  const [panels, setPanels] = useQueryState(
    'layout',
    parseAsArrayOf(parseAsStringLiteral(['chat', 'topology'] as const)).withDefault([]),
  );
```

and the panel-open atom hook:

```ts
  const [panelOpen, setPanelOpen] = useAtom(graphPanelOpenAtom);
```

becomes:

```ts
  const [layout, setLayout] = useAtom(panelLayoutAtom);
```

Remove the now-unused `parseAsBoolean` from the nuqs import.

- [ ] **Step 2: Rework the URL↔atom effects**

Replace the URL→atom effect body so it hydrates the full layout (mount + back/forward). The current effect keys off `open`/`panelOpen`; replace its dependency-read of `open` with the parsed `panels`, and set the layout absolutely:

```ts
  // URL -> atom (mount/deep-link + back/forward). The layout param lists the
  // visible panels; restore it directly (absolute set, not an action).
  useEffect(() => {
    const next = panelsToLayout(panels);
    if (next !== layout) setLayout(next);
    if (next !== 'chat-full') {
      const view = viewFromParams(group, area, scene, automation);
      if (viewKey(view) !== viewKey(currentView)) setView(view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels, group, area, scene, automation]);
```

(Keep the existing `viewFromParams` helper and the `view`/`setView` hooks; rename the local `view` read used for equality to `currentView` if needed to avoid shadowing — match the existing variable names in the file.)

Replace the atom→URL effect so it always writes the panel list (never null), and gates the view params on "topology visible" (`layout !== 'chat-full'`). The first-commit branch writes the param from the persisted atom:

```ts
  const mounted = useRef(false);
  useEffect(() => {
    const wantPanels: PanelName[] = layoutToPanels(layout);
    const topologyVisible = layout !== 'chat-full';
    if (!mounted.current) {
      if (panels.join(',') !== wantPanels.join(',')) setPanels(wantPanels);
      return;
    }
    const grouping = groupingOf(currentView);
    const wantGroup = topologyVisible && grouping !== 'area' ? grouping : null;
    const wantArea = topologyVisible && 'areaId' in currentView && currentView.areaId ? currentView.areaId : null;
    const wantScene = topologyVisible && currentView.kind === 'scene' ? currentView.sceneId : null;
    const wantAuto = topologyVisible && currentView.kind === 'automation' ? currentView.automationId : null;
    if (panels.join(',') !== wantPanels.join(',')) setPanels(wantPanels);
    if (group !== wantGroup) setGroup(wantGroup);
    if (area !== wantArea) setArea(wantArea);
    if (scene !== wantScene) setScene(wantScene);
    if (automation !== wantAuto) setAutomation(wantAuto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, currentView]);
```

(Use the file's existing names for the view variable and the `group/area/scene/automation` query-state setters. The `mounted` ref + the `useEffect(() => { mounted.current = true }, [])` at the bottom stay as-is.)

- [ ] **Step 3: Verify**

Run, in order, and expect each clean:

```bash
npx tsc -b
npx eslint src/components/graph/topology-url-sync.tsx
npx vitest run
```

Expected: tsc clean; eslint clean; full suite green.

- [ ] **Step 4: Commit**

```bash
git add src/components/graph/topology-url-sync.tsx
git commit -m "feat(terminus): url layout param lists visible panels"
```

---

### Task 5: `actionFromDragged` helper (pure)

**Files:**
- Modify: `src/components/thread/split-layout.ts`
- Test: `src/components/thread/split-layout.test.ts`

**Interfaces:**
- Consumes: `CHAT_PANEL_ID`, `TOPOLOGY_PANEL_ID`, type `Layout` (already in `split-layout.ts`).
- Produces: `type DragAction = 'close' | 'fullscreen' | 'split'`; `actionFromDragged(layout: Layout): DragAction`.

- [ ] **Step 1: Write the failing test**

Append to `src/components/thread/split-layout.test.ts`:

```ts
import { actionFromDragged } from './split-layout';

describe('actionFromDragged', () => {
  it('topology side collapsed -> close', () => {
    expect(actionFromDragged({ chat: 100, topology: 0 })).toBe('close');
  });
  it('chat side collapsed -> fullscreen', () => {
    expect(actionFromDragged({ chat: 0, topology: 100 })).toBe('fullscreen');
  });
  it('both sides present -> split', () => {
    expect(actionFromDragged({ chat: 60, topology: 40 })).toBe('split');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: FAIL — `actionFromDragged` not exported.

- [ ] **Step 3: Implement**

Append to `src/components/thread/split-layout.ts`:

```ts
/** What a finished drag implies for the canonical layout. */
export type DragAction = 'close' | 'fullscreen' | 'split';

/**
 * Interpret a settled drag layout: a collapsed topology side means the user
 * dragged the topology closed; a collapsed chat side means they dragged chat
 * away (topology fullscreen); otherwise it's a plain resize within the split.
 */
export function actionFromDragged(layout: Layout): DragAction {
  if (layout[TOPOLOGY_PANEL_ID] === 0) return 'close';
  if (layout[CHAT_PANEL_ID] === 0) return 'fullscreen';
  return 'split';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc -b && npx eslint src/components/thread/split-layout.ts src/components/thread/split-layout.test.ts
git add src/components/thread/split-layout.ts src/components/thread/split-layout.test.ts
git commit -m "feat(terminus): actionFromDragged maps a drag to a layout action"
```

---

### Task 6: `useResizableSplit` — drag-to-collapse write-back + loop-gating

**Files:**
- Modify: `src/components/thread/use-resizable-split.ts`
- Modify: `src/components/thread/thread.tsx` (the hook call site + the panels' `collapsible` prop only)
- Test: `src/components/thread/use-resizable-split.test.tsx`

**Interfaces:**
- Consumes: `panelLayoutAtom`, `closeTopologyAtom`, `enterFullscreenAtom`, `openTopologyAtom`, `PanelLayout` (Task 1); `actionFromDragged`, `deriveMode`, `targetLayout`, `applyMode`, `CHAT_PANEL_ID`, `TOPOLOGY_PANEL_ID` (Task 5 + existing).
- Produces: new hook signature
  `useResizableSplit({ layout, artifactOpen, isMobile }): { groupRef, chatRef, rightRef, isSplit, collapsible, onLayoutChanged, defaultLayout }`.
  - `layout: PanelLayout`, `artifactOpen: boolean`, `isMobile: boolean`.
  - `collapsible: boolean` — true only when topology occupies the right panel (`layout !== 'chat-full'`); thread passes it to both panels' `collapsible` prop.

Note: `deriveMode` keeps its existing `{ open, fullscreen, isMobile }` signature; the hook computes those from `layout` + `artifactOpen` internally. (This avoids a signature ripple; the canonical state knowledge stays at the hook boundary.)

- [ ] **Step 1: Write the failing test**

Replace the body of `src/components/thread/use-resizable-split.test.tsx` with:

```tsx
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { panelLayoutAtom } from '@/lib/ha-graph/atoms';
import { splitFractionAtom } from '@/lib/settings';

import { useResizableSplit } from './use-resizable-split';

function wrapperWith(store: ReturnType<typeof createStore>) {
  return ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
}

describe('useResizableSplit', () => {
  it('is split + collapsible when layout is split on desktop', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    expect(result.current.isSplit).toBe(true);
    expect(result.current.collapsible).toBe(true);
  });

  it('is not collapsible when an artifact (not topology) occupies the right panel', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'chat-full', artifactOpen: true, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    expect(result.current.collapsible).toBe(false);
  });

  it('drag that collapses topology -> closes topology (chat-full)', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    act(() => result.current.onLayoutChanged({ chat: 100, topology: 0 }));
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });

  it('drag that collapses chat -> topology fullscreen', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    act(() => result.current.onLayoutChanged({ chat: 0, topology: 100 }));
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('a plain split drag persists the ratio and leaves the layout', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    act(() => result.current.onLayoutChanged({ chat: 60, topology: 40 }));
    expect(store.get(splitFractionAtom)).toBe(0.6);
    expect(store.get(panelLayoutAtom)).toBe('split');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/thread/use-resizable-split.test.tsx`
Expected: FAIL — the hook still takes `{ open, fullscreen, isMobile }`, returns no `collapsible`, and `onLayoutChanged` does not write `panelLayoutAtom`.

- [ ] **Step 3: Rewrite the hook**

Replace the body of `src/components/thread/use-resizable-split.ts` with:

```ts
import { useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { type Layout, useGroupRef, usePanelRef } from 'react-resizable-panels';

import { closeTopologyAtom, enterFullscreenAtom, openTopologyAtom, type PanelLayout } from '@/lib/ha-graph/atoms';
import { clampSplitFraction, splitFractionAtom } from '@/lib/settings';

import {
  actionFromDragged,
  applyMode,
  CHAT_PANEL_ID,
  deriveMode,
  targetLayout,
  TOPOLOGY_PANEL_ID,
} from './split-layout';

interface ResizableSplitInputs {
  layout: PanelLayout;
  artifactOpen: boolean;
  isMobile: boolean;
}

/**
 * Wires a persistent react-resizable-panels Group to the canonical panelLayout:
 * an effect resizes the panels to match the derived mode, and user drags write
 * back to the layout (collapse) or the saved ratio (resize). The panels never
 * unmount, so the topology canvas keeps its WebGL context across states.
 */
export function useResizableSplit({ layout, artifactOpen, isMobile }: ResizableSplitInputs) {
  const groupRef = useGroupRef();
  const chatRef = usePanelRef();
  const rightRef = usePanelRef();

  const storedFraction = clampSplitFraction(useAtomValue(splitFractionAtom));
  const setFraction = useSetAtom(splitFractionAtom);
  const closeTopology = useSetAtom(closeTopologyAtom);
  const enterFullscreen = useSetAtom(enterFullscreenAtom);
  const openTopology = useSetAtom(openTopologyAtom);

  // The Group's visual arrangement (incl. artifact + mobile), distinct from the
  // canonical layout. Topology occupies the right panel only when it's open.
  const topologyVisible = layout !== 'chat-full';
  const mode = deriveMode({ open: topologyVisible || artifactOpen, fullscreen: layout === 'topology-full', isMobile });
  const isSplit = mode === 'split';
  // Drag-to-collapse is only meaningful when topology (not an artifact) is the
  // right-panel content; otherwise the panels are resize-only.
  const collapsible = topologyVisible;

  // Seed the initial Group layout once so the first paint matches (no flash).
  const defaultLayoutRef = useRef<Layout | undefined>(undefined);
  if (!defaultLayoutRef.current) {
    defaultLayoutRef.current = targetLayout(mode, storedFraction);
  }

  // The effect drives the Group imperatively; suppress the onLayoutChanged echo
  // those programmatic changes produce so they aren't mistaken for user drags.
  const isApplyingRef = useRef(false);
  useEffect(() => {
    isApplyingRef.current = true;
    applyMode(mode, storedFraction, { group: groupRef.current, chat: chatRef.current, right: rightRef.current });
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb: () => void) => setTimeout(cb, 0);
    raf(() => {
      isApplyingRef.current = false;
    });
  }, [mode, storedFraction, groupRef, chatRef, rightRef]);

  const onLayoutChanged = (changed: Layout) => {
    if (isApplyingRef.current) return; // programmatic echo, not a user drag
    switch (actionFromDragged(changed)) {
      case 'close':
        closeTopology();
        break;
      case 'fullscreen':
        enterFullscreen();
        break;
      case 'split': {
        openTopology(); // ensure 'split' if a collapsed side was dragged back out
        const chat = changed[CHAT_PANEL_ID];
        const topology = changed[TOPOLOGY_PANEL_ID];
        if (chat > 0 && topology > 0) setFraction(clampSplitFraction(chat / 100));
        break;
      }
    }
  };

  return { groupRef, chatRef, rightRef, isSplit, collapsible, onLayoutChanged, defaultLayout: defaultLayoutRef.current };
}
```

- [ ] **Step 4: Update the hook call + panels in `thread.tsx`**

In `src/components/thread/thread.tsx`, add `panelLayoutAtom` to the atoms import (keep the existing imports for now — buttons migrate in Task 7), and read it:

```ts
  const layout = useAtomValue(panelLayoutAtom);
```

Replace the hook call (currently `useResizableSplit({ open: rightPanelOpen, fullscreen: graphFullscreen, isMobile })`):

```ts
  const { chatRef, collapsible, defaultLayout, groupRef, isSplit, onLayoutChanged, rightRef } = useResizableSplit({
    layout,
    artifactOpen,
    isMobile,
  });
```

On **both** `<ResizablePanel>` elements (chat and topology), make the `collapsible` prop dynamic — change `collapsible` (currently a bare boolean prop) to:

```tsx
          collapsible={collapsible}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/thread/use-resizable-split.test.tsx`
Expected: PASS. Then `npx vitest run` — full suite green.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc -b && npx eslint src/components/thread/use-resizable-split.ts src/components/thread/use-resizable-split.test.tsx src/components/thread/thread.tsx
git add src/components/thread/use-resizable-split.ts src/components/thread/use-resizable-split.test.tsx src/components/thread/thread.tsx
git commit -m "feat(terminus): drag-to-collapse writes panelLayout (loop-gated)"
```

---

### Task 7: `thread.tsx` — buttons + affordances on the canonical state

**Files:**
- Modify: `src/components/thread/thread.tsx`

**Interfaces:**
- Consumes: `panelLayoutAtom` (already read in Task 6), `openTopologyAtom`, `enterFullscreenAtom`, `closeArtifact` (existing).

Wiring task; verified by tsc/eslint/full vitest/build (no new unit test — `thread.tsx` has no harness, and the logic it now calls is unit-tested in Tasks 1/5/6). The interactive checklist is the final manual verification.

- [ ] **Step 1: Swap the atoms import + hooks**

In `src/components/thread/thread.tsx`, replace the graph atom imports:

```ts
  graphFullscreenAtom,
  graphPanelOpenAtom,
```

with:

```ts
  enterFullscreenAtom,
  openTopologyAtom,
  panelLayoutAtom,
```

Replace the four hook reads/setters (currently lines ~95-98):

```ts
  const graphPanelOpen = useAtomValue(graphPanelOpenAtom);
  const graphFullscreen = useAtomValue(graphFullscreenAtom);
  const setGraphFullscreen = useSetAtom(graphFullscreenAtom);
  const setGraphPanelOpen = useSetAtom(graphPanelOpenAtom);
```

with (note `layout` was already added in Task 6 — keep a single declaration):

```ts
  const layout = useAtomValue(panelLayoutAtom);
  const openTopology = useSetAtom(openTopologyAtom);
  const enterFullscreen = useSetAtom(enterFullscreenAtom);
```

Replace `rightPanelOpen`:

```ts
  const rightPanelOpen = artifactOpen || graphPanelOpen;
```

with:

```ts
  const rightPanelOpen = artifactOpen || layout !== 'chat-full';
```

- [ ] **Step 2: Migrate the button handlers + visibility**

Replace the `openTopology` handler body. The current opens topology in split:

```ts
  const openTopology = () => {
    closeArtifact();
    setGraphFullscreen(false);
    setGraphPanelOpen(true);
```

becomes (rename to avoid colliding with the `openTopology` setter from Step 1 — call the setter directly):

```ts
  const showTopology = () => {
    closeArtifact();
    openTopology(); // chat-full -> split
```

Update the JSX that called `openTopology` (the "Home topology" `TooltipIconButton` `onClick`) to `showTopology`, and its visibility guard `{!graphPanelOpen && (` to:

```tsx
                {layout === 'chat-full' && (
```

Update the "Close chat" button: its guard `{graphPanelOpen && !graphFullscreen && !isMobile && (` becomes:

```tsx
                {layout === 'split' && !isMobile && (
```

and its `onClick={() => setGraphFullscreen(true)}` becomes:

```tsx
                  onClick={enterFullscreen}
```

(If any other `graphPanelOpen` / `graphFullscreen` reads remain in `thread.tsx`, replace them: `graphPanelOpen` → `layout !== 'chat-full'`, `graphFullscreen` → `layout === 'topology-full'`. Grep to confirm none remain.)

- [ ] **Step 3: Verify the migration is complete**

```bash
grep -n "graphPanelOpen\|graphFullscreen" src/components/thread/thread.tsx || echo "clean"
```
Expected: `clean` (no references left in thread.tsx).

- [ ] **Step 4: Typecheck, lint, build, full tests**

```bash
npx tsc -b
npx eslint src/components/thread/thread.tsx
npx vitest run
pnpm build
```
Expected: all clean; `pnpm build` emits `dist/` (pre-existing chunk-size warning is unrelated).

- [ ] **Step 5: Commit**

```bash
git add src/components/thread/thread.tsx
git commit -m "feat(terminus): thread buttons + affordances use panelLayout"
```

---

### Task 8: Delete the temporary shim atoms

**Files:**
- Modify: `src/lib/ha-graph/atoms.ts`

**Interfaces:**
- Removes: `graphPanelOpenAtom`, `graphFullscreenAtom`.

- [ ] **Step 1: Confirm there are no remaining consumers**

```bash
grep -rn "graphPanelOpenAtom\|graphFullscreenAtom" src
```
Expected: matches only in `src/lib/ha-graph/atoms.ts` (the definitions). If any other file matches, that consumer was missed — migrate it (same pattern as Tasks 2-3, 7) before deleting.

- [ ] **Step 2: Delete the shims**

In `src/lib/ha-graph/atoms.ts`, remove the two temporary shim blocks added in Task 1 (the `graphPanelOpenAtom` and `graphFullscreenAtom` derived atoms and their `// TEMPORARY migration shims …` comment).

- [ ] **Step 3: Verify the whole feature**

```bash
grep -rn "graphPanelOpenAtom\|graphFullscreenAtom\|terminus-graph-panel-open\|terminus-graph-fullscreen" src || echo "fully removed"
npx tsc -b
npx eslint src/lib/ha-graph/atoms.ts
npx vitest run
pnpm build
```
Expected: `fully removed`; tsc clean; eslint clean; full suite green; build OK.

- [ ] **Step 4: Manual verification (dev server)**

Run `pnpm dev` and confirm the single-source-of-truth behavior end to end:
1. Open topology from the sidebar → fullscreen; from the chat top-bar (Network icon) → split.
2. In split, drag the topology side fully closed → topology closes (chat-full); drag the chat side fully closed → topology fullscreen. Buttons and drag agree.
3. The URL reflects every change: `?layout=chat` / `?layout=chat,topology` / `?layout=topology`. Back/forward restores the exact layout (incl. fullscreen). A deep link like `?layout=topology` opens straight into fullscreen.
4. Reload → the layout (and split ratio) persist.
5. Open an artifact (no topology) → the divider is resize-only (no drag-collapse); the artifact closes via its X.
6. Narrow below the desktop breakpoint → topology shows full-width, no divider.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ha-graph/atoms.ts
git commit -m "refactor(terminus): drop temporary panel-state shim atoms"
```

---

## Self-Review

**Spec coverage:**
- Single source of truth (`panelLayoutAtom`) → Task 1. ✓
- Old booleans removed (no compat) → Task 1 adds temp shims; Task 8 deletes them. ✓
- Named action atoms as the write API → Task 1; consumed in Tasks 2/3/6/7. ✓
- Buttons write canonical state → Tasks 2 (graph-panel), 3 (sidebar), 7 (thread). ✓
- Drag-to-collapse writes the same state, loop-gated → Tasks 5 (`actionFromDragged`) + 6 (`isApplyingRef`, write-back). ✓
- Content-aware collapsible (artifact = resize-only) → Task 6 `collapsible = layout !== 'chat-full'`; Task 6 Step 4 wires the prop. ✓
- `layout` URL param as visible-panel list, default explicit, always written, order-independent parse → Task 1 helpers + Task 4 sync. ✓
- Old `topology` param dropped → Task 4 replaces it; no alias. ✓
- `deriveMode` clean inputs → plan keeps `deriveMode`'s signature and computes `open`/`fullscreen` at the hook boundary (documented deviation, Task 6) to avoid a signature ripple; behavior identical. ✓
- Mobile / artifact / deep-link edge cases → covered by Task 6 logic + Task 8 manual checklist. ✓

**Placeholder scan:** No TBD/TODO; every code step shows the actual code or exact before/after snippet with an anchor.

**Type consistency:** `PanelLayout`, `PanelName`, `panelLayoutAtom`, the four action atoms, `layoutToPanels`/`panelsToLayout`, `actionFromDragged`/`DragAction`, and the hook's `{ layout, artifactOpen, isMobile } → { …, collapsible }` shape are used identically across Tasks 1→4→5→6→7. `deriveMode` retains its existing `{ open, fullscreen, isMobile }` signature throughout (no task changes it).

**Note vs spec:** The spec proposed `deriveMode({ layout, artifactOpen, isMobile })`; the plan instead keeps `deriveMode`'s current signature and derives `open`/`fullscreen` inside the hook. Same behavior, smaller blast radius, no broken intermediate builds. Flagged for the reviewer.
