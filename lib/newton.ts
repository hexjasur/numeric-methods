import { compileMath } from '@/lib/math';

const MAX_ITERATIONS = 100;
const FIRST_DERIVATIVE_STEP = 1e-6;
const SECOND_DERIVATIVE_STEP = 1e-5;
const DERIVATIVE_EPSILON = 1e-10;

export type NewtonEndpoint = 'a' | 'b';

export type NewtonStep = {
  iteration: number;
  x: number;
  fx: number;
  derivative: number;
  nextX: number;
  delta: number;
  done: boolean;
};

export type NewtonResult = {
  root: number;
  residual: number;
  iterations: number;
  initialPoint: number;
  initialValue: number;
  initialSecondDerivative: number;
  selectionValue: number;
  selectedEndpoint: NewtonEndpoint;
  exactEndpoint: NewtonEndpoint | null;
  steps: NewtonStep[];
};

export function formatNewton(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
}

function finiteDifferenceFirstDerivative(
  f: (x: number) => number,
  x: number,
): number {
  const h = FIRST_DERIVATIVE_STEP;
  return (f(x + h) - f(x)) / h;
}

function finiteDifferenceSecondDerivative(
  f: (x: number) => number,
  x: number,
): number {
  const h = SECOND_DERIVATIVE_STEP;
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

export function calculateNewton(
  expression: string,
  aInput: string,
  bInput: string,
  epsilonInput: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): NewtonResult {
  const a = Number(aInput);
  const b = Number(bInput);
  const epsilon = Number(epsilonInput);
  if (
    !aInput.trim() ||
    !bInput.trim() ||
    !epsilonInput.trim() ||
    ![a, b, epsilon].every(Number.isFinite) ||
    a >= b ||
    epsilon <= 0
  ) {
    throw new Error(t('errors.nwt_params'));
  }

  const compiled = compileMath(expression);
  if (!compiled) throw new Error(t('errors.nwt_fn'));

  const evaluate = (x: number): number => {
    try {
      const value = Number(compiled.evaluate({ x }));
      if (!Number.isFinite(value)) throw new Error('non-finite');
      return value;
    } catch {
      throw new Error(t('errors.nwt_fn'));
    }
  };

  const fa = evaluate(a);
  const fb = fa === 0 ? 0 : evaluate(b);
  if (fa === 0) {
    return {
      root: a,
      residual: 0,
      iterations: 0,
      initialPoint: a,
      initialValue: 0,
      initialSecondDerivative: 0,
      selectionValue: 0,
      selectedEndpoint: 'a',
      exactEndpoint: 'a',
      steps: [],
    };
  }
  if (fb === 0) {
    return {
      root: b,
      residual: 0,
      iterations: 0,
      initialPoint: b,
      initialValue: 0,
      initialSecondDerivative: 0,
      selectionValue: 0,
      selectedEndpoint: 'b',
      exactEndpoint: 'b',
      steps: [],
    };
  }

  let secondDerivativeAtA: number;
  try {
    secondDerivativeAtA = finiteDifferenceSecondDerivative(evaluate, a);
  } catch {
    throw new Error(t('errors.nwt_fn'));
  }
  const selectionValue = fa * secondDerivativeAtA;
  if (!Number.isFinite(selectionValue)) throw new Error(t('errors.nwt_fn'));

  // Match the V2 starting-point rule: select a when f(a)f''(a) > 0; otherwise use b.
  const selectedEndpoint: NewtonEndpoint = selectionValue > 0 ? 'a' : 'b';
  let x = selectedEndpoint === 'a' ? a : b;
  const initialValue = selectedEndpoint === 'a' ? fa : fb;
  let initialSecondDerivative = secondDerivativeAtA;
  if (selectedEndpoint === 'b') {
    try {
      initialSecondDerivative = finiteDifferenceSecondDerivative(evaluate, b);
    } catch {
      throw new Error(t('errors.nwt_fn'));
    }
  }
  if (!Number.isFinite(initialSecondDerivative)) throw new Error(t('errors.nwt_fn'));

  const steps: NewtonStep[] = [];
  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    const fx = evaluate(x);
    let derivative: number;
    try {
      derivative = finiteDifferenceFirstDerivative(evaluate, x);
    } catch {
      throw new Error(t('errors.nwt_fn'));
    }
    if (!Number.isFinite(derivative) || Math.abs(derivative) < DERIVATIVE_EPSILON) {
      throw new Error(t('errors.nwt_deriv_zero', { iter: iteration }));
    }

    const nextX = x - fx / derivative;
    const delta = Math.abs(nextX - x);
    if (!Number.isFinite(nextX) || !Number.isFinite(delta)) {
      throw new Error(t('errors.nwt_fn'));
    }

    const done = delta < epsilon;
    steps.push({ iteration, x, fx, derivative, nextX, delta, done });
    if (done) {
      return {
        root: nextX,
        residual: evaluate(nextX),
        iterations: iteration,
        initialPoint: selectedEndpoint === 'a' ? a : b,
        initialValue,
        initialSecondDerivative,
        selectionValue,
        selectedEndpoint,
        exactEndpoint: null,
        steps,
      };
    }
    x = nextX;
  }

  throw new Error(t('errors.nwt_no_root', { max: MAX_ITERATIONS }));
}
