import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Camera, Download, Edit3 } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 h-[calc(100vh-10rem)]">
      {/* 3D Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true, antialias: true }}
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

        {/* Edit Button */}
        <button
          onClick={() => setStep(2)}
          className="absolute top-4 left-4 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-white/100 flex items-center gap-2 group"
        >
          <Edit3 size={16} className="group-hover:-translate-x-1 transition" />
          Refine Style
        </button>

        {/* Camera Presets */}
        <div className="absolute top-4 right-4 glass-card rounded-xl p-1 flex gap-1.5">
          {Object.entries(CAMERA_PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                preset === key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-white/60'
              }`}
            >
              <Camera size={14} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={downloadSnapshot}
          title="Save a snapshot of this view"
          className="absolute bottom-4 right-4 glass-card px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-white/100 flex items-center gap-2 group"
        >
          <Download size={16} className="group-hover:scale-110 transition" />
          Download
        </button>

        {/* Stats */}
        {stats && (
          <div className="absolute bottom-4 left-4 glass-dark rounded-xl px-3 py-2 text-xs font-medium">
            <div className="text-white/90">
              🚀 {stats.combosEvaluated.toLocaleString('en-IN')} combinations
            </div>
            <div className="text-white/70">
              {stats.elapsedMs < 1 ? '&lt;1ms' : Math.round(stats.elapsedMs) + 'ms'}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
        <SolutionPicker />
        <BundleSummary />
        <RefineBar />
      </div>
    </div>
  );
}
