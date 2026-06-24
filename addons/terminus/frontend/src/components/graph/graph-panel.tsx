import { Suspense, lazy } from 'react';

import { useAtomValue } from 'jotai';
import { BotMessageSquare, LoaderCircle, RefreshCw, XIcon } from 'lucide-react';

import { CanvasSpinner } from './canvas-overlays';
import { EntityDetailModal } from './entity-detail-modal';
import { TopologyFilters } from './topology-filters';

import { RegionErrorBoundary } from '@/components/error-fallback';
import { TooltipIconButton } from '@/components/thread/tooltip-icon-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTopology } from '@/hooks/use-topology';
import { usePanelLayout } from '@/lib/ha-graph/use-panel-layout';
import { topology3dAtom } from '@/lib/settings';

// Each renderer is its own lazy chunk so neither react-flow nor reagraph/three.js
// loads unless its mode is active (req 6).
const Topology2D = lazy(() => import('./topology-2d').then((m) => ({ default: m.Topology2D })));
const Topology3D = lazy(() => import('./topology-3d').then((m) => ({ default: m.Topology3D })));

export function GraphPanel() {
  const { closeTopology, exitFullscreen, layout } = usePanelLayout();
  const fullscreen = layout === 'topology';
  const topology3d = useAtomValue(topology3dAtom);
  const isMobile = useIsMobile();
  const { data: topology, error, loading, reload } = useTopology(true);

  // The current view is owned by the URL (see useGraphView): a fresh toolbar
  // open resets it to the areas overview, while a deep-link/back restore keeps
  // whatever view the URL encodes — so the panel must NOT force a view here.

  // The chat is hidden whenever the diagram is full screen, and always on small
  // screens (which never show the split view). In that case offer "Open chat".
  const chatHidden = fullscreen || isMobile;
  const openChat = () => {
    // Small screens never show the split: "open chat" closes the topology
    // entirely; on desktop it drops back to the side-by-side split.
    if (isMobile) closeTopology();
    else exitFullscreen();
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <div className="flex min-w-0 items-center gap-2">
          {chatHidden && (
            <>
              <TooltipIconButton tooltip="Open chat" onClick={openChat}>
                <BotMessageSquare />
              </TooltipIconButton>
              <Separator orientation="vertical" />
            </>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">Home Topology</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipIconButton tooltip="Refresh" onClick={reload} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : undefined} />
          </TooltipIconButton>
          {/* With the chat hidden, "Close topology" would strand the user on an
              empty layout — leave the panel via "Open chat" instead. */}
          {!chatHidden && (
            <TooltipIconButton tooltip="Close topology" onClick={closeTopology}>
              <XIcon />
            </TooltipIconButton>
          )}
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
            <Button variant="outline" size="sm" onClick={reload}>
              Retry
            </Button>
          </div>
        )}
        {topology && (
          <>
            {topology3d ? (
              <RegionErrorBoundary
                title="3D topology failed to render"
                message="The 3D view hit an error. Reloading should recover it."
              >
                <Suspense fallback={<CanvasSpinner />}>
                  <Topology3D />
                </Suspense>
              </RegionErrorBoundary>
            ) : (
              <RegionErrorBoundary
                title="Topology failed to render"
                message="The diagram hit an error. Reloading should recover it."
              >
                <Suspense fallback={<CanvasSpinner />}>
                  <Topology2D />
                </Suspense>
              </RegionErrorBoundary>
            )}
            <TopologyFilters />
            <EntityDetailModal />
          </>
        )}
      </div>
    </div>
  );
}
