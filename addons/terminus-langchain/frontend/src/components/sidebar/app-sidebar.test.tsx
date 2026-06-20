import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { HaStatus } from '@/hooks/use-ha-status';

import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';

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
vi.mock('@/hooks/use-ha-status', () => ({
  useHaStatus: (): HaStatus => ({
    status: 'connected',
    ha_version: '2026.6.0',
    last_connected: null,
    error: null,
  }),
}));

import { SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar } from './app-sidebar';

function renderSidebar(store = createStore()) {
  return render(
    <Provider store={store}>
      <NuqsTestingAdapter>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </NuqsTestingAdapter>
    </Provider>,
  );
}

beforeEach(() => newThread.mockReset());

describe('AppSidebar', () => {
  it('renders the core navigation and footer controls', () => {
    renderSidebar();
    expect(screen.getByRole('button', { name: /new session/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /topology/i })).toBeInTheDocument();
    expect(screen.getByText(/recent sessions/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', expect.stringContaining('Home Assistant'));
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('starts a new session when New session is clicked', () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /new session/i }));
    expect(newThread).toHaveBeenCalledTimes(1);
  });

  it('opens the topology straight into full screen', () => {
    const store = createStore();
    store.set(graphPanelOpenAtom, false);
    store.set(graphFullscreenAtom, false);
    renderSidebar(store);

    fireEvent.click(screen.getByRole('button', { name: /topology/i }));

    expect(store.get(graphPanelOpenAtom)).toBe(true);
    expect(store.get(graphFullscreenAtom)).toBe(true);
  });
});
