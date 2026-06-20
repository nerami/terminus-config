import { buildAutomationFlow } from './automation-flow';
import { dagreLayout, gridLayout, NODE_H } from './layout';
import { UNASSIGNED_AREA_ID } from './types';

import type { AutomationDetail, HaAutomation, HaScene, Topology } from './types';
import type { Edge, Node } from '@xyflow/react';

export type NodeKind =
  | 'area'
  | 'group'
  | 'entity'
  | 'scene'
  | 'automation'
  | 'trigger'
  | 'condition'
  | 'logic'
  | 'action'
  | 'choose'
  | 'if'
  | 'repeat'
  | 'parallel'
  | 'sequence'
  | 'stop';

export interface GraphNodeData {
  [key: string]: unknown;
  /** Navigation payloads. */
  areaId?: string;
  automationId?: string;
  /** Decoration flags, filled in at render time by GraphCanvas. */
  dimmed?: boolean;
  domain?: string;
  emphasized?: boolean;
  /** HA entity id for entity/scene/automation nodes. */
  entityId?: string;
  /** Whether clicking the node does something (drill-down / modal). */
  interactive?: boolean;
  isSelected?: boolean;
  kind: NodeKind;
  label: string;
  numericId?: string | null;
  sceneId?: string;
  /** Secondary line: domain, device, counts or trace-step type. */
  sublabel?: string;
}

export type RFNode = Node<GraphNodeData>;
export type RFGraph = { nodes: RFNode[]; edges: Edge[] };

const edgeId = (a: string, b: string) => `${a}~${b}`;

/**
 * Whether an automation's detail carries a parsable trigger/condition/action
 * structure. When false the flow diagram falls back to a flat star of
 * referenced ids - which usually means the automation has not run / HA could
 * not return its config, so the canvas shows a "run it once" hint.
 */
export function automationHasStructure(detail: AutomationDetail): boolean {
  const config = detail.config ?? {};
  return ['trigger', 'triggers', 'condition', 'conditions', 'action', 'actions'].some((k) => k in config);
}

function domainOf(entityId: string): string {
  return entityId.includes('.') ? entityId.split('.', 1)[0] : entityId;
}

// -- areas overview -------------------------------------------------------
export function buildAreasGraph(topology: Topology): RFGraph {
  const counts = new Map<string, { entities: number; scenes: number; automations: number }>();
  const bump = (areaId: string | null, key: 'entities' | 'scenes' | 'automations') => {
    const id = areaId ?? UNASSIGNED_AREA_ID;
    const c = counts.get(id) ?? { entities: 0, scenes: 0, automations: 0 };
    c[key] += 1;
    counts.set(id, c);
  };
  topology.entities.forEach((e) => bump(e.area_id, 'entities'));
  topology.scenes.forEach((s) => bump(s.area_id, 'scenes'));
  topology.automations.forEach((a) => bump(a.area_id, 'automations'));

  const areas = [...topology.areas];
  if (counts.has(UNASSIGNED_AREA_ID)) {
    areas.push({ area_id: UNASSIGNED_AREA_ID, name: 'Unassigned' });
  }

  const ids = areas.map((a) => `area:${a.area_id}`);
  const pos = gridLayout(ids, { x: 0, y: 0 }, { columns: 4, cellW: 240, cellH: 150 });

  const nodes: RFNode[] = areas.map((a) => {
    const c = counts.get(a.area_id) ?? { entities: 0, scenes: 0, automations: 0 };
    return {
      id: `area:${a.area_id}`,
      type: 'area',
      position: pos[`area:${a.area_id}`],
      data: {
        label: a.name,
        kind: 'area',
        areaId: a.area_id,
        sublabel: `${c.entities} entities · ${c.scenes} scenes · ${c.automations} automations`,
        interactive: true,
      },
    };
  });

  return { nodes, edges: [] };
}

// -- group-by Scenes: every scene in the home -----------------------------
export function buildScenesGraph(topology: Topology): RFGraph {
  const ids = topology.scenes.map((s) => s.entity_id);
  const pos = gridLayout(ids, { x: 0, y: 0 }, { columns: 4, cellW: 240, cellH: 110 });
  const nodes: RFNode[] = topology.scenes.map((s) => ({
    id: s.entity_id,
    type: 'scene',
    position: pos[s.entity_id],
    data: {
      label: s.name,
      kind: 'scene',
      entityId: s.entity_id,
      sceneId: s.entity_id,
      sublabel: `${s.entities.length} entities`,
      interactive: true,
    },
  }));
  return { nodes, edges: [] };
}

// -- group-by Automations: every automation in the home -------------------
export function buildAutomationsGraph(topology: Topology): RFGraph {
  const ids = topology.automations.map((a) => a.entity_id);
  const pos = gridLayout(ids, { x: 0, y: 0 }, { columns: 4, cellW: 240, cellH: 110 });
  const nodes: RFNode[] = topology.automations.map((a) => ({
    id: a.entity_id,
    type: 'automation',
    position: pos[a.entity_id],
    data: {
      label: a.name,
      kind: 'automation',
      entityId: a.entity_id,
      automationId: a.entity_id,
      numericId: a.numeric_id,
      sublabel: `${a.references.entities.length + a.references.scenes.length} refs`,
      interactive: true,
    },
  }));
  return { nodes, edges: [] };
}

