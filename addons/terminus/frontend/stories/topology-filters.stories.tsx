import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import type { Topology } from '@/lib/ha-graph/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TopologyFilters } from '@/components/graph/topology-filters';
import { availableDomainsAtom, nodeFilterAtom } from '@/lib/ha-graph/atoms';
import { topologyQueryOptions } from '@/lib/ha-graph/queries';

const FIXTURE_TOPOLOGY: Topology = {
  areas: [
    { area_id: 'living_room', name: 'Living Room' },
    { area_id: 'master_bedroom', name: 'Master Bedroom' },
  ],
  entities: [
    {
      entity_id: 'light.lr_led_strip',
      name: 'LED Strip',
      domain: 'light',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'switch.lr_lamp',
      name: 'Floor Lamp',
      domain: 'switch',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'sensor.lr_illuminance',
      name: 'Illuminance',
      domain: 'sensor',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [],
  automations: [],
};

// TopologyFilters reads topology from react-query, the view from the URL, and
// its filter state + the available-domain list from Jotai. Seed all three so
// the whole control cluster renders (≥2 domains shows the domain multi-select;
// pre-selecting two shows the chips + the clear button).
function createStores() {
  const store = createStore();
  store.set(availableDomainsAtom, ['light', 'switch', 'sensor']);
  // Filled state so every control shows its clear (×) button.
  store.set(nodeFilterAtom, { search: 'light', status: 'unavailable', domains: ['light', 'switch'] });
  const queryClient = new QueryClient();
  queryClient.setQueryData(topologyQueryOptions().queryKey, FIXTURE_TOPOLOGY);
  return { queryClient, store };
}

function FiltersStory() {
  const [{ queryClient, store }] = React.useState(createStores);
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          {/* Relative canvas stand-in: TopologyFilters positions itself absolute top-left. */}
          <div className="bg-background relative h-72 w-full">
            <TopologyFilters />
          </div>
        </JotaiProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

const meta: Meta = {
  title: 'Topology/Filters',
  component: FiltersStory,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
