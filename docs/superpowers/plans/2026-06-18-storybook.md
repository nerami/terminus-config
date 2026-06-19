# Storybook: Chat & Topology Stories — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storybook 10 to the terminus-langchain frontend with one rich story each for the Chat (`Thread`) and Topology (`GraphCanvas`) components.

**Architecture:** Global Storybook decorators provide Jotai + nuqs context. The Chat story bypasses the real `StreamProvider`/`ThreadProvider` by injecting static context values directly. The Topology story creates a pre-seeded Jotai store so `GraphCanvas` reads fixture topology without any API call.

**Tech Stack:** Storybook 10, `@storybook/react-vite`, `@storybook/addon-themes`, `@storybook/addon-docs`, Jotai v2, nuqs, `@xyflow/react`

## Global Constraints

- All work is under `addons/terminus-langchain/frontend/`
- Storybook version: `^10` (match terminus-ui at `^10.2.10`)
- Stories location: `stories/` alongside `src/`, never inside it
- No play functions, no controls, no interactions — static fixture data only
- Light / dark / system theme support via `@storybook/addon-themes` (class-based: `dark` class on `<html>`)
- Dev port: 6007 (avoids conflict with Vite dev at 5173 and terminus-ui at 6285)
- Package manager: pnpm

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.storybook/main.ts` | Storybook framework + addons config |
| Create | `.storybook/preview.tsx` | Global decorators: themes + Jotai + nuqs |
| Modify | `package.json` | Add Storybook devDeps + scripts |
| Modify | `src/providers/Thread.tsx` | Export `ThreadContext` (one line) |
| Create | `stories/chat.stories.tsx` | Chat story with fixture conversation |
| Create | `stories/topology.stories.tsx` | Topology story with fixture data |

---

### Task 1: Storybook scaffolding

**Files:**
- Modify: `addons/terminus-langchain/frontend/package.json`
- Create: `addons/terminus-langchain/frontend/.storybook/main.ts`
- Create: `addons/terminus-langchain/frontend/.storybook/preview.tsx`

**Interfaces:**
- Produces: a running Storybook at `http://localhost:6007` (no stories yet)

- [ ] **Step 1: Install Storybook packages**

Run from `addons/terminus-langchain/frontend/`:

```bash
pnpm add -D storybook@^10 @storybook/react-vite@^10 @storybook/addon-themes@^10 @storybook/addon-docs@^10
```

Expected: packages resolve and `pnpm-lock.yaml` updates. No peer-dep errors.

- [ ] **Step 2: Add scripts to package.json**

Open `package.json` and add to `"scripts"`:

```json
"storybook": "storybook dev -p 6007",
"build-storybook": "storybook build"
```

- [ ] **Step 3: Create `.storybook/main.ts`**

Create the file (create the `.storybook/` directory first):

```typescript
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

- [ ] **Step 4: Create `.storybook/preview.tsx`**

Copies terminus-ui's theme pattern verbatim; adds Jotai + nuqs as outermost decorators (listed last in the array, which makes them the outermost React wrapper):

```tsx
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { Provider as JotaiProvider } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import '../src/index.css';

const DARK_CLASS = 'dark';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function SystemThemeSync({
  children,
  theme,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (theme !== 'system') return;
    const root = document.documentElement;

    const apply = () => {
      const mode = getSystemTheme();
      if (mode === 'dark') root.classList.add(DARK_CLASS);
      else root.classList.remove(DARK_CLASS);
    };

    apply();

    const observer = new MutationObserver(() => {
      const wantDark = getSystemTheme() === 'dark';
      const hasDark = root.classList.contains(DARK_CLASS);
      if (wantDark && !hasDark) root.classList.add(DARK_CLASS);
      else if (!wantDark && hasDark) root.classList.remove(DARK_CLASS);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);

    return () => {
      observer.disconnect();
      mq.removeEventListener('change', apply);
    };
  }, [theme]);
  return <>{children}</>;
}

