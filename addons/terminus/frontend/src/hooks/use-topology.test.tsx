import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAutomationDetail, useTopology } from './use-topology';

import { fetchAutomation, fetchTopology } from '@/lib/ha-graph/api';
import { topologyAtom } from '@/lib/ha-graph/atoms';
import type { HaAutomation, Topology } from '@/lib/ha-graph/types';

vi.mock('@/lib/ha-graph/api', () => ({ fetchTopology: vi.fn(), fetchAutomation: vi.fn() }));

const mockFetchTopology = vi.mocked(fetchTopology);
const mockFetchAutomation = vi.mocked(fetchAutomation);

const AUTO: HaAutomation = {
  area_id: null,
  entity_id: 'automation.x',
  name: 'X',
  numeric_id: '5',
  references: { entities: ['light.a'], scenes: [], devices: [] },
};
const AUTO_NO_ID: HaAutomation = {
  area_id: null,
  entity_id: 'automation.y',
  name: 'Y',
  numeric_id: null,
  references: { entities: ['light.c'], scenes: [], devices: [] },
};
const TOPOLOGY: Topology = { areas: [], automations: [AUTO, AUTO_NO_ID], entities: [], scenes: [] };

function createWrapper() {
  const store = createStore();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <JotaiProvider store={store}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
  return { store, wrapper };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useTopology', () => {
  it('fetches the topology, populates topologyAtom, and reload refetches', async () => {
    mockFetchTopology.mockResolvedValue(TOPOLOGY);
    const { store, wrapper } = createWrapper();

    const { result } = renderHook(() => useTopology(true), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(store.get(topologyAtom)).toEqual(TOPOLOGY);
    expect(mockFetchTopology).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.reload();
    });
    await waitFor(() => expect(mockFetchTopology).toHaveBeenCalledTimes(2));
  });

  it('does not fetch while disabled', async () => {
    mockFetchTopology.mockResolvedValue(TOPOLOGY);
    const { wrapper } = createWrapper();

    renderHook(() => useTopology(false), { wrapper });

    await Promise.resolve();
    expect(mockFetchTopology).not.toHaveBeenCalled();
  });

  it('dedupes concurrent consumers into a single fetch', async () => {
    mockFetchTopology.mockResolvedValue(TOPOLOGY);
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => {
        useTopology(true);
        return useTopology(true);
      },
      { wrapper },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetchTopology).toHaveBeenCalledTimes(1);
  });
});

describe('useAutomationDetail', () => {
  it('returns null detail when no automation id is given', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAutomationDetail(null), { wrapper });
    expect(result.current.detail).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('falls back to topology references when the automation has no numeric id', () => {
    const { store, wrapper } = createWrapper();
    store.set(topologyAtom, TOPOLOGY);

    const { result } = renderHook(() => useAutomationDetail('automation.y'), { wrapper });

    expect(result.current.detail).toEqual({
      config: {},
      referenced: { entities: ['light.c'], scenes: [], devices: [] },
    });
    expect(mockFetchAutomation).not.toHaveBeenCalled();
  });

  it('uses the fetched references when config is present', async () => {
    mockFetchAutomation.mockResolvedValue({
      config: { alias: 'x' },
      referenced: { entities: ['light.b'], scenes: [], devices: [] },
    });
    const { store, wrapper } = createWrapper();
    store.set(topologyAtom, TOPOLOGY);

    const { result } = renderHook(() => useAutomationDetail('automation.x'), { wrapper });

    await waitFor(() => expect(result.current.detail).not.toBeNull());
    expect(result.current.detail?.config).toEqual({ alias: 'x' });
    expect(result.current.detail?.referenced.entities).toEqual(['light.b']);
  });

  it('falls back to topology references when fetched config and refs are empty', async () => {
    mockFetchAutomation.mockResolvedValue({
      config: {},
      referenced: { entities: [], scenes: [], devices: [] },
    });
    const { store, wrapper } = createWrapper();
    store.set(topologyAtom, TOPOLOGY);

    const { result } = renderHook(() => useAutomationDetail('automation.x'), { wrapper });

    await waitFor(() => expect(result.current.detail).not.toBeNull());
    expect(result.current.detail?.referenced.entities).toEqual(['light.a']);
  });

  it('falls back and reports the error when the fetch fails', async () => {
    mockFetchAutomation.mockRejectedValue(new Error('nope'));
    const { store, wrapper } = createWrapper();
    store.set(topologyAtom, TOPOLOGY);

    const { result } = renderHook(() => useAutomationDetail('automation.x'), { wrapper });

    await waitFor(() => expect(result.current.error).toBe('nope'));
    expect(result.current.detail).toEqual({
      config: {},
      referenced: { entities: ['light.a'], scenes: [], devices: [] },
    });
  });
});
