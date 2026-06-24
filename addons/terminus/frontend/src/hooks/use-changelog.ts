import { queryOptions, useQuery } from '@tanstack/react-query';

import { http } from '@/lib/http';
import { endpoints } from '@/runtime-config';

/** The running add-on version's changelog section, or null when there's none to show. */
export type Changelog = { version: string; markdown: string } | null;

/**
 * Shared query options for the backend `/changelog` endpoint. The content only
 * changes when a new build ships (it's baked into the image), so it never goes
 * stale within a session — fetch once and reuse.
 */
export function changelogQueryOptions() {
  return queryOptions({
    queryKey: ['changelog'] as const,
    queryFn: async () => (await http.get<Changelog>(endpoints().changelogUrl)).data,
    staleTime: Infinity,
    retry: false,
  });
}

/** Fetches the running version's changelog entry (null when absent). */
export function useChangelog() {
  return useQuery(changelogQueryOptions());
}
