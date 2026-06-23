import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Topology } from './types';

import { entityModalAtom, selectedNodeAtom } from './atoms';
import { topologyQueryOptions } from './queries';
import { useTopologyGraph } from './use-topology-graph';

const FIXTURE: Topology = {
  areas: [{ area_id: 'living_room', name: 'Living Room' }],
  entities: [
    {
      entity_id: 'light.lr_led_strip',
      name: 'LED Strip',
      domain: 'light',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'switch.lr_lamp',
      name: 'Floor Lamp',
      domain: 'switch',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    {
      entity_id: 'scene.lr_dim',
      name: 'Dim',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
  ],
  automations: [],
};

/**
 * Combines the nuqs testing adapter (for ?area/group/scene/automation URL state)
 * with a Jotai Provider (for selectedNodeAtom/entityModalAtom) — dual-provider
 * shape mirrors use-resizable-split.test.tsx.
 */
function makeWrapper(
  store: ReturnType<typeof createStore>,
  client: QueryClient,
  searchParams: string,
  onUrlUpdate: OnUrlUpdateFunction,
) {
  const NuqsWrapper = withNuqsTestingAdapter({ searchParams, onUrlUpdate });
  return ({ children }: { children: ReactNode }) => (
    <NuqsWrapper>
      <QueryClientProvider client={client}>
        <JotaiProvider store={store}>{children}</JotaiProvider>
      </QueryClientProvider>
    </NuqsWrapper>
  );
}

function setup(searchParams = '') {
  const store = createStore();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(topologyQueryOptions().queryKey, FIXTURE);
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
  const wrapper = makeWrapper(store, client, searchParams, onUrlUpdate);
  const view = renderHook(() => useTopologyGraph(), { wrapper });
  return { store, onUrlUpdate, ...view };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useTopologyGraph', () => {
  it('drills into an area on a single click', async () => {
    // Seed view = {kind:'areas'} → no URL params needed (default)
    const { onUrlUpdate, result } = setup('');
    await act(async () => {
      result.current.activate({
        id: 'area:living_room',
        data: { kind: 'area', label: 'Living Room', areaId: 'living_room', interactive: true },
      });
      await vi.runAllTimersAsync();
    });
    // Drill-in to area writes ?area=living_room
    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('area=living_room');
  });

  it('selects on first click, then opens the entity modal on the second', async () => {
    // Seed view = {kind:'area', areaId:'living_room'} → ?area=living_room
    const { result, store } = setup('?area=living_room');
    const node = {
      id: 'light.lr_led_strip',
      data: { kind: 'entity' as const, label: 'LED Strip', entityId: 'light.lr_led_strip', interactive: true },
    };

    await act(async () => {
      result.current.activate(node);
      await vi.runAllTimersAsync();
    });
    expect(store.get(selectedNodeAtom)).toBe('light.lr_led_strip');
    expect(store.get(entityModalAtom)).toBeNull();

    await act(async () => {
      result.current.activate(node);
      await vi.runAllTimersAsync();
    });
    expect(store.get(entityModalAtom)).toBe('light.lr_led_strip');
  });

  it('flags a deleted automation as not found and suppresses the hint', () => {
    const { result } = setup('?group=automations&automation=automation.ghost');
    expect(result.current.notFoundKind).toBe('automation');
    expect(result.current.showAutomationHint).toBe(false);
  });

  it('reports no missing target for a healthy list view', () => {
    const { result } = setup('?group=automations');
    expect(result.current.notFoundKind).toBeNull();
  });

  it('highlights the selected node and its direct neighbours', async () => {
    // Seed view = {kind:'area', areaId:'living_room'} → ?area=living_room
    const { rerender, result } = setup('?area=living_room');
    // The scene controls the LED strip, so selecting the scene should highlight it.
    await act(async () => {
      result.current.activate({
        id: 'scene.lr_dim',
        data: { kind: 'scene', label: 'Dim', sceneId: 'scene.lr_dim', entityId: 'scene.lr_dim', interactive: true },
      });
      await vi.runAllTimersAsync();
    });
    rerender();
    const set = result.current.highlightSet;
    expect(set).not.toBeNull();
    expect(set?.has('scene.lr_dim')).toBe(true);
    expect(set?.has('light.lr_led_strip')).toBe(true);
    expect(result.current.isUpstreamMode).toBe(false);
  });
});
