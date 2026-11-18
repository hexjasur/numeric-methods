import { math, normalizeExpression } from '@/lib/math';

export interface CollocationInput { p: string; q: string; f: string; a: string; b: string; alpha0: string; alpha1: string; alphaValue: string; beta0: string; beta1: string; betaValue: string; n: number; points: string[]; }
export interface CollocationBasis { index: number; expression: string; derivative: string; secondDerivative: string; }
export interface CollocationEquation { x: number; exactX: string; coefficients: number[]; rhs: number; residualExpression: string; }
export interface CollocationResult { input: CollocationInput; phi0: string; basis: CollocationBasis[]; approximation: string; derivative: string; secondDerivative: string; residual: string; equations: CollocationEquation[]; coefficients: number[]; finalSolution: string; samples: Array<{ x: number; value: number }>; }

const EPSILON = 1e-10;

function numeric(expression: string, x: number): number {
  const value = math.evaluate(normalizeExpression(expression), { x });
  const result = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(result)) throw new Error(`Ifoda x=${x} nuqtada chekli qiymat bermadi.`);
  return result;
}

function parseNumber(value: string, label: string): number {
  try { const result = Number(math.evaluate(value)); if (!Number.isFinite(result)) throw new Error(); return result; }
  catch { throw new Error(`${label} uchun son yoki kasr kiriting.`); }
}

export function texNumber(value: number): string {
  if (Math.abs(value) < EPSILON) return '0';
  const sign = value < 0 ? '-' : '';
  let numerator = Math.round(Math.abs(value)); let denominator = 1;
  let bestError = Math.abs(Math.abs(value) - numerator);
  for (let d = 1; d <= 4096; d += 1) {
    const n = Math.round(Math.abs(value) * d); const error = Math.abs(Math.abs(value) - n / d);
    if (error < bestError) { numerator = n; denominator = d; bestError = error; }
    if (error < 1e-9) break;
  }
  return `${sign}${denominator === 1 ? numerator : `\\frac{${numerator}}{${denominator}}`}`;
}

function binomial(n: number, k: number): number { let result = 1; for (let i = 1; i <= k; i += 1) result *= (n - i + 1) / i; return result; }
function derivativeCoefficients(coefficients: number[]): number[] { return coefficients.slice(1).map((coefficient, index) => coefficient * (index + 1)); }
function basisCoefficients(power: number, left: number, right: number): number[] {
  const coefficients = Array<number>(power + 2).fill(0);
  for (let k = 0; k <= power; k += 1) {
    const shifted = binomial(power, k) * (-left) ** (power - k);
    coefficients[k] += right * shifted; coefficients[k + 1] -= shifted;
  }
  return coefficients;
}
function polynomialExpression(coefficients: number[]): string {
  const terms: string[] = [];
  for (let index = coefficients.length - 1; index >= 0; index -= 1) {
    const coefficient = coefficients[index]; if (Math.abs(coefficient) < EPSILON) continue;
    const magnitude = Math.abs(coefficient);
    const factor = Math.abs(magnitude - 1) < EPSILON && index > 0 ? '' : texNumber(magnitude);
    const variable = index === 0 ? '' : index === 1 ? 'x' : `x^${index}`;
    terms.push(`${coefficient < 0 ? '-' : terms.length ? '+' : ''}${factor}${variable}`);
  }
  return terms.join(' ') || '0';
}
function expressionTex(expression: string): string {
  try { return math.parse(normalizeExpression(expression)).toTex(); }
  catch { return expression.replaceAll('*', '\\,'); }
}
function simplifiedExpression(expression: string): string {
  try { return math.simplify(normalizeExpression(expression)).toString(); }
  catch { return expression; }
}
function polynomialSum(constant: string, terms: Array<{ coefficient: number; variable: string }>): string {
  const pieces = terms.map(({ coefficient, variable }) => {
    if (Math.abs(coefficient) < EPSILON) return '';
    const magnitude = Math.abs(coefficient); const factor = Math.abs(magnitude - 1) < EPSILON ? '' : texNumber(magnitude);
    return `${coefficient < 0 ? '-' : '+'}${factor}${variable}`;
  }).filter(Boolean);
  return [constant && constant !== '0' ? constant : '', ...pieces].filter(Boolean).join(' ').replace(/^\+/, '') || '0';
}

function solveGauss(matrix: number[][], vector: number[]): number[] {
  const n = vector.length; const augmented = matrix.map((row, i) => [...row, vector[i]]);
  for (let column = 0; column < n; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < n; row += 1) if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    if (Math.abs(augmented[pivot][column]) < EPSILON) throw new Error('Kollokatsiya sistemasi singulyar: boshqa nuqtalar yoki n qiymatini tanlang.');
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    for (let row = column + 1; row < n; row += 1) { const factor = augmented[row][column] / augmented[column][column]; for (let k = column; k <= n; k += 1) augmented[row][k] -= factor * augmented[column][k]; }
  }
  const result = Array<number>(n).fill(0);
  for (let row = n - 1; row >= 0; row -= 1) { let value = augmented[row][n]; for (let column = row + 1; column < n; column += 1) value -= augmented[row][column] * result[column]; result[row] = value / augmented[row][row]; }
  return result;
}

