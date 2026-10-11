import { math, compileMath, normalizeExpression } from '@/lib/math';

export type NewtonStep = {
  iteration: number;
  x: number;
  fx: number;
  dfx: number;
  nextX: number;
  difference: number;
  done: boolean;
};

export type NewtonResult = {
  root: number;
  iterations: number;
  steps: NewtonStep[];
  derivativeExpr: string;
};

export function format(value: number, digits = 6) {
  return Number.isFinite(value)
    ? Number(value.toFixed(digits)).toString()
    : '—';
}

export function calculateNewton(
  expression: string,
  x0: string,
  epsilon: string,
  maxIter: string,
  t: (k: string, p?: Record<string, string | number>) => string,
): NewtonResult {
  const initialX = Number(x0),
    tolerance = Number(epsilon),
    max = Number(maxIter || '50');

  if (
    ![initialX, tolerance, max].every(Number.isFinite) ||
    tolerance <= 0 ||
    max <= 0
  ) {
    throw new Error(t('errors.nwt_params'));
  }

  const exprStr = normalizeExpression(expression);
  let derivativeExprStr = '';
  let fCode, dfCode;

  try {
    fCode = compileMath(exprStr);
    if (!fCode) throw new Error();

    const derivativeNode = math.derivative(exprStr, 'x');
    derivativeExprStr = derivativeNode.toString();
    dfCode = derivativeNode.compile();
  } catch {
    throw new Error(t('errors.nwt_fn'));
  }

  const f = (x: number) => Number(fCode.evaluate({ x }));
  const df = (x: number) => Number(dfCode.evaluate({ x }));

  const steps: NewtonStep[] = [];
  let currentX = initialX;

  for (let iteration = 1; iteration <= max; iteration++) {
    const fx = f(currentX);
    const dfx = df(currentX);

    if (Math.abs(dfx) < 1e-12) {
      throw new Error(t('errors.nwt_deriv_zero', { iter: iteration }));
    }

    const nextX = currentX - fx / dfx;
    const diff = Math.abs(nextX - currentX);
    const done = diff <= tolerance || Math.abs(fx) < 1e-15;

    steps.push({
      iteration,
      x: currentX,
      fx,
      dfx,
      nextX,
      difference: diff,
      done,
    });

    if (done) {
      return {
        root: nextX,
        iterations: iteration,
        steps,
        derivativeExpr: derivativeExprStr,
      };
    }

    currentX = nextX;
  }

  throw new Error(t('errors.nwt_no_root', { max }));
}
