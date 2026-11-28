import { expandImplicitCalls, math } from '@/lib/math';
import type { MathNode } from 'mathjs';

export interface GalerkinInput {
  a2: string;
  a1: string;
  a0: string;
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
  // Blackboard method: basis need not vanish at the boundary (boundary may not hold exactly)
  allowNonHomogeneousBasis?: boolean;
  // Number of basis functions to generate automatically when no template is given
  autoCount?: number;
}

export interface TexTerm {
  tex: string;
  // Safe to put before u′ without brackets: x, 2, cos(x), x^{2}
  atomic: boolean;
}

export interface GalerkinFunction extends TexTerm {
  text: string;
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
  operatorLhsTex: string;
  phi0: GalerkinFunction;
  basis: GalerkinFunction[];
  a2Tex: string;
  a1Tex: string;
  a0Tex: string;
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

// Errors carry a code and parameters; the UI translates them (galerkin.errors.<code>)
export type GalerkinErrorCode =
  | 'empty'
  | 'parse'
  | 'unknownSymbol'
  | 'notFinite'
  | 'notNumber'
  | 'intervalOrder'
  | 'alphaZero'
  | 'betaZero'
  | 'degenerate'
  | 'singular'
  | 'phi0Left'
  | 'phi0Right'
  | 'basisBoundary'
  | 'noBasis';

export class GalerkinError extends Error {
  readonly code: GalerkinErrorCode;
  readonly params: Record<string, string | number>;

