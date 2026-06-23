# Terminus — Region-scoped error & suspense boundaries

**Date:** 2026-06-22
**Scope:** `addons/terminus/frontend`

## Problem

The frontend has a single error boundary (`components/error-boundary.tsx`)
wrapping all of `<Thread />`, and a single `Suspense` wrapping the
`topology3d ? <Topology3D/> : <Topology2D/>` ternary in
`components/graph/graph-panel.tsx`. Consequences:

- A render crash anywhere in the chat tree tears down the **whole** Thread
  (sidebar top bar, composer, both panes) and shows the full-screen
  `ErrorScreen`.
- The lazy topology renderers (`Topology2D` = react-flow, `Topology3D` =
  reagraph/three.js) sit under `Suspense` but under **no** error boundary, so a
  render crash or dynamic-`import()` chunk-load failure escapes uncaught.

## Goal

Scope failures to the region that failed. Add granular error + suspense
boundaries so a crashed topology renderer, message list, or artifact view
shows a local recoverable error instead of taking down siblings.

## Decisions

- **New component, for the new cases only.** Do not reuse `ErrorScreen` (it is a
  full-screen glitch-logo card; keep it on the two existing full-screen flows —
  the top-level chat boundary and the stream-connection error in
  `providers/stream.tsx`).
- **Contained visual:** the new fallback fills its parent region, not the
  screen.
- **Retry = `window.location.reload()`** for all four scenarios (for now).
- The existing top-level chat `ErrorBoundary` stays as the last-resort
  full-screen catch.

## Components

New file `src/components/error-fallback.tsx`, two exports:

1. **`ErrorFallback`** (presentational) — fills parent:
   `flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center`.
   Props: `title`, `message?`, `retryLabel = 'Reload'`,
   `onRetry = () => window.location.reload()`. Renders destructive-colored
   title, muted message, outline `Button` with `RefreshCw` icon. Mirrors the
   inline error idiom already in `graph-panel.tsx:79-86`.
2. **`RegionErrorBoundary`** (class) — same `getDerivedStateFromError` /
   `componentDidCatch` pattern as the existing `ErrorBoundary`, but parameterized
   by `title` / `message` / `retryLabel` props and renders `ErrorFallback`
   instead of the hardcoded `ErrorScreen`.

## Wiring — four boundaries

| # | Region | Structure | File |
|---|---|---|---|
| 1 | Topology 3D | `RegionErrorBoundary` → `Suspense`(`CanvasSpinner`) → `Topology3D` | `graph-panel.tsx` |
| 2 | Topology 2D | `RegionErrorBoundary` → `Suspense`(`CanvasSpinner`) → `Topology2D` | `graph-panel.tsx` |
| 3 | Stick-to-bottom | `RegionErrorBoundary` around `<StickToBottom>` | `thread.tsx` |
| 4 | Artifact wrapper | `RegionErrorBoundary` around `ArtifactTitle`+`ArtifactContent` fragment | `thread.tsx` |

The single topology `Suspense` (`graph-panel.tsx:89`) splits into **one Suspense
per renderer**, each nested *inside* its own error boundary so 2D and 3D fail
independently. Nesting order is boundary-outside / Suspense-inside: thrown
render errors hit the boundary, pending lazy imports hit Suspense.

## Copy

| Boundary | title | message |
|---|---|---|
| Topology 3D | 3D topology failed to render | The 3D view hit an error. Reloading should recover it. |
| Topology 2D | Topology failed to render | The diagram hit an error. Reloading should recover it. |
| Stick-to-bottom | The conversation failed to render | Something in the message list broke. Reloading should get you back. |
| Artifact | This artifact failed to render | The artifact view hit an error. Reloading should recover it. |

## Testing (TDD)

- `error-fallback.test.tsx` — renders title/message/retry; retry click invokes
  the handler.
- `region-error-boundary.test.tsx` — a throwing child renders the fallback
  (mirrors existing `error-boundary.test.tsx`).

## Out of scope

- No change to `ErrorScreen`, `providers/stream.tsx`, or the top-level chat
  `ErrorBoundary`.
- No telemetry/reporting beyond the existing `console.error` in
  `componentDidCatch`.
- Retry stays a full reload; no granular per-region recovery yet.
