import { GraphCanvas3D } from './graph-canvas-3d';

/**
 * The experimental 3D (reagraph) topology renderer, self-contained so it can be
 * lazy-loaded: reagraph + three.js land in this chunk and only load in 3D mode.
 */
export function Topology3D() {
  return <GraphCanvas3D />;
}
