import { compileMath } from '@/lib/math';

export interface RK4Result {
  step: number;
  x: number;
  y: number;
  k0: number;
  k1: number;
  k2: number;
  k3: number;
}

export interface RK4Options {
  x0: number;
  y0: number;
  xEnd: number;
  h: number;
}

export function calculateRK4(expression: string, { x0, y0, xEnd, h }: RK4Options): RK4Result[] {
  if (![x0, y0, xEnd, h].every(Number.isFinite)) {
    throw new Error('Parameters must be finite numbers.');
  }
  if (h <= 0 || xEnd <= x0) {
    throw new Error('The step must be positive and the interval must increase.');
  }
  const compiled = compileMath(expression);
  if (!compiled) {
    throw new Error('Check the expression syntax.');
  }
  const evaluate = (x: number, y: number): number => {
    const value = compiled.evaluate({ x, y });
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('The expression must return a finite real number.');
    }
    return value;
  };

  const stepCount = Math.ceil((xEnd - x0) / h - 1e-12);
  if (stepCount > 5000) {
    throw new Error('Choose a larger step or a shorter interval (maximum 5,000 steps).');
  }

  const results: RK4Result[] = [];
  let x = x0;
  let y = y0;

  for (let i = 0; i <= stepCount; i += 1) {
    const stepSize = Math.min(h, xEnd - x);
    let k0 = 0;
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;

    if (i < stepCount && stepSize > 0) {
      k0 = stepSize * evaluate(x, y);
      k1 = stepSize * evaluate(x + stepSize / 2, y + k0 / 2);
      k2 = stepSize * evaluate(x + stepSize / 2, y + k1 / 2);
      k3 = stepSize * evaluate(x + stepSize, y + k2);
    }

    if (![y, k0, k1, k2, k3].every(Number.isFinite)) {
      throw new Error('The calculation produced a non-finite value.');
    }

    results.push({
      step: i,
      x: Number(x.toFixed(8)),
      y: Number(y.toFixed(10)),
      k0: Number(k0.toFixed(10)),
      k1: Number(k1.toFixed(10)),
      k2: Number(k2.toFixed(10)),
      k3: Number(k3.toFixed(10)),
    });

    if (i < stepCount) {
      y += (k0 + 2 * k1 + 2 * k2 + k3) / 6;
      x = Math.min(x0 + (i + 1) * h, xEnd);
    }
  }

  return results;
}
