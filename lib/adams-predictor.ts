import { compileMath } from '@/lib/math';

export interface AdamsPredictorOptions {
  a: number;
  b: number;
  x0: number;
  y0: number;
  h: number;
}

export interface AdamsPredictorResult {
  step: number;
  x: number;
  y: number;
  q: number;
  increment: number;
  method: 'Initial' | 'RK4 startup' | 'Adams predictor' | 'RK4 boundary';
}

function round(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

export function calculateAdamsPredictor(
  expression: string,
  { a, b, x0, y0, h }: AdamsPredictorOptions,
): AdamsPredictorResult[] {
  if (![a, b, x0, y0, h].every(Number.isFinite)) {
    throw new Error('Parameters must be finite numbers.');
  }
  if (a >= b || x0 < a || x0 > b || h <= 0) {
    throw new Error('Require a < b, a <= x0 <= b, and h > 0.');
  }
  const compiled = compileMath(expression);
  if (!compiled) throw new Error('Check the expression syntax.');

  const evaluate = (x: number, y: number): number => {
    const value = compiled.evaluate({ x, y });
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('The expression must return a finite real number.');
    }
    return value;
  };

  const rk4 = (x: number, y: number, step: number): number => {
    const k0 = step * evaluate(x, y);
    const k1 = step * evaluate(x + step / 2, y + k0 / 2);
    const k2 = step * evaluate(x + step / 2, y + k1 / 2);
    const k3 = step * evaluate(x + step, y + k2);
    return y + (k0 + 2 * k1 + 2 * k2 + k3) / 6;
  };

  const integrateSide = (direction: -1 | 1, bound: number): AdamsPredictorResult[] => {
    const rows: AdamsPredictorResult[] = [{
      step: 0,
      x: x0,
      y: y0,
      q: 0,
      increment: 0,
      method: 'Initial',
    }];
    rows[0].q = h * evaluate(x0, y0) * direction;
    let x = x0;
    let y = y0;
    let index = 0;
    while (direction * (bound - x) > 1e-10) {
      if (index >= 5000) throw new Error('Maximum 5,000 steps exceeded.');
      const distance = Math.abs(bound - x);
      const stepSize = Math.min(h, distance) * direction;
      const isPartial = Math.abs(stepSize) < h - 1e-10;
      let nextY: number;
      let method: AdamsPredictorResult['method'];
      let increment: number;
      if (isPartial) {
        nextY = rk4(x, y, stepSize);
        increment = nextY - y;
        method = 'RK4 boundary';
      } else if (index < 3) {
        nextY = rk4(x, y, stepSize);
        increment = nextY - y;
        method = 'RK4 startup';
      } else {
        const q = rows.map((row) => row.q);
        const last = q.length - 1;
        const delta1 = q[last] - q[last - 1];
        const delta2 = q[last] - 2 * q[last - 1] + q[last - 2];
        const delta3 = q[last] - 3 * q[last - 1] + 3 * q[last - 2] - q[last - 3];
        increment = q[last] + 0.5 * delta1 + (5 / 12) * delta2 + (3 / 8) * delta3;
        nextY = y + increment;
        method = 'Adams predictor';
      }
      const nextX = Math.abs(bound - (x + stepSize)) < 1e-10 ? bound : x + stepSize;
      if (![nextX, nextY, increment].every(Number.isFinite)) {
        throw new Error('The calculation produced a non-finite value.');
      }
      const nextQ = h * direction * evaluate(nextX, nextY);
      rows.push({
        step: index + 1,
        x: round(nextX, 10),
        y: round(nextY, 12),
        q: round(nextQ, 12),
        increment: round(increment, 12),
        method,
      });
      x = nextX;
      y = nextY;
      index += 1;
    }
    return rows.slice(1);
  };

  const left = integrateSide(-1, a).reverse();
  const right = integrateSide(1, b);
  return [...left, ...right].map((row, index) => ({ ...row, step: index }));
}
