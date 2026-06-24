import { MarkdownText } from './markdown-text';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_MARKDOWN } from '@/storybook/fixtures';

const meta = {
  component: MarkdownText,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MarkdownText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: SAMPLE_MARKDOWN,
  },
};

export const CodeHeavy: Story = {
  args: {
    children:
      "## Python Example\n\n```python\ndef greet(name: str) -> str:\n    return f'hello {name}'\n\nresult = greet('world')\nprint(result)\n```",
  },
};
