import { TopologyFilters } from './topology-filters';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { availableDomainsAtom, nodeFilterAtom } from '@/lib/ha-graph/atoms';
import { withTopologyProviders } from '@/storybook/decorators';

const meta = {
  component: TopologyFilters,
  parameters: { layout: 'fullscreen' },
  decorators: [
    withTopologyProviders({
      seed: (store) => {
        store.set(availableDomainsAtom, ['light', 'switch', 'sensor']);
        store.set(nodeFilterAtom, { search: 'light', status: 'unavailable', domains: ['light', 'switch'] });
      },
    }),
    (Story) => (
      <div className="bg-background relative h-72 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopologyFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
