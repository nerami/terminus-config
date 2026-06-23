import { queryOptions, useQuery } from '@tanstack/react-query';

import { http } from '@/lib/http';
import { endpoints } from '@/runtime-config';

export type HaConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'auth_failed';

export type HaStatus = {
  status: HaConnectionStatus;
  ha_version: string | null;
  last_connected: string | null;
  error: string | null;
  url?: string;
};

const INITIAL: HaStatus = {
  status: 'connecting',
  ha_version: null,
  last_connected: null,
  error: null,
};

/**
 * Shared query options for the backend `/ha/status` endpoint. Reused by
 * {@link useHaStatus} (polling indicator) and the first-paint status gate so a
 * single cache entry serves both. `retry: false` so a failed poll surfaces as
 * `disconnected` immediately rather than after backoff.
 */
export function haStatusQueryOptions(intervalMs?: number) {
  return queryOptions({
    queryKey: ['ha', 'status'] as const,
    queryFn: async () => (await http.get<HaStatus>(endpoints().haStatusUrl)).data,
    retry: false,
    refetchInterval: intervalMs,
  });
}

/** Polls the backend `/ha/status` endpoint and returns the latest status. */
export function useHaStatus(intervalMs = 5000): HaStatus {
  const query = useQuery(haStatusQueryOptions(intervalMs));

  if (query.isError) {
    return {
      ...(query.data ?? INITIAL),
      status: 'disconnected',
      error: query.error instanceof Error ? query.error.message : String(query.error),
    };
  }

  return query.data ?? INITIAL;
}
