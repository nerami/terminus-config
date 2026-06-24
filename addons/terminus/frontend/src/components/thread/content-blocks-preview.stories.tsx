import { ContentBlocksPreview } from './content-blocks-preview';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_FILE_BLOCK, SAMPLE_IMAGE_BLOCK } from '@/storybook/fixtures';

const meta = {
  component: ContentBlocksPreview,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ContentBlocksPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mixed: Story = {
  args: {
    blocks: [SAMPLE_IMAGE_BLOCK, SAMPLE_FILE_BLOCK],
    onRemove: () => {},
  },
};
