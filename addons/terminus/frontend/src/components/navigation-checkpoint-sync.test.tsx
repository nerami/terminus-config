// src/components/navigation-checkpoint-sync.test.tsx
import { render } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationCheckpointSync } from './navigation-checkpoint-sync';

import { CHECKPOINT_KEY } from '@/lib/navigation-checkpoint';

// useThreadId reads the router; stub it so the boundary mounts without a router.
vi.mock('@/hooks/use-thread-id', () => ({
  useThreadId: () => [null, vi.fn()],
}));

beforeEach(() => {
  // The component reads window.location directly (not nuqs state), so we need
  // jsdom's actual URL to carry the search params we want to assert against.
  // nuqs/adapters/testing stores params in memory and does NOT update window.location.
  window.history.replaceState({}, '', '/?layout=split');
});

afterEach(() => {
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('NavigationCheckpointSync', () => {
  it('write-through-persists the current relative location to localStorage on mount', () => {
    // withNuqsTestingAdapter satisfies the nuqs context that useQueryStates requires.
    render(<NavigationCheckpointSync />, {
      wrapper: withNuqsTestingAdapter({ searchParams: '?layout=split' }),
    });
    expect(window.localStorage.getItem(CHECKPOINT_KEY)).toContain('layout=split');
  });
});
