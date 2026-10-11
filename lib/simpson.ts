import { math, normalizeExpression, compileMath, isSumOperatorNode } from '@/lib/math';

export type SimpsonPoint = {
  i: number;
  x: number;
  y: number;
  type: 'end' | 'odd' | 'even';
  coeff: number;
};

export type SimpsonResult = {
  h: number;
  a: number;
  b: number;
  n: number;
  points: SimpsonPoint[];
  sumEnds: number;
  sumOdd: number;
  sumEven: number;
  integral: number;
  exactIntegral: number;
  errorMargin: number;
  errorScientific: string;
  expressionTex: string;
};

export function format(value: number, digits = 6): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

export function compile(expression: string) {
  const code = compileMath(expression);
  if (!code) return null;
  return (x: number) => {
    const val = Number(code.evaluate({ x, dx: 1 }));
    return val;
  };
}

export function calculateSimpson(
  expression: string,
  aStr: string,
  bStr: string,
  nStr: string,
  t: (k: string, p?: Record<string, string | number>) => string,
): SimpsonResult {
  const left = Number(aStr);
  const right = Number(bStr);
  let n = Number.parseInt(nStr, 10);

  if (!Number.isFinite(left) || !Number.isFinite(right) || !Number.isInteger(n)) {
    throw new Error(t('errors.smp_params'));
  }

  if (left >= right) {
    throw new Error(t('errors.smp_bounds'));
  }

  if (n <= 0) {
    throw new Error(t('errors.smp_positive'));
  }

  if (n > 1000) {
    throw new Error(t('errors.smp_max'));
  }

  // Simpson's 1/3 rule requires an even number of subintervals
  if (n % 2 !== 0) {
    n += 1;
  }

  const f = compile(expression);
  if (!f) {
    throw new Error(t('errors.smp_fn'));
  }

  const h = (right - left) / n;
  const points: SimpsonPoint[] = [];
  let sumOdd = 0;
  let sumEven = 0;

  for (let i = 0; i <= n; i++) {
    const x = left + i * h;
    let y = 0;
    try {
      y = f(x);
    } catch {
      throw new Error(t('errors.smp_eval', { x: x.toFixed(4) }));
    }

    if (!Number.isFinite(y)) {
      throw new Error(t('errors.smp_eval', { x: x.toFixed(4) }));
    }

    let type: 'end' | 'odd' | 'even' = 'even';
    let coeff = 2;

    if (i === 0 || i === n) {
      type = 'end';
      coeff = 1;
    } else if (i % 2 !== 0) {
      type = 'odd';
      coeff = 4;
      sumOdd += y;
    } else {
      type = 'even';
      coeff = 2;
      sumEven += y;
    }

    points.push({ i, x, y, type, coeff });
  }

  const sumEnds = points[0].y + points[n].y;
  const integral = (h / 3) * (sumEnds + 4 * sumOdd + 2 * sumEven);

  // High precision benchmark (n = 10000)
  const nExact = 10000;
  const hExact = (right - left) / nExact;
  let sumOddExact = 0;
  let sumEvenExact = 0;

  for (let i = 1; i < nExact; i++) {
    const xi = left + i * hExact;
    const yi = f(xi);
    if (i % 2 !== 0) {
      sumOddExact += yi;
    } else {
      sumEvenExact += yi;
    }
  }

  const exactIntegral =
    (hExact / 3) * (points[0].y + points[n].y + 4 * sumOddExact + 2 * sumEvenExact);
  const errorMargin = Math.abs(integral - exactIntegral);

  let errorScientific = '0';
  if (errorMargin > 0) {
    const [mantissa, exponent] = errorMargin.toExponential(4).split('e');
    errorScientific = `${mantissa} \\times 10^{${exponent}}`;
  }

  let expressionTex = 'f(x)\\,dx';
  try {
    const norm = normalizeExpression(expression);
    const node = math.parse(norm);
    const tex = node
      .toTex({ parenthesis: 'auto' })
      .replace(/\\cdot/g, '')
      .replace(/~/g, ' ')
      .trim();
    const hasDx = /\bdx\b/i.test(expression);
    const isSum = isSumOperatorNode(node);

    if (hasDx) {
      expressionTex = tex;
    } else if (isSum) {
      expressionTex = `\\left(${tex}\\right)\\,dx`;
    } else {
      expressionTex = `${tex}\\,dx`;
    }
  } catch {
    expressionTex = expression.includes('dx') ? expression : `${expression}\\,dx`;
  }

  return {
    h,
    a: left,
    b: right,
    n,
    points,
    sumEnds,
    sumOdd,
    sumEven,
    integral,
    exactIntegral,
    errorMargin,
    errorScientific,
    expressionTex,
  };
}
