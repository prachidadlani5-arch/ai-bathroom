import React from 'react';
import { Droplets, Waves, Wind, Circle } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';
import { fmt } from '../utils/format';

const CATEGORY_CONFIG = {
  vanity: { label: 'Vanity', icon: Droplets, color: 'from-blue-500 to-indigo-600' },
  faucet: { label: 'Faucet', icon: Waves, color: 'from-cyan-500 to-blue-600' },
  shower: { label: 'Shower', icon: Wind, color: 'from-teal-500 to-cyan-600' },
  toilet: { label: 'Toilet', icon: Circle, color: 'from-slate-500 to-gray-600' },
};
export default function BundleSummary() {
  const { solutions, selectedIndex } = useConfigStore();
  const selected = solutions[selectedIndex];
  if (!selected) return null;

  const { picks, total } = selected;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 border-white/20">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Bundle Details</h3>
        <p className="text-sm text-slate-600">Your selected fixture specifications</p>
      </div>

      <div className="space-y-3">
        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
          const Item = config.icon;
          const product = picks[category];
          if (!product) return null;

          return (
            <div
              key={category}
              className="p-4 rounded-xl bg-gradient-to-r from-white/90 to-white/70 border border-white/30 hover:border-white/60 transition"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <Item size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{config.label}</h4>
                  <p className="text-xs text-slate-600 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                      {fmt(product.price)}
                    </span>
                    <span className="text-xs text-slate-500">Quality {Math.round(product.quality * 100)}/100</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-white/30">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900">Total Investment</span>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {fmt(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
