import { GenericInterruptView } from './generic-interrupt';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_INTERRUPT } from '@/storybook/fixtures';

const meta = {
  component: GenericInterruptView,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GenericInterruptView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Object: Story = {
  args: { interrupt: SAMPLE_INTERRUPT },
};

export const Array: Story = {
  args: { interrupt: [SAMPLE_INTERRUPT, SAMPLE_INTERRUPT] },
};
