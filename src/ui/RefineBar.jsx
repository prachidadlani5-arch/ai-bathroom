import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useConfigStore } from '../store/useConfigStore';

export default function RefineBar() {
  const { nlEdit, nlEditLoading } = useConfigStore();
  const [prompt, setPrompt] = useState('');

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    await nlEdit(prompt);
    setPrompt('');
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-3 border-white/20">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Fine-Tune</h3>
        <p className="text-sm text-slate-600">Describe changes in plain English</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
          placeholder="e.g., 'Make the shower bigger' or 'Use more modern fixtures'"
          disabled={nlEditLoading}
          className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-white/40 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 font-medium text-sm"
        />
        <button
          onClick={handleRefine}
          disabled={!prompt.trim() || nlEditLoading}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all hover:scale-105"
        >
          {nlEditLoading ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
