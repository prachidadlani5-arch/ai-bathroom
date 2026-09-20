import React from 'react';
import { useConfigStore } from '../store/useConfigStore';

const STEPS = [
  { n: 1, label: 'Space' },
  { n: 2, label: 'Style' },
  { n: 3, label: 'Your bathroom' },
];

export default function StepNav() {
  const { currentStep, setStep, solutions } = useConfigStore();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {STEPS.map((s, i) => {
        const reachable = s.n === 1 || s.n === 2 || (s.n === 3 && solutions.length > 0);
        const active = currentStep === s.n;
        return (
          <div key={s.n} className="flex items-center gap-1">
            <button
              disabled={!reachable}
              onClick={() => reachable && setStep(s.n)}
              className={
                'px-3 py-1.5 rounded-full font-medium transition ' +
                (active
                  ? 'bg-stone-800 text-white'
                  : reachable
                  ? 'text-stone-500 hover:text-stone-800'
                  : 'text-stone-300 cursor-not-allowed')
              }
            >
              {s.n}. {s.label}
            </button>
            {i < STEPS.length - 1 && <span className="text-stone-300">&mdash;</span>}
          </div>
        );
      })}
    </nav>
  );
}
