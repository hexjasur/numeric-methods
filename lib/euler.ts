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

export type EulerStepDetail = {
  i: number;
  x: number;
  y: number;
  f_xy: number;
  h: number;
  nextX: number;
  nextY: number;
  xImproved: number;
  yImproved: number;
  k1: number;
  yPred: number;
  k2: number;
  nextYImproved: number;
};

export type EulerResult = {
  rows: EulerRow[];
  steps: number;
  detailedSteps: EulerStepDetail[];
} & (
  | {
      hasExactSolution: true;
      exactResult: Extract<ExactODEResult, { hasExact: true }>;
    }
  | {
      hasExactSolution: false;
      exactResult: Extract<ExactODEResult, { hasExact: false }>;
    }
);

function formatCoeff(n: number): string {
  const rounded = Number(n.toFixed(4));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}

function formatPolynomial(a2: number, a1: number, a0: number): string {
  const terms: string[] = [];
  for (const [coefficient, variable, power] of [
    [a2, 'x', 2],
    [a1, 'x', 1],
    [a0, '', 0],
  ] as const) {
    if (coefficient === 0) continue;
    const magnitude = Math.abs(coefficient);
    const value = variable && magnitude === 1 ? '' : formatCoeff(magnitude);
    const term = `${value}${variable}${power === 2 ? '^2' : ''}`;
    const sign = coefficient < 0 ? '-' : '+';
    terms.push(terms.length === 0 ? (coefficient < 0 ? `-${term}` : term) : ` ${sign} ${term}`);
  }
  return terms.join('') || '0';
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
          description: `1-tartibli çiziqli ODT (${odeLatex}) analitik yeçildi: C = ${kStr}.`,
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

    // Case 1b: y' = A*y + a2*x^2 + a1*x + a0, solved by a polynomial particular solution.
    if (s_d2_y === '0' && math.simplify(math.derivative(d_y, 'x')).toString() === '0') {
      const A = Number(math.simplify(d_y).evaluate());
      if (A !== 0 && Number.isFinite(A)) {
        const forcingNode = math.parse(`(${cleanExpr}) - ((${s_d_y}) * y)`);
        const forcingFirst = math.derivative(forcingNode, 'x');
        const forcingSecond = math.derivative(forcingFirst, 'x');
        const forcingThird = math.derivative(forcingSecond, 'x');
        if (math.simplify(forcingThird).toString() === '0') {
          const forcing = forcingNode.compile();
          const a0 = Number(forcing.evaluate({ x: 0, y: 0 }));
          const a1 = Number(forcingFirst.compile().evaluate({ x: 0, y: 0 }));
          const a2 = Number(forcingSecond.compile().evaluate({ x: 0, y: 0 })) / 2;
          if ([a0, a1, a2].every(Number.isFinite)) {
            const p2 = -a2 / A;
            const p1 = (2 * p2 - a1) / A;
            const p0 = (p1 - a0) / A;
            const particular = (x: number) => p2 * x * x + p1 * x + p0;
            const K = y0 - particular(x0);
            const polynomialTex = formatPolynomial(p2, p1, p0);
            const exponent = A === 1
              ? '(x - x_0)'
              : A === -1
                ? '-(x - x_0)'
                : `${formatCoeff(A)}(x - x_0)`;
            const exponentialTerm = `${formatCoeff(Math.abs(K))}e^{${exponent}}`;
            const solutionTex = K === 0
              ? polynomialTex
              : `${polynomialTex} ${K < 0 ? '-' : '+'} ${exponentialTerm}`;
            return {
              hasExact: true,
              fn: (x: number) => particular(x) + K * Math.exp(A * (x - x0)),
              tex: `y(x) = ${solutionTex}`,
              description: 'Birinçi tartibli çiziqli ODT kvadratik x-köphad bilan analitik yeçildi.',
            };
          }
        }
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
  const detailedSteps: EulerStepDetail[] = [];
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
    const nextX = step === estimatedSteps ? xEnd : x + stepSize;

    // Simple Euler slopes & next value
    const eulerSlope = evaluate(x, yEuler);
    const nextYEuler = yEuler + stepSize * eulerSlope;

    // Improved Euler (Heun) slopes & next value
    const improvedSlope = evaluate(x, yImproved);
    const predictedY = yImproved + stepSize * improvedSlope;
    const correctedSlope = evaluate(nextX, predictedY);
    const nextYImproved = yImproved + (stepSize / 2) * (improvedSlope + correctedSlope);

    detailedSteps.push({
      i: step - 1,
      x,
      y: yEuler,
      f_xy: eulerSlope,
      h: stepSize,
      nextX,
      nextY: nextYEuler,
      xImproved: x,
      yImproved,
      k1: improvedSlope,
      yPred: predictedY,
      k2: correctedSlope,
      nextYImproved,
    });

    yEuler = nextYEuler;
    yImproved = nextYImproved;
    if (!Number.isFinite(yEuler) || !Number.isFinite(yImproved)) {
      throw new Error(t('errors.elr_overflow'));
    }
    x = nextX;
    pushRow(step);
  }

  if (exactResult.hasExact) {
    return {
      rows,
      steps: estimatedSteps,
      hasExactSolution: true,
      exactResult,
      detailedSteps,
    };
  }

  return {
    rows,
    steps: estimatedSteps,
    hasExactSolution: false,
    exactResult,
    detailedSteps,
  };
}

export function formatNum(n: number, maxDigits = 4): string {
  if (Math.abs(n) < 1e-12) return '0';
  const rounded = Number(n.toFixed(maxDigits));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}

export function substituteExpr(expr: string, xVal: string, yVal: string): string {
  try {
    const formattedX = xVal.startsWith('-') ? `(${xVal})` : xVal;
    const formattedY = yVal.startsWith('-') ? `(${yVal})` : `(${yVal})`;
    return expr
      .replace(/(\d)([xy])/g, '$1 * $2')
      .replace(/(^|[^a-zA-Z0-9_])x(?![a-zA-Z0-9_])/g, `$1${formattedX}`)
      .replace(/(^|[^a-zA-Z0-9_])y(?![a-zA-Z0-9_])/g, `$1${formattedY}`);
  } catch {
    return `f(${xVal}, ${yVal})`;
  }
}

export function substituteLatex(expr: string, xVal: string, yVal: string): string {
  try {
    const formattedX = xVal.startsWith('-') ? `(${xVal})` : xVal;
    const formattedY = yVal.startsWith('-') ? `(${yVal})` : `(${yVal})`;
    return expr
      .replace(/(\d)([xy])/g, '$1 \\cdot $2')
      .replace(/\*/g, ' \\cdot ')
      .replace(/(^|[^a-zA-Z0-9_])x(?![a-zA-Z0-9_])/g, `$1${formattedX}`)
      .replace(/(^|[^a-zA-Z0-9_])y(?![a-zA-Z0-9_])/g, `$1${formattedY}`);
  } catch {
    return `f(${xVal}, ${yVal})`;
  }
}

export function generateNotebookText(
  type: 'simple' | 'improved',
  expression: string,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  detailedSteps: EulerStepDetail[],
  t: (k: string, p?: Record<string, string | number>) => string
): string {
  const isSimple = type === 'simple';
  const title = isSimple
    ? `--- ${t('euler.notebook_tab_simple').toUpperCase()} BÖYİÇA YEÇİM ---`
    : `--- ${t('euler.notebook_tab_improved').toUpperCase()} BÖYİÇA YEÇİM ---`;

  const sec1 = t('euler.notebook_sec_1');
  const sec2 = t('euler.notebook_sec_2');
  const sec3 = t('euler.notebook_sec_3');
  const intervalWord = t('euler.notebook_interval');

  const lines: string[] = [
    title,
    '',
    `${sec1}:`,
    `   - f(x, y) = ${expression}`,
    `   - x_0 = ${formatNum(x0)}, y_0 = ${formatNum(y0)}`,
    `   - h = ${formatNum(h)}, ${intervalWord}: [${formatNum(x0)}, ${formatNum(xEnd)}]`,
    '',
    `${sec2}:`,
    '',
  ];

  if (isSimple) {
    for (const step of detailedSteps) {
      const i = step.i;
      const x_i = formatNum(step.x);
      const y_i = formatNum(step.y);
      const f_val = formatNum(step.f_xy);
      const h_val = formatNum(step.h);
      const nextY = formatNum(step.nextY);
      const nextX = formatNum(step.nextX);
      const subExpr = substituteExpr(expression, x_i, y_i);

      lines.push(`   i = ${i}:`);
      lines.push(`     x_${i} = ${x_i}, y_${i} = ${y_i}`);
      lines.push(`     f(x_${i}, y_${i}) = ${subExpr} = ${f_val}`);
      lines.push(
        `     y_${i + 1} = y_${i} + h * f(x_${i}, y_${i}) = ${y_i} + ${h_val} * (${f_val}) = ${nextY}`
      );
      lines.push(`     x_${i + 1} = x_${i} + h = ${x_i} + ${h_val} = ${nextX}`);
      lines.push('');
    }

    lines.push(`${sec3}:`);
    lines.push(`   |  i  |   x_i   |   y_i   | f(x_i, y_i) |`);
    lines.push(`   |-----|---------|---------|-------------|`);
    for (const step of detailedSteps) {
      lines.push(
        `   | ${String(step.i).padEnd(3)} | ${formatNum(step.x).padEnd(7)} | ${formatNum(step.y).padEnd(7)} | ${formatNum(step.f_xy).padEnd(11)} |`
      );
    }
    if (detailedSteps.length > 0) {
      const last = detailedSteps[detailedSteps.length - 1];
      lines.push(
        `   | ${String(last.i + 1).padEnd(3)} | ${formatNum(last.nextX).padEnd(7)} | ${formatNum(last.nextY).padEnd(7)} | —           |`
      );
    }
  } else {
    for (const step of detailedSteps) {
      const i = step.i;
      const x_i = formatNum(step.xImproved);
      const y_i = formatNum(step.yImproved);
      const k1 = formatNum(step.k1);
      const h_val = formatNum(step.h);
      const yPred = formatNum(step.yPred);
      const nextX = formatNum(step.nextX);
      const k2 = formatNum(step.k2);
      const nextY = formatNum(step.nextYImproved);

      const subExpr1 = substituteExpr(expression, x_i, y_i);
      const subExpr2 = substituteExpr(expression, nextX, yPred);

      lines.push(`   i = ${i}:`);
      lines.push(`     x_${i} = ${x_i}, y_${i} = ${y_i}`);
      lines.push(`     k_1 = f(x_${i}, y_${i}) = ${subExpr1} = ${k1}`);
      lines.push(
        `     ȳ_${i + 1} = y_${i} + h * k_1 = ${y_i} + ${h_val} * (${k1}) = ${yPred}`
      );
      lines.push(`     k_2 = f(x_${i + 1}, ȳ_${i + 1}) = ${subExpr2} = ${k2}`);
      lines.push(
        `     y_${i + 1} = y_${i} + (h / 2) * (k_1 + k_2) = ${y_i} + (${h_val} / 2) * (${k1} + ${k2}) = ${nextY}`
      );
      lines.push(`     x_${i + 1} = x_${i} + h = ${x_i} + ${h_val} = ${nextX}`);
      lines.push('');
    }

    lines.push(`${sec3}:`);
    lines.push(`   |  i  |   x_i   |   y_i   |   k_1   |  ȳ_{i+1} |   k_2   |`);
    lines.push(`   |-----|---------|---------|---------|----------|---------|`);
    for (const step of detailedSteps) {
      lines.push(
        `   | ${String(step.i).padEnd(3)} | ${formatNum(step.xImproved).padEnd(7)} | ${formatNum(step.yImproved).padEnd(7)} | ${formatNum(step.k1).padEnd(7)} | ${formatNum(step.yPred).padEnd(8)} | ${formatNum(step.k2).padEnd(7)} |`
      );
    }
    if (detailedSteps.length > 0) {
      const last = detailedSteps[detailedSteps.length - 1];
      lines.push(
        `   | ${String(last.i + 1).padEnd(3)} | ${formatNum(last.nextX).padEnd(7)} | ${formatNum(last.nextYImproved).padEnd(7)} | —       | —        | —       |`
      );
    }
  }

  return lines.join('\n');
}
