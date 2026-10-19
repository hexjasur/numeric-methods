import { math } from '@/lib/math';

export type NewtonInterpolationMode = 'divided' | 'finite';
export type NewtonDirection = 'forward' | 'backward';
export type NewtonInputPoint = { x: string; y: string };
export type NewtonPoint = { index: number; x: number; y: number };

export interface NewtonDifferenceStep {
  index: number;
  order: number;
  leftValue: number;
  rightValue: number;
  startX: number;
  endX: number;
  denominator: number | null;
  result: number;
}

export interface NewtonEvaluationTerm {
  order: number;
  coefficient: number;
  nodes: number[];
  productAtTarget: number;
  value: number;
  cumulative: number;
}

export interface NewtonInterpolationResult {
  mode: NewtonInterpolationMode;
  direction: NewtonDirection | null;
  spacing: number | null;
  points: NewtonPoint[];
  targetX: number;
  differenceTable: number[][];
  differenceSteps: NewtonDifferenceStep[];
  coefficients: number[];
  basisNodes: number[][];
  evaluationTerms: NewtonEvaluationTerm[];
  expandedCoefficients: number[];
  interpolatedValue: number;
}

const MIN_POINTS = 2;
const MAX_POINTS = 12;
const MAX_INPUT_MAGNITUDE = 1e6;

function parseReal(input: string): number {
  try {
    const value = math.evaluate(input);
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      Math.abs(value) > MAX_INPUT_MAGNITUDE
    ) {
      throw new Error('invalid');
    }
    return value;
  } catch {
    throw new Error('newtonInterpolation.err_real');
  }
}

function factorial(value: number): number {
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

function multiplyByLinearFactor(coefficients: number[], node: number): number[] {
  const result = Array.from({ length: coefficients.length + 1 }, () => 0);
  coefficients.forEach((coefficient, power) => {
    result[power] -= coefficient * node;
    result[power + 1] += coefficient;
  });
  return result;
}

function buildExpandedCoefficients(
  coefficients: number[],
  basisNodes: number[][],
): number[] {
  const expanded = Array.from({ length: coefficients.length }, () => 0);
  coefficients.forEach((coefficient, index) => {
    let basis = [1];
    basisNodes[index].forEach((node) => {
      basis = multiplyByLinearFactor(basis, node);
    });
    basis.forEach((value, power) => {
      expanded[power] += coefficient * value;
    });
  });
  const scale = Math.max(...expanded.map((value) => Math.abs(value)));
  const tolerance = Number.EPSILON * scale * 16;
  return expanded.map((value) => (Math.abs(value) <= tolerance ? 0 : value));
}

export function calculateNewtonInterpolation(
  inputPoints: NewtonInputPoint[],
  targetXInput: string,
  mode: NewtonInterpolationMode,
): NewtonInterpolationResult {
  if (inputPoints.length < MIN_POINTS) {
    throw new Error('newtonInterpolation.err_points_min');
  }
  if (inputPoints.length > MAX_POINTS) {
    throw new Error('newtonInterpolation.err_points_max');
  }

  const points: NewtonPoint[] = inputPoints.map((point, index) => ({
    index,
    x: parseReal(point.x),
    y: parseReal(point.y),
  }));
  if (new Set(points.map((point) => point.x)).size !== points.length) {
    throw new Error('newtonInterpolation.err_duplicate');
  }
  const targetX = parseReal(targetXInput);
  const count = points.length;
  let spacing: number | null = null;
  let direction: NewtonDirection | null = null;

  if (mode === 'finite') {
    spacing = points[1].x - points[0].x;
    const equallySpaced = points.slice(1).every((point, index) => {
      const step = point.x - points[index].x;
      return Math.abs(step - spacing!) <= 1e-9 * Math.max(1, Math.abs(spacing!));
    });
    if (!equallySpaced) {
      throw new Error('newtonInterpolation.err_spacing');
    }
    direction = Math.abs(targetX - points[0].x) <= Math.abs(targetX - points[count - 1].x)
      ? 'forward'
      : 'backward';
  }

  const differenceTable = Array.from({ length: count }, () =>
    Array.from({ length: count }, () => 0),
  );
  points.forEach((point, index) => {
    differenceTable[index][0] = point.y;
  });

  const differenceSteps: NewtonDifferenceStep[] = [];
  const useBackwardDifferences = mode === 'finite' && direction === 'backward';
  for (let order = 1; order < count; order += 1) {
    const firstIndex = useBackwardDifferences ? order : 0;
    const lastIndex = useBackwardDifferences ? count : count - order;
    for (let index = firstIndex; index < lastIndex; index += 1) {
      const leftValue = useBackwardDifferences
        ? differenceTable[index][order - 1]
        : differenceTable[index + 1][order - 1];
      const rightValue = useBackwardDifferences
        ? differenceTable[index - 1][order - 1]
        : differenceTable[index][order - 1];
      const numerator = leftValue - rightValue;
      const denominator = mode === 'divided'
        ? points[index + order].x - points[index].x
        : null;
      const value = denominator === null
        ? numerator
        : numerator / denominator;
      if (!Number.isFinite(value)) {
        throw new Error('newtonInterpolation.err_overflow');
      }
      differenceTable[index][order] = value;
      differenceSteps.push({
        index,
        order,
        leftValue,
        rightValue,
        startX: points[useBackwardDifferences ? index - order : index].x,
        endX: points[useBackwardDifferences ? index : index + order].x,
        denominator,
        result: value,
      });
    }
  }

  const anchorIndex = mode === 'finite' && direction === 'backward'
    ? count - 1
    : 0;
  const coefficients = [points[anchorIndex].y];
  const basisNodes: number[][] = [[]];

  for (let order = 1; order < count; order += 1) {
    if (mode === 'divided') {
      coefficients.push(differenceTable[0][order]);
      basisNodes.push(points.slice(0, order).map((point) => point.x));
    } else {
      const rowIndex = direction === 'forward' ? 0 : count - 1;
      const denominator = factorial(order) * Math.pow(spacing!, order);
      coefficients.push(differenceTable[rowIndex][order] / denominator);
      const nodes = direction === 'forward'
        ? points.slice(0, order).map((point) => point.x)
        : points.slice(count - order).map((point) => point.x).reverse();
      basisNodes.push(nodes);
    }
  }

  const evaluationTerms: NewtonEvaluationTerm[] = [];
  let interpolatedValue = 0;
  coefficients.forEach((coefficient, order) => {
    const nodes = basisNodes[order];
    const productAtTarget = nodes.reduce(
      (product, node) => product * (targetX - node),
      1,
    );
    const value = coefficient * productAtTarget;
    interpolatedValue += value;
    if (![productAtTarget, value, interpolatedValue].every(Number.isFinite)) {
      throw new Error('newtonInterpolation.err_overflow');
    }
    evaluationTerms.push({
      order,
      coefficient,
      nodes,
      productAtTarget,
      value,
      cumulative: interpolatedValue,
    });
  });

  const expandedCoefficients = buildExpandedCoefficients(coefficients, basisNodes);
  if (!expandedCoefficients.every(Number.isFinite)) {
    throw new Error('newtonInterpolation.err_overflow');
  }

  return {
    mode,
    direction,
    spacing,
    points,
    targetX,
    differenceTable,
    differenceSteps,
    coefficients,
    basisNodes,
    evaluationTerms,
    expandedCoefficients,
    interpolatedValue,
  };
}

export function formatNewtonValue(value: number, digits = 8): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toPrecision(digits)).toString();
}
