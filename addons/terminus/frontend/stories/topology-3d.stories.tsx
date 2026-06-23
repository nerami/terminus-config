import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/react';

import type { Topology } from '@/lib/ha-graph/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { GraphCanvas3D } from '@/components/graph/graph-canvas-3d';
import { selectedNodeAtom } from '@/lib/ha-graph/atoms';
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
      references: { entities: ['light.lr_led_strip'], scenes: ['scene.lr_dim'], devices: [] },
    },
  ],
};

// Fresh Jotai store pre-seeded with topology. View is URL-sourced;
// NuqsAdapter provides no seed, so the story opens at the default Areas
// overview (mirrors the 2D story).
function createStores(selectedId?: string) {
  const store = createStore();
  if (selectedId) store.set(selectedNodeAtom, selectedId);
  // Topology is server state — seed the react-query cache it now reads from.
  const queryClient = new QueryClient();
  queryClient.setQueryData(topologyQueryOptions().queryKey, FIXTURE_TOPOLOGY);
  return { queryClient, store };
}

// `forcedTheme` drives next-themes' resolvedTheme, which the 3D canvas maps to the
// reagraph theme, the room-background tint, and the additive/normal icon blend.
// Storybook itself has no next-themes provider, so without this the canvas always
// resolves to light.
function Topology3DStory({ forcedTheme, selectedId }: { forcedTheme?: string; selectedId?: string }) {
  const [{ queryClient, store }] = React.useState(() => createStores(selectedId));
  const canvas = (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <div style={{ width: '100%', height: '100vh' }}>
            <GraphCanvas3D />
          </div>
        </JotaiProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
  if (!forcedTheme) return canvas;
  return (
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      {canvas}
    </ThemeProvider>
  );
}

const meta: Meta<typeof Topology3DStory> = {
  title: 'Topology 3D',
  component: Topology3DStory,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Topology3DStory>;

// Area view: area=icosahedron, automation=dodecahedron, scene=octahedron,
// entity=tetrahedron. Default has no forced theme (resolves light in Storybook).
export const Default: Story = {};

// Dark room + additive (glowing) icons.
export const Dark: Story = { args: { forcedTheme: 'dark' } };

// Light room + flat (normal-blended) icons — the additive glow would wash out here.
export const Light: Story = { args: { forcedTheme: 'light' } };

// Verifies the selection ring + emissive bump still land on the Platonic solids.
export const Selected: Story = { args: { forcedTheme: 'dark', selectedId: 'light.lr_led_strip' } };
