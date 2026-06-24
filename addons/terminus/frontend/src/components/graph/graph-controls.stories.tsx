import { GraphControls } from './graph-controls';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region } from '@/storybook/decorators';

const meta = {
  component: GraphControls,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GraphControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onFit: () => {},
    onZoomIn: () => {},
    onZoomOut: () => {},
  },
  decorators: [
    (Story) => (
      <Region className="relative">
        <Story />
      </Region>
    ),
  ],
};
