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

test('shows the selected tool name + description on the left and the result on the right', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tools }) }) // getTools
    .mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok', indexed: 2, model: 'bge' }) }) // ./health
    .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [{ kind: 'entity', count: 2 }] }) }); // callTool
  vi.stubGlobal('fetch', fetchMock);

  render(<App />);

  // The playground title renders in the inset header.
  expect(screen.getByText(/terminus rag playground/i)).toBeInTheDocument();

  // The first tool auto-selects; its name (heading) + description render in the
  // left panel — distinct from the sidebar menu button of the same name.
  await waitFor(() => expect(screen.getByRole('heading', { name: 'list_kinds' })).toBeInTheDocument());
  expect(screen.getByText('Kinds and counts')).toBeInTheDocument();

  // Picking another tool in the sidebar swaps the left panel.
  await userEvent.click(screen.getByRole('button', { name: 'search_ha' }));
  expect(screen.getByRole('heading', { name: 'search_ha' })).toBeInTheDocument();
  expect(screen.getByText('Semantic search')).toBeInTheDocument();

  // Run a no-arg tool and see the result block on the right.
  await userEvent.click(screen.getByRole('button', { name: 'list_kinds' }));
  await userEvent.click(screen.getByRole('button', { name: /run/i }));
  await waitFor(() => expect(screen.getByText(/"kind": "entity"/)).toBeInTheDocument());
});
