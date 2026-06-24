import React from 'react';

import { Provider as JotaiProvider, createStore } from 'jotai';

import { WhatsNewDialog, lastSeenVersionAtom, whatsNewOpenAtom } from './whats-new-dialog';

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { withQueryClient } from '@/storybook/decorators';

// Seed the Jotai store so the dialog renders as open:
// - whatsNewOpenAtom = true (dialog open)
// - lastSeenVersionAtom = '0.21.0' (different from terminus_version '0.22.0' so the
//   auto-open effect also fires, but the dialog is already forced open via the atom)
const withWhatsNewOpen: Decorator = function WhatsNewOpenDecorator(Story) {
  const [store] = React.useState(() => {
    const s = createStore();
    s.set(whatsNewOpenAtom, true);
    s.set(lastSeenVersionAtom, '0.21.0');
    return s;
  });
  return (
    <JotaiProvider store={store}>
      <Story />
    </JotaiProvider>
  );
};

const meta = {
  component: WhatsNewDialog,
  parameters: { layout: 'centered' },
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
        markdown:
          '## 0.22.0\n- Topology filters added\n- Search, status, and domain filters for the graph panel\n- Performance improvements',
      });
    }),
    withWhatsNewOpen,
  ],
} satisfies Meta<typeof WhatsNewDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
