# Storybook for terminus Frontend

**Date:** 2026-06-18
**Scope:** `addons/terminus/frontend/`
**Status:** Approved

## Goal

Add Storybook to the terminus frontend with one rich story each for the Chat (Thread) and Topology (GraphCanvas) components. No interactions, no controls — static but realistic fixtures. Dark/light/system theme support matching the terminus-ui pattern.

## Package Changes

Add to `devDependencies` in `addons/terminus/frontend/package.json`:

```json
"storybook": "^10",
"@storybook/react-vite": "^10",
"@storybook/addon-themes": "^10",
"@storybook/addon-docs": "^10"
```

Add scripts:
```json
"storybook": "storybook dev -p 6007",
"build-storybook": "storybook build"
```

Port 6007 (terminus-ui is 6285, dev server is 5173 — no conflict).

## File Layout

```
addons/terminus/frontend/
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
└── stories/
    ├── chat.stories.tsx
    └── topology.stories.tsx
```

`stories/` sits alongside `src/` (not inside it), matching terminus-ui convention.

## `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-themes',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
};

export default config;
```

Leaner than terminus-ui (no vitest, no a11y, no chromatic, no onboarding).

## `.storybook/preview.tsx`

Copies terminus-ui's theme pattern verbatim: `withThemeByClassName` with `light/dark/system` options, default `system`. The `SystemThemeSync` wrapper handles the system-follow logic (MutationObserver + matchMedia).

Additional global decorators prepended:
- **`JotaiProvider`** — both Thread and GraphCanvas read Jotai atoms (`graphPanelOpenAtom`, `topologyAtom`, etc.)
- **`NuqsAdapter`** — Thread uses `useQueryState` for `threadId`, `chatHistoryOpen`, `hideToolCalls`

Import `src/index.css` for Tailwind v4 styles.

## Chat Story (`stories/chat.stories.tsx`)

### Mocking Strategy

`Thread` reads from `useStreamContext()`, `useThreads()`, and uses `ArtifactProvider`. Rather than module mocking:

- **Stream**: Export `StreamContext` from `providers/Stream.tsx` (it's a React context object). The story provides a static value via `<StreamContext.Provider value={mockStream}>`.
- **Threads**: Export `ThreadContext` from `providers/Thread.tsx`. Story provides `<ThreadContext.Provider value={mockThreads}>`.
- **Artifact**: Use `<ArtifactProvider>` directly — it's self-contained (no external deps).

No real API call, no streaming — just static data.

### Fixture Conversation

Three-turn HA interaction:

1. **Human**: "Turn on the living room lights and set them to warm white at 60%."
2. **AI (tool call)**: Calls `HassTurnOn` with `entity_id: light.lr_led_strip`, then `HassLightSet` with brightness/color_temp params.
3. **Tool result**: Success responses from both calls.
4. **AI (final)**: "Done — living room lights are on at 60%, warm white."

This exercises: human message rendering, AI markdown rendering, tool call display, tool result display — a full representative slice.

### Decorator Chain

```tsx
// story decorator (innermost → outermost):
<NuqsAdapter>
  <JotaiProvider>           // from global preview
    <ThreadContext.Provider value={mockThreads}>
      <StreamContext.Provider value={mockStream}>
        <ArtifactProvider>
          <Thread />
        </ArtifactProvider>
      </StreamContext.Provider>
    </ThreadContext.Provider>
  </JotaiProvider>
</NuqsAdapter>
```

## Topology Story (`stories/topology.stories.tsx`)

### Mocking Strategy

`GraphPanel` calls `useTopology(true)` which hits `/ha/topology`. Instead of mocking the hook, render **`GraphCanvas` directly** — it's the actual visualization component. `GraphPanel` is just a loading/error shell around it.

Pre-seed a Jotai `store` with:
- `topologyAtom` — fixture topology (see below)
- `graphViewAtom` — `{ kind: "area", areaId: "living_room" }` so the story opens on a populated area view
- `selectedNodeAtom` — `null`
- `nodePositionsAtom` — `{}` (let ReactFlow auto-layout)

Wrap in `<Provider store={store}>` + `<ReactFlowProvider>`.

No API call, no `useTopology`, no loading state to wait through.

### Fixture Topology

```
Areas:
  living_room  "Living Room"
  master_bedroom  "Master Bedroom"

Entities (living_room):
  light.lr_led_strip     "LED Strip"      domain: light
  switch.lr_lamp         "Floor Lamp"     domain: switch
  sensor.lr_illuminance  "Illuminance"    domain: sensor

Scenes (living_room):
  scene.lr_dim     "Dim"     entities: [light.lr_led_strip, switch.lr_lamp]
  scene.lr_bright  "Bright"  entities: [light.lr_led_strip, switch.lr_lamp]

Automations (living_room):
  automation.lr_sunset   "Sunset Dim"    references: { entities: [light.lr_led_strip], scenes: [scene.lr_dim] }
  automation.lr_morning  "Morning Bright" references: { entities: [light.lr_led_strip], scenes: [scene.lr_bright] }
```

With `graphViewAtom` set to `living_room`, `buildAreaGraph` will render the triangle layout: automations top, entities bottom-left, scenes bottom-right — a visually rich result.

## What Is Not In Scope

- `@storybook/addon-vitest` — no test integration
- `@storybook/addon-a11y` — not needed for two stories
- `@chromatic-com/storybook` — no CI/Chromatic setup
- Controls or Args — stories are static fixtures, no knobs
- Play functions / interactions — explicitly excluded
- Modifying `vite.config.ts` — Storybook picks up the existing config automatically via `@storybook/react-vite`
