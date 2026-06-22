import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorScreen } from './error-screen';

describe('ErrorScreen', () => {
  it('renders the title and message and fires onRetry when the button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorScreen title="Boom" message="It broke" onRetry={onRetry} retryLabel="Reload" />);

    expect(screen.getByText('Boom')).toBeInTheDocument();
    expect(screen.getByText('It broke')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reload/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the button when no onRetry is given', () => {
    render(<ErrorScreen title="No action" />);
    expect(screen.getByText('No action')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
