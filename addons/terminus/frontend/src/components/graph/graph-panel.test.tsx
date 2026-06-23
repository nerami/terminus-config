import { act, fireEvent, render, screen } from '@testing-library/react';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let mobile = false;

vi.mock('@/hooks/use-topology', () => ({
  useTopology: () => ({ error: null, loading: false, reload: vi.fn() }),
}));
vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => mobile }));

import { GraphPanel } from './graph-panel';

function renderPanel(searchParams = '') {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
  render(<GraphPanel />, {
    wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate }),
  });
  return { onUrlUpdate };
}

beforeEach(() => {
  mobile = false;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('GraphPanel', () => {
  it('shows "Open chat" in full screen and switches to split view on desktop', async () => {
    const { onUrlUpdate } = renderPanel('?layout=topology');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /open chat/i }));
      await vi.runAllTimersAsync();
    });

    // Desktop: exit full screen but keep the diagram open (split view).
    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=split');
  });

  it('closes the panel on mobile when "Open chat" is clicked', async () => {
    mobile = true;
    const { onUrlUpdate } = renderPanel('?layout=topology');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /open chat/i }));
      await vi.runAllTimersAsync();
    });

    // Mobile has no split view: go back to the chat entirely.
    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=chat');
  });

  it('hides "Open chat" in split view on desktop', () => {
    renderPanel('?layout=split');

    expect(screen.queryByRole('button', { name: /open chat/i })).not.toBeInTheDocument();
  });

  it('shows "Open chat" on mobile even when not full screen', () => {
    mobile = true;
    renderPanel('?layout=split');

    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
  });
});
