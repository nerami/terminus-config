# Resizable Chat / Topology Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user drag the divider between the chat and topology/artifact panels in the desktop split view, with the ratio persisted across reloads.

**Architecture:** One persistent `react-resizable-panels` v4 `Group` always wraps both columns (so neither unmounts → no WebGL/viewport reset). The existing open/close/fullscreen jotai atoms are left untouched; a new hook *reacts* to them and drives panel sizing imperatively. The continuously-variable split ratio is the only thing the user drags, and it persists via a jotai `atomWithStorage`.

**Tech Stack:** React 19 + TypeScript, Vite, jotai (`atomWithStorage`), `react-resizable-panels@4.11.2` (already installed), Tailwind v4, Vitest + happy-dom + @testing-library/react.

## Global Constraints

- All paths below are relative to `addons/terminus/frontend/`.
- Package manager is **pnpm** — never `npm install`. Lockfile `pnpm-lock.yaml` is source of truth.
- **Do NOT bump** `config.yaml`, `frontend/package.json`, or `backend/pyproject.toml` versions — this is a non-release iteration. No `CHANGELOG.md` entry.
- No new dependencies — `react-resizable-panels@4.11.2` is already in `package.json`.
- Tests: `npx vitest run <path>` (happy-dom env, globals on, setup `src/test-setup.ts`). Import `describe/it/expect` explicitly (repo convention).
- Persisted-settings convention: jotai `atomWithStorage('terminus-<name>', default, undefined, { getOnInit: true })` in `src/lib/settings.ts`, mirroring `viewToolsAtom`/`fontSizeAtom`.
- v4 API facts: primitives are `Group` / `Panel` / `Separator`; layouts are a `{ panelId: percent }` map; `Group.onLayoutChanged` fires on pointer **release**; `Panel` supports `collapsible` / `collapsedSize` / `minSize` and a `panelRef` imperative handle (`collapse`/`expand`/`isCollapsed`/`resize`); `Group` exposes `groupRef` (`getLayout`/`setLayout`). Panels and Separators **must be direct children** of the Group.

## File Structure

- `src/lib/settings.ts` *(modify)* — add `splitFractionAtom` + `clampSplitFraction` + bounds constants (persisted ratio).
- `src/components/thread/split-layout.ts` *(create)* — pure layout logic: `deriveMode`, `targetLayout`, `applyMode`, panel-id constants, types.
- `src/components/thread/split-layout.test.ts` *(create)* — unit tests for the above.
- `src/components/thread/use-resizable-split.ts` *(create)* — the hook wiring refs + mode effect + persistence.
- `src/components/thread/use-resizable-split.test.tsx` *(create)* — hook tests.
- `src/components/ui/resizable.tsx` *(create)* — Tailwind-styled re-exports of the v4 primitives.
- `src/components/ui/resizable.test.tsx` *(create)* — smoke/a11y test.
- `src/components/thread/thread.tsx` *(modify)* — replace the CSS-grid split container with the `Group`.

---

### Task 1: Persisted split-fraction atom + clamp helper

**Files:**
- Modify: `src/lib/settings.ts`
- Test: `src/lib/settings.test.ts` (append cases)

**Interfaces:**
- Consumes: nothing.
- Produces: `DEFAULT_SPLIT_FRACTION = 0.4`, `MIN_SPLIT_FRACTION = 0.25`, `MAX_SPLIT_FRACTION = 0.75`, `clampSplitFraction(fraction: number): number`, `splitFractionAtom` (jotai atom of `number`, localStorage key `terminus-split-fraction`).

- [ ] **Step 1: Write the failing test**

Append to `src/lib/settings.test.ts`:

```ts
import { clampSplitFraction, DEFAULT_SPLIT_FRACTION, MAX_SPLIT_FRACTION, MIN_SPLIT_FRACTION } from './settings';

describe('clampSplitFraction', () => {
  it('passes through an in-range fraction', () => {
    expect(clampSplitFraction(0.55)).toBe(0.55);
  });

  it('clamps below the minimum', () => {
    expect(clampSplitFraction(0.1)).toBe(MIN_SPLIT_FRACTION);
  });

  it('clamps above the maximum', () => {
    expect(clampSplitFraction(0.95)).toBe(MAX_SPLIT_FRACTION);
  });

  it('falls back to the default for non-finite input', () => {
    expect(clampSplitFraction(Number.NaN)).toBe(DEFAULT_SPLIT_FRACTION);
    expect(clampSplitFraction(Infinity)).toBe(DEFAULT_SPLIT_FRACTION);
  });
});
```

(Keep the existing `import` line at the top of the file if one already imports from `./settings`; merge the named imports rather than duplicating the import statement.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/settings.test.ts`
Expected: FAIL — `clampSplitFraction` / the new constants are not exported.

- [ ] **Step 3: Write minimal implementation**

In `src/lib/settings.ts`, after the existing `clampFontSize` definition add:

```ts
/** Default chat-column fraction of the split view (chat ~40%, topology ~60%). */
export const DEFAULT_SPLIT_FRACTION = 0.4;
/** Neither column may be dragged below a quarter of the width. */
export const MIN_SPLIT_FRACTION = 0.25;
export const MAX_SPLIT_FRACTION = 0.75;

/** Clamp a chat-column fraction to the resizable range; repair garbage input. */
export function clampSplitFraction(fraction: number): number {
  if (!Number.isFinite(fraction)) return DEFAULT_SPLIT_FRACTION;
  return Math.min(MAX_SPLIT_FRACTION, Math.max(MIN_SPLIT_FRACTION, fraction));
}

/** Chat-column fraction of the desktop split view, persisted across reloads. */
export const splitFractionAtom = atomWithStorage('terminus-split-fraction', DEFAULT_SPLIT_FRACTION, undefined, {
  getOnInit: true,
});
```

(`atomWithStorage` is already imported at the top of `settings.ts`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/settings.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/settings.ts src/lib/settings.test.ts
git commit -m "feat(terminus): add persisted split-fraction setting"
```

---

### Task 2: Pure layout helpers — `deriveMode` + `targetLayout`

**Files:**
- Create: `src/components/thread/split-layout.ts`
- Test: `src/components/thread/split-layout.test.ts`

**Interfaces:**
- Consumes: type `Layout` from `react-resizable-panels`.
- Produces:
  - `type SplitMode = 'chat-only' | 'panel-only' | 'split'`
  - `interface SplitInputs { open: boolean; fullscreen: boolean; isMobile: boolean }`
  - `CHAT_PANEL_ID = 'chat'`, `TOPOLOGY_PANEL_ID = 'topology'`
  - `deriveMode(inputs: SplitInputs): SplitMode`
  - `targetLayout(mode: SplitMode, fraction: number): Layout`  (a `{ chat: number; topology: number }` percentage map)

- [ ] **Step 1: Write the failing test**

Create `src/components/thread/split-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { CHAT_PANEL_ID, deriveMode, targetLayout, TOPOLOGY_PANEL_ID } from './split-layout';

describe('deriveMode', () => {
  it('is chat-only when nothing is open', () => {
    expect(deriveMode({ open: false, fullscreen: false, isMobile: false })).toBe('chat-only');
    expect(deriveMode({ open: false, fullscreen: true, isMobile: true })).toBe('chat-only');
  });

  it('is panel-only when open and either fullscreen or mobile', () => {
    expect(deriveMode({ open: true, fullscreen: true, isMobile: false })).toBe('panel-only');
    expect(deriveMode({ open: true, fullscreen: false, isMobile: true })).toBe('panel-only');
  });

  it('is split only when open on desktop and not fullscreen', () => {
    expect(deriveMode({ open: true, fullscreen: false, isMobile: false })).toBe('split');
  });
});

describe('targetLayout', () => {
  it('gives the chat the whole width when chat-only', () => {
    expect(targetLayout('chat-only', 0.4)).toEqual({ [CHAT_PANEL_ID]: 100, [TOPOLOGY_PANEL_ID]: 0 });
  });

  it('gives the panel the whole width when panel-only', () => {
    expect(targetLayout('panel-only', 0.4)).toEqual({ [CHAT_PANEL_ID]: 0, [TOPOLOGY_PANEL_ID]: 100 });
  });

  it('splits by the chat fraction', () => {
    expect(targetLayout('split', 0.4)).toEqual({ [CHAT_PANEL_ID]: 40, [TOPOLOGY_PANEL_ID]: 60 });
    expect(targetLayout('split', 0.55)).toEqual({ [CHAT_PANEL_ID]: 55, [TOPOLOGY_PANEL_ID]: 45 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: FAIL — module `./split-layout` not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/thread/split-layout.ts`:

```ts
import type { Layout } from 'react-resizable-panels';

/** Which of the three discrete layouts the split is currently in. */
export type SplitMode = 'chat-only' | 'panel-only' | 'split';

/** The atom/derived inputs the mode is computed from. */
export interface SplitInputs {
  /** Right panel (topology or artifact) is open. */
  open: boolean;
  /** Topology is fullscreen (chat hidden). */
  fullscreen: boolean;
  /** Viewport is below the desktop breakpoint (never shows the split). */
  isMobile: boolean;
}

// Must match the `id` props given to the two Panels in thread.tsx.
export const CHAT_PANEL_ID = 'chat';
export const TOPOLOGY_PANEL_ID = 'topology';

export function deriveMode({ open, fullscreen, isMobile }: SplitInputs): SplitMode {
  if (!open) return 'chat-only';
  if (fullscreen || isMobile) return 'panel-only';
  return 'split';
}

/** Percentage layout map for a mode; `fraction` is the chat column's share (0..1). */
export function targetLayout(mode: SplitMode, fraction: number): Layout {
  switch (mode) {
    case 'chat-only':
      return { [CHAT_PANEL_ID]: 100, [TOPOLOGY_PANEL_ID]: 0 };
    case 'panel-only':
      return { [CHAT_PANEL_ID]: 0, [TOPOLOGY_PANEL_ID]: 100 };
    case 'split':
      return { [CHAT_PANEL_ID]: fraction * 100, [TOPOLOGY_PANEL_ID]: (1 - fraction) * 100 };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/thread/split-layout.ts src/components/thread/split-layout.test.ts
git commit -m "feat(terminus): split-view mode + target-layout helpers"
```

---

### Task 3: Imperative `applyMode`

**Files:**
- Modify: `src/components/thread/split-layout.ts`
- Test: `src/components/thread/split-layout.test.ts` (append)

**Interfaces:**
- Consumes: `SplitMode`, `targetLayout` (Task 2); types `GroupImperativeHandle`, `PanelImperativeHandle` from `react-resizable-panels`.
- Produces:
  - `interface SplitRefs { group: GroupImperativeHandle | null; chat: PanelImperativeHandle | null; right: PanelImperativeHandle | null }`
  - `applyMode(mode: SplitMode, fraction: number, refs: SplitRefs): void`

- [ ] **Step 1: Write the failing test**

Append to `src/components/thread/split-layout.test.ts`:

```ts
import { applyMode, type SplitRefs } from './split-layout';

function makeRefs(opts: { chatCollapsed?: boolean; rightCollapsed?: boolean } = {}) {
  const chat = { collapse: vi.fn(), expand: vi.fn(), isCollapsed: vi.fn(() => opts.chatCollapsed ?? false) };
  const right = { collapse: vi.fn(), expand: vi.fn(), isCollapsed: vi.fn(() => opts.rightCollapsed ?? false) };
  const group = { setLayout: vi.fn(), getLayout: vi.fn(() => ({})) };
  // The unused imperative methods (resize/getSize) are not needed for these assertions.
  return { refs: { group, chat, right } as unknown as SplitRefs, group, chat, right };
}

describe('applyMode', () => {
  it('no-ops when any ref is missing', () => {
    expect(() => applyMode('split', 0.4, { group: null, chat: null, right: null })).not.toThrow();
  });

  it('chat-only collapses the right panel', () => {
    const { refs, right } = makeRefs();
    applyMode('chat-only', 0.4, refs);
    expect(right.collapse).toHaveBeenCalledTimes(1);
  });

  it('panel-only expands a collapsed right panel then collapses the chat', () => {
    const { refs, chat, right } = makeRefs({ rightCollapsed: true });
    applyMode('panel-only', 0.4, refs);
    expect(right.expand).toHaveBeenCalledTimes(1);
    expect(chat.collapse).toHaveBeenCalledTimes(1);
  });

  it('split expands both collapsed panels then sets the layout', () => {
    const { refs, chat, right, group } = makeRefs({ chatCollapsed: true, rightCollapsed: true });
    applyMode('split', 0.55, refs);
    expect(chat.expand).toHaveBeenCalledTimes(1);
    expect(right.expand).toHaveBeenCalledTimes(1);
    expect(group.setLayout).toHaveBeenCalledWith({ chat: 55, topology: 45 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: FAIL — `applyMode` / `SplitRefs` not exported.

- [ ] **Step 3: Write minimal implementation**

Append to `src/components/thread/split-layout.ts` (and add the type import at the top):

```ts
// top of file — extend the existing import:
import type { GroupImperativeHandle, Layout, PanelImperativeHandle } from 'react-resizable-panels';
```

```ts
/** The three imperative handles the effect drives. Null until the panels mount. */
export interface SplitRefs {
  group: GroupImperativeHandle | null;
  chat: PanelImperativeHandle | null;
  right: PanelImperativeHandle | null;
}

/**
 * Drive the panels to match `mode`. Uses the library's blessed collapse/expand
 * to reach the 0%/100% edges (bypasses minSize) and setLayout only for the
 * in-range split ratio. Idempotent — collapse/expand no-op when already there.
 */
export function applyMode(mode: SplitMode, fraction: number, refs: SplitRefs): void {
  const { group, chat, right } = refs;
  if (!group || !chat || !right) return;
  switch (mode) {
    case 'chat-only':
      right.collapse();
      break;
    case 'panel-only':
      if (right.isCollapsed()) right.expand();
      chat.collapse();
      break;
    case 'split':
      if (chat.isCollapsed()) chat.expand();
      if (right.isCollapsed()) right.expand();
      group.setLayout(targetLayout('split', fraction));
      break;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/thread/split-layout.test.ts`
Expected: PASS (all Task 2 + Task 3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/thread/split-layout.ts src/components/thread/split-layout.test.ts
git commit -m "feat(terminus): imperative applyMode for split panels"
```

---

### Task 4: `useResizableSplit` hook

**Files:**
- Create: `src/components/thread/use-resizable-split.ts`
- Test: `src/components/thread/use-resizable-split.test.tsx`

**Interfaces:**
- Consumes: `splitFractionAtom`, `clampSplitFraction` (Task 1); `deriveMode`, `targetLayout`, `applyMode`, `CHAT_PANEL_ID`, `TOPOLOGY_PANEL_ID`, `SplitInputs` (Tasks 2–3); `useGroupRef`, `usePanelRef`, type `Layout` from `react-resizable-panels`.
- Produces: `useResizableSplit(inputs: SplitInputs)` returning
  `{ groupRef, chatRef, rightRef, isSplit: boolean, onLayoutChanged: (layout: Layout) => void, defaultLayout: Layout }`.

- [ ] **Step 1: Write the failing test**

Create `src/components/thread/use-resizable-split.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { splitFractionAtom } from '@/lib/settings';

import { useResizableSplit } from './use-resizable-split';

function wrapperWith(store: ReturnType<typeof createStore>) {
  return ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
}

describe('useResizableSplit', () => {
  it('reports chat-only (not split) when nothing is open', () => {
    const store = createStore();
    const { result } = renderHook(() => useResizableSplit({ open: false, fullscreen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    expect(result.current.isSplit).toBe(false);
    expect(result.current.defaultLayout).toEqual({ chat: 100, topology: 0 });
  });

  it('seeds the default split layout from the stored fraction', () => {
    const store = createStore();
    store.set(splitFractionAtom, 0.5);
    const { result } = renderHook(() => useResizableSplit({ open: true, fullscreen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    expect(result.current.isSplit).toBe(true);
    expect(result.current.defaultLayout).toEqual({ chat: 50, topology: 50 });
  });

  it('persists a genuine split drag (both panels > 0)', () => {
    const store = createStore();
    const { result } = renderHook(() => useResizableSplit({ open: true, fullscreen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    act(() => result.current.onLayoutChanged({ chat: 60, topology: 40 }));
    expect(store.get(splitFractionAtom)).toBe(0.6);
  });

  it('ignores layout changes where a panel is collapsed (close/fullscreen)', () => {
    const store = createStore();
    store.set(splitFractionAtom, 0.4);
    const { result } = renderHook(() => useResizableSplit({ open: true, fullscreen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    act(() => result.current.onLayoutChanged({ chat: 100, topology: 0 }));
    expect(store.get(splitFractionAtom)).toBe(0.4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/thread/use-resizable-split.test.tsx`
Expected: FAIL — module `./use-resizable-split` not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/thread/use-resizable-split.ts`:

```ts
import { useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { type Layout, useGroupRef, usePanelRef } from 'react-resizable-panels';

import { clampSplitFraction, splitFractionAtom } from '@/lib/settings';

import { applyMode, CHAT_PANEL_ID, deriveMode, type SplitInputs, targetLayout, TOPOLOGY_PANEL_ID } from './split-layout';

/**
 * Wires a persistent react-resizable-panels Group to the existing
 * open/close/fullscreen atoms: an effect resizes the panels to match the derived
 * mode, and the chosen split ratio is persisted on pointer release. The panels
 * never unmount, so the topology canvas keeps its WebGL context across states.
 */
export function useResizableSplit(inputs: SplitInputs) {
  const groupRef = useGroupRef();
  const chatRef = usePanelRef();
  const rightRef = usePanelRef();

  const storedFraction = clampSplitFraction(useAtomValue(splitFractionAtom));
  const setFraction = useSetAtom(splitFractionAtom);

  const mode = deriveMode(inputs);
  const isSplit = mode === 'split';

  // Seed the initial Group layout once, from the mount-time mode + stored
  // fraction, so the first paint matches and there is no flash.
  const defaultLayoutRef = useRef<Layout>();
  if (!defaultLayoutRef.current) {
    defaultLayoutRef.current = targetLayout(mode, storedFraction);
  }

  useEffect(() => {
    applyMode(mode, storedFraction, {
      group: groupRef.current,
      chat: chatRef.current,
      right: rightRef.current,
    });
  }, [mode, storedFraction, groupRef, chatRef, rightRef]);

  const onLayoutChanged = (layout: Layout) => {
    const chat = layout[CHAT_PANEL_ID];
    const topology = layout[TOPOLOGY_PANEL_ID];
    // Only a genuine split drag (neither side collapsed) updates the saved ratio;
    // close/fullscreen transitions put a panel at 0 and must not overwrite it.
    if (chat > 0 && topology > 0) {
      setFraction(clampSplitFraction(chat / 100));
    }
  };

  return { groupRef, chatRef, rightRef, isSplit, onLayoutChanged, defaultLayout: defaultLayoutRef.current };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/thread/use-resizable-split.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/thread/use-resizable-split.ts src/components/thread/use-resizable-split.test.tsx
git commit -m "feat(terminus): useResizableSplit hook"
```

---

### Task 5: Styled resizable UI primitives

**Files:**
- Create: `src/components/ui/resizable.tsx`
- Test: `src/components/ui/resizable.test.tsx`

**Interfaces:**
- Consumes: `Group`, `Panel`, `Separator` from `react-resizable-panels`; `cn` from `@/lib/utils`.
- Produces: `ResizableGroup` (= `Group`), `ResizablePanel` (= `Panel`), `ResizableSeparator` (styled `Separator`).

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/resizable.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResizableGroup, ResizablePanel, ResizableSeparator } from './resizable';

describe('resizable primitives', () => {
  it('render a group with two panels and an accessible separator', () => {
    render(
      <ResizableGroup orientation="horizontal">
        <ResizablePanel id="a">Alpha</ResizablePanel>
        <ResizableSeparator />
        <ResizablePanel id="b">Beta</ResizablePanel>
      </ResizableGroup>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/resizable.test.tsx`
Expected: FAIL — module `./resizable` not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/ui/resizable.tsx`:

```tsx
import type { ComponentProps } from 'react';

import { Group, Panel, Separator } from 'react-resizable-panels';

import { cn } from '@/lib/utils';

/** Pass-through aliases — styling for these lives on the elements in thread.tsx. */
export const ResizableGroup = Group;
export const ResizablePanel = Panel;

/**
 * A thin vertical divider. The library enlarges the hit target beyond the 1px
 * line, so the visual stays slim; it brightens on hover and while dragging.
 */
export function ResizableSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        'bg-border relative w-px shrink-0 transition-colors',
        'hover:bg-primary/50 data-[separator]:data-[resizing]:bg-primary/60',
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/resizable.test.tsx`
Expected: PASS. (Also confirms the v4 import surface resolves under happy-dom.)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/resizable.tsx src/components/ui/resizable.test.tsx
git commit -m "feat(terminus): styled resizable group/panel/separator"
```

---

### Task 6: Integrate the Group into `thread.tsx`

**Files:**
- Modify: `src/components/thread/thread.tsx`

**Interfaces:**
- Consumes: `useResizableSplit` (Task 4); `ResizableGroup`, `ResizablePanel`, `ResizableSeparator` (Task 5). Existing locals already present in the component: `rightPanelOpen`, `graphFullscreen`, `isMobile`, `cn`.
- Produces: no exports; replaces the CSS-grid split markup.

This task is a structural refactor of JSX whose logic is already unit-tested in Tasks 1–5; verification is typecheck + build + the full test run + manual check (no full-`thread.tsx` render test — that component is not currently unit-tested and pulls the whole stream/jotai stack).

- [ ] **Step 1: Add imports**

At the top of `src/components/thread/thread.tsx`, with the other relative `./` imports, add:

```tsx
import { useResizableSplit } from './use-resizable-split';
```

With the other `@/components/ui/...` imports, add:

```tsx
import { ResizableGroup, ResizablePanel, ResizableSeparator } from '@/components/ui/resizable';
```

- [ ] **Step 2: Call the hook**

Immediately after the line `const rightPanelOpen = artifactOpen || graphPanelOpen;` (currently ~line 100), add:

```tsx
const { groupRef, chatRef, rightRef, isSplit, onLayoutChanged, defaultLayout } = useResizableSplit({
  open: rightPanelOpen,
  fullscreen: graphFullscreen,
  isMobile,
});
```

- [ ] **Step 3: Replace the grid container opening**

Replace the grid `<div>` opening (currently lines ~288–298, from `<div` with `className={cn('grid w-full grid-cols-[1fr_0fr]', …)}>` through its closing `>`), with:

```tsx
      <ResizableGroup
        orientation="horizontal"
        groupRef={groupRef}
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
        className="h-full w-full"
      >
```

- [ ] **Step 4: Convert the chat column to a Panel**

Replace the chat column opening div (currently line ~299):

```tsx
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
```

with:

```tsx
        <ResizablePanel
          id="chat"
          panelRef={chatRef}
          collapsible
          collapsedSize="0%"
          minSize="25%"
          className="relative flex h-full min-w-0 flex-col overflow-hidden"
        >
```

Find this column's matching closing `</div>` (currently line ~472 — the one immediately before `<div className="relative flex flex-col border-l">`) and change it to:

```tsx
        </ResizablePanel>
```

- [ ] **Step 5: Insert the separator and convert the right column to a Panel**

The right column currently opens (line ~473) with:

```tsx
        <div className="relative flex flex-col border-l">
          <div className="absolute inset-0 flex min-w-[30vw] flex-col">
```

Replace those two lines with (note the separator inserted before the panel, and the `border-l` / `min-w-[30vw]` removed — the border moves to the separator and the min width is enforced by `minSize`):

```tsx
        <ResizableSeparator
          disabled={!isSplit}
          className={cn('border-l', !isSplit && 'pointer-events-none opacity-0')}
        />
        <ResizablePanel
          id="topology"
          panelRef={rightRef}
          collapsible
          collapsedSize="0%"
          minSize="25%"
          className="relative flex h-full flex-col"
        >
          <div className="absolute inset-0 flex flex-col">
```

- [ ] **Step 6: Close the right Panel and the Group**

At the end of the right column (currently lines ~489–491):

```tsx
          </div>
        </div>
      </div>
```

the first `</div>` closes the `absolute inset-0` inner div (keep it), the second `</div>` closed the right column wrapper → change to `</ResizablePanel>`, and the third `</div>` closed the grid → change to `</ResizableGroup>`:

```tsx
          </div>
        </ResizablePanel>
      </ResizableGroup>
```

- [ ] **Step 7: Typecheck**

Run: `npx tsc -b`
Expected: no errors. (If `defaultLayout` type complains, confirm `defaultLayoutRef` is typed `Layout` in Task 4.)

- [ ] **Step 8: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all new tests plus the pre-existing suite (e.g. `disclaimer.test.tsx`, `use-view-tools.test.ts`).

- [ ] **Step 9: Build**

Run: `pnpm build`
Expected: `tsc -b && vite build` completes with no errors and emits `dist/`.

- [ ] **Step 10: Manual verification (dev server)**

Run: `pnpm dev`, open the app, and confirm:
1. Open topology on desktop → split view shows a draggable divider; drag adjusts the ratio.
2. Neither side can be dragged below ~25%.
3. Reload the page → the last split ratio is restored.
4. Click fullscreen, then exit → chat returns at the saved ratio; the topology camera/zoom is unchanged (no reset/flicker).
5. Close the panel and reopen → no divider while closed; reopens to the saved ratio.
6. Narrow the window below the desktop breakpoint → panel goes full-width, no divider.

- [ ] **Step 11: Commit**

```bash
git add src/components/thread/thread.tsx
git commit -m "feat(terminus): resizable chat/topology split view"
```

---

## Self-Review

**Spec coverage:**
- Drag-to-resize in split view → Tasks 5–6 (Separator + Group). ✓
- Persist across reloads → Task 1 (`splitFractionAtom`) + Task 4 (`onLayoutChanged`). ✓
- Stop at min width (no drag-to-collapse); close/fullscreen on buttons → `minSize="25%"` + Separator `disabled`/hidden when `!isSplit` (Tasks 5–6); atom handlers untouched. ✓
- No remount / no WebGL reset → persistent Group, collapse/expand transitions (Tasks 3–4, 6). ✓
- State→layout mapping table → `deriveMode`/`targetLayout`/`applyMode` (Tasks 2–3). ✓
- Default `F=0.4`, single ratio replaces breakpoint defaults → Task 1 constant; old grid templates removed in Task 6. ✓
- Edge cases (localStorage throws/garbage, null refs, rapid flips, breakpoint crossing) → `clampSplitFraction` + `atomWithStorage`, null guard in `applyMode`, idempotent collapse/expand, `isMobile` in `deriveMode`. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code; relocation steps use exact line anchors and verbatim before/after snippets.

**Type consistency:** `SplitMode`, `SplitInputs`, `SplitRefs`, `Layout`, `CHAT_PANEL_ID`/`TOPOLOGY_PANEL_ID`, and the hook return shape are used identically across Tasks 2→3→4→6. Panel `id` props (`"chat"`, `"topology"`) match the constants the layout map keys use.

**Note vs spec:** Persistence uses a jotai `atomWithStorage` (key `terminus-split-fraction`) rather than hand-rolled `readFraction`/`writeFraction`, to follow the established `settings.ts` pattern. Same behavior (persist across reloads), repo-idiomatic.