const withSystemTheme = (
  Story: React.ComponentType,
  context: { globals: { theme?: string } },
) => {
  const raw = context.globals?.theme ?? '';
  const theme = raw === '' ? 'system' : raw;
  return (
    <SystemThemeSync theme={theme}>
      <Story />
    </SystemThemeSync>
  );
};

// Outermost wrapper: provides Jotai store + nuqs URL adapter to every story.
// Listed last in `decorators` so it is the outermost React component.
const withJotaiAndNuqs = (Story: React.ComponentType) => (
  <JotaiProvider>
    <NuqsAdapter>
      <Story />
    </NuqsAdapter>
  </JotaiProvider>
);

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: DARK_CLASS,
        system: '',
      },
      defaultTheme: 'system',
    }),
    withSystemTheme,
    withJotaiAndNuqs,
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 5: Verify Storybook starts**

```bash
pnpm storybook
```

Expected: browser opens at `http://localhost:6007`, Storybook UI loads (no stories yet, shows empty state or welcome screen). No build errors in the terminal.

- [ ] **Step 6: Commit**

```bash
git add addons/terminus-langchain/frontend/package.json \
        addons/terminus-langchain/frontend/pnpm-lock.yaml \
        addons/terminus-langchain/frontend/.storybook/main.ts \
        addons/terminus-langchain/frontend/.storybook/preview.tsx
git commit -m "chore(frontend): scaffold Storybook 10 with theme + Jotai + nuqs decorators"
```

---

### Task 2: Chat story

**Files:**
- Modify: `addons/terminus-langchain/frontend/src/providers/Thread.tsx` (line 25 — export `ThreadContext`)
- Create: `addons/terminus-langchain/frontend/stories/chat.stories.tsx`

**Interfaces:**
- Consumes: `StreamContext` (default export from `@/providers/Stream`), `ThreadContext` (named export added in this task), `ArtifactProvider` (named export from `@/components/thread/artifact`), `Thread` (named export from `@/components/thread`)
- Produces: Storybook story at `Chat / Default` showing a complete 5-message HA conversation

- [ ] **Step 1: Export `ThreadContext` from `Thread.tsx`**

Open `src/providers/Thread.tsx`. After line 25 (`const ThreadContext = createContext...`), add one line:

```typescript
export { ThreadContext };
```

The file currently has `const ThreadContext = createContext<ThreadContextType | undefined>(undefined);` on line 25. The export goes immediately after.

- [ ] **Step 2: Create `stories/chat.stories.tsx`**

Create the `stories/` directory and the file:

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Message } from '@langchain/langgraph-sdk';

import StreamContext, { useStreamContext } from '@/providers/Stream';
import { ThreadContext } from '@/providers/Thread';
import { ArtifactProvider } from '@/components/thread/artifact';
import { Thread } from '@/components/thread';
import { Toaster } from '@/components/ui/sonner';

// Derive the exact stream context type from the exported hook's return type.
type StreamContextType = ReturnType<typeof useStreamContext>;

// Five-message conversation: human → AI tool-call → 2 tool results → AI final.
// This exercises: human rendering, tool-call display, tool results, AI markdown.
const FIXTURE_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    type: 'human',
    content: 'Turn on the living room lights and set them to warm white at 60%.',
  },
  {
    id: 'msg-2',
    type: 'ai',
    content: '',
    tool_calls: [
      {
        id: 'call-1',
        name: 'HassTurnOn',
        args: { entity_id: 'light.lr_led_strip' },
        type: 'tool_call',
      },
      {
        id: 'call-2',
        name: 'HassLightSet',
        args: { entity_id: 'light.lr_led_strip', brightness_pct: 60, color_temp: 370 },
        type: 'tool_call',
      },
    ],
  },
  {
    id: 'msg-3',
    type: 'tool',
    content: 'light.lr_led_strip turned on successfully.',
    tool_call_id: 'call-1',
    name: 'HassTurnOn',
  },
  {
    id: 'msg-4',
    type: 'tool',
    content: 'Brightness set to 60 %, color temperature 370 K.',
    tool_call_id: 'call-2',
    name: 'HassLightSet',
  },
  {
    id: 'msg-5',
    type: 'ai',
    content:
      "Done — the living room lights are on at **60% brightness**, warm white (370 K). Let me know if you'd like to adjust anything.",
  },
];

