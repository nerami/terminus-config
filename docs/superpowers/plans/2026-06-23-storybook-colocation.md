# Storybook Co-location Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Co-locate every Storybook story beside its component, collapse the duplicated fixtures/providers into a shared `src/storybook/` module, and add Tier 1 + Tier 2 story coverage for the remaining components.

**Architecture:** A shared support module (`src/storybook/`) exports sample data (fixtures), context/store factories (mocks), and composable provider decorators. Stories live as `<component>.stories.tsx` next to their components and import only from `@/storybook/*`. Storybook auto-derives sidebar titles from file paths (`directory: '../src'`), so no `title:` is written.

**Tech Stack:** Storybook 10 (`@storybook/react-vite`), `@storybook/addon-vitest` (browser story tests via Playwright), Vite, React 19, Jotai, nuqs, TanStack react-query + router, `@xyflow/react`, reagraph/three, pnpm.

## Global Constraints

- **Working dir:** `addons/terminus/frontend`. All paths below are relative to it. All `pnpm`/`git` commands run from there.
- **Package manager: pnpm only.** Never `npm install`.
- **No `title:` in any `meta`.** Sidebar titles are auto-derived from path via `main.ts` `directory: '../src'`. Keep named exports (story variants).
- **Shared module lives at `src/storybook/`**, imported as `@/storybook/...` (the `@` alias → `src`).
- **Stories are co-located:** `src/components/<area>/<name>.stories.tsx`.
- **Out of scope (do not add stories):** anything under `src/components/ui/`, and `src/components/brand/terminus-logo/*` (its story was deliberately removed in `07e2930`).
- **Theme is already global** (`.storybook/preview.tsx` wraps every story in theme + Jotai + Nuqs). Inner providers in decorators intentionally *shadow* the globals (a fresh seeded store per story); this is expected, not a bug.
- **Derive mock context types from the real hooks** — e.g. `type StreamContextType = ReturnType<typeof useStreamContext>` — so mocks can't silently drift from production shapes.
- **Per-task gate (fast):** `pnpm typecheck` (catches broken imports/types — the dominant story failure mode).
- **Phase/final gate:** `pnpm test:run` (unit tests stay green) **and** `pnpm build-storybook` (compiles + type-checks every story together).
- **Commits:** Conventional Commits, scope `terminus`. End every commit message with these two trailers:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_011xc42rGgJmMMTKZPgEPFNC
  ```
- **Branch:** `features/storybook-colocation` (already created).

---

## Story authoring template

Every story task follows this shape. No `title:`; one named export per distinct visual state; decorators come from `@/storybook/decorators`.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TheComponent } from './the-component';
// import { withTopologyProviders | withChatProviders | Region } from '@/storybook/decorators';
// import { FIXTURE_* , SAMPLE_* } from '@/storybook/fixtures';

const meta = {
  component: TheComponent,
  parameters: { layout: 'centered' }, // or 'fullscreen' for full-bleed surfaces
  // decorators: [withTopologyProviders()],          // when context is needed
  // args: { onSomething: () => {} },                // stub real side effects (no window.reload etc.)
} satisfies Meta<typeof TheComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { /* ... */ } };
// export const OtherState: Story = { args: { /* ... */ } };
```

---

## Phase A — Foundation (shared module + config)

### Task 1: Storybook config — co-location glob

**Files:**
- Modify: `.storybook/main.ts`

**Interfaces:**
- Produces: Storybook now discovers stories under `../src/**` and auto-titles them from the `../src` base. During migration it *also* keeps discovering `../stories/**` so nothing breaks mid-flight (Task 23 removes that line).

- [ ] **Step 1: Update the `stories` array**

