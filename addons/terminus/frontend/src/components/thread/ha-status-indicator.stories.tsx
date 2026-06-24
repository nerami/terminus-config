import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { HaStatusIndicator } from './ha-status-indicator';

import type { HaStatus } from '@/hooks/use-ha-status';
import type { Meta, StoryObj } from '@storybook/react-vite';

function withStatus(data: HaStatus) {
  return function StatusDecorator(Story: React.ComponentType) {
    const [queryClient] = React.useState(() => {
      const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      client.setQueryData(['ha', 'status'], data);
      return client;
    });
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
}

const meta = {
  component: HaStatusIndicator,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HaStatusIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  decorators: [
    withStatus({
      status: 'connected',
      ha_version: '2026.5.4',
      terminus_version: '0.22.0',
      last_connected: new Date().toISOString(),
      error: null,
    }),
  ],
};

export const Connecting: Story = {
  decorators: [
    withStatus({
      status: 'connecting',
      ha_version: null,
      terminus_version: null,
      last_connected: null,
      error: null,
    }),
  ],
};

export const Disconnected: Story = {
  decorators: [
    withStatus({
      status: 'disconnected',
      ha_version: null,
      terminus_version: null,
      last_connected: null,
      error: 'Connection timed out',
    }),
  ],
};

export const AuthFailed: Story = {
  decorators: [
    withStatus({
      status: 'auth_failed',
      ha_version: null,
      terminus_version: null,
      last_connected: null,
      error: 'Authentication failed',
    }),
  ],
};
