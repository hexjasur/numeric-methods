'use client';

import { derivative, compile, type MathNode } from 'mathjs';
type Translate = (key: string, params?: Record<string, string | number>) => string;

export interface IterationStep {
  iteration: number;
  previousX: number;
  fx: number;
  nextX: number;
  nextFx: number;
  converged: boolean;
}

export interface IterationResult {
  expression: string;
  a: number;
  b: number;
  epsilon: number;
  M: number;
  derivativeAtA: number;
  derivativeAtB: number;
  steps: IterationStep[];
  root: number;
  residual: number;
}

const MAX_ITERATIONS = 20;

function toFinite(value: unknown): number {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error('non-finite');
  return number;
}

export function calculateIteration(
  expression: string,
  aText: string,
  bText: string,
  epsilonText: string,
  t: Translate,
): IterationResult {
  const a = toFinite(aText);
  const b = toFinite(bText);
  const epsilon = toFinite(epsilonText);
  if (a >= b) throw new Error(t('errors.it_bounds'));
  if (epsilon <= 0) throw new Error(t('errors.it_positive'));
  const normalized = expression.trim().replace(/\s+/g, '');
  if (!normalized) throw new Error(t('errors.it_fn'));

  let fn: { evaluate: (scope: { x: number }) => unknown };
  let derivativeNode: MathNode;
  try {
    fn = compile(normalized);
    derivativeNode = derivative(normalized, 'x');
  } catch {
    throw new Error(t('errors.it_fn'));
  }
  const evaluate = (x: number) => toFinite(fn.evaluate({ x }));
  const evaluateDerivative = (x: number) => toFinite(derivativeNode.evaluate({ x }));
  const derivativeAtA = Math.abs(evaluateDerivative(a));
  const derivativeAtB = Math.abs(evaluateDerivative(b));
  const maxDerivative = Math.max(derivativeAtA, derivativeAtB);
  if (!Number.isFinite(maxDerivative)) throw new Error(t('errors.it_fn'));
  const M = Math.ceil(maxDerivative) + 1;
  if (M <= 0) throw new Error(t('errors.it_m'));

  let previousX = b;
  const steps: IterationStep[] = [];
  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration += 1) {
    const fx = evaluate(previousX);
    const nextX = previousX - fx / M;
    const nextFx = evaluate(nextX);
    const converged = Math.abs(nextFx) <= epsilon;
    steps.push({ iteration, previousX, fx, nextX, nextFx, converged });
    if (converged) {
      return { expression: normalized, a, b, epsilon, M, derivativeAtA, derivativeAtB, steps, root: nextX, residual: Math.abs(nextFx) };
    }
    previousX = nextX;
  }
  throw new Error(t('errors.it_no_convergence', { max: MAX_ITERATIONS }));
}

export function formatIteration(value: number, digits = 6): string {
  if (Math.abs(value) < 1e-12) return '0';
  return Number(value.toFixed(digits)).toString();
}
