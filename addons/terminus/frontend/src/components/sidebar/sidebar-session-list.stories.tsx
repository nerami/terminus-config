import React from 'react';

import { SidebarSessionList } from './sidebar-session-list';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { ThreadContext } from '@/providers/thread';
import { withChatProviders } from '@/storybook/decorators';
import { createMockThreads } from '@/storybook/mocks';

const threads = [
  {
    thread_id: 'thread-1',
    values: { messages: [{ type: 'human', content: 'Turn on the lights' }] },
    metadata: {},
    status: 'idle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    thread_id: 'thread-2',
    values: { messages: [{ type: 'human', content: 'What is my next event?' }] },
    metadata: {},
    status: 'idle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    thread_id: 'thread-3',
    values: { messages: [{ type: 'human', content: 'Set the thermostat to 22°C' }] },
    metadata: {},
    status: 'idle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as const;

const meta = {
  component: SidebarSessionList,
  parameters: { layout: 'padded' },
  decorators: [withChatProviders({ threads: threads as never, router: true, sidebar: true })],
} satisfies Meta<typeof SidebarSessionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {};

export const Empty: Story = {
  decorators: [withChatProviders({ threads: [], router: true, sidebar: true })],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      const value = { ...createMockThreads([]), threadsLoading: true } as React.ContextType<typeof ThreadContext>;
      return (
        <SidebarProvider>
          <SidebarInset>
            <ThreadContext.Provider value={value}>
              <Toaster />
              <Story />
            </ThreadContext.Provider>
          </SidebarInset>
        </SidebarProvider>
      );
    },
  ],
};
