import { Disclaimer } from './disclaimer';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Disclaimer,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Disclaimer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
