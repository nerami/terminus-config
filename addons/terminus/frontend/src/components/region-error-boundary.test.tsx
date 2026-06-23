import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RegionErrorBoundary } from './error-fallback';

function Boom(): never {
  throw new Error('kaboom');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RegionErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <RegionErrorBoundary title="never seen">
        <div>healthy</div>
      </RegionErrorBoundary>,
    );
    expect(screen.getByText('healthy')).toBeInTheDocument();
    expect(screen.queryByText('never seen')).not.toBeInTheDocument();
  });

  it('catches a render crash and shows the scoped fallback with its title and message', () => {
    // React logs the caught error; silence it so the test output stays clean.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RegionErrorBoundary title="Topology failed to render" message="Reloading should recover it.">
        <Boom />
      </RegionErrorBoundary>,
    );

    expect(screen.getByText('Topology failed to render')).toBeInTheDocument();
    expect(screen.getByText('Reloading should recover it.')).toBeInTheDocument();
  });

  it('reloads the window when retry is clicked after a crash', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(
      <RegionErrorBoundary title="x">
        <Boom />
      </RegionErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: /reload/i }));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
