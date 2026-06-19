import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Message } from '@langchain/langgraph-sdk';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';

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

// Thread calls useThreadId() → useParams() → TanStack Router context required.
// Solution: render Thread as a route component so RouterProvider provides context.
function ThreadWithProviders() {
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

const _rootRoute = createRootRoute({ component: () => <Outlet /> });
const _indexRoute = createRoute({
  getParentRoute: () => _rootRoute,
  path: '/',
  component: ThreadWithProviders,
});
const storyRouter = createRouter({
  routeTree: _rootRoute.addChildren([_indexRoute]),
  history: createMemoryHistory({ initialEntries: ['/'] }),
});

function ChatStory() {
  return <RouterProvider router={storyRouter} />;
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
