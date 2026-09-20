import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

// A framed mirror mounted on the back wall above the vanity. Uses a real
// planar reflection (not a baked/static texture), so the room genuinely
// reflects in it as the camera orbits -- a small detail that reads as much
// more "finished" than an empty wall above the sink.
export default function Mirror({ position, width = 2.2, height = 2.1, frameColor = '#2b2b2b' }) {
  const frameThickness = 0.07;
  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0, -0.015]} castShadow>
        <boxGeometry args={[width + frameThickness * 2, height + frameThickness * 2, 0.035]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Reflective glass -- kept modest resolution/blur since this is a
          small accent surface, not the focal point of the scene. */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width, height]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[120, 40]}
          mixBlur={0.6}
          mixStrength={1.1}
          depthScale={0}
          minDepthThreshold={0.9}
          maxDepthThreshold={1.2}
          color="#d4d4d4"
          metalness={0.1}
          roughness={0.12}
          mirror={0.55}
        />
      </mesh>
    </group>
  );
}
