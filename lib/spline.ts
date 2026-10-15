import { evaluate } from 'mathjs';

export interface SplinePointInput { x: string; y: string }
export interface SplinePoint { index: number; x: number; y: number }
export interface SplineSegment {
  index: number;
  interval: [number, number];
  h: number;
  momentLeft: number;
  momentRight: number;
  coefficients: { a: number; b: number; c: number; d: number };
  endpointValues: { left: number; right: number };
}
export interface SplineResult {
  points: SplinePoint[];
  h: number[];
  moments: number[];
  segments: SplineSegment[];
  targetX: number | null;
  targetSegment: SplineSegment | null;
  targetValue: number | null;
}

function parseNumber(value: string): number {
  const parsed = Number(evaluate(value.trim()));
  if (!Number.isFinite(parsed)) throw new Error('invalid-number');
  return parsed;
}
function fixed(value: number): number { return Number(value.toFixed(12)); }

export function calculateSpline(inputs: SplinePointInput[], targetText: string): SplineResult {
  if (inputs.length < 3) throw new Error('spline-points-min');
  const points = inputs.map((point, index) => ({ index, x: parseNumber(point.x), y: parseNumber(point.y) }))
    .sort((left, right) => left.x - right.x);
  if (new Set(points.map((point) => point.x)).size !== points.length) throw new Error('spline-duplicate-x');
  const h = points.slice(0, -1).map((point, index) => points[index + 1].x - point.x);
  if (h.some((value) => value <= 0)) throw new Error('spline-order');
  const n = points.length - 1;
  const lower = new Array<number>(n - 1).fill(0);
  const diagonal = new Array<number>(n - 1).fill(0);
  const upper = new Array<number>(n - 1).fill(0);
  const rhs = new Array<number>(n - 1).fill(0);
  for (let i = 1; i < n; i += 1) {
    const row = i - 1;
    lower[row] = h[i - 1];
    diagonal[row] = 2 * (h[i - 1] + h[i]);
    upper[row] = h[i];
    rhs[row] = 6 * ((points[i + 1].y - points[i].y) / h[i] - (points[i].y - points[i - 1].y) / h[i - 1]);
  }
  const alpha = new Array<number>(n + 1).fill(0);
  const beta = new Array<number>(n + 1).fill(0);
  for (let row = 0; row < n - 1; row += 1) {
    const denominator = diagonal[row] + (row === 0 ? 0 : lower[row] * alpha[row]);
    if (Math.abs(denominator) < 1e-12) throw new Error('spline-singular');
    alpha[row + 1] = row < n - 2 ? -upper[row] / denominator : 0;
    beta[row + 1] = (rhs[row] - (row === 0 ? 0 : lower[row] * beta[row])) / denominator;
  }
  const moments = new Array<number>(n + 1).fill(0);
  for (let row = n - 2; row >= 0; row -= 1) moments[row + 1] = alpha[row + 1] * moments[row + 2] + beta[row + 1];

  const segments = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    const hi = h[index];
    const mi = moments[index];
    const mi1 = moments[index + 1];
    const ci = point.y / hi - mi * hi / 6;
    const di = next.y / hi - mi1 * hi / 6;
    const coefficients = {
      a: fixed((mi1 - mi) / (6 * hi)),
      b: fixed((3 * mi * next.x - 3 * mi1 * point.x) / (6 * hi)),
      c: fixed((3 * mi1 * point.x ** 2 - 3 * mi * next.x ** 2) / (6 * hi) - ci + di),
      d: fixed((mi * next.x ** 3 - mi1 * point.x ** 3) / (6 * hi) + ci * next.x - di * point.x),
    };
    return {
      index: index + 1,
      interval: [point.x, next.x] as [number, number],
      h: hi,
      momentLeft: mi,
      momentRight: mi1,
      coefficients,
      endpointValues: { left: point.y, right: next.y },
    };
  });
  const targetX = targetText.trim() ? parseNumber(targetText) : null;
  const targetSegment = targetX === null ? null : segments.find((segment) => targetX >= segment.interval[0] && targetX <= segment.interval[1]) ?? (targetX < points[0].x ? segments[0] : segments[segments.length - 1]);
  const targetValue = targetX === null || !targetSegment ? null : evaluateSegment(targetSegment, targetX);
  return { points, h: h.map(fixed), moments: moments.map(fixed), segments, targetX, targetSegment, targetValue };
}

export function evaluateSegment(segment: SplineSegment, x: number): number {
  const { a, b, c, d } = segment.coefficients;
  return a * x ** 3 + b * x ** 2 + c * x + d;
}
export function formatSpline(value: number, digits = 6): string {
  if (Math.abs(value) < 1e-12) return '0';
  return Number(value.toFixed(digits)).toString();
}
