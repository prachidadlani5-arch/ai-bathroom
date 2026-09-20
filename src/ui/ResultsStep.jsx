import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Camera, Download } from 'lucide-react';
import Room from '../scene/Room';
import Fixtures from '../scene/Fixtures';
import SceneLighting from '../scene/SceneLighting';
import CameraRig from '../scene/CameraRig';
import SolutionPicker from './SolutionPicker';
import BundleSummary from './BundleSummary';
import RefineBar from './RefineBar';
import { useConfigStore } from '../store/useConfigStore';

export default function ResultsStep() {
  const { roomWidthFt, roomDepthFt, theme, solutions, selectedIndex, changedKeys, stats, setStep } = useConfigStore();
  const maxSpan = Math.max(roomWidthFt, roomDepthFt);
  const hw = roomWidthFt / 2;
  const hd = roomDepthFt / 2;
  const selected = solutions[selectedIndex];

  const controlsRef = useRef();
  const glRef = useRef();
  const [preset, setPreset] = useState('wide');

  // Approximate corner framing, matching Fixtures.jsx's own placement
  // heuristic (vanity/toilet along the back wall, shower on the right
  // wall) closely enough for a camera cut -- doesn't need to be pixel
  // perfect since the user can still orbit freely once it settles.
  const CAMERA_PRESETS = {
    wide: { label: 'Wide', position: [maxSpan * 0.75, maxSpan * 0.62, maxSpan * 0.9], lookAt: [0, 1, 0] },
    vanity: { label: 'Vanity', position: [-hw * 0.25, 1.7, hd * 0.55], lookAt: [-hw + 1.2, 1.3, -hd + 1] },
    shower: { label: 'Shower', position: [hw * 0.2, 1.7, -hd * 0.1], lookAt: [hw - 1.2, 1.5, hd - 1] },
  };

  const downloadSnapshot = () => {
    const gl = glRef.current;
    if (!gl) return;
    const link = document.createElement('a');
    link.download = 'my-kohler-bathroom.png';
    link.href = gl.domElement.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 h-[calc(100vh-8.5rem)]">
      <div className="relative rounded-lg overflow-hidden border border-stone-300">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          onCreated={({ gl }) => { glRef.current = gl; }}
          camera={{ position: CAMERA_PRESETS.wide.position, fov: 42 }}
        >
          <color attach="background" args={['#b9b4a6']} />
          <fog attach="fog" args={['#b9b4a6', maxSpan * 2, maxSpan * 6]} />
          <SceneLighting />
          <Room widthFt={roomWidthFt} depthFt={roomDepthFt} theme={theme} />
          <Fixtures
            bundle={selected?.picks}
            widthFt={roomWidthFt}
            depthFt={roomDepthFt}
            changedKeys={changedKeys}
            theme={theme}
          />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={maxSpan * 2} blur={2} far={4} />
          <OrbitControls
            ref={controlsRef}
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={2}
            maxDistance={maxSpan * 3}
          />
          <CameraRig
            position={CAMERA_PRESETS[preset].position}
            lookAt={CAMERA_PRESETS[preset].lookAt}
            controlsRef={controlsRef}
          />
        </Canvas>

        <button
          onClick={() => setStep(2)}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold text-stone-700 px-3 py-1.5 rounded-full border border-stone-300 hover:bg-white"
        >
          &larr; Edit style
        </button>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full border border-stone-300 p-1">
          {Object.entries(CAMERA_PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition ${
                preset === key ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Camera size={12} /> {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={downloadSnapshot}
          title="Save a snapshot of this view"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur text-xs font-semibold text-stone-700 px-3 py-1.5 rounded-full border border-stone-300 hover:bg-white"
        >
          <Download size={13} /> Save snapshot
        </button>

        {stats && (
          <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur text-[11px] text-white/90 px-2.5 py-1 rounded-full">
            Evaluated {stats.combosEvaluated.toLocaleString('en-IN')} combinations in {stats.elapsedMs < 1 ? '<1' : Math.round(stats.elapsedMs)}ms
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        <SolutionPicker />
        <BundleSummary />
        <RefineBar />
      </div>
    </div>
  );
}
