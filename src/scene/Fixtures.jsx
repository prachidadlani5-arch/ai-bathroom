import React from 'react';
import { IN_TO_FT } from './Room';
import Vanity from './Vanity';
import Toilet from './Toilet';
import ShowerOrTub from './ShowerOrTub';
import Faucet from './Faucet';
import Mirror from './Mirror';
import { THEMES } from '../data/catalog';

function ChangedHalo({ x, z, radius }) {
  return (
    <mesh position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.82, radius, 40]} />
      <meshBasicMaterial color="#b9812f" transparent opacity={0.85} />
    </mesh>
  );
}

function Sconce({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fff4d6" emissive="#ffdca0" emissiveIntensity={1.4} />
      </mesh>
      <pointLight color="#ffdca0" intensity={0.5} distance={2.5} decay={2} />
    </group>
  );
}

// Wall-anchored placement heuristic: vanity + toilet along the back wall,
// shower/tub along the right-side wall. `changedKeys` (category names that
// differ from the previously selected/edited solution) gets a visible
// amber ring under the fixture, so a re-optimization is legible in 3D,
// not just in the price list.
export default function Fixtures({ bundle, widthFt, depthFt, changedKeys = [], theme }) {
  if (!bundle) return null;

  const hw = widthFt / 2;
  const hd = depthFt / 2;
  const margin = 0.25;

  const vanity = bundle.vanity;
  const toilet = bundle.toilet;
  const shower = bundle.shower;
  const faucet = bundle.faucet;

  const vanityW = vanity.w * IN_TO_FT;
  const vanityD = vanity.d * IN_TO_FT;
  const toiletW = toilet.w * IN_TO_FT;
  const toiletD = toilet.d * IN_TO_FT;
  const showerW = shower.w * IN_TO_FT;
  const showerD = shower.d * IN_TO_FT;

  const vanityPos = [-hw + vanityW / 2 + margin, -hd + vanityD / 2 + margin];
  const toiletPos = [hw - toiletW / 2 - margin, -hd + toiletD / 2 + margin];
  const showerPos = [hw - showerW / 2 - margin, hd - showerD / 2 - margin];

  const deckY = vanity.h * IN_TO_FT;
  const faucetPos = [vanityPos[0], vanityPos[1] + vanityD * 0.15];

  const frameColor = (THEMES.find((t) => t.id === theme) || THEMES[0]).swatch[2];
  const mirrorWidth = Math.min(vanityW * 0.82, 3.0);
  const mirrorHeight = 2.0;
  const mirrorY = deckY + 0.3 + mirrorHeight / 2;
  const mirrorZ = -hd + 0.08; // just proud of the back wall to avoid z-fighting

  return (
    <group>
      <Vanity item={vanity} position={vanityPos} />
      <Faucet item={faucet} position={faucetPos} deckY={deckY} />
      <Toilet item={toilet} position={toiletPos} />
      <ShowerOrTub item={shower} position={showerPos} rotationY={Math.PI} />

      <Mirror
        position={[vanityPos[0], mirrorY, mirrorZ]}
        width={mirrorWidth}
        height={mirrorHeight}
        frameColor={frameColor}
      />
      <Sconce position={[vanityPos[0] - mirrorWidth / 2 - 0.15, mirrorY, mirrorZ + 0.05]} />
      <Sconce position={[vanityPos[0] + mirrorWidth / 2 + 0.15, mirrorY, mirrorZ + 0.05]} />

      {changedKeys.includes('vanity') && (
        <ChangedHalo x={vanityPos[0]} z={vanityPos[1]} radius={Math.max(vanityW, vanityD) / 1.6} />
      )}
      {changedKeys.includes('toilet') && (
        <ChangedHalo x={toiletPos[0]} z={toiletPos[1]} radius={Math.max(toiletW, toiletD) / 1.6} />
      )}
      {changedKeys.includes('shower') && (
        <ChangedHalo x={showerPos[0]} z={showerPos[1]} radius={Math.max(showerW, showerD) / 1.6} />
      )}
      {changedKeys.includes('faucet') && (
        <ChangedHalo x={faucetPos[0]} z={faucetPos[1]} radius={0.35} />
      )}
    </group>
  );
}
