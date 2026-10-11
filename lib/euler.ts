import { math, compileMath } from '@/lib/math';

export type EulerRow = {
  step: number;
  x: number;
  yEuler: number;
  yImproved: number;
  yExact: number | null;
  difference: number;
};

export type EulerResult = {
  rows: EulerRow[];
  steps: number;
  hasExactSolution: boolean;
};

function isDefaultEquation(expression: string) {
  return expression.toLowerCase().replace(/\s+/g, '') === 'x-2*y';
}

export function solveEulerMethods(
  expression: string,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  t: (k: string, p?: Record<string, string | number>) => string
): EulerResult {
  if (![x0, y0, xEnd, h].every(Number.isFinite)) {
    throw new Error(t('errors.elr_params'));
  }
  if (xEnd <= x0 || h <= 0) {
    throw new Error(t('errors.elr_bounds'));
  }

  const stepRatio = (xEnd - x0) / h;
  const nearestStepCount = Math.round(stepRatio);
  const estimatedSteps =
    Math.abs(stepRatio - nearestStepCount) < 1e-10
      ? nearestStepCount
      : Math.ceil(stepRatio);
  if (estimatedSteps > 1000) {
    throw new Error(t('errors.elr_max'));
  }

  let code = compileMath(expression);
  if (!code) throw new Error(t('errors.elr_syntax'));

  const evaluate = (x: number, y: number) => {
    let value: number;
    try {
      value = Number(code!.evaluate({ x, y }));
    } catch {
      throw new Error(t('errors.elr_eval', { x: x.toFixed(4), y: y.toFixed(4) }));
    }
    if (!Number.isFinite(value)) {
      throw new Error(t('errors.elr_finite', { x: x.toFixed(4), y: y.toFixed(4) }));
    }
    return value;
  };

  const hasExactSolution = isDefaultEquation(expression);
  const exact = (x: number) =>
    x / 2 - 1 / 4 + (y0 - x0 / 2 + 1 / 4) * Math.exp(-2 * (x - x0));
  const rows: EulerRow[] = [];
  let x = x0;
  let yEuler = y0;
  let yImproved = y0;

  const pushRow = (step: number) => {
    rows.push({
      step,
      x: Number(x.toFixed(10)),
      yEuler,
      yImproved,
      yExact: hasExactSolution ? exact(x) : null,
      difference: Math.abs(yImproved - yEuler),
    });
  };

  pushRow(0);
  for (let step = 1; step <= estimatedSteps; step++) {
    const stepSize = Math.min(h, xEnd - x);
    const nextX = x + stepSize;
    const eulerSlope = evaluate(x, yEuler);
    const improvedSlope = evaluate(x, yImproved);
    const predictedY = yImproved + stepSize * improvedSlope;
    const correctedSlope = evaluate(nextX, predictedY);

    yEuler += stepSize * eulerSlope;
    yImproved += (stepSize / 2) * (improvedSlope + correctedSlope);
    if (!Number.isFinite(yEuler) || !Number.isFinite(yImproved)) {
      throw new Error(t('errors.elr_overflow'));
    }
    x = step === estimatedSteps ? xEnd : nextX;
    pushRow(step);
  }

  return { rows, steps: estimatedSteps, hasExactSolution };
}
