# URL as the single source of truth for navigation

**Date:** 2026-06-23
**Status:** Design — approved model, pending spec review
**Area:** `addons/terminus/frontend` — topology navigation state

## Problem

Navigation state in Terminus is stored in *three* places that must be kept in
agreement:

- **`window.location`** (the URL) — `?layout`, `?group`, `?area`, `?scene`,
  `?automation`, and the `/<threadId>` path.
- **Jotai atoms** — `panelLayoutAtom` and `graphViewBaseAtom`.
- **localStorage** — `panelLayoutAtom` and `graphViewBaseAtom` are each
  `atomWithStorage`, persisting independently under `terminus-panel-layout` and
  `terminus-graph-view`.

`TopologyUrlSync` reconciles the atoms against the URL bidirectionally. The
reconciliation needs a `mounted` ref and equality-gating on both directions
purely to stop the two stores from looping against each other. The localStorage
copies are a *second* persistence of the same facts the URL already persists,
and they can drift from it.

This is the same class of problem the codebase already resolved for data
fetching (react-query as the single source for topology) and for env-readiness
(the hand-rolled membrane gate). Navigation should get the same treatment.

## The model

**`window.location` is the single runtime source of truth for navigation.**
Every read of layout / graph-view / thread comes from the URL. There is no
second reactive store.

**localStorage is a write-through checkpoint, not a source.** It is *written* on
every navigation and *read exactly once*, at boot, as a fallback. It exists only
because Terminus runs inside a Home Assistant ingress `<iframe>`, where the
address bar is not ours.

**Boot precedence:** explicit URL location → localStorage checkpoint → defaults.

Two persistence transports cover two different lifetimes, both feeding the one
truth (the URL):

| Transport | Survives | Mechanism |
|---|---|---|
| Parent hash (`#app=…`) | **reload** (F5) — HA rebuilds the iframe at base | `parent-url.ts` `mirrorToParent` / `restoreFromParentHash` (existing) |
| localStorage checkpoint | **leave-and-return** — HA re-navigates to `/local_terminus`, dropping the hash | new write-through + boot fallback |

Outside the iframe the address bar is the persistence, so this checkpoint is
deliberately HA-iframe-specific.

## Architecture: the navigation-checkpoint boundary

A boundary with the same shape as `GraphReadyGate` (see the membrane carve-out
in `addons/terminus/CLAUDE.md`): it establishes a precondition at boot and is
never read again at runtime. Here the precondition is *the initial location*.

It persists **the whole relative location string** — `/<threadId>?layout=…&group=…`
— as one key. This is the exact unit the `#app=` parent hash already carries
(`relativeLocation()` in `parent-url.ts`). Because the checkpoint owns
whole-URL persistence, the per-atom `atomWithStorage` copies become redundant
and are deleted; with no second store to reconcile, `TopologyUrlSync` collapses.

### Boot half (read-once)

A side-effect module that runs **before anything reads `window.location`** —
immediately after `parent-url-restore` in `main.tsx`, ahead of `./router`. By
the time it runs, `restoreFromParentHash()` has already replayed any parent-hash
location into the iframe URL. The rule simplifies to:

> If the iframe location is still base/default (no thread path, no nav params),
> seed the URL from the localStorage checkpoint via `history.replaceState`.
> Otherwise the URL wins — do nothing.

This makes the precedence fall out automatically: a real URL (including one
restored from the parent hash) is never overwritten; the checkpoint only fills a
blank slate.

### Runtime half (write-only)

A boundary component (mounted once, renders `null`) that, on every location
change, write-through-persists the current relative location to localStorage —
and replaces the existing `ParentUrlSync` mirror, doing both writes (parent hash
+ localStorage) in one place.

It must subscribe to the **real, full location**, not a hand-maintained param
list. `ParentUrlSync` today subscribes to a stale `?topology` boolean and omits
`?layout` and `?group`, so a pure layout-toggle or group-change does not
re-trigger its mirror (latent bug). The replacement subscribes via TanStack
Router's location (`router.subscribe('onResolved', …)` or `useLocation`), so it
captures every navigation. Fixing this bug is in scope — it is the same code
being rewritten.

## Layout and graph view become URL-derived

To make the URL *genuinely* the single source, the two atoms stop being stores
and become thin reads/writes over the URL (nuqs).

### Layout (Stage A)

- `PanelLayout` becomes the URL literal itself: `'chat' | 'topology' | 'split'`
  (this absorbs the earlier request to make param == atom; there is no longer a
  separate atom value to mirror, so `layoutToParam` / `paramToLayout` disappear).
- `panelLayoutAtom` (and its `atomWithStorage`) is removed.
- A `usePanelLayout()` hook returns `[layout, setLayout]` backed by
  `useQueryState('layout', parseAsStringLiteral(['chat','topology','split']))`,
  defaulting a missing/garbage param to `'chat'`.
