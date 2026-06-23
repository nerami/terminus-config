import { afterEach, describe, expect, it, vi } from 'vitest';

import { checkGraphStatus, mapGraphReadyStatus } from './graph-ready';

import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockGet = vi.mocked(http.get);

afterEach(() => {
  vi.clearAllMocks();
});

describe('mapGraphReadyStatus', () => {
  it('is checking before any poll resolves', () => {
    expect(mapGraphReadyStatus(undefined, 0)).toBe('checking');
  });

  it('stays checking while polls fail under the cap', () => {
    expect(mapGraphReadyStatus(false, 1)).toBe('checking');
    expect(mapGraphReadyStatus(false, 39)).toBe('checking');
  });

  it('is ready as soon as a poll succeeds', () => {
    expect(mapGraphReadyStatus(true, 3)).toBe('ready');
  });

  it('errors once the attempt cap is reached without success', () => {
    expect(mapGraphReadyStatus(false, 40)).toBe('error');
  });

  it('prefers ready over error at the cap', () => {
    expect(mapGraphReadyStatus(true, 40)).toBe('ready');
  });
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
