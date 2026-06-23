import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useHaStatus } from './use-ha-status';

import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockGet = vi.mocked(http.get);

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useHaStatus', () => {
  it('passes through the backend status on success', async () => {
    mockGet.mockResolvedValue({
      data: { status: 'connected', ha_version: '2026.5.4', last_connected: 'now', error: null },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useHaStatus(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('connected'));
    expect(result.current.ha_version).toBe('2026.5.4');
  });

  it('reports disconnected with the error message when the request fails', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useHaStatus(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('disconnected'));
    expect(result.current.error).toBe('Network Error');
    expect(result.current.ha_version).toBeNull();
  });

  it('preserves the last known ha_version when a later poll fails', async () => {
    const { client, wrapper } = createWrapper();
    client.setQueryData(['ha', 'status'], {
      status: 'connected',
      ha_version: '2026.5.4',
      last_connected: 'now',
      error: null,
    });
    mockGet.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useHaStatus(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('disconnected'));
    expect(result.current.ha_version).toBe('2026.5.4');
    expect(result.current.error).toBe('Network Error');
  });
});
