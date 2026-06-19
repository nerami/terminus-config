import {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeMouseHandler,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { LoaderCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  automationHasStructure,
  buildAreaGraph,
  buildAreasGraph,
  buildAutomationGraph,
  buildAutomationsGraph,
  buildEntitiesGraph,
  buildSceneGraph,
  buildScenesGraph,
  type GraphNodeData,
  type RFGraph,
} from "@/lib/ha-graph/build";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { GroupByControls } from "./GroupByControls";
import {
  entityModalAtom,
  graphViewAtom,
  nodePositionsAtom,
  selectedNodeAtom,
  topologyAtom,
  viewScope,
} from "@/lib/ha-graph/atoms";
import { useAutomationDetail } from "@/hooks/use-topology";
import { nodeTypes } from "./nodes";

const EMPTY_GRAPH: RFGraph = { nodes: [], edges: [] };

export function GraphCanvas() {
  const topology = useAtomValue(topologyAtom);
  const [view, setView] = useAtom(graphViewAtom);
  const [selected, setSelected] = useAtom(selectedNodeAtom);
  const setEntityModal = useSetAtom(entityModalAtom);
  const [positions, setPositions] = useAtom(nodePositionsAtom);
  const { fitView } = useReactFlow();
  const { resolvedTheme } = useTheme();
  // React Flow's Background/Controls/MiniMap need an explicit colorMode to match
  // the app theme; without it they always render in light mode (req: dark bug).
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  const scope = viewScope(view);

  // Automation drill-down needs the config; falls back to topology references.
  const { detail: automationDetail, loading: automationLoading } =
    useAutomationDetail(view.kind === "automation" ? view.automationId : null);

  // Build the base graph for the current view, then overlay saved positions.
  const baseGraph = useMemo<RFGraph>(() => {
    if (!topology) return EMPTY_GRAPH;
    let graph: RFGraph = EMPTY_GRAPH;
    if (view.kind === "areas") {
      graph = buildAreasGraph(topology);
    } else if (view.kind === "area") {
      graph = buildAreaGraph(topology, view.areaId);
    } else if (view.kind === "scene") {
      const scene = topology.scenes.find((s) => s.entity_id === view.sceneId);
      graph = scene ? buildSceneGraph(topology, scene) : EMPTY_GRAPH;
    } else if (view.kind === "automation") {
      const automation = topology.automations.find(
        (a) => a.entity_id === view.automationId,
      );
      if (automation && automationDetail) {
        graph = buildAutomationGraph(topology, automation, automationDetail);
      }
    } else if (view.kind === "scenes") {
      graph = buildScenesGraph(topology);
    } else if (view.kind === "automations") {
      graph = buildAutomationsGraph(topology);
    } else if (view.kind === "entities") {
      graph = buildEntitiesGraph(topology);
    }

    const saved = positions[scope] ?? {};
    const nodes = graph.nodes.map((n) =>
      saved[n.id] ? { ...n, position: saved[n.id] } : n,
    );
    return { nodes, edges: graph.edges };
    // `positions` intentionally omitted: saved drags shouldn't rebuild/refit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topology, view, automationDetail, scope]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<GraphNodeData>>(
    baseGraph.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(baseGraph.edges);

  // Swap the canvas contents when the view changes, then gracefully refit.
  useEffect(() => {
    setNodes(baseGraph.nodes);
    setEdges(baseGraph.edges);
    const id = window.setTimeout(
      () => fitView({ duration: 600, padding: 0.2 }),
      0,
    );
    return () => window.clearTimeout(id);
  }, [baseGraph, setNodes, setEdges, fitView]);

  // Set of nodes to highlight around the selection.
  //
  // In the automation drill-down we highlight the *upstream path to the
  // trigger* - the ancestor closure of the selected node (follow edges backward
  // source<-target, skipping dashed repeat loop-backs so a loop doesn't drag in
  // downstream siblings) - plus the selected node's own direct children
  // (targets). Other views keep simple direct-neighbour highlighting.
  const isUpstreamMode = view.kind === "automation";
  const highlightSet = useMemo(() => {
    if (!selected) return null;
    const set = new Set<string>([selected]);
    if (isUpstreamMode) {
      const stack = [selected];
      while (stack.length) {
        const cur = stack.pop()!;
        for (const e of edges) {
          if ((e.data as { dashed?: boolean } | undefined)?.dashed) continue;
          if (e.target === cur && !set.has(e.source)) {
            set.add(e.source);
            stack.push(e.source);
          }
        }
      }
      // Also include the selected node's direct children (one hop downstream).
      for (const e of edges) {
        if (e.source === selected) set.add(e.target);
      }
      return set;
    }
    for (const e of edges) {
      if (e.source === selected) set.add(e.target);
      if (e.target === selected) set.add(e.source);
    }
    return set;
  }, [selected, edges, isUpstreamMode]);

  // Decorate nodes/edges with highlight + dim flags (req 4).
  const decoratedNodes = useMemo(
    () =>
      nodes.map((n) => {
        const isStructural = n.data.kind === "group";
        const data: GraphNodeData = {
          ...n.data,
          isSelected: selected === n.id,
          emphasized:
            !!highlightSet && highlightSet.has(n.id) && selected !== n.id,
          dimmed:
            !!highlightSet && !highlightSet.has(n.id) && !isStructural,
        };
        return { ...n, data };
      }),
    [nodes, highlightSet, selected],
  );

  const decoratedEdges = useMemo(
    () =>
      edges.map((e) => {
        const dashed = !!(e.data as { dashed?: boolean } | undefined)?.dashed;
        // In upstream mode an edge is on the highlighted path when both of its
        // ends are in the ancestor set (and it isn't a loop-back); otherwise an
        // edge lights up only when it touches the selected node directly.
        const active = highlightSet
          ? isUpstreamMode
            ? !dashed &&
              highlightSet.has(e.source) &&
              highlightSet.has(e.target)
            : e.source === selected || e.target === selected
          : false;
        // Edges dimmed by default; highlighted edges light up (req 4.1/4.2).
        const opacity = highlightSet ? (active ? 1 : 0.06) : 0.25;
        return {
          ...e,
          animated: active,
          style: {
            opacity,
            strokeWidth: active ? 2 : 1.5,
            stroke: active ? "var(--primary)" : "var(--muted-foreground)",
            strokeDasharray: dashed ? "4 4" : undefined,
          },
        };
      }),
    [edges, highlightSet, selected, isUpstreamMode],
  );

  const currentAreaId = "areaId" in view ? view.areaId : undefined;

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => {
      const data = node.data as GraphNodeData;

      // Areas drill in on a single click; they have no relationships to show.
      if (data.kind === "area" && data.areaId) {
        setView({ kind: "area", areaId: data.areaId });
        return;
      }

      // First click selects (highlights relationships) - works for every node.
      // Second click on the same node acts, but only for interactive nodes.
      if (selected !== node.id) {
        setSelected(node.id);
        return;
      }

      if (!data.interactive) return;

      if (data.kind === "entity" && data.entityId) {
        setEntityModal(data.entityId);
      } else if (data.kind === "scene" && data.sceneId) {
        if (view.kind === "scene" && view.sceneId === data.sceneId) {
          if (data.entityId) setEntityModal(data.entityId);
        } else {
          setView({
            kind: "scene",
            areaId: currentAreaId ?? "",
            sceneId: data.sceneId,
            via: view.kind === "scenes" ? "scenes" : "area",
          });
        }
      } else if (data.kind === "automation" && data.automationId) {
        if (view.kind === "automation" && view.automationId === data.automationId) {
          if (data.entityId) setEntityModal(data.entityId);
        } else {
          setView({
            kind: "automation",
            areaId: currentAreaId ?? "",
            automationId: data.automationId,
            via: view.kind === "automations" ? "automations" : "area",
          });
        }
      }
    },
    [selected, setSelected, setView, setEntityModal, currentAreaId, view],
  );

  // Clicking empty canvas clears the current selection.
  const onPaneClick = useCallback(() => setSelected(null), [setSelected]);

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

  const showSpinner = view.kind === "automation" && automationLoading;

  // When an automation has no parsable structure (typically never run / HA
  // can't return its config) the flow is just a flat fallback, so nudge the
  // user to run it once to get the real diagram.
  const showAutomationHint =
    view.kind === "automation" &&
    !automationLoading &&
    !!automationDetail &&
    !automationHasStructure(automationDetail);

  // The hint is dismissible; reset the dismissal when the automation changes
  // so each automation gets its own chance to show the "run me" nudge.
  const automationId = view.kind === "automation" ? view.automationId : null;
  const [hintDismissed, setHintDismissed] = useState(false);
  useEffect(() => setHintDismissed(false), [automationId]);

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
        onPaneClick={onPaneClick}
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
        <Controls showInteractive={false} />
      </ReactFlow>
      <GroupByControls />
      {showAutomationHint && !hintDismissed && (
        <Alert
          variant="default"
          className="bg-card/95 absolute top-3 right-3 left-3 z-10 pr-9 shadow-md backdrop-blur sm:right-auto sm:left-1/2 sm:max-w-md sm:min-w-[20rem] sm:-translate-x-1/2"
        >
          <Info />
          <AlertTitle>Run this automation to see its real flow</AlertTitle>
          <AlertDescription>
            The diagram below is a simplified view. Trigger the automation once
            so Home Assistant records a trace, then refresh to see the actual
            steps.
          </AlertDescription>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setHintDismissed(true)}
            className="hover:bg-muted text-muted-foreground absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-md"
          >
            <X className="size-4" />
          </button>
        </Alert>
      )}
      {showSpinner && (
        <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
          <LoaderCircle className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
