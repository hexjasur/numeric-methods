import { math, normalizeExpression } from '@/lib/math';

export type RectanglePoint = { index: number; x: number; y: number };

export type RectangleSlice = {
  index: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  leftArea: number;
  rightArea: number;
  trapezoidArea: number;
};

export type RectangleResult = {
  a: number;
  b: number;
  n: number;
  h: number;
  points: RectanglePoint[];
  slices: RectangleSlice[];
  leftIntegral: number;
  rightIntegral: number;
  meanIntegral: number;
  trapezoidIntegral: number;
  benchmark: number;
  leftError: number;
  rightError: number;
  meanError: number;
  trapezoidError: number;
  expressionTex: string;
};

const MAX_SUBINTERVALS = 1000;
const BENCHMARK_SUBINTERVALS = 10_000;

export function formatRectangle(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
}

export function calculateRectangles(
  expression: string,
  aInput: string,
  bInput: string,
  nInput: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): RectangleResult {
  const a = Number(aInput);
  const b = Number(bInput);
  const n = Number(nInput);
  if (![a, b, n].every(Number.isFinite) || !Number.isInteger(n)) {
    throw new Error(t('errors.rect_params'));
  }
  if (a >= b) throw new Error(t('errors.rect_bounds'));
  if (n < 1) throw new Error(t('errors.rect_positive'));
  if (n > MAX_SUBINTERVALS) {
    throw new Error(t('errors.rect_max', { max: MAX_SUBINTERVALS }));
  }

  const normalized = normalizeExpression(expression);
  if (!normalized) throw new Error(t('errors.rect_fn'));
  let evaluateIntegrand: (x: number) => number;
  let expressionTex: string;
  try {
    const node = math.parse(normalized);
    const compiled = node.compile();
    evaluateIntegrand = (x) => Number(compiled.evaluate({ x, dx: 1 }));
    expressionTex = node.toTex({ parenthesis: 'auto' });
  } catch {
    throw new Error(t('errors.rect_fn'));
  }

  const evaluate = (x: number) => {
    try {
      const value = evaluateIntegrand(x);
      if (!Number.isFinite(value)) throw new Error('non-finite');
      return value;
    } catch {
      throw new Error(t('errors.rect_eval', { x: formatRectangle(x, 6) }));
    }
  };

  const h = (b - a) / n;
  const points: RectanglePoint[] = [];
  for (let index = 0; index <= n; index++) {
    const x = index === n ? b : a + index * h;
    points.push({ index, x, y: evaluate(x) });
  }

  const slices: RectangleSlice[] = [];
  let leftIntegral = 0;
  let rightIntegral = 0;
  let trapezoidIntegral = 0;
  for (let index = 0; index < n; index++) {
    const left = points[index];
    const right = points[index + 1];
    const leftArea = h * left.y;
    const rightArea = h * right.y;
    const trapezoidArea = (h * (left.y + right.y)) / 2;
    leftIntegral += leftArea;
    rightIntegral += rightArea;
    trapezoidIntegral += trapezoidArea;
    slices.push({
      index,
      x0: left.x,
      x1: right.x,
      y0: left.y,
      y1: right.y,
      leftArea,
      rightArea,
      trapezoidArea,
    });
  }

  const benchmarkH = (b - a) / BENCHMARK_SUBINTERVALS;
  let benchmark = 0;
  let previousY = evaluate(a);
  for (let index = 1; index <= BENCHMARK_SUBINTERVALS; index++) {
    const x = index === BENCHMARK_SUBINTERVALS ? b : a + index * benchmarkH;
    const y = evaluate(x);
    benchmark += (benchmarkH * (previousY + y)) / 2;
    previousY = y;
  }

  const meanIntegral = (leftIntegral + rightIntegral) / 2;
  return {
    a,
    b,
    n,
    h,
    points,
    slices,
    leftIntegral,
    rightIntegral,
    meanIntegral,
    trapezoidIntegral,
    benchmark,
    leftError: Math.abs(leftIntegral - benchmark),
    rightError: Math.abs(rightIntegral - benchmark),
    meanError: Math.abs(meanIntegral - benchmark),
    trapezoidError: Math.abs(trapezoidIntegral - benchmark),
    expressionTex,
  };
}
