import { Thread } from './thread';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { withChatProviders, withTopologyProviders } from '@/storybook/decorators';
import { FIXTURE_MESSAGES } from '@/storybook/fixtures';

const meta = {
  component: Thread,
  parameters: { layout: 'fullscreen' },
  // Thread reads useTopologyData() (react-query) for its context chips, so it
  // needs a QueryClient in scope. withTopologyProviders (outermost) supplies a
  // seeded QueryClientProvider; withChatProviders supplies Stream/Thread/
  // Artifact/Sidebar/Router.
  decorators: [withTopologyProviders(), withChatProviders({ messages: FIXTURE_MESSAGES, router: true, sidebar: true })],
} satisfies Meta<typeof Thread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
