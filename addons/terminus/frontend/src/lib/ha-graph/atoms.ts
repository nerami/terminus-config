import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Topology } from './types';

/**
 * Single source of truth for the chat<->topology layout relationship.
 *  - chat-full:     topology not shown (chat occupies the row; an artifact may
 *                   still open the right column — tracked separately).
 *  - split:         chat + topology side by side.
 *  - topology-full: topology fills the row, chat hidden.
 */
export type PanelLayout = 'chat-full' | 'split' | 'topology-full';

export const panelLayoutAtom = atomWithStorage<PanelLayout>('terminus-panel-layout', 'chat-full', undefined, {
  getOnInit: true,
});

/** Names of the two panels the layout param lists, in canonical URL order. */
export type PanelName = 'chat' | 'topology';

/** Visible panels for a layout (already in canonical order for stable URLs). */
export function layoutToPanels(layout: PanelLayout): PanelName[] {
  switch (layout) {
    case 'chat-full':
      return ['chat'];
    case 'topology-full':
      return ['topology'];
    case 'split':
      return ['chat', 'topology'];
  }
}

/** Map a (possibly messy) list of visible panel names back to a layout. */
export function panelsToLayout(names: readonly string[] | null): PanelLayout {
  const set = new Set(names ?? []);
  const chat = set.has('chat');
  const topology = set.has('topology');
  if (chat && topology) return 'split';
  if (topology) return 'topology-full';
  return 'chat-full';
}

// Named write-only actions — the single write path for buttons, drag, and URL.
// Each no-ops when the target equals the current value (free equality-gating).
export const openTopologyAtom = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'chat-full') set(panelLayoutAtom, 'split');
});
export const closeTopologyAtom = atom(null, (_get, set) => set(panelLayoutAtom, 'chat-full'));
export const enterFullscreenAtom = atom(null, (_get, set) => set(panelLayoutAtom, 'topology-full'));
export const exitFullscreenAtom = atom(null, (get, set) => {
  if (get(panelLayoutAtom) === 'topology-full') set(panelLayoutAtom, 'split');
});

/** Whether the thread history sidebar is open. */
export const chatHistoryOpenAtom = atom(false);

/** The loaded topology snapshot (set by `useTopology`). */
export const topologyAtom = atom<Topology | null>(null);

/**
 * The current view in the diagram. Each view carries the ids needed both to
 * build the nodes and to derive the breadcrumb trail.
 */
export type GraphView =
  | { kind: 'areas' }
  | { kind: 'area'; areaId: string }
  | { kind: 'scene'; areaId: string; sceneId: string; via?: 'area' | 'scenes' }
  | {
      kind: 'automation';
      areaId: string;
      automationId: string;
      via?: 'area' | 'automations';
    }
  | { kind: 'scenes' }
  | { kind: 'automations' }
  | { kind: 'entities' };

/** Top-level dimension the canvas groups nodes by (the first dropdown). */
export type GraphGrouping = 'area' | 'scenes' | 'automations' | 'entities';

/** Which grouping dimension a view belongs to (drives the first dropdown). */
export function groupingOf(view: GraphView): GraphGrouping {
  switch (view.kind) {
    case 'areas':
    case 'area':
      return 'area';
    case 'scenes':
      return 'scenes';
    case 'automations':
      return 'automations';
    case 'entities':
      return 'entities';
    case 'scene':
      return view.via === 'scenes' ? 'scenes' : 'area';
    case 'automation':
      return view.via === 'automations' ? 'automations' : 'area';
  }
}

/** The root view for a grouping dimension (selecting the first dropdown). */
export function rootViewFor(grouping: GraphGrouping): GraphView {
  switch (grouping) {
    case 'area':
      return { kind: 'areas' };
    case 'scenes':
      return { kind: 'scenes' };
    case 'automations':
      return { kind: 'automations' };
    case 'entities':
      return { kind: 'entities' };
  }
}

const graphViewBaseAtom = atomWithStorage<GraphView>('terminus-graph-view', { kind: 'areas' });

/** Currently selected node id (drives highlight/dim). Null = nothing selected. */
export const selectedNodeAtom = atom<string | null>(null);

/** Entity id whose detail modal is open, or null. */
export const entityModalAtom = atom<string | null>(null);

/**
 * Navigate to a new view. Selecting a view always clears the current node
 * selection so the new canvas starts in its default (all-dimmed-edges) state.
 */
export const graphViewAtom = atom(
  (get) => get(graphViewBaseAtom),
  (_get, set, view: GraphView) => {
    set(graphViewBaseAtom, view);
    set(selectedNodeAtom, null);
  },
);

/**
 * A stable, fully-qualified key for a view (includes the area context). Unlike
 * `viewScope`, this distinguishes e.g. the same scene reached via different
 * areas, so it can be used for view equality when syncing to/from the URL.
 */
export function viewKey(view: GraphView): string {
  switch (view.kind) {
    case 'areas':
      return 'areas';
    case 'area':
      return `area:${view.areaId}`;
    case 'scene':
      return `scene:${view.via ?? 'area'}:${view.areaId}:${view.sceneId}`;
    case 'automation':
      return `automation:${view.via ?? 'area'}:${view.areaId}:${view.automationId}`;
    case 'scenes':
      return 'scenes';
    case 'automations':
      return 'automations';
    case 'entities':
      return 'entities';
  }
}

/** A stable string scope for the current view, used to key node positions. */
export function viewScope(view: GraphView): string {
  switch (view.kind) {
    case 'areas':
      return 'areas';
    case 'area':
      return `area:${view.areaId}`;
    case 'scene':
      return `scene:${view.sceneId}`;
    case 'automation':
      return `automation:${view.automationId}`;
    case 'scenes':
      return 'scenes';
    case 'automations':
      return 'automations';
    case 'entities':
      return 'entities';
  }
}

export interface XYPosition {
  x: number;
  y: number;
}

/**
 * Persisted, user-adjusted node positions, keyed by view scope then node id.
 * `atomWithStorage` mirrors this to localStorage (requirement 7).
 */
export const nodePositionsAtom = atomWithStorage<Record<string, Record<string, XYPosition>>>(
  'terminus-graph-positions',
  {},
);

export interface XYZPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Persisted, user-dragged node positions for the 3D (reagraph) view, keyed by
 * view scope then node id. Kept separate from `nodePositionsAtom` because the 3D
 * coordinate space differs from the 2D react-flow one.
 */
export const nodePositions3dAtom = atomWithStorage<Record<string, Record<string, XYZPosition>>>(
  'terminus-graph-positions-3d',
  {},
);
