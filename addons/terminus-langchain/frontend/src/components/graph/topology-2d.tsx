import '@xyflow/react/dist/style.css';

import { ReactFlowProvider } from '@xyflow/react';

import { GraphCanvas } from './graph-canvas';

/**
 * The 2D (react-flow) topology renderer, self-contained so it can be lazy-loaded:
 * react-flow and its stylesheet land in this chunk and only load in 2D mode.
 */
export function Topology2D() {
  return (
    <ReactFlowProvider>
      <GraphCanvas />
    </ReactFlowProvider>
  );
}
