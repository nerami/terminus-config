import '@xyflow/react/dist/style.css';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { createStore } from 'jotai';
import { Provider as JotaiProvider } from 'jotai';

import type { Topology } from '@/lib/ha-graph/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { GraphCanvas } from '@/components/graph/graph-canvas';
import { graphViewAtom } from '@/lib/ha-graph/atoms';
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
    {
      entity_id: 'light.mb_led_one',
      name: 'Led One',
      domain: 'light',
      area_id: 'master_bedroom',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    {
      entity_id: 'scene.lr_dim',
      name: 'Dim',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
    {
      entity_id: 'scene.lr_bright',
      name: 'Bright',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
  ],
  automations: [
    {
      entity_id: 'automation.lr_sunset_dim',
      name: 'Sunset Dim',
      area_id: 'living_room',
      numeric_id: '1',
      references: {
        entities: ['light.lr_led_strip'],
        scenes: ['scene.lr_dim'],
        devices: [],
      },
    },
    {
      entity_id: 'automation.lr_morning_bright',
      name: 'Morning Bright',
      area_id: 'living_room',
      numeric_id: '2',
      references: {
        entities: ['light.lr_led_strip'],
        scenes: ['scene.lr_bright'],
        devices: [],
      },
    },
  ],
};

// Creates a fresh Jotai store pre-seeded with topology + area view.
// Called once via useState initializer so the store survives re-renders.
function createStores() {
  const store = createStore();
  // Writing graphViewAtom invokes its write function: sets graphViewBaseAtom
  // and clears selectedNodeAtom — same as navigating in the real app.
  store.set(graphViewAtom, { kind: 'area', areaId: 'living_room' });
  // Topology is server state — seed the react-query cache it now reads from.
  const queryClient = new QueryClient();
  queryClient.setQueryData(topologyQueryOptions().queryKey, FIXTURE_TOPOLOGY);
  return { queryClient, store };
}

function TopologyStory() {
  // Stable store + client across re-renders (useState with initializer function).
  const [{ queryClient, store }] = React.useState(createStores);

  return (
    // Inner providers shadow the global ones. GraphCanvas resolves atoms from the
    // nearest Jotai Provider and topology from the nearest QueryClient.
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <ReactFlowProvider>
          <div style={{ width: '100%', height: '100vh' }}>
            <GraphCanvas />
          </div>
        </ReactFlowProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

const meta: Meta = {
  title: 'Topology',
  component: TopologyStory,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
