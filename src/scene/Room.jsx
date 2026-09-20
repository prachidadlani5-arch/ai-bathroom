import React from 'react';
import { useMemo } from 'react';
import * as THREE from 'three';
import { THEMES } from '../data/catalog';

// All scene units are FEET. Fixture data is in INCHES, so we convert
// with IN_TO_FT wherever a fixture's w/d/h is used — see Fixtures.jsx.
export const IN_TO_FT = 1 / 12;

function mix(hexA, hexB, t) {
  return new THREE.Color(hexA).lerp(new THREE.Color(hexB), t).getStyle();
}

export default function Room({ widthFt, depthFt, wallHeightFt = 8, theme }) {
  // Wall/floor/trim colors derive from the selected theme's swatch
  // (light, mid, dark) so the whole room -- not just the fixture picks --
  // visibly reflects the chosen style. Falls back to a neutral palette if
  // no theme is passed.
  const swatch = (THEMES.find((t) => t.id === theme) || THEMES[0]).swatch;
  const [light, mid, dark] = swatch;

  const wallColor = useMemo(() => mix(light, '#ffffff', 0.1), [light]);
  const accentWallColor = useMemo(() => mix(mid, '#ffffff', 0.3), [mid]);
  const floorColor = useMemo(() => mix(mid, '#ffffff', 0.62), [mid]);
  const baseboardColor = dark;

  const hw = widthFt / 2;
  const hd = depthFt / 2;

  const tileLines = useMemo(() => {
    const lines = [];
    const step = 1; // 1ft tiles
    for (let x = -hw; x <= hw; x += step) lines.push([x, -hd, x, hd]);
    for (let z = -hd; z <= hd; z += step) lines.push([-hw, z, hw, z]);
    return lines;
  }, [hw, hd]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[widthFt, depthFt]} />
        <meshStandardMaterial color={floorColor} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Tile grid for scale reference */}
      {tileLines.map(([x1, z1, x2, z2], i) => (
        <line key={i} position={[0, 0.003, 0]}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geo) =>
              geo.setFromPoints([
                { x: x1, y: 0, z: z1 },
                { x: x2, y: 0, z: z2 },
              ])
            }
          />
          <lineBasicMaterial attach="material" color="#a39d8c" transparent opacity={0.6} />
        </line>
      ))}

      {/* Back wall -- the accent wall, a bolder tint of the theme's mid tone */}
      <mesh position={[0, wallHeightFt / 2, -hd]} receiveShadow castShadow>
        <boxGeometry args={[widthFt, wallHeightFt, 0.15]} />
        <meshStandardMaterial color={accentWallColor} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, wallHeightFt / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.15, wallHeightFt, depthFt]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Right wall — kept faint so the camera can still see into the room */
      }
      <mesh position={[hw, wallHeightFt / 2, 0]}>
        <boxGeometry args={[0.1, wallHeightFt, depthFt]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Baseboard trim — a thin dark strip at the floor line reads as a
          finished room far more than bare wall-meets-floor does. */}
      <mesh position={[0, 0.06, -hd + 0.08]}>
        <boxGeometry args={[widthFt, 0.12, 0.02]} />
        <meshStandardMaterial color={baseboardColor} roughness={0.6} />
      </mesh>
      <mesh position={[-hw + 0.08, 0.06, 0]}>
        <boxGeometry args={[0.02, 0.12, depthFt]} />
        <meshStandardMaterial color={baseboardColor} roughness={0.6} />
      </mesh>
    </group>
  );
}
