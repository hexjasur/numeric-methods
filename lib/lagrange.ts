import { math, normalizeExpression } from '@/lib/math';

export type LagrangeInputPoint = { x: string; y: string };
export type LagrangePoint = { index: number; x: number; y: number };
export type LagrangeBasis = {
  index: number;
  denominator: number;
  numeratorCoefficients: number[];
  coefficients: number[];
  weightedCoefficients: number[];
};
export type LagrangeResult = {
  points: LagrangePoint[];
  bases: LagrangeBasis[];
  coefficients: number[];
  xValue: number;
  interpolatedValue: number;
  targetValue: number | null;
  absoluteError: number | null;
  targetExpressionTex: string | null;
};

const MIN_POINTS = 2;
const MAX_POINTS = 12;
const MAX_INPUT_MAGNITUDE = 1e6;

export function formatLagrange(value: number, digits = 8): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
}

function parseReal(value: string): number {
  const result = math.evaluate(value);
  if (typeof result !== 'number' || !Number.isFinite(result) || Math.abs(result) > MAX_INPUT_MAGNITUDE) {
    throw new Error('invalid-real');
  }
  return result;
}

function multiplyPolynomials(first: number[], second: number[]): number[] {
  const product = Array(first.length + second.length - 1).fill(0) as number[];
  first.forEach((coefficient, firstPower) => {
    second.forEach((other, secondPower) => {
      product[firstPower + secondPower] += coefficient * other;
    });
  });
  return product;
}

export function evaluatePolynomial(coefficients: number[], x: number): number {
  return coefficients.reduceRight((sum, coefficient) => sum * x + coefficient, 0);
}

export function calculateLagrange(
  inputPoints: LagrangeInputPoint[],
  xValueInput: string,
  targetExpression: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): LagrangeResult {
  if (inputPoints.length < MIN_POINTS) throw new Error(t('errors.lag_points_min'));
  if (inputPoints.length > MAX_POINTS) throw new Error(t('errors.lag_points_max', { max: MAX_POINTS }));

  const points: LagrangePoint[] = inputPoints.map((point, index) => {
    try {
      return { index, x: parseReal(point.x), y: parseReal(point.y) };
    } catch {
      throw new Error(t('errors.lag_point_value', { point: index + 1 }));
    }
  });
  if (new Set(points.map((point) => point.x)).size !== points.length) {
    throw new Error(t('errors.lag_duplicate'));
  }

  let xValue: number;
  try {
    xValue = parseReal(xValueInput);
  } catch {
    throw new Error(t('errors.lag_x'));
  }

  const polynomial = Array(points.length).fill(0) as number[];
  const bases = points.map((point, index): LagrangeBasis => {
    let numeratorCoefficients = [1];
    let denominator = 1;
    points.forEach((other, otherIndex) => {
      if (otherIndex === index) return;
      numeratorCoefficients = multiplyPolynomials(numeratorCoefficients, [-other.x, 1]);
      denominator *= point.x - other.x;
    });
    const coefficients = numeratorCoefficients.map((value) => value / denominator);
    const weightedCoefficients = coefficients.map((value) => value * point.y);
    weightedCoefficients.forEach((value, power) => {
      polynomial[power] += value;
    });
    return { index, denominator, numeratorCoefficients, coefficients, weightedCoefficients };
  });

  const cleanedPolynomial = polynomial.map((value) => Math.abs(value) < 1e-12 ? 0 : value);
  const interpolatedValue = evaluatePolynomial(cleanedPolynomial, xValue);
  let targetValue: number | null = null;
  let targetExpressionTex: string | null = null;
  const trimmedTarget = targetExpression.trim();
  if (trimmedTarget) {
    try {
      const node = math.parse(normalizeExpression(trimmedTarget));
      const compiled = node.compile();
      targetValue = Number(compiled.evaluate({ x: xValue }));
      if (!Number.isFinite(targetValue)) throw new Error('non-finite');
      targetExpressionTex = node.toTex({ parenthesis: 'auto' });
    } catch {
      throw new Error(t('errors.lag_target'));
    }
  }

  return {
    points,
    bases,
    coefficients: cleanedPolynomial,
    xValue,
    interpolatedValue,
    targetValue,
    absoluteError: targetValue === null ? null : Math.abs(targetValue - interpolatedValue),
    targetExpressionTex,
  };
}
