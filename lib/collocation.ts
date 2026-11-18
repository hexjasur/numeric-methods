import { math, normalizeExpression } from '@/lib/math';

export interface CollocationInput { a2: string; a1: string; a0: string; f: string; a: string; b: string; alpha0: string; alpha1: string; alphaValue: string; beta0: string; beta1: string; betaValue: string; n: number; points: string[]; }
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

function derivativeCoefficients(coefficients: number[]): number[] { return coefficients.slice(1).map((coefficient, index) => coefficient * (index + 1)); }
function polynomialValue(coefficients: number[], x: number): number {
  return coefficients.reduce((sum, coefficient, index) => sum + coefficient * x ** index, 0);
}
function boundaryValue(coefficients: number[], x: number, coefficient0: number, coefficient1: number): number {
  return coefficient0 * polynomialValue(coefficients, x) + coefficient1 * polynomialValue(derivativeCoefficients(coefficients), x);
}
function solveBoundaryPair(left0: number, left1: number, right0: number, right1: number, leftValue: number, rightValue: number): number[] {
  const determinant = left0 * right1 - left1 * right0;
  if (Math.abs(determinant) < EPSILON) throw new Error('Chegaraviy shartlar mustaqil emas: α va β koeffitsiyentlarini tekshiring.');
  return [(leftValue * right1 - left1 * rightValue) / determinant, (left0 * rightValue - leftValue * right0) / determinant];
}
function subtractScaled(target: number[], source: number[], scale: number): number[] {
  const result = [...target];
  source.forEach((coefficient, index) => { result[index] = (result[index] ?? 0) - scale * coefficient; });
  return result;
}
function homogeneousBasis(power: number, a: number, b: number, alpha0: number, alpha1: number, beta0: number, beta1: number, leftProjector: number[], rightProjector: number[]): number[] {
  const raw = Array<number>(power + 1).fill(0); raw[power] = 1;
  return subtractScaled(subtractScaled(raw, leftProjector, boundaryValue(raw, a, alpha0, alpha1)), rightProjector, boundaryValue(raw, b, beta0, beta1));
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
    const multiplication = factor ? `${factor}\\cdot ` : '';
    return `${coefficient < 0 ? '-' : '+'}${multiplication}${variable}`;
  }).filter(Boolean);
  return [constant && constant !== '0' ? constant : '', ...pieces].filter(Boolean).join(' ').replace(/^\+/, '') || '0';
}

function joinFormulaTerms(base: string, terms: string[]): string {
  let result = base === '0' ? '' : base;
  terms.filter(Boolean).forEach((term) => {
    const normalized = term.startsWith('+ ') ? term.slice(2) : term;
    result += result ? (normalized.startsWith('-') ? ` ${normalized}` : ` + ${normalized}`) : normalized;
  });
  return result || '0';
}

