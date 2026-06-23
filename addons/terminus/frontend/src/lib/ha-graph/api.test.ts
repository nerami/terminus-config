import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchAutomation, fetchTopology } from './api';
import type { Topology } from './types';

import { http } from '@/lib/http';
import { endpoints } from '@/runtime-config';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockGet = vi.mocked(http.get);

const EMPTY_TOPOLOGY: Topology = { areas: [], automations: [], entities: [], scenes: [] };

function axiosError(response: unknown, message = 'Request failed'): unknown {
  return { isAxiosError: true, message, response };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('fetchTopology', () => {
  it('returns the response data from the topology endpoint', async () => {
    mockGet.mockResolvedValue({ data: EMPTY_TOPOLOGY });
    const result = await fetchTopology();
    expect(result).toEqual(EMPTY_TOPOLOGY);
    expect(mockGet).toHaveBeenCalledWith(endpoints().haTopologyUrl);
  });

  it('throws the body.error message on an error response', async () => {
    mockGet.mockRejectedValue(axiosError({ data: { error: 'boom' }, status: 500, statusText: 'Server Error' }));
    await expect(fetchTopology()).rejects.toThrow('boom');
  });

  it('falls back to the status line when the error body has no error field', async () => {
    mockGet.mockRejectedValue(axiosError({ data: {}, status: 503, statusText: 'Service Unavailable' }));
    await expect(fetchTopology()).rejects.toThrow('503 Service Unavailable');
  });

  it('falls back to the error message when there is no response (network error)', async () => {
    mockGet.mockRejectedValue(axiosError(undefined, 'Network Error'));
    await expect(fetchTopology()).rejects.toThrow('Network Error');
  });
});

describe('fetchAutomation', () => {
  it('requests the automation endpoint for the given ids', async () => {
    mockGet.mockResolvedValue({ data: { config: {}, referenced: { entities: [], scenes: [], devices: [] } } });
    await fetchAutomation('42', 'automation.kitchen');
    expect(mockGet).toHaveBeenCalledWith(endpoints().haAutomationUrl('42', 'automation.kitchen'));
  });
});
