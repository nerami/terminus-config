import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const setThreadId = vi.fn();
const archiveThread = vi.fn(() => Promise.resolve());
const updateThreadTitle = vi.fn(() => Promise.resolve());
const getThreads = vi.fn(() => Promise.resolve([]));
const setThreads = vi.fn();
const setThreadsLoading = vi.fn();

let threadsValue: { thread_id: string; values?: unknown; metadata?: Record<string, unknown> }[] = [];
let threadsLoadingValue = false;

vi.mock('@/providers/thread', () => ({
  useThreads: () => ({
    archiveThread,
    updateThreadTitle,
    getThreads,
    setThreads,
    setThreadsLoading,
    threads: threadsValue,
    threadsLoading: threadsLoadingValue,
  }),
}));
vi.mock('@/hooks/use-thread-id', () => ({
  useThreadId: () => ['current-id', setThreadId],
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { SidebarProvider } from '@/components/ui/sidebar';

import { SidebarSessionList } from './sidebar-session-list';

function renderList() {
  return render(
    <SidebarProvider>
      <SidebarSessionList />
    </SidebarProvider>,
  );
}

beforeEach(() => {
  threadsValue = [];
  threadsLoadingValue = false;
  setThreadId.mockReset();
  archiveThread.mockClear();
  updateThreadTitle.mockClear();
});

describe('SidebarSessionList', () => {
  it('shows an empty state when there are no conversations', () => {
    renderList();
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();
  });

  it('renders skeletons while loading', () => {
    threadsLoadingValue = true;
    const { container } = renderList();
    expect(container.querySelectorAll('[data-slot="sidebar-menu-skeleton"]').length).toBeGreaterThan(0);
  });

  it('selects a thread on click', () => {
    threadsValue = [{ thread_id: 't1', values: { messages: [{ content: 'Hello world' }] } }];
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Hello world' }));
    expect(setThreadId).toHaveBeenCalledWith('t1');
  });

  it('archives a thread from its menu', () => {
    threadsValue = [{ thread_id: 't1', values: { messages: [{ content: 'Hello world' }] } }];
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Conversation options' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /archive/i }));
    expect(archiveThread).toHaveBeenCalledWith('t1');
  });

  it('prefers a stored metadata title over the first message', () => {
    threadsValue = [
      { thread_id: 't1', metadata: { title: 'Kitchen scene' }, values: { messages: [{ content: 'Hello world' }] } },
    ];
    renderList();
    expect(screen.getByRole('button', { name: 'Kitchen scene' })).toBeInTheDocument();
  });

  it('opens the rename dialog from its menu and saves a new title', () => {
    threadsValue = [{ thread_id: 't1', values: { messages: [{ content: 'Hello world' }] } }];
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Conversation options' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /rename/i }));

    const input = screen.getByLabelText('Conversation title') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(updateThreadTitle).toHaveBeenCalledWith('t1', 'Renamed');
  });
});
