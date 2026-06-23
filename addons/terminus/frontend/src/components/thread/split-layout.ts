import type { GroupImperativeHandle, Layout, PanelImperativeHandle } from 'react-resizable-panels';

/** Which of the three discrete layouts the split is currently in. */
export type SplitMode = 'chat-only' | 'panel-only' | 'split';

/** The atom/derived inputs the mode is computed from. */
export interface SplitInputs {
  /** Topology is fullscreen (chat hidden). */
  fullscreen: boolean;
  /** Viewport is below the desktop breakpoint (never shows the split). */
  isMobile: boolean;
  /** Right panel (topology or artifact) is open. */
  open: boolean;
}

// Must match the `id` props given to the two Panels in thread.tsx.
export const CHAT_PANEL_ID = 'chat';
export const TOPOLOGY_PANEL_ID = 'topology';

export function deriveMode({ fullscreen, isMobile, open }: SplitInputs): SplitMode {
  if (!open) return 'chat-only';
  if (fullscreen || isMobile) return 'panel-only';
  return 'split';
}

/** Percentage layout map for a mode; `fraction` is the chat column's share (0..1). */
export function targetLayout(mode: SplitMode, fraction: number): Layout {
  switch (mode) {
    case 'chat-only':
      return { [CHAT_PANEL_ID]: 100, [TOPOLOGY_PANEL_ID]: 0 };
    case 'panel-only':
      return { [CHAT_PANEL_ID]: 0, [TOPOLOGY_PANEL_ID]: 100 };
    case 'split': {
      // Round to 2dp so floating-point noise (e.g. 0.33*100) never reaches setLayout/persistence.
      const chatPercent = Math.round(fraction * 100 * 100) / 100;
      const topologyPercent = Math.round((1 - fraction) * 100 * 100) / 100;
      return { [CHAT_PANEL_ID]: chatPercent, [TOPOLOGY_PANEL_ID]: topologyPercent };
    }
  }
}

/** The three imperative handles the effect drives. Null until the panels mount. */
export interface SplitRefs {
  chat: PanelImperativeHandle | null;
  group: GroupImperativeHandle | null;
  right: PanelImperativeHandle | null;
}

/**
 * Drive the panels to match `mode`. Uses the library's blessed collapse/expand
 * to reach the 0%/100% edges (bypasses minSize) and setLayout only for the
 * in-range split ratio. Idempotent — collapse/expand no-op when already there.
 */
export function applyMode(mode: SplitMode, fraction: number, refs: SplitRefs): void {
  const { chat, group, right } = refs;
  if (!group || !chat || !right) return;
  switch (mode) {
    case 'chat-only':
      right.collapse();
      break;
    case 'panel-only':
      if (right.isCollapsed()) right.expand();
      chat.collapse();
      break;
    case 'split':
      if (chat.isCollapsed()) chat.expand();
      if (right.isCollapsed()) right.expand();
      group.setLayout(targetLayout('split', fraction));
      break;
  }
}

/** What a finished drag implies for the canonical layout. */
export type DragAction = 'close' | 'fullscreen' | 'split';

/**
 * Interpret a settled drag layout: a collapsed topology side means the user
 * dragged the topology closed; a collapsed chat side means they dragged chat
 * away (topology fullscreen); otherwise it's a plain resize within the split.
 */
export function actionFromDragged(layout: Layout): DragAction {
  if (layout[TOPOLOGY_PANEL_ID] === 0) return 'close';
  if (layout[CHAT_PANEL_ID] === 0) return 'fullscreen';
  return 'split';
}
