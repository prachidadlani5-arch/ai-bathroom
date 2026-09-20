import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { IN_TO_FT } from './Room';

export default function ShowerOrTub({ item, position, rotationY = 0 }) {
  const w = item.w * IN_TO_FT;
  const d = item.d * IN_TO_FT;
  const h = item.h * IN_TO_FT;
  const [x, z] = position;

  if (item.isTub) {
    return (
      <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
        <RoundedBox args={[w, h, d]} radius={0.04} smoothness={4} castShadow receiveShadow position={[0, h / 2, 0]}>
          <meshStandardMaterial color={item.color} metalness={item.metalness} roughness={item.roughness} />
        </RoundedBox>
        <mesh position={[0, h - 0.08, 0]}>
          <boxGeometry args={[w - 0.25, 0.1, d - 0.25]} />
          <meshStandardMaterial color="#d3dede" metalness={0.05} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // Frosted-glass enclosure: a reliably visible look (no transmission pass
  // required) — light tinted panels with a visible brushed-metal frame,
  // which reads clearly as "glass shower" from any angle/lighting.
  const frameColor = item.frameColor || '#5c6167';

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Base pan */}
      <RoundedBox args={[w, 0.1, d]} radius={0.02} smoothness={2} receiveShadow position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#d9d5c9" roughness={0.5} />
      </RoundedBox>

      {/* Frosted glass panels */}
      <mesh position={[0, h / 2 + 0.05, d / 2]}>
        <boxGeometry args={[w, h, 0.03]} />
        <meshPhysicalMaterial color="#eef3f2" transparent opacity={0.32} roughness={0.4} metalness={0} />
      </mesh>
      <mesh position={[w / 2, h / 2 + 0.05, 0]}>
        <boxGeometry args={[0.03, h, d]} />
        <meshPhysicalMaterial color="#eef3f2" transparent opacity={0.32} roughness={0.4} metalness={0} />
      </mesh>

      {/* Frame posts, so the glass edges read clearly */}
      {[[-w / 2, d / 2], [w / 2, d / 2], [w / 2, -d / 2]].map(([fx, fz], i) => (
        <mesh key={i} position={[fx, h / 2 + 0.05, fz]}>
          <boxGeometry args={[0.03, h, 0.03]} />
          <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Shower head, mounted on the back wall */}
      <mesh position={[0, h * 0.85, -d / 2 + 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshStandardMaterial color={item.color} metalness={item.metalness} roughness={item.roughness} />
      </mesh>
      <mesh position={[0, h * 0.78, -d / 2 + 0.25]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.25, 12]} />
        <meshStandardMaterial color={item.color} metalness={item.metalness} roughness={item.roughness} />
      </mesh>

      {/* Thermostatic control trim */}
      <mesh position={[-w / 2 + 0.15, h * 0.4, -d / 2 + 0.03]} castShadow>
        <boxGeometry args={[0.14, 0.2, 0.035]} />
        <meshStandardMaterial color={item.color} metalness={item.metalness} roughness={item.roughness} />
      </mesh>
    </group>
  );
}
