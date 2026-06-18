import "@xyflow/react/dist/style.css";

import { ReactFlowProvider } from "@xyflow/react";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderCircle, RefreshCw, XIcon } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useTopology } from "@/hooks/use-topology";
import {
  graphPanelOpenAtom,
  graphViewAtom,
  topologyAtom,
} from "@/lib/ha-graph/atoms";
import { Breadcrumbs } from "./Breadcrumbs";
import { EntityDetailModal } from "./EntityDetailModal";
import { GraphCanvas } from "./GraphCanvas";

export function GraphPanel() {
  const setOpen = useSetAtom(graphPanelOpenAtom);
  const setView = useSetAtom(graphViewAtom);
  const topology = useAtomValue(topologyAtom);
  const { loading, error, reload } = useTopology(true);

  // Opening the panel always starts at the areas overview (requirement 2).
  useEffect(() => {
    setView({ kind: "areas" });
  }, [setView]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight">
            Home Topology
          </div>
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={reload}
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            title="Close"
          >
            <XIcon className="size-5" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1">
        {loading && !topology && (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center gap-2 text-sm">
            <LoaderCircle className="size-5 animate-spin" /> Loading topology…
          </div>
        )}
        {error && !topology && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={reload}
            >
              Retry
            </Button>
          </div>
        )}
        {topology && (
          <ReactFlowProvider>
            <GraphCanvas />
            <EntityDetailModal />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
