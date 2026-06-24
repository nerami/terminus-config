import { ErrorFallback } from './error-fallback';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region } from '@/storybook/decorators';

const meta = {
  component: ErrorFallback,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Region>
        <Story />
      </Region>
    ),
  ],
  args: {
    // The real default reloads the window; stub it here so clicking Reload in a
    // story doesn't reload the Storybook iframe.
    onRetry: () => {},
  },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

// The four production scenarios, with the exact copy shipped in graph-panel.tsx
// and thread.tsx.
export const Topology3D: Story = {
  args: {
    title: '3D topology failed to render',
    message: 'The 3D view hit an error. Reloading should recover it.',
  },
};

export const Topology2D: Story = {
  args: {
    title: 'Topology failed to render',
    message: 'The diagram hit an error. Reloading should recover it.',
  },
};

export const Conversation: Story = {
  args: {
    title: 'The conversation failed to render',
    message: 'Something in the message list broke. Reloading should get you back.',
  },
};

export const Artifact: Story = {
  args: {
    title: 'This artifact failed to render',
    message: 'The artifact view hit an error. Reloading should recover it.',
  },
};

// The optional-message branch: title and retry only.
export const TitleOnly: Story = {
  args: { title: 'Something went wrong' },
};

// Controls playground for tweaking copy/labels.
export const Playground: Story = {
  args: {
    title: 'Something went wrong',
    message: 'A short explanation of what broke and how to recover.',
    retryLabel: 'Reload',
  },
};
