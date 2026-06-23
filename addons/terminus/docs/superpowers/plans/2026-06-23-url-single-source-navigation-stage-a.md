# URL as single source of truth — Stage A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `window.location` the single runtime source for the panel layout, with a membrane-style localStorage checkpoint that seeds boot and write-through-persists every navigation.

**Architecture:** A pure navigation-checkpoint core + a boot side-effect (seed URL from checkpoint when the URL is blank) + a runtime write-through boundary (replaces `ParentUrlSync`, persisting to both the parent hash and localStorage). The layout atom is replaced by a nuqs-backed `usePanelLayout` hook whose value `'chat' | 'topology' | 'split'` *is* the `?layout` token. Graph-view stays on its atom for now (Stage B).

**Tech Stack:** React, TypeScript, Jotai (being reduced), nuqs (History adapter), TanStack Router, Vitest, `@testing-library/react`, `nuqs/adapters/testing`.

## Global Constraints

- Frontend uses **pnpm**; do not run `npm install`.
- **Do NOT bump** `frontend/package.json` (stays `0.0.0`). Release version is `config.yaml` only; bump it + add a `CHANGELOG.md` entry **only** at the end (Task 11).
- TDD, red-first: every new function/hook gets a failing test before implementation. Keep test output pristine.
- Entity/value naming: the layout values are exactly `'chat' | 'topology' | 'split'` (no `-full` suffix).
- Verify after each task: `npx tsc --noEmit` clean, `npx vitest run` green, `npx eslint <changed files>` clean.
- Run all commands from `addons/terminus/frontend/`.

---

## File Structure

**New:**
- `src/lib/navigation-checkpoint.ts` — pure core: `CHECKPOINT_KEY`, `isBaseLocation`, `resolveInitialLocation`, `readCheckpoint`, `writeCheckpoint`.
- `src/lib/navigation-checkpoint.test.ts`
- `src/lib/navigation-checkpoint-restore.ts` — boot side-effect; seeds URL from checkpoint. Imported in `main.tsx` after `parent-url-restore`.
- `src/components/navigation-checkpoint-sync.tsx` — runtime write-through boundary; replaces `ParentUrlSync`.
- `src/components/navigation-checkpoint-sync.test.tsx`
- `src/lib/ha-graph/use-panel-layout.ts` — `PanelLayout` type + `usePanelLayout()` (nuqs-backed) with actions.
- `src/lib/ha-graph/use-panel-layout.test.tsx`

**Modified:**
- `src/main.tsx` — add checkpoint-restore import.
- `src/lib/ha-graph/atoms.ts` — remove layout atom/actions/token-helpers; `PanelLayout` moves out.
- `src/lib/ha-graph/atoms.test.ts` — drop the moved layout specs.
- `src/components/sidebar/app-sidebar.tsx` + `.test.tsx`
- `src/components/graph/graph-panel.tsx` + `.test.tsx`
- `src/components/thread/use-resizable-split.ts` + `.test.tsx`
- `src/components/thread/thread.tsx`
- `src/components/graph/topology-url-sync.tsx` — drop its `?layout` read/write; derive topology-visible from `usePanelLayout`.

**Deleted:**
- `src/components/parent-url-sync.tsx` (superseded by `navigation-checkpoint-sync.tsx`).

---

## Task 1: Navigation-checkpoint pure core

**Files:**
- Create: `src/lib/navigation-checkpoint.ts`
- Test: `src/lib/navigation-checkpoint.test.ts`

**Interfaces:**
- Produces:
  - `CHECKPOINT_KEY: 'terminus-nav-checkpoint'`
  - `isBaseLocation(rel: string): boolean`
  - `resolveInitialLocation(currentRel: string, checkpoint: string | null): string | null`
  - `readCheckpoint(storage: Pick<Storage, 'getItem'>): string | null`
  - `writeCheckpoint(storage: Pick<Storage, 'setItem'>, rel: string): void`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/navigation-checkpoint.test.ts
import { describe, expect, it, vi } from 'vitest';

import {
  CHECKPOINT_KEY,
  isBaseLocation,
  readCheckpoint,
  resolveInitialLocation,
  writeCheckpoint,
} from './navigation-checkpoint';

