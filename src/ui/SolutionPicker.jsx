import React from 'react';
import { Check, Zap, BookOpen } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';
import { fmt } from '../utils/format';

const CATEGORIES = ['toilet', 'shower', 'vanity', 'faucet'];

export default function SolutionPicker() {
  const { solutions, selectedIndex, selectSolution, budget, theme } = useConfigStore();
  if (!solutions.length) return null;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 border-white/20">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Curated Solutions</h3>
        <p className="text-sm text-slate-600">Select your preferred bathroom bundle</p>
      </div>

      <div className="space-y-3">
        {solutions.map((sol, i) => {
          const themeMatches = CATEGORIES.filter((c) => sol.picks[c].themes.includes(theme)).length;
          const avgQuality = Math.round(
            (CATEGORIES.reduce((s, c) => s + sol.picks[c].quality, 0) / CATEGORIES.length) * 100
          );
          const isSelected = i === selectedIndex;
          const isOverBudget = sol.total > budget;
          const isTightFit = !sol.fits;

          return (
            <button
              key={sol.label + i}
              onClick={() => selectSolution(i)}
              className={`
                w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/80 bg-white/70'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-lg">{sol.label}</span>
                    {isSelected && <Check size={18} className="text-blue-600" />}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className={`px-2.5 py-1 rounded-full font-medium ${
                      sol.withinBudget 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {sol.withinBudget ? '✓ Within Budget' : '✗ Over Budget'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full font-medium ${
                      sol.fits 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {sol.fits ? '✓ Fits Room' : '⚠ Tight Fit'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {fmt(sol.total)}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Zap size={14} className="text-amber-500" />
                  <span><strong className="text-slate-900">{themeMatches}</strong>/4 style matches</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Zap size={14} className="text-indigo-500" />
                  <span><strong className="text-slate-900">{avgQuality}</strong>/100 quality</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
