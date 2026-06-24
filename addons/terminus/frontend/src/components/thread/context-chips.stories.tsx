import { ContextChips } from './context-chips';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_CONTEXT_ITEMS } from '@/storybook/fixtures';

const meta = {
  component: ContextChips,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ContextChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: SAMPLE_CONTEXT_ITEMS,
    activeIds: new Set(['page:areas']),
    onToggle: () => {},
  },
  render: (args) => <ContextChips {...args} />,
};

export const AllActive: Story = {
  args: {
    items: SAMPLE_CONTEXT_ITEMS,
    activeIds: new Set(['page:areas', 'node:light.lr_led_strip']),
    onToggle: () => {},
  },
  render: (args) => <ContextChips {...args} />,
};

export const NoneActive: Story = {
  args: {
    items: SAMPLE_CONTEXT_ITEMS,
    activeIds: new Set<string>(),
    onToggle: () => {},
  },
  render: (args) => <ContextChips {...args} />,
};
