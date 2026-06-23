import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { attachAuthHeaders } from './http';

import { getApiKey } from '@/lib/api-key';

vi.mock('@/lib/api-key', () => ({ getApiKey: vi.fn() }));

const mockGetApiKey = vi.mocked(getApiKey);

function makeConfig(headers: Record<string, string> = {}): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders(headers) } as InternalAxiosRequestConfig;
}

afterEach(() => {
  vi.clearAllMocks();
  window.history.pushState({}, '', '/');
});

describe('attachAuthHeaders', () => {
  it('attaches X-Api-Key from getApiKey when present', () => {
    mockGetApiKey.mockReturnValue('secret');
    const config = attachAuthHeaders(makeConfig());
    expect(config.headers.get('X-Api-Key')).toBe('secret');
  });

  it('attaches X-Auth-Scheme from the authScheme query param', () => {
    mockGetApiKey.mockReturnValue(null);
    window.history.pushState({}, '', '/?authScheme=langsmith-api-key');
    const config = attachAuthHeaders(makeConfig());
    expect(config.headers.get('X-Auth-Scheme')).toBe('langsmith-api-key');
  });

  it('attaches no auth headers when none are available', () => {
    mockGetApiKey.mockReturnValue(null);
    const config = attachAuthHeaders(makeConfig());
    expect(config.headers.has('X-Api-Key')).toBe(false);
    expect(config.headers.has('X-Auth-Scheme')).toBe(false);
  });

  it('does not overwrite a header the caller already set', () => {
    mockGetApiKey.mockReturnValue('secret');
    const config = attachAuthHeaders(makeConfig({ 'X-Api-Key': 'caller' }));
    expect(config.headers.get('X-Api-Key')).toBe('caller');
  });
});