Replace the `stories` field so it reads:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // Co-located stories (final home). `directory` is the auto-title base, so a
    // file at src/components/graph/graph-canvas.stories.tsx titles as
    // "components/graph/Graph Canvas".
    { directory: '../src', files: '**/*.mdx' },
    { directory: '../src', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)' },
    // TEMPORARY: keep the legacy folder discoverable until every story is moved
    // (removed in the cleanup task).
    { directory: '../stories', files: '**/*.mdx' },
    { directory: '../stories', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)' },
  ],
  addons: ['@storybook/addon-themes', '@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};
export default config;
```

- [ ] **Step 2: Verify typecheck still passes**

Run: `pnpm typecheck`
Expected: PASS (no type errors).

- [ ] **Step 3: Commit**

```bash
git add .storybook/main.ts
git commit -m "chore(terminus): co-locate storybook stories under src/ (config)" # + trailers
```

---

### Task 2: Shared fixtures — `src/storybook/fixtures.ts`

**Files:**
- Create: `src/storybook/fixtures.ts`

**Interfaces:**
- Produces (all consumed by later tasks — exact names/types):
  - `FIXTURE_TOPOLOGY: Topology`, `EMPTY_TOPOLOGY: Topology`
  - `FIXTURE_MESSAGES: Message[]`
  - `SAMPLE_MARKDOWN: string`
  - `SAMPLE_TOOL_CALLS: AIMessage['tool_calls']`
  - `SAMPLE_TOOL_MESSAGE: ToolMessage`
  - `SAMPLE_INTERRUPT: Record<string, unknown>`
  - `SAMPLE_CONTEXT_ITEMS: ContextItem[]`
  - `SAMPLE_IMAGE_BLOCK`, `SAMPLE_FILE_BLOCK` (`ContentBlock.Multimodal.Data`)

- [ ] **Step 1: Write the file**

The topology object is lifted verbatim from the current `stories/topology.stories.tsx` (the fullest copy). Messages from `stories/chat.stories.tsx`.

```ts
import type { AIMessage, Message, ToolMessage } from '@langchain/langgraph-sdk';
import type { ContentBlock } from '@langchain/core/messages';

import type { ContextItem } from '@/lib/chat-context';
import type { Topology } from '@/lib/ha-graph/types';

export const FIXTURE_TOPOLOGY: Topology = {
  areas: [
    { area_id: 'living_room', name: 'Living Room' },
    { area_id: 'master_bedroom', name: 'Master Bedroom' },
  ],
  entities: [
    { entity_id: 'light.lr_led_strip', name: 'LED Strip', domain: 'light', area_id: 'living_room', device_id: null, device_name: null },
    { entity_id: 'switch.lr_lamp', name: 'Floor Lamp', domain: 'switch', area_id: 'living_room', device_id: null, device_name: null },
    { entity_id: 'sensor.lr_illuminance', name: 'Illuminance', domain: 'sensor', area_id: 'living_room', device_id: null, device_name: null },
    { entity_id: 'light.mb_led_one', name: 'Led One', domain: 'light', area_id: 'master_bedroom', device_id: null, device_name: null },
  ],
  scenes: [
    { entity_id: 'scene.lr_dim', name: 'Dim', area_id: 'living_room', entities: ['light.lr_led_strip', 'switch.lr_lamp'] },
    { entity_id: 'scene.lr_bright', name: 'Bright', area_id: 'living_room', entities: ['light.lr_led_strip', 'switch.lr_lamp'] },
  ],
  automations: [
    { entity_id: 'automation.lr_sunset_dim', name: 'Sunset Dim', area_id: 'living_room', numeric_id: '1', references: { entities: ['light.lr_led_strip'], scenes: ['scene.lr_dim'], devices: [] } },
    { entity_id: 'automation.lr_morning_bright', name: 'Morning Bright', area_id: 'living_room', numeric_id: '2', references: { entities: ['light.lr_led_strip'], scenes: ['scene.lr_bright'], devices: [] } },
  ],
};

export const EMPTY_TOPOLOGY: Topology = { areas: [], entities: [], scenes: [], automations: [] };

export const SAMPLE_TOOL_CALLS: AIMessage['tool_calls'] = [
  { id: 'call-1', name: 'HassTurnOn', args: { entity_id: 'light.lr_led_strip' }, type: 'tool_call' },
  { id: 'call-2', name: 'HassLightSet', args: { entity_id: 'light.lr_led_strip', brightness_pct: 60, color_temp: 370 }, type: 'tool_call' },
];

export const SAMPLE_TOOL_MESSAGE: ToolMessage = {
  id: 'msg-3', type: 'tool', content: 'light.lr_led_strip turned on successfully.', tool_call_id: 'call-1', name: 'HassTurnOn',
};

export const FIXTURE_MESSAGES: Message[] = [
  { id: 'msg-1', type: 'human', content: 'Turn on the living room lights and set them to warm white at 60%.' },
  { id: 'msg-2', type: 'ai', content: '', tool_calls: SAMPLE_TOOL_CALLS },
  { id: 'msg-3', type: 'tool', content: 'light.lr_led_strip turned on successfully.', tool_call_id: 'call-1', name: 'HassTurnOn' },
  { id: 'msg-4', type: 'tool', content: 'Brightness set to 60 %, color temperature 370 K.', tool_call_id: 'call-2', name: 'HassLightSet' },
  { id: 'msg-5', type: 'ai', content: "Done — the living room lights are on at **60% brightness**, warm white (370 K)." },
];

export const SAMPLE_MARKDOWN = `# Heading 1
## Heading 2

A paragraph with **bold**, _italic_, \`inline code\`, and a [link](https://example.com).

- bullet one
- bullet two
  - nested

1. first
2. second

> A blockquote.

| Entity | State |
| --- | --- |
| light.lr_led_strip | on |
| switch.lr_lamp | off |

\`\`\`python
def greet(name: str) -> str:
    return f"hello {name}"
\`\`\`
`;

export const SAMPLE_INTERRUPT: Record<string, unknown> = {
  action_request: { action: 'HassLightSet', args: { entity_id: 'light.lr_led_strip', brightness_pct: 80 } },
  description: 'Confirm before changing the living-room brightness.',
};

export const SAMPLE_CONTEXT_ITEMS: ContextItem[] = [
  { id: 'page:areas', kind: 'page', label: 'Areas overview', detail: 'All rooms and their devices' },
  { id: 'node:light.lr_led_strip', kind: 'node', label: 'LED Strip', detail: 'light · Living Room' },
];

export const SAMPLE_IMAGE_BLOCK: ContentBlock.Multimodal.Data = {
  type: 'image', mimeType: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
} as unknown as ContentBlock.Multimodal.Data;

export const SAMPLE_FILE_BLOCK: ContentBlock.Multimodal.Data = {
  type: 'file', mimeType: 'application/pdf', name: 'automation-notes.pdf', data: '',
} as unknown as ContentBlock.Multimodal.Data;
```

> **Note for implementer:** open `src/lib/ha-graph/types.ts`, `src/lib/chat-context.ts`, and `@langchain/core/messages` `ContentBlock.Multimodal.Data` to confirm field names. If the `image`/`file` block shapes differ, adjust the two `SAMPLE_*_BLOCK` constants (and drop the `as unknown as` casts if a clean literal type-checks).

- [ ] **Step 2: Verify typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/storybook/fixtures.ts
git commit -m "test(terminus): add shared storybook fixtures" # + trailers
```

---

### Task 3: Shared mocks — `src/storybook/mocks.tsx`

**Files:**
- Create: `src/storybook/mocks.tsx`

**Interfaces:**
- Consumes: `FIXTURE_TOPOLOGY`, `FIXTURE_MESSAGES` from `@/storybook/fixtures`.
- Produces:
  - `createTopologyStores(opts?: { topology?: Topology; seed?: (store: ReturnType<typeof createStore>) => void }): { store: ReturnType<typeof createStore>; queryClient: QueryClient }`
  - `createMockStream(messages?: Message[], opts?: { isLoading?: boolean; error?: unknown; interrupt?: unknown }): StreamContextType`
  - `createMockThreads(threads?: ThreadValue['threads']): ThreadValue` where `ThreadValue = React.ContextType<typeof ThreadContext>`

- [ ] **Step 1: Write the file**

```tsx
import { QueryClient } from '@tanstack/react-query';
import { createStore } from 'jotai';

import type { Message } from '@langchain/langgraph-sdk';

import type { Topology } from '@/lib/ha-graph/types';
import { topologyQueryOptions } from '@/lib/ha-graph/queries';
import { ThreadContext } from '@/providers/thread';
import { useStreamContext } from '@/providers/stream';

import { FIXTURE_MESSAGES, FIXTURE_TOPOLOGY } from './fixtures';

type StreamContextType = ReturnType<typeof useStreamContext>;
type ThreadValue = React.ContextType<typeof ThreadContext>;

// Fresh Jotai store + react-query client seeded with topology. `seed` lets a
// story set extra atoms (selected node, filters, available domains, entity
// modal) without each story re-deriving the provider stack.
export function createTopologyStores(opts: { topology?: Topology; seed?: (store: ReturnType<typeof createStore>) => void } = {}) {
  const store = createStore();
  opts.seed?.(store);
  const queryClient = new QueryClient();
  queryClient.setQueryData(topologyQueryOptions().queryKey, opts.topology ?? FIXTURE_TOPOLOGY);
  return { queryClient, store };
}

// Static stream: messages, not loading, no error. Cast because StreamContextType
// includes many internal SDK fields the stories never touch.
export function createMockStream(messages: Message[] = FIXTURE_MESSAGES, opts: { isLoading?: boolean; error?: unknown; interrupt?: unknown } = {}): StreamContextType {
  return {
    messages,
    isLoading: opts.isLoading ?? false,
    error: opts.error ?? null,
    interrupt: opts.interrupt,
    values: { messages, ui: [] },
    submit: () => {},
    stop: () => {},
    getMessagesMetadata: () => undefined,
    setBranch: () => {},
  } as unknown as StreamContextType;
}

export function createMockThreads(threads: ThreadValue['threads'] = []): ThreadValue {
  return {
    getThreads: async () => threads,
    archiveThread: async () => {},
    updateThreadTitle: async () => {},
    generateThreadTitle: async () => {},
    threads,
    setThreads: () => {},
    threadsLoading: false,
    setThreadsLoading: () => {},
  };
}
```

> **Note for implementer:** confirm `ThreadContext` is exported from `@/providers/thread` and its value shape matches `createMockThreads` (it mirrors the inline `MOCK_THREADS` in the current `stories/chat.stories.tsx`). Adjust fields if the context has changed.

- [ ] **Step 2: Verify typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/storybook/mocks.tsx
git commit -m "test(terminus): add shared storybook store/context mocks" # + trailers
```

---

### Task 4: Shared decorators — `src/storybook/decorators.tsx`

**Files:**
- Create: `src/storybook/decorators.tsx`

**Interfaces:**
- Consumes: `createTopologyStores`, `createMockStream`, `createMockThreads` from `@/storybook/mocks`.
- Produces:
  - `withTopologyProviders(opts?: { topology?: Topology; seed?: (s) => void; reactFlow?: boolean }): Decorator`
  - `withChatProviders(opts?: { messages?: Message[]; threads?; stream?; router?: boolean; sidebar?: boolean }): Decorator`
  - `Region({ children, className? }): JSX.Element` — fixed-size bordered frame (replaces the hand-rolled `Region` in the error stories)

- [ ] **Step 1: Write the file**

```tsx
import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import type { Decorator } from '@storybook/react-vite';
import type { Message } from '@langchain/langgraph-sdk';

import type { Topology } from '@/lib/ha-graph/types';
import { ArtifactProvider } from '@/components/thread/artifact';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { StreamContext } from '@/providers/stream';
import { ThreadContext } from '@/providers/thread';
import { cn } from '@/lib/utils';

import { createMockStream, createMockThreads, createTopologyStores } from './mocks';

// Seeded Jotai store + react-query topology cache + Nuqs (+ optional ReactFlow).
// Inner providers deliberately shadow the global preview ones so each story gets
// a fresh seeded store.
export function withTopologyProviders(opts: { topology?: Topology; seed?: (store: ReturnType<typeof createStore>) => void; reactFlow?: boolean } = {}): Decorator {
  return function TopologyDecorator(Story) {
    const [{ queryClient, store }] = React.useState(() => createTopologyStores({ topology: opts.topology, seed: opts.seed }));
    const inner = opts.reactFlow ? (
      <ReactFlowProvider>
        <Story />
      </ReactFlowProvider>
    ) : (
      <Story />
    );
    return (
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider store={store}>{inner}</JotaiProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    );
  };
}

// Stream + Thread + Artifact context (+ optional Sidebar shell and memory Router).
// Router is needed only by the full <Thread/> (useThreadId → useParams); message
// bubbles and inbox views need just Stream/Artifact, so it defaults off.
export function withChatProviders(opts: { messages?: Message[]; threads?: Parameters<typeof createMockThreads>[0]; stream?: ReturnType<typeof createMockStream>; router?: boolean; sidebar?: boolean } = {}): Decorator {
  return function ChatDecorator(Story) {
    const stream = opts.stream ?? createMockStream(opts.messages);
    const threads = createMockThreads(opts.threads);

    let tree: React.ReactNode = <Story />;
    if (opts.sidebar) {
      tree = (
        <SidebarProvider>
          <SidebarInset>{tree}</SidebarInset>
        </SidebarProvider>
      );
    }
    tree = (
      <ThreadContext.Provider value={threads}>
        <StreamContext.Provider value={stream}>
          <ArtifactProvider>
            <Toaster />
            {tree}
          </ArtifactProvider>
        </StreamContext.Provider>
      </ThreadContext.Provider>
    );

    if (!opts.router) return <>{tree}</>;

    const rootRoute = createRootRoute({ component: () => <Outlet /> });
    const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => <>{tree}</> });
    const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]), history: createMemoryHistory({ initialEntries: ['/'] }) });
    return <RouterProvider router={router} />;
  };
}

