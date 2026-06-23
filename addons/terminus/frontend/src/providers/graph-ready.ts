import { useEffect, useState } from 'react';

import { http } from '@/lib/http';

export type ReadyStatus = 'checking' | 'ready' | 'error';

const MAX_ATTEMPTS = 40; // ~80s of polling before giving up
const INTERVAL_MS = 2000;

// GET {apiUrl}/info to check whether the LangGraph server is up yet. Returns
// true on a 2xx response, false otherwise — never throws. Auth headers are
// passed explicitly (they also flow through the http interceptor).
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

/**
 * Polls the LangGraph server until it answers, so the readiness gate can show a
 * "warming up" state right after an add-on update/restart instead of a one-shot
 * error. This is the app's environment-readiness probe — deliberately NOT on
 * react-query: it's a one-shot boot gate, not cached/reused data (see the gate
 * note in addons/terminus/CLAUDE.md). `retry` starts a fresh round.
 */
export function useGraphReadyPoll(
  apiUrl: string,
  apiKey: string | null,
  authScheme?: string,
  opts: { intervalMs?: number; maxAttempts?: number } = {},
): { retry: () => void; status: ReadyStatus } {
  const { intervalMs = INTERVAL_MS, maxAttempts = MAX_ATTEMPTS } = opts;
  const [status, setStatus] = useState<ReadyStatus>('checking');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    setStatus('checking');
    const tick = async () => {
      const ok = await checkGraphStatus(apiUrl, apiKey, authScheme);
      if (cancelled) return;
      if (ok) {
        setStatus('ready');
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        setStatus('error');
        return;
      }
      timer = setTimeout(tick, intervalMs);
    };
    void tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [apiUrl, apiKey, authScheme, intervalMs, maxAttempts, reloadKey]);

  return { retry: () => setReloadKey((k) => k + 1), status };
}
