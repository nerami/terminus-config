import { Fullscreen, ZoomIn, ZoomOut } from 'lucide-react';

import { TooltipIconButton } from '@/components/thread/tooltip-icon-button';
import { cn } from '@/lib/utils';

interface GraphControlsProps {
  className?: string;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/**
 * Renderer-agnostic zoom/fit control stack, shared by the 2D (react-flow) and 3D
 * (reagraph) canvases for visual consistency. Each canvas wires its own camera
 * API to the callbacks.
 */
export function GraphControls({ className, onFit, onZoomIn, onZoomOut }: GraphControlsProps) {
  return (
    <div className={cn('absolute bottom-3 left-3 z-10 flex flex-col gap-1', className)}>
      <TooltipIconButton
        tooltip="Zoom in"
        side="right"
        variant="outline"
        className="bg-card/90 shadow-md backdrop-blur"
        onClick={onZoomIn}
      >
        <ZoomIn />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Zoom out"
        side="right"
        variant="outline"
        className="bg-card/90 shadow-md backdrop-blur"
        onClick={onZoomOut}
      >
        <ZoomOut />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Fit all nodes"
        side="right"
        variant="outline"
        className="bg-card/90 shadow-md backdrop-blur"
        onClick={onFit}
      >
        <Fullscreen />
      </TooltipIconButton>
    </div>
  );
}
