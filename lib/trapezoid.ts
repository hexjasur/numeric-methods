import { math, normalizeExpression } from '@/lib/math';

export type TrapezoidPoint = {
  index: number;
  x: number;
  y: number;
  expandedTex?: string;
};

export type TrapezoidSlice = {
  index: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  area: number;
};

export type TrapezoidResult = {
  a: number;
  b: number;
  n: number;
  h: number;
  points: TrapezoidPoint[];
  slices: TrapezoidSlice[];
  integral: number;
  benchmark: number;
  absoluteError: number;
  relativeErrorPercent: number | null;
  expressionTex: string;
};

const MAX_SUBINTERVALS = 1000;
const BENCHMARK_SUBINTERVALS = 10_000;

export function formatTrapezoid(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
}

export function buildExpandedFormulaTex(expression: string, x: number, y: number): string {
  const xStr = formatTrapezoid(x, 4);
  const yStr = formatTrapezoid(y, 4);
  try {
    const normalized = normalizeExpression(expression).replace(/\bdx\b/g, '1');
    const substituted = normalized.replace(/\bx\b/g, `(${xStr})`);
    const exprTex = math.parse(substituted).toTex({ parenthesis: 'auto' });
    return `f(${xStr}) = ${exprTex} = ${yStr}`;
  } catch {
    return `f(${xStr}) = ${yStr}`;
  }
}

function compileIntegrand(expression: string) {
  const normalized = normalizeExpression(expression);
  if (!normalized) throw new Error('errors.trap_fn');

  try {
    const node = math.parse(normalized);
    const compiled = node.compile();
    return {
      evaluate: (x: number) => Number(compiled.evaluate({ x, dx: 1 })),
      tex: node.toTex({ parenthesis: 'auto' }),
    };
  } catch {
    throw new Error('errors.trap_fn');
  }
}

export function calculateTrapezoid(
  expression: string,
  aInput: string,
  bInput: string,
  nInput: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): TrapezoidResult {
  const a = Number(aInput);
  const b = Number(bInput);
  const n = Number(nInput);

  if (![a, b, n].every(Number.isFinite) || !Number.isInteger(n)) {
    throw new Error(t('errors.trap_params'));
  }
  if (a >= b) throw new Error(t('errors.trap_bounds'));
  if (n < 1) throw new Error(t('errors.trap_positive'));
  if (n > MAX_SUBINTERVALS) {
    throw new Error(t('errors.trap_max', { max: MAX_SUBINTERVALS }));
  }

  let integrand: ReturnType<typeof compileIntegrand>;
  try {
    integrand = compileIntegrand(expression);
  } catch {
    throw new Error(t('errors.trap_fn'));
  }

  const evaluate = (x: number) => {
    try {
      const value = integrand.evaluate(x);
      if (!Number.isFinite(value)) throw new Error('non-finite');
      return value;
    } catch {
      throw new Error(t('errors.trap_eval', { x: formatTrapezoid(x, 6) }));
    }
  };

  const h = (b - a) / n;
  const points: TrapezoidPoint[] = [];
  for (let index = 0; index <= n; index++) {
    const x = index === n ? b : a + index * h;
    const y = evaluate(x);
    const expandedTex = buildExpandedFormulaTex(expression, x, y);
    points.push({ index, x, y, expandedTex });
  }

  const slices: TrapezoidSlice[] = [];
  let integral = 0;
  for (let index = 0; index < n; index++) {
    const left = points[index];
    const right = points[index + 1];
    const area = (h * (left.y + right.y)) / 2;
    integral += area;
    slices.push({
      index,
      x0: left.x,
      x1: right.x,
      y0: left.y,
      y1: right.y,
      area,
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

  const absoluteError = Math.abs(integral - benchmark);
  const relativeErrorPercent = Math.abs(benchmark) > 1e-14
    ? (absoluteError / Math.abs(benchmark)) * 100
    : null;

  return {
    a,
    b,
    n,
    h,
    points,
    slices,
    integral,
    benchmark,
    absoluteError,
    relativeErrorPercent,
    expressionTex: integrand.tex,
  };
}
