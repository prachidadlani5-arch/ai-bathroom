import React from 'react';
import SpaceForm from './ui/SpaceForm';
import StyleForm from './ui/StyleForm';
import ResultsStep from './ui/ResultsStep';
import StepNav from './ui/StepNav';
import { useConfigStore } from './store/useConfigStore';

export default function App() {
  const { currentStep } = useConfigStore();

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-300 bg-white/70 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-widest text-amber-800 font-semibold">
              KOHLER . AI BATHROOM DESIGNER
            </div>
            <div className="font-serif text-xl text-stone-800 leading-tight">
              Physically feasible, price-optimized bathroom bundles
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Exhaustively optimized against your room, budget &amp; style — then refined with a plain-English sentence.
            </div>
          </div>
          <StepNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {currentStep === 1 && <SpaceForm />}
        {currentStep === 2 && <StyleForm />}
        {currentStep === 3 && <ResultsStep />}
      </main>
    </div>
  );
}
