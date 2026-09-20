import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { fmt } from '../utils/format';

export default function SpaceForm() {
  const {
    roomWidthFt, roomDepthFt, budget, wantTub, hasPower,
    setRoomWidthFt, setRoomDepthFt, setBudget, setWantTub, setHasPower,
    setStep,
  } = useConfigStore();

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-serif text-3xl text-stone-800 mb-2">Tell us about your space</h2>
      <p className="text-stone-500 text-sm mb-8">
        Room size and budget are hard limits -- everything the engine recommends will respect both.
      </p>

      <div className="space-y-7">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-stone-500 mb-2">
            ROOM DIMENSIONS (FEET)
          </label>
          <div className="flex items-center gap-3 max-w-xs">
            <input
              type="number" min="4" max="20" step="0.5" value={roomWidthFt}
              onChange={(e) => setRoomWidthFt(+e.target.value)}
              className="w-full border border-stone-300 rounded-md px-3 py-2.5 text-base"
            />
            <span className="text-stone-400">x</span>
            <input
              type="number" min="4" max="20" step="0.5" value={roomDepthFt}
              onChange={(e) => setRoomDepthFt(+e.target.value)}
              className="w-full border border-stone-300 rounded-md px-3 py-2.5 text-base"
            />
            <span className="text-stone-400 text-sm">ft</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-stone-500 mb-2">
            BUDGET
          </label>
          <div className="font-serif text-4xl text-stone-800 mb-2">{fmt(budget)}</div>
          <input
            type="range" min="80000" max="1500000" step="10000" value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            className="w-full max-w-md accent-amber-700"
          />
          <div className="flex justify-between text-[11px] text-stone-400 max-w-md mt-1">
            <span>{fmt(80000)}</span>
            <span>{fmt(1500000)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-stone-500 mb-2">
            BATHTUB
          </label>
          <select
            value={wantTub ? 'yes' : 'no'}
            onChange={(e) => setWantTub(e.target.value === 'yes')}
            className="border border-stone-300 rounded-md px-3 py-2.5 text-base max-w-xs w-full"
          >
            <option value="no">No -- shower only</option>
            <option value="yes">Yes, if space allows</option>
          </select>
        </div>

        <label className="flex items-start gap-3 max-w-md cursor-pointer">
          <input
            type="checkbox"
            checked={hasPower}
            onChange={(e) => setHasPower(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <span className="text-sm text-stone-600 leading-snug">
            Power outlet available near the toilet location
            <span className="block text-stone-400 text-xs mt-0.5">
              Unchecked excludes smart/bidet toilets -- a real compatibility constraint, not a preference.
            </span>
          </span>
        </label>
      </div>

      <button
        onClick={() => setStep(2)}
        className="mt-10 bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold px-6 py-3 rounded-md"
      >
        Continue to style &rarr;
      </button>
    </div>
  );
}
