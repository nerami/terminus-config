import dagre from '@dagrejs/dagre';

import type { XYPosition } from './atoms';

// Approximate rendered node footprints, used by the layout maths so nodes don't
// overlap before the user rearranges them.
export const NODE_W = 200;
export const NODE_H = 56;
export const GROUP_GAP = 90;

export interface LayoutNode {
  height?: number;
  id: string;
  width?: number;
}

export interface LayoutEdge {
  source: string;
  target: string;
}

export type Direction = 'TB' | 'LR' | 'BT' | 'RL';

/**
 * Directed layout via dagre. Returns top-left positions keyed by node id (dagre
 * works in centers, react-flow in top-left corners, so we convert).
 */
export function dagreLayout(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  opts: { direction?: Direction; nodesep?: number; ranksep?: number } = {},
): Record<string, XYPosition> {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: opts.direction ?? 'TB',
    nodesep: opts.nodesep ?? 50,
    ranksep: opts.ranksep ?? 90,
  });

  for (const n of nodes) {
    g.setNode(n.id, { width: n.width ?? NODE_W, height: n.height ?? NODE_H });
  }
  for (const e of edges) {
    if (g.hasNode(e.source) && g.hasNode(e.target)) g.setEdge(e.source, e.target);
  }

  dagre.layout(g);

  const positions: Record<string, XYPosition> = {};
  for (const n of nodes) {
    const dn = g.node(n.id);
    const w = n.width ?? NODE_W;
    const h = n.height ?? NODE_H;
    positions[n.id] = { x: dn.x - w / 2, y: dn.y - h / 2 };
  }
  return positions;
}

/**
 * Pack ids into a compact grid anchored at `origin` (top-left), filling rows
 * left-to-right. Used to arrange the members of a group around its anchor.
 */
export function gridLayout(
  ids: string[],
  origin: XYPosition,
  opts: { columns?: number; cellW?: number; cellH?: number } = {},
): Record<string, XYPosition> {
  const columns = opts.columns ?? Math.max(1, Math.ceil(Math.sqrt(ids.length)));
  const cellW = opts.cellW ?? NODE_W + 32;
  const cellH = opts.cellH ?? NODE_H + 28;
  const positions: Record<string, XYPosition> = {};
  ids.forEach((id, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    positions[id] = { x: origin.x + col * cellW, y: origin.y + row * cellH };
  });
  return positions;
}
