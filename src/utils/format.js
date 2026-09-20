// Shared formatting helpers. Centralized so every component renders
// currency identically -- previously this was copy-pasted in three files.

export const fmt = (n) => '\u20b9' + Math.round(n).toLocaleString('en-IN');

// Compact form for tight spaces, e.g. "\u20b93.6L" instead of "\u20b93,60,000".
export const fmtCompact = (n) => {
  const abs = Math.abs(n);
  if (abs >= 10000000) return '\u20b9' + (n / 10000000).toFixed(2).replace(/\.00$/, '') + 'Cr';
  if (abs >= 100000) return '\u20b9' + (n / 100000).toFixed(2).replace(/\.00$/, '') + 'L';
  if (abs >= 1000) return '\u20b9' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return fmt(n);
};
