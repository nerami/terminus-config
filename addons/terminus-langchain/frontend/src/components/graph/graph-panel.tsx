import '@xyflow/react/dist/style.css';

import { ReactFlowProvider } from '@xyflow/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { BotMessageSquare, LoaderCircle, RefreshCw, XIcon } from 'lucide-react';

import { EntityDetailModal } from './entity-detail-modal';
import { GraphCanvas } from './graph-canvas';

import { TooltipIconButton } from '@/components/thread/tooltip-icon-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTopology } from '@/hooks/use-topology';
import { graphFullscreenAtom, graphPanelOpenAtom, topologyAtom } from '@/lib/ha-graph/atoms';

export function GraphPanel() {
  const setOpen = useSetAtom(graphPanelOpenAtom);
  const [fullscreen, setFullscreen] = useAtom(graphFullscreenAtom);
  const topology = useAtomValue(topologyAtom);
  const isMobile = useIsMobile();
  const { error, loading, reload } = useTopology(true);

  // The current view is owned by the URL (see TopologyUrlSync): a fresh toolbar
  // open resets it to the areas overview, while a deep-link/back restore keeps
  // whatever view the URL encodes — so the panel must NOT force a view here.

  // The chat is hidden whenever the diagram is full screen, and always on small
  // screens (which never show the split view). In that case offer "Open chat".
  const chatHidden = fullscreen || isMobile;
  const openChat = () => {
    if (isMobile) {
      // No split view on small screens: go back to the chat.
      setFullscreen(false);
      setOpen(false);
    } else {
      // Reveal the chat alongside the diagram (split view).
      setFullscreen(false);
    }
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
          <TooltipIconButton
            tooltip="Close topology"
            onClick={() => {
              setFullscreen(false);
              setOpen(false);
            }}
          >
            <XIcon />
          </TooltipIconButton>
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
          <ReactFlowProvider>
            <GraphCanvas />
            <EntityDetailModal />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
