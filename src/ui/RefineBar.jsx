import React from 'react';
import { useState } from 'react';
import { useConfigStore } from '../store/useConfigStore';

const EXAMPLE_PROMPTS = [
  'more luxurious',
  'cheaper',
  'add a tub',
  'go industrial',
  'increase budget by 20%',
];

export default function RefineBar() {
  const { applyEdit, history } = useConfigStore();
  const [text, setText] = useState('');

  const submit = (value) => {
    const v = (value ?? text).trim();
    if (!v) return;
    applyEdit(v);
    setText('');
  };

  return (
    <div className="w-[320px] bg-white/95 backdrop-blur border border-stone-200 rounded shadow-sm p-4 space-y-3">
      <div className="text-xs font-semibold tracking-wide text-stone-500">
        Refine with a sentence
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={`e.g. "more luxurious, don't cross \u20b92.5L"`}
          className="flex-1 border border-stone-300 rounded px-2.5 py-1.5 text-sm"
        />
        <button
          onClick={() => submit()}
          className="bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold px-3 rounded"
        >
          Apply
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => submit(p)}
            className="text-[11px] text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full px-2.5 py-1"
          >
            {p}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1 border-t border-stone-200">
          {history.slice().reverse().map((h, i) => (
            <div key={i} className="text-[11px] leading-snug">
              <div className="text-stone-700 font-medium">&ldquo;{h.text}&rdquo;</div>
              <div className={h.matched ? 'text-stone-500' : 'text-amber-700'}>{h.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
