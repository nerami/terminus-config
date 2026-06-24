import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { XIcon } from 'lucide-react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { useTopologyData } from '@/hooks/use-topology';
import { availableDomainsAtom, nodeFilterAtom } from '@/lib/ha-graph/atoms';
import { navLevels, type NavOption } from '@/lib/ha-graph/group-nav';
import { type StatusFilter } from '@/lib/ha-graph/node-filter';
import { useGraphView } from '@/lib/ha-graph/use-graph-view';
import { cn } from '@/lib/utils';

/** Status filter options, in display order. `all` is the cleared / no-filter state. */
const STATUS_OPTIONS: NavOption[] = [
  { value: 'all', label: 'All' },
  { value: 'ok', label: 'OK' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'unknown', label: 'Unknown' },
];

/**
 * A single-select combobox whose inline-end addon is either a labelled clear (×)
 * button — when `clear` is provided — or the dropdown chevron otherwise. The clear
 * is a plain button (not base-ui's Combobox.Clear, whose click doesn't reliably
 * reset a controlled value); the popup still opens by clicking the input
 * (openOnInputClick). Used for both the group-by nav levels and the status filter.
 */
function FilterCombobox({
  ariaLabel,
  className,
  clear,
  items,
  onValueChange,
  value,
}: {
  ariaLabel: string;
  className?: string;
  clear: { label: string; onClear: () => void } | null;
  items: NavOption[];
  onValueChange: (option: NavOption | null) => void;
  value: NavOption | null;
}) {
  return (
    <Combobox<NavOption> items={items} value={value} onValueChange={onValueChange}>
      <InputGroup className={cn('w-auto', className)}>
        <ComboboxPrimitive.Input render={<InputGroupInput aria-label={ariaLabel} />} />
        <InputGroupAddon align="inline-end">
          {clear ? (
            <InputGroupButton size="icon-xs" aria-label={clear.label} onClick={clear.onClear}>
              <XIcon />
            </InputGroupButton>
          ) : (
            <InputGroupButton size="icon-xs" variant="ghost" render={<ComboboxTrigger />} />
          )}
        </InputGroupAddon>
      </InputGroup>
      <ComboboxContent>
        <ComboboxEmpty>No matches</ComboboxEmpty>
        <ComboboxList>
          {(option: NavOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

/**
 * Floating, top-left controls inside the canvas, in two rows. Every control
 * carries a clear (×) button: the search input and domain chips clear their
 * value, the status filter resets to "All", and a nav level navigates back up.
 *
 * Row 1 — the group-by nav chain that picks WHICH nodes are in view. The first
 * dropdown picks the grouping dimension; each navigation step appends a
 * sibling-switcher dropdown. A level's × navigates to `clearTo` (one level up;
 * the grouping resets to the Area default), so it only appears when there is
 * something to clear.
 *
 * Row 2 — per-node filters that operate WITHIN the current view (search / status /
 * domain), bound to `nodeFilterAtom`. The domain multi-select only appears once
 * the view has ≥2 domains (published via `availableDomainsAtom`).
 */
export function TopologyFilters() {
  const topology = useTopologyData();
  const [view, setView] = useGraphView();
  const filter = useAtomValue(nodeFilterAtom);
  const setFilter = useSetAtom(nodeFilterAtom);
  const availableDomains = useAtomValue(availableDomainsAtom);

  if (!topology) return null;
  const levels = navLevels(topology, view);

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {/* Row 1: group-by nav combobox chain */}
      <div className="flex flex-wrap items-center gap-2">
        {levels.map((level) => (
          <FilterCombobox
            key={level.id}
            ariaLabel={level.id === 'grouping' ? 'Group nodes by' : `Select ${level.id}`}
            items={level.options}
            value={level.options.find((o) => o.value === level.value) ?? null}
            onValueChange={(option) => {
              if (option) setView(level.select(option.value));
            }}
            clear={level.clearTo ? { label: `Clear ${level.id}`, onClear: () => setView(level.clearTo!) } : null}
            className="min-w-36"
          />
        ))}
      </div>

      {/* Row 2: filter controls */}
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-44">
          <InputGroupInput
            aria-label="Filter nodes"
            placeholder="Filter…"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          {filter.search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setFilter({ ...filter, search: '' })}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <FilterCombobox
          ariaLabel="Filter by status"
          items={STATUS_OPTIONS}
          value={STATUS_OPTIONS.find((o) => o.value === filter.status) ?? null}
          onValueChange={(option) => setFilter({ ...filter, status: (option?.value ?? 'all') as StatusFilter })}
          clear={
            filter.status !== 'all'
              ? { label: 'Clear status', onClear: () => setFilter({ ...filter, status: 'all' }) }
              : null
          }
          className="w-44"
        />

        {availableDomains.length >= 2 && (
          <Combobox
            multiple
            items={availableDomains}
            value={filter.domains}
            onValueChange={(d) => setFilter({ ...filter, domains: d })}
          >
            <InputGroup className="w-64">
              <ComboboxChips className="flex-1 flex-nowrap overflow-x-auto border-0 bg-transparent shadow-none dark:bg-transparent">
                {filter.domains.map((d) => (
                  <ComboboxChip key={d}>{d}</ComboboxChip>
                ))}
                <ComboboxChipsInput aria-label="Filter by domain" placeholder="Domains…" />
              </ComboboxChips>
              {filter.domains.length > 0 && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear domains"
                    onClick={() => setFilter({ ...filter, domains: [] })}
                  >
                    <XIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            <ComboboxContent>
              <ComboboxEmpty>No domains</ComboboxEmpty>
              <ComboboxList>
                {(d: string) => (
                  <ComboboxItem key={d} value={d}>
                    {d}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}
      </div>
    </div>
  );
}