  constructor(code: GalerkinErrorCode, params: Record<string, string | number> = {}) {
    super(code);
    this.code = code;
    this.params = params;
  }
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

// Accept cosx, Pi, PI as well as cos(x) and pi (implicit calls are shared in lib/math)
function normalizeInput(source: string): string {
  return expandImplicitCalls(source).replace(/\bpi\b/gi, 'pi');
}

const ATOMIC_NODES = new Set(['SymbolNode', 'ConstantNode', 'FunctionNode', 'ParenthesisNode']);

// mathjs wraps arguments in \left( … \right); plain brackets read better: \cos(x)
function cleanTex(tex: string): string {
  return tex
    .replace(/\\left\(\s*/g, '(')
    .replace(/\s*\\right\)/g, ')')
    .replace(/\{\s+/g, '{')
    .replace(/\s+\}/g, '}')
    // mathjs marks implicit multiplication (2 x) with ~
    .replace(/\s*~\s*/g, '\\,')
    .replace(/\s+/g, ' ')
    .trim();
}

function texTerm(node: MathNode): TexTerm {
  const atomic = ATOMIC_NODES.has(node.type) || ('op' in node && node.op === '^');
  return { tex: cleanTex(node.toTex()), atomic };
}

// Legendre polynomials P0, P1, … in t, where t maps [a, b] to [-1, 1]
const LEGENDRE = [
  '1',
  't',
  '(3*t^2-1)/2',
  '(5*t^3-3*t)/2',
  '(35*t^4-30*t^2+3)/8',
  '(63*t^5-70*t^3+15*t)/8',
  '(231*t^6-315*t^4+105*t^2-5)/16',
  '(429*t^7-693*t^5+315*t^3-35*t)/16',
];

// Legendre-type basis: φᵢ = (x − a)(b − x)·P_{i−1}(t). The factor makes every φᵢ
// vanish at both ends, so the basis fits Dirichlet conditions.
export function legendreBasis(a: string, b: string, count: number): string[] {
  const t = `((2*x-(${a})-(${b}))/((${b})-(${a})))`;
  return LEGENDRE.slice(0, count).map(
    (p) => `((x-(${a}))*((${b})-x))*${p.split('t').join(t)}`,
  );
}

export function exprTex(source: string): TexTerm {
  return texTerm(math.parse(normalizeInput(source.trim())));
}

// Left side of L(u): unit coefficients and zero terms are not shown,
// e.g. u'' + x^{2}u' + \left(-x\right)u
export function operatorLhsTex(a2: TexTerm, a1: TexTerm, a0: TexTerm): string {
  const parts = [operatorPart(a2, "u''"), operatorPart(a1, "u'"), operatorPart(a0, 'u')].filter(
    (part): part is string => part !== null,
  );
  return parts.length > 0 ? parts.join(' + ') : '0';
}

function operatorPart(term: TexTerm, derivative: string): string | null {
  if (term.tex === '0') return null;
  const coefficient =
    term.tex === '1' ? '' : term.atomic ? term.tex : `\\left(${term.tex}\\right)`;
  return `${coefficient}${derivative}`;
}

function parseOrThrow(source: string, label: string): MathNode {
  const text = normalizeInput(source.trim());
  if (!text) throw new GalerkinError('empty', { label });
  let node: MathNode;
  try {
    node = math.parse(text);
  } catch {
    throw new GalerkinError('parse', { label, text });
  }
  node.traverse((child) => {
    if (child.type !== 'SymbolNode') return;
    const name = (child as unknown as { name: string }).name;
    const isFunctionName = name in math && typeof Reflect.get(math, name) === 'function';
    if (ALLOWED_SYMBOLS.has(name) || (isFunctionName && !FORBIDDEN_FUNCTIONS.has(name)))
      return;
    if (name in math && !isFunctionName) return;
    throw new GalerkinError('unknownSymbol', { label, name });
  });
  return node;
}

function toScalar(value: unknown, label: string, x: number): number {
  const result = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(result))
    throw new GalerkinError('notFinite', { label, x: formatNumber(x) });
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
  const term = texTerm(node);
  return {
    text: node.toString(),
    tex: term.tex,
    atomic: term.atomic,
    d1Text: d1Node.toString(),
    d1Tex: cleanTex(d1Node.toTex()),
    d2Text: d2Node.toString(),
    d2Tex: cleanTex(d2Node.toTex()),
    value: evalAt(compiled),
    d1: evalAt(compiledD1),
    d2: evalAt(compiledD2),
  };
}

function parseNumber(value: string, label: string): number {
  if (!value.trim()) throw new GalerkinError('empty', { label });
  try {
    const result = Number(math.evaluate(normalizeInput(value.trim())));
    if (!Number.isFinite(result)) throw new Error();
    return result;
  } catch {
    throw new GalerkinError('notNumber', { label });
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
    if (Math.abs(m[pivot][col]) < 1e-12) throw new GalerkinError('singular');
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
  const a = parseNumber(input.a, 'a');
  const b = parseNumber(input.b, 'b');
  if (!(a < b)) throw new GalerkinError('intervalOrder');

  const alpha0 = parseNumber(input.alpha0, 'α₀');
  const alpha1 = parseNumber(input.alpha1, 'α₁');
  const alphaValue = parseNumber(input.alphaValue, 'u(a)');
  const beta0 = parseNumber(input.beta0, 'β₀');
  const beta1 = parseNumber(input.beta1, 'β₁');
  const betaValue = parseNumber(input.betaValue, 'u(b)');
  if (Math.abs(alpha0) + Math.abs(alpha1) < EPS) throw new GalerkinError('alphaZero');
  if (Math.abs(beta0) + Math.abs(beta1) < EPS) throw new GalerkinError('betaZero');

  // Empty coefficients have defaults: u'' -> 1, the others -> 0
  const a2Fn = makeFunction(input.a2.trim() || '1', 'a₂(x)');
  const a1Fn = makeFunction(input.a1.trim() || '0', 'a₁(x)');
  const a0Fn = makeFunction(input.a0.trim() || '0', 'a₀(x)');
  const fFn = makeFunction(input.f.trim() || '0', 'f(x)');
  // Linear function l(x) = c0 + c1*(x - a) whose boundary functionals equal
  // (targetA, targetB): alpha0*l(a)+alpha1*l'(a) and beta0*l(b)+beta1*l'(b).
  // Works for Dirichlet, Robin and mixed conditions.
  const linearFor = (targetA: number, targetB: number) => {
    const betaSlope = beta0 * (b - a) + beta1;
    const det = alpha0 * betaSlope - alpha1 * beta0;
    if (Math.abs(det) < EPS) throw new GalerkinError('degenerate');
    return {
      c0: (targetA * betaSlope - alpha1 * targetB) / det,
      c1: (alpha0 * targetB - beta0 * targetA) / det,
    };
  };

  // phi0: if empty, a linear function that satisfies both boundary conditions
  let phi0Source = input.phi0.trim();
  if (!phi0Source) {
    const { c0, c1 } = linearFor(alphaValue, betaValue);
    phi0Source = `(${c0}) + (${c1})*(x - (${a}))`;
  }
  const phi0 = makeFunction(phi0Source, 'φ₀(x)');

  // Basis: if no template is given, build n functions (x-a)^i minus a linear
  // correction, so that every basis function satisfies the homogeneous conditions.
  const autoCount = input.basis.length === 0 ? (input.autoCount ?? 0) : 0;
  const generated = Array.from({ length: autoCount }, (_, k) => {
    const i = k + 1;
    // Powers start at 2 so the basis is not cancelled by its own linear correction
    const pAt = (x: number) => (x - a) ** (i + 1);
    const dAt = (x: number) => (i + 1) * (x - a) ** i;
    const gammaA = alpha0 * pAt(a) + alpha1 * dAt(a);
    const gammaB = beta0 * pAt(b) + beta1 * dAt(b);
    const { c0, c1 } = linearFor(gammaA, gammaB);
    return `(x - (${a}))^${i + 1} - ((${c0}) + (${c1})*(x - (${a})))`;
  });
  const basisSources = input.basis.length > 0 ? input.basis : generated;
  const basis = basisSources.map((source, index) =>
    makeFunction(source, `φ${index + 1}(x)`),
  );
  const n = basis.length;
  if (n < 1) throw new GalerkinError('noBasis');

  const boundaryLeft = {
    phi0: alpha0 * phi0.value(a) + alpha1 * phi0.d1(a),
    target: alphaValue,
  };
  const boundaryRight = {
    phi0: beta0 * phi0.value(b) + beta1 * phi0.d1(b),
    target: betaValue,
  };
  if (Math.abs(boundaryLeft.phi0 - alphaValue) > 1e-7)
    throw new GalerkinError('phi0Left', {
      value: formatNumber(boundaryLeft.phi0),
      target: formatNumber(alphaValue),
    });
  if (Math.abs(boundaryRight.phi0 - betaValue) > 1e-7)
    throw new GalerkinError('phi0Right', {
      value: formatNumber(boundaryRight.phi0),
      target: formatNumber(betaValue),
    });

  basis.forEach((phi, index) => {
    const left = alpha0 * phi.value(a) + alpha1 * phi.d1(a);
    const right = beta0 * phi.value(b) + beta1 * phi.d1(b);
    if (!input.allowNonHomogeneousBasis && (Math.abs(left) > 1e-7 || Math.abs(right) > 1e-7))
      throw new GalerkinError('basisBoundary', {
        index: index + 1,
        left: formatNumber(left),
        right: formatNumber(right),
      });
  });

  const operator = (u: { value: (x: number) => number; d1: (x: number) => number; d2: (x: number) => number }) =>
    (x: number) =>
      a2Fn.value(x) * u.d2(x) + a1Fn.value(x) * u.d1(x) + a0Fn.value(x) * u.value(x);
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
        integrandTex: `\\varphi_{${k + 1}}(x)\\left[a_2(x)\\varphi_{${i + 1}}''+a_1(x)\\varphi_{${i + 1}}'+a_0(x)\\varphi_{${i + 1}}\\right]`,
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
    a2Fn.value(x) * d2Of(x) + a1Fn.value(x) * d1Of(x) + a0Fn.value(x) * uOf(x) - fFn.value(x);

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

  const terms = basis.map((phi, i) => {
    const c = coefficients[i];
    return `${c < 0 ? '-' : '+'}${texNumber(Math.abs(c))}\\,${phi.tex}`;
  });
  const finalTex = `u_n(x)=${phi0.tex}${coefficients
    .map((c, i) => `${c < 0 ? '-' : '+'}${texNumber(Math.abs(c))}\\,${basis[i].tex}`)
    .join('')}`;

  const lhsTex = operatorLhsTex(a2Fn, a1Fn, a0Fn);
  return {
    operatorTex: `${lhsTex}=${fFn.tex}`,
    operatorLhsTex: lhsTex,
    phi0,
    basis,
    a2Tex: a2Fn.tex,
    a1Tex: a1Fn.tex,
    a0Tex: a0Fn.tex,
    fTex: fFn.tex,
    boundaryLeft,
    boundaryRight,
    approximationTex: `u_n(x)=${phi0.tex}${terms.join('')}`,
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
