import { ThreadActionsView } from './thread-actions-view';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region, withChatProviders } from '@/storybook/decorators';
import { FIXTURE_HITL_INTERRUPT, FIXTURE_MESSAGES } from '@/storybook/fixtures';
import { createMockStream } from '@/storybook/mocks';

const meta = {
  component: ThreadActionsView,
  parameters: { layout: 'padded' },
  decorators: [
    withChatProviders({
      router: true,
      stream: createMockStream(FIXTURE_MESSAGES, { interrupt: FIXTURE_HITL_INTERRUPT }),
    }),
    (Story) => (
      <Region className="h-[600px] w-[800px]">
        <Story />
      </Region>
    ),
  ],
} satisfies Meta<typeof ThreadActionsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    interrupt: FIXTURE_HITL_INTERRUPT,
    handleShowSidePanel: () => {},
    showState: false,
    showDescription: false,
  },
};
