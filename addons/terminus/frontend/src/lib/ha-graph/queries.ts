import { queryOptions } from '@tanstack/react-query';

import { fetchTopology } from '@/lib/ha-graph/api';

/**
 * Shared options for the HA topology snapshot — the single source of truth.
 * The diagram panel fetches it (`useTopology`); every other component reads the
 * same cache passively (`useTopologyData`). Define the key/fetcher once here so
 * all readers stay in sync.
 */
export function topologyQueryOptions() {
  return queryOptions({ queryKey: ['ha', 'topology'], queryFn: fetchTopology });
}