// -- group-by Entities: every entity, grouped into domain blocks ----------
export function buildEntitiesGraph(topology: Topology): RFGraph {
  const byDomain = new Map<string, typeof topology.entities>();
  topology.entities.forEach((e) => {
    const list = byDomain.get(e.domain) ?? [];
    list.push(e);
    byDomain.set(e.domain, list);
  });

  const nodes: RFNode[] = [];
  const COLUMNS = 4;
  const CELL_H = 84;
  let y = 0;
  [...byDomain.keys()].sort().forEach((domain) => {
    const entities = byDomain.get(domain)!;
    const origin = { x: 0, y: y + NODE_H + 16 };
    nodes.push({
      id: `group:domain:${domain}`,
      type: 'group',
      position: { x: 0, y },
      draggable: false,
      selectable: false,
      data: { label: domain, kind: 'group', sublabel: `${entities.length}` },
    });
    const pos = gridLayout(
      entities.map((e) => e.entity_id),
      origin,
      { columns: COLUMNS, cellH: CELL_H },
    );
    entities.forEach((e) => {
      nodes.push({
        id: e.entity_id,
        type: 'entity',
        position: pos[e.entity_id],
        data: {
          label: e.name,
          kind: 'entity',
          entityId: e.entity_id,
          domain: e.domain,
          sublabel: e.device_name ?? e.domain,
          interactive: true,
        },
      });
    });
    const rows = Math.ceil(entities.length / COLUMNS);
    y = origin.y + rows * CELL_H + 48;
  });

  return { nodes, edges: [] };
}

// -- single area: entities / scenes / automations triangle ----------------
export function buildAreaGraph(topology: Topology, areaId: string): RFGraph {
  const inArea = <T extends { area_id: string | null }>(item: T) => (item.area_id ?? UNASSIGNED_AREA_ID) === areaId;

  const entities = topology.entities.filter(inArea);
  const scenes = topology.scenes.filter(inArea);
  const automations = topology.automations.filter(inArea);

  const entityIdsHere = new Set(entities.map((e) => e.entity_id));
  const sceneIdsHere = new Set(scenes.map((s) => s.entity_id));

  const nodes: RFNode[] = [];
  const edges: Edge[] = [];

  // Triangle rotated slightly left: Automations (top) and Entities (bottom)
  // share the left column, while Scenes sits to the right, vertically centered.
  const AUT_ORIGIN = { x: 0, y: 80 };
  const ENT_ORIGIN = { x: 0, y: 560 };
  const SCN_ORIGIN = { x: 760, y: 320 };

  const groupHeader = (id: string, label: string, origin: { x: number; y: number }, count: number): RFNode => ({
    id,
    type: 'group',
    position: { x: origin.x, y: origin.y - NODE_H - 16 },
    draggable: false,
    selectable: false,
    data: { label, kind: 'group', sublabel: `${count}` },
  });

  nodes.push(groupHeader('group:entities', 'Entities', ENT_ORIGIN, entities.length));
  nodes.push(groupHeader('group:scenes', 'Scenes', SCN_ORIGIN, scenes.length));
  nodes.push(groupHeader('group:automations', 'Automations', AUT_ORIGIN, automations.length));

  const entPos = gridLayout(
    entities.map((e) => e.entity_id),
    ENT_ORIGIN,
    { columns: 3 },
  );
  entities.forEach((e) => {
    nodes.push({
      id: e.entity_id,
      type: 'entity',
      position: entPos[e.entity_id],
      data: {
        label: e.name,
        kind: 'entity',
        entityId: e.entity_id,
        domain: e.domain,
        sublabel: e.device_name ?? e.domain,
        interactive: true,
      },
    });
  });

  const scnPos = gridLayout(
    scenes.map((s) => s.entity_id),
    SCN_ORIGIN,
    { columns: 2 },
  );
  scenes.forEach((s) => {
    nodes.push({
      id: s.entity_id,
      type: 'scene',
      position: scnPos[s.entity_id],
      data: {
        label: s.name,
        kind: 'scene',
        entityId: s.entity_id,
        sceneId: s.entity_id,
        sublabel: `${s.entities.length} entities`,
        interactive: true,
      },
    });
    // scene -> controlled entity edges (only when the entity is in this area)
    s.entities.forEach((eid) => {
      if (entityIdsHere.has(eid)) {
        edges.push({
          id: edgeId(s.entity_id, eid),
          source: s.entity_id,
          target: eid,
        });
      }
    });
  });

  const autPos = gridLayout(
    automations.map((a) => a.entity_id),
    AUT_ORIGIN,
    { columns: 3 },
  );
  automations.forEach((a) => {
    nodes.push({
      id: a.entity_id,
      type: 'automation',
      position: autPos[a.entity_id],
      data: {
        label: a.name,
        kind: 'automation',
        entityId: a.entity_id,
        automationId: a.entity_id,
        numericId: a.numeric_id,
        sublabel: `${a.references.entities.length + a.references.scenes.length} refs`,
        interactive: true,
      },
    });
    // automation -> referenced entity / scene edges (within this area)
    a.references.entities.forEach((eid) => {
      if (entityIdsHere.has(eid)) {
        edges.push({
          id: edgeId(a.entity_id, eid),
          source: a.entity_id,
          target: eid,
        });
      }
    });
    a.references.scenes.forEach((sid) => {
      if (sceneIdsHere.has(sid)) {
        edges.push({
          id: edgeId(a.entity_id, sid),
          source: a.entity_id,
          target: sid,
        });
      }
    });
  });

  return { nodes, edges };
}

