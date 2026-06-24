import { RenameThreadDialog } from './rename-thread-dialog';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { withChatProviders } from '@/storybook/decorators';

const meta = {
  component: RenameThreadDialog,
  parameters: { layout: 'centered' },
  decorators: [withChatProviders()],
} satisfies Meta<typeof RenameThreadDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    initialTitle: 'Turn on the living room lights',
    onOpenChange: () => {},
    open: true,
    threadId: 'thread-1',
  },
};
