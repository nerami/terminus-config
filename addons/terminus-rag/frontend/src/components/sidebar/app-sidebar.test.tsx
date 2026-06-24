import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { AppSidebar } from './app-sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';
import type { ToolDef } from '@/lib/api';

const tools: ToolDef[] = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  { name: 'search_ha', description: 'Semantic search', inputSchema: { type: 'object', properties: {} } },
];

function renderSidebar(props: Partial<React.ComponentProps<typeof AppSidebar>> = {}) {
  const onSelect = vi.fn();
  render(
    <SidebarProvider>
      <AppSidebar tools={tools} selected="list_kinds" onSelect={onSelect} health={null} {...props} />
    </SidebarProvider>,
  );
  return { onSelect };
}

test('renders each tool as a menu item', () => {
  renderSidebar();
  expect(screen.getByText('list_kinds')).toBeInTheDocument();
  expect(screen.getByText('search_ha')).toBeInTheDocument();
});

test('clicking a tool calls onSelect with its name', async () => {
  const { onSelect } = renderSidebar();
  await userEvent.click(screen.getByText('search_ha'));
  expect(onSelect).toHaveBeenCalledWith('search_ha');
});

test('marks the selected tool active and the others inactive', () => {
  renderSidebar({ selected: 'search_ha' });
  expect(screen.getByText('search_ha').closest('[data-active]')).not.toBeNull();
  expect(screen.getByText('list_kinds').closest('[data-active]')).toBeNull();
});

test('shows the index status in the footer when health is present', () => {
  renderSidebar({ health: { status: 'ok', indexed: 2, model: 'bge' } });
  expect(screen.getByText(/ok · 2 indexed · bge/)).toBeInTheDocument();
});

test('hides the status line when health is null', () => {
  renderSidebar({ health: null });
  expect(screen.queryByText(/indexed/)).not.toBeInTheDocument();
});
