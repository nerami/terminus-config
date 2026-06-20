import { useAtom, useAtomValue } from 'jotai';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { graphViewAtom, topologyAtom } from '@/lib/ha-graph/atoms';
import { navLevels } from '@/lib/ha-graph/group-nav';
import { cn } from '@/lib/utils';

/**
 * Floating, top-left dropdown chain inside the canvas. The first dropdown
 * picks the grouping dimension (Area / Scenes / Automations / Entities);
 * each navigation step appends a sibling-switcher dropdown to its right.
 * Changing the grouping dropdown clears the deeper ones (it navigates to a
 * dimension root). The top-bar breadcrumb is unaffected.
 *
 * Uses the themed base-ui Select (matching the rest of the app's dropdowns)
 * rather than a native <select>, so the open popup respects the app theme.
 */
export function GroupByControls() {
  const topology = useAtomValue(topologyAtom);
  const [view, setView] = useAtom(graphViewAtom);

  if (!topology) return null;
  const levels = navLevels(topology, view);

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
      {levels.map((level) => (
        <Select
          key={level.id}
          items={level.options}
          value={level.value}
          onValueChange={(value) => {
            if (value != null) setView(level.select(value));
          }}
        >
          <SelectTrigger
            aria-label={level.id === 'grouping' ? 'Group nodes by' : `Select ${level.id}`}
            className={cn(
              'bg-card/95 cursor-pointer shadow-sm backdrop-blur',
              level.id === 'grouping' && 'font-medium',
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {level.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