export function solveCollocation(input: CollocationInput): CollocationResult {
  const a = parseNumber(input.a, 'a'); const b = parseNumber(input.b, 'b');
  const alpha0 = parseNumber(input.alpha0, 'α₀'); const alpha1 = parseNumber(input.alpha1, 'α₁'); const beta0 = parseNumber(input.beta0, 'β₀'); const beta1 = parseNumber(input.beta1, 'β₁');
  const leftValue = parseNumber(input.alphaValue, 'A'); const rightValue = parseNumber(input.betaValue, 'B');
  if (!(a < b)) throw new Error('a < b bo‘lishi kerak.');
  if (input.n < 2 || input.n > 6) throw new Error('n 2 dan 6 gacha bo‘lishi kerak.');
  if (Math.abs(alpha1) > EPSILON || Math.abs(beta1) > EPSILON || Math.abs(alpha0) < EPSILON || Math.abs(beta0) < EPSILON) throw new Error('Hozircha bazis funksiyalar Dirixle shartlarini talab qiladi: α₁=β₁=0 va α₀,β₀≠0.');
  const left = leftValue / alpha0; const right = rightValue / beta0;
  const pointValues = input.points.map((point) => parseNumber(point, 'Kollokatsiya nuqtasi'));
  if (pointValues.length !== input.n || pointValues.some((x) => !(x > a && x < b))) throw new Error('Barcha kollokatsiya nuqtalari (a,b) ichida va n ta bo‘lishi kerak.');

  const basis: CollocationBasis[] = Array.from({ length: input.n }, (_, index) => {
    const coefficients = basisCoefficients(index + 1, a, b); const first = derivativeCoefficients(coefficients); const second = derivativeCoefficients(first);
    return { index: index + 1, expression: polynomialExpression(coefficients), derivative: polynomialExpression(first), secondDerivative: polynomialExpression(second) };
  });
  const slope = (right - left) / (b - a); const intercept = left - slope * a;
  const phi0 = polynomialExpression([intercept, slope]); const phi0Derivative = texNumber(slope); const phi0SecondDerivative = '0';
  const approximation = `\\tilde{u}(x) = ${phi0} + ${basis.map((item) => `C_${item.index}\\,(${item.expression})`).join(' + ')}`;
  const derivative = `\\tilde{u}'(x) = ${phi0Derivative} + ${basis.map((item) => `C_${item.index}\\,(${item.derivative})`).join(' + ')}`;
  const secondDerivative = `\\tilde{u}''(x) = ${phi0SecondDerivative} + ${basis.map((item) => `C_${item.index}\\,(${item.secondDerivative})`).join(' + ')}`;
  const residualConstant = expressionTex(simplifiedExpression(`${phi0SecondDerivative} + (${input.p})*(${phi0Derivative}) + (${input.q})*(${phi0}) - (${input.f})`));
  const residualTerms = basis.map((item) => {
    const coefficient = simplifiedExpression(`${item.secondDerivative} + (${input.p})*(${item.derivative}) + (${input.q})*(${item.expression})`);
    return `C_${item.index}\\left(${expressionTex(coefficient)}\\right)`;
  }).join(' + ');
  const equations = pointValues.map((x, rowIndex) => {
    const constant = numeric(phi0SecondDerivative, x) + numeric(input.p, x) * numeric(phi0Derivative, x) + numeric(input.q, x) * numeric(phi0, x) - numeric(input.f, x);
    const coefficients = basis.map((item) => numeric(item.secondDerivative, x) + numeric(input.p, x) * numeric(item.derivative, x) + numeric(input.q, x) * numeric(item.expression, x));
    return { x, exactX: input.points[rowIndex], coefficients, rhs: -constant, residualExpression: `${polynomialSum(texNumber(constant), coefficients.map((value, index) => ({ coefficient: value, variable: `C_${index + 1}` })))} = 0` };
  });
  const coefficients = solveGauss(equations.map((row) => row.coefficients), equations.map((row) => row.rhs));
  const finalSolution = `\\tilde{u}(x) = ${phi0} + ${coefficients.map((value, index) => `${texNumber(value)}\\,(${basis[index].expression})`).join(' + ')}`;
  const samples = Array.from({ length: 41 }, (_, index) => { const x = a + ((b - a) * index) / 40; const value = numeric(phi0, x) + basis.reduce((sum, item, basisIndex) => sum + coefficients[basisIndex] * numeric(item.expression, x), 0); return { x, value }; });
  return { input, phi0, basis, approximation, derivative, secondDerivative, residual: `R(x,C_1,\\ldots,C_${input.n}) = ${residualConstant} + ${residualTerms}`, equations, coefficients, finalSolution, samples };
}
