# Storybook co-location + shared support module + full story coverage

**Date:** 2026-06-23
**Scope:** `addons/terminus/frontend`
**Branch:** `features/storybook-colocation`

## Problem

Stories live in a root `stories/` folder, divorced from the components they
document. Three story files copy-paste an identical `FIXTURE_TOPOLOGY`, and the
provider-wrapping stack (Nuqs + react-query seeded with topology + Jotai store
[+ ReactFlow]) is duplicated in each. `chat.stories.tsx` hand-rolls its own mock
Stream/Thread/Artifact/Router/Sidebar stack. Coverage is partial: only 7
surfaces have stories.

## Goals

0. Co-locate stories next to their components; update Storybook config.
1. Move the 7 existing stories to live beside their components.
2. Extract shared Storybook utilities (fixtures, mock factories) — DRY.
3. Extract shared provider decorators.
4. Add Tier 1 + Tier 2 story coverage for the remaining components.

Non-goals: `ui/` primitives (excluded by request); `brand/terminus-logo`
(its story was intentionally deleted in `07e2930`); unit-test changes.

## Decisions (confirmed with user)

- **Shared support module → `src/storybook/`** (imported as `@/storybook/...`).
- **Auto-titles from path** — no `title:` in any `meta`. `main.ts` sets
  `directory: '../src'`, so titles read e.g. `components/graph/Graph Canvas`,
  `components/thread/Markdown Text`. Named exports (story variants) are kept.
  This replaces today's curated labels (`Chat`, `Topology/2D`, …).

## Design

### 0. Config — `.storybook/main.ts`

```ts
stories: [
  { directory: '../src', files: '**/*.mdx' },
  { directory: '../src', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)' },
],
```

- Co-located `*.stories.tsx` do not collide with the unit-test glob
  (`*.test.*`), so vitest's unit project ignores them; `@storybook/addon-vitest`
  discovers them from `main.ts` as before.
- Delete the `stories/` folder once everything is moved.

### 1. Move existing stories (co-located, auto-titled)

| From `stories/` | To | Auto title |
|---|---|---|
| `chat.stories.tsx` | `src/components/thread/thread.stories.tsx` | `components/thread/Thread` |
| `topology.stories.tsx` | `src/components/graph/graph-canvas.stories.tsx` | `components/graph/Graph Canvas` |
| `topology-3d.stories.tsx` | `src/components/graph/graph-canvas-3d.stories.tsx` | `components/graph/Graph Canvas 3D` |
| `topology-filters.stories.tsx` | `src/components/graph/topology-filters.stories.tsx` | `components/graph/Topology Filters` |
| `error-fallback.stories.tsx` | `src/components/error-fallback.stories.tsx` | `components/Error Fallback` |
| `region-error-boundary.stories.tsx` | `src/components/region-error-boundary.stories.tsx` | `components/Region Error Boundary` |
| `loading-screen.stories.tsx` | `src/components/status-card.stories.tsx` | `components/Status Card` |

Each is rewritten to import fixtures/mocks/decorators from `@/storybook/*`
instead of inlining them.

### 2 & 3. Shared support module — `src/storybook/`

- **`fixtures.ts`** — single source of truth for sample data:
  - `FIXTURE_TOPOLOGY`, `EMPTY_TOPOLOGY` (`Topology`)
  - `FIXTURE_MESSAGES` + `buildConversation(...)` helpers (`Message[]`)
  - `SAMPLE_MARKDOWN`, `SAMPLE_TOOL_CALL`(s), entity/interrupt samples
- **`mocks.tsx`** — factories:
  - `createTopologyStore({ selected?, filter?, domains? })` → seeded Jotai store
  - `createTopologyQueryClient(topology?)` → react-query client w/ topology cache
  - `createMockStream(messages, { isLoading?, error?, interrupt? })` → `StreamContextType`
  - `createMockThreads(threads?)` → `ThreadContext` value
- **`decorators.tsx`** — composable Storybook decorators:
  - `withTopologyProviders({ topology?, store?, reactFlow? })` — Nuqs + seeded
    QueryClient + Jotai (+ optional `ReactFlowProvider`)
  - `withChatProviders({ messages?, threads?, stream? })` — Thread + Stream +
    Artifact + Sidebar + Toaster + memory Router
  - `Region` — the bordered fixed-size frame the error stories hand-roll

Decorators accept options via a factory and read nothing global, so each story
stays declarative. Theme is already global (preview.tsx) — not duplicated here.

### 4. New stories

**Tier 1 — pure, no provider mocking (16):** ErrorScreen, HaStatusIndicator,
MarkdownText, SyntaxHighlighter, ToolCalls, GenericInterrupt, GraphControls,
Graph3dLegend, ContextChips, ContentBlocksPreview, MultimodalPreview,
Disclaimer, ToolCallTable, StateView, InboxItemInput, ThreadId.

**Tier 2 — needs mocked providers (11):** AppSidebar, SidebarSessionList,
SettingsMenu, WhatsNewDialog, RenameThreadDialog, EntityDetailModal,
AI message, Human message, AgentInbox, ThreadActionsView, Artifact.

Each new story: co-located `<component>.stories.tsx`, no `title:`, ≥1 meaningful
named export per distinct visual state (e.g. HaStatusIndicator: Connected /
Connecting / Disconnected / Error).

## Verification

- `pnpm build-storybook` compiles clean (catches broken imports/types across all
  stories at once).
- `pnpm test:run` stays green (story moves must not perturb unit tests).
- Spot-check the Storybook sidebar tree renders the expected auto-titled groups.
- Per-component: the story renders without console errors in the a11y/test addon.

## Risks

- **Auto-title surprises** — wrong `directory` base yields `src/...`-prefixed
  titles. Mitigation: set `directory: '../src'` and verify the tree once.
- **Tier 2 mocking drift** — mock context shapes can fall behind real ones.
  Mitigation: derive types from the real hooks (`ReturnType<typeof useStreamContext>`),
  as `chat.stories.tsx` already does.
- **Browser-only deps in stories** (three/r3f, xyflow) — keep their CSS/provider
  imports inside the specific story, not the shared module.
