import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { HaStatus } from '@/hooks/use-ha-status';

const mockStatus = vi.fn<() => HaStatus>();
vi.mock('@/hooks/use-ha-status', () => ({
  useHaStatus: () => mockStatus(),
}));

import { HaStatusIndicator } from './ha-status-indicator';

function status(overrides: Partial<HaStatus>): HaStatus {
  return {
    status: 'connecting',
    ha_version: null,
    terminus_version: null,
    last_connected: null,
    error: null,
    ...overrides,
  };
}

afterEach(() => mockStatus.mockReset());

describe('HaStatusIndicator', () => {
  it('shows a green dot when connected, labelled by status only', () => {
    mockStatus.mockReturnValue(status({ status: 'connected', ha_version: '2026.5.4' }));
    render(<HaStatusIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-label', 'Connected');
    expect(indicator.querySelector('span')?.className).toContain('bg-emerald-500');
  });

  it('shows an amber pulsing dot while connecting', () => {
    mockStatus.mockReturnValue(status({ status: 'connecting' }));
    render(<HaStatusIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-label', 'Connecting…');
    expect(indicator.querySelector('span')?.className).toContain('bg-amber-400');
  });

  it('shows a red dot when disconnected', () => {
    mockStatus.mockReturnValue(status({ status: 'disconnected' }));
    render(<HaStatusIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-label', 'Disconnected');
    expect(indicator.querySelector('span')?.className).toContain('bg-red-500');
  });
});
