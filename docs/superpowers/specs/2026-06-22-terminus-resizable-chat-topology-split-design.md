# Terminus: resizable chat / topology split

**Date:** 2026-06-22
**Add-on:** `local_terminus` (`addons/terminus/frontend`)
**Status:** design approved, spec under review

## Goal

Let the user drag the divider between the chat panel and the topology/artifact
panel to adjust their relative widths when both are open (the desktop "split"
view). The chosen ratio persists across page reloads. Dragging stops at a
minimum width per side; closing the panel and going fullscreen stay on their
existing toolbar buttons (resize does not take those over).

## Constraints discovered during exploration

- **No remount of the right panel.** `GraphPanel` itself holds its state in jotai
  atoms + the URL, but its lazy children (`Topology3D` via reagraph/three.js,
  `Topology2D` via react-flow) own a live WebGL context / react-flow viewport.
  Any approach that swaps the DOM structure on a state transition would reset the
  camera and re-init WebGL. The layout therefore must keep both columns mounted
  across every open/close/fullscreen transition.
- **`react-resizable-panels@4.11.2` is already installed** but unused. v4 is a
  ground-up API rewrite — primitives are `Group`, `Panel`, `Separator` (NOT the
  old `PanelGroup`/`PanelResizeHandle`), layouts are a `{panelId: percent}` map,
  and the stock shadcn `resizable.tsx` wrapper (old API) does not apply.
- The current split is a CSS grid in `thread.tsx` (~lines 288–297) with three
  discrete states encoded as `grid-template-columns`:
  - not open → `grid-cols-[1fr_0fr]` (chat full)
  - open + split → `md:grid-cols-[2fr_2fr] xl:grid-cols-[2fr_3fr]`, mobile `0fr_1fr`
  - open + fullscreen → `0fr_1fr` everywhere (chat hidden)
- The open/close/fullscreen behaviour is driven by jotai atoms
  (`graphPanelOpenAtom`, `graphFullscreenAtom`, artifact open) and `TopologyUrlSync`.
  These handlers must remain untouched; the new layout only *reacts* to them.

## Approach (chosen: A — use the installed library)

One **persistent** `Group` always wraps both columns, so neither column unmounts.
The three discrete states become **panel layouts** the library applies
imperatively; the continuously-variable split ratio is the only state the user
drags. We add an effect that reacts to the existing atoms and resizes — we do not
modify `openTopology`, the fullscreen/close buttons, or `TopologyUrlSync`.

### State → layout mapping

Derive `mode` from existing inputs (`open = artifactOpen || graphPanelOpen`,
`fullscreen = graphFullscreen`, `isMobile`):

| Condition | `mode` | Layout `{chat, topology}` | Separator |
|---|---|---|---|
| `!open` | `chat-only` | `{chat: 100, topology: 0}` | hidden/disabled |
| `open && (fullscreen || isMobile)` | `panel-only` | `{chat: 0, topology: 100}` | hidden/disabled |
| `open && !fullscreen && !isMobile` | `split` | `{chat: F·100, topology: (1−F)·100}` | **visible** |

