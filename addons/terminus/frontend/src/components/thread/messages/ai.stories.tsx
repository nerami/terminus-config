import { AssistantMessage } from './ai';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { withChatProviders } from '@/storybook/decorators';
import { FIXTURE_MESSAGES } from '@/storybook/fixtures';

const meta = {
  component: AssistantMessage,
  parameters: { layout: 'padded' },
  decorators: [withChatProviders({ messages: FIXTURE_MESSAGES })],
} satisfies Meta<typeof AssistantMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { message: FIXTURE_MESSAGES[4], isLoading: false, handleRegenerate: () => {} },
};

export const WithToolCalls: Story = {
  args: { message: FIXTURE_MESSAGES[1], isLoading: false, handleRegenerate: () => {} },
};
