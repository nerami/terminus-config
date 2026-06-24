import { ThreadIdCopyable, ThreadIdTooltip } from './thread-id';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: ThreadIdTooltip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ThreadIdTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tooltip: Story = {
  args: {
    threadId: 'thread-abc-123',
  },
};

export const Copyable: Story = {
  args: { threadId: 'thread-abc-123' },
  render: () => <ThreadIdCopyable threadId="thread-abc-123" />,
};

export const CopyableUUID: Story = {
  args: { threadId: 'thread-abc-123' },
  render: () => <ThreadIdCopyable threadId="thread-abc-123" showUUID={true} />,
};
