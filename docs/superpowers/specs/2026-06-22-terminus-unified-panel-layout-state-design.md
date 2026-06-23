# Terminus: unified panel-layout state (single source of truth)

**Date:** 2026-06-22
**Add-on:** `local_terminus` (`addons/terminus/frontend`)
**Status:** design approved, spec under review
**Builds on:** `2026-06-22-terminus-resizable-chat-topology-split-design.md`

## Goal

Make the chat ↔ topology layout one authoritative state. Whether the user
toggles via a button or by dragging the divider, the change writes the same
source; the URL (navigation / back-forward / shared links) reflects it. Today
the open/fullscreen state is split across two independent booleans plus a URL
mirror, and the resize layer is a read-only consumer that cannot toggle.

## Current state (what we're replacing)

| Concern | Source today | Persisted | In URL? |
|---|---|---|---|
| Topology open/closed | `graphPanelOpenAtom` | localStorage `terminus-graph-panel-open` | ✅ `?topology=` (boolean, two-way mirror) |
| Topology fullscreen (chat hidden) | `graphFullscreenAtom` | localStorage `terminus-graph-fullscreen` | ❌ |
| Artifact open | `artifactOpen` (artifact subsystem) | — | ❌ |
| Split ratio | `splitFractionAtom` | localStorage `terminus-split-fraction` | ❌ |

`useResizableSplit` (from the resizable-split feature) only *derives*
`deriveMode()` from these and drives the panels; it does not write open-state.
Two booleans can encode the nonsense state `open=false & fullscreen=true`.

## Decisions (from brainstorming)

1. **Drag-to-collapse toggles** the layout and writes the same shared state as
   the buttons (reverses the earlier "stop at min width" rule for the
   topology case).
2. **Full layout-mode in the URL** — `chat-full` / `split` / `topology-full`
   are all deep-linkable.
3. **Artifact stays separate** — the canonical state owns only the
   chat ↔ topology relationship; artifact remains its own open/close flag and
   an orthogonal occupant of the right panel.
4. Approach **A**, clean cut (no backwards-compat): a single discriminated atom
   (`panelLayoutAtom`) is the only panel-state atom; the old boolean atoms are
   **removed** and every consumer migrates to it. Writes go through named action
   atoms; reads compare the layout directly.

## Canonical model

```ts
// src/lib/ha-graph/atoms.ts
export type PanelLayout = 'chat-full' | 'split' | 'topology-full';

/** Single source of truth for the chat<->topology layout relationship. */
export const panelLayoutAtom = atomWithStorage<PanelLayout>(
  'terminus-panel-layout',
  'chat-full',
  undefined,
  { getOnInit: true },
);
```

**No backwards-compatibility shims.** `graphPanelOpenAtom` and
`graphFullscreenAtom` are **removed entirely**; their two localStorage keys
(`terminus-graph-panel-open`, `terminus-graph-fullscreen`) retire. Every consumer
migrates to read `panelLayoutAtom` directly (inline comparisons like
`layout !== 'chat-full'` / `layout === 'topology-full'`) and to write via the
named action atoms below. Persistence consolidates to one key
(`terminus-panel-layout`); the illegal combo `open=false & fullscreen=true`
becomes unrepresentable.

### Named write-only action atoms (the single write API)

```ts
// All transitions live here, so call sites read as intent, not state math.
export const openTopologyAtom    = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'chat-full') set(panelLayoutAtom, 'split');     // else already visible
});
export const closeTopologyAtom   = atom(null, (_get, set) => set(panelLayoutAtom, 'chat-full'));
export const enterFullscreenAtom = atom(null, (_get, set) => set(panelLayoutAtom, 'topology-full'));
export const exitFullscreenAtom  = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'topology-full') set(panelLayoutAtom, 'split'); // else no-op
});
```

The URL restore is the one *absolute* write (it sets the whole layout from the
link), so `TopologyUrlSync` sets `panelLayoutAtom` directly via
`panelsToLayout(...)` rather than through an action.

### `deriveMode` cleanup

`deriveMode` (resizable-split) stops reconstructing booleans and takes the
canonical state directly: `deriveMode({ layout, artifactOpen, isMobile })`.

```
rightOccupied = layout !== 'chat-full' || artifactOpen   // topology OR artifact
if (!rightOccupied)                       return 'chat-only';
if (layout === 'topology-full' || isMobile) return 'panel-only';
return 'split';
```

> Vocabulary note: **`PanelLayout`** (`chat-full | split | topology-full`) is the
> *canonical state*; **`SplitMode`** (`chat-only | split | panel-only`, from the
> resizable-split feature) is the *derived visual arrangement* of the Group. They
> differ when an artifact occupies the right panel (`layout=chat-full` but
> `mode=split`) or on mobile (`layout=split` but `mode=panel-only`). Kept as two
> distinct vocabularies on purpose.

## Three writers (all funnel to `panelLayoutAtom` via the actions)

