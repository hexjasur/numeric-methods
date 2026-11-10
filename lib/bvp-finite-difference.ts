import { compileMath } from '@/lib/math';

export interface BvpInput {
  p: string; q: string; f: string; a: string; b: string; h: string; intervals: string;
  m0: string; m1: string; m2: string; g0: string; g1: string; g2: string;
}
export interface BvpRow {
  index: number; x: number; a: number; b: number; c: number; d: number;
  pivot: number; u: number; v: number; y: number; residual: number;
}
export interface BvpResult {
  h: number; rows: BvpRow[];
  backward: Array<{ index: number; nextY: number | null; y: number }>;
  maxResidual: number;
}

function number(value: string, label: string): number {
  const parsed = Number(value);
  if (!value.trim() || !Number.isFinite(parsed)) throw new Error(`${label}: finite number required`);
  return parsed;
}

export function solveBvp(input: BvpInput): BvpResult {
  const left = number(input.a, 'a');
  const right = number(input.b, 'b');
  const h = number(input.h, 'h');
  const intervals = number(input.intervals, 'n');
  const m0 = number(input.m0, 'm₀'); const m1 = number(input.m1, 'm₁'); const m2 = number(input.m2, 'm₂');
  const g0 = number(input.g0, 'g₀'); const g1 = number(input.g1, 'g₁'); const g2 = number(input.g2, 'g₂');
  if (right <= left) throw new Error('b must be greater than a');
  if (!Number.isInteger(intervals) || intervals < 2 || intervals > 80) throw new Error('n must be an integer from 2 to 80');
  if (h <= 0 || Math.abs((right - left) / intervals - h) > Math.max(1, Math.abs(h)) * 1e-8) {
    throw new Error('h must divide the interval into an integer number of steps (2–80).');
  }
  if (m0 === 0 && m1 === 0) throw new Error('Left boundary condition cannot be zero');
  if (g0 === 0 && g1 === 0) throw new Error('Right boundary condition cannot be zero');
  const functions = [input.p, input.q, input.f].map((expression) => {
    const compiled = compileMath(expression);
    if (!compiled) throw new Error(`Invalid expression: ${expression}`);
    return (x: number) => {
      const value = Number(compiled.evaluate({ x }));
      if (!Number.isFinite(value)) throw new Error(`Expression is not finite at x=${x}`);
      return value;
    };
  });
  const [P, Q, F] = functions;
  const coeffs = Array.from({ length: intervals + 1 }, (_, i) => {
    if (i === 0) return { a: 0, b: m0 - m1 / h, c: m1 / h, d: m2 };
    if (i === intervals) return { a: -g1 / h, b: g0 + g1 / h, c: 0, d: g2 };
    const x = left + i * h; const p = P(x);
    return { a: 1 - h * p / 2, b: -2 + h * h * Q(x), c: 1 + h * p / 2, d: h * h * F(x) };
  });
  const tracedRows: BvpRow[] = [];
  coeffs.forEach((row, i) => {
    const previous = tracedRows[i - 1];
    const pivot = previous ? row.a * previous.u + row.b : row.b;
    const scale = previous ? Math.abs(row.a * previous.u) + Math.abs(row.b) : Math.abs(row.b);
    if (!Number.isFinite(pivot) || Math.abs(pivot) <= Math.max(scale, 1) * Number.EPSILON * 64) {
      throw new Error(`Thomas pivot is zero or unstable at row ${i + 1}`);
    }
    const u = -row.c / pivot;
    const v = (row.d - (previous ? row.a * previous.v : 0)) / pivot;
    if (![u, v].every(Number.isFinite)) throw new Error(`Non-finite Thomas coefficient at row ${i + 1}`);
    tracedRows.push({ ...row, index: i + 1, x: left + i * h, pivot, u, v, y: 0, residual: 0 });
  });
  const ys = new Array<number>(tracedRows.length);
  ys[ys.length - 1] = tracedRows[tracedRows.length - 1].v;
  const backward: BvpResult['backward'] = [{ index: ys.length, nextY: null, y: ys[ys.length - 1] }];
  for (let i = ys.length - 2; i >= 0; i -= 1) {
    ys[i] = tracedRows[i].u * ys[i + 1] + tracedRows[i].v;
    if (!Number.isFinite(ys[i])) throw new Error(`Non-finite solution at node ${i + 1}`);
    backward.push({ index: i + 1, nextY: ys[i + 1], y: ys[i] });
  }
  const rows = tracedRows.map((row, i) => ({
    ...row,
    y: ys[i],
    residual: row.d - (row.a * (ys[i - 1] ?? 0) + row.b * ys[i] + row.c * (ys[i + 1] ?? 0)),
  }));
  return { h, rows, backward, maxResidual: Math.max(...rows.map((row) => Math.abs(row.residual))) };
}
