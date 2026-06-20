import { act, renderHook } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import React from 'react';
import { describe, expect, it } from 'vitest';

import type { Topology } from './types';

import { entityModalAtom, graphViewAtom, selectedNodeAtom, topologyAtom } from './atoms';
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

function setup(initialView: Parameters<ReturnType<typeof createStore>['set']>[1] = { kind: 'areas' }) {
  const store = createStore();
  store.set(topologyAtom, FIXTURE);
  store.set(graphViewAtom, initialView as never);
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(JotaiProvider, { store }, children);
  const view = renderHook(() => useTopologyGraph(), { wrapper });
  return { store, ...view };
}

describe('useTopologyGraph', () => {
  it('drills into an area on a single click', () => {
    const { result, store } = setup({ kind: 'areas' });
    act(() =>
      result.current.activate({
        id: 'area:living_room',
        data: { kind: 'area', label: 'Living Room', areaId: 'living_room', interactive: true },
      }),
    );
    expect(store.get(graphViewAtom)).toEqual({ kind: 'area', areaId: 'living_room' });
  });

  it('selects on first click, then opens the entity modal on the second', () => {
    const { result, store } = setup({ kind: 'area', areaId: 'living_room' });
    const node = {
      id: 'light.lr_led_strip',
      data: { kind: 'entity' as const, label: 'LED Strip', entityId: 'light.lr_led_strip', interactive: true },
    };

    act(() => result.current.activate(node));
    expect(store.get(selectedNodeAtom)).toBe('light.lr_led_strip');
    expect(store.get(entityModalAtom)).toBeNull();

    act(() => result.current.activate(node));
    expect(store.get(entityModalAtom)).toBe('light.lr_led_strip');
  });

  it('highlights the selected node and its direct neighbours', () => {
    const { rerender, result } = setup({ kind: 'area', areaId: 'living_room' });
    // The scene controls the LED strip, so selecting the scene should highlight it.
    act(() =>
      result.current.activate({
        id: 'scene.lr_dim',
        data: { kind: 'scene', label: 'Dim', sceneId: 'scene.lr_dim', entityId: 'scene.lr_dim', interactive: true },
      }),
    );
    rerender();
    const set = result.current.highlightSet;
    expect(set).not.toBeNull();
    expect(set?.has('scene.lr_dim')).toBe(true);
    expect(set?.has('light.lr_led_strip')).toBe(true);
    expect(result.current.isUpstreamMode).toBe(false);
  });
});
