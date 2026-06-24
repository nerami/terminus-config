import { SyntaxHighlighter } from './syntax-highlighter';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: SyntaxHighlighter,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SyntaxHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Python: Story = {
  args: {
    language: 'python',
    children: "def greet(name: str) -> str:\n    return f'hello {name}'\n\nresult = greet('world')\nprint(result)",
  },
};

export const Tsx: Story = {
  args: {
    language: 'tsx',
    children:
      "import { FC } from 'react';\n\nconst Greeting: FC<{ name: string }> = ({ name }) => (\n  <p>Hello, {name}!</p>\n);\n\nexport default Greeting;",
  },
};
