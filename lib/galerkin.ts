import { math } from '@/lib/math';
import type { MathNode } from 'mathjs';

export interface GalerkinInput {
  p: string;
  q: string;
  f: string;
  a: string;
  b: string;
  alpha0: string;
  alpha1: string;
  alphaValue: string;
  beta0: string;
  beta1: string;
  betaValue: string;
  phi0: string;
  basis: string[];
}

export interface GalerkinFunction {
  text: string;
  tex: string;
  d1Text: string;
  d1Tex: string;
  d2Text: string;
  d2Tex: string;
  value: (x: number) => number;
  d1: (x: number) => number;
  d2: (x: number) => number;
}

export interface GalerkinIntegral {
  name: string;
  row: number;
  col: number;
  integrandTex: string;
  samples: Array<{ x: number; value: number }>;
  value: number;
  error: number;
}

export interface GalerkinResult {
  operatorTex: string;
  phi0: GalerkinFunction;
  basis: GalerkinFunction[];
  pTex: string;
  qTex: string;
  fTex: string;
  boundaryLeft: { phi0: number; target: number };
  boundaryRight: { phi0: number; target: number };
  approximationTex: string;
  integrals: GalerkinIntegral[];
  matrix: number[][];
  rhs: number[];
  coefficients: number[];
  finalTex: string;
  solutionText: string;
  residualMax: number;
  orthogonality: number[];
  boundaryErrors: { left: number; right: number };
  samples: Array<{ x: number; u: number; residual: number }>;
  method: 'adaptive-simpson';
}

const ALLOWED_SYMBOLS = new Set(['x', 'pi', 'e', 'E', 'tau', 'i']);
const FORBIDDEN_FUNCTIONS = new Set([
  'import',
  'createUnit',
  'config',
  'evaluate',
  'parse',
  'compile',
]);
const EPS = 1e-9;
const SAMPLE_COUNT = 201;
const SIMPSON_N = 800;

type Scope = Record<string, number>;

function parseOrThrow(source: string, label: string): MathNode {
  const text = source.trim();
  if (!text) throw new Error(`${label} bo‘sh bo‘lmasligi kerak.`);
  let node: MathNode;
  try {
    node = math.parse(text);
  } catch {
    throw new Error(`${label} ifodasini tushunib bo‘lmadi: “${text}”.`);
  }
  node.traverse((child) => {
    if (child.type !== 'SymbolNode') return;
    const name = (child as unknown as { name: string }).name;
    const isFunctionName = name in math && typeof math[name] === 'function';
    if (ALLOWED_SYMBOLS.has(name) || (isFunctionName && !FORBIDDEN_FUNCTIONS.has(name)))
      return;
    if (name in math && !isFunctionName) return;
    throw new Error(`${label} ichida noma’lum belgi: “${name}”.`);
  });
  return node;
}

function toScalar(value: unknown, label: string, x: number): number {
  const result = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(result))
    throw new Error(`${label} x=${formatNumber(x)} nuqtada chekli qiymat bermadi.`);
  return result;
}

function makeFunction(source: string, label: string): GalerkinFunction {
  const node = parseOrThrow(source, label);
  const d1Node = math.derivative(node, 'x');
  const d2Node = math.derivative(d1Node, 'x');
  const compiled = node.compile();
  const compiledD1 = d1Node.compile();
  const compiledD2 = d2Node.compile();
  const evalAt = (fn: ReturnType<MathNode['compile']>) => (x: number) =>
    toScalar(fn.evaluate({ x } as Scope), label, x);
  return {
    text: node.toString(),
    tex: node.toTex(),
    d1Text: d1Node.toString(),
    d1Tex: d1Node.toTex(),
    d2Text: d2Node.toString(),
    d2Tex: d2Node.toTex(),
    value: evalAt(compiled),
    d1: evalAt(compiledD1),
    d2: evalAt(compiledD2),
  };
}

function parseNumber(value: string, label: string): number {
  try {
    const result = Number(math.evaluate(value.trim() || '0'));
    if (!Number.isFinite(result)) throw new Error();
    return result;
  } catch {
    throw new Error(`${label} uchun son yoki kasr kiriting.`);
  }
}

export function formatNumber(value: number, digits = 8): string {
  if (!Number.isFinite(value)) return String(value);
  return Number(value.toFixed(digits)).toString();
}

export function texNumber(value: number): string {
  if (Math.abs(value) < EPS) return '0';
  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  let numerator = Math.round(absolute);
  let denominator = 1;
  let bestError = Math.abs(absolute - numerator);
  for (let d = 1; d <= 4096; d += 1) {
    const n = Math.round(absolute * d);
    const error = Math.abs(absolute - n / d);
    if (error < bestError) {
      numerator = n;
      denominator = d;
      bestError = error;
    }
    if (error < 1e-9) break;
  }
  if (bestError > 1e-7) return `${sign}${formatNumber(absolute)}`;
  return `${sign}${denominator === 1 ? numerator : `\\frac{${numerator}}{${denominator}}`}`;
}

