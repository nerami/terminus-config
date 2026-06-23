import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorFallback } from './error-fallback';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorFallback', () => {
  it('renders the title and message', () => {
    render(<ErrorFallback title="Topology failed to render" message="Reloading should recover it." />);
    expect(screen.getByText('Topology failed to render')).toBeInTheDocument();
    expect(screen.getByText('Reloading should recover it.')).toBeInTheDocument();
  });

  it('renders without a message when none is given', () => {
    render(<ErrorFallback title="Just a title" />);
    expect(screen.getByText('Just a title')).toBeInTheDocument();
  });

  it('calls the provided onRetry handler when the retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorFallback title="x" onRetry={onRetry} retryLabel="Try again" />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('defaults retry to a full window reload', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });
    render(<ErrorFallback title="x" />);
    fireEvent.click(screen.getByRole('button', { name: /reload/i }));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
