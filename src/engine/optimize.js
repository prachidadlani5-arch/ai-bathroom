import { CATALOG } from '../data/catalog';

const CATEGORIES = ['toilet', 'shower', 'vanity', 'faucet'];

// Mismatch score deliberately isn't tiny: if it were (e.g. 0.15), theme fit
// would mathematically dominate every luxury-weight preset and the three
// "solutions" would always converge on the same items regardless of
// weighting — which is exactly the bug this comment is here to prevent
// reintroducing. At 0.5, a strong enough quality gap CAN legitimately
// outweigh an imperfect theme match at high luxury weight, which is the
// real-world trade-off "more luxurious" should be able to make.
function themeMatchScore(item, theme) {
  return item.themes.includes(theme) ? 1 : 0.5;
}

/**
 * Evaluate one specific combination of four items against a budget/room/
 * compatibility context. Returns a score plus the raw numbers (price,
 * footprint use, whether hard constraints are violated) so the caller can
 * both rank combinations and explain *why* one was chosen.
 */
function evaluate(picks, ctx) {
  const { budget, theme, luxuryWeight, widthFt, depthFt } = ctx;

  const total = CATEGORIES.reduce((s, c) => s + picks[c].price, 0);
  const areaIn = widthFt * 12 * (depthFt * 12);
  const usedArea = CATEGORIES.reduce((s, c) => s + (picks[c].w + 18) * (picks[c].d + 18), 0);

  const themeScore = CATEGORIES.reduce((s, c) => s + themeMatchScore(picks[c], theme), 0);
  const qualityScore = CATEGORIES.reduce((s, c) => s + picks[c].quality * luxuryWeight, 0);

  // Continuous "prefer cheaper, all else equal" pull, present at every
  // price point (not just once a hard line is crossed). This is what
  // actually earns "Value" its name: without it, a low luxuryWeight just
  // makes quality not matter, it doesn't make the optimizer seek out the
  // cheaper of two similarly-themed items. Framed as total/budget, it also
  // naturally relaxes as the user raises the budget slider — more room in
  // the budget makes the same bundle look "cheaper" relative to what's
  // available, so pricier picks organically become reachable.
  const valuePull = (total / budget) * 1.2;

  // Soft penalty: going over budget is scored down, not silently
  // dropped — so the optimizer always returns its best available option
  // even when nothing fits perfectly, and can tell the user honestly when
  // that's the case. Coefficient is tuned so a strong-enough luxury
  // preference (luxuryWeight near 2) can still justify a modest overage
  // instead of every preset collapsing onto the one "safe" in-budget pick.
  const overBudget = Math.max(0, total - budget);
  const overArea = Math.max(0, usedArea - areaIn * 1.15);
  const budgetPenalty = (overBudget / budget) * 3;
  const areaPenalty = (overArea / areaIn) * 4;

  const score = themeScore + qualityScore - valuePull - budgetPenalty - areaPenalty;

  return {
    picks, total, score,
    withinBudget: total <= budget,
    fits: usedArea <= areaIn * 1.15,
    usedArea, areaIn,
  };
}

/**
 * Exhaustively search the catalog for the best combination under a given
 * set of soft weights (luxuryWeight) and hard constraints (budget target,
 * room size, tub preference, power availability). Hard constraints
 * (compatibility) filter the pool *before* search; budget/footprint are
 * soft — they shape the score instead of eliminating options outright, so
 * a too-tight budget degrades gracefully instead of returning nothing.
 */
export function optimize(ctx) {
  const { wantTub, hasPower } = ctx;

  const pools = {
    toilet: CATALOG.toilet.filter((t) => hasPower || !t.requiresPower),
    shower: CATALOG.shower.filter((s) => (wantTub ? true : !s.isTub)),
    vanity: CATALOG.vanity,
    faucet: CATALOG.faucet,
  };

  let best = null;
  let combosEvaluated = 0;
  for (const toilet of pools.toilet) {
    for (const shower of pools.shower) {
      for (const vanity of pools.vanity) {
        for (const faucet of pools.faucet) {
          const result = evaluate({ toilet, shower, vanity, faucet }, ctx);
          combosEvaluated += 1;
          if (!best || result.score > best.score) best = result;
        }
      }
    }
  }
  return { ...best, combosEvaluated };
}

/**
 * Generate three genuinely distinct, independently-optimized solutions by
 * re-running the exhaustive search at three different luxury/value trade
 * points, all under the SAME hard budget/room/compatibility constraints.
 * This is what "give me a few real options" requires — three different
 * greedy tie-breaks would not guarantee actually different results, but
 * three different objective weightings, each exactly solved, reliably do.
 */
export function generateSolutionSet(baseCtx) {
  const presets = [
    { label: 'Value', luxuryWeight: 0.1 },
    { label: 'Balanced', luxuryWeight: 0.8 },
    { label: 'Luxury-leaning', luxuryWeight: 2.0 },
  ];

  return presets.map((p) => ({
    label: p.label,
    luxuryWeight: p.luxuryWeight,
    ...optimize({ ...baseCtx, luxuryWeight: p.luxuryWeight }),
  }));
}
