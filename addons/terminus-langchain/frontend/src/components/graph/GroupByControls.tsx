import { useAtom, useAtomValue } from "jotai";

import { graphViewAtom, topologyAtom } from "@/lib/ha-graph/atoms";
import { navLevels } from "@/lib/ha-graph/group-nav";
import { cn } from "@/lib/utils";

/**
 * Floating, top-left dropdown chain inside the canvas. The first dropdown
 * picks the grouping dimension (Area / Scenes / Automations / Entities);
 * each navigation step appends a sibling-switcher dropdown to its right.
 * Changing the grouping dropdown clears the deeper ones (it navigates to a
 * dimension root). The top-bar breadcrumb is unaffected.
 */
export function GroupByControls() {
  const topology = useAtomValue(topologyAtom);
  const [view, setView] = useAtom(graphViewAtom);

  if (!topology) return null;
  const levels = navLevels(topology, view);

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
      {levels.map((level) => (
        <select
          key={level.id}
          aria-label={
            level.id === "grouping" ? "Group nodes by" : `Select ${level.id}`
          }
          value={level.value}
          onChange={(e) => setView(level.select(e.target.value))}
          className={cn(
            "border-border bg-card/95 text-foreground focus-visible:ring-ring/50 cursor-pointer rounded-md border px-2 py-1 text-sm shadow-sm backdrop-blur focus-visible:ring-2 focus-visible:outline-none",
            level.id === "grouping" && "font-medium",
          )}
        >
          {level.options.map((o) => (
            <option
              key={o.value}
              value={o.value}
            >
              {o.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
