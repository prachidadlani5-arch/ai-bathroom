import React from 'react';
import { Environment } from '@react-three/drei';

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      {/* Key light — the main shadow-caster, angled like late-morning window light */}
      <directionalLight
        position={[5, 9, 4]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0015}
      />
      {/* Fill light — softens shadows on the un-lit side, no shadow casting */}
      <directionalLight position={[-5, 4, -3]} intensity={0.5} />
      {/* Rim/back light — separates fixtures from the back wall */}
      <directionalLight position={[0, 3, 6]} intensity={0.35} />
      {/* Soft reflections on chrome/glass without needing an HDRI file */}
      <Environment preset="studio" environmentIntensity={0.6} />
    </>
  );
}
