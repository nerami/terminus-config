import { HumanMessage } from './human';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { withChatProviders } from '@/storybook/decorators';
import { FIXTURE_MESSAGES } from '@/storybook/fixtures';

const meta = {
  component: HumanMessage,
  parameters: { layout: 'padded' },
  decorators: [withChatProviders()],
} satisfies Meta<typeof HumanMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { message: FIXTURE_MESSAGES[0], isLoading: false },
};
