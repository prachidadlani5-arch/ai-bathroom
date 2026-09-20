import React from 'react';
import { Check, Ruler, Palette, Sparkles } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';

const STEPS = [
  { number: 1, label: 'Space', icon: Ruler, description: 'Room dimensions' },
  { number: 2, label: 'Style', icon: Palette, description: 'Style & budget' },
  { number: 3, label: 'Results', icon: Sparkles, description: 'Your solutions' },
];

export default function StepNav() {
  const { currentStep, setStep, roomWidthFt, roomDepthFt } = useConfigStore();

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = 
          (step.number === 1 && roomWidthFt && roomDepthFt) ||
          (step.number < currentStep);
        const isClickable = step.number < currentStep || (step.number === 1);

        return (
          <React.Fragment key={step.number}>
            <button
              onClick={() => isClickable && setStep(step.number)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white/20 text-white/60 cursor-not-allowed'
                }
              `}
            >
              {isCompleted && !isActive ? (
                <Check size={16} className="flex-shrink-0" />
              ) : (
                <Icon size={16} className="flex-shrink-0" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>

            {index < STEPS.length - 1 && (
              <div className="w-2 h-1 rounded-full bg-white/20" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
