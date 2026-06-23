import { useQuery, useQueryClient } from '@tanstack/react-query';

import { http } from '@/lib/http';

export type ReadyStatus = 'checking' | 'ready' | 'error';

const MAX_ATTEMPTS = 40; // ~80s of polling before giving up
const INTERVAL_MS = 2000;

// GET {apiUrl}/info to check whether the LangGraph server is up yet. Returns
// true on a 2xx response, false otherwise — never throws, so each poll resolves
// and advances the query's dataUpdateCount (our attempt counter). Auth headers
// are passed explicitly (they also flow through the http interceptor).
export async function checkGraphStatus(apiUrl: string, apiKey: string | null, authScheme?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers['X-Api-Key'] = apiKey;
    if (authScheme) headers['X-Auth-Scheme'] = authScheme;
    const res = await http.get(`${apiUrl}/info`, { headers });
    return res.status >= 200 && res.status < 300;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// One poll's outcome plus the running attempt count. The count lives in the
// query data (not react-query's internal dataUpdateCount, which isn't on the
// hook result) so each poll yields a fresh object — that re-renders consumers
// and lets the status flip to `error` once the cap is hit.
type InfoProbe = { ready: boolean; attempts: number };

// Pure mapping from the readiness query's data to the UI status. `ready` wins
// as soon as a poll succeeds; `error` only after `max` failed polls.
export function mapGraphReadyStatus(ready: boolean | undefined, attempts: number, max = MAX_ATTEMPTS): ReadyStatus {
  if (ready === true) return 'ready';
  if (attempts >= max) return 'error';
  return 'checking';
}

// Polls the LangGraph server until it answers, so the UI can show a "warming
// up" state right after an add-on update/restart instead of a one-shot error.
// react-query drives the poll via refetchInterval (stops on ready or at the
// attempt cap); `retry` resets the query for a fresh round.
export function useGraphReady(
  apiUrl: string,
  apiKey: string | null,
  authScheme?: string,
): { status: ReadyStatus; retry: () => void } {
  const queryClient = useQueryClient();
  const queryKey = ['graph', 'info', apiUrl, apiKey || null, authScheme || null];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<InfoProbe> => {
      const prev = queryClient.getQueryData<InfoProbe>(queryKey);
      const ready = await checkGraphStatus(apiUrl, apiKey, authScheme);
      return { ready, attempts: (prev?.attempts ?? 0) + 1 };
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (q) => {
      const data = q.state.data;
      if (data?.ready) return false;
      if ((data?.attempts ?? 0) >= MAX_ATTEMPTS) return false;
      return INTERVAL_MS;
    },
  });

  return {
    status: mapGraphReadyStatus(query.data?.ready, query.data?.attempts ?? 0),
    retry: () => void queryClient.resetQueries({ queryKey }),
  };
}
