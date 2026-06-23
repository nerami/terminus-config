import { useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { type Layout, useGroupRef, usePanelRef } from 'react-resizable-panels';

import {
  actionFromDragged,
  applyMode,
  CHAT_PANEL_ID,
  deriveMode,
  targetLayout,
  TOPOLOGY_PANEL_ID,
} from './split-layout';

import { usePanelLayout, type PanelLayout } from '@/lib/ha-graph/use-panel-layout';
import { clampSplitFraction, splitFractionAtom } from '@/lib/settings';

interface ResizableSplitInputs {
  artifactOpen: boolean;
  isMobile: boolean;
  layout: PanelLayout;
}

/**
 * Wires a persistent react-resizable-panels Group to the canonical panelLayout:
 * an effect resizes the panels to match the derived mode, and user drags write
 * back to the layout (collapse) or the saved ratio (resize). The panels never
 * unmount, so the topology canvas keeps its WebGL context across states.
 */
export function useResizableSplit({ artifactOpen, isMobile, layout }: ResizableSplitInputs) {
  const groupRef = useGroupRef();
  const chatRef = usePanelRef();
  const rightRef = usePanelRef();

  const storedFraction = clampSplitFraction(useAtomValue(splitFractionAtom));
  const setFraction = useSetAtom(splitFractionAtom);
  const { closeTopology, enterFullscreen, openTopology } = usePanelLayout();

  // The Group's visual arrangement (incl. artifact + mobile), distinct from the
  // canonical layout. Topology occupies the right panel only when it's open.
  const topologyVisible = layout !== 'chat';
  const mode = deriveMode({ open: topologyVisible || artifactOpen, fullscreen: layout === 'topology', isMobile });
  const isSplit = mode === 'split';
  // Panels are ALWAYS collapsible so the programmatic open/close/fullscreen
  // transitions work for every target layout — applyMode reaches chat /
  // topology by collapsing a panel, and collapse() is a no-op on a
  // non-collapsible panel.
  const collapsible = true;
  // The divider is draggable only when topology occupies the split. An artifact
  // pane (or a non-split layout) keeps a fixed divider, so a plain resize can't
  // collapse it into a stuck state or flip the canonical layout.
  const canResize = isSplit && topologyVisible;

  // Seed the initial Group layout once so the first paint matches (no flash).
  const defaultLayoutRef = useRef<Layout | undefined>(undefined);
  if (!defaultLayoutRef.current) {
    defaultLayoutRef.current = targetLayout(mode, storedFraction);
  }

  // The effect drives the Group imperatively; suppress the onLayoutChanged echo
  // those programmatic changes produce so they aren't mistaken for user drags.
  const isApplyingRef = useRef(false);
  useEffect(() => {
    // Only gate when the panels are actually mounted — if refs are null,
    // applyMode is a no-op and produces no onLayoutChanged echo.
    if (!groupRef.current || !chatRef.current || !rightRef.current) {
      applyMode(mode, storedFraction, { group: null, chat: null, right: null });
      return;
    }
    isApplyingRef.current = true;
    applyMode(mode, storedFraction, { group: groupRef.current, chat: chatRef.current, right: rightRef.current });
    const raf =
      typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb: () => void) => setTimeout(cb, 0);
    raf(() => {
      isApplyingRef.current = false;
    });
  }, [mode, storedFraction, groupRef, chatRef, rightRef]);

  const onLayoutChanged = (changed: Layout) => {
    if (isApplyingRef.current) return; // programmatic echo, not a user drag
    const chat = changed[CHAT_PANEL_ID];
    const topology = changed[TOPOLOGY_PANEL_ID];
    if (!topologyVisible) {
      // Artifact (or nothing) occupies the right panel: never mutate the
      // canonical layout from a drag — just persist the ratio. (The divider is
      // also non-draggable here via `canResize`; this is defense in depth.)
      if (chat > 0 && topology > 0) setFraction(clampSplitFraction(chat / 100));
      return;
    }
    switch (actionFromDragged(changed)) {
      case 'close':
        closeTopology();
        break;
      case 'fullscreen':
        enterFullscreen();
        break;
      case 'split':
        openTopology(); // ensure 'split' if a collapsed side was dragged back out
        if (chat > 0 && topology > 0) setFraction(clampSplitFraction(chat / 100));
        break;
    }
  };

  return {
    groupRef,
    chatRef,
    rightRef,
    isSplit,
    collapsible,
    canResize,
    onLayoutChanged,
    defaultLayout: defaultLayoutRef.current,
  };
}
