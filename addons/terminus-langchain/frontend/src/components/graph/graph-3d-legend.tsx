import { KIND_FILL, KIND_ICON_URI, KIND_LABEL } from './graph-3d-style';

import type { NodeKind } from '@/lib/ha-graph/build';

/**
 * Decodes the 3D node colors/icons by kind. The 3D force layout can't show the
 * 2D "Entities / Scenes / Automations" section headers, so this legend gives the
 * same at-a-glance mapping. Only the kinds present in the current view are shown.
 */
export function Graph3dLegend({ kinds }: { kinds: NodeKind[] }) {
  if (kinds.length === 0) return null;
  return (
    <div className="bg-card/90 text-card-foreground absolute bottom-3 left-3 z-10 rounded-md border p-2 text-xs shadow-md backdrop-blur">
      <ul className="space-y-1">
        {kinds.map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded-sm"
              style={{ backgroundColor: KIND_FILL[kind] }}
            >
              <img src={KIND_ICON_URI[kind]} alt="" className="size-3" />
            </span>
            <span>{KIND_LABEL[kind]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
