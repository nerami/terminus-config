import { useRef } from 'react';

import { animated as a, useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { type ColorRepresentation, DoubleSide, type Mesh } from 'three';

import { solidForKind } from './graph-3d-style';

import type { NodeKind } from '@/lib/ha-graph/build';

// reagraph's own Sphere uses this exact spring config; reuse it so our solids
// pop in at the same cadence as the edges and labels reagraph still animates.
const SPRING_CONFIG = { friction: 300, mass: 10, precision: 0.1, tension: 1000 };

// Idle spin (radians/sec) for the platonic solids — slow enough to read as
// "alive" without distracting. The sphere fallback doesn't spin (no visible
// effect, and it keeps the most common nodes calm).
const ROTATE_SPEED = 0.5;

interface PlatonicNodeProps {
  active: boolean;
  animated: boolean;
  color: ColorRepresentation;
  id: string;
  kind: NodeKind;
  opacity: number;
  selected: boolean;
  size: number;
}

/**
 * Drop-in replacement for reagraph's `<Sphere>` node symbol that swaps the
 * geometry per kind (see `solidForKind`). It mirrors reagraph's mesh faithfully:
 * the `userData={{ id, type: 'node' }}` raycast contract (clicks/drag/selection
 * depend on it), the scale/opacity spring, and the lit emissive Phong material so
 * the canvas's two directional lights shade the facets.
 */
export function PlatonicNode({ active, animated, color, id, kind, opacity, selected, size }: PlatonicNodeProps) {
  const { nodeOpacity, scale } = useSpring({
    config: animated ? SPRING_CONFIG : { duration: 0 },
    from: { nodeOpacity: 0, scale: [0.00001, 0.00001, 0.00001] },
    to: { nodeOpacity: opacity, scale: [size, size, size] },
  });
  const solid = solidForKind(kind);
  const hot = selected || active;

  // Slowly tumble the faceted solids; the spring still owns scale, we only touch
  // rotation. Skipped for the sphere (a spinning sphere looks identical).
  const meshRef = useRef<Mesh>(null);
  const spins = solid !== 'sphere';
  useFrame((_, delta) => {
    if (!spins || !meshRef.current) return;
    meshRef.current.rotation.y += delta * ROTATE_SPEED;
    meshRef.current.rotation.x += delta * ROTATE_SPEED * 0.5;
  });

  return (
    <a.mesh ref={meshRef} scale={scale as unknown as [number, number, number]} userData={{ id, type: 'node' }}>
      {solid === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
      {solid === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
      {solid === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
      {solid === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
      {solid === 'sphere' && <sphereGeometry args={[1, 25, 25]} />}
      <a.meshPhongMaterial
        attach="material"
        color={color}
        emissive={color}
        emissiveIntensity={hot ? 0.95 : 0.7}
        fog
        opacity={nodeOpacity}
        side={DoubleSide}
        transparent
      />
    </a.mesh>
  );
}
