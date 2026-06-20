import type { RefObject } from 'react';

import { Html } from '@react-three/drei';

import { KIND_FILL, KIND_ICON_URI } from './graph-3d-style';

import type { NodeKind } from '@/lib/ha-graph/build';

import { cn } from '@/lib/utils';

interface NodeLabelChipProps {
  active?: boolean;
  kind: NodeKind;
  label: string;
  sublabel?: string;
}

/**
 * The DOM content of a node label: a kind-colored glyph swatch (same as the
 * legend) next to the name + sublabel. Kept as a plain component so it renders
 * and is testable without a WebGL canvas; `NodeLabel` wraps it in drei `<Html>`.
 */
export function NodeLabelChip({ active, kind, label, sublabel }: NodeLabelChipProps) {
  return (
    <div
      className={cn(
        'flex max-w-[12rem] items-center gap-1.5 rounded-md border px-2 py-1 shadow-md backdrop-blur',
        'bg-card/90 text-card-foreground select-none',
        active && 'ring-primary ring-2',
      )}
    >
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-sm"
        style={{ backgroundColor: KIND_FILL[kind] }}
      >
        <img src={KIND_ICON_URI[kind]} alt="" className="size-3" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-xs font-medium">{label}</span>
        {sublabel && <span className="text-muted-foreground truncate text-[10px]">{sublabel}</span>}
      </span>
    </div>
  );
}

interface NodeLabelProps extends NodeLabelChipProps {
  /** Isolated container the chips portal into (see NodeLabel for why). */
  portalRef?: RefObject<HTMLElement | null>;
  /** World-space offset from the node center (e.g. below the solid). */
  position: [number, number, number];
}

/**
 * Billboarded label for a 3D node: the icon + name + sublabel as one DOM chip
 * positioned in the scene via drei `<Html>`. It always faces the camera and is
 * click-through so it never steals node picks.
 *
 * No `distanceFactor`: that scales the chip with a CSS transform, which the
 * browser rasterizes once and stretches → blurry text. Without it the chip
 * renders at native resolution (crisp) at a constant screen size.
 *
 * Depth sorting: drei z-indexes each chip by camera distance every frame (so a
 * nearer node's label overlaps a farther one, updating live as you rotate). It
 * maps distance across the *whole* camera frustum, so a small custom range like
 * [9,0] collapses every label to one value — instead we keep the wide default
 * range for granularity and portal into an isolated `z-0` container (`portalRef`)
 * so the big z-indexes stay below the corner UI.
 *
 * TODO(label): to make labels recede with the scene *and* stay crisp, switch to
 * `<Html transform sprite>` (CSS3D, re-rasterized natively), or a pure-WebGL
 * variant (drei `<Billboard>` + sprite + troika text) that stays in-canvas
 * (fog/depth). Revisit if the DOM overlay gets costly at high node counts.
 */
export function NodeLabel({ portalRef, position, ...chip }: NodeLabelProps) {
  return (
    // drei's `portal` type predates React 19's nullable RefObject; it guards
    // against a null `current` at runtime, so the cast is safe.
    <Html
      center
      portal={portalRef as RefObject<HTMLElement> | undefined}
      position={position}
      style={{ pointerEvents: 'none' }}
    >
      <NodeLabelChip {...chip} />
    </Html>
  );
}
