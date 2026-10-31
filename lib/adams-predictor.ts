import { compileMath } from '@/lib/math';

export interface AdamsPredictorOptions {
  a: number;
  b: number;
  x0: number;
  y0: number;
  h: number;
}

export interface EvalPoint {
  x: number;
  y: number;
  fVal: number;
}

export interface AdamsPredictorStepDetails {
  stepSize?: number;
  // RK4 details
  k0?: number;
  k0Eval?: EvalPoint;
  k1?: number;
  k1Eval?: EvalPoint;
  k2?: number;
  k2Eval?: EvalPoint;
  k3?: number;
  k3Eval?: EvalPoint;

  // Adams details
  qCurrent?: number;
  prevQ?: number[]; // [q_i, q_{i-1}, q_{i-2}, q_{i-3}]
  delta1?: number;
  delta2?: number;
  delta3?: number;
  qTerm?: number;
  termDelta1?: number;
  termDelta2?: number;
  termDelta3?: number;
}

export interface AdamsPredictorResult {
  step: number;
  x: number;
  y: number;
  q: number;
  increment: number;
  method: 'Initial' | 'RK4 startup' | 'Adams predictor' | 'RK4 boundary';
  details?: AdamsPredictorStepDetails;
}

function round(value: number, digits = 8): number {
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

  const rk4WithCoeffs = (x: number, y: number, step: number) => {
    const f0 = evaluate(x, y);
    const k0 = step * f0;

    const x1 = x + step / 2;
    const y1 = y + k0 / 2;
    const f1 = evaluate(x1, y1);
    const k1 = step * f1;

    const x2 = x + step / 2;
    const y2 = y + k1 / 2;
    const f2 = evaluate(x2, y2);
    const k2 = step * f2;

    const x3 = x + step;
    const y3 = y + k2;
    const f3 = evaluate(x3, y3);
    const k3 = step * f3;

    const nextY = y + (k0 + 2 * k1 + 2 * k2 + k3) / 6;
    return {
      nextY,
      stepSize: round(step, 8),
      k0: round(k0, 8),
      k0Eval: { x: round(x, 6), y: round(y, 6), fVal: round(f0, 6) },
      k1: round(k1, 8),
      k1Eval: { x: round(x1, 6), y: round(y1, 6), fVal: round(f1, 6) },
      k2: round(k2, 8),
      k2Eval: { x: round(x2, 6), y: round(y2, 6), fVal: round(f2, 6) },
      k3: round(k3, 8),
      k3Eval: { x: round(x3, 6), y: round(y3, 6), fVal: round(f3, 6) },
    };
  };

  const integrateSide = (direction: -1 | 1, bound: number): AdamsPredictorResult[] => {
    const initialF = evaluate(x0, y0);
    const rows: AdamsPredictorResult[] = [{
      step: 0,
      x: x0,
      y: y0,
      q: 0,
      increment: 0,
      method: 'Initial',
      details: {
        stepSize: h,
        qCurrent: round(h * initialF * direction, 8),
        k0Eval: { x: x0, y: y0, fVal: round(initialF, 6) },
      }
    }];
    rows[0].q = h * initialF * direction;
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
      let stepDetails: AdamsPredictorStepDetails | undefined;

      if (isPartial) {
        const rk = rk4WithCoeffs(x, y, stepSize);
        nextY = rk.nextY;
        increment = nextY - y;
        method = 'RK4 boundary';
        stepDetails = {
          stepSize: rk.stepSize,
          k0: rk.k0,
          k0Eval: rk.k0Eval,
          k1: rk.k1,
          k1Eval: rk.k1Eval,
          k2: rk.k2,
          k2Eval: rk.k2Eval,
          k3: rk.k3,
          k3Eval: rk.k3Eval,
        };
      } else if (index < 3) {
        const rk = rk4WithCoeffs(x, y, stepSize);
        nextY = rk.nextY;
        increment = nextY - y;
        method = 'RK4 startup';
        stepDetails = {
          stepSize: rk.stepSize,
          k0: rk.k0,
          k0Eval: rk.k0Eval,
          k1: rk.k1,
          k1Eval: rk.k1Eval,
          k2: rk.k2,
          k2Eval: rk.k2Eval,
          k3: rk.k3,
          k3Eval: rk.k3Eval,
        };
      } else {
        const q = rows.map((row) => row.q);
        const last = q.length - 1;
        const q0 = q[last];
        const q1 = q[last - 1];
        const q2 = q[last - 2];
        const q3 = q[last - 3];

        const delta1 = q0 - q1;
        const delta2 = q0 - 2 * q1 + q2;
        const delta3 = q0 - 3 * q1 + 3 * q2 - q3;

        const termDelta1 = 0.5 * delta1;
        const termDelta2 = (5 / 12) * delta2;
        const termDelta3 = (3 / 8) * delta3;
        increment = q0 + termDelta1 + termDelta2 + termDelta3;
        nextY = y + increment;
        method = 'Adams predictor';
        stepDetails = {
          stepSize: round(stepSize, 8),
          qCurrent: round(q0, 8),
          prevQ: [round(q0, 8), round(q1, 8), round(q2, 8), round(q3, 8)],
          delta1: round(delta1, 8),
          delta2: round(delta2, 8),
          delta3: round(delta3, 8),
          qTerm: round(q0, 8),
          termDelta1: round(termDelta1, 8),
          termDelta2: round(termDelta2, 8),
          termDelta3: round(termDelta3, 8),
        };
      }

      const nextX = Math.abs(bound - (x + stepSize)) < 1e-10 ? bound : x + stepSize;
      if (![nextX, nextY, increment].every(Number.isFinite)) {
        throw new Error('The calculation produced a non-finite value.');
      }
      const nextF = evaluate(nextX, nextY);
      const nextQ = h * direction * nextF;
      rows.push({
        step: index + 1,
        x: round(nextX, 8),
        y: round(nextY, 8),
        q: round(nextQ, 8),
        increment: round(increment, 8),
        method,
        details: stepDetails,
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
