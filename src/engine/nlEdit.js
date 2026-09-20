// Turns a sentence like "make it more luxurious but don't cross \u20b92.5L"
// into concrete, bounded changes to the optimizer's parameters. This is a
// deliberately simple, transparent rule-based parser — not an LLM call —
// so behavior is predictable and auditable. See the bottom of this file
// for how to upgrade it to an LLM-backed parser without changing anything
// downstream (the contract is just: text + params in, params + note out).

import { THEME_IDS } from '../data/catalog';

function parseIndianAmount(numStr, unitStr) {
  const n = parseFloat(numStr.replace(/,/g, ''));
  if (Number.isNaN(n)) return null;
  const unit = (unitStr || '').toLowerCase();
  if (unit.startsWith('lakh') || unit === 'lac' || unit === 'l') return n * 100000;
  if (unit.startsWith('crore') || unit === 'cr') return n * 10000000;
  if (unit === 'k') return n * 1000;
  return n;
}

function extractBudgetCap(text) {
  // "don't cross \u20b92.5L", "under $8000", "within 2.5 lakh", "budget of 90k"
  const patterns = [
    /(?:don'?t\s+cross|not\s+more\s+than|under|within|up\s*to|max(?:imum)?\s*(?:of)?|budget\s*(?:of|is|to)?)\s*[\u20b9$]?\s*([\d,.]+)\s*(lakhs?|lac|crores?|cr|k|l)?/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const amount = parseIndianAmount(m[1], m[2]);
      if (amount) return amount;
    }
  }
  return null;
}

function extractBudgetDelta(text) {
  // "increase (the) budget by 20%", "cut cost by 15%", "raise budget 10%"
  const m = text.match(
    /(increase|raise|up|bump|decrease|reduce|cut|lower)\s+(?:the\s+|my\s+)?(?:budget|cost)?\s*(?:by|to)?\s*(\d+(?:\.\d+)?)\s*%/i
  );
  if (!m) return null;
  const direction = /increase|raise|up|bump/i.test(m[1]) ? 1 : -1;
  const pct = parseFloat(m[2]) / 100;
  return direction * pct;
}

// Casual phrasing -> theme id. Checked as substrings against the lower-cased
// message, most-specific keys first so e.g. "art deco" wins over a bare
// "deco" collision with nothing else in the list.
const THEME_KEYWORDS = [
  ['art deco', 'Art Deco Glam'], ['deco', 'Art Deco Glam'], ['gatsby', 'Art Deco Glam'], ['glam', 'Art Deco Glam'],
  ['scandinavian', 'Scandinavian Spa'], ['nordic', 'Scandinavian Spa'], ['hygge', 'Scandinavian Spa'],
  ['industrial', 'Industrial Loft'], ['loft', 'Industrial Loft'], ['exposed pipe', 'Industrial Loft'], ['raw metal', 'Industrial Loft'],
  ['coastal', 'Coastal Casual'], ['beachy', 'Coastal Casual'], ['nautical', 'Coastal Casual'], ['seaside', 'Coastal Casual'],
  ['japanese', 'Japanese Zen'], ['zen', 'Japanese Zen'], ['wabi', 'Japanese Zen'], ['spa-like', 'Japanese Zen'],
  ['classic luxury', 'Classic Luxury'], ['classic', 'Classic Luxury'], ['traditional', 'Classic Luxury'], ['opulent', 'Classic Luxury'], ['timeless', 'Classic Luxury'],
  ['minimalist', 'Minimalist Modern'], ['modern', 'Minimalist Modern'], ['sleek', 'Minimalist Modern'], ['contemporary', 'Minimalist Modern'],
];

function extractThemeSwitch(text, currentTheme) {
  const triggered = /\b(switch|change|go|make it|feel|style|look|theme|vibe|aesthetic)\b/.test(text);
  if (!triggered) return null;
  for (const [kw, themeId] of THEME_KEYWORDS) {
    if (text.includes(kw) && THEME_IDS.includes(themeId) && themeId !== currentTheme) return themeId;
  }
  return null;
}

