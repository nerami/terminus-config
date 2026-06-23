import { useCallback, useEffect, useMemo, useRef } from 'react';

// reagraph renders edge labels in WebGL via troika-three-text, which needs a real
// font *file* URL (it can't read CSS font-family, and can't parse the variable
// .woff2 the app uses). The static .woff matches the app's JetBrains Mono.
import jetbrainsMonoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import {
  GraphCanvas,
  type GraphCanvasRef,
  type GraphEdge,
  type GraphNode,
  type InternalGraphNode,
  type NodeRenderer,
  Ring,
  darkTheme,
  lightTheme,
} from 'reagraph';

import { AutomationHint, CanvasNotFound, CanvasSpinner } from './canvas-overlays';
import { Graph3dLegend } from './graph-3d-legend';
import { KIND_ORDER, fill3dFor, ring3dFor, sizeForKind } from './graph-3d-style';
import { GraphControls } from './graph-controls';
import { PlatonicNode } from './node-geometry';
import { NodeLabel } from './node-label';
import { MAX_CAMERA_DISTANCE, RoomEnvironment } from './room-environment';

import { nodePositions3dAtom } from '@/lib/ha-graph/atoms';
import { type GraphNodeData, type NodeKind } from '@/lib/ha-graph/build';
import { useTopologyGraph } from '@/lib/ha-graph/use-topology-graph';

// Edge line thickness; also shrinks the arrow head (reagraph couples them).
const EDGE_SIZE = 0.5;

// Wheel / pinch zoom speed. camera-controls defaults to 1; reagraph exposes no
// prop, so we set it on the controls instance. Higher = faster zoom.
const ZOOM_SPEED = 8;

// Vertical gap (world units, below the node surface) before the label chip.
const LABEL_GAP = 10;

// Spread the force layout apart: stronger node repulsion and longer links than
// reagraph's defaults (nodeStrength -250, linkDistance 50).
const LAYOUT_OVERRIDES = { linkDistance: 80, nodeStrength: -500 };

export function GraphCanvas3D() {
  const {
    activate,
    automationId,
    automationLoading,
    baseGraph,
    clearSelection,
    goBack,
    highlightSet,
    isUpstreamMode,
    notFoundKind,
    scope,
    selected,
    showAutomationHint,
  } = useTopologyGraph();
  const [positions, setPositions] = useAtom(nodePositions3dAtom);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  // Speed up wheel/pinch zoom. camera-controls defaults dollySpeed to 1 and
  // reagraph exposes no prop for it, so set it on the controls instance once it
  // exists (created after mount — retry on rAF until getControls() returns it).
  // (The zoom-out *limit* is the maxDistance prop on GraphCanvas below; reagraph
  // owns that and would clobber an imperative controls.maxDistance.)
  const graphRef = useRef<GraphCanvasRef>(null);
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const controls = graphRef.current?.getControls();
      if (controls) controls.dollySpeed = ZOOM_SPEED;
      else raf = requestAnimationFrame(apply);
    };
    apply();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Labels (drei <Html>) portal here instead of the default canvas parent. The
  // `z-0` makes this a stacking context, so the labels' depth-sorted z-indexes
  // (which span up to ~16M) stay contained *below* the z-10 corner UI, while
  // still sorting correctly among themselves.
  const labelPortalRef = useRef<HTMLDivElement>(null);

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
          fill: fill3dFor(data.kind, data.availability),
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
        // Edge `size` drives both line thickness and arrow size
        // (reagraph: arrow = [size + 6, 2 + size / 1.5]). Thinner = subtler edges.
        size: EDGE_SIZE,
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

  // Custom node symbol: the colored solid + a kind-colored billboard ring (so
  // each kind reads as a visual family) + one combined DOM label below it (the
  // kind glyph, name, and metadata as a single chip). The ring switches to the
  // highlight color and the label emphasizes when selected/on the active path.
  const renderNode = useCallback<NodeRenderer>(
    ({ active, animated, color, id, node, opacity, selected: sel, size }) => {
      const { availability, kind } = node.data as GraphNodeData;
      const hot = sel || active;
      const ringColor = hot ? color : ring3dFor(kind, availability);
      const ringOpacity = opacity * (hot ? 0.8 : 0.25);
      return (
        <group>
          <PlatonicNode
            active={active}
            animated={animated}
            color={color}
            id={id}
            kind={kind}
            opacity={opacity}
            selected={sel}
            size={size}
          />
          <Ring color={ringColor} size={size} opacity={ringOpacity} animated={animated} />
          <NodeLabel
            active={hot}
            kind={kind}
            label={node.label ?? ''}
            portalRef={labelPortalRef}
            position={[0, -(size + LABEL_GAP), 0]}
            sublabel={node.subLabel}
          />
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
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        theme={theme}
        layoutType="forceDirected3d"
        layoutOverrides={LAYOUT_OVERRIDES}
        cameraMode="rotate"
        edgeInterpolation="curved"
        maxDistance={MAX_CAMERA_DISTANCE}
        labelType="edges"
        labelFontUrl={jetbrainsMonoUrl}
        draggable
        actives={actives}
        selections={selections}
        renderNode={renderNode}
        onNodeClick={onNodeClick}
        onNodeDragged={onNodeDragged}
        onCanvasClick={clearSelection}
      >
        {/* A procedural gradient skybox so the graph feels set inside a soft room
            rather than floating on a flat color. It doesn't relight the nodes, so
            the directional lights below are unchanged. */}
        <RoomEnvironment resolvedTheme={resolvedTheme} />
        {/* The node solids use a Phong material, so directional light gives them
            shading + a specular highlight. A soft fill from the opposite side keeps
            the shadowed faces from going flat. reagraph adds its own ambient light. */}
        <directionalLight position={[0, 5, 4]} intensity={0.8} />
        <directionalLight position={[-3, -2, -4]} intensity={0.3} />
      </GraphCanvas>
      {/* Depth-sorted label layer: above the canvas, below the z-10 corner UI.
          `overflow-hidden` clips chips to the panel so off-screen nodes' labels
          don't spill outside it (drei positions them by projected coordinates). */}
      <div ref={labelPortalRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />
      <GraphControls
        onZoomIn={() => graphRef.current?.zoomIn()}
        onZoomOut={() => graphRef.current?.zoomOut()}
        onFit={() => graphRef.current?.fitNodesInView()}
      />
      <Graph3dLegend kinds={legendKinds} />
      {showAutomationHint && <AutomationHint key={automationId} />}
      {automationLoading && <CanvasSpinner />}
      {notFoundKind && <CanvasNotFound kind={notFoundKind} onBack={goBack} />}
    </div>
  );
}
