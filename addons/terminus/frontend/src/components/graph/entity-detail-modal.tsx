import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { LoaderCircle } from 'lucide-react';

import type { EntityState } from '@/lib/ha-graph/types';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTopologyData } from '@/hooks/use-topology';
import { fetchEntity } from '@/lib/ha-graph/api';
import { entityModalAtom } from '@/lib/ha-graph/atoms';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-words">{value}</span>
    </div>
  );
}

export function EntityDetailModal() {
  const [entityId, setEntityId] = useAtom(entityModalAtom);
  const topology = useTopologyData();
  const [state, setState] = useState<EntityState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const meta = topology?.entities.find((e) => e.entity_id === entityId);

  useEffect(() => {
    if (!entityId) return;
    setState(null);
    setError(null);
    setLoading(true);
    let active = true;
    fetchEntity(entityId)
      .then((s) => active && setState(s))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [entityId]);

  const open = entityId != null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setEntityId(null)}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="break-words">{meta?.name ?? entityId}</DialogTitle>
          <DialogDescription className="font-mono text-xs">{entityId}</DialogDescription>
        </DialogHeader>

        <div className="divide-y">
          {meta?.domain && <Row label="Domain" value={<Badge variant="secondary">{meta.domain}</Badge>} />}
          {meta?.device_name && <Row label="Device" value={meta.device_name} />}

          {loading && (
            <div className="text-muted-foreground flex items-center gap-2 py-3 text-sm">
              <LoaderCircle className="size-4 animate-spin" /> Loading state…
            </div>
          )}
          {error && <div className="text-destructive py-3 text-sm">{error}</div>}

          {state && (
            <>
              <Row label="State" value={<span className="font-medium">{state.state}</span>} />
              {state.last_changed && <Row label="Last changed" value={new Date(state.last_changed).toLocaleString()} />}
              <div className="py-2">
                <div className="text-muted-foreground mb-1 text-sm">Attributes</div>
                <pre className="bg-muted max-h-64 overflow-auto rounded-md p-3 text-xs">
                  {JSON.stringify(state.attributes, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
