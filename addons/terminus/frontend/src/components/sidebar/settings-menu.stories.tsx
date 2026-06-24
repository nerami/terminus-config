import React from 'react';

import { SettingsMenu } from './settings-menu';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { withQueryClient } from '@/storybook/decorators';

const meta = {
  component: SettingsMenu,
  parameters: { layout: 'padded' },
  decorators: [
    withQueryClient((qc) => {
      qc.setQueryData(['ha', 'status'], {
        status: 'connected',
        ha_version: '2026.5',
        terminus_version: '0.22.0',
        last_connected: null,
        error: null,
      });
    }),
    (Story) => (
      <SidebarProvider>
        <SidebarInset>
          <Story />
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof SettingsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