// Minimal stream mock: static messages, not loading, no errors.
// Cast required because StreamContextType includes internal SDK fields we don't need.
const MOCK_STREAM = {
  messages: FIXTURE_MESSAGES,
  isLoading: false,
  error: null,
  interrupt: undefined,
  values: { messages: FIXTURE_MESSAGES, ui: [] },
  submit: () => {},
  stop: () => {},
  getMessagesMetadata: () => undefined,
  setBranch: () => {},
} as unknown as StreamContextType;

// ThreadContext value: empty thread list, no loading.
const MOCK_THREADS = {
  getThreads: async () => [],
  threads: [],
  setThreads: () => {},
  threadsLoading: false,
  setThreadsLoading: () => {},
};

function ChatStory() {
  return (
    <ThreadContext.Provider value={MOCK_THREADS}>
      <StreamContext.Provider value={MOCK_STREAM}>
        <ArtifactProvider>
          <Toaster />
          <Thread />
        </ArtifactProvider>
      </StreamContext.Provider>
    </ThreadContext.Provider>
  );
}

const meta: Meta = {
  title: 'Chat',
  component: ChatStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
```

- [ ] **Step 3: Verify the story renders**

With Storybook still running (`pnpm storybook`), navigate to **Chat → Default**. Expected:
- Full chat layout renders (header bar, message list, input area)
- 5 messages visible: 1 human, 1 AI tool-call, 2 tool results, 1 AI final with bold markdown
- Input textarea is empty and editable
- HA status indicator shows "disconnected" (no backend — expected)
- Theme toggle (toolbar) switches between light / dark / system correctly

- [ ] **Step 4: Commit**

```bash
git add addons/terminus-langchain/frontend/src/providers/Thread.tsx \
        addons/terminus-langchain/frontend/stories/chat.stories.tsx
git commit -m "feat(frontend): add Chat Storybook story with fixture conversation"
```

---

### Task 3: Topology story

**Files:**
- Create: `addons/terminus-langchain/frontend/stories/topology.stories.tsx`

**Interfaces:**
- Consumes: `GraphCanvas` (named export from `@/components/graph/GraphCanvas`), `topologyAtom` + `graphViewAtom` (from `@/lib/ha-graph/atoms`), `Topology` type (from `@/lib/ha-graph/types`)
- Produces: Storybook story at `Topology / Default` showing the Living Room area graph (triangle layout: automations top, entities bottom-left, scenes bottom-right)

**Key implementation notes:**
- Render `GraphCanvas` directly, not `GraphPanel`. `GraphPanel` owns the loading/fetch logic via `useTopology`; `GraphCanvas` is the visualization layer that reads from atoms — bypassing the API entirely.
- `graphViewAtom` is a writable derived atom. `store.set(graphViewAtom, view)` invokes its write function, which sets the base atom AND clears `selectedNodeAtom`. No need to export `graphViewBaseAtom`.
- `@xyflow/react` requires its CSS imported separately. Without it, nodes stack at (0,0) and edges don't render.
- `TopologyStory` creates its own inner `JotaiProvider` with a pre-seeded store. Jotai resolves atoms from the nearest `Provider` in the React tree, so `GraphCanvas` uses the inner store (with fixture data) — not the outer global one from `preview.tsx`.

- [ ] **Step 1: Create `stories/topology.stories.tsx`**

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactFlowProvider } from '@xyflow/react';
import { createStore } from 'jotai';
import { Provider as JotaiProvider } from 'jotai';

// Required: ReactFlow renders nothing without its own stylesheet.
import '@xyflow/react/dist/style.css';

import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { topologyAtom, graphViewAtom } from '@/lib/ha-graph/atoms';
import type { Topology } from '@/lib/ha-graph/types';

const FIXTURE_TOPOLOGY: Topology = {
  areas: [
    { area_id: 'living_room', name: 'Living Room' },
    { area_id: 'master_bedroom', name: 'Master Bedroom' },
  ],
  entities: [
    {
      entity_id: 'light.lr_led_strip',
      name: 'LED Strip',
      domain: 'light',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'switch.lr_lamp',
      name: 'Floor Lamp',
      domain: 'switch',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'sensor.lr_illuminance',
      name: 'Illuminance',
      domain: 'sensor',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'light.mb_led_one',
      name: 'Led One',
      domain: 'light',
      area_id: 'master_bedroom',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    {
      entity_id: 'scene.lr_dim',
      name: 'Dim',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
    {
      entity_id: 'scene.lr_bright',
      name: 'Bright',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
  ],
  automations: [
    {
      entity_id: 'automation.lr_sunset_dim',
      name: 'Sunset Dim',
      area_id: 'living_room',
      numeric_id: '1',
      references: {
        entities: ['light.lr_led_strip'],
        scenes: ['scene.lr_dim'],
        devices: [],
      },
    },
    {
      entity_id: 'automation.lr_morning_bright',
      name: 'Morning Bright',
      area_id: 'living_room',
      numeric_id: '2',
      references: {
        entities: ['light.lr_led_strip'],
        scenes: ['scene.lr_bright'],
        devices: [],
      },
    },
  ],
};

// Creates a fresh Jotai store pre-seeded with topology + area view.
// Called once via useState initializer so the store survives re-renders.
function createTopologyStore() {
  const store = createStore();
  store.set(topologyAtom, FIXTURE_TOPOLOGY);
  // Writing graphViewAtom invokes its write function: sets graphViewBaseAtom
  // and clears selectedNodeAtom — same as navigating in the real app.
  store.set(graphViewAtom, { kind: 'area', areaId: 'living_room' });
  return store;
}

function TopologyStory() {
  // Stable store across re-renders (useState with initializer function).
  const [store] = React.useState(createTopologyStore);

  return (
    // Inner JotaiProvider shadows the global one from preview.tsx.
    // GraphCanvas resolves atoms from the nearest Provider — this store.
    <JotaiProvider store={store}>
      <ReactFlowProvider>
        <div style={{ width: '100%', height: '100vh' }}>
          <GraphCanvas />
        </div>
      </ReactFlowProvider>
    </JotaiProvider>
  );
}

const meta: Meta = {
  title: 'Topology',
  component: TopologyStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
```

- [ ] **Step 2: Verify the story renders**

Navigate to **Topology → Default** in Storybook. Expected:
- ReactFlow canvas fills the viewport
- Living Room area view: automations cluster at top (Sunset Dim, Morning Bright), entities at bottom-left (LED Strip, Floor Lamp, Illuminance), scenes at bottom-right (Dim, Bright)
- Edges connect automations to referenced entities/scenes
- Mini-map and controls (zoom in/out) visible
- Clicking a node selects it and dims unrelated nodes/edges
- Theme toggle switches correctly (node cards respect dark/light CSS vars)

A console error for `GET /ha/automation/...` is expected and harmless — `useAutomationDetail(null)` is called from `GraphCanvas` but its result is ignored in `area` view.

- [ ] **Step 3: Commit**

```bash
git add addons/terminus-langchain/frontend/stories/topology.stories.tsx
git commit -m "feat(frontend): add Topology Storybook story with fixture Living Room area graph"
```