- The write-only action atoms (`openTopologyAtom`, `closeTopologyAtom`,
  `enterFullscreenAtom`, `exitFullscreenAtom`) cannot read URL state, so they
  become a `useLayoutActions()` hook (or methods on `usePanelLayout`) exposing
  the same four transitions with identical semantics.

**Consumers to rewire:** `components/sidebar/app-sidebar.tsx`,
`components/thread/use-resizable-split.ts`, `components/thread/thread.tsx`,
`components/graph/graph-panel.tsx`.

### Graph view (Stage B)

- `graphViewBaseAtom` (and its `atomWithStorage`) is removed.
- A `useGraphView()` hook returns `[view, setView]`:
  - **read:** derive `GraphView` from `useQueryStates({group, area, scene,
    automation})` via the existing `viewFromParams` (moved out of
    `TopologyUrlSync` into a shared pure function).
  - **write:** the inverse of `viewFromParams` (currently inlined in
    `TopologyUrlSync`'s atoms→URL effect) maps a `GraphView` to the four params,
    written atomically with `useQueryStates`. Default (Area) grouping stays out
    of the URL for clean links, as today.
  - **side-effect:** `setView` clears `selectedNodeAtom` (preserve the current
    `graphViewAtom` setter behaviour). `selectedNode` / `entityModal` remain
    plain ephemeral atoms — they are not navigation.
- `viewKey` / `viewScope` stay as pure functions on `GraphView` (position
  keying in `use-topology-graph.ts` is unchanged).
- The layout↔view coupling that `TopologyUrlSync` centralised — *when topology
  is not visible, the view params are stripped* — moves into the coordinated
  setters: `setLayout('chat')` also clears the view params; reading the view
  while layout is `chat` yields the default. One write path, one read path, no
  reconciling effect, no loop.
- `TopologyUrlSync` is deleted.

**Consumers to rewire:** `components/graph/group-by-controls.tsx`,
`components/thread/thread.tsx`, `lib/ha-graph/use-topology-graph.ts`,
`lib/ha-graph/group-nav.ts`.

## Data flow (after)

```
            ┌─────────────────────────── boot (once) ──────────────────────────┐
 parent #app= ──restoreFromParentHash──▶ iframe URL ──(if base)── LS checkpoint ─▶ replaceState
            └──────────────────────────────────────────────────────────────────┘

 runtime:   UI action ─▶ nuqs setter ─▶  window.location  ─▶ nuqs read ─▶ UI
                                              │
                                              └─▶ checkpoint boundary ─▶ { parent #app= , localStorage }
```

The URL is the only thing components read. localStorage and the parent hash are
write-through outputs of the URL, read only at boot.

## Behavior changes

- **Fresh session with no checkpoint** (first-ever open, or LS cleared) starts at
  defaults (`chat` + `areas`) instead of resuming a remembered view. On any
  normal reload or leave-and-return the checkpoint/parent-hash restores exactly.
  Accepted.
- **Layout/group changes now persist immediately** to the parent hash, fixing
  the stale-subscription gap in `ParentUrlSync`.
- The `?layout=chat,topology` → `?layout=split` change already shipped in 0.18.1;
  this design keeps `split` and removes the now-unneeded token translation.

## Testing strategy (TDD)

- **Pure functions** (unit, no adapter): `viewFromParams` and its inverse
  (round-trip every `GraphView`), the layout default/coercion, and the boot
  resolver (`explicit URL > checkpoint > default`) as a pure function over
  inputs `(currentRelLocation, checkpoint)`.
- **Hooks** (`usePanelLayout`, `useLayoutActions`, `useGraphView`): nuqs testing
  adapter (`withNuqsTestingAdapter`) — assert URL transitions and the
  `selectedNode`-clear side-effect.
- **Checkpoint boundary:** mock `localStorage` + a fake parent window; assert
  write-through on location change and the boot seed-vs-skip decision.
- Red-first per repo TDD: each new hook/function gets a failing test before
  implementation; existing `atoms.test.ts` layout specs are rewritten to the new
  shape.

## Scope

**In:** the checkpoint boundary; layout → URL (Stage A); graph view → URL +
delete `TopologyUrlSync` (Stage B); fold `ParentUrlSync` into the boundary and
fix its subscription bug.

**Out:** `selectedNode` / `entityModal` (ephemeral UI, stay atoms); preference
atoms `viewTools` / `fontSize` / `topology3d` / `splitFraction` (not navigation);
thread routing (already URL-sole-source); any backend change.

## Implementation stages

1. **Stage A** — checkpoint boundary (boot fallback + write-through, superseding
   `ParentUrlSync`) and layout → URL. Self-contained; also satisfies the
   param == atom request. Shippable on its own.
2. **Stage B** — graph view → URL; delete `TopologyUrlSync` and
   `graphViewBaseAtom`; move the layout↔view coupling into the setters.

One design doc (this file); each stage gets its own implementation plan.
