import React from 'react';
import { ArrowLeft, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';

const THEME_OPTIONS = [
  { id: 'modern', label: '🏢 Modern', desc: 'Clean lines & minimalist' },
  { id: 'traditional', label: '🏛️ Traditional', desc: 'Classic elegance' },
  { id: 'contemporary', label: '✨ Contemporary', desc: 'Refined & trendy' },
  { id: 'spa', label: '🧖 Spa', desc: 'Luxurious & serene' },
];

const BUDGET_LEVELS = [
  { min: 2000, max: 4999, label: 'Budget', icon: '💰' },
  { min: 5000, max: 9999, label: 'Mid-Range', icon: '💳' },
  { min: 10000, max: 20000, label: 'Premium', icon: '💎' },
];

export default function StyleForm() {
  const { theme, setTheme, budget, setBudget, setStep, generateSolutions, solutionLoading } = useConfigStore();

  const handleGenerateSolutions = async () => {
    await generateSolutions();
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card rounded-3xl p-8 space-y-8 border-white/20">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Define your style</h2>
          <p className="text-lg text-slate-600">Tell us about your aesthetic preferences and budget</p>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-900">Preferred Style</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300 text-center
                  ${
                    theme === option.id
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                      : 'border-white/40 bg-white/60 hover:border-white/60'
                  }
                `}
              >
                <div className="text-2xl mb-2">{option.label.split(' ')[0]}</div>
                <h4 className="font-bold text-sm text-slate-900">{option.label.split(' ')[1]}</h4>
                <p className="text-xs text-slate-600 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-900">Budget Range</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BUDGET_LEVELS.map((level) => (
              <button
                key={level.label}
                onClick={() => setBudget(level.max)}
                className={`
                  p-5 rounded-2xl border-2 transition-all duration-300
                  ${
                    budget >= level.min && budget <= level.max
                      ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                      : 'border-white/40 bg-white/60 hover:border-white/60'
                  }
                `}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <h4 className="font-bold text-slate-900">{level.label}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  ${(level.min / 1000).toFixed(0)}k - ${(level.max / 1000).toFixed(0)}k
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Solutions */}
        <div className="space-y-4 pt-4 border-t border-white/30">
          <button
            onClick={handleGenerateSolutions}
            disabled={!theme || !budget || solutionLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles size={20} className={solutionLoading ? 'animate-spin' : ''} />
            {solutionLoading ? 'Generating Solutions...' : 'Generate Solutions'}
          </button>
          <button
            onClick={() => setStep(1)}
            className="w-full py-3 rounded-xl border-2 border-white/40 text-slate-900 font-bold text-base hover:bg-white/60 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Room Size
          </button>
        </div>
      </div>
    </div>
  );
}
