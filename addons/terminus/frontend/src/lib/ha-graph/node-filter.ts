import type { Availability, GraphNodeData, RFNode } from './build';

export type StatusFilter = Availability | 'all';

export interface NodeFilter {
  domains: string[];
  search: string;
  status: StatusFilter;
}

/** Neutral filter — no dimension is active. */
export const EMPTY_FILTER: NodeFilter = { search: '', status: 'all', domains: [] };

/** True when any filter dimension is narrowing the set. */
export function isFilterActive(f: NodeFilter): boolean {
  return f.search.trim() !== '' || f.status !== 'all' || f.domains.length > 0;
}

/** Does one node's data satisfy ALL active filter dimensions? */
export function nodeMatchesFilter(data: GraphNodeData, f: NodeFilter): boolean {
  // Search: case-insensitive substring across label, entityId, domain.
  // An empty/whitespace query always passes.
  const query = f.search.trim().toLowerCase();
  if (query !== '') {
    const haystack = [data.label, data.entityId, data.domain]
      .filter((s): s is string => s !== undefined)
      .join('\0')
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  // Status: missing availability defaults to 'ok'.
  if (f.status !== 'all') {
    const av: Availability = data.availability ?? 'ok';
    if (av !== f.status) return false;
  }

  // Domain: empty list passes; otherwise the node must have a domain in the set.
  if (f.domains.length > 0) {
    if (!data.domain || !f.domains.includes(data.domain)) return false;
  }

  return true;
}

/** Distinct, sorted domains present across the given nodes (for the multi-select). */
export function domainsOf(nodes: RFNode[]): string[] {
  const seen = new Set<string>();
  for (const n of nodes) {
    if (n.data.domain) seen.add(n.data.domain);
  }
  return [...seen].sort();
}
