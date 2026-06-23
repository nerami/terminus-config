import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GraphReadyGate } from './graph-ready-gate';
import { useGraphReadyPoll } from './graph-ready';

vi.mock('./graph-ready', () => ({ useGraphReadyPoll: vi.fn() }));

const mockPoll = vi.mocked(useGraphReadyPoll);

function renderGate() {
  return render(
    <GraphReadyGate apiUrl="http://x/api" apiKey={null}>
      <div>App content</div>
    </GraphReadyGate>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('GraphReadyGate', () => {
  it('holds the app behind the warming screen while checking', () => {
    mockPoll.mockReturnValue({ retry: vi.fn(), status: 'checking' });

    renderGate();

    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.getByText(/starting terminus/i)).toBeInTheDocument();
  });

  it('renders the app once the environment is ready', () => {
    mockPoll.mockReturnValue({ retry: vi.fn(), status: 'ready' });

    renderGate();

    expect(screen.getByText('App content')).toBeInTheDocument();
  });

  it('shows an error screen with a working retry when the server never comes up', () => {
    const retry = vi.fn();
    mockPoll.mockReturnValue({ retry, status: 'error' });

    renderGate();

    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
