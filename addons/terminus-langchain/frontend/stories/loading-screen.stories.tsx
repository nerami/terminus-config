import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCw } from 'lucide-react';
import { StatusCard } from '@/components/status-card';
import { Button } from '@/components/ui/button';

const meta: Meta = {
  title: 'Screens/LoadingScreen',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Checking: Story = {
  render: () => (
    <StatusCard>
      <h1 className="text-lg font-semibold tracking-tight">Starting Terminus…</h1>
      <p className="text-muted-foreground text-sm">
        The agent server is warming up. This can take a moment right after an update or restart.
      </p>
    </StatusCard>
  ),
};

export const Error: Story = {
  render: () => (
    <StatusCard variant="glitch">
      <h1 className="text-lg font-semibold tracking-tight">Couldn't reach the agent server</h1>
      <p className="text-muted-foreground text-sm">
        Please ensure the graph is running at <code>http://localhost:2025</code> and your API key
        is correctly set (if connecting to a deployed graph).
      </p>
      <Button variant="outline">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </StatusCard>
  ),
};
