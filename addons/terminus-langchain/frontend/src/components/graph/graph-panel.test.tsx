import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mobile = false;

vi.mock('@/hooks/use-topology', () => ({
  useTopology: () => ({ error: null, loading: false, reload: vi.fn() }),
}));
vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => mobile }));

import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';

import { GraphPanel } from './graph-panel';

function renderPanel(store: ReturnType<typeof createStore>) {
  return render(
    <Provider store={store}>
      <GraphPanel />
    </Provider>,
  );
}

function openStore(fullscreen: boolean) {
  const store = createStore();
  store.set(graphPanelOpenAtom, true);
  store.set(graphFullscreenAtom, fullscreen);
  return store;
}

beforeEach(() => {
  mobile = false;
});

describe('GraphPanel', () => {
  it('shows "Open chat" in full screen and switches to split view on desktop', () => {
    const store = openStore(true);
    renderPanel(store);

    fireEvent.click(screen.getByRole('button', { name: /open chat/i }));

    // Desktop: exit full screen but keep the diagram open (split view).
    expect(store.get(graphFullscreenAtom)).toBe(false);
    expect(store.get(graphPanelOpenAtom)).toBe(true);
  });

  it('closes the panel on mobile when "Open chat" is clicked', () => {
    mobile = true;
    const store = openStore(true);
    renderPanel(store);

    fireEvent.click(screen.getByRole('button', { name: /open chat/i }));

    // Mobile has no split view: go back to the chat entirely.
    expect(store.get(graphPanelOpenAtom)).toBe(false);
    expect(store.get(graphFullscreenAtom)).toBe(false);
  });

  it('hides "Open chat" in split view on desktop', () => {
    const store = openStore(false);
    renderPanel(store);

    expect(screen.queryByRole('button', { name: /open chat/i })).not.toBeInTheDocument();
  });

  it('shows "Open chat" on mobile even when not full screen', () => {
    mobile = true;
    const store = openStore(false);
    renderPanel(store);

    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
  });
});
