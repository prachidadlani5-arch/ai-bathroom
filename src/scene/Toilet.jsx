import React from 'react';
import { IN_TO_FT } from './Room';

export default function Toilet({ item, position, rotationY = 0 }) {
  const w = item.w * IN_TO_FT;
  const d = item.d * IN_TO_FT;
  const h = item.h * IN_TO_FT;
  const [x, z] = position;
  const mat = { color: item.color, metalness: item.metalness, roughness: item.roughness };

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Bowl/base */}
      <mesh castShadow receiveShadow position={[0, h * 0.28, d * 0.1]}>
        <cylinderGeometry args={[w * 0.42, w * 0.5, h * 0.56, 20]} />
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* Seat/lid */}
      <mesh castShadow position={[0, h * 0.58, d * 0.05]}>
        <boxGeometry args={[w * 0.9, h * 0.06, d * 0.75]} />
        <meshStandardMaterial {...mat} />
      </mesh>

      {item.style === 'tank' ? (
        // Classic two-piece: visible tank at the back
        <mesh castShadow position={[0, h * 0.75, -d * 0.32]}>
          <boxGeometry args={[w * 0.75, h * 0.5, d * 0.28]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ) : (
        // Smart one-piece: slim integrated unit + small side control panel
        <>
          <mesh castShadow position={[0, h * 0.62, -d * 0.28]}>
            <boxGeometry args={[w * 0.8, h * 0.22, d * 0.3]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          <mesh position={[w * 0.55, h * 0.5, 0]}>
            <boxGeometry args={[0.06, 0.15, 0.25]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.6} roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}
