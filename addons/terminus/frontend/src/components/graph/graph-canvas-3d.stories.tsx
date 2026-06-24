import { ThemeProvider } from 'next-themes';

import { GraphCanvas3D } from './graph-canvas-3d';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { selectedNodeAtom } from '@/lib/ha-graph/atoms';
import { withTopologyProviders } from '@/storybook/decorators';

// `forcedTheme` drives next-themes' resolvedTheme, which the 3D canvas maps to the
// reagraph theme, the room-background tint, and the additive/normal icon blend.
// Storybook itself has no next-themes provider, so without this the canvas always
// resolves to light.
function Topology3DStory({ forcedTheme }: { forcedTheme?: string }) {
  const canvas = (
    <div style={{ width: '100%', height: '100vh' }}>
      <GraphCanvas3D />
    </div>
  );
  if (!forcedTheme) return canvas;
  return (
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      {canvas}
    </ThemeProvider>
  );
}

const meta = {
  component: Topology3DStory,
  parameters: { layout: 'fullscreen' },
  decorators: [withTopologyProviders()],
} satisfies Meta<typeof Topology3DStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Area view: area=icosahedron, automation=dodecahedron, scene=octahedron,
// entity=tetrahedron. Default has no forced theme (resolves light in Storybook).
export const Default: Story = {};

// Dark room + additive (glowing) icons.
export const Dark: Story = { args: { forcedTheme: 'dark' } };

// Light room + flat (normal-blended) icons — the additive glow would wash out here.
export const Light: Story = { args: { forcedTheme: 'light' } };

// Verifies the selection ring + emissive bump still land on the Platonic solids.
// The selection is seeded on this story's own store via a dedicated decorator.
export const Selected: Story = {
  args: { forcedTheme: 'dark' },
  decorators: [withTopologyProviders({ seed: (store) => store.set(selectedNodeAtom, 'light.lr_led_strip') })],
};
