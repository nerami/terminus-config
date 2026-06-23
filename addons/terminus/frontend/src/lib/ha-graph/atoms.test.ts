import { createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';

import {
  closeTopologyAtom,
  enterFullscreenAtom,
  exitFullscreenAtom,
  layoutToPanels,
  openTopologyAtom,
  panelLayoutAtom,
  panelsToLayout,
} from './atoms';

afterEach(() => {
  window.localStorage.clear();
});

describe('panelLayoutAtom', () => {
  it('persists to terminus-panel-layout so it survives a reload', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    expect(window.localStorage.getItem('terminus-panel-layout')).toBe('"split"');
  });
});

describe('layout action atoms', () => {
  it('openTopology: chat-full -> split, otherwise unchanged', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'chat-full');
    store.set(openTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('split');
    store.set(panelLayoutAtom, 'topology-full');
    store.set(openTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('closeTopology -> chat-full from any state', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'topology-full');
    store.set(closeTopologyAtom);
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });

  it('enterFullscreen -> topology-full from any state', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'split');
    store.set(enterFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('topology-full');
  });

  it('exitFullscreen: topology-full -> split, otherwise unchanged', () => {
    const store = createStore();
    store.set(panelLayoutAtom, 'topology-full');
    store.set(exitFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('split');
    store.set(panelLayoutAtom, 'chat-full');
    store.set(exitFullscreenAtom);
    expect(store.get(panelLayoutAtom)).toBe('chat-full');
  });
});

describe('layout <-> panel names', () => {
  it('layoutToPanels maps each layout to its visible panels', () => {
    expect(layoutToPanels('chat-full')).toEqual(['chat']);
    expect(layoutToPanels('topology-full')).toEqual(['topology']);
    expect(layoutToPanels('split')).toEqual(['chat', 'topology']);
  });

  it('panelsToLayout is order-independent and tolerant of garbage', () => {
    expect(panelsToLayout(['chat', 'topology'])).toBe('split');
    expect(panelsToLayout(['topology', 'chat'])).toBe('split');
    expect(panelsToLayout(['topology'])).toBe('topology-full');
    expect(panelsToLayout(['chat'])).toBe('chat-full');
    expect(panelsToLayout([])).toBe('chat-full');
    expect(panelsToLayout(null)).toBe('chat-full');
    expect(panelsToLayout(['bogus', 'chat', 'chat'])).toBe('chat-full');
  });
});
