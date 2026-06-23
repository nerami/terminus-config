import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HaStatusGate } from './ha-status-gate';

import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockGet = vi.mocked(http.get);

function renderGated() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <HaStatusGate>
        <div>App content</div>
      </HaStatusGate>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('HaStatusGate', () => {
  it('shows the loading screen until the status check settles, then renders the app', async () => {
    let settle!: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      settle = resolve;
    });
    mockGet.mockReturnValue(pending as never);

    renderGated();

    // While the status request is in flight, the app is gated behind the loader.
    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.getByText(/starting terminus/i)).toBeInTheDocument();

    settle({ data: { status: 'connected' } });

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
  });

  it('renders the app even when the status check fails (error still settles the gate)', async () => {
    mockGet.mockRejectedValue(new Error('network down'));

    renderGated();

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
  });
});
