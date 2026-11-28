// Shared number formatters for displayed results.
// Each helper returns '—' for non-finite input so tables never show "NaN" or "Infinity".

/** Fixed number of decimals, e.g. 0.5 → "0.500000". */
export function formatFixed(value: number, digits = 6): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

/** Rounded to `digits` decimals with trailing zeros removed, e.g. 0.5 → "0.5". */
export function formatTrimmed(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
}

/** Like formatTrimmed, but renders negative zero as "0". */
export function formatTrimmedSigned(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}
