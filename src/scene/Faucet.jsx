import React from 'react';
import { IN_TO_FT } from './Room';

// Faucets sit on top of the vanity counter. `deckY` is the vanity's
// countertop height in feet, passed down from Fixtures.jsx.
export default function Faucet({ item, position, deckY, rotationY = 0 }) {
  const [x, z] = position;
  const displayColor = item.style === 'bridge' ? item.color : '#2b2e31';
  const mat = { color: displayColor, metalness: 0.85, roughness: 0.2 };
  const spoutH = item.h * IN_TO_FT;

  return (
    <group position={[x, deckY, z]} rotation={[0, rotationY, 0]}>
      {item.style === 'bridge' && (
        <>
          <mesh position={[-0.12, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.06, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          <mesh position={[0.12, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.06, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          <mesh position={[0, spoutH * 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.24, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </>
      )}

      {item.style === 'vessel' && (
        <mesh position={[0, spoutH / 2, -0.05]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, spoutH, 10]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      )}

      {item.style === 'modern' && (
        <>
          <mesh position={[0, spoutH * 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.02, spoutH * 0.8, 12]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          <mesh position={[0, spoutH * 0.85, 0.06]} rotation={[Math.PI / 3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.14, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </>
      )}
    </group>
  );
}
