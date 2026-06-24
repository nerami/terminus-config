import { ToolCalls, ToolResult } from './tool-calls';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_TOOL_CALLS, SAMPLE_TOOL_MESSAGE } from '@/storybook/fixtures';

const meta = {
  component: ToolCalls,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToolCalls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Calls: Story = {
  args: { toolCalls: SAMPLE_TOOL_CALLS },
};

export const Result: Story = {
  args: { toolCalls: [] },
  parameters: { controls: { disable: true } },
  render: () => <ToolResult message={SAMPLE_TOOL_MESSAGE} />,
};
