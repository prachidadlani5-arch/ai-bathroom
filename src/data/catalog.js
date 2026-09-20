// Placeholder product catalog -- swap for KOHLER's real product feed / API.
// Each item carries physical footprint (inches), theme tags, material
// properties for the 3D scene, a `quality` score (0-1, used by the
// optimizer's luxury/value trade-off), and hard compatibility flags
// (e.g. `requiresPower`) the optimizer must respect, not just prefer.
//
// Prices are in INR and calibrated to be realistic-ish for this category
// (a value bundle lands ~\u20b91L total, a maxed-out luxury bundle ~\u20b910-11L)
// so the budget slider in SpaceForm actually constrains something. `quality`
// is independent of `price` and drives the optimizer's score directly --
// price only feeds the budget *penalty* -- so price can be re-tuned freely
// here without touching optimize.js.

export const THEMES = [
  { id: 'Minimalist Modern', blurb: 'Clean lines, matte finishes, nothing extra.', swatch: ['#e8e6df', '#b9b2a3', '#3a3a3a'] },
  { id: 'Classic Luxury', blurb: 'Ornate detailing, warm brass, timeless proportions.', swatch: ['#efe6d8', '#b08d57', '#3f2f22'] },
  { id: 'Japanese Zen', blurb: 'Natural materials, low profiles, quiet calm.', swatch: ['#e4e2da', '#6b6259', '#2c2c2c'] },
  { id: 'Scandinavian Spa', blurb: 'Pale wood, soft curves, spa-like warmth.', swatch: ['#f3ede2', '#d8c3a5', '#8a7a5f'] },
  { id: 'Industrial Loft', blurb: 'Exposed metal, matte black, raw texture.', swatch: ['#cfcfcf', '#4a4a4a', '#1a1a1a'] },
  { id: 'Art Deco Glam', blurb: 'Bold geometry, polished brass, statement glamour.', swatch: ['#f5efe0', '#c9a24a', '#20201d'] },
  { id: 'Coastal Casual', blurb: 'Light woods, brushed nickel, breezy and relaxed.', swatch: ['#eef2f0', '#a9b8b5', '#c7c2ad'] },
];

export const THEME_IDS = THEMES.map((t) => t.id);

