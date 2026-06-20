import { useCallback, useMemo } from 'react';

// reagraph renders labels in WebGL via troika-three-text, which needs a real
// font *file* URL (it can't read CSS font-family, and can't parse the variable
// .woff2 the app uses). The static .woff matches the app's JetBrains Mono.
import jetbrainsMonoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import {
  GraphCanvas,
  type GraphEdge,
  type GraphNode,
  Icon,
  type InternalGraphNode,
  type NodeRenderer,
  Ring,
  Sphere,
  darkTheme,
  lightTheme,
} from 'reagraph';

import { AutomationHint, CanvasSpinner } from './canvas-overlays';
import { Graph3dLegend } from './graph-3d-legend';
import { KIND_FILL, KIND_ICON_URI, KIND_ORDER, sizeForKind } from './graph-3d-style';

import { nodePositions3dAtom } from '@/lib/ha-graph/atoms';
import { type GraphNodeData, type NodeKind } from '@/lib/ha-graph/build';
import { useTopologyGraph } from '@/lib/ha-graph/use-topology-graph';

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
          icon: KIND_ICON_URI[data.kind],
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

  // Kinds present in the current view, in a stable order, for the legend.
  const legendKinds = useMemo(() => {
    const present = new Set<NodeKind>();
    for (const n of baseGraph.nodes) if (n.data.kind !== 'group') present.add(n.data.kind);
    return KIND_ORDER.filter((k) => present.has(k));
  }, [baseGraph]);

  // Custom node symbol: the colored sphere + a kind-colored billboard ring (so
  // each kind reads as a visual family) + the white glyph. The ring turns into
  // the selection/active highlight color when the node is selected or on the
  // highlighted path, preserving the 2D highlight feedback.
  const renderNode = useCallback<NodeRenderer>(
    ({ active, animated, color, id, node, opacity, selected: sel, size }) => {
      const kind = (node.data as GraphNodeData).kind;
      const ringColor = sel || active ? color : KIND_FILL[kind];
      const ringOpacity = sel || active ? opacity : opacity * 0.55;
      return (
        <group>
          <Sphere
            id={id}
            size={size}
            opacity={opacity}
            animated={animated}
            color={color}
            node={node}
            active={active}
            selected={sel}
          />
          <Ring color={ringColor} size={size} opacity={ringOpacity} animated={animated} />
          {node.icon && (
            <Icon
              id={id}
              image={node.icon}
              size={size + 8}
              opacity={opacity}
              animated={animated}
              color={color}
              node={node}
              active={active}
              selected={sel}
            />
          )}
        </group>
      );
    },
    [],
  );

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
        renderNode={renderNode}
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
      <Graph3dLegend kinds={legendKinds} />
      {showAutomationHint && <AutomationHint key={automationId} />}
      {automationLoading && <CanvasSpinner />}
    </div>
  );
}