export function Region({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-background h-[360px] w-[480px] overflow-hidden rounded-md', className)}>{children}</div>;
}
```

> **Note for implementer:** `StreamContext` and `ThreadContext` must be exported from their providers (they already are — `stories/chat.stories.tsx` imports both). If `createRouter` types complain about the inline `component`, mirror the exact router construction in the current chat story.

- [ ] **Step 2: Verify typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/storybook/decorators.tsx
git commit -m "test(terminus): add shared storybook provider decorators" # + trailers
```

---

## Phase B — Refactor existing 7 stories onto the shared module (co-located)

> For each: create the new co-located file, delete the old `stories/` file in the **same** commit. After each, run `pnpm typecheck`. After the last refactor task, run `pnpm build-storybook` once to confirm the moved set renders.

### Task 5: Chat story → `src/components/thread/thread.stories.tsx`

**Files:**
- Create: `src/components/thread/thread.stories.tsx`
- Delete: `stories/chat.stories.tsx`

This is the canonical `withChatProviders({ router: true, sidebar: true })` exemplar.

- [ ] **Step 1: Write the co-located story**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Thread } from './thread';
import { FIXTURE_MESSAGES } from '@/storybook/fixtures';
import { withChatProviders } from '@/storybook/decorators';

const meta = {
  component: Thread,
  parameters: { layout: 'fullscreen' },
  decorators: [withChatProviders({ messages: FIXTURE_MESSAGES, router: true, sidebar: true })],
} satisfies Meta<typeof Thread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

