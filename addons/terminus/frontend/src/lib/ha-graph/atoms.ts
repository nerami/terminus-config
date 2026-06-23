import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { UNASSIGNED_AREA_ID, type Topology } from './types';

/** Whether the thread history sidebar is open. */
export const chatHistoryOpenAtom = atom(false);

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

/** Currently selected node id (drives highlight/dim). Null = nothing selected. */
export const selectedNodeAtom = atom<string | null>(null);

/** Entity id whose detail modal is open, or null. */
export const entityModalAtom = atom<string | null>(null);

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

/**
 * Whether the view targets a specific id (automation/scene/area) that is absent
 * from the loaded topology — i.e. the entity was deleted. Returns false while
 * topology is still loading (null) and for list/aggregate views, so a fresh load
 * never flashes a false "not found". The synthetic unassigned area always counts
 * as present.
 */
export function isMissingTarget(topology: Topology | null, view: GraphView): boolean {
  if (!topology) return false;
  switch (view.kind) {
    case 'automation':
      return !topology.automations.some((a) => a.entity_id === view.automationId);
    case 'scene':
      return !topology.scenes.some((s) => s.entity_id === view.sceneId);
    case 'area':
      return view.areaId !== UNASSIGNED_AREA_ID && !topology.areas.some((a) => a.area_id === view.areaId);
    default:
      return false;
  }
}