function simpson(g: (x: number) => number, a: number, b: number, n: number): number {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let sum = g(a) + g(b);
  for (let i = 1; i < m; i += 1) {
    sum += g(a + i * h) * (i % 2 === 1 ? 4 : 2);
  }
  return (sum * h) / 3;
}

function integrate(
  g: (x: number) => number,
  a: number,
  b: number,
): { value: number; error: number } {
  const coarse = simpson(g, a, b, SIMPSON_N / 2);
  const fine = simpson(g, a, b, SIMPSON_N);
  return { value: fine, error: Math.abs(fine - coarse) / 15 };
}

function sampleGrid(a: number, b: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => a + ((b - a) * index) / (count - 1));
}

export function solveLinearSystem(matrix: number[][], rhs: number[]): number[] {
  const n = rhs.length;
  const m = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row;
    }
    if (Math.abs(m[pivot][col]) < 1e-12)
      throw new Error(
        'Algebraik sistema singulyar yoki yechimga ega emas. Bazis funksiyalarni tekshiring.',
      );
    [m[col], m[pivot]] = [m[pivot], m[col]];
    for (let row = col + 1; row < n; row += 1) {
      const factor = m[row][col] / m[col][col];
      for (let k = col; k <= n; k += 1) m[row][k] -= factor * m[col][k];
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let row = n - 1; row >= 0; row -= 1) {
    let sum = m[row][n];
    for (let k = row + 1; k < n; k += 1) sum -= m[row][k] * x[k];
    x[row] = sum / m[row][row];
  }
  return x;
}

function linearCombinationText(coefficients: number[]): string {
  return coefficients
    .map((c, index) => `${c < 0 ? '-' : '+'} ${formatNumber(Math.abs(c))}*phi${index + 1}(x)`)
    .join(' ');
}

