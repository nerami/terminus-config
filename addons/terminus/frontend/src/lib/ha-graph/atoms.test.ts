import { describe, expect, it } from 'vitest';

import type { Topology } from './types';

import { isMissingTarget } from './atoms';
import { UNASSIGNED_AREA_ID } from './types';

const topo: Topology = {
  areas: [{ area_id: 'living', name: 'Living' }],
  entities: [],
  scenes: [{ entity_id: 'scene.movie', name: 'Movie', area_id: 'living', entities: [] }],
  automations: [
    {
      entity_id: 'automation.night',
      name: 'Night',
      area_id: 'living',
      numeric_id: '1',
      references: { entities: [], scenes: [], devices: [] },
    },
  ],
};

describe('isMissingTarget', () => {
  it('returns false while topology is loading', () => {
    expect(isMissingTarget(null, { kind: 'automation', areaId: '', automationId: 'automation.x' })).toBe(false);
  });

  it('flags an automation/scene/area absent from topology', () => {
    expect(isMissingTarget(topo, { kind: 'automation', areaId: '', automationId: 'automation.ghost' })).toBe(true);
    expect(isMissingTarget(topo, { kind: 'scene', areaId: '', sceneId: 'scene.ghost' })).toBe(true);
    expect(isMissingTarget(topo, { kind: 'area', areaId: 'attic' })).toBe(true);
  });

  it('passes present targets, list views, and the unassigned pseudo-area', () => {
    expect(isMissingTarget(topo, { kind: 'automation', areaId: '', automationId: 'automation.night' })).toBe(false);
    expect(isMissingTarget(topo, { kind: 'automations' })).toBe(false);
    expect(isMissingTarget(topo, { kind: 'area', areaId: UNASSIGNED_AREA_ID })).toBe(false);
  });
});
