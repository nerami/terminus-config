// src/lib/ha-graph/use-graph-view.test.tsx
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { selectedNodeAtom } from './atoms';
import { useGraphView, viewFromParams, viewToParams } from './use-graph-view';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function makeWrapper(store: ReturnType<typeof createStore>, searchParams: string, onUrlUpdate: OnUrlUpdateFunction) {
  const Nuqs = withNuqsTestingAdapter({ searchParams, onUrlUpdate });
  return ({ children }: { children: ReactNode }) => (
    <Nuqs>
      <Provider store={store}>{children}</Provider>
    </Nuqs>
  );
}

describe('viewFromParams', () => {
  it('maps params to the GraphView (areas default; area/scene/automation drill-down)', () => {
    expect(viewFromParams(null, null, null, null)).toEqual({ kind: 'areas' });
    expect(viewFromParams(null, 'a1', null, null)).toEqual({ kind: 'area', areaId: 'a1' });
    expect(viewFromParams(null, 'a1', 's1', null)).toEqual({ kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' });
    expect(viewFromParams('scenes', null, 's1', null)).toEqual({
      kind: 'scene',
      areaId: '',
      sceneId: 's1',
      via: 'scenes',
    });
    expect(viewFromParams('automations', null, null, 'x1')).toEqual({
      kind: 'automation',
      areaId: '',
      automationId: 'x1',
      via: 'automations',
    });
    expect(viewFromParams('entities', null, null, null)).toEqual({ kind: 'entities' });
  });
});

describe('viewToParams', () => {
  it('is the inverse: default area grouping omitted, ids only where relevant', () => {
    expect(viewToParams({ kind: 'areas' })).toEqual({ group: null, area: null, scene: null, automation: null });
    expect(viewToParams({ kind: 'area', areaId: 'a1' })).toEqual({
      group: null,
      area: 'a1',
      scene: null,
      automation: null,
    });
    expect(viewToParams({ kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' })).toEqual({
      group: null,
      area: 'a1',
      scene: 's1',
      automation: null,
    });
    expect(viewToParams({ kind: 'scenes' })).toEqual({ group: 'scenes', area: null, scene: null, automation: null });
    expect(viewToParams({ kind: 'automation', areaId: '', automationId: 'x1', via: 'automations' })).toEqual({
      group: 'automations',
      area: null,
      scene: null,
      automation: 'x1',
    });
  });

  it('round-trips every view through params and back', () => {
    for (const v of [
      { kind: 'areas' } as const,
      { kind: 'area', areaId: 'a1' } as const,
      { kind: 'scene', areaId: 'a1', sceneId: 's1', via: 'area' } as const,
      { kind: 'scene', areaId: '', sceneId: 's1', via: 'scenes' } as const,
      { kind: 'automation', areaId: 'a1', automationId: 'x1', via: 'area' } as const,
      { kind: 'automations' } as const,
      { kind: 'entities' } as const,
    ]) {
      const p = viewToParams(v);
      expect(viewFromParams(p.group, p.area, p.scene, p.automation)).toEqual(v);
    }
  });
});

describe('useGraphView', () => {
  it('derives the view from the URL params', () => {
    const store = createStore();
    const { result } = renderHook(() => useGraphView(), {
      wrapper: makeWrapper(store, '?area=a1', vi.fn<OnUrlUpdateFunction>()),
    });
    expect(result.current[0]).toEqual({ kind: 'area', areaId: 'a1' });
  });

  it('navigating writes the inverse params and clears the selected node', async () => {
    const store = createStore();
    store.set(selectedNodeAtom, 'node-7');
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useGraphView(), {
      wrapper: makeWrapper(store, '?area=a1', onUrlUpdate),
    });
    await act(async () => {
      result.current[1]({ kind: 'scene', areaId: 'a1', sceneId: 's9', via: 'area' });
      await vi.runAllTimersAsync();
    });
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('scene=s9');
    expect(store.get(selectedNodeAtom)).toBeNull();
  });
});