- [ ] **Step 2: Delete the old file**

```bash
git rm stories/chat.stories.tsx
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/thread/thread.stories.tsx
git commit -m "test(terminus): co-locate Thread story on shared chat providers" # + trailers
```

### Task 6: Topology 2D → `src/components/graph/graph-canvas.stories.tsx`

**Files:**
- Create: `src/components/graph/graph-canvas.stories.tsx`
- Delete: `stories/topology.stories.tsx`

Canonical `withTopologyProviders({ reactFlow: true })` exemplar.

- [ ] **Step 1: Write**

```tsx
import '@xyflow/react/dist/style.css';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { GraphCanvas } from './graph-canvas';
import { withTopologyProviders } from '@/storybook/decorators';

const meta = {
  component: GraphCanvas,
  parameters: { layout: 'fullscreen' },
  decorators: [
    withTopologyProviders({ reactFlow: true }),
    (Story) => (
      <div style={{ width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GraphCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

- [ ] **Step 2:** `git rm stories/topology.stories.tsx`
- [ ] **Step 3:** `pnpm typecheck` → PASS
- [ ] **Step 4: Commit** `test(terminus): co-locate Topology 2D story on shared providers`

### Task 7: Topology 3D → `src/components/graph/graph-canvas-3d.stories.tsx`

**Files:**
- Create: `src/components/graph/graph-canvas-3d.stories.tsx`
- Delete: `stories/topology-3d.stories.tsx`

Keep the existing 4 variants (Default/Dark/Light/Selected). The `forcedTheme` + `next-themes` wrapper and `selectedId` seeding are 3D-specific, so they stay inline in this story (not in the shared decorator). Use `withTopologyProviders({ seed })` for the Jotai/query layer and wrap the canvas in `ThemeProvider` per variant.

- [ ] **Step 1: Write** — port `stories/topology-3d.stories.tsx`, replacing its inline `createStores`/provider stack with `withTopologyProviders({ seed: (s) => selectedId && s.set(selectedNodeAtom, selectedId) })`; keep the `next-themes` `ThemeProvider forcedTheme=...` wrapper and the `selectedNodeAtom` import. Variants:
  - `Default: {}` · `Dark: { args: { forcedTheme: 'dark' } }` · `Light: { args: { forcedTheme: 'light' } }` · `Selected: { args: { forcedTheme: 'dark', selectedId: 'light.lr_led_strip' } }`
- [ ] **Step 2:** `git rm stories/topology-3d.stories.tsx`
- [ ] **Step 3:** `pnpm typecheck` → PASS
- [ ] **Step 4: Commit** `test(terminus): co-locate Topology 3D story on shared providers`

### Task 8: Filters → `src/components/graph/topology-filters.stories.tsx`

**Files:**
- Create: `src/components/graph/topology-filters.stories.tsx`
- Delete: `stories/topology-filters.stories.tsx`

- [ ] **Step 1: Write**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TopologyFilters } from './topology-filters';
import { availableDomainsAtom, nodeFilterAtom } from '@/lib/ha-graph/atoms';
import { withTopologyProviders } from '@/storybook/decorators';

const meta = {
  component: TopologyFilters,
  parameters: { layout: 'fullscreen' },
  decorators: [
    withTopologyProviders({
      seed: (store) => {
        store.set(availableDomainsAtom, ['light', 'switch', 'sensor']);
        store.set(nodeFilterAtom, { search: 'light', status: 'unavailable', domains: ['light', 'switch'] });
      },
    }),
    (Story) => (
      <div className="bg-background relative h-72 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopologyFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

- [ ] **Step 2:** `git rm stories/topology-filters.stories.tsx`
- [ ] **Step 3:** `pnpm typecheck` → PASS
- [ ] **Step 4: Commit** `test(terminus): co-locate Topology Filters story on shared providers`

### Task 9: Error/status stories → co-located (3 files)

**Files:**
- Create: `src/components/error-fallback.stories.tsx` (port of `stories/error-fallback.stories.tsx`)
- Create: `src/components/region-error-boundary.stories.tsx` (port of `stories/region-error-boundary.stories.tsx`)
- Create: `src/components/status-card.stories.tsx` (port of `stories/loading-screen.stories.tsx`)
- Delete: `stories/error-fallback.stories.tsx`, `stories/region-error-boundary.stories.tsx`, `stories/loading-screen.stories.tsx`

These need no provider mocking. Port each verbatim **except**: drop the local `Region` helper and import `Region` from `@/storybook/decorators`; remove any `title:` (auto-titled now). Keep all named exports/copy exactly. `status-card.stories.tsx` keeps the `Checking` and `Error` exports from the loading-screen story.

- [ ] **Step 1:** Write the three files (copy bodies from the originals; swap the `Region` import; delete `title:`).
- [ ] **Step 2:** `git rm` the three old files.
- [ ] **Step 3:** `pnpm typecheck` → PASS
- [ ] **Step 4:** `pnpm build-storybook` → completes without error (first full build of the moved set).
- [ ] **Step 5: Commit** `test(terminus): co-locate error-boundary and status-card stories`

---

## Phase C — Tier 1 stories (pure, no provider mocking)

> Each task = one `*.stories.tsx` next to the component, `pnpm typecheck`, commit. `layout: 'centered'` unless noted. Read the component first to confirm exact prop names. Use `Region` from `@/storybook/decorators` for components that fill their parent (`h-full`).

### Task 10: ErrorScreen — `src/components/error-screen.stories.tsx`
Props: `{ title?, message?, onRetry?, retryLabel? }`. `args: { onRetry: () => {} }` (don't reload the iframe). Wrap in `Region`.
States: `Default` (title+message), `TitleOnly` (`{ title: 'Something went wrong' }`), `CustomRetryLabel` (`{ retryLabel: 'Try again', message: '…' }`).
Commit: `test(terminus): add ErrorScreen story`

### Task 11: HaStatusIndicator — `src/components/thread/ha-status-indicator.stories.tsx`
No props; it reads `useHaStatus()`. **Read `src/hooks/use-ha-status.ts`** — it likely reads react-query / an atom. Drive state by seeding: prefer mocking the status source. If `useHaStatus` reads a react-query key, seed it via a small inline `QueryClientProvider`; if an atom, seed via `withTopologyProviders({ seed })` or a bare `JotaiProvider`. Implement a `renderWith(status)` helper local to the story.
States: `Connected`, `Connecting`, `Disconnected`, `Error` (the `HaConnectionStatus` union from the hook).
Commit: `test(terminus): add HaStatusIndicator story`

### Task 12: Disclaimer — `src/components/thread/disclaimer.stories.tsx`
Props: `{ className? }`. States: `Default`. Commit: `test(terminus): add Disclaimer story`

### Task 13: Thread rich-text trio — three files
- `src/components/thread/markdown-text.stories.tsx` — `MarkdownText` `{ children: string }`. States: `Default` (`children: SAMPLE_MARKDOWN`), `CodeHeavy` (a markdown string that is mostly a fenced code block).
- `src/components/thread/syntax-highlighter.stories.tsx` — `SyntaxHighlighter` `{ children, language, className? }`. States: `Python` (`language: 'python'`), `Tsx` (`language: 'tsx'`).
- `src/components/thread/context-chips.stories.tsx` — `ContextChips` `{ items, activeIds, onToggle }`. States: `Default` (`items: SAMPLE_CONTEXT_ITEMS`, `activeIds: new Set(['page:areas'])`, `onToggle: () => {}`), `AllActive`, `NoneActive`. (Returns `null` when `items` is empty — no empty story.)
Commit: `test(terminus): add MarkdownText, SyntaxHighlighter, ContextChips stories`

### Task 14: Multimodal previews — two files
- `src/components/thread/multimodal-preview.stories.tsx` — `MultimodalPreview` `{ block, removable?, onRemove?, size? }`. States: `Image` (`block: SAMPLE_IMAGE_BLOCK`), `File` (`block: SAMPLE_FILE_BLOCK`), `Removable` (`{ block: SAMPLE_IMAGE_BLOCK, removable: true, onRemove: () => {} }`).
- `src/components/thread/content-blocks-preview.stories.tsx` — `ContentBlocksPreview` `{ blocks, onRemove, size?, className? }`. States: `Mixed` (`blocks: [SAMPLE_IMAGE_BLOCK, SAMPLE_FILE_BLOCK]`, `onRemove: () => {}`).
Commit: `test(terminus): add multimodal preview stories`

### Task 15: Message sub-renderers — two files
- `src/components/thread/messages/tool-calls.stories.tsx` — exports `ToolCalls` `{ toolCalls }` and `ToolResult` `{ message }`. States: `Calls` (`toolCalls: SAMPLE_TOOL_CALLS`), `Result` (renders `<ToolResult message={SAMPLE_TOOL_MESSAGE} />` via a `render`).
- `src/components/thread/messages/generic-interrupt.stories.tsx` — `GenericInterruptView` `{ interrupt }`. States: `Object` (`interrupt: SAMPLE_INTERRUPT`), `Array` (`interrupt: [SAMPLE_INTERRUPT, SAMPLE_INTERRUPT]`).
> Note: `tool-calls`/`generic-interrupt` are pure (no `useStreamContext`); confirm while writing.
Commit: `test(terminus): add tool-calls and generic-interrupt stories`

### Task 16: Graph presentational pair — two files
- `src/components/graph/graph-controls.stories.tsx` — `GraphControls` `{ onFit, onZoomIn, onZoomOut, className? }`. `args` stub all three callbacks. States: `Default`.
- `src/components/graph/graph-3d-legend.stories.tsx` — `Graph3dLegend` `{ kinds: NodeKind[] }`. **Read `src/lib/ha-graph/build.ts`** for the `NodeKind` union. States: `AllKinds` (every kind), `EntitiesOnly`.
Commit: `test(terminus): add GraphControls and Graph3dLegend stories`

### Task 17: Agent-inbox pure parts — four files
- `src/components/thread/agent-inbox/components/tool-call-table.stories.tsx` — `ToolCallTable` `{ toolCall }`. **Read the file** for the `ToolCall` type; build a sample `toolCall` (reuse `SAMPLE_TOOL_CALLS[1]` shape if compatible). States: `Default`.
- `src/components/thread/agent-inbox/components/thread-id.stories.tsx` — exports `ThreadIdTooltip` `{ threadId }` and `ThreadIdCopyable` `{ threadId, showUUID? }`. States: `Copyable` (`threadId: 'thread-abc-123'`), `CopyableUUID` (`showUUID: true`).
- `src/components/thread/agent-inbox/components/inbox-item-input.stories.tsx` — `InboxItemInput`. **Read lines 252+** for its props; construct the minimal required props with stubbed callbacks. States: `Default`.
- `src/components/thread/agent-inbox/components/state-view.stories.tsx` — exports `StateView` `{ description, handleShowSidePanel, values, view }` and `StateViewObject`. **Read the `StateViewProps`/`StateViewComponentProps` types**; pass `values` derived from `SAMPLE_INTERRUPT`, stub `handleShowSidePanel`. States: `Default`.
Commit: `test(terminus): add agent-inbox pure-component stories`

> After Task 17: `pnpm build-storybook` → PASS (gate for Tier 1).

---

## Phase D — Tier 2 stories (mocked providers)

### Task 18: Message bubbles — two files
- `src/components/thread/messages/ai.stories.tsx` — `AssistantMessage`. **Read lines 87+** for props (it uses `useStreamContext` + `useArtifact`). Decorator: `withChatProviders({ messages: FIXTURE_MESSAGES })`. Pass the `msg-5` (AI final) and `msg-2` (tool-call) fixtures as the `message` prop. States: `Text`, `WithToolCalls`.
- `src/components/thread/messages/human.stories.tsx` — `HumanMessage` `{ message, isLoading }`. Decorator: `withChatProviders()`. State: `Default` (`message: FIXTURE_MESSAGES[0]`, `isLoading: false`).
Commit: `test(terminus): add AI/Human message stories`

### Task 19: Sidebar surfaces — three files
- `src/components/sidebar/app-sidebar.stories.tsx` — `AppSidebar`. Uses artifact + ha-status + new-thread + changelog hooks and atoms. Decorator: `withChatProviders({ threads: [...], sidebar: true, router: true })` (it lives in the sidebar shell and reads thread context). **Read the component** to see every hook; seed what's needed (it may also need react-query for `useChangelog`/`useHaStatus` — if so, compose a `QueryClientProvider` in a local decorator). State: `Default`.
- `src/components/sidebar/sidebar-session-list.stories.tsx` — `SidebarSessionList` `{ onSelect? }`. Needs `ThreadContext` (via `withChatProviders`) + router (`useThreadId`). States: `Populated` (`createMockThreads([...])` with a few threads), `Empty` (`threads: []`), `Loading` (set `threadsLoading: true` — extend `createMockThreads` inline or pass a custom value).
- `src/components/sidebar/settings-menu.stories.tsx` — `SettingsMenu`. Reads `fontSizeAtom`, `topology3dAtom`, `useHaStatus`, `useViewTools`. Decorator: bare `JotaiProvider` seeded + `QueryClientProvider` if `useHaStatus` needs it. State: `Default`.
> **Read each component for its exact hook set before wiring.** If a hook hits react-query, seed that query key or provide a fresh `QueryClient`; prefer extending the shared mocks over inlining if two stories need the same seed.
Commit: `test(terminus): add sidebar stories (app-sidebar, session-list, settings)`

### Task 20: Dialogs & modal — three files
- `src/components/whats-new/whats-new-dialog.stories.tsx` — `WhatsNewDialog`. Controlled by `whatsNewOpenAtom` + reads `useChangelog`/`useHaStatus`. Decorator: `JotaiProvider` with `whatsNewOpenAtom` seeded `true` + `QueryClientProvider` seeding the changelog query (**read `src/hooks/use-changelog.ts`** for the query key/shape; seed a small fake changelog). State: `Open`.
- `src/components/thread/rename-thread-dialog.stories.tsx` — `RenameThreadDialog`. **Read lines 14-24** for props (open/threadId/title/onOpenChange-style). Decorator: `withChatProviders()` (needs `useThreads`). State: `Open` (pass `open: true` + a `threadId`/`title`).
- `src/components/graph/entity-detail-modal.stories.tsx` — `EntityDetailModal`. Reads `entityModalAtom` + `useTopologyData`. Decorator: `withTopologyProviders({ seed: (s) => s.set(entityModalAtom, 'light.lr_led_strip') })` (**confirm `entityModalAtom` import path**). State: `Open`.
Commit: `test(terminus): add whats-new, rename-thread, entity-detail stories`

### Task 21: Agent-inbox stream views — two files
- `src/components/thread/agent-inbox/agent-inbox.stories.tsx` — `ThreadView` `{ interrupt }`. **Read lines 1-30** for `ThreadViewProps`. Decorator: `withChatProviders({ stream: createMockStream(FIXTURE_MESSAGES, { interrupt: SAMPLE_INTERRUPT }) })`. State: `Interrupted` (pass an `interrupt` prop shaped from `SAMPLE_INTERRUPT`).
- `src/components/thread/agent-inbox/components/thread-actions-view.stories.tsx` — `ThreadActionsView`. **Read lines 83-95** for props (uses `useStreamContext` + `useThreadId` + `useInterruptedActions`). Decorator: `withChatProviders({ router: true, stream: createMockStream(...) })`. State: `Default`.
> These exercise `useInterruptedActions` (stream-backed); if a story throws on a missing field, extend `createMockStream` opts rather than hand-rolling a one-off mock.
Commit: `test(terminus): add agent-inbox stream-view stories`

### Task 22: Artifact — `src/components/thread/artifact.stories.tsx`
`ArtifactContent`/`ArtifactTitle` read `useArtifactContext` (from `ArtifactProvider`). Decorator: `withChatProviders()` (provides `ArtifactProvider`). Because artifact content is normally injected by the LangGraph UI runtime, the realistic isolated story shows the **empty/host** state: render `<ArtifactTitle/>` + `<ArtifactContent/>` inside a sized `Region`. State: `Host` (empty artifact surface). If meaningful content can't render without the runtime, document that in a one-line comment in the story.
Commit: `test(terminus): add Artifact host story`

> After Task 22: `pnpm build-storybook` → PASS (gate for Tier 2).

---

## Phase E — Cleanup & final verification

### Task 23: Remove legacy glob + folder, full gate

**Files:**
- Modify: `.storybook/main.ts` (drop the two temporary `../stories` entries)
- Delete: `stories/` (should be empty of `.stories.tsx` now; remove the dir and any leftover `.mdx`)

- [ ] **Step 1:** Confirm nothing remains: `ls stories/` shows no `*.stories.tsx`. If any `.mdx` docs remain, move them under `src/` or delete per intent.
- [ ] **Step 2:** Remove the two `{ directory: '../stories', ... }` lines from `.storybook/main.ts`.
- [ ] **Step 3:** `git rm -r stories` (if empty) and remove leftovers.
- [ ] **Step 4: Full gate:**
  - `pnpm typecheck` → PASS
  - `pnpm lint` → PASS (fix any unused-import/format nits the new files introduce)
  - `pnpm test:run` → PASS (unit tests unaffected)
  - `pnpm build-storybook` → PASS (all ~33 stories compile)
- [ ] **Step 5: Commit** `chore(terminus): drop legacy stories/ folder and glob`

### Task 24: Finish the branch

- [ ] Invoke `superpowers:finishing-a-development-branch` to choose merge/PR. Per repo policy (`CLAUDE.md`): **squash merge to `main`**, and **do not** delete the branch/worktree without explicit user approval.

---

## Self-review

**Spec coverage:**
- Goal 0 (config) → Task 1 (+ Task 23 cleanup). ✓
- Goal 1 (move 7) → Tasks 5–9 (chat, 2D, 3D, filters, error-fallback, region-error-boundary, status-card = 7 stories). ✓
- Goal 2 (shared fixtures) → Task 2. ✓
- Goal 3 (shared providers) → Tasks 3 (mocks) + 4 (decorators). ✓
- Goal 4 Tier 1 (16) → Tasks 10–17: ErrorScreen, HaStatusIndicator, Disclaimer, MarkdownText, SyntaxHighlighter, ContextChips, MultimodalPreview, ContentBlocksPreview, ToolCalls, GenericInterrupt, GraphControls, Graph3dLegend, ToolCallTable, ThreadId, InboxItemInput, StateView = 16. ✓
- Goal 4 Tier 2 (11) → Tasks 18–22: AI, Human, AppSidebar, SidebarSessionList, SettingsMenu, WhatsNewDialog, RenameThreadDialog, EntityDetailModal, AgentInbox(ThreadView), ThreadActionsView, Artifact = 11. ✓

**Type consistency:** Decorator/mocks names align across tasks — `createTopologyStores` (Task 3 → used in Task 4, 7, 8, 20), `createMockStream`/`createMockThreads` (Task 3 → Task 4, 18, 21), `withTopologyProviders`/`withChatProviders`/`Region` (Task 4 → all consuming tasks), fixtures `FIXTURE_*`/`SAMPLE_*` (Task 2 → consumers). ✓

**Placeholder scan:** Story tasks that depend on prop shapes I could not fully capture (HaStatusIndicator status source, InboxItemInput, StateView, ThreadView, ThreadActionsView, RenameThreadDialog props, NodeKind/ToolCall/ContentBlock shapes, changelog query key) carry an explicit **"Read the component/hook"** instruction plus the exact decorator + states to produce — concrete direction, not deferred decisions. This is intentional given the subagent-driven execution model; each is self-contained.