function signedCoefficientTerm(coefficient: number, expression: string): string {
  if (Math.abs(coefficient) < EPSILON) return '';
  const magnitude = texNumber(Math.abs(coefficient));
  return `${coefficient < 0 ? '-' : '+'} ${magnitude}\\cdot\\left(${expression}\\right)`;
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
  const leftMatrix0 = alpha0;
  const leftMatrix1 = alpha0 * a + alpha1;
  const rightMatrix0 = beta0;
  const rightMatrix1 = beta0 * b + beta1;
  const phi0Coefficients = solveBoundaryPair(leftMatrix0, leftMatrix1, rightMatrix0, rightMatrix1, leftValue, rightValue);
  const leftProjector = solveBoundaryPair(leftMatrix0, leftMatrix1, rightMatrix0, rightMatrix1, 1, 0);
  const rightProjector = solveBoundaryPair(leftMatrix0, leftMatrix1, rightMatrix0, rightMatrix1, 0, 1);
  const pointValues = input.points.map((point) => parseNumber(point, 'Kollokatsiya nuqtasi'));
  if (pointValues.length !== input.n || pointValues.some((x) => !(x > a && x < b))) throw new Error('Barcha kollokatsiya nuqtalari (a,b) ichida va n ta bo‘lishi kerak.');
  if (pointValues.some((x) => Math.abs(numeric(input.a2, x)) < EPSILON)) throw new Error('A₂(x) kollokatsiya nuqtalarida nol bo‘lmasligi kerak.');

  const basis: CollocationBasis[] = Array.from({ length: input.n }, (_, index) => {
    const coefficients = homogeneousBasis(index + 2, a, b, alpha0, alpha1, beta0, beta1, leftProjector, rightProjector);
    const first = derivativeCoefficients(coefficients); const second = derivativeCoefficients(first);
    return { index: index + 1, expression: polynomialExpression(coefficients), derivative: polynomialExpression(first), secondDerivative: polynomialExpression(second) };
  });
  const phi0 = polynomialExpression(phi0Coefficients);
  const phi0Derivative = polynomialExpression(derivativeCoefficients(phi0Coefficients));
  const phi0SecondDerivative = polynomialExpression(derivativeCoefficients(derivativeCoefficients(phi0Coefficients)));
  const approximation = `\\tilde{u}(x) = ${joinFormulaTerms(phi0, basis.map((item) => `C_${item.index}\\cdot\\left(${item.expression}\\right)`))}`;
  const derivative = `\\tilde{u}'(x) = ${joinFormulaTerms(phi0Derivative, basis.map((item) => `C_${item.index}\\cdot\\left(${item.derivative}\\right)`))}`;
  const secondDerivative = `\\tilde{u}''(x) = ${joinFormulaTerms(phi0SecondDerivative, basis.map((item) => `C_${item.index}\\cdot\\left(${item.secondDerivative}\\right)`))}`;
  const residualConstant = expressionTex(simplifiedExpression(`(${input.a2})*(${phi0SecondDerivative}) + (${input.a1})*(${phi0Derivative}) + (${input.a0})*(${phi0}) - (${input.f})`));
  const residualTerms = basis.map((item) => {
    const coefficient = simplifiedExpression(`(${input.a2})*(${item.secondDerivative}) + (${input.a1})*(${item.derivative}) + (${input.a0})*(${item.expression})`);
    return `C_${item.index}\\cdot\\left(${expressionTex(coefficient)}\\right)`;
  }).join(' + ');
  const equations = pointValues.map((x, rowIndex) => {
    const constant = numeric(input.a2, x) * numeric(phi0SecondDerivative, x) + numeric(input.a1, x) * numeric(phi0Derivative, x) + numeric(input.a0, x) * numeric(phi0, x) - numeric(input.f, x);
    const coefficients = basis.map((item) => numeric(input.a2, x) * numeric(item.secondDerivative, x) + numeric(input.a1, x) * numeric(item.derivative, x) + numeric(input.a0, x) * numeric(item.expression, x));
    return { x, exactX: input.points[rowIndex], coefficients, rhs: -constant, residualExpression: `${polynomialSum(texNumber(constant), coefficients.map((value, index) => ({ coefficient: value, variable: `C_${index + 1}` })))} = 0` };
  });
  const coefficients = solveGauss(equations.map((row) => row.coefficients), equations.map((row) => row.rhs));
  const finalSolution = `\\tilde{u}(x) = ${joinFormulaTerms(phi0, coefficients.map((value, index) => signedCoefficientTerm(value, basis[index].expression)).filter(Boolean).map((term) => term.startsWith('+ ') ? term.slice(2) : term))}`;
  const samples = Array.from({ length: 41 }, (_, index) => { const x = a + ((b - a) * index) / 40; const value = numeric(phi0, x) + basis.reduce((sum, item, basisIndex) => sum + coefficients[basisIndex] * numeric(item.expression, x), 0); return { x, value }; });
  return { input, phi0, basis, approximation, derivative, secondDerivative, residual: `R(x,C_1,\\ldots,C_${input.n}) = ${residualConstant} + ${residualTerms}`, equations, coefficients, finalSolution, samples };
}
