import { QueryClient } from '@tanstack/react-query';
import { createStore } from 'jotai';

import { FIXTURE_MESSAGES, FIXTURE_TOPOLOGY } from './fixtures';

import type { Topology } from '@/lib/ha-graph/types';
import type { Message } from '@langchain/langgraph-sdk';

import { topologyQueryOptions } from '@/lib/ha-graph/queries';
import { useStreamContext } from '@/providers/stream';
import { ThreadContext } from '@/providers/thread';

type StreamContextType = ReturnType<typeof useStreamContext>;
type ThreadValue = React.ContextType<typeof ThreadContext>;

// Fresh Jotai store + react-query client seeded with topology. `seed` lets a
// story set extra atoms (selected node, filters, available domains, entity
// modal) without each story re-deriving the provider stack.
export function createTopologyStores(
  opts: { topology?: Topology; seed?: (store: ReturnType<typeof createStore>) => void } = {},
) {
  const store = createStore();
  opts.seed?.(store);
  const queryClient = new QueryClient();
  queryClient.setQueryData(topologyQueryOptions().queryKey, opts.topology ?? FIXTURE_TOPOLOGY);
  return { queryClient, store };
}

// Static stream: messages, not loading, no error. Cast because StreamContextType
// includes many internal SDK fields the stories never touch.
export function createMockStream(
  messages: Message[] = FIXTURE_MESSAGES,
  opts: { isLoading?: boolean; error?: unknown; interrupt?: unknown } = {},
): StreamContextType {
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

export function createMockThreads(threads: NonNullable<ThreadValue>['threads'] = []): ThreadValue {
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
