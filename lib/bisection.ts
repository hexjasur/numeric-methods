import { math, normalizeExpression, compileMath } from '@/lib/math';

export type Step = {
  iteration: number;
  a: number;
  b: number;
  c: number;
  fa: number;
  fb: number;
  fc: number;
  width: number;
  done: boolean;
  interval: string;
  nextA: number;
  nextB: number;
  explanation: string;
  decision: string;
};

export type Result = { root: number; iterations: number; steps: Step[] };

export function format(value: number, digits = 6) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

export function compile(expression: string) {
  const code = compileMath(expression);
  if (!code) return null;
  return (x: number) => Number(code.evaluate({ x }));
}

export function calculateBisection(expression: string, a: string, b: string, epsilon: string, t: (k: string, p?: Record<string, string | number>) => string): Result {
  const left = Number(a), right = Number(b), tolerance = Number(epsilon);
  if (![left, right, tolerance].every(Number.isFinite) || tolerance <= 0 || left >= right) {
    throw new Error(t('errors.bis_params'));
  }
  const f = compile(expression);
  if (!f) throw new Error(t('errors.bis_fn'));
  let low = left, high = right, fa = f(low), fb = f(high);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) throw new Error(t('errors.bis_undef'));
  if (fa === 0) return { root: low, iterations: 0, steps: [] };
  if (fb === 0) return { root: high, iterations: 0, steps: [] };
  if (fa * fb > 0) throw new Error(t('errors.bis_same_sign', { fa: format(fa, 4), fb: format(fb, 4) }));

  const steps: Step[] = [];
  for (let iteration = 1; iteration <= 100; iteration++) {
    const c = (low + high) / 2, fc = f(c), width = high - low;
    const done = width <= tolerance || Math.abs(fc) < 1e-15;
    const leftHasRoot = fa * fc < 0;
    const interval = leftHasRoot ? `[${format(low)}, ${format(c)}]` : `[${format(c)}, ${format(high)}]`;
    const nextA = leftHasRoot ? low : c;
    const nextB = leftHasRoot ? c : high;
    const explanation = done ? t('errors.bis_done') : leftHasRoot ? t('errors.bis_left') : t('errors.bis_right');
    const decision = done ? t('errors.bis_dec_done', { width: format(width) }) : leftHasRoot ? t('errors.bis_dec_left', { interval }) : t('errors.bis_dec_right', { interval });
    steps.push({ iteration, a: low, b: high, c, fa, fb, fc, width, done, interval, nextA, nextB, explanation, decision });
    if (done) return { root: c, iterations: iteration, steps };
    if (leftHasRoot) { high = c; fb = fc; } else { low = c; fa = fc; }
  }
  return { root: (low + high) / 2, iterations: steps.length, steps };
}
