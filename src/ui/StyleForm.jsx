import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { THEMES } from '../data/catalog';

export default function StyleForm() {
  const { theme, setTheme, setStep, generate } = useConfigStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl text-stone-800 mb-2">Choose an aesthetic</h2>
      <p className="text-stone-500 text-sm mb-8">
        The optimizer weighs every product against your chosen style -- pick the one closest to what you want.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={
              'text-left rounded-lg border p-4 transition ' +
              (theme === t.id
                ? 'border-amber-700 ring-1 ring-amber-700 bg-amber-50'
                : 'border-stone-300 bg-white hover:border-stone-400')
            }
          >
            <div className="flex h-2 rounded overflow-hidden mb-3">
              {t.swatch.map((c, i) => (
                <span key={i} style={{ background: c }} className="flex-1" />
              ))}
            </div>
            <div className="font-serif text-lg text-stone-800">{t.id}</div>
            <div className="text-xs text-stone-500 mt-1 leading-snug">{t.blurb}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-10">
        <button
          onClick={() => setStep(1)}
          className="text-sm font-semibold px-5 py-3 rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50"
        >
          &larr; Back
        </button>
        <button
          onClick={() => generate()}
          className="bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold px-6 py-3 rounded-md"
        >
          Generate my bathroom &rarr;
        </button>
      </div>
    </div>
  );
}
