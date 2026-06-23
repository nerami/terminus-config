import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { checkGraphStatus, useGraphReadyPoll } from './graph-ready';

import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockGet = vi.mocked(http.get);

afterEach(() => {
  vi.clearAllMocks();
});

describe('checkGraphStatus', () => {
  it('returns true and sends auth headers to /info on a 2xx response', async () => {
    mockGet.mockResolvedValue({ status: 200 });
    const ok = await checkGraphStatus('http://x/api', 'secret', 'langsmith-api-key');
    expect(ok).toBe(true);
    expect(mockGet).toHaveBeenCalledWith('http://x/api/info', {
      headers: { 'X-Api-Key': 'secret', 'X-Auth-Scheme': 'langsmith-api-key' },
    });
  });

  it('returns false when the request throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockRejectedValue(new Error('503'));
    expect(await checkGraphStatus('http://x/api', null)).toBe(false);
  });
});

describe('useGraphReadyPoll', () => {
  it('reports ready once the server answers', async () => {
    mockGet.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useGraphReadyPoll('http://x/api', null));

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('reports error after the attempt cap with no success', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockRejectedValue(new Error('down'));

    const { result } = renderHook(() =>
      useGraphReadyPoll('http://x/api', null, undefined, { maxAttempts: 3, intervalMs: 1 }),
    );

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(mockGet).toHaveBeenCalledTimes(3);
  });

  it('retry restarts polling and can reach ready', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockRejectedValue(new Error('down'));

    const { result } = renderHook(() =>
      useGraphReadyPoll('http://x/api', null, undefined, { maxAttempts: 2, intervalMs: 1 }),
    );

    await waitFor(() => expect(result.current.status).toBe('error'));

    mockGet.mockReset();
    mockGet.mockResolvedValue({ status: 200 });
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('ready'));
  });
});