export const CATALOG = {
  faucet: [
    { id: 'f1', name: 'Occasion Single-Handle', price: 9500, w: 8, d: 7, h: 9,
      themes: ['Minimalist Modern'], style: 'modern', color: '#9aa0a6', metalness: 0.9, roughness: 0.25, quality: 0.45 },
    { id: 'f2', name: 'Artifacts Bridge Faucet', price: 52000, w: 10, d: 8, h: 10,
      themes: ['Classic Luxury'], style: 'bridge', color: '#b08d57', metalness: 0.85, roughness: 0.3, quality: 0.8 },
    { id: 'f3', name: 'Avid Single-Hole', price: 6200, w: 7, d: 6, h: 8,
      themes: ['Minimalist Modern', 'Japanese Zen'], style: 'modern', color: '#c9c9c9', metalness: 0.9, roughness: 0.2, quality: 0.3 },
    { id: 'f4', name: 'Composed Vessel Faucet', price: 28000, w: 9, d: 8, h: 12,
      themes: ['Japanese Zen'], style: 'vessel', color: '#3d3d3d', metalness: 0.7, roughness: 0.4, quality: 0.65 },
    { id: 'f5', name: 'Purist Wall-Mount Faucet', price: 24000, w: 8, d: 6, h: 8,
      themes: ['Scandinavian Spa', 'Minimalist Modern'], style: 'modern', color: '#cfcac0', metalness: 0.75, roughness: 0.3, quality: 0.6 },
    { id: 'f6', name: 'Tone Industrial Faucet', price: 14500, w: 8, d: 7, h: 11,
      themes: ['Industrial Loft'], style: 'vessel', color: '#2b2b2b', metalness: 0.6, roughness: 0.55, quality: 0.5 },
    { id: 'f7', name: 'Margaux Faucet', price: 68000, w: 9, d: 8, h: 10,
      themes: ['Art Deco Glam', 'Classic Luxury'], style: 'bridge', color: '#c9a24a', metalness: 0.9, roughness: 0.2, quality: 0.85 },
    { id: 'f8', name: 'Simplice Faucet', price: 8200, w: 7, d: 6, h: 9,
      themes: ['Coastal Casual'], style: 'modern', color: '#b7bdb9', metalness: 0.7, roughness: 0.3, quality: 0.4 },
  ],
  toilet: [
    { id: 't1', name: 'Numi 2.0 Smart Toilet', price: 360000, w: 19, d: 29, h: 22,
      themes: ['Minimalist Modern', 'Classic Luxury'], style: 'smart', color: '#f4f3f0', metalness: 0.05, roughness: 0.15,
      quality: 0.95, requiresPower: true },
    { id: 't2', name: 'Veil Intelligent Toilet', price: 195000, w: 16, d: 27, h: 20,
      themes: ['Minimalist Modern', 'Japanese Zen'], style: 'smart', color: '#f4f3f0', metalness: 0.05, roughness: 0.15,
      quality: 0.8, requiresPower: true },
    { id: 't3', name: 'Cimarron Comfort Height', price: 15500, w: 15, d: 28, h: 30,
      themes: ['Classic Luxury'], style: 'tank', color: '#f7f6f2', metalness: 0.02, roughness: 0.2,
      quality: 0.35, requiresPower: false },
    { id: 't4', name: 'San Souci One-Piece', price: 34000, w: 14.5, d: 26.5, h: 28,
      themes: ['Minimalist Modern', 'Japanese Zen'], style: 'tank', color: '#f4f3ee', metalness: 0.02, roughness: 0.2,
      quality: 0.55, requiresPower: false },
    { id: 't5', name: 'Memoirs Classic Two-Piece', price: 42000, w: 16, d: 29, h: 31,
      themes: ['Classic Luxury', 'Art Deco Glam'], style: 'tank', color: '#f7f4ec', metalness: 0.02, roughness: 0.25,
      quality: 0.6, requiresPower: false },
    { id: 't6', name: 'Highline Industrial', price: 13800, w: 15, d: 27.5, h: 29,
      themes: ['Industrial Loft'], style: 'tank', color: '#eceae6', metalness: 0.03, roughness: 0.3,
      quality: 0.3, requiresPower: false },
    { id: 't7', name: 'Persuade Curv', price: 28500, w: 15, d: 27, h: 29,
      themes: ['Scandinavian Spa', 'Coastal Casual'], style: 'tank', color: '#f5f3ee', metalness: 0.02, roughness: 0.2,
      quality: 0.5, requiresPower: false },
  ],
  shower: [
    { id: 's1', name: 'DTV+ Thermostatic System', price: 420000, w: 36, d: 36, h: 84,
      themes: ['Classic Luxury', 'Minimalist Modern'], style: 'enclosure', color: '#8a8f94', metalness: 0.8, roughness: 0.3,
      isTub: false, quality: 0.9, frameColor: '#5c6167' },
    { id: 's2', name: 'Anthem Thermostatic Trim', price: 95000, w: 32, d: 32, h: 84,
      themes: ['Minimalist Modern', 'Scandinavian Spa'], style: 'enclosure', color: '#6a6f74', metalness: 0.85, roughness: 0.25,
      isTub: false, quality: 0.55, frameColor: '#7d7871' },
    { id: 's3', name: 'Occasion Rain Shower', price: 58000, w: 32, d: 32, h: 84,
      themes: ['Japanese Zen'], style: 'enclosure', color: '#4a4a4a', metalness: 0.8, roughness: 0.35,
      isTub: false, quality: 0.5, frameColor: '#3f3c37' },
    { id: 's4', name: 'Underscore Soaking Tub', price: 145000, w: 60, d: 32, h: 22,
      themes: ['Classic Luxury', 'Japanese Zen'], style: 'tub', color: '#f2f2f0', metalness: 0.05, roughness: 0.15,
      isTub: true, quality: 0.7 },
    { id: 's5', name: 'Exposed-Pipe Industrial Shower', price: 48000, w: 34, d: 34, h: 84,
      themes: ['Industrial Loft'], style: 'enclosure', color: '#2f2f2f', metalness: 0.65, roughness: 0.5,
      isTub: false, quality: 0.45, frameColor: '#1e1e1e' },
    { id: 's6', name: 'Deco Waterfall Shower', price: 260000, w: 34, d: 34, h: 84,
      themes: ['Art Deco Glam'], style: 'enclosure', color: '#c9a24a', metalness: 0.85, roughness: 0.25,
      isTub: false, quality: 0.8, frameColor: '#a9832f' },
    { id: 's7', name: 'Coastal Rainhead Shower', price: 56000, w: 32, d: 32, h: 84,
      themes: ['Coastal Casual'], style: 'enclosure', color: '#a9b8b5', metalness: 0.6, roughness: 0.35,
      isTub: false, quality: 0.5, frameColor: '#8d9793' },
    { id: 's8', name: 'Freestanding Soaking Tub', price: 175000, w: 60, d: 32, h: 24,
      themes: ['Coastal Casual', 'Scandinavian Spa'], style: 'tub', color: '#f4f2ec', metalness: 0.05, roughness: 0.15,
      isTub: true, quality: 0.75 },
  ],
  vanity: [
    { id: 'v1', name: 'Jute 36" Floating Vanity', price: 52000, w: 36, d: 21, h: 32,
      themes: ['Minimalist Modern', 'Japanese Zen'], style: 'floating', color: '#7a6a55', metalness: 0.1, roughness: 0.6, quality: 0.55 },
    { id: 'v2', name: 'Damask 42" Vanity', price: 165000, w: 42, d: 22, h: 34,
      themes: ['Classic Luxury'], style: 'legged', color: '#e8e4da', metalness: 0.05, roughness: 0.5, quality: 0.85 },
    { id: 'v3', name: 'Poplin 30" Vanity', price: 31000, w: 30, d: 19, h: 32,
      themes: ['Minimalist Modern'], style: 'floating', color: '#e0ded8', metalness: 0.05, roughness: 0.55, quality: 0.4 },
    { id: 'v4', name: 'Maryn 48" Double Vanity', price: 225000, w: 48, d: 22, h: 34,
      themes: ['Classic Luxury', 'Art Deco Glam'], style: 'legged', color: '#3f3f3f', metalness: 0.1, roughness: 0.45, quality: 0.95 },
    { id: 'v5', name: 'Driftwood Reclaimed Vanity', price: 48000, w: 36, d: 21, h: 33,
      themes: ['Coastal Casual', 'Scandinavian Spa'], style: 'legged', color: '#c7b79a', metalness: 0.05, roughness: 0.65, quality: 0.5 },
    { id: 'v6', name: 'Foundry Pipe-Leg Vanity', price: 38000, w: 34, d: 20, h: 33,
      themes: ['Industrial Loft'], style: 'legged', color: '#2e2e2e', metalness: 0.4, roughness: 0.55, quality: 0.45 },
    { id: 'v7', name: 'Nordic Oak Floating Vanity', price: 62000, w: 38, d: 21, h: 32,
      themes: ['Scandinavian Spa'], style: 'floating', color: '#d8c3a5', metalness: 0.05, roughness: 0.6, quality: 0.6 },
  ],
};
