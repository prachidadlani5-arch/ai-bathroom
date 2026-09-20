import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { fmt } from '../utils/format';
const LABEL = { toilet: 'Toilet', shower: 'Shower / Bath', vanity: 'Vanity', faucet: 'Faucet' };
const ORDER = ['toilet', 'shower', 'vanity', 'faucet'];

export default function BundleSummary() {
  const { solutions, selectedIndex, budget, changedKeys } = useConfigStore();
  const sol = solutions[selectedIndex];
  if (!sol) return null;

  return (
    <div className="w-[320px] bg-white/95 backdrop-blur border border-stone-200 rounded shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-baseline border-b border-stone-200 pb-3">
        <div>
          <span className="text-sm text-stone-500 block">{sol.label}</span>
          <span className="text-[11px] text-stone-400">
            {sol.withinBudget ? 'within budget' : 'over budget'} - {sol.fits ? 'fits room' : 'tight fit'}
          </span>
        </div>
        <span className={'font-serif text-2xl ' + (sol.total > budget ? 'text-red-700' : 'text-stone-800')}>
          {fmt(sol.total)}
        </span>
      </div>

      <div className="space-y-2">
        {ORDER.map((cat) => {
          const item = sol.picks[cat];
          const changed = changedKeys.includes(cat);
          return (
            <div
              key={cat}
              className={
                'flex items-center justify-between text-sm rounded px-1.5 py-1 -mx-1.5 ' +
                (changed ? 'bg-amber-50 ring-1 ring-amber-300' : '')
              }
            >
              <div>
                <div className="text-[10px] uppercase tracking-wide text-amber-800 font-semibold flex items-center gap-1.5">
                  {LABEL[cat]}
                  {changed && <span className="text-amber-600">- updated</span>}
                </div>
                <div className="font-serif text-stone-800">{item.name}</div>
              </div>
              <div className="text-stone-500 text-xs">{fmt(item.price)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
