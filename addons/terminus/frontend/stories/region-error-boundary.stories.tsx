import { type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { RegionErrorBoundary } from '@/components/error-fallback';

// A child that throws on render, to demonstrate the boundary actually catching a
// crash (not just the presentational fallback — see ErrorFallback stories).
function Boom(): never {
  throw new Error('Simulated render crash');
}

function HealthyContent() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
      Healthy region content
    </div>
  );
}

// Frame each story in a bordered box standing in for the pane the boundary wraps.
function Region({ children }: { children: ReactNode }) {
  return <div className="bg-background h-[360px] w-[480px] overflow-hidden rounded-md">{children}</div>;
}

const meta = {
  title: 'Error Boundaries/RegionErrorBoundary',
  component: RegionErrorBoundary,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Region>
        <Story />
      </Region>
    ),
  ],
} satisfies Meta<typeof RegionErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Nothing throws: the boundary is transparent and renders its children.
export const Healthy: Story = {
  args: {
    title: 'Topology failed to render',
    children: <HealthyContent />,
  },
};

// The child throws on render: the boundary catches it and shows the scoped
// fallback with this scenario's copy. (Retry performs a real window reload — in
// Storybook that just reloads the preview iframe.)
export const CaughtRenderCrash: Story = {
  args: {
    title: 'Topology failed to render',
    message: 'The diagram hit an error. Reloading should recover it.',
    children: <Boom />,
  },
};
