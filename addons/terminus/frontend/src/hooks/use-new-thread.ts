import { useCallback } from 'react';

import { useArtifactContext, useArtifactOpen } from '@/components/thread/artifact';
import { useThreadId } from '@/hooks/use-thread-id';

/**
 * Returns a callback that starts a fresh chat session: clears the thread id
 * (navigating to the "new chat" page), closes any open artifact, and resets the
 * artifact context. Shared by the sidebar and the chat top bar so both entry
 * points behave identically.
 */
export function useNewThread(): () => void {
  const [, setThreadId] = useThreadId();
  const [, closeArtifact] = useArtifactOpen();
  const [, setArtifactContext] = useArtifactContext();

  return useCallback(() => {
    setThreadId(null);
    closeArtifact();
    setArtifactContext({});
  }, [setThreadId, closeArtifact, setArtifactContext]);
}
