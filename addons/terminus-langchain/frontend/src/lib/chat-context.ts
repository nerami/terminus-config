import { UNASSIGNED_AREA_ID } from './ha-graph/types';

import type { GraphView } from './ha-graph/atoms';
import type { Topology } from './ha-graph/types';

/**
 * A piece of Home-topology context the user can attach to their next message.
 * `id` is stable so a chip's on/off state survives re-derivation; `detail` is
 * the sentence injected into the outgoing message.
 */
export interface ContextItem {
  detail: string;
  id: string;
  kind: 'page' | 'node';
  label: string;
}

function areaName(topology: Topology, areaId: string): string {
  if (areaId === UNASSIGNED_AREA_ID) return 'Unassigned';
  return topology.areas.find((a) => a.area_id === areaId)?.name ?? areaId;
}

/** Context describing the page (current topology view) the user is looking at. */
export function describePage(view: GraphView, topology: Topology): ContextItem | null {
  switch (view.kind) {
    case 'areas':
      return {
        id: 'page:areas',
        kind: 'page',
        label: 'Areas overview',
        detail: 'viewing the Home topology Areas overview',
      };
    case 'area': {
      const name = areaName(topology, view.areaId);
      return {
        id: `page:area:${view.areaId}`,
        kind: 'page',
        label: name,
        detail: `viewing the "${name}" area in the Home topology`,
      };
    }
    case 'scene': {
      const name = topology.scenes.find((s) => s.entity_id === view.sceneId)?.name ?? view.sceneId;
      return {
        id: `page:scene:${view.sceneId}`,
        kind: 'page',
        label: `Scene: ${name}`,
        detail: `viewing the scene "${name}" (${view.sceneId})`,
      };
    }
    case 'automation': {
      const name = topology.automations.find((a) => a.entity_id === view.automationId)?.name ?? view.automationId;
      return {
        id: `page:automation:${view.automationId}`,
        kind: 'page',
        label: `Automation: ${name}`,
        detail: `viewing the automation "${name}" (${view.automationId})`,
      };
    }
    case 'scenes':
      return {
        id: 'page:scenes',
        kind: 'page',
        label: 'All scenes',
        detail: 'viewing all scenes in the Home topology',
      };
    case 'automations':
      return {
        id: 'page:automations',
        kind: 'page',
        label: 'All automations',
        detail: 'viewing all automations in the Home topology',
      };
    case 'entities':
      return {
        id: 'page:entities',
        kind: 'page',
        label: 'All entities',
        detail: 'viewing all entities in the Home topology',
      };
  }
}

/** Context describing the node the user currently has selected, if resolvable. */
export function describeNode(selectedId: string | null, topology: Topology): ContextItem | null {
  if (!selectedId) return null;

  if (selectedId.startsWith('area:')) {
    const areaId = selectedId.slice('area:'.length);
    const name = areaName(topology, areaId);
    return {
      id: `node:${selectedId}`,
      kind: 'node',
      label: name,
      detail: `has selected the "${name}" area`,
    };
  }

  const entity = topology.entities.find((e) => e.entity_id === selectedId);
  if (entity) {
    return {
      id: `node:${selectedId}`,
      kind: 'node',
      label: entity.name,
      detail: `has selected the entity ${entity.entity_id} ("${entity.name}")`,
    };
  }
  const scene = topology.scenes.find((s) => s.entity_id === selectedId);
  if (scene) {
    return {
      id: `node:${selectedId}`,
      kind: 'node',
      label: scene.name,
      detail: `has selected the scene ${scene.entity_id} ("${scene.name}")`,
    };
  }
  const automation = topology.automations.find((a) => a.entity_id === selectedId);
  if (automation) {
    return {
      id: `node:${selectedId}`,
      kind: 'node',
      label: automation.name,
      detail: `has selected the automation ${automation.entity_id} ("${automation.name}")`,
    };
  }
  return null;
}

/** All available context items for the current view + selection. */
export function contextItems(view: GraphView, selectedId: string | null, topology: Topology | null): ContextItem[] {
  if (!topology) return [];
  const items: ContextItem[] = [];
  const node = describeNode(selectedId, topology);
  if (node) items.push(node);
  const page = describePage(view, topology);
  if (page) items.push(page);
  return items;
}

export const CONTEXT_BLOCK_START = '[Home topology context]';
export const CONTEXT_BLOCK_END = '[End context]';

/**
 * Render the enabled context items into a delimited block. This is sent as the
 * run's runtime context (not in the message) so the agent reads it for the turn
 * without it appearing in the conversation transcript.
 */
export function formatContextBlock(items: ContextItem[]): string {
  if (items.length === 0) return '';
  const lines = items.map((i) => `- The user ${i.detail}.`);
  return [CONTEXT_BLOCK_START, ...lines, CONTEXT_BLOCK_END].join('\n');
}
