import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { fmt } from '../utils/format';

const CATEGORIES = ['toilet', 'shower', 'vanity', 'faucet'];

export default function SolutionPicker() {
  const { solutions, selectedIndex, selectSolution, budget, theme } = useConfigStore();
  if (!solutions.length) return null;

  return (
    <div className="w-[320px] bg-white/95 backdrop-blur border border-stone-200 rounded shadow-sm p-4 space-y-2">
      <div className="text-xs font-semibold tracking-wide text-stone-500 mb-1">
        Optimized solutions
      </div>
      {solutions.map((sol, i) => {
        const themeMatches = CATEGORIES.filter((c) => sol.picks[c].themes.includes(theme)).length;
        const avgQuality = Math.round(
          (CATEGORIES.reduce((s, c) => s + sol.picks[c].quality, 0) / CATEGORIES.length) * 100
        );
        return (
          <button
            key={sol.label + i}
            onClick={() => selectSolution(i)}
            className={
              'w-full text-left px-3 py-2.5 rounded border transition ' +
              (i === selectedIndex
                ? 'border-amber-700 bg-amber-50 ring-1 ring-amber-700'
                : 'border-stone-300 bg-white hover:bg-stone-50')
            }
          >
            <div className="flex justify-between items-center">
              <span className="font-serif text-sm text-stone-800">{sol.label}</span>
              <span className={'text-sm ' + (sol.total > budget ? 'text-red-700 font-semibold' : 'text-stone-600')}>
                {fmt(sol.total)}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              {sol.withinBudget ? 'within budget' : 'over budget'} · {sol.fits ? 'fits room' : 'tight fit'}
            </div>
            <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
              <span>{themeMatches}/4 match your style</span>
              <span>·</span>
              <span>quality {avgQuality}/100</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
