import { MultimodalPreview } from './multimodal-preview';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_FILE_BLOCK, SAMPLE_IMAGE_BLOCK } from '@/storybook/fixtures';

const meta = {
  component: MultimodalPreview,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MultimodalPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: {
    block: SAMPLE_IMAGE_BLOCK,
  },
};

export const File: Story = {
  args: {
    block: SAMPLE_FILE_BLOCK,
  },
};

export const Removable: Story = {
  args: {
    block: SAMPLE_IMAGE_BLOCK,
    removable: true,
    onRemove: () => {},
  },
};
