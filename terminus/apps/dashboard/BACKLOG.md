# Terminus Backlog

Deferred ideas. One heading per item. Pull into a task when ready.

## Radial / circular layout for per-automation view

Current: dagre TB layout in `vite-plugin-graph.ts:435`. Want optional radial formation (automation at center, triggers/conditions/actions on arc).

Constraints:
- Dagre has no radial mode — needs different engine (d3-hierarchy polar, elkjs radial) or hand-rolled polar layout (≤20 lines for shallow DAGs).
- Per-node `sourcePosition`/`targetPosition` must be computed from angle, not the current LR/TB enum in `data.direction`. Node components in `src/components/nodes/` need a new mode beyond the LR/TB swap.
- Only viable for ≤12 entities per automation — beyond that, arcs overlap.

Prototype against the largest fixture in `__fixtures__/` before committing.
