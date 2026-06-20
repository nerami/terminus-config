import { describe, expect, it } from 'vitest';

import { navLevels } from './group-nav';

import type { Topology } from './types';

const topology: Topology = {
  areas: [
    { area_id: 'bedroom', name: 'Master Bedroom' },
    { area_id: 'living', name: 'Living Room' },
  ],
  entities: [
    {
      entity_id: 'light.bed',
      name: 'Bed',
      domain: 'light',
      area_id: 'bedroom',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    { entity_id: 'scene.night', name: 'Night', area_id: 'bedroom', entities: [] },
    { entity_id: 'scene.movie', name: 'Movie', area_id: 'living', entities: [] },
  ],
  automations: [
    {
      entity_id: 'automation.wake',
      name: 'Wake',
      area_id: 'bedroom',
      numeric_id: '1',
      references: { entities: [], scenes: [], devices: [] },
    },
  ],
};

describe('navLevels', () => {
  it('shows only the grouping dropdown at a root view', () => {
    const levels = navLevels(topology, { kind: 'areas' });
    expect(levels).toHaveLength(1);
    expect(levels[0].id).toBe('grouping');
    expect(levels[0].value).toBe('area');
  });

  it('adds an area dropdown after navigating into an area', () => {
    const levels = navLevels(topology, { kind: 'area', areaId: 'bedroom' });
    expect(levels.map((l) => l.id)).toEqual(['grouping', 'area']);
    expect(levels[1].value).toBe('bedroom');
    // sibling switch returns the other area's view
    expect(levels[1].select('living')).toEqual({
      kind: 'area',
      areaId: 'living',
    });
  });

  it('adds a third dropdown for a scene opened inside an area', () => {
    const levels = navLevels(topology, {
      kind: 'scene',
      areaId: 'bedroom',
      sceneId: 'scene.night',
      via: 'area',
    });
    expect(levels.map((l) => l.id)).toEqual(['grouping', 'area', 'scene']);
    // only scenes in that area are offered as siblings
    expect(levels[2].options.map((o) => o.value)).toEqual(['scene.night']);
  });

  it("changing the grouping dropdown resets to that dimension's root", () => {
    const levels = navLevels(topology, {
      kind: 'scene',
      areaId: 'bedroom',
      sceneId: 'scene.night',
      via: 'area',
    });
    // switching dimension produces a root view (which clears deeper dropdowns)
    expect(levels[0].select('scenes')).toEqual({ kind: 'scenes' });
    expect(navLevels(topology, levels[0].select('scenes'))).toHaveLength(1);
  });

  it('offers all scenes when grouping by Scenes', () => {
    const levels = navLevels(topology, {
      kind: 'scene',
      areaId: '',
      sceneId: 'scene.movie',
      via: 'scenes',
    });
    expect(levels.map((l) => l.id)).toEqual(['grouping', 'scene']);
    expect(levels[0].value).toBe('scenes');
    expect(levels[1].options.map((o) => o.value)).toEqual(['scene.night', 'scene.movie']);
  });
});