- Both panels: `collapsible collapsedSize="0%" minSize="25%"`.
- `F` = persisted chat fraction, default `0.4` (≈ today's xl `2fr/3fr`), clamped to
  `[0.25, 0.75]`.

### Transitions (imperative, library-blessed)

The effect runs on `mode`/`F` change:

- `chat-only`: `rightRef.collapse()`.
- `panel-only`: ensure `rightRef.expand()` then `chatRef.collapse()`.
- `split`: ensure both expanded, then
  `groupRef.setLayout({ chat: F*100, topology: (1-F)*100 })`.

`collapse()`/`expand()` are idempotent (no-op when already in that state), so
rapid flips (e.g. open → immediately fullscreen) are safe. Refs may be null on the
first effect tick → guard and no-op.

### Persistence (across reloads)

- `Group` `onLayoutChanged` fires only on pointer **release** (not during drag).
  In the handler, if both panels are `> 0` (a genuine split adjustment), write
  `F = layout.chat / 100` to the persisted `splitFractionAtom`
  (jotai `atomWithStorage`, key `terminus-split-fraction`, following the existing
  `settings.ts` pattern — `viewToolsAtom`/`fontSizeAtom`). Collapsed-state layout
  changes (a panel at 0) are ignored so close/fullscreen never overwrite the ratio.
- Seed `Group`'s `defaultLayout` from the stored `F` and the initial `mode` so
  there is no first-paint flash. (Vite SPA, no SSR — layout-shift caveat N/A.)

## Components & files

1. **`src/components/ui/resizable.tsx`** *(new)* — thin Tailwind-styled wrappers
   over v4 primitives: `ResizableGroup` (= `Group`), `ResizablePanel` (= `Panel`),
   `ResizableSeparator` (= `Separator`, with a centered grip and `data-separator`
   hover/active styling). Styling/markup only; no logic.
2. **`src/components/thread/split-layout.ts`** *(new + `.test.ts`)* — pure helpers:
   - `deriveMode({ open, fullscreen, isMobile }): Mode`
   - `targetLayout(mode, fraction): { chat: number; topology: number }`
   - `clampFraction(n): number` (→ `[0.25, 0.75]`, NaN/undefined → default `0.4`)
   - `readFraction(): number` / `writeFraction(n): void` (localStorage, try/catch,
     bad-data fallback)
3. **`src/components/thread/use-resizable-split.ts`** *(new + `.test.ts`)* — owns
   `groupRef`/`chatRef`/`rightRef`, the mode→imperative-calls effect (via an
   `applyMode(mode, fraction, refs)` helper), the `onLayoutChanged` persistence
   handler, and exposes `{ groupRef, chatRef, rightRef, onLayoutChanged, isSplit,
   defaultLayout }`.
4. **`thread.tsx`** — replace the grid container (`288–297`) and the two column
   wrapper divs with:
   ```
   <ResizableGroup orientation="horizontal" groupRef={groupRef}
                   defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}
                   className="w-full">
     <ResizablePanel id="chat" panelRef={chatRef} collapsible collapsedSize="0%"
                     minSize="25%" className="relative flex h-full min-w-0 flex-col overflow-hidden">
       {…existing chat column subtree, unchanged…}
     </ResizablePanel>
     <ResizableSeparator disabled={!isSplit}
                         className={cn('border-l', !isSplit && 'pointer-events-none opacity-0')} />
     <ResizablePanel id="topology" panelRef={rightRef} collapsible collapsedSize="0%"
                     minSize="25%" className="relative flex h-full flex-col">
       {…existing right column subtree (GraphPanel | artifact), unchanged…}
     </ResizablePanel>
   </ResizableGroup>
   ```
   Removed: the `graphFullscreen` grid override, the `1fr_0fr`/`2fr_3fr` templates,
   and the now-redundant `min-w-[30vw]`. The `border-l` divider moves to the
   separator. The chat/right *inner* subtrees move verbatim (no remount).

## Testing (TDD)

Pure unit tests (the bulk of the logic):

- `deriveMode` — full truth table over `{open, fullscreen, isMobile}`.
- `targetLayout` — each mode; split respects `F`.
- `clampFraction` — in-range pass-through, out-of-range clamp, NaN/garbage → `0.4`.
- `readFraction`/`writeFraction` — round-trip; localStorage throws → default, no
  crash; stored garbage → default.
- `applyMode(mode, F, refs)` — asserts the correct imperative calls (and ordering:
  expand before `setLayout` for split) using mocked refs.

Hook test (`@testing-library/react`):

- `use-resizable-split` calls `applyMode` on input change (rerender with changing
  `open`/`fullscreen`/`isMobile`); `onLayoutChanged` persists only when both panels
  `> 0`.

Wiring in `thread.tsx` stays thin; no heavy integration test required. Existing
`disclaimer.test.tsx` etc. unaffected.

## Edge cases & error handling

- localStorage unavailable / throws → `readFraction`/`writeFraction` swallow and
  fall back to default `0.4`; never crash render.
- Stored value out of range / non-numeric → `clampFraction` repairs.
- Null refs on first effect tick → guarded no-op; effect re-runs once refs attach.
- Crossing the mobile breakpoint while the panel is open → `isMobile` flips
  `split`↔`panel-only`; effect adjusts.
- `minSize="25%"` per panel: neither side can be dragged below a quarter; collapse
  uses `collapsedSize` (0%) and bypasses `minSize`, so closed/fullscreen still reach 0.

## Out of scope / non-goals

- No change to how the panel opens/closes or goes fullscreen (buttons + atoms +
  URL sync stay as-is).
- No drag-to-collapse (explicitly declined; resize stops at min width).
- No breakpoint-aware default ratio — a single persisted `F` replaces the prior
  `50/50` (md) vs `40/60` (xl) split. (Flagged and accepted during brainstorming.)
- Removing the `react-resizable-panels` dependency — N/A, we now use it.
