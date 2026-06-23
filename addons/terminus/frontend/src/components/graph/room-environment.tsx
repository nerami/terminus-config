import { useMemo } from 'react';

import { BackSide, Color, ShaderMaterial } from 'three';

import { roomEnvForTheme } from './graph-3d-style';

// A large inward-facing sphere with a vertical gradient — a procedural skybox so
// the scene reads as "inside a soft room" rather than a flat clear color.
//
// Why not drei <Environment>? Its `preset`s fetch .hdr maps from an external CDN
// (no good for a self-hosted, possibly-offline add-on), and its image-based
// lighting wouldn't relight our meshPhongMaterial nodes anyway. A gradient skybox
// gives the same surrounding feel offline, reacts to the theme, and — crucially —
// doesn't feed IBL into the Phong materials, so the existing directional lights
// need no retuning.
//
// TODO(room-bg): a cheaper non-WebGL alternative is a CSS layer behind a
// transparent canvas — an absolutely-positioned blurred radial gradient driven by
// --room-near/--room-far custom properties on :root/.dark. Revisit if the skybox
// draw cost ever matters; the CSS layer also blurs for free.
const VERTEX_SHADER = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vDir;
  uniform vec3 uBottom;
  uniform vec3 uTop;
  void main() {
    float h = clamp(normalize(vDir).y * 0.5 + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(mix(uBottom, uTop, h), 1.0);
  }
`;

// reagraph's camera starts at distance 1000 (fov 10°) and can dolly out to
// MAX_CAMERA_DISTANCE. The gradient is direction-only, so the sphere costs the
// same at any radius — make it big enough to always enclose the camera, so the
// gradient fills the background at every zoom and is never seen as an object.
export const SKYBOX_RADIUS = 8000;

// Cap the dolly-out (passed to GraphCanvas as `maxDistance`). Keeps the graph
// framed instead of shrinking to nothing against the background, and keeps the
// camera well inside SKYBOX_RADIUS. ~2.5x reagraph's default 1000 view distance.
export const MAX_CAMERA_DISTANCE = 2500;

// The skybox must never intercept pointer picks (it would swallow node clicks and
// the canvas-click that clears the selection).
const ignoreRaycast = () => null;

interface RoomEnvironmentProps {
  resolvedTheme: string | undefined;
}

export function RoomEnvironment({ resolvedTheme }: RoomEnvironmentProps) {
  const material = useMemo(() => {
    const { bottom, top } = roomEnvForTheme(resolvedTheme);
    return new ShaderMaterial({
      depthWrite: false,
      fog: false,
      fragmentShader: FRAGMENT_SHADER,
      side: BackSide,
      uniforms: { uBottom: { value: new Color(bottom) }, uTop: { value: new Color(top) } },
      vertexShader: VERTEX_SHADER,
    });
  }, [resolvedTheme]);

  return (
    <mesh material={material} raycast={ignoreRaycast} renderOrder={-1}>
      <sphereGeometry args={[SKYBOX_RADIUS, 32, 32]} />
    </mesh>
  );
}
