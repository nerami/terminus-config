import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  Background,
  type Edge,
  type Node,
  type NodeMouseHandler,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTheme } from 'next-themes';

import { AutomationHint, CanvasNotFound, CanvasSpinner } from './canvas-overlays';
import { GraphControls } from './graph-controls';
import { nodeTypes } from './nodes';

import { availableDomainsAtom, nodeFilterAtom, nodePositionsAtom } from '@/lib/ha-graph/atoms';
import { type GraphNodeData } from '@/lib/ha-graph/build';
import { domainsOf, isFilterActive, nodeMatchesFilter } from '@/lib/ha-graph/node-filter';
import { useTopologyGraph } from '@/lib/ha-graph/use-topology-graph';

export function GraphCanvas() {
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
  const [positions, setPositions] = useAtom(nodePositionsAtom);
  const filter = useAtomValue(nodeFilterAtom);
  const filterActive = isFilterActive(filter);
  const setAvailableDomains = useSetAtom(availableDomainsAtom);
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { resolvedTheme } = useTheme();
  // React Flow's Background/Controls/MiniMap need an explicit colorMode to match
  // the app theme; without it they always render in light mode (req: dark bug).
  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Overlay saved positions onto the freshly built graph.
  const positionedNodes = useMemo(() => {
    const saved = positions[scope] ?? {};
    return baseGraph.nodes.map((n) => (saved[n.id] ? { ...n, position: saved[n.id] } : n));
    // `positions` intentionally omitted: saved drags shouldn't rebuild/refit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseGraph, scope]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<GraphNodeData>>(positionedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(baseGraph.edges);

  // Swap the canvas contents when the view changes, then gracefully refit.
  useEffect(() => {
    setNodes(positionedNodes);
    setEdges(baseGraph.edges);
    const id = window.setTimeout(() => fitView({ duration: 600, padding: 0.2 }), 0);
    return () => window.clearTimeout(id);
  }, [positionedNodes, baseGraph, setNodes, setEdges, fitView]);

  // The set of node ids that satisfy the active filter, or null when no filter
  // is narrowing the view (in which case decoration falls back to selection).
  const filterSet = useMemo(
    () => (filterActive ? new Set(nodes.filter((n) => nodeMatchesFilter(n.data, filter)).map((n) => n.id)) : null),
    [nodes, filter, filterActive],
  );

  // Publish the domains present in the current view for the filter UI, but only
  // when they actually change — writing every render would loop forever.
  const lastDomainsRef = useRef<string | null>(null);
  useEffect(() => {
    const domains = domainsOf(nodes);
    const key = domains.join('\0');
    if (key === lastDomainsRef.current) return;
    lastDomainsRef.current = key;
    setAvailableDomains(domains);
  }, [nodes, setAvailableDomains]);

  // A node is visible under the filter when it's structural, the current
  // selection, or a filter match. Structural nodes never dim (they scaffold).
  const isVisible = useCallback(
    (n: Node<GraphNodeData>) =>
      n.data.kind === 'group' || selected === n.id || (filterSet ? filterSet.has(n.id) : true),
    [filterSet, selected],
  );

  // Decorate nodes/edges with highlight + dim flags (req 4).
  const decoratedNodes = useMemo(
    () =>
      nodes.map((n) => {
        const isStructural = n.data.kind === 'group';
        // A filter overrides selection-based decoration: matches stay lit (no
        // emphasis ring — contrast alone carries the highlight), the rest dim.
        const data: GraphNodeData = filterSet
          ? { ...n.data, isSelected: selected === n.id, emphasized: false, dimmed: !isVisible(n) }
          : {
              ...n.data,
              isSelected: selected === n.id,
              emphasized: !!highlightSet && highlightSet.has(n.id) && selected !== n.id,
              dimmed: !!highlightSet && !highlightSet.has(n.id) && !isStructural,
            };
        return { ...n, data };
      }),
    [nodes, highlightSet, selected, filterSet, isVisible],
  );

  const decoratedEdges = useMemo(() => {
    // Under an active filter, an edge is lit only when both endpoints are
    // visible; any edge touching a dimmed node mutes.
    const visibleIds = filterSet ? new Set(nodes.filter((n) => isVisible(n)).map((n) => n.id)) : null;
    return edges.map((e) => {
      const dashed = !!(e.data as { dashed?: boolean } | undefined)?.dashed;
      // In upstream mode an edge is on the highlighted path when both of its
      // ends are in the ancestor set (and it isn't a loop-back); otherwise an
      // edge lights up only when it touches the selected node directly.
      const active = visibleIds
        ? visibleIds.has(e.source) && visibleIds.has(e.target)
        : highlightSet
          ? isUpstreamMode
            ? !dashed && highlightSet.has(e.source) && highlightSet.has(e.target)
            : e.source === selected || e.target === selected
          : false;
      // Edges dimmed by default; highlighted/visible edges light up (req 4.1/4.2).
      const opacity = visibleIds || highlightSet ? (active ? 1 : 0.06) : 0.25;
      return {
        ...e,
        animated: active,
        style: {
          opacity,
          strokeWidth: active ? 2 : 1.5,
          stroke: active ? 'var(--primary)' : 'var(--muted-foreground)',
          strokeDasharray: dashed ? '4 4' : undefined,
        },
      };
    });
  }, [edges, nodes, highlightSet, selected, isUpstreamMode, filterSet, isVisible]);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => activate({ id: node.id, data: node.data as GraphNodeData }),
    [activate],
  );

  // Persist user-arranged positions to localStorage (req 7).
  const onNodeDragStop = useCallback(
    (_evt: unknown, node: Node<GraphNodeData>) => {
      setPositions((prev) => ({
        ...prev,
        [scope]: { ...(prev[scope] ?? {}), [node.id]: { ...node.position } },
      }));
    },
    [setPositions, scope],
  );

  const showSpinner = automationLoading;

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        colorMode={colorMode}
        nodes={decoratedNodes}
        edges={decoratedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={clearSelection}
        defaultEdgeOptions={{ type: 'bezier' }}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        fitView
      >
        <Background />
      </ReactFlow>
      <GraphControls
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFit={() => fitView({ duration: 600, padding: 0.2 })}
      />
      {showAutomationHint && <AutomationHint key={automationId} />}
      {showSpinner && <CanvasSpinner />}
      {notFoundKind && <CanvasNotFound kind={notFoundKind} onBack={goBack} />}
    </div>
  );
}