1. **Buttons** — every existing call site swaps its old boolean setter for an
   action: open topology → `openTopologyAtom`; "close chat" → `enterFullscreenAtom`;
   "open chat" (exit fullscreen) → `exitFullscreenAtom` on desktop /
   `closeTopologyAtom` on mobile; topology close (X) → `closeTopologyAtom`. Touches
   `thread.tsx`, `graph-panel.tsx`, `app-sidebar.tsx`.
2. **Drag-to-collapse** — panels are `collapsible` **only when topology occupies
   the right panel** (`layout !== 'chat-full'`, not an artifact).
   `useResizableSplit.onLayoutChanged` reuses the same actions:
   - right (topology) side collapsed (`topology === 0`, `chat > 0`) → `closeTopologyAtom`
   - chat side collapsed (`chat === 0`, `topology > 0`) → `enterFullscreenAtom`
   - both `> 0` → `openTopologyAtom` (ensure `split`) + persist the ratio
   Each write is equality-gated (the actions already no-op when the target equals
   the current value).
3. **URL** — `TopologyUrlSync` hydrates `panelLayoutAtom` on mount / back-forward
   (absolute set via `panelsToLayout`) and mirrors atom → URL on change (see URL
   section).

### Loop-gating (resize layer reads *and* writes)

`useResizableSplit` drives the Group imperatively via `applyMode` (an effect
reacting to the derived mode) **and** now writes the atom on user drag. To stop
the drive → collapse → write → drive loop:

- Add an `isApplyingRef`. In the mode effect, set `isApplyingRef.current = true`
  immediately before calling `applyMode`, and clear it on the next frame
  (`requestAnimationFrame`, falling back to a microtask in tests).
- In `onLayoutChanged`, if `isApplyingRef.current` is set, treat the event as a
  programmatic echo and **return without writing** (ratio or layout).
- Genuine pointer drags fire outside the applying window → processed normally.

This mirrors the existing `TopologyUrlSync` gating philosophy (a `mounted` ref +
equality checks to prevent its own two-way loop).

## URL encoding (full layout)

Replace the old boolean `topology` query param with a generic **`layout`** param
that lists the **visible panel names**, comma-separated. The URL is a *projection*
of the canonical `PanelLayout`; the panel-name vocabulary is deliberately
extensible so a future panel just appears in the list (`layout=chat,topology,…`)
with no new param shape:

| `panelLayout` | URL |
|---|---|
| `chat-full` | `?layout=chat` |
| `topology-full` | `?layout=topology` |
| `split` | `?layout=chat,topology` |

- The default (`chat-full`) is written **explicitly** as `?layout=chat` — we
  always list what's visible (the param is not omitted for the default).
- `nuqs` fits directly: `parseAsArrayOf(parseAsStringLiteral(['chat', 'topology']))`
  parses/serializes the comma list. Define `type PanelName = 'chat' | 'topology'`
  and a fixed `PANEL_ORDER = ['chat', 'topology']`.
- Two pure helpers:
  - `layoutToPanels(layout: PanelLayout): PanelName[]` — `chat-full→['chat']`,
    `topology-full→['topology']`, `split→['chat','topology']` (already in
    canonical `PANEL_ORDER`, so serialization is stable).
  - `panelsToLayout(names: readonly string[] | null): PanelLayout` — build a set
    of *known* names (ignore unknowns/dupes, order-independent): `{chat,topology}`
    → `split`; `{topology}` → `topology-full`; `{chat}` → `chat-full`;
    empty/garbage → `chat-full` (default).
- The pre-existing `topology` param is **dropped, not aliased.** A previously
  shared/mirrored `?topology=true` link opens into `chat-full` after upgrade
  (one-time, consistent with retiring the old localStorage keys — see non-goals).
- The sync component keeps its current structure (URL→atom on mount/back-forward;
  atom→URL on change; first-commit skip; equality gating). Two differences from
  today: the param is the panel-name list (via the helpers), and the atom→URL
  write **always** sets the param (never clears it to null, since the default is
  now explicit). The topology *view* params (`group`/`area`/`scene`/`automation`)
  are unchanged.
- `ParentUrlSync` is unaffected — it mirrors the live location to the parent
  hash regardless of param shape.

## Components & files

1. **`src/lib/ha-graph/atoms.ts`** *(modify, + test)* — add `PanelLayout`,
   `panelLayoutAtom`, `PanelName` + `PANEL_ORDER`, the four action atoms
   (`openTopologyAtom`, `closeTopologyAtom`, `enterFullscreenAtom`,
   `exitFullscreenAtom`), and the pure `layoutToPanels` / `panelsToLayout`
   helpers. **Remove** `graphPanelOpenAtom` and `graphFullscreenAtom`. Update
   `atoms.test.ts` (drop the two retired storage-key cases; add action-atom +
   helper cases).
2. **`src/components/graph/topology-url-sync.tsx`** *(modify)* — read/write
   `panelLayoutAtom` instead of `graphPanelOpenAtom`; swap the boolean `topology`
   param for the panel-name `layout` array param (via `parseAsArrayOf` + the
   helpers); reflect all three states; always write the param. (Filename
   unchanged — it still owns the topology *view* params.)
