import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { IN_TO_FT } from './Room';

export default function Vanity({ item, position, rotationY = 0 }) {
  const w = item.w * IN_TO_FT;
  const d = item.d * IN_TO_FT;
  const h = item.h * IN_TO_FT;
  const [x, z] = position;

  const countertopThickness = 0.08;
  const bodyHeight = h - countertopThickness - 0.15;
  const bodyY = item.style === 'floating' ? bodyHeight / 2 + 0.5 : bodyHeight / 2;

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Cabinet body */}
      <RoundedBox
        args={[w, bodyHeight, d]}
        radius={0.02}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, bodyY, 0]}
      >
        <meshStandardMaterial color={item.color} metalness={item.metalness} roughness={item.roughness} />
      </RoundedBox>

      {item.style === 'legged' &&
        [
          [-w / 2 + 0.08, -d / 2 + 0.08],
          [w / 2 - 0.08, -d / 2 + 0.08],
          [-w / 2 + 0.08, d / 2 - 0.08],
          [w / 2 - 0.08, d / 2 - 0.08],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.25, lz]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}

      {/* Countertop — glossy so it visibly picks up the environment light */}
      <RoundedBox
        args={[w + 0.03, countertopThickness, d + 0.03]}
        radius={0.015}
        smoothness={4}
        castShadow
        position={[0, h - countertopThickness / 2, 0]}
      >
        <meshStandardMaterial color="#fafaf8" metalness={0.05} roughness={0.08} />
      </RoundedBox>

      {/* Sink basin */}
      <mesh position={[0, h - countertopThickness - 0.03, 0]}>
        <cylinderGeometry args={[Math.min(w, d) * 0.22, Math.min(w, d) * 0.2, 0.06, 24]} />
        <meshStandardMaterial color="#eef0ef" metalness={0.05} roughness={0.15} />
      </mesh>
    </group>
  );
}
