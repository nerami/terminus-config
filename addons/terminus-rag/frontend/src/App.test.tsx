import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import App from './App';

afterEach(() => vi.restoreAllMocks());

const tools = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'search_ha',
    description: 'Semantic search',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
  },
];

test('loads tools, runs the selected one, and shows the result', async () => {
  const fetchMock = vi
    .fn()
    // getTools
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tools }) })
    // health header (App fetches ./health)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok', indexed: 2, model: 'bge' }) })
    // callTool
    .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [{ kind: 'entity', count: 2 }] }) });
  vi.stubGlobal('fetch', fetchMock);

  render(<App />);

  // Tools load and appear.
  await waitFor(() => expect(screen.getByText('list_kinds')).toBeInTheDocument());

  // list_kinds has no args; run it.
  await userEvent.click(screen.getByText('list_kinds'));
  await userEvent.click(screen.getByRole('button', { name: /run/i }));

  await waitFor(() => expect(screen.getByText(/"kind": "entity"/)).toBeInTheDocument());
});
