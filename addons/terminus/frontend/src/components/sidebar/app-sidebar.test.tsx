import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { getDefaultStore } from 'jotai';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { whatsNewOpenAtom } from '@/components/whats-new/whats-new-dialog';
import type { HaStatus } from '@/hooks/use-ha-status';

const newThread = vi.fn();

vi.mock('@/hooks/use-new-thread', () => ({ useNewThread: () => newThread }));
vi.mock('@/hooks/use-thread-id', () => ({ useThreadId: () => ['current-id', vi.fn()] }));
vi.mock('@/providers/thread', () => ({
  useThreads: () => ({
    archiveThread: vi.fn(),
    getThreads: () => Promise.resolve([]),
    setThreads: vi.fn(),
    setThreadsLoading: vi.fn(),
    threads: [],
    threadsLoading: false,
  }),
}));
vi.mock('@/components/thread/artifact', () => ({ useArtifactOpen: () => [false, vi.fn()] }));

// Mutable holder so individual tests can vary the add-on version the sidebar sees.
const haStatus = vi.hoisted(() => ({ terminusVersion: '0.22.0' as string | null }));
vi.mock('@/hooks/use-ha-status', () => ({
  useHaStatus: (): HaStatus => ({
    status: 'connected',
    ha_version: '2026.6.0',
    terminus_version: haStatus.terminusVersion,
    last_connected: null,
    error: null,
  }),
}));
// The footer SettingsMenu reads the changelog (react-query); mock it so the
// sidebar renders without a QueryClient.
vi.mock('@/hooks/use-changelog', () => ({
  useChangelog: () => ({ data: { version: '0.22.0', markdown: '- A shiny new thing.' } }),
}));

import { SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar } from './app-sidebar';

function renderSidebar(searchParams = '') {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
  render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
    { wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate }) },
  );
  return { onUrlUpdate };
}

beforeEach(() => {
  newThread.mockReset();
  haStatus.terminusVersion = '0.22.0';
  getDefaultStore().set(whatsNewOpenAtom, false);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AppSidebar', () => {
  it('renders the core navigation and footer controls', () => {
    renderSidebar();
    expect(screen.getByRole('button', { name: /new session/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /topology/i })).toBeInTheDocument();
    expect(screen.getByText(/recent sessions/i)).toBeInTheDocument();
    // The HA status dot now lives inside the Settings dropdown (see settings-menu).
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  // The header badge (terminus_version) is distinct from the footer's HA-Core
  // version, so scope these assertions to the header region.
  function header() {
    return document.querySelector<HTMLElement>('[data-slot="sidebar-header"]')!;
  }

  it('shows the Terminus add-on version badge', () => {
    renderSidebar();
    expect(within(header()).getByText('v0.22.0')).toBeInTheDocument();
  });

  it('hides the version badge when the add-on version is unknown', () => {
    haStatus.terminusVersion = null;
    renderSidebar();
    expect(within(header()).queryByText(/^v/)).not.toBeInTheDocument();
  });

  it("opens the What's new dialog from the content button", () => {
    renderSidebar();
    expect(getDefaultStore().get(whatsNewOpenAtom)).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /what's new/i }));
    expect(getDefaultStore().get(whatsNewOpenAtom)).toBe(true);
  });

  it('starts a new session when New session is clicked', () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /new session/i }));
    expect(newThread).toHaveBeenCalledTimes(1);
  });

  it('opens the topology straight into full screen when layout is chat', async () => {
    const { onUrlUpdate } = renderSidebar('?layout=chat');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /topology/i }));
      await vi.runAllTimersAsync();
    });

    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=topology');
  });
});