3. **`src/components/graph/graph-panel.tsx`** *(modify, + test)* — migrate
   `setOpen`/`fullscreen`/`setFullscreen` to read `panelLayoutAtom` and call the
   action atoms (`closeTopologyAtom`, `exitFullscreenAtom`/`closeTopologyAtom` for
   "open chat", etc.). Update `graph-panel.test.tsx` to seed `panelLayoutAtom` and
   assert against it.
4. **`src/components/sidebar/app-sidebar.tsx`** *(modify, + test)* — migrate its
   topology toggle (`graphPanelOpen` read + `setGraphPanelOpen`/`setGraphFullscreen`)
   to `panelLayoutAtom` + actions. Update `app-sidebar.test.tsx` accordingly.
5. **`src/components/thread/thread.tsx`** *(modify)* — read `panelLayoutAtom`
   (replacing the `graphPanelOpen`/`graphFullscreen` reads + setters); buttons call
   actions; pass `{ layout, artifactOpen, isMobile }` to the resize hook; drive
   each panel's `collapsible` from "topology occupies the right panel". No JSX
   structure change (the Group already exists).
6. **`src/components/thread/use-resizable-split.ts`** *(modify)* — accept
   `{ layout, artifactOpen, isMobile }`; add `isApplyingRef` gating; make
   `onLayoutChanged` content-aware (call the actions on collapse, persist ratio
   when split); expose the `collapsible` flag for the panels.
7. **`src/components/thread/split-layout.ts`** *(modify)* — `deriveMode` takes
   `{ layout, artifactOpen, isMobile }`; add a small pure helper
   `actionFromDragged({chat, topology})` returning which action a drag implies
   (`'close' | 'fullscreen' | 'split' | null`), so the write-back logic is
   unit-tested.

## Testing (TDD)

Pure unit tests carry the logic:

- **Action atoms** (jotai `createStore`): each action maps `panelLayoutAtom`
  correctly from every starting state — `openTopology` (`chat-full`→`split`,
  else unchanged), `closeTopology`→`chat-full`, `enterFullscreen`→`topology-full`,
  `exitFullscreen` (`topology-full`→`split`, else unchanged). The illegal combo is
  structurally impossible (no boolean to set).
- **`layoutToPanels` / `panelsToLayout`**: round-trip for all three states
  (`chat-full` ↔ `['chat']`, `topology-full` ↔ `['topology']`, `split` ↔
  `['chat','topology']`); parse is order-independent (`['topology','chat']` →
  `split`); unknown/dupes ignored; empty/`null` → `chat-full`.
- **`deriveMode`**: each `{layout, artifactOpen, isMobile}` combo → expected
  `SplitMode` (incl. artifact-occupied `chat-full`→`split` desktop, and mobile
  `split`→`panel-only`).
- **`actionFromDragged`**: right-collapsed → `'close'`; chat-collapsed →
  `'fullscreen'`; both > 0 → `'split'`; guards on exact 0.
- **`useResizableSplit`** (hook test): a user `onLayoutChanged` with a collapsed
  side invokes the expected action (asserted via `panelLayoutAtom`); an
  `onLayoutChanged` fired while `isApplyingRef` is set writes nothing; a both-`>0`
  change still persists the ratio.

## Edge cases & error handling

- **Loop prevention** — programmatic `applyMode` echoes are dropped via
  `isApplyingRef`; equality-gating prevents redundant atom writes.
- **Mobile** — canonical layout may be `split`, but `deriveMode` renders it as
  `panel-only` and the separator is disabled, so no drag-collapse on mobile; the
  canonical value is device-independent and re-expands to split on desktop.
- **Artifact-occupied right panel** — when `layout === 'chat-full'` but
  `artifactOpen` is true, panels are **not** collapsible (resize-only); the
  artifact closes via its existing X. Drag-collapse never mutates artifact state.
- **Deep-link / back-forward** — `?layout=topology` restores `topology-full`
  (chat hidden) directly; `?layout=chat,topology` restores split; `?layout=chat`
  (or no/garbage param) restores `chat-full`. The old `?topology=…` param is no
  longer read (see URL section).
- **First-paint on mobile deep-link** — unchanged from the resizable-split
  feature: `useIsMobile()` is false on first render, the effect corrects within
  a frame; panels stay mounted (no WebGL reset).

## Out of scope / non-goals

- Folding the artifact panel into the canonical state (explicitly kept separate).
- Migrating old localStorage keys to the new one (default is fine post-upgrade).
- Any change to topology *view* params (`group`/`area`/`scene`/`automation`) —
  those keep their current behavior; only the open/layout param is renamed
  (`topology` → `layout`) and reshaped (boolean → comma-separated visible-panel
  names, e.g. `chat,topology`).
- Drag-to-collapse when an artifact occupies the right panel (resize-only there).
