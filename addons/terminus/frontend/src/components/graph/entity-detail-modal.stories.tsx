import { EntityDetailModal } from './entity-detail-modal';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { entityModalAtom } from '@/lib/ha-graph/atoms';
import { withTopologyProviders } from '@/storybook/decorators';

// The topology data is seeded by withTopologyProviders (FIXTURE_TOPOLOGY includes
// light.lr_led_strip). The fetchEntity HTTP call will fail in Storybook (no
// backend) — the modal shows "Loading state…" briefly then the error, which is
// handled gracefully by the component's error state.
const meta = {
  component: EntityDetailModal,
  parameters: { layout: 'centered' },
  decorators: [
    withTopologyProviders({
      seed: (store) => store.set(entityModalAtom, 'light.lr_led_strip'),
    }),
  ],
} satisfies Meta<typeof EntityDetailModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
