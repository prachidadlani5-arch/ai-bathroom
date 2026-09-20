import React from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';

export default function SpaceForm() {
  const { roomWidthFt, roomDepthFt, setRoomWidth, setRoomDepth, setStep } = useConfigStore();

  const handleNext = () => {
    if (roomWidthFt && roomDepthFt) {
      setStep(2);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-8 space-y-8 border-white/20">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Tell us about your space</h2>
          <p className="text-lg text-slate-600">Help us optimize your bathroom design for your room dimensions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Width Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">Room Width</label>
            <div className="relative">
              <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input
                type="number"
                value={roomWidthFt || ''}
                onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 0)}
                placeholder="Enter width in feet"
               
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 border-2 border-white/40 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-bold text-lg transition"
              />
            </div>
            <p className="text-xs text-slate-500 ml-4">Typical: 5-10 feet</p>
          </div>

          {/* Depth Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">Room Depth</label>
            <div className="relative">
              <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
              <input
                type="number"
                value={roomDepthFt || ''}
                onChange={(e) => setRoomDepth(parseFloat(e.target.value) || 0)}
                placeholder="Enter depth in feet"
                min="4"
                max="20"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 border-2 border-white/40 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-bold text-lg transition"
              />
            </div>
            <p className="text-xs text-slate-500 ml-4">Typical: 5-10 feet</p>
          </div>
        </div>

        {/* Room Preview */}
        {roomWidthFt && roomDepthFt && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <p className="text-sm text-slate-600 mb-2">Your bathroom space</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">
                {roomWidthFt} × {roomDepthFt} ft
              </p>
              <p className="text-lg font-bold text-slate-600">
                ({Math.round(roomWidthFt * roomDepthFt)} sq ft)
              </p>
            </div>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!roomWidthFt || !roomDepthFt}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          Next: Choose Your Style
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