describe('isBaseLocation', () => {
  it('treats "/" and "" as base, anything else as not', () => {
    expect(isBaseLocation('/')).toBe(true);
    expect(isBaseLocation('')).toBe(true);
    expect(isBaseLocation('/abc')).toBe(false);
    expect(isBaseLocation('/?layout=split')).toBe(false);
  });
});

describe('resolveInitialLocation', () => {
  it('URL wins: a non-base current location is never overridden', () => {
    expect(resolveInitialLocation('/abc?layout=split', '/xyz')).toBeNull();
  });
  it('falls back to a non-base checkpoint when the URL is blank', () => {
    expect(resolveInitialLocation('/', '/abc?layout=topology')).toBe('/abc?layout=topology');
  });
  it('returns null (defaults stand) when both are blank', () => {
    expect(resolveInitialLocation('/', null)).toBeNull();
    expect(resolveInitialLocation('/', '/')).toBeNull();
  });
});

describe('readCheckpoint / writeCheckpoint', () => {
  it('round-trips through a storage-like object', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    writeCheckpoint(storage, '/abc?layout=split');
    expect(store.get(CHECKPOINT_KEY)).toBe('/abc?layout=split');
    expect(readCheckpoint(storage)).toBe('/abc?layout=split');
  });
  it('swallows storage exceptions (private mode / quota)', () => {
    const throwing = {
      getItem: vi.fn(() => {
        throw new Error('denied');
      }),
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
    };
    expect(readCheckpoint(throwing)).toBeNull();
    expect(() => writeCheckpoint(throwing, '/x')).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/navigation-checkpoint.test.ts`
Expected: FAIL — `Cannot find module './navigation-checkpoint'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/navigation-checkpoint.ts
// Pure core for the navigation checkpoint: localStorage is a write-through
// fallback, never a source of truth. The URL (window.location) is authoritative;
// the checkpoint only seeds boot when the URL carries no specific location.

export const CHECKPOINT_KEY = 'terminus-nav-checkpoint';

/** A relative location with nothing to restore over ("/" or empty). */
export function isBaseLocation(rel: string): boolean {
  return rel === '/' || rel === '';
}

/**
 * The location to boot at. The URL wins whenever it already carries a non-base
 * location (e.g. a real navigation or a parent-hash restore); otherwise fall
 * back to the checkpoint; otherwise null so the app's own defaults stand.
 */
export function resolveInitialLocation(currentRel: string, checkpoint: string | null): string | null {
  if (!isBaseLocation(currentRel)) return null;
  if (checkpoint && !isBaseLocation(checkpoint)) return checkpoint;
  return null;
}

export function readCheckpoint(storage: Pick<Storage, 'getItem'>): string | null {
  try {
    return storage.getItem(CHECKPOINT_KEY);
  } catch {
    return null;
  }
}

export function writeCheckpoint(storage: Pick<Storage, 'setItem'>, rel: string): void {
  try {
    storage.setItem(CHECKPOINT_KEY, rel);
  } catch {
    // Private mode / quota — checkpoint is best-effort, never fatal.
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/navigation-checkpoint.test.ts`
Expected: PASS (7 assertions across 6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/navigation-checkpoint.ts src/lib/navigation-checkpoint.test.ts
git commit -m "feat(terminus): navigation-checkpoint pure core"
```

---

## Task 2: Boot restore module + wire into main.tsx

**Files:**
- Create: `src/lib/navigation-checkpoint-restore.ts`
- Modify: `src/main.tsx:1-3` (add import after `parent-url-restore`)

**Interfaces:**
- Consumes: `readCheckpoint`, `resolveInitialLocation` (Task 1); `relativeLocation` (`@/lib/parent-url`); `resolveBasePath` (`@/runtime-config`).
- Produces: a side-effect module (no exports). Must run after `parent-url-restore` and before `./router`.

- [ ] **Step 1: Write the implementation**

This module is a thin composition of already-tested pure functions plus DOM
calls; its decision logic is covered by Task 1's `resolveInitialLocation` tests.
No separate unit test (it has no logic of its own beyond reading
`window`/`localStorage` and calling `replaceState`).

```typescript
// src/lib/navigation-checkpoint-restore.ts
// Side-effect module: when the iframe boots at a blank location (no parent-hash
// restore happened), seed the URL from the localStorage checkpoint BEFORE the
// router/nuqs read window.location. Imported in main.tsx right AFTER
// parent-url-restore, so a parent-hash location always takes precedence (it
// makes the location non-base, and resolveInitialLocation then returns null).

import { resolveBasePath } from '@/runtime-config';

import { relativeLocation } from './parent-url';
import { readCheckpoint, resolveInitialLocation } from './navigation-checkpoint';

const basepath = resolveBasePath(window.location);
const currentRel = relativeLocation(window.location, basepath);
const target = resolveInitialLocation(currentRel, readCheckpoint(window.localStorage));
if (target) {
  // basepath ends with "/"; target starts with "/" — join without doubling it.
  window.history.replaceState({}, '', basepath.replace(/\/$/, '') + target);
}
```

- [ ] **Step 2: Wire it into main.tsx**

Edit the top of `src/main.tsx` so the import sits immediately after the existing
`parent-url-restore` import (order matters — both must run before `./router`):

```typescript
// Restore the iframe location from the parent (HA) URL hash BEFORE the router is
// imported/evaluated. Must stay the first import.
import './lib/parent-url-restore';
// Then fall back to the localStorage checkpoint if the URL is still blank.
import './lib/navigation-checkpoint-restore';
```

- [ ] **Step 3: Verify build + types**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npx vitest run`
Expected: all existing tests still PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/navigation-checkpoint-restore.ts src/main.tsx
git commit -m "feat(terminus): seed boot location from nav checkpoint"
```

---

## Task 3: Write-through boundary (replaces ParentUrlSync)

**Files:**
- Create: `src/components/navigation-checkpoint-sync.tsx`
- Test: `src/components/navigation-checkpoint-sync.test.tsx`
- Delete: `src/components/parent-url-sync.tsx`
- Modify: `src/components/thread/thread.tsx:23-24,291-292` (swap the mount + import)

**Interfaces:**
- Consumes: `mirrorToParent`, `relativeLocation` (`@/lib/parent-url`); `writeCheckpoint` (Task 1); `resolveBasePath` (`@/runtime-config`); `useThreadId` (`@/hooks/use-thread-id`).
- Produces: `NavigationCheckpointSync(): null` — mount once.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/navigation-checkpoint-sync.test.tsx
import { render } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NavigationCheckpointSync } from './navigation-checkpoint-sync';

import { CHECKPOINT_KEY } from '@/lib/navigation-checkpoint';

// useThreadId reads the router; stub it so the boundary mounts without a router.
vi.mock('@/hooks/use-thread-id', () => ({
  useThreadId: () => [null, vi.fn()],
}));

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('NavigationCheckpointSync', () => {
  it('write-through-persists the current relative location to localStorage on mount', () => {
    render(<NavigationCheckpointSync />, {
      wrapper: withNuqsTestingAdapter({ searchParams: '?layout=split' }),
    });
    expect(window.localStorage.getItem(CHECKPOINT_KEY)).toContain('layout=split');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/navigation-checkpoint-sync.test.tsx`
Expected: FAIL — `Cannot find module './navigation-checkpoint-sync'`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/navigation-checkpoint-sync.tsx
import { useEffect, useRef } from 'react';

import { parseAsString, useQueryStates } from 'nuqs';

import { useThreadId } from '@/hooks/use-thread-id';
import { writeCheckpoint } from '@/lib/navigation-checkpoint';
import { mirrorToParent, relativeLocation } from '@/lib/parent-url';
import { resolveBasePath } from '@/runtime-config';

/**
 * Single write-through persistence boundary for navigation state. On every
 * navigation it mirrors the iframe's relative location into BOTH the parent
 * (HA) URL hash (survives reload) and localStorage (survives leave-and-return).
 * Neither is ever read at runtime — window.location is the source of truth; these
 * are read only at boot (parent-url-restore / navigation-checkpoint-restore).
 *
 * Subscribes to the canonical nav param set + the thread path purely to
 * re-render when they change; the effect then reads the live window.location, so
 * it captures the full location. (Replaces ParentUrlSync, which subscribed to a
 * stale `?topology` key and missed `?layout` / `?group` changes.)
 *
 * Renders nothing; mount once.
 */
export function NavigationCheckpointSync(): null {
  const [threadId] = useThreadId();
  const [navParams] = useQueryStates({
    layout: parseAsString,
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  void threadId;
  void navParams;

  const last = useRef<string | null>(null);
  useEffect(() => {
    const rel = relativeLocation(window.location, resolveBasePath(window.location));
    if (rel === last.current) return;
    last.current = rel;
    mirrorToParent(rel);
    writeCheckpoint(window.localStorage, rel);
  });

  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/navigation-checkpoint-sync.test.tsx`
Expected: PASS.

- [ ] **Step 5: Swap the mount in thread.tsx and delete ParentUrlSync**

In `src/components/thread/thread.tsx`, replace the import (line ~24):

```tsx
// remove:  import { ParentUrlSync } from '../parent-url-sync';
import { NavigationCheckpointSync } from '../navigation-checkpoint-sync';
```

and the mount (line ~292):

```tsx
// remove:  <ParentUrlSync />
<NavigationCheckpointSync />
```

Then delete the old file:

```bash
git rm src/components/parent-url-sync.tsx
```

If `src/components/parent-url-sync.test.tsx` exists, delete it too:

```bash
git rm --ignore-unmatch src/components/parent-url-sync.test.tsx
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests PASS (no remaining reference to `ParentUrlSync`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(terminus): nav checkpoint write-through boundary, retire ParentUrlSync"
```

---

## Task 4: `usePanelLayout` hook (nuqs-backed) + `PanelLayout` value rename

**Files:**
- Create: `src/lib/ha-graph/use-panel-layout.ts`
- Test: `src/lib/ha-graph/use-panel-layout.test.tsx`

**Interfaces:**
- Produces:
  - `type PanelLayout = 'chat' | 'topology' | 'split'`
  - `usePanelLayout(): { layout: PanelLayout; setLayout: (l: PanelLayout) => void; openTopology: () => void; closeTopology: () => void; enterFullscreen: () => void; exitFullscreen: () => void }`
- Semantics (identical to the retired action atoms): `openTopology` only `chat→split`; `closeTopology` → `chat` always; `enterFullscreen` → `topology` always; `exitFullscreen` only `topology→split`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/lib/ha-graph/use-panel-layout.test.tsx
import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { usePanelLayout } from './use-panel-layout';

function renderLayout(search = '') {
  return renderHook(() => usePanelLayout(), {
    wrapper: withNuqsTestingAdapter({ searchParams: search }),
  });
}

describe('usePanelLayout', () => {
  it('defaults to chat when ?layout is absent or garbage', () => {
    expect(renderLayout('').result.current.layout).toBe('chat');
    expect(renderLayout('?layout=bogus').result.current.layout).toBe('chat');
  });

  it('reads each token straight through', () => {
    expect(renderLayout('?layout=topology').result.current.layout).toBe('topology');
    expect(renderLayout('?layout=split').result.current.layout).toBe('split');
  });

  it('openTopology: chat -> split, otherwise unchanged', () => {
    const split = renderLayout('?layout=topology');
    act(() => split.result.current.openTopology());
    expect(split.result.current.layout).toBe('topology');

    const open = renderLayout('');
    act(() => open.result.current.openTopology());
    expect(open.result.current.layout).toBe('split');
  });

  it('closeTopology -> chat; enterFullscreen -> topology', () => {
    const r = renderLayout('?layout=split');
    act(() => r.result.current.enterFullscreen());
    expect(r.result.current.layout).toBe('topology');
    act(() => r.result.current.closeTopology());
    expect(r.result.current.layout).toBe('chat');
  });

  it('exitFullscreen: topology -> split, otherwise unchanged', () => {
    const r = renderLayout('?layout=topology');
    act(() => r.result.current.exitFullscreen());
    expect(r.result.current.layout).toBe('split');
    act(() => r.result.current.exitFullscreen());
    expect(r.result.current.layout).toBe('split');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ha-graph/use-panel-layout.test.tsx`
Expected: FAIL — `Cannot find module './use-panel-layout'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/ha-graph/use-panel-layout.ts
import { useCallback, useMemo } from 'react';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

/**
 * The panel layout, sourced directly from the `?layout` URL param — there is no
 * separate store. The value IS the URL token.
 *  - chat:     topology not shown (chat occupies the row; an artifact may still
 *              open the right column — tracked separately).
 *  - split:    chat + topology side by side.
 *  - topology: topology fills the row, chat hidden.
 */
export type PanelLayout = 'chat' | 'topology' | 'split';

const LAYOUTS = ['chat', 'topology', 'split'] as const;

export function usePanelLayout(): {
  layout: PanelLayout;
  setLayout: (l: PanelLayout) => void;
  openTopology: () => void;
  closeTopology: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
} {
  const [raw, setRaw] = useQueryState('layout', parseAsStringLiteral(LAYOUTS));
  const layout: PanelLayout = raw ?? 'chat';

  const setLayout = useCallback((l: PanelLayout) => void setRaw(l), [setRaw]);

  const actions = useMemo(
    () => ({
      openTopology: () => setRaw((cur) => (((cur ?? 'chat') === 'chat' ? 'split' : cur) as PanelLayout)),
      closeTopology: () => setRaw('chat'),
      enterFullscreen: () => setRaw('topology'),
      exitFullscreen: () => setRaw((cur) => (cur === 'topology' ? 'split' : (cur ?? 'chat'))),
    }),
    [setRaw],
  );

  return { layout, setLayout, ...actions };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ha-graph/use-panel-layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ha-graph/use-panel-layout.ts src/lib/ha-graph/use-panel-layout.test.tsx
git commit -m "feat(terminus): usePanelLayout hook over ?layout (chat|topology|split)"
```

---

## Task 5: Rewire `app-sidebar` to `usePanelLayout`

**Files:**
- Modify: `src/components/sidebar/app-sidebar.tsx:23,32-34,50,81`
- Modify: `src/components/sidebar/app-sidebar.test.tsx`

**Interfaces:**
- Consumes: `usePanelLayout` (Task 4).

- [ ] **Step 1: Update the component**

Replace the atom import (line 23) and the three atom hooks (lines 32-34):

```tsx
// remove: import { closeTopologyAtom, enterFullscreenAtom, panelLayoutAtom } from '@/lib/ha-graph/atoms';
import { usePanelLayout } from '@/lib/ha-graph/use-panel-layout';
```

```tsx
// replace the three useAtomValue/useSetAtom lines with:
const { layout, enterFullscreen, closeTopology } = usePanelLayout();
```

Rename the literals: line 50 `layout === 'chat-full'` → `layout === 'chat'`; line 81 `layout !== 'chat-full'` → `layout !== 'chat'`. (Remove now-unused `useAtomValue`/`useSetAtom` imports if nothing else in the file uses them.)

- [ ] **Step 2: Update the test to drive layout via the URL**

In `src/components/sidebar/app-sidebar.test.tsx`, replace the Jotai store seeding
(`store.set(panelLayoutAtom, 'chat-full')` / assertions on `store.get(panelLayoutAtom)`)
with a nuqs testing wrapper and URL assertions. Wrap renders with
`withNuqsTestingAdapter({ searchParams: '?layout=chat', onUrlUpdate })` and assert
the layout transition via the `onUrlUpdate` callback's `queryString` (e.g. that
clicking the toggle pushes `layout=topology` or clears it to `chat`). Use this
shape:

```tsx
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
render(<AppSidebar />, {
  wrapper: withNuqsTestingAdapter({ searchParams: '?layout=chat', onUrlUpdate }),
});
// ... fireEvent.click(toggleButton) ...
expect(onUrlUpdate).toHaveBeenCalled();
expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=topology');
```

Keep the test's intent identical (open/close behaviour of the topology toggle);
only the state mechanism changes from atom to URL.

- [ ] **Step 3: Verify**

Run: `npx vitest run src/components/sidebar/app-sidebar.test.tsx && npx tsc --noEmit`
Expected: PASS, types clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/sidebar/app-sidebar.tsx src/components/sidebar/app-sidebar.test.tsx
git commit -m "refactor(terminus): app-sidebar layout via usePanelLayout"
```

---

## Task 6: Rewire `graph-panel` to `usePanelLayout`

**Files:**
- Modify: `src/components/graph/graph-panel.tsx:16,25-28`
- Modify: `src/components/graph/graph-panel.test.tsx`

**Interfaces:**
- Consumes: `usePanelLayout` (Task 4).

- [ ] **Step 1: Update the component**

```tsx
// remove: import { closeTopologyAtom, exitFullscreenAtom, panelLayoutAtom } from '@/lib/ha-graph/atoms';
import { usePanelLayout } from '@/lib/ha-graph/use-panel-layout';
```

Replace lines 25-28:

```tsx
const { layout, closeTopology, exitFullscreen } = usePanelLayout();
const fullscreen = layout === 'topology';
```

(Remove the now-unused `useAtomValue`/`useSetAtom` import if `topology3dAtom` is the only remaining atom use — it still needs `useAtomValue`, so keep that import; drop `useSetAtom` if unused.)

- [ ] **Step 2: Update the test**

In `src/components/graph/graph-panel.test.tsx`, replace
`store.set(panelLayoutAtom, fullscreen ? 'topology-full' : 'split')` with a nuqs
wrapper seeding `?layout=topology` (fullscreen) or `?layout=split`, and replace
`expect(store.get(panelLayoutAtom)).toBe('chat-full')` with an `onUrlUpdate`
assertion that the close action sets `layout=chat` (same `onUrlUpdate` pattern as
Task 5, Step 2).

- [ ] **Step 3: Verify**

Run: `npx vitest run src/components/graph/graph-panel.test.tsx && npx tsc --noEmit`
Expected: PASS, types clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/graph/graph-panel.tsx src/components/graph/graph-panel.test.tsx
git commit -m "refactor(terminus): graph-panel layout via usePanelLayout"
```

---

## Task 7: Rewire `use-resizable-split` to `usePanelLayout`

**Files:**
- Modify: `src/components/thread/use-resizable-split.ts:15,37-39,43-44`
- Modify: `src/components/thread/use-resizable-split.test.tsx`

**Interfaces:**
- Consumes: `usePanelLayout` (Task 4); `PanelLayout` type now from `use-panel-layout`.

- [ ] **Step 1: Update the hook**

Change the imports (line 15-16):

```typescript
import { clampSplitFraction, splitFractionAtom } from '@/lib/settings';
import { usePanelLayout, type PanelLayout } from '@/lib/ha-graph/use-panel-layout';
```

Replace the three action-atom setters (lines 37-39):

```typescript
const { closeTopology, enterFullscreen, openTopology } = usePanelLayout();
```

Rename literals: line 43 `layout !== 'chat-full'` → `layout !== 'chat'`; line 44 `layout === 'topology-full'` → `layout === 'topology'`. The `layout: PanelLayout` input prop is unchanged in shape (the type's values changed in Task 4).

- [ ] **Step 2: Update the test**

In `src/components/thread/use-resizable-split.test.tsx`, the hook is rendered with
`renderHook`. Wrap it with `withNuqsTestingAdapter({ searchParams: '?layout=chat', onUrlUpdate })`
and pass `layout: 'chat'` in the props (was `'chat-full'`). Replace the
`store.get(panelLayoutAtom)` assertions with `onUrlUpdate` assertions on the
resulting `layout=` token (`chat` for close, `topology` for fullscreen). Update
every `'chat-full'` → `'chat'` / `'topology-full'` → `'topology'` in the file.

- [ ] **Step 3: Verify**

Run: `npx vitest run src/components/thread/use-resizable-split.test.tsx && npx tsc --noEmit`
Expected: PASS, types clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/thread/use-resizable-split.ts src/components/thread/use-resizable-split.test.tsx
git commit -m "refactor(terminus): use-resizable-split layout via usePanelLayout"
```

---

## Task 8: Rewire `thread.tsx` to `usePanelLayout`

**Files:**
- Modify: `src/components/thread/thread.tsx:50-53,97-99,115,328,334,501`

**Interfaces:**
- Consumes: `usePanelLayout` (Task 4).

- [ ] **Step 1: Update the component**

Remove `enterFullscreenAtom`, `openTopologyAtom`, `panelLayoutAtom` from the
`@/lib/ha-graph/atoms` import (lines 50-53), and add:

```tsx
import { usePanelLayout } from '@/lib/ha-graph/use-panel-layout';
```

Replace lines 97-99:

```tsx
const { layout, openTopology, enterFullscreen } = usePanelLayout();
```

Rename literals: line 328 `layout === 'chat-full'` → `layout === 'chat'`; line 501 `layout !== 'chat-full'` → `layout !== 'chat'`. Line 334 (`layout === 'split'`) and line 115's comment need no value change. Drop now-unused `useSetAtom` import only if nothing else in the file uses it (verify — other atoms may remain).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/thread/thread.tsx
git commit -m "refactor(terminus): thread layout via usePanelLayout"
```

---

## Task 9: Drop the `?layout` half of `TopologyUrlSync`

**Files:**
- Modify: `src/components/graph/topology-url-sync.tsx`

**Interfaces:**
- Consumes: `usePanelLayout` (Task 4) — for read-only `layout` to gate view sync.
- After this task, `TopologyUrlSync` only syncs `graphViewAtom` ↔ the view params; it no longer reads or writes `?layout`. (It is deleted entirely in Stage B.)

- [ ] **Step 1: Update the component**

Remove the `layout` nuqs state and all `setLayoutParam` writes. Replace the
layout source with the read-only hook value, and delete the first-commit branch
that wrote the layout param (the checkpoint boundary + usePanelLayout now own
`?layout`). Concretely:

- Drop `const [layoutParam, setLayoutParam] = useQueryState('layout', …)`.
- Replace `parseAsStringLiteral` import usage if now unused (keep `parseAsString`).
- Replace `const [layout, setLayout] = useAtom(panelLayoutAtom)` with
  `const { layout } = usePanelLayout()` and drop `setLayout` (the URL→atom layout
  hydration is gone — layout no longer has an atom).
- In the URL→atom effect, delete the `paramToLayout` / `setLayout` lines; keep
  only the view sync, still gated on `layout !== 'chat'`:

```tsx
useEffect(() => {
  if (layout !== 'chat') {
    const nextView = viewFromParams(group, area, scene, automation);
    if (viewKey(nextView) !== viewKey(view)) setView(nextView);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [layout, group, area, scene, automation]);
```

- In the atoms→URL effect, delete every `wantParam` / `setLayoutParam` line and
  the `mounted`-gated layout write; keep the view-param writes (`setGroup`,
  `setArea`, `setScene`, `setAutomation`) gated on `topologyVisible = layout !== 'chat'`.
  The `mounted` ref may still guard the first-commit clobber of view params —
  keep it for the view writes.

Update the file's docstring to say it now syncs only the graph view, with layout
owned by `usePanelLayout` + the checkpoint boundary.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests PASS. Manually confirm no remaining
`panelLayoutAtom` / `paramToLayout` references in this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/graph/topology-url-sync.tsx
git commit -m "refactor(terminus): TopologyUrlSync syncs view only, layout owned by URL"
```

---

## Task 10: Remove the layout atom + token helpers from `atoms.ts`

**Files:**
- Modify: `src/lib/ha-graph/atoms.ts:4-56` (remove layout block)
- Modify: `src/lib/ha-graph/atoms.test.ts` (drop moved layout specs)

**Interfaces:**
- After this task, `atoms.ts` no longer exports `PanelLayout`, `panelLayoutAtom`,
  `LayoutParam`, `layoutToParam`, `paramToLayout`, `openTopologyAtom`,
  `closeTopologyAtom`, `enterFullscreenAtom`, `exitFullscreenAtom`. `PanelLayout`
  lives in `use-panel-layout.ts` (Task 4).

- [ ] **Step 1: Confirm nothing still imports the removed symbols**

Run:
```bash
grep -rn "panelLayoutAtom\|openTopologyAtom\|closeTopologyAtom\|enterFullscreenAtom\|exitFullscreenAtom\|layoutToParam\|paramToLayout\|LayoutParam" src --include="*.ts" --include="*.tsx" | grep -v "use-panel-layout"
```
Expected: only matches inside `atoms.ts` / `atoms.test.ts` (everything else was rewired in Tasks 5-9). If anything else appears, rewire it before continuing.

- [ ] **Step 2: Delete the layout block from atoms.ts**

Remove the `PanelLayout` type, `panelLayoutAtom`, the `LayoutParam` /
`layoutToParam` / `paramToLayout` helpers, and the four action atoms
(`atoms.ts` lines ~4-56). Leave `chatHistoryOpenAtom`, `GraphView`, `groupingOf`,
`rootViewFor`, `graphViewBaseAtom`, `graphViewAtom`, `selectedNodeAtom`,
`entityModalAtom`, `viewKey`, `viewScope`, and the position atoms untouched.

- [ ] **Step 3: Delete the moved specs from atoms.test.ts**

Remove the `describe('panelLayoutAtom', …)`, `describe('layout action atoms', …)`,
and `describe('layout <-> url param', …)` blocks and their now-unused imports
(`closeTopologyAtom`, `enterFullscreenAtom`, `exitFullscreenAtom`, `layoutToParam`,
`openTopologyAtom`, `panelLayoutAtom`, `paramToLayout`). Keep any non-layout specs.
If the file becomes empty, `git rm` it.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx vitest run && npx eslint src/lib/ha-graph/atoms.ts`
Expected: types clean; all tests PASS; lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ha-graph/atoms.ts src/lib/ha-graph/atoms.test.ts
git commit -m "refactor(terminus): drop layout atom + token helpers (URL is the source)"
```

---

## Task 11: Full verification + release bump

**Files:**
- Modify: `addons/terminus/config.yaml` (version)
- Modify: `addons/terminus/CHANGELOG.md` (new entry)

- [ ] **Step 1: Full frontend gate**

From `addons/terminus/frontend/`:
```bash
npx tsc --noEmit && npx eslint src && npx vitest run && npm run build
```
Expected: all clean/green; build succeeds.

- [ ] **Step 2: Grep for leftovers**

```bash
grep -rn "chat-full\|topology-full\|ParentUrlSync\|panelLayoutAtom" src --include="*.ts" --include="*.tsx"
```
Expected: no matches.

- [ ] **Step 3: Bump version + changelog**

This Stage A work supersedes the interim 0.18.1 commit on the branch. Set
`config.yaml` `version: "0.19.0"` (behavior change to the navigation/persistence
model) and add a `CHANGELOG.md` entry under `## 0.19.0`:

```markdown
## 0.19.0

- **Navigation is URL-driven with a localStorage checkpoint.** The panel layout
  now lives solely in the `?layout` URL param (`chat` / `topology` / `split`);
  localStorage is a write-through fallback that restores your last view when you
  return to the add-on, while the URL stays the source of truth. Layout and
  group changes now persist reliably (previously a stale subscription could miss
  them).
```

- [ ] **Step 4: Commit**

```bash
git add addons/terminus/config.yaml addons/terminus/CHANGELOG.md
git commit -m "chore(terminus): release 0.19.0 — URL-driven navigation (Stage A)"
```

---

## Self-Review (completed)

- **Spec coverage:** checkpoint boundary (Tasks 1-3) ✓; boot precedence (Task 1 `resolveInitialLocation` + Task 2 ordering) ✓; layout → URL incl. param==atom (Tasks 4-8) ✓; `ParentUrlSync` bug fix (Task 3) ✓; `TopologyUrlSync` layout half removed (Task 9) ✓; atom/localStorage redundancy removed for layout (Task 10) ✓. Graph view (Stage B) intentionally deferred.
- **Placeholder scan:** none — every code step shows complete code or an exact edit list.
- **Type consistency:** `PanelLayout = 'chat' | 'topology' | 'split'` defined in Task 4 and consumed unchanged in Tasks 5-9; `usePanelLayout` return shape stable across consumers; `CHECKPOINT_KEY` / `resolveInitialLocation` / `writeCheckpoint` names consistent across Tasks 1-3.
- **Note:** the spec suggested `router.subscribe('onResolved')` for the write-through trigger; the plan instead subscribes to the canonical nuqs param set because nuqs uses the History adapter here and router events may not fire on pure query-param changes. This still "watches the real location" and fixes the stale-key bug — the spec's intent.
