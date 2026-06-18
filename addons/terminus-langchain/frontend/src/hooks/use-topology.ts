import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { fetchAutomation, fetchTopology } from "@/lib/ha-graph/api";
import { topologyAtom } from "@/lib/ha-graph/atoms";
import type { AutomationDetail } from "@/lib/ha-graph/types";

export interface UseTopology {
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads the topology snapshot into `topologyAtom` once `enabled` becomes true
 * (i.e. when the diagram panel opens). Re-fetches only on explicit `reload`.
 */
export function useTopology(enabled: boolean): UseTopology {
  const [topology, setTopology] = useAtom(topologyAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTopology()
      .then(setTopology)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, [setTopology]);

  useEffect(() => {
    if (enabled && !topology && !loading && !error) load();
  }, [enabled, topology, loading, error, load]);

  return { loading, error, reload: load };
}

/**
 * Loads one automation's config detail (for the trace view). If the automation
 * has no numeric config id, or the config fetch fails, it falls back to the
 * references already present in the topology so the view still renders.
 */
export function useAutomationDetail(automationId: string | null) {
  const topology = useAtomValue(topologyAtom);
  const [detail, setDetail] = useState<AutomationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!automationId) {
      setDetail(null);
      return;
    }
    const meta = topology?.automations.find(
      (a) => a.entity_id === automationId,
    );
    const fallback: AutomationDetail = {
      config: {},
      referenced: meta?.references ?? { entities: [], scenes: [], devices: [] },
    };

    setDetail(null);
    setError(null);

    if (!meta?.numeric_id) {
      setDetail(fallback);
      return;
    }

    let active = true;
    setLoading(true);
    fetchAutomation(meta.numeric_id, meta.entity_id)
      .then((d) => {
        if (!active) return;
        // When HA can't return the editable config, fall back to the
        // relationship references already known from the topology so the
        // trace view still renders the automation's entities/scenes.
        const hasConfig = !!d.config && Object.keys(d.config).length > 0;
        const hasRefs =
          d.referenced.entities.length > 0 || d.referenced.scenes.length > 0;
        const referenced =
          hasConfig || hasRefs ? d.referenced : (meta.references ?? d.referenced);
        setDetail({ ...d, referenced });
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : String(e));
        setDetail(fallback);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [automationId, topology]);

  return { detail, loading, error };
}
