import { Graph3dLegend } from './graph-3d-legend';

import type { NodeKind } from '@/lib/ha-graph/build';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region } from '@/storybook/decorators';

const meta = {
  component: Graph3dLegend,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Graph3dLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllKinds: Story = {
  args: {
    kinds: ['area', 'group', 'entity', 'scene', 'automation'] satisfies NodeKind[],
  },
  decorators: [
    (Story) => (
      <Region className="relative">
        <Story />
      </Region>
    ),
  ],
};

export const EntitiesOnly: Story = {
  args: {
    kinds: ['entity'] satisfies NodeKind[],
  },
  decorators: [
    (Story) => (
      <Region className="relative">
        <Story />
      </Region>
    ),
  ],
};