export function applyNaturalLanguageEdit(text, currentParams) {
  const t = text.toLowerCase();
  const next = { ...currentParams };
  const notes = [];
  let matched = false;

  // Absolute extremes take priority over the generic +/- 0.6 nudge below,
  // since "make it the most luxurious possible" should max out, not just
  // nudge, the weighting.
  if (/most luxurious|highest[- ]end|top[- ]of[- ]the[- ]line|no expense spared|money is no object|go all out|the best you can/.test(t)) {
    next.luxuryWeight = 2.2;
    notes.push('maxed out the luxury/quality weighting');
    matched = true;
  } else if (/cheapest|most affordable|lowest cost|minimum cost|bare minimum|rock[- ]bottom/.test(t)) {
    next.luxuryWeight = 0;
    notes.push('set the luxury/quality weighting to the most economical option');
    matched = true;
  } else {
    if (/luxur|premium|high[- ]?end|upscale|fanc|nicer|richer|elevate/.test(t)) {
      next.luxuryWeight = Math.min(2.2, currentParams.luxuryWeight + 0.6);
      notes.push('increased the luxury/quality weighting');
      matched = true;
    }
    // Deliberately does NOT match the bare word "budget" -- earlier this
    // list included "budget", which meant any message that merely
    // *mentioned* a budget number (e.g. "increase my budget to 5 lakh")
    // also silently nudged luxuryWeight down, fighting the very edit the
    // user was asking for. Compound "budget-ish" phrases still count.
    if (/\bcheap|afford|\bvalue\b|\bsave\b|economical|\bbasic\b|budget[- ]friendly|tight budget|low budget|shoestring/.test(t)) {
      next.luxuryWeight = Math.max(0, currentParams.luxuryWeight - 0.6);
      notes.push('reduced the luxury/quality weighting toward value picks');
      matched = true;
    }
  }

  const delta = extractBudgetDelta(text);
  const cap = extractBudgetCap(text);
  if (delta !== null) {
    next.budget = Math.max(10000, Math.round(currentParams.budget * (1 + delta)));
    notes.push(`${delta > 0 ? 'increased' : 'reduced'} the budget to \u20b9${next.budget.toLocaleString('en-IN')}`);
    matched = true;
  } else if (cap) {
    next.budget = cap;
    notes.push(`set the hard budget cap to \u20b9${cap.toLocaleString('en-IN')}`);
    matched = true;
  }

  const newTheme = extractThemeSwitch(t, currentParams.theme);
  if (newTheme) {
    next.theme = newTheme;
    notes.push(`switched the style to "${newTheme}"`);
    matched = true;
  }

  if (/(add|include|want|with)[^.]*\btub\b/.test(t) || /\bbathtub\b/.test(t)) {
    next.wantTub = true;
    notes.push('now allowing a bathtub option');
    matched = true;
  }
  if (/shower[- ]only|no\s+tub|remove\s+(the\s+)?tub|without\s+(a\s+)?tub/.test(t)) {
    next.wantTub = false;
    notes.push('restricted back to shower-only');
    matched = true;
  }

  if (/no\s+power|without\s+power|no\s+outlet/.test(t)) {
    next.hasPower = false;
    notes.push('assumed no power outlet near the toilet (excludes smart toilets)');
    matched = true;
  }
  if (/(has|with)\s+power|power\s+(is\s+)?available|outlet\s+(is\s+)?available/.test(t)) {
    next.hasPower = true;
    notes.push('assumed a power outlet is available near the toilet');
    matched = true;
  }

  if (!matched) {
    notes.push(
      "couldn't confidently map that to a change — try phrasing like " +
      '"more luxurious", "cheaper", "add a tub", "go industrial", "increase budget by 20%", or "don\'t cross \u20b92L"'
    );
  }

  return { params: next, note: notes.join('; '), matched };
}

// --- Upgrade path -----------------------------------------------------
// To replace this with an LLM-backed parser: send `text` plus the current
// params as JSON to your own backend, which calls the Claude API with a
// system prompt instructing it to return ONLY a JSON object with the same
// shape as `next` above (budget, theme, luxuryWeight, wantTub, hasPower)
// plus a one-line note. Validate the returned budget/luxuryWeight/theme
// are within sane bounds (theme must be one of THEME_IDS, budget positive,
// luxuryWeight in [0, 2.2]) before applying — never let a model-parsed
// edit silently blow past a budget the user just re-stated, or set a
// theme that doesn't exist in the catalog.
