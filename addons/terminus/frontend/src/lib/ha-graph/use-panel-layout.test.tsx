// src/lib/ha-graph/use-panel-layout.test.tsx
import { act, renderHook } from '@testing-library/react';
import { type OnUrlUpdateFunction, withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePanelLayout } from './use-panel-layout';

function renderLayout(search = '', onUrlUpdate?: OnUrlUpdateFunction) {
  return renderHook(() => usePanelLayout(), {
    // hasMemory: true makes the adapter track URL updates in memory so that
    // act() → assert() sequences see the updated state. Required for nuqs 2.x.
    wrapper: withNuqsTestingAdapter({ searchParams: search, hasMemory: true, onUrlUpdate }),
  });
}

describe('usePanelLayout', () => {
  it('defaults to chat when ?layout is absent or garbage', () => {
    expect(renderLayout('').result.current.layout).toBe('chat');
    expect(renderLayout('?layout=bogus').result.current.layout).toBe('chat');
  });

  it('reads each token straight through', () => {
    expect(renderLayout('?layout=topology').result.current.layout).toBe('topology');
    expect(renderLayout('?layout=split').result.current.layout).toBe('split');
  });

  it('openTopology: chat -> split, otherwise unchanged', async () => {
    const split = renderLayout('?layout=topology');
    await act(async () => split.result.current.openTopology());
    expect(split.result.current.layout).toBe('topology');

    const open = renderLayout('');
    await act(async () => open.result.current.openTopology());
    expect(open.result.current.layout).toBe('split');
  });

  it('closeTopology -> chat; enterFullscreen -> topology', async () => {
    const r = renderLayout('?layout=split');
    await act(async () => r.result.current.enterFullscreen());
    expect(r.result.current.layout).toBe('topology');
    await act(async () => r.result.current.closeTopology());
    expect(r.result.current.layout).toBe('chat');
  });

  it('exitFullscreen: topology -> split, otherwise unchanged', async () => {
    const r = renderLayout('?layout=topology');
    await act(async () => r.result.current.exitFullscreen());
    expect(r.result.current.layout).toBe('split');
    await act(async () => r.result.current.exitFullscreen());
    expect(r.result.current.layout).toBe('split');
  });

  describe('view-param coupling (fake timers)', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('closeTopology clears the view params along with setting layout=chat', async () => {
      const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
      // Seed ALL four view params so none of the not.toContain assertions are vacuous.
      const { result } = renderLayout('?layout=split&group=scenes&area=a1&scene=s1&automation=x1', onUrlUpdate);
      await act(async () => {
        result.current.closeTopology();
        await vi.runAllTimersAsync();
      });
      const qs = onUrlUpdate.mock.calls.at(-1)![0].queryString;
      expect(qs).toContain('layout=chat');
      expect(qs).not.toContain('group=');
      expect(qs).not.toContain('area=');
      expect(qs).not.toContain('scene=');
      expect(qs).not.toContain('automation=');
    });

    it('enterFullscreen leaves existing view params intact', async () => {
      const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
      const { result } = renderLayout('?layout=split&area=a1', onUrlUpdate);
      await act(async () => {
        result.current.enterFullscreen();
        await vi.runAllTimersAsync();
      });
      const qs = onUrlUpdate.mock.calls.at(-1)![0].queryString;
      expect(qs).toContain('layout=topology');
      expect(qs).toContain('area=a1');
    });

    it('openTopology leaves existing view params intact', async () => {
      const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
      // Start from chat with an area param already set; openTopology should go
      // chat→split and preserve area=a1.
      const { result } = renderLayout('?layout=chat&area=a1', onUrlUpdate);
      await act(async () => {
        result.current.openTopology();
        await vi.runAllTimersAsync();
      });
      const qs = onUrlUpdate.mock.calls.at(-1)![0].queryString;
      expect(qs).toContain('layout=split');
      expect(qs).toContain('area=a1');
    });
  });
});
