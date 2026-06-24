import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import { createMockStream, createMockThreads, createTopologyStores } from './mocks';

import type { Topology } from '@/lib/ha-graph/types';
import type { Message } from '@langchain/langgraph-sdk';
import type { Decorator } from '@storybook/react-vite';

import { ArtifactProvider } from '@/components/thread/artifact';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { StreamContext } from '@/providers/stream';
import { ThreadContext } from '@/providers/thread';

// Seeded Jotai store + react-query topology cache + Nuqs (+ optional ReactFlow).
// Inner providers deliberately shadow the global preview ones so each story gets
// a fresh seeded store.
export function withTopologyProviders(
  opts: { topology?: Topology; seed?: (store: ReturnType<typeof createStore>) => void; reactFlow?: boolean } = {},
): Decorator {
  return function TopologyDecorator(Story) {
    const [{ queryClient, store }] = React.useState(() =>
      createTopologyStores({ topology: opts.topology, seed: opts.seed }),
    );
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

// Fresh QueryClient pre-seeded by the optional `seed` callback. Wraps the story
// in a QueryClientProvider so hooks using useQuery work without network calls.
export function withQueryClient(seed?: (qc: QueryClient) => void): Decorator {
  return function QueryClientDecorator(Story) {
    const [qc] = React.useState(() => {
      const c = new QueryClient();
      seed?.(c);
      return c;
    });
    return (
      <QueryClientProvider client={qc}>
        <Story />
      </QueryClientProvider>
    );
  };
}

// Stream + Thread + Artifact context (+ optional Sidebar shell and memory Router).
// Router is needed only by the full <Thread/> (useThreadId → useParams); message
// bubbles and inbox views need just Stream/Artifact, so it defaults off.
export function withChatProviders(
  opts: {
    messages?: Message[];
    threads?: Parameters<typeof createMockThreads>[0];
    stream?: ReturnType<typeof createMockStream>;
    router?: boolean;
    sidebar?: boolean;
  } = {},
): Decorator {
  return function ChatDecorator(Story) {
    const [stream] = React.useState(() => opts.stream ?? createMockStream(opts.messages));
    const [threads] = React.useState(() => createMockThreads(opts.threads));

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
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ['/'] }),
    });
    return <RouterProvider router={router} />;
  };
}

export function Region({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-background h-[360px] w-[480px] overflow-hidden rounded-md', className)}>{children}</div>
  );
}
