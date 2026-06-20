import { useCallback, useEffect, useMemo, useRef } from 'react';

// reagraph renders labels in WebGL via troika-three-text, which needs a real
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
  Icon,
  type InternalGraphNode,
  Label,
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

// Icon glyph size as a fraction of the node sphere diameter (diameter = 2*size).
const ICON_SCALE = 1.3;

// reagraph hardcodes the node name to fontSize 7 with a fixed sub-label offset,
// which overlaps on small nodes. We render our own labels (smaller, spaced) and
// set labelType="edges" so reagraph only draws edge labels.
const NAME_FONT_SIZE = 5;
const META_FONT_SIZE = 4;

// Wheel / pinch zoom speed. camera-controls defaults to 1; reagraph exposes no
// prop, so we set it on the controls instance. Higher = faster zoom.
const ZOOM_SPEED = 8;

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

  // Speed up wheel/pinch zoom. The camera-controls instance is created after
  // mount, so retry on rAF until getControls() returns it, then bump dollySpeed.
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
  // each kind reads as a visual family) + the white glyph, plus our own name and
  // metadata labels (smaller and explicitly spaced to avoid overlap). The ring
  // and labels switch to the highlight color when selected/on the active path.
  const renderNode = useCallback<NodeRenderer>(
    ({ active, animated, color, id, node, opacity, selected: sel, size }) => {
      const kind = (node.data as GraphNodeData).kind;
      const hot = sel || active;
      const ringColor = hot ? color : KIND_FILL[kind];
      const ringOpacity = opacity * (hot ? 0.8 : 0.25);
      const nameY = -(size + 4);
      const metaY = nameY - (NAME_FONT_SIZE / 2 + META_FONT_SIZE / 2 + 1.5);
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
              // Sphere diameter is 2*size; ~0.65x of that reads as an inset glyph
              // and scales with the node (unlike reagraph's default size + 8).
              size={size * ICON_SCALE}
              opacity={opacity}
              animated={animated}
              color={color}
              node={node}
              active={active}
              selected={sel}
            />
          )}
          <group position={[0, nameY, 0]}>
            <Label
              text={node.label ?? ''}
              fontUrl={jetbrainsMonoUrl}
              fontSize={NAME_FONT_SIZE}
              color={hot ? theme.node.label.activeColor : theme.node.label.color}
              stroke={theme.node.label.stroke}
              opacity={opacity}
              active={hot}
            />
          </group>
          {node.subLabel && (
            <group position={[0, metaY, 0]}>
              <Label
                text={node.subLabel}
                fontUrl={jetbrainsMonoUrl}
                fontSize={META_FONT_SIZE}
                color={
                  hot
                    ? (theme.node.subLabel?.activeColor ?? color)
                    : (theme.node.subLabel?.color ?? theme.node.label.color)
                }
                opacity={opacity}
                active={hot}
              />
            </group>
          )}
        </group>
      );
    },
    [theme],
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
        cameraMode="rotate"
        edgeInterpolation="curved"
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
