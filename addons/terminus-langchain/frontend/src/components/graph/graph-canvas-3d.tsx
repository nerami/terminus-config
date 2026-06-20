import { useCallback, useMemo } from 'react';

// reagraph renders labels in WebGL via troika-three-text, which needs a real
// font *file* URL (it can't read CSS font-family, and can't parse the variable
// .woff2 the app uses). The static .woff matches the app's JetBrains Mono.
import jetbrainsMonoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { GraphCanvas, type GraphEdge, type GraphNode, type InternalGraphNode, darkTheme, lightTheme } from 'reagraph';

import { AutomationHint, CanvasSpinner } from './canvas-overlays';

import { nodePositions3dAtom } from '@/lib/ha-graph/atoms';
import { type GraphNodeData, type NodeKind } from '@/lib/ha-graph/build';
import { useTopologyGraph } from '@/lib/ha-graph/use-topology-graph';

// Concrete hex palette keyed by node kind. The 2D view uses CSS custom
// properties (var(--chart-*)) which three.js can't parse, so the 3D nodes use a
// parallel fixed palette in the same spirit (areas warm, entities blue, scenes
// violet, automations/triggers green, stops red).
const KIND_FILL: Record<NodeKind, string> = {
  area: '#f59e0b',
  group: '#94a3b8',
  entity: '#3b82f6',
  scene: '#a855f7',
  automation: '#22c55e',
  trigger: '#22c55e',
  condition: '#a855f7',
  logic: '#94a3b8',
  action: '#3b82f6',
  choose: '#22c55e',
  if: '#22c55e',
  repeat: '#f59e0b',
  parallel: '#f59e0b',
  sequence: '#94a3b8',
  stop: '#ef4444',
};

function sizeForKind(kind: NodeKind): number {
  if (kind === 'area') return 12;
  if (kind === 'automation' || kind === 'scene') return 9;
  return 7;
}

export function GraphCanvas3D() {
  const {
    activate,
    automationId,
    automationLoading,
    baseGraph,
    clearSelection,
    highlightSet,
    isUpstreamMode,
    scope,
    selected,
    showAutomationHint,
  } = useTopologyGraph();
  const [positions, setPositions] = useAtom(nodePositions3dAtom);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  // Adapt the shared RFGraph into reagraph's node/edge shape. `group` nodes are
  // non-interactive section headers with no edges, so they're dropped (they'd
  // float free in a force layout). Saved drag positions are pinned via fx/fy/fz.
  const nodes = useMemo<GraphNode[]>(() => {
    const saved = positions[scope] ?? {};
    return baseGraph.nodes
      .filter((n) => n.data.kind !== 'group')
      .map((n) => {
        const data = n.data;
        const pos = saved[n.id];
        return {
          id: n.id,
          label: data.label,
          subLabel: data.sublabel,
          fill: KIND_FILL[data.kind],
          size: sizeForKind(data.kind),
          data,
          ...(pos ? { fx: pos.x, fy: pos.y, fz: pos.z } : {}),
        } satisfies GraphNode;
      });
    // `positions` read only at build time: a fresh drag shouldn't relayout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseGraph, scope]);

  const edges = useMemo<GraphEdge[]>(
    () =>
      baseGraph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === 'string' ? e.label : undefined,
        dashed: !!(e.data as { dashed?: boolean } | undefined)?.dashed,
        interpolation: 'curved',
      })),
    [baseGraph],
  );

  // Highlight the same set the 2D view does. reagraph's `actives` accepts both
  // node and edge ids; mirror the 2D edge-activation rule (upstream: both ends
  // in the ancestor set and not a loop-back; else: edges touching the selection).
  const actives = useMemo(() => {
    if (!highlightSet) return [];
    const ids: string[] = [...highlightSet];
    for (const e of baseGraph.edges) {
      const dashed = !!(e.data as { dashed?: boolean } | undefined)?.dashed;
      const active = isUpstreamMode
        ? !dashed && highlightSet.has(e.source) && highlightSet.has(e.target)
        : e.source === selected || e.target === selected;
      if (active) ids.push(e.id);
    }
    return ids;
  }, [highlightSet, baseGraph, isUpstreamMode, selected]);

  const selections = useMemo(() => (selected ? [selected] : []), [selected]);

  const onNodeClick = useCallback(
    (node: InternalGraphNode) => activate({ id: node.id, data: node.data as GraphNodeData }),
    [activate],
  );

  const onNodeDragged = useCallback(
    (node: InternalGraphNode) => {
      const { x, y, z } = node.position;
      setPositions((prev) => ({
        ...prev,
        [scope]: { ...(prev[scope] ?? {}), [node.id]: { x, y, z } },
      }));
    },
    [setPositions, scope],
  );

  return (
    <div className="relative h-full w-full">
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        theme={theme}
        layoutType="forceDirected3d"
        cameraMode="rotate"
        edgeInterpolation="curved"
        labelType="auto"
        labelFontUrl={jetbrainsMonoUrl}
        draggable
        actives={actives}
        selections={selections}
        onNodeClick={onNodeClick}
        onNodeDragged={onNodeDragged}
        onCanvasClick={clearSelection}
      >
        {/* The node spheres use a Phong material, so directional light gives them
            shading + a specular highlight. A soft fill from the opposite side keeps
            the shadowed faces from going flat. reagraph adds its own ambient light. */}
        <directionalLight position={[0, 5, 4]} intensity={1.5} />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} />
      </GraphCanvas>
      {showAutomationHint && <AutomationHint key={automationId} />}
      {automationLoading && <CanvasSpinner />}
    </div>
  );
}
