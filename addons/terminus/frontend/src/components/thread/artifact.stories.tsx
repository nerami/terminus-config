import React from 'react';

import { ArtifactContent, ArtifactTitle } from './artifact';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region, withChatProviders } from '@/storybook/decorators';

const meta = {
  component: ArtifactContent,
  parameters: { layout: 'centered' },
  decorators: [withChatProviders()],
} satisfies Meta<typeof ArtifactContent>;
export default meta;

type Story = StoryObj<typeof meta>;

// Host state: the empty artifact surface. Content is injected by the LangGraph UI
// runtime at runtime and cannot be rendered in isolation.
export const Host: Story = {
  render: () => (
    <Region className="flex flex-col">
      {/* Content is injected by the LangGraph UI runtime; this shows the empty host surface. */}
      <ArtifactTitle className="text-muted-foreground border-b px-4 py-2 text-sm font-medium">Artifact</ArtifactTitle>
      <ArtifactContent className="flex-1 p-4" />
    </Region>
  ),
};
