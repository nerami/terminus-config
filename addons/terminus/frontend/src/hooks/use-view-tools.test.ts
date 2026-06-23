import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useViewTools } from './use-view-tools';

afterEach(() => {
  window.localStorage.clear();
});

describe('useViewTools', () => {
  it('defaults to true (tool calls shown) when nothing is stored', () => {
    const { result } = renderHook(() => useViewTools());
    expect(result.current[0]).toBe(true);
  });

  it('persists the value to localStorage via the setter', () => {
    const { result } = renderHook(() => useViewTools());
    act(() => result.current[1](false));
    expect(result.current[0]).toBe(false);
    expect(window.localStorage.getItem('terminus-view-tools')).toBe('false');
  });
});
