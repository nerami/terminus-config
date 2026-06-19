import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { Topology } from "./types";

/** Whether the diagram panel is open next to the chat. */
export const graphPanelOpenAtom = atom(false);

/** The loaded topology snapshot (set by `useTopology`). */
export const topologyAtom = atom<Topology | null>(null);

/**
 * The current view in the diagram. Each view carries the ids needed both to
 * build the nodes and to derive the breadcrumb trail.
 */
export type GraphView =
  | { kind: "areas" }
  | { kind: "area"; areaId: string }
  | { kind: "scene"; areaId: string; sceneId: string }
  | { kind: "automation"; areaId: string; automationId: string };

const graphViewBaseAtom = atom<GraphView>({ kind: "areas" });

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
    case "areas":
      return "areas";
    case "area":
      return `area:${view.areaId}`;
    case "scene":
      return `scene:${view.areaId}:${view.sceneId}`;
    case "automation":
      return `automation:${view.areaId}:${view.automationId}`;
  }
}

/** A stable string scope for the current view, used to key node positions. */
export function viewScope(view: GraphView): string {
  switch (view.kind) {
    case "areas":
      return "areas";
    case "area":
      return `area:${view.areaId}`;
    case "scene":
      return `scene:${view.sceneId}`;
    case "automation":
      return `automation:${view.automationId}`;
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
export const nodePositionsAtom = atomWithStorage<
  Record<string, Record<string, XYPosition>>
>("terminus-graph-positions", {});