// -- scene drill-down: the entities a scene controls ----------------------
export function buildSceneGraph(topology: Topology, scene: HaScene): RFGraph {
  const nameById = new Map(topology.entities.map((e) => [e.entity_id, e.name]));

  const nodes: RFNode[] = [
    {
      id: scene.entity_id,
      type: 'scene',
      position: { x: 0, y: 0 },
      data: {
        label: scene.name,
        kind: 'scene',
        entityId: scene.entity_id,
        sceneId: scene.entity_id,
        sublabel: `${scene.entities.length} entities`,
        interactive: true,
      },
    },
  ];
  const edges: Edge[] = [];

  scene.entities.forEach((eid) => {
    nodes.push({
      id: eid,
      type: 'entity',
      position: { x: 0, y: 0 },
      data: {
        label: nameById.get(eid) ?? eid,
        kind: 'entity',
        entityId: eid,
        domain: domainOf(eid),
        sublabel: domainOf(eid),
        interactive: true,
      },
    });
    edges.push({ id: edgeId(scene.entity_id, eid), source: scene.entity_id, target: eid });
  });

  applyDagre(nodes, edges, 'TB');
  return { nodes, edges };
}

// -- automation drill-down: a config "trace" graph ------------------------
/**
 * Build the automation's structural flow graph (triggers -> conditions ->
 * actions, with full branching) from its config. When the config is empty
 * (e.g. a YAML/non-editable automation HA wouldn't return), fall back to a flat
 * star of the entities/scenes the automation references so the view still
 * renders something useful.
 */
export function buildAutomationGraph(topology: Topology, automation: HaAutomation, detail: AutomationDetail): RFGraph {
  const nameById = new Map<string, string>([
    ...topology.entities.map((e) => [e.entity_id, e.name] as const),
    ...topology.scenes.map((s) => [s.entity_id, s.name] as const),
  ]);

  const nodes: RFNode[] = [];
  const edges: Edge[] = [];
  const leafSeen = new Set<string>();

  const rootId = automation.entity_id;
  nodes.push({
    id: rootId,
    type: 'automation',
    position: { x: 0, y: 0 },
    data: {
      label: automation.name,
      kind: 'automation',
      entityId: automation.entity_id,
      automationId: automation.entity_id,
      sublabel: 'automation',
      interactive: true,
    },
  });

  const addLeaf = (id: string) => {
    if (leafSeen.has(id)) return;
    leafSeen.add(id);
    const isScene = id.startsWith('scene.');
    nodes.push({
      id,
      type: isScene ? 'scene' : 'entity',
      position: { x: 0, y: 0 },
      data: {
        label: nameById.get(id) ?? id,
        kind: isScene ? 'scene' : 'entity',
        entityId: id,
        sceneId: isScene ? id : undefined,
        domain: domainOf(id),
        sublabel: domainOf(id),
        interactive: true,
      },
    });
  };

  const config = detail.config ?? {};
  const hasStructure = automationHasStructure(detail);

  if (hasStructure) {
    const flow = buildAutomationFlow(config, rootId);
    flow.nodes.forEach((fn) => {
      nodes.push({
        id: fn.id,
        type: fn.kind,
        position: { x: 0, y: 0 },
        data: {
          label: fn.label,
          kind: fn.kind,
          sublabel: fn.sublabel,
        },
      });
      // Link the step to the entities / scenes it touches (relationships).
      [...fn.entities, ...fn.scenes].forEach((leaf) => {
        addLeaf(leaf);
        edges.push({ id: edgeId(fn.id, leaf), source: fn.id, target: leaf });
      });
    });
    flow.edges.forEach((e, i) => {
      edges.push({
        id: `flow-${i}-${e.source}~${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        data: { dashed: e.dashed },
      });
    });
  } else {
    // Fallback: no parsable structure - hang referenced ids directly off root.
    [...detail.referenced.entities, ...detail.referenced.scenes].forEach((leaf) => {
      addLeaf(leaf);
      edges.push({ id: edgeId(rootId, leaf), source: rootId, target: leaf });
    });
  }

  applyDagre(nodes, edges, 'TB');
  return { nodes, edges };
}

function applyDagre(nodes: RFNode[], edges: Edge[], direction: 'TB' | 'LR') {
  const pos = dagreLayout(
    nodes.map((n) => ({ id: n.id })),
    edges.map((e) => ({ source: e.source, target: e.target })),
    { direction },
  );
  nodes.forEach((n) => {
    if (pos[n.id]) n.position = pos[n.id];
  });
}
