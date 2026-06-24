import { ThreadView } from './agent-inbox';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region, withChatProviders } from '@/storybook/decorators';
import { FIXTURE_HITL_INTERRUPT, FIXTURE_MESSAGES } from '@/storybook/fixtures';
import { createMockStream } from '@/storybook/mocks';

const meta = {
  component: ThreadView,
  parameters: { layout: 'padded' },
  decorators: [
    withChatProviders({ stream: createMockStream(FIXTURE_MESSAGES, { interrupt: FIXTURE_HITL_INTERRUPT }) }),
    (Story) => (
      <Region className="h-[600px] w-[800px]">
        <Story />
      </Region>
    ),
  ],
} satisfies Meta<typeof ThreadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interrupted: Story = {
  args: { interrupt: FIXTURE_HITL_INTERRUPT },
};