export function solveGalerkin(input: GalerkinInput): GalerkinResult {
  const a = parseNumber(input.a, 'Chap chegara a');
  const b = parseNumber(input.b, 'O‘ng chegara b');
  if (!(a < b)) throw new Error('Integrallash oralig‘ida a < b bo‘lishi kerak.');

  const alpha0 = parseNumber(input.alpha0, 'α₀');
  const alpha1 = parseNumber(input.alpha1, 'α₁');
  const alphaValue = parseNumber(input.alphaValue, 'F_a');
  const beta0 = parseNumber(input.beta0, 'β₀');
  const beta1 = parseNumber(input.beta1, 'β₁');
  const betaValue = parseNumber(input.betaValue, 'F_b');
  if (Math.abs(alpha0) + Math.abs(alpha1) < EPS)
    throw new Error('Chap chegaraviy shartda α₀ yoki α₁ noldan farqli bo‘lishi kerak.');
  if (Math.abs(beta0) + Math.abs(beta1) < EPS)
    throw new Error('O‘ng chegaraviy shartda β₀ yoki β₁ noldan farqli bo‘lishi kerak.');

  const pFn = makeFunction(input.p, 'p(x)');
  const qFn = makeFunction(input.q, 'q(x)');
  const fFn = makeFunction(input.f, 'f(x)');
  const phi0 = makeFunction(input.phi0, 'φ₀(x)');
  const basis = input.basis.map((source, index) =>
    makeFunction(source, `φ${index + 1}(x)`),
  );
  const n = basis.length;
  if (n < 1) throw new Error('Kamida bitta bazis funksiya kiriting.');

  const boundaryLeft = {
    phi0: alpha0 * phi0.value(a) + alpha1 * phi0.d1(a),
    target: alphaValue,
  };
  const boundaryRight = {
    phi0: beta0 * phi0.value(b) + beta1 * phi0.d1(b),
    target: betaValue,
  };
  if (Math.abs(boundaryLeft.phi0 - alphaValue) > 1e-7)
    throw new Error(
      `φ₀(x) chap chegaraviy shartni qanoatlantirmaydi: ${formatNumber(boundaryLeft.phi0)} ≠ ${formatNumber(alphaValue)}.`,
    );
  if (Math.abs(boundaryRight.phi0 - betaValue) > 1e-7)
    throw new Error(
      `φ₀(x) o‘ng chegaraviy shartni qanoatlantirmaydi: ${formatNumber(boundaryRight.phi0)} ≠ ${formatNumber(betaValue)}.`,
    );

  basis.forEach((phi, index) => {
    const left = alpha0 * phi.value(a) + alpha1 * phi.d1(a);
    const right = beta0 * phi.value(b) + beta1 * phi.d1(b);
    if (Math.abs(left) > 1e-7 || Math.abs(right) > 1e-7)
      throw new Error(
        `φ${index + 1}(x) bir jinsli chegaraviy shartlarni qanoatlantirmaydi (chap: ${formatNumber(left)}, o‘ng: ${formatNumber(right)}).`,
      );
  });

  const operator = (u: { value: (x: number) => number; d1: (x: number) => number; d2: (x: number) => number }) =>
    (x: number) =>
      u.d2(x) + pFn.value(x) * u.d1(x) + qFn.value(x) * u.value(x);
  const opPhi0 = operator(phi0);
  const opBasis = basis.map((phi) => operator(phi));

  const matrix: number[][] = [];
  const integrals: GalerkinIntegral[] = [];
  for (let k = 0; k < n; k += 1) {
    const row: number[] = [];
    for (let i = 0; i < n; i += 1) {
      const integrand = (x: number) => basis[k].value(x) * opBasis[i](x);
      const { value, error } = integrate(integrand, a, b);
      row.push(value);
      integrals.push({
        name: `a_{${k + 1}${i + 1}}`,
        row: k,
        col: i,
        integrandTex: `\\varphi_{${k + 1}}(x)\\left[\\varphi_{${i + 1}}''+p(x)\\varphi_{${i + 1}}'+q(x)\\varphi_{${i + 1}}\\right]`,
        samples: sampleGrid(a, b, 5).map((x) => ({ x, value: integrand(x) })),
        value,
        error,
      });
    }
    matrix.push(row);
  }

  const rhs: number[] = [];
  for (let k = 0; k < n; k += 1) {
    const integrand = (x: number) => basis[k].value(x) * (fFn.value(x) - opPhi0(x));
    const { value, error } = integrate(integrand, a, b);
    rhs.push(value);
    integrals.push({
      name: `b_{${k + 1}}`,
      row: k,
      col: -1,
      integrandTex: `\\varphi_{${k + 1}}(x)\\left[f(x)-L(\\varphi_0)\\right]`,
      samples: sampleGrid(a, b, 5).map((x) => ({ x, value: integrand(x) })),
      value,
      error,
    });
  }

  const coefficients = solveLinearSystem(matrix, rhs);

  const uOf = (x: number) =>
    phi0.value(x) + coefficients.reduce((s, c, i) => s + c * basis[i].value(x), 0);
  const d1Of = (x: number) =>
    phi0.d1(x) + coefficients.reduce((s, c, i) => s + c * basis[i].d1(x), 0);
  const d2Of = (x: number) =>
    phi0.d2(x) + coefficients.reduce((s, c, i) => s + c * basis[i].d2(x), 0);
  const residualAt = (x: number) =>
    d2Of(x) + pFn.value(x) * d1Of(x) + qFn.value(x) * uOf(x) - fFn.value(x);

  const orthogonality = basis.map((phi) => {
    const { value } = integrate((x) => phi.value(x) * residualAt(x), a, b);
    return value;
  });

  const grid = sampleGrid(a, b, SAMPLE_COUNT);
  const samples = grid.map((x) => ({ x, u: uOf(x), residual: residualAt(x) }));
  const residualMax = samples.reduce((m, s) => Math.max(m, Math.abs(s.residual)), 0);

  const boundaryErrors = {
    left: alpha0 * uOf(a) + alpha1 * d1Of(a) - alphaValue,
    right: beta0 * uOf(b) + beta1 * d1Of(b) - betaValue,
  };

  const terms = basis.map((phi, i) => `${texNumber(coefficients[i])}\\,${phi.tex}`);
  const finalTex = `u_n(x)=${phi0.tex}${coefficients
    .map((c, i) => `${c < 0 ? '-' : '+'}${texNumber(Math.abs(c))}\\,${basis[i].tex}`)
    .join('')}`;

  return {
    operatorTex: `u''+(${pFn.tex})u'+(${qFn.tex})u=${fFn.tex}`,
    phi0,
    basis,
    pTex: pFn.tex,
    qTex: qFn.tex,
    fTex: fFn.tex,
    boundaryLeft,
    boundaryRight,
    approximationTex: `u_n(x)=${phi0.tex}+${terms.join('+').replace(/\+-/g, '-')}`,
    integrals,
    matrix,
    rhs,
    coefficients,
    finalTex,
    solutionText: linearCombinationText(coefficients),
    residualMax,
    orthogonality,
    boundaryErrors,
    samples,
    method: 'adaptive-simpson',
  };
}
