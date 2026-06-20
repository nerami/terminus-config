import { useCallback, useMemo } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useAutomationDetail } from '@/hooks/use-topology';
import { entityModalAtom, graphViewAtom, selectedNodeAtom, topologyAtom, viewScope } from '@/lib/ha-graph/atoms';
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
} from '@/lib/ha-graph/build';

const EMPTY_GRAPH: RFGraph = { nodes: [], edges: [] };

/** A renderer-neutral node: anything carrying an id and the shared node data. */
export interface ActivatableNode {
  data: GraphNodeData;
  id: string;
}

export interface TopologyGraph {
  /** Apply the shared click semantics to a clicked node (drill-in / select /
   *  modal / navigate). Renderer-neutral so both react-flow and reagraph map onto it. */
  activate: (node: ActivatableNode) => void;
  /** The automation id of the current view, or null. */
  automationId: string | null;
  /** Whether the automation config is still loading (drives a spinner). */
  automationLoading: boolean;
  /** The graph for the current view, built straight from the topology (no saved
   *  positions applied — those are renderer-specific). */
  baseGraph: RFGraph;
  /** Clear the current selection (clicking empty canvas). */
  clearSelection: () => void;
  /** Set of node ids to highlight around the selection, or null when nothing is
   *  selected. Mirrors the 2D highlight logic for every view (incl. the
   *  automation upstream-ancestor closure). */
  highlightSet: Set<string> | null;
  /** Whether the current view uses upstream (ancestor) highlighting. */
  isUpstreamMode: boolean;
  /** Stable string scope for the current view, used to key persisted positions. */
  scope: string;
  selected: string | null;
  /** Whether to nudge the user to run the automation (no parsable structure). */
  showAutomationHint: boolean;
}

/**
 * The renderer-agnostic core of the topology diagram: builds the graph for the
 * current view, computes selection highlighting, and owns the node-click
 * semantics. Consumed by both the 2D (react-flow) and 3D (reagraph) canvases so
 * they behave identically off the same dataset.
 */
export function useTopologyGraph(): TopologyGraph {
  const topology = useAtomValue(topologyAtom);
  const [view, setView] = useAtom(graphViewAtom);
  const [selected, setSelected] = useAtom(selectedNodeAtom);
  const setEntityModal = useSetAtom(entityModalAtom);

  const scope = viewScope(view);
  const automationId = view.kind === 'automation' ? view.automationId : null;

  // Automation drill-down needs the config; falls back to topology references.
  const { detail: automationDetail, loading: automationLoading } = useAutomationDetail(automationId);

  // Build the base graph for the current view.
  const baseGraph = useMemo<RFGraph>(() => {
    if (!topology) return EMPTY_GRAPH;
    if (view.kind === 'areas') return buildAreasGraph(topology);
    if (view.kind === 'area') return buildAreaGraph(topology, view.areaId);
    if (view.kind === 'scene') {
      const scene = topology.scenes.find((s) => s.entity_id === view.sceneId);
      return scene ? buildSceneGraph(topology, scene) : EMPTY_GRAPH;
    }
    if (view.kind === 'automation') {
      const automation = topology.automations.find((a) => a.entity_id === view.automationId);
      return automation && automationDetail
        ? buildAutomationGraph(topology, automation, automationDetail)
        : EMPTY_GRAPH;
    }
    if (view.kind === 'scenes') return buildScenesGraph(topology);
    if (view.kind === 'automations') return buildAutomationsGraph(topology);
    if (view.kind === 'entities') return buildEntitiesGraph(topology);
    return EMPTY_GRAPH;
  }, [topology, view, automationDetail]);

  // In the automation drill-down we highlight the *upstream path to the trigger*
  // - the ancestor closure of the selected node (follow edges backward
  // source<-target, skipping dashed repeat loop-backs) - plus the selected
  // node's own direct children. Other views keep direct-neighbour highlighting.
  const isUpstreamMode = view.kind === 'automation';
  const highlightSet = useMemo(() => {
    if (!selected) return null;
    const edges = baseGraph.edges;
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
  }, [selected, baseGraph, isUpstreamMode]);

  const currentAreaId = 'areaId' in view ? view.areaId : undefined;

  const activate = useCallback(
    (node: ActivatableNode) => {
      const data = node.data;

      // Areas drill in on a single click; they have no relationships to show.
      if (data.kind === 'area' && data.areaId) {
        setView({ kind: 'area', areaId: data.areaId });
        return;
      }

      // First click selects (highlights relationships) - works for every node.
      // Second click on the same node acts, but only for interactive nodes.
      if (selected !== node.id) {
        setSelected(node.id);
        return;
      }

      if (!data.interactive) return;

      if (data.kind === 'entity' && data.entityId) {
        setEntityModal(data.entityId);
      } else if (data.kind === 'scene' && data.sceneId) {
        if (view.kind === 'scene' && view.sceneId === data.sceneId) {
          if (data.entityId) setEntityModal(data.entityId);
        } else {
          setView({
            kind: 'scene',
            areaId: currentAreaId ?? '',
            sceneId: data.sceneId,
            via: view.kind === 'scenes' ? 'scenes' : 'area',
          });
        }
      } else if (data.kind === 'automation' && data.automationId) {
        if (view.kind === 'automation' && view.automationId === data.automationId) {
          if (data.entityId) setEntityModal(data.entityId);
        } else {
          setView({
            kind: 'automation',
            areaId: currentAreaId ?? '',
            automationId: data.automationId,
            via: view.kind === 'automations' ? 'automations' : 'area',
          });
        }
      }
    },
    [selected, setSelected, setView, setEntityModal, currentAreaId, view],
  );

  const clearSelection = useCallback(() => setSelected(null), [setSelected]);

  // When an automation has no parsable structure (typically never run / HA can't
  // return its config) the flow is just a flat fallback, so nudge the user to
  // run it once to get the real diagram.
  const showAutomationHint =
    view.kind === 'automation' && !automationLoading && !!automationDetail && !automationHasStructure(automationDetail);

  return {
    baseGraph,
    scope,
    selected,
    highlightSet,
    isUpstreamMode,
    activate,
    clearSelection,
    automationId,
    automationLoading,
    showAutomationHint,
  };
}
