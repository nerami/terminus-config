import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { splitFractionAtom } from '@/lib/settings';

import { useResizableSplit } from './use-resizable-split';

/**
 * Combines the nuqs testing adapter (for ?layout URL state) with a Jotai
 * Provider (for splitFractionAtom). Both providers must coexist because the
 * hook owns both — nuqs drives the layout transitions and Jotai persists the
 * split ratio.
 */
function makeWrapper(store: ReturnType<typeof createStore>, searchParams: string, onUrlUpdate: OnUrlUpdateFunction) {
  const NuqsWrapper = withNuqsTestingAdapter({ searchParams, onUrlUpdate });
  return ({ children }: { children: ReactNode }) => (
    <NuqsWrapper>
      <Provider store={store}>{children}</Provider>
    </NuqsWrapper>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useResizableSplit', () => {
  it('is split, collapsible, and resizable when layout is split on desktop', () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=split', onUrlUpdate),
    });
    expect(result.current.isSplit).toBe(true);
    expect(result.current.collapsible).toBe(true);
    expect(result.current.canResize).toBe(true);
  });

  it('keeps panels collapsible when only an artifact occupies the right panel (so closing it returns chat to full width)', () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'chat', artifactOpen: true, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=chat', onUrlUpdate),
    });
    // Panels must stay collapsible regardless of layout: applyMode collapses the
    // right panel to reach chat, and collapse() no-ops on a non-collapsible
    // panel — which was the bug.
    expect(result.current.collapsible).toBe(true);
  });

  it('disables the divider (canResize false) when an artifact, not topology, occupies the right panel', () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'chat', artifactOpen: true, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=chat', onUrlUpdate),
    });
    expect(result.current.canResize).toBe(false);
  });

  it('drag that collapses topology -> closes topology (chat)', async () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=split', onUrlUpdate),
    });
    await act(async () => {
      result.current.onLayoutChanged({ chat: 100, topology: 0 });
      await vi.runAllTimersAsync();
    });
    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=chat');
  });

  it('drag that collapses chat -> topology fullscreen', async () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=split', onUrlUpdate),
    });
    await act(async () => {
      result.current.onLayoutChanged({ chat: 0, topology: 100 });
      await vi.runAllTimersAsync();
    });
    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)![0].queryString).toContain('layout=topology');
  });

  it('a plain split drag persists the ratio and leaves the layout', async () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=split', onUrlUpdate),
    });
    await act(async () => {
      result.current.onLayoutChanged({ chat: 60, topology: 40 });
      await vi.runAllTimersAsync();
    });
    expect(store.get(splitFractionAtom)).toBe(0.6);
    // layout=split in URL — either no update fired or the last update still has split
    const calls = onUrlUpdate.mock.calls;
    if (calls.length > 0) {
      expect(calls.at(-1)![0].queryString).toContain('layout=split');
    }
  });

  it('resize in artifact-only state does not flip layout to split (persists ratio only)', async () => {
    const store = createStore();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { result } = renderHook(() => useResizableSplit({ layout: 'chat', artifactOpen: true, isMobile: false }), {
      wrapper: makeWrapper(store, '?layout=chat', onUrlUpdate),
    });
    await act(async () => {
      result.current.onLayoutChanged({ chat: 60, topology: 40 });
      await vi.runAllTimersAsync();
    });
    // Layout must NOT have been flipped to 'split' — no layout URL update should fire
    const calls = onUrlUpdate.mock.calls;
    if (calls.length > 0) {
      expect(calls.at(-1)![0].queryString).not.toContain('layout=split');
    }
    // Ratio must still be persisted
    expect(store.get(splitFractionAtom)).toBe(0.6);
  });
});
