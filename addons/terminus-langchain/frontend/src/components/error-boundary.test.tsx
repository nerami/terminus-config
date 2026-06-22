import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from './error-boundary';

function Boom(): never {
  throw new Error('kaboom');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <div>healthy</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('catches a render crash, shows the Error screen, and reloads on retry', () => {
    // React logs the caught error; silence it so the test output stays clean.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    // The whole-app crash is contained; the Error screen offers a way back.
    expect(screen.getByText(/terminus hit a snag/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /reload/i });

    fireEvent.click(button);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
