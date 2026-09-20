import { create } from 'zustand';
import { optimize, generateSolutionSet } from '../engine/optimize';
import { applyNaturalLanguageEdit } from '../engine/nlEdit';
import { THEME_IDS } from '../data/catalog';

const CATEGORIES = ['toilet', 'shower', 'vanity', 'faucet'];

function diffPicks(a, b) {
  if (!a || !b) return [];
  return CATEGORIES.filter((c) => a[c]?.id !== b[c]?.id);
}

export const useConfigStore = create((set, get) => ({
  // Hard/base constraints
  roomWidthFt: 8,
  roomDepthFt: 6,
  budget: 300000, // \u20b93,00,000 default -- comfortably covers a Balanced bundle,
                   // forces a real trade-off on Luxury-leaning. Adjust freely in the panel.
  theme: THEME_IDS[0],
  wantTub: false,
  hasPower: true,

  // Derived
  solutions: [],       // [{label, luxuryWeight, picks, total, score, withinBudget, fits}]
  selectedIndex: 0,
  changedKeys: [],      // categories that differ from the previously selected bundle
  history: [],          // [{ text, note, matched }]
  stats: null,          // { combosEvaluated, elapsedMs } -- real numbers from the last solve

  // Wizard flow
  currentStep: 1, // 1 = Space, 2 = Style, 3 = Your Bathroom
  setStep: (n) => set({ currentStep: n }),

  setRoomWidthFt: (v) => set({ roomWidthFt: v }),
  setRoomDepthFt: (v) => set({ roomDepthFt: v }),
  setBudget: (v) => set({ budget: v }),
  setTheme: (v) => set({ theme: v }),
  setWantTub: (v) => set({ wantTub: v }),
  setHasPower: (v) => set({ hasPower: v }),

  generate: () => {
    const { roomWidthFt, roomDepthFt, budget, theme, wantTub, hasPower } = get();
    const t0 = performance.now();
    const solutions = generateSolutionSet({
      widthFt: roomWidthFt, depthFt: roomDepthFt, budget, theme, wantTub, hasPower,
    });
    const elapsedMs = performance.now() - t0;
    const combosEvaluated = solutions.reduce((s, sol) => s + (sol.combosEvaluated || 0), 0);
    set({
      solutions, selectedIndex: 1, changedKeys: [], history: [],
      currentStep: 3, stats: { combosEvaluated, elapsedMs },
    }); // default to "Balanced"
  },

  selectSolution: (index) => {
    const { solutions, selectedIndex } = get();
    const prevPicks = solutions[selectedIndex]?.picks;
    const nextPicks = solutions[index]?.picks;
    set({ selectedIndex: index, changedKeys: diffPicks(prevPicks, nextPicks) });
  },

  applyEdit: (text) => {
    const { roomWidthFt, roomDepthFt, budget, theme, wantTub, hasPower, solutions, selectedIndex, history } = get();
    const currentLuxuryWeight = solutions[selectedIndex]?.luxuryWeight ?? 0.7;
    const prevPicks = solutions[selectedIndex]?.picks;

    const { params, note, matched } = applyNaturalLanguageEdit(text, {
      budget, theme, wantTub, hasPower, luxuryWeight: currentLuxuryWeight,
    });

    const newHistory = [...history, { text, note, matched }];

    if (!matched) {
      set({ history: newHistory });
      return;
    }

    // Re-solve at the edited luxury weight (and theme, if it changed) as
    // its own "custom" solution, while regenerating the full 3-way set
    // too, so the picker stays useful.
    const t0 = performance.now();
    const customResult = optimize({
      widthFt: roomWidthFt, depthFt: roomDepthFt,
      budget: params.budget, theme: params.theme, wantTub: params.wantTub, hasPower: params.hasPower,
      luxuryWeight: params.luxuryWeight,
    });
    const customSolution = { label: 'Custom (your edit)', luxuryWeight: params.luxuryWeight, ...customResult };

    const baseSolutions = generateSolutionSet({
      widthFt: roomWidthFt, depthFt: roomDepthFt,
      budget: params.budget, theme: params.theme, wantTub: params.wantTub, hasPower: params.hasPower,
    });
    const elapsedMs = performance.now() - t0;
    const combosEvaluated = customResult.combosEvaluated
      + baseSolutions.reduce((s, sol) => s + (sol.combosEvaluated || 0), 0);

    const solutionsOut = [customSolution, ...baseSolutions];
    const changedKeys = diffPicks(prevPicks, customSolution.picks);

    set({
      budget: params.budget,
      theme: params.theme,
      wantTub: params.wantTub,
      hasPower: params.hasPower,
      solutions: solutionsOut,
      selectedIndex: 0,
      changedKeys,
      history: newHistory,
      stats: { combosEvaluated, elapsedMs },
    });
  },
}));
