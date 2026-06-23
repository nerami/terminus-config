import { describe, expect, it, vi } from 'vitest';

import {
  CHAT_PANEL_ID,
  deriveMode,
  targetLayout,
  TOPOLOGY_PANEL_ID,
  applyMode,
  type SplitRefs,
  actionFromDragged,
} from './split-layout';

describe('deriveMode', () => {
  it('is chat-only when nothing is open', () => {
    expect(deriveMode({ open: false, fullscreen: false, isMobile: false })).toBe('chat-only');
    expect(deriveMode({ open: false, fullscreen: true, isMobile: true })).toBe('chat-only');
  });

  it('is panel-only when open and either fullscreen or mobile', () => {
    expect(deriveMode({ open: true, fullscreen: true, isMobile: false })).toBe('panel-only');
    expect(deriveMode({ open: true, fullscreen: false, isMobile: true })).toBe('panel-only');
  });

  it('is split only when open on desktop and not fullscreen', () => {
    expect(deriveMode({ open: true, fullscreen: false, isMobile: false })).toBe('split');
  });
});

describe('targetLayout', () => {
  it('gives the chat the whole width when chat-only', () => {
    expect(targetLayout('chat-only', 0.4)).toEqual({ [CHAT_PANEL_ID]: 100, [TOPOLOGY_PANEL_ID]: 0 });
  });

  it('gives the panel the whole width when panel-only', () => {
    expect(targetLayout('panel-only', 0.4)).toEqual({ [CHAT_PANEL_ID]: 0, [TOPOLOGY_PANEL_ID]: 100 });
  });

  it('splits by the chat fraction', () => {
    expect(targetLayout('split', 0.4)).toEqual({ [CHAT_PANEL_ID]: 40, [TOPOLOGY_PANEL_ID]: 60 });
    expect(targetLayout('split', 0.55)).toEqual({ [CHAT_PANEL_ID]: 55, [TOPOLOGY_PANEL_ID]: 45 });
  });

  it('rounds split percentages to avoid floating-point noise', () => {
    expect(targetLayout('split', 0.33)).toEqual({ [CHAT_PANEL_ID]: 33, [TOPOLOGY_PANEL_ID]: 67 });
  });
});

function makeRefs(opts: { chatCollapsed?: boolean; rightCollapsed?: boolean } = {}) {
  const chat = { collapse: vi.fn(), expand: vi.fn(), isCollapsed: vi.fn(() => opts.chatCollapsed ?? false) };
  const right = { collapse: vi.fn(), expand: vi.fn(), isCollapsed: vi.fn(() => opts.rightCollapsed ?? false) };
  const group = { setLayout: vi.fn(), getLayout: vi.fn(() => ({})) };
  // The unused imperative methods (resize/getSize) are not needed for these assertions.
  return { refs: { group, chat, right } as unknown as SplitRefs, group, chat, right };
}

describe('applyMode', () => {
  it('no-ops when any ref is missing', () => {
    expect(() => applyMode('split', 0.4, { group: null, chat: null, right: null })).not.toThrow();
  });

  it('chat-only collapses the right panel', () => {
    const { refs, right } = makeRefs();
    applyMode('chat-only', 0.4, refs);
    expect(right.collapse).toHaveBeenCalledTimes(1);
  });

  it('panel-only expands a collapsed right panel then collapses the chat', () => {
    const { chat, refs, right } = makeRefs({ rightCollapsed: true });
    applyMode('panel-only', 0.4, refs);
    expect(right.expand).toHaveBeenCalledTimes(1);
    expect(chat.collapse).toHaveBeenCalledTimes(1);
  });

  it('split expands both collapsed panels then sets the layout', () => {
    const { chat, group, refs, right } = makeRefs({ chatCollapsed: true, rightCollapsed: true });
    applyMode('split', 0.55, refs);
    expect(chat.expand).toHaveBeenCalledTimes(1);
    expect(right.expand).toHaveBeenCalledTimes(1);
    expect(group.setLayout).toHaveBeenCalledWith({ chat: 55, topology: 45 });
  });
});

describe('actionFromDragged', () => {
  it('topology side collapsed -> close', () => {
    expect(actionFromDragged({ chat: 100, topology: 0 })).toBe('close');
  });
  it('chat side collapsed -> fullscreen', () => {
    expect(actionFromDragged({ chat: 0, topology: 100 })).toBe('fullscreen');
  });
  it('both sides present -> split', () => {
    expect(actionFromDragged({ chat: 60, topology: 40 })).toBe('split');
  });
});
