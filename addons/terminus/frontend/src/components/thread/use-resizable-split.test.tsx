import { act, renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { panelLayoutAtom } from '@/lib/ha-graph/atoms';
import { splitFractionAtom } from '@/lib/settings';

import { useResizableSplit } from './use-resizable-split';

function wrapperWith(store: ReturnType<typeof createStore>) {
  return ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
}

describe('useResizableSplit', () => {
  it('is split, collapsible, and resizable when layout is split on desktop', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    expect(result.current.isSplit).toBe(true);
    expect(result.current.collapsible).toBe(true);
    expect(result.current.canResize).toBe(true);
  });

  it('keeps panels collapsible when only an artifact occupies the right panel (so closing it returns chat to full width)', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'chat-full', artifactOpen: true, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    // Panels must stay collapsible regardless of layout: applyMode collapses the
    // right panel to reach chat-full, and collapse() no-ops on a non-collapsible
    // panel — which was the bug.
    expect(result.current.collapsible).toBe(true);
  });

  it('disables the divider (canResize false) when an artifact, not topology, occupies the right panel', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'chat-full', artifactOpen: true, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    expect(result.current.canResize).toBe(false);
  });

  it('drag that collapses topology -> closes topology (chat-full)', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    act(() => result.current.onLayoutChanged({ chat: 100, topology: 0 }));
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });

  it('drag that collapses chat -> topology fullscreen', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    act(() => result.current.onLayoutChanged({ chat: 0, topology: 100 }));
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('a plain split drag persists the ratio and leaves the layout', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    const { result } = renderHook(() => useResizableSplit({ layout: 'split', artifactOpen: false, isMobile: false }), {
      wrapper: wrapperWith(store),
    });
    act(() => result.current.onLayoutChanged({ chat: 60, topology: 40 }));
    expect(store.get(splitFractionAtom)).toBe(0.6);
    expect(store.get(panelLayoutAtom)).toBe('split');
  });

  it('resize in artifact-only state does not flip layout to split (persists ratio only)', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    const { result } = renderHook(
      () => useResizableSplit({ layout: 'chat-full', artifactOpen: true, isMobile: false }),
      { wrapper: wrapperWith(store) },
    );
    act(() => result.current.onLayoutChanged({ chat: 60, topology: 40 }));
    // Layout must NOT have been mutated to 'split'
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
    // Ratio must still be persisted
    expect(store.get(splitFractionAtom)).toBe(0.6);
  });
});
