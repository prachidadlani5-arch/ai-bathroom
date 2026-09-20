import React from 'react';
import SpaceForm from './ui/SpaceForm';
import StyleForm from './ui/StyleForm';
import ResultsStep from './ui/ResultsStep';
import StepNav from './ui/StepNav';
import { useConfigStore } from './store/useConfigStore';

export default function App() {
  const { currentStep } = useConfigStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1">
            <div className="inline-block">
              <span className="text-xs tracking-widest font-bold text-blue-400 uppercase mb-2 block">
                ✨ Kohler AI Bathroom Designer
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Your Perfect Bathroom
              </h1>
              <p className="text-base text-slate-300 mt-2 max-w-2xl">
                AI-optimized bundles that balance room constraints, budget, and your personal style
              </p>
            </div>
          </div>
          <StepNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="animate-fade-in">
          {currentStep === 1 && <SpaceForm />}
          {currentStep === 2 && <StyleForm />}
          {currentStep === 3 && <ResultsStep />}
        </div>
      </main>
    </div>
  );
}
