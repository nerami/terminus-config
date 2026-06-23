import { describe, expect, it } from 'vitest';

import { KIND_FILL, fill3dFor, ring3dFor, roomEnvForTheme, sizeForKind, solidForKind } from './graph-3d-style';

describe('solidForKind', () => {
  it('maps area to an icosahedron', () => {
    expect(solidForKind('area')).toBe('icosahedron');
  });

  it('maps automation to a dodecahedron', () => {
    expect(solidForKind('automation')).toBe('dodecahedron');
  });

  it('maps scene to an octahedron', () => {
    expect(solidForKind('scene')).toBe('octahedron');
  });

  it('maps entity to a tetrahedron', () => {
    expect(solidForKind('entity')).toBe('tetrahedron');
  });

  it('falls back to a sphere for other kinds', () => {
    expect(solidForKind('trigger')).toBe('sphere');
    expect(solidForKind('condition')).toBe('sphere');
    expect(solidForKind('group')).toBe('sphere');
  });
});

describe('roomEnvForTheme', () => {
  it('returns a dark room tint in dark mode', () => {
    expect(roomEnvForTheme('dark')).toEqual({ bottom: '#010309', top: '#334155' });
  });

  it('returns a light room tint otherwise', () => {
    const light = { bottom: '#b6c2d2', top: '#ffffff' };
    expect(roomEnvForTheme('light')).toEqual(light);
    expect(roomEnvForTheme(undefined)).toEqual(light);
  });
});

describe('sizeForKind', () => {
  it('makes areas the largest', () => {
    expect(sizeForKind('area')).toBe(12);
  });

  it('gives automations and scenes the same size', () => {
    expect(sizeForKind('automation')).toBe(9);
    expect(sizeForKind('scene')).toBe(9);
  });

  it('sizes entities one unit above the default', () => {
    expect(sizeForKind('entity')).toBe(8);
  });

  it('falls back to the default size for other kinds', () => {
    expect(sizeForKind('trigger')).toBe(7);
    expect(sizeForKind('group')).toBe(7);
  });
});

describe('fill3dFor', () => {
  it('grays out unavailable nodes and keeps the kind fill otherwise', () => {
    expect(fill3dFor('entity', 'unavailable')).toBe('#64748b');
    expect(fill3dFor('entity', 'unknown')).toBe(KIND_FILL.entity);
    expect(fill3dFor('entity', 'ok')).toBe(KIND_FILL.entity);
    expect(fill3dFor('entity', undefined)).toBe(KIND_FILL.entity);
  });
});

describe('ring3dFor', () => {
  it('uses an amber ring for unavailable and a slate ring for unknown', () => {
    expect(ring3dFor('entity', 'unavailable')).toBe('#f59e0b');
    expect(ring3dFor('entity', 'unknown')).toBe('#94a3b8');
    expect(ring3dFor('entity', 'ok')).toBe(KIND_FILL.entity);
  });
});
