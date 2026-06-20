import ReactThreeTestRenderer from '@react-three/test-renderer';
import { BackSide, type Mesh, type ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';

import { MAX_CAMERA_DISTANCE, RoomEnvironment, SKYBOX_RADIUS } from './room-environment';

const hex = (value: unknown) => (value as { getHexString: () => string }).getHexString();

describe('RoomEnvironment', () => {
  it('renders an inward-facing skybox tinted for the dark theme', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RoomEnvironment resolvedTheme="dark" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    const material = mesh.material as ShaderMaterial;
    expect(material.side).toBe(BackSide);
    expect(hex(material.uniforms.uTop.value)).toBe('334155');
    expect(hex(material.uniforms.uBottom.value)).toBe('010309');
  });

  it('re-tints for the light theme', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RoomEnvironment resolvedTheme="light" />);
    const mesh = renderer.scene.findByType('Mesh').instance as Mesh;
    const material = mesh.material as ShaderMaterial;
    expect(hex(material.uniforms.uTop.value)).toBe('ffffff');
  });
});

describe('MAX_CAMERA_DISTANCE', () => {
  it('clamps the dolly-out short of the skybox so it never exits the room', () => {
    expect(MAX_CAMERA_DISTANCE).toBeGreaterThan(0);
    expect(MAX_CAMERA_DISTANCE).toBeLessThan(SKYBOX_RADIUS);
  });
});
