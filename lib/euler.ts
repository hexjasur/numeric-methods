import { math, compileMath, normalizeExpression } from '@/lib/math';

export type EulerRow = {
  step: number;
  x: number;
  yEuler: number;
  yImproved: number;
  yExact: number | null;
  difference: number;
};

export type ExactODEResult = {
  hasExact: true;
  fn: (x: number) => number;
  tex: string;
  description: string;
} | {
  hasExact: false;
  reasonKey: 'nonlinear_y' | 'cross_product' | 'general';
  reasonText: string;
};

export type EulerResult = {
  rows: EulerRow[];
  steps: number;
  hasExactSolution: boolean;
  exactResult: ExactODEResult;
};

function formatCoeff(n: number): string {
  const rounded = Number(n.toFixed(4));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}

export function findExactSolution(
  expression: string,
  x0: number,
  y0: number,
  t: (k: string, p?: Record<string, string | number>) => string
): ExactODEResult {
  try {
    const cleanExpr = normalizeExpression(expression);
    const node = math.parse(cleanExpr);
    const d_y = math.derivative(node, 'y');
    const d_x = math.derivative(node, 'x');
    const d2_y = math.derivative(d_y, 'y');
    const d2_x = math.derivative(d_x, 'x');
    const d_xy = math.derivative(d_x, 'y');

    const s_d2_y = math.simplify(d2_y).toString();
    const s_d2_x = math.simplify(d2_x).toString();
    const s_d_xy = math.simplify(d_xy).toString();
    const s_d_y = math.simplify(d_y).toString();

    // Case 1: 1st order linear with constant coefficients: f(x, y) = A*y + B*x + C
    if (s_d2_y === '0' && s_d2_x === '0' && s_d_xy === '0') {
      const compiled = node.compile();
      const A = Number(math.simplify(d_y).evaluate());
      const B = Number(math.simplify(d_x).evaluate());
      const C = Number(compiled.evaluate({ x: 0, y: 0 }));

      if (A !== 0) {
        // y' - A*y = B*x + C
        // y_p = p*x + q where p = -B / A, q = -(B + A * C) / (A * A)
        const p = -B / A;
        const q = -(B + A * C) / (A * A);
        const yp0 = p * x0 + q;
        const K = y0 - yp0;

        let ypTex = '';
        if (p !== 0) {
          ypTex = p === 1 ? 'x' : p === -1 ? '-x' : `${formatCoeff(p)}x`;
        }
        if (q !== 0) {
          if (ypTex) {
            ypTex += q > 0 ? ` + ${formatCoeff(q)}` : ` - ${formatCoeff(Math.abs(q))}`;
          } else {
            ypTex = formatCoeff(q);
          }
        }

        const expPower =
          A === 1
            ? '(x - x_0)'
            : A === -1
              ? '-(x - x_0)'
              : `${formatCoeff(A)}(x - x_0)`;
        const kStr = formatCoeff(K);

        let fullTex = '';
        if (ypTex) {
          fullTex = `${ypTex} + ${kStr}e^{${expPower}}`;
        } else {
          fullTex = `${kStr}e^{${expPower}}`;
        }

        const odeLatex = `y' ${A >= 0 ? '-' : '+'} ${formatCoeff(Math.abs(A))}y = ${formatCoeff(B)}x ${C >= 0 ? '+' : '-'} ${formatCoeff(Math.abs(C))}`;

        return {
          hasExact: true,
          fn: (x: number) => p * x + q + K * Math.exp(A * (x - x0)),
          tex: `y(x) = ${fullTex}`,
          description: `1-tartibli chiziqli ODT (${odeLatex}) analitik yechildi: C = ${kStr}.`,
        };
      } else {
        // A === 0 -> y' = B*x + C
        const fn = (x: number) => y0 + (B / 2) * (x * x - x0 * x0) + C * (x - x0);
        let rhs = '';
        if (B !== 0) {
          rhs = `${formatCoeff(B / 2)}x^2`;
        }
        if (C !== 0) {
          rhs = rhs ? `${rhs} + ${formatCoeff(C)}x` : `${formatCoeff(C)}x`;
        }
        const constVal = y0 - (B / 2) * x0 * x0 - C * x0;
        if (constVal !== 0) {
          rhs = rhs ? `${rhs} + ${formatCoeff(constVal)}` : `${formatCoeff(constVal)}`;
        }
        return {
          hasExact: true,
          fn,
          tex: `y(x) = ${rhs || 'y_0'}`,
          description: `Ajraladigan ODT: y' = ${formatCoeff(B)}x + ${formatCoeff(C)} bevosita integrallandi.`,
        };
      }
    }

    // Case 2: Separable f(x, y) = x * y
    if (s_d2_y === '0' && s_d_xy === '1' && s_d2_x === '0') {
      const compiled = node.compile();
      const val0 = compiled.evaluate({ x: 0, y: 0 });
      if (val0 === 0) {
        return {
          hasExact: true,
          fn: (x: number) => y0 * Math.exp((x * x - x0 * x0) / 2),
          tex: `y(x) = ${formatCoeff(y0)}e^{\\frac{x^2 - x_0^2}{2}}`,
          description: "Ajraladigan ODT: dy/y = x dx integrallandi.",
        };
      }
    }

    // Case 3: Pure polynomial of x (d_y === 0)
    if (s_d_y === '0') {
      const compiled = node.compile();
      const c = Number(compiled.evaluate({ x: 0, y: 0 }));
      const f1 = Number(compiled.evaluate({ x: 1, y: 0 }));
      const f_neg1 = Number(compiled.evaluate({ x: -1, y: 0 }));
      const f2 = Number(compiled.evaluate({ x: 2, y: 0 }));

      const a = (f1 + f_neg1 - 2 * c) / 2;
      const b = (f1 - f_neg1) / 2;
      const check2 = a * 4 + b * 2 + c;
      if (Math.abs(f2 - check2) < 1e-8) {
        const G = (x: number) => (a / 3) * Math.pow(x, 3) + (b / 2) * Math.pow(x, 2) + c * x;
        const C_const = y0 - G(x0);
        let tex = '';
        if (a !== 0) tex += `${formatCoeff(a / 3)}x^3`;
        if (b !== 0) tex += (tex ? (b > 0 ? ' + ' : ' - ') : '') + `${formatCoeff(Math.abs(b / 2))}x^2`;
        if (c !== 0) tex += (tex ? (c > 0 ? ' + ' : ' - ') : '') + `${formatCoeff(Math.abs(c))}x`;
        if (C_const !== 0) tex += (tex ? (C_const > 0 ? ' + ' : ' - ') : '') + `${formatCoeff(Math.abs(C_const))}`;
        return {
          hasExact: true,
          fn: (x: number) => y0 + (G(x) - G(x0)),
          tex: `y(x) = ${tex || '0'}`,
          description: `Kvadratik ODT: y' = ${formatCoeff(a)}x^2 + ${formatCoeff(b)}x + ${formatCoeff(c)} analitik integrallandi.`,
        };
      }
    }

    // Identify failure reason:
    if (s_d2_y !== '0') {
      return {
        hasExact: false,
        reasonKey: 'nonlinear_y',
        reasonText: t('euler.exact_reason_nonlinear_y'),
      };
    }

    if (s_d_xy !== '0') {
      return {
        hasExact: false,
        reasonKey: 'cross_product',
        reasonText: t('euler.exact_reason_cross'),
      };
    }

    return {
      hasExact: false,
      reasonKey: 'general',
      reasonText: t('euler.exact_reason_general'),
    };
  } catch {
    return {
      hasExact: false,
      reasonKey: 'general',
      reasonText: t('euler.exact_reason_general'),
    };
  }
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

  const exactResult = findExactSolution(expression, x0, y0, t);
  const hasExactSolution = exactResult.hasExact;
  const rows: EulerRow[] = [];
  let x = x0;
  let yEuler = y0;
  let yImproved = y0;

  const pushRow = (step: number) => {
    const yExactVal = hasExactSolution ? exactResult.fn(x) : null;
    rows.push({
      step,
      x: Number(x.toFixed(10)),
      yEuler,
      yImproved,
      yExact: yExactVal,
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

  return { rows, steps: estimatedSteps, hasExactSolution, exactResult };
}
