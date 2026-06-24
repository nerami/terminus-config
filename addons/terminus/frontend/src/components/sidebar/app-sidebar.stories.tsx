import React from 'react';

import { AppSidebar } from './app-sidebar';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { withChatProviders, withQueryClient } from '@/storybook/decorators';

const mockThreads = [
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
] as const;

// AppSidebar lives in the rail BESIDE SidebarInset (not inside it).
// Mirror the real chat.tsx layout: SidebarProvider > [AppSidebar, SidebarInset].
const meta = {
  component: AppSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    withQueryClient((qc) => {
      qc.setQueryData(['ha', 'status'], {
        status: 'connected',
        ha_version: '2026.5',
        terminus_version: '0.22.0',
        last_connected: null,
        error: null,
      });
      qc.setQueryData(['changelog'], {
        version: '0.22.0',
        markdown: '## 0.22.0\n- Topology filters',
      });
    }),
    withChatProviders({ threads: mockThreads as never, router: true }),
    (Story) => (
      <SidebarProvider>
        <Story />
        <SidebarInset>
          <div className="text-muted-foreground p-4 text-sm">Chat area</div>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
