import { describe, expect, it } from 'vitest';

import { contextItems, describeNode, describePage, formatContextBlock } from './chat-context';

import type { Topology } from './ha-graph/types';

const topology: Topology = {
  areas: [{ area_id: 'bedroom', name: 'Master Bedroom' }],
  entities: [
    {
      entity_id: 'light.bedside',
      name: 'Bedside Lamp',
      domain: 'light',
      area_id: 'bedroom',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [{ entity_id: 'scene.night', name: 'Night', area_id: 'bedroom', entities: [] }],
  automations: [],
};

describe('chat-context', () => {
  it('describes the current area page', () => {
    const page = describePage({ kind: 'area', areaId: 'bedroom' }, topology);
    expect(page?.label).toBe('Master Bedroom');
    expect(page?.detail).toContain('Master Bedroom');
  });

  it('describes a selected entity node', () => {
    const node = describeNode('light.bedside', topology);
    expect(node?.kind).toBe('node');
    expect(node?.detail).toContain('light.bedside');
  });

  it('returns null for an unresolved selection', () => {
    expect(describeNode('trigger/0', topology)).toBeNull();
    expect(describeNode(null, topology)).toBeNull();
  });

  it('collects node first, then page', () => {
    const items = contextItems({ kind: 'area', areaId: 'bedroom' }, 'light.bedside', topology);
    expect(items.map((i) => i.kind)).toEqual(['node', 'page']);
  });

  it('formats only the enabled items into a delimited block', () => {
    const items = contextItems({ kind: 'area', areaId: 'bedroom' }, 'light.bedside', topology);
    const block = formatContextBlock(items);
    expect(block).toContain('[Home topology context]');
    expect(block).toContain('light.bedside');
    expect(block).toContain('Master Bedroom');

    // Disabling the node drops it from the block.
    const pageOnly = formatContextBlock(items.filter((i) => i.kind === 'page'));
    expect(pageOnly).not.toContain('light.bedside');
    expect(pageOnly).toContain('Master Bedroom');

    expect(formatContextBlock([])).toBe('');
  });
});
