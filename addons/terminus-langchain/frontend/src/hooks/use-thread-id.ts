import { useCallback } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';

/**
 * Reads/writes the current chat session id from the URL path.
 *
 * A drop-in replacement for the old `useQueryState("threadId")`: it returns the
 * same `[value, setter]` shape. The id lives in the path (`<dir>/<threadId>`);
 * `null` means the main "new chat" page (`<dir>/`). Navigating preserves the
 * existing query string (apiUrl, topology params, etc.) so toggling sessions
 * doesn't drop other URL state.
 */
export function useThreadId(): [string | null, (id: string | null) => void] {
  // strict:false so this works on both the index ("/") and "/$threadId" routes.
  const params = useParams({ strict: false }) as { threadId?: string };
  const threadId = params.threadId ?? null;
  const navigate = useNavigate();

  const setThreadId = useCallback(
    (id: string | null) => {
      if (id) {
        navigate({
          to: '/$threadId',
          params: { threadId: id },
          search: (prev) => prev,
        });
      } else {
        navigate({ to: '/', search: (prev) => prev });
      }
    },
    [navigate],
  );

  return [threadId, setThreadId];
}
