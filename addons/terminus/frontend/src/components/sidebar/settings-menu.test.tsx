import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { HaStatus } from '@/hooks/use-ha-status';

// SettingsMenu reads the HA status (react-query). Mock it to keep the test free
// of a QueryClient.
vi.mock('@/hooks/use-ha-status', () => ({
  useHaStatus: (): HaStatus => ({
    status: 'connected',
    ha_version: '2026.6.0',
    terminus_version: '0.22.0',
    last_connected: null,
    error: null,
  }),
}));

import { SidebarProvider } from '@/components/ui/sidebar';

import { SettingsMenu } from './settings-menu';

import { useViewTools } from '@/hooks/use-view-tools';
import { fontSizeAtom, viewToolsAtom } from '@/lib/settings';

function Probe() {
  const [viewTools] = useViewTools();
  return <div data-testid="probe">{String(viewTools)}</div>;
}

function renderMenu(store = createStore()) {
  return render(
    <Provider store={store}>
      <SidebarProvider>
        <SettingsMenu />
        <Probe />
      </SidebarProvider>
    </Provider>,
  );
}

afterEach(() => window.localStorage.clear());

describe('SettingsMenu', () => {
  it('groups settings under Chatbot and Appearance headings', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(screen.getByText('Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('shows the Home Assistant connection block (label, version, status dot) in the dropdown', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(screen.getByText('Home Assistant')).toBeInTheDocument();
    expect(screen.getByText('v2026.6.0')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Connected');
  });

  it('toggles tool-call visibility', () => {
    const store = createStore();
    store.set(viewToolsAtom, true);
    renderMenu(store);

    expect(screen.getByTestId('probe')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /show tool calls/i }));

    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });

  it('steps the font size up and down', () => {
    const store = createStore();
    store.set(fontSizeAtom, 16);
    renderMenu(store);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /increase font size/i }));
    expect(store.get(fontSizeAtom)).toBe(17);

    fireEvent.click(screen.getByRole('button', { name: /decrease font size/i }));
    expect(store.get(fontSizeAtom)).toBe(16);
  });

  it('disables the increase button at the maximum size', () => {
    const store = createStore();
    store.set(fontSizeAtom, 20);
    renderMenu(store);

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(screen.getByRole('button', { name: /increase font size/i })).toBeDisabled();
  });
});
