import { createContext, useContext, ReactNode, useCallback, useState, Dispatch, SetStateAction } from 'react';

import { Thread } from '@langchain/langgraph-sdk';
import { useQueryState } from 'nuqs';
import { validate } from 'uuid';

import { createClient } from './client';

import { getApiKey } from '@/lib/api-key';
import { ARCHIVE_METADATA, filterActiveThreads } from '@/lib/thread-archive';
import { postThreadTitle } from '@/lib/title-api';
import { endpoints, ASSISTANT_ID } from '@/runtime-config';

interface ThreadContextType {
  archiveThread: (threadId: string) => Promise<void>;
  generateThreadTitle: (threadId: string, message: string) => Promise<void>;
  getThreads: () => Promise<Thread[]>;
  setThreads: Dispatch<SetStateAction<Thread[]>>;
  setThreadsLoading: Dispatch<SetStateAction<boolean>>;
  threads: Thread[];
  threadsLoading: boolean;
  updateThreadTitle: (threadId: string, title: string) => Promise<void>;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);
export { ThreadContext };

function getThreadSearchMetadata(assistantId: string): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const envApiUrl: string | undefined = endpoints().apiUrl;
  const envAssistantId: string | undefined = ASSISTANT_ID;
  const envAuthScheme: string | undefined = undefined;

  const [apiUrl] = useQueryState('apiUrl', {
    defaultValue: envApiUrl || '',
  });
  const [assistantId] = useQueryState('assistantId');
  const [authScheme] = useQueryState('authScheme', {
    defaultValue: envAuthScheme || '',
  });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    const resolvedAssistantId = assistantId || envAssistantId;
    if (!apiUrl || !resolvedAssistantId) return [];
    const client = createClient(apiUrl, getApiKey() ?? undefined, authScheme || undefined);

    const threads = await client.threads.search({
      metadata: {
        ...getThreadSearchMetadata(resolvedAssistantId),
      },
      limit: 100,
    });

    // Archived conversations are kept server-side but hidden from the list.
    return filterActiveThreads(threads);
  }, [apiUrl, assistantId, authScheme, envAssistantId]);

  const archiveThread = useCallback(
    async (threadId: string): Promise<void> => {
      if (!apiUrl) return;
      const client = createClient(apiUrl, getApiKey() ?? undefined, authScheme || undefined);
      await client.threads.update(threadId, { metadata: ARCHIVE_METADATA });
      // Optimistically drop it from the visible list.
      setThreads((prev) => prev.filter((t) => t.thread_id !== threadId));
    },
    [apiUrl, authScheme],
  );

  // Persist a title to the thread's metadata (LangGraph merges metadata, so this
  // coexists with the archive flag and the assistant/graph id). Used by both the
  // manual rename flow and the auto-generated title below.
  const updateThreadTitle = useCallback(
    async (threadId: string, title: string): Promise<void> => {
      if (!apiUrl) return;
      const client = createClient(apiUrl, getApiKey() ?? undefined, authScheme || undefined);
      await client.threads.update(threadId, { metadata: { title } });
      setThreads((prev) =>
        prev.map((t) => (t.thread_id === threadId ? { ...t, metadata: { ...t.metadata, title } } : t)),
      );
    },
    [apiUrl, authScheme],
  );

  // Ask the backend to summarise the first user message into a short title, then
  // persist it. Best-effort: failures leave the thread with its derived label.
  const generateThreadTitle = useCallback(
    async (threadId: string, message: string): Promise<void> => {
      if (!apiUrl || !message.trim()) return;
      const title = await postThreadTitle(apiUrl, message);
      if (title) await updateThreadTitle(threadId, title);
    },
    [apiUrl, updateThreadTitle],
  );

  const value = {
    getThreads,
    archiveThread,
    updateThreadTitle,
    generateThreadTitle,
    threads,
    setThreads,
    threadsLoading,
    setThreadsLoading,
  };

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>;
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error('useThreads must be used within a ThreadProvider');
  }
  return context;
}
