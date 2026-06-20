import { act, renderHook } from '@testing-library/react';
import { useAtom, type WritableAtom } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';

import { graphFullscreenAtom, graphPanelOpenAtom } from './atoms';

afterEach(() => {
  window.localStorage.clear();
});

describe('topology view persistence', () => {
  // Leaving the Terminus tab and coming back reloads the app, discarding
  // in-memory state. The panel-open and full-screen flags must be backed by
  // localStorage so the topology view returns exactly as the user left it.
  it.each([
    ['terminus-graph-panel-open', graphPanelOpenAtom],
    ['terminus-graph-fullscreen', graphFullscreenAtom],
  ] as [string, WritableAtom<boolean, [boolean], void>][])(
    'persists %s to localStorage so it survives a reload',
    (key, viewAtom) => {
      const { result } = renderHook(() => useAtom(viewAtom));
      act(() => result.current[1](true));
      expect(window.localStorage.getItem(key)).toBe('true');
    },
  );
});
