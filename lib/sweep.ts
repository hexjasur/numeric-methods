export type SweepInputRow = {
  a: string;
  b: string;
  c: string;
  d: string;
};

export type SweepCoefficientRow = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type SweepForwardStep = SweepCoefficientRow & {
  index: number;
  pivot: number;
  alpha: number;
  beta: number;
  previousAlpha: number | null;
  previousBeta: number | null;
};

export type SweepBackwardStep = {
  index: number;
  alpha: number;
  beta: number;
  nextX: number | null;
  x: number;
};

export type SweepResultRow = SweepCoefficientRow & {
  index: number;
  pivot: number;
  alpha: number;
  beta: number;
  x: number;
  residual: number;
};

export type SweepResult = {
  rows: SweepResultRow[];
  forwardSteps: SweepForwardStep[];
  backwardSteps: SweepBackwardStep[];
  maxResidual: number;
  relativeResidual: number;
  diagonallyDominant: boolean;
};

type Translator = (
  key: string,
  params?: Record<string, string | number>,
) => string;

const MIN_SIZE = 2;
const MAX_SIZE = 10;

export function calculateSweep(
  inputs: readonly SweepInputRow[],
  t: Translator,
): SweepResult {
  if (inputs.length < MIN_SIZE || inputs.length > MAX_SIZE) {
    throw new Error(t('errors.sweep_rows', { min: MIN_SIZE, max: MAX_SIZE }));
  }

  const coefficients = inputs.map((row, index) => {
    const parse = (value: string): number => {
      if (!value.trim()) throw new Error(t('errors.sweep_number', { row: index + 1 }));
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        throw new Error(t('errors.sweep_number', { row: index + 1 }));
      }
      return parsed;
    };

    return {
      a: parse(row.a),
      b: parse(row.b),
      c: parse(row.c),
      d: parse(row.d),
    };
  });

  if (coefficients[0].a !== 0 || coefficients[coefficients.length - 1].c !== 0) {
    throw new Error(t('errors.sweep_boundary'));
  }

  const forwardSteps: SweepForwardStep[] = [];
  for (let index = 0; index < coefficients.length; index += 1) {
    const row = coefficients[index];
    const previous = forwardSteps[index - 1];
    const previousAlpha = previous?.alpha ?? null;
    const previousBeta = previous?.beta ?? null;
    const pivot = previous
      ? row.b + row.a * previous.alpha
      : row.b;
    const pivotScale = previous
      ? Math.abs(row.b) + Math.abs(row.a * previous.alpha)
      : Math.abs(row.b);
    const pivotTolerance = pivotScale * Number.EPSILON * 64;

    if (!Number.isFinite(pivot) || Math.abs(pivot) <= pivotTolerance) {
      throw new Error(t('errors.sweep_pivot', { row: index + 1 }));
    }

    const alpha = -row.c / pivot;
    const betaNumerator = previous
      ? row.d - row.a * previous.beta
      : row.d;
    const beta = betaNumerator / pivot;

    if (![alpha, beta].every(Number.isFinite)) {
      throw new Error(t('errors.sweep_overflow', { row: index + 1 }));
    }

    forwardSteps.push({
      ...row,
      index: index + 1,
      pivot,
      alpha,
      beta,
      previousAlpha,
      previousBeta,
    });
  }

  const solution = new Array<number>(coefficients.length);
  const backwardSteps: SweepBackwardStep[] = [];
  for (let index = coefficients.length - 1; index >= 0; index -= 1) {
    const step = forwardSteps[index];
    const nextX = index < coefficients.length - 1 ? solution[index + 1] : null;
    const x = nextX === null ? step.beta : step.alpha * nextX + step.beta;

    if (!Number.isFinite(x)) {
      throw new Error(t('errors.sweep_overflow', { row: index + 1 }));
    }

    solution[index] = x;
    backwardSteps.push({
      index: index + 1,
      alpha: step.alpha,
      beta: step.beta,
      nextX,
      x,
    });
  }

  const rows = coefficients.map((row, index) => {
    const previousX = index > 0 ? solution[index - 1] : 0;
    const nextX = index < solution.length - 1 ? solution[index + 1] : 0;
    const residual = row.d - (row.a * previousX + row.b * solution[index] + row.c * nextX);
    if (!Number.isFinite(residual)) {
      throw new Error(t('errors.sweep_overflow', { row: index + 1 }));
    }
    return {
      ...row,
      index: index + 1,
      pivot: forwardSteps[index].pivot,
      alpha: forwardSteps[index].alpha,
      beta: forwardSteps[index].beta,
      x: solution[index],
      residual,
    };
  });

  const maxResidual = Math.max(...rows.map((row) => Math.abs(row.residual)));
  const matrixNorm = Math.max(
    ...coefficients.map((row) => Math.abs(row.a) + Math.abs(row.b) + Math.abs(row.c)),
  );
  const solutionNorm = Math.max(...solution.map(Math.abs));
  const rightHandNorm = Math.max(...coefficients.map((row) => Math.abs(row.d)));
  const residualScale = matrixNorm * solutionNorm + rightHandNorm;
  const relativeResidual = residualScale === 0 ? maxResidual : maxResidual / residualScale;
  const diagonallyDominant = coefficients.every(
    (row) => Math.abs(row.b) >= Math.abs(row.a) + Math.abs(row.c),
  );

  return {
    rows,
    forwardSteps,
    backwardSteps,
    maxResidual,
    relativeResidual,
    diagonallyDominant,
  };
}
