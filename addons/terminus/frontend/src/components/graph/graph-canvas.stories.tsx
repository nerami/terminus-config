import '@xyflow/react/dist/style.css';

import { GraphCanvas } from './graph-canvas';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { withTopologyProviders } from '@/storybook/decorators';

const meta = {
  component: GraphCanvas,
  parameters: { layout: 'fullscreen' },
  decorators: [
    withTopologyProviders({ reactFlow: true }),
    (Story) => (
      <div style={{ width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GraphCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
