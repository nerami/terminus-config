import { useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

import type { AutomationDetail } from '@/lib/ha-graph/types';

import { fetchAutomation, fetchTopology } from '@/lib/ha-graph/api';
import { topologyAtom } from '@/lib/ha-graph/atoms';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export interface UseTopology {
  error: string | null;
  loading: boolean;
  reload: () => void;
}

/**
 * Loads the topology snapshot once `enabled` becomes true (i.e. when the
 * diagram panel opens) and mirrors it into `topologyAtom` so the many atom
 * readers (graph panel, controls, detail modal, context chips) keep working.
 * react-query owns the fetch/cache; the atom is a read-through projection.
 */
export function useTopology(enabled: boolean): UseTopology {
  const setTopology = useSetAtom(topologyAtom);
  const query = useQuery({ queryKey: ['ha', 'topology'], queryFn: fetchTopology, enabled });

  // Project the cache into the atom. Never write null — keep the last good
  // snapshot on error, matching the previous hook.
  useEffect(() => {
    if (query.data) setTopology(query.data);
  }, [query.data, setTopology]);

  return {
    loading: query.isFetching,
    error: query.isError ? errorMessage(query.error) : null,
    reload: () => void query.refetch(),
  };
}

/**
 * Loads one automation's config detail (for the trace view). If the automation
 * has no numeric config id, or the config fetch fails, it falls back to the
 * references already present in the topology so the view still renders.
 */
export function useAutomationDetail(automationId: string | null) {
  const topology = useAtomValue(topologyAtom);
  const meta = automationId ? topology?.automations.find((a) => a.entity_id === automationId) : undefined;

  const query = useQuery({
    queryKey: ['ha', 'automation', meta?.numeric_id ?? null, meta?.entity_id ?? null],
    queryFn: () => fetchAutomation(meta!.numeric_id!, meta!.entity_id),
    enabled: !!automationId && !!meta?.numeric_id,
  });

  const detail = useMemo<AutomationDetail | null>(() => {
    if (!automationId) return null;
    const fallback: AutomationDetail = {
      config: {},
      referenced: meta?.references ?? { entities: [], scenes: [], devices: [] },
    };
    if (!meta?.numeric_id) return fallback;
    if (query.isError) return fallback;
    if (!query.data) return null; // fetch in flight — no detail yet
    const d = query.data;
    // When HA can't return the editable config, fall back to the relationship
    // references already known from the topology so the trace view still
    // renders the automation's entities/scenes.
    const hasConfig = !!d.config && Object.keys(d.config).length > 0;
    const hasRefs = d.referenced.entities.length > 0 || d.referenced.scenes.length > 0;
    const referenced = hasConfig || hasRefs ? d.referenced : (meta.references ?? d.referenced);
    return { ...d, referenced };
  }, [automationId, meta, query.data, query.isError]);

  return {
    detail,
    loading: query.isFetching,
    error: query.isError ? errorMessage(query.error) : null,
  };
}
