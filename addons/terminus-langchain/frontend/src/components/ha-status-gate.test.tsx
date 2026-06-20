import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HaStatusGate } from './ha-status-gate';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HaStatusGate', () => {
  it('shows the loading screen until the status check settles, then renders the app', async () => {
    let settle!: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      settle = resolve;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(() => pending),
    );

    render(
      <HaStatusGate>
        <div>App content</div>
      </HaStatusGate>,
    );

    // While the status request is in flight, the app is gated behind the loader.
    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.getByText(/starting terminus/i)).toBeInTheDocument();

    settle({ ok: true, json: async () => ({ status: 'connected' }) });

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
  });

  it('renders the app even when the status check fails (error still settles the gate)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('network down'))),
    );

    render(
      <HaStatusGate>
        <div>App content</div>
      </HaStatusGate>,
    );

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
  });
});
