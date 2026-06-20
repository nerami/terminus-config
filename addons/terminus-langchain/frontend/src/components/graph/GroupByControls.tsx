import { useAtom, useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { graphViewAtom, topologyAtom } from "@/lib/ha-graph/atoms";
import { navLevels, type NavOption } from "@/lib/ha-graph/group-nav";
import { cn } from "@/lib/utils";

/**
 * Floating, top-left dropdown chain inside the canvas. The first dropdown
 * picks the grouping dimension (Area / Scenes / Automations / Entities);
 * each navigation step appends a sibling-switcher dropdown to its right.
 * Changing the grouping dropdown clears the deeper ones (it navigates to a
 * dimension root). The top-bar breadcrumb is unaffected.
 *
 * Uses the themed base-ui Combobox (matching the rest of the app's dropdowns):
 * a button shows the current value and opens a popup with a type-to-filter
 * search — handy once an area has many scenes or automations. Item values are
 * the `{ value, label }` options themselves, so base-ui shows/filters on the
 * label while we navigate on the value.
 */
export function GroupByControls() {
  const topology = useAtomValue(topologyAtom);
  const [view, setView] = useAtom(graphViewAtom);

  if (!topology) return null;
  const levels = navLevels(topology, view);

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
      {levels.map((level) => {
        const selected =
          level.options.find((o) => o.value === level.value) ?? null;
        return (
          <Combobox<NavOption, false>
            key={level.id}
            items={level.options}
            value={selected}
            onValueChange={(option) => {
              if (option) setView(level.select(option.value));
            }}
          >
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  aria-label={
                    level.id === "grouping"
                      ? "Group nodes by"
                      : `Select ${level.id}`
                  }
                  className={cn(
                    "bg-card/95 w-44 justify-between shadow-sm backdrop-blur",
                    level.id === "grouping" && "font-medium",
                  )}
                />
              }
            >
              <ComboboxValue />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput
                placeholder={
                  level.id === "grouping"
                    ? "Group by…"
                    : `Search ${level.id}…`
                }
              />
              <ComboboxEmpty>No matches.</ComboboxEmpty>
              <ComboboxList>
                {(option: NavOption) => (
                  <ComboboxItem
                    key={option.value}
                    value={option}
                  >
                    {option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      })}
    </div>
  );
}
