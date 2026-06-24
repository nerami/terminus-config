import { ToolCallTable } from './tool-call-table';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_TOOL_CALLS } from '@/storybook/fixtures';

const meta = {
  component: ToolCallTable,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToolCallTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    toolCall: SAMPLE_TOOL_CALLS![1],
  },
};
