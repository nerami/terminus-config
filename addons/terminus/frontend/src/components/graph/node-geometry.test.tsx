import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Mesh } from 'three';
import { describe, expect, it } from 'vitest';

import { PlatonicNode } from './node-geometry';

import type { NodeKind } from '@/lib/ha-graph/build';

const baseProps = {
  active: false,
  animated: false,
  color: '#3b82f6',
  id: 'node-1',
  opacity: 1,
  selected: false,
  size: 5,
};

// Each top-level kind maps to a distinct Platonic solid; everything else is a sphere.
const cases: Array<[NodeKind, string]> = [
  ['area', 'IcosahedronGeometry'],
  ['automation', 'DodecahedronGeometry'],
  ['scene', 'OctahedronGeometry'],
  ['entity', 'TetrahedronGeometry'],
  ['trigger', 'SphereGeometry'],
];

describe('PlatonicNode', () => {
  it.each(cases)('renders kind %s with %s', async (kind, geometryType) => {
    const renderer = await ReactThreeTestRenderer.create(<PlatonicNode {...baseProps} kind={kind} />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    expect(mesh.geometry.type).toBe(geometryType);
  });

  it('keeps reagraph raycast userData on the mesh', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PlatonicNode {...baseProps} kind="area" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    expect(mesh.userData).toEqual({ id: 'node-1', type: 'node' });
  });

  it('uses a lit Phong material so the directional lights shade the facets', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PlatonicNode {...baseProps} kind="area" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    expect((mesh.material as { type: string }).type).toBe('MeshPhongMaterial');
  });

  it('slowly spins the platonic solids over time', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PlatonicNode {...baseProps} kind="area" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    expect(mesh.rotation.y).toBe(0);
    await renderer.advanceFrames(10, 0.1);
    expect(mesh.rotation.y).toBeGreaterThan(0);
  });

  it('leaves the sphere fallback still', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PlatonicNode {...baseProps} kind="trigger" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    await renderer.advanceFrames(10, 0.1);
    expect(mesh.rotation.y).toBe(0);
  });
});
