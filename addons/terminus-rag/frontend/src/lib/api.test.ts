import { afterEach, expect, test, vi } from 'vitest';

import { callTool, getTools } from './api';

afterEach(() => vi.restoreAllMocks());

test('getTools fetches the relative tools URL and returns the tools array', async () => {
  const tools = [{ name: 'list_kinds', description: 'k', inputSchema: { type: 'object' } }];
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ tools }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const result = await getTools();
  expect(fetchMock).toHaveBeenCalledWith('./playground/tools');
  expect(result).toEqual(tools);
});

test('callTool posts tool+args to the relative call URL', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ result: [1, 2] }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const result = await callTool('search_ha', { query: 'lamp' });
  expect(fetchMock).toHaveBeenCalledWith('./playground/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'search_ha', args: { query: 'lamp' } }),
  });
  expect(result).toEqual({ result: [1, 2] });
});

test('getTools throws on non-ok response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  await expect(getTools()).rejects.toThrow(/500/);
});

test('callTool returns error field from body on non-ok response', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'boom' }),
    }),
  );
  const result = await callTool('search_ha', { query: 'lamp' });
  expect(result).toEqual({ error: 'boom' });
});

test('callTool falls back to status message when body has no error field', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    }),
  );
  const result = await callTool('search_ha', { query: 'lamp' });
  expect(result).toEqual({ error: 'call failed: 500' });
});
