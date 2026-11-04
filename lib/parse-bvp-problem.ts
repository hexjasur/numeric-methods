import type { BvpInput } from '@/lib/bvp-finite-difference';

function decimal(value: string): number {
  return Number(value.trim().replace(',', '.'));
}

function normalizeExpression(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/,(?=\d)/g, '.');
}

function parseBoundary(line: string): { x: number; y: number; derivative: number; rhs: number } | null {
  const [leftRaw, rightRaw, ...extra] = line.split('=');
  if (!leftRaw || rightRaw === undefined || extra.length) return null;
  const left = leftRaw.replace(/[′’]/g, "'");
  const pattern = /([+-]?\s*(?:(?:\d+(?:[.,]\d+)?)\s*\*?\s*)?)y\s*('?)\s*\(\s*(\d+(?:[.,]\d+)?)\s*\)/g;
  let point: number | null = null;
  let y = 0;
  let derivative = 0;
  let consumed = '';
  for (const match of left.matchAll(pattern)) {
    const x = decimal(match[3]);
    if (!Number.isFinite(x)) throw new Error('Chegara shartidagi nuqta son bo‘lishi kerak.');
    if (point !== null && Math.abs(point - x) > 1e-10) {
      throw new Error('Har bir chegaraviy shart bitta x nuqtada berilishi kerak.');
    }
    point = x;
    const rawCoefficient = match[1].replace(/\s|\*/g, '');
    const coefficient = rawCoefficient === '' || rawCoefficient === '+' ? 1 : rawCoefficient === '-' ? -1 : decimal(rawCoefficient);
    if (!Number.isFinite(coefficient)) throw new Error('Chegara shartidagi koeffitsiyentni tushunib bo‘lmadi.');
    if (match[2]) derivative += coefficient;
    else y += coefficient;
    consumed += match[0];
  }
  if (point === null) return null;
  const remainder = left.replace(pattern, '').replace(/[+\-\s*]/g, '');
  if (remainder) throw new Error(`Chegara shartining ifodasini tushunib bo‘lmadi: ${line}`);
  const rhs = decimal(normalizeExpression(rightRaw));
  if (!Number.isFinite(rhs)) throw new Error('Chegara shartining o‘ng tomoni son bo‘lishi kerak.');
  if (y === 0 && derivative === 0) throw new Error('Chegara shartida y yoki y′ koeffitsiyenti bo‘lishi kerak.');
  return { x: point, y, derivative, rhs };
}

function splitTerms(expression: string): string[] {
  return expression.replace(/\s+/g, '').replace(/\-/g, '+-').split('+').filter(Boolean);
}

function coefficientOf(term: string, marker: string): string {
  const markerIndex = term.indexOf(marker);
  const raw = term.slice(0, markerIndex).replace(/\*+$/g, '');
  if (raw === '' || raw === '+') return '1';
  if (raw === '-') return '-1';
  return raw.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
}

function parseOde(line: string): { p: string; q: string; f: string } {
  const normalized = line
    .replace(/[′’]/g, "'")
    .replace(/[″“”]/g, "''")
    .replace(/\s+/g, ' ');
  const equation = normalized.split('=');
  if (equation.length !== 2 || !equation[0].includes("''")) {
    throw new Error('Differensial tenglamani y″ + P(x)y′ + Q(x)y = f(x) ko‘rinishida kiriting.');
  }
  const lhs = equation[0].replace(/y\s*''/g, '').trim();
  const pTerms: string[] = [];
  const qTerms: string[] = [];
  for (const term of splitTerms(lhs)) {
    if (term.includes("y'")) pTerms.push(coefficientOf(term, "y'"));
    else if (term.includes('y')) qTerms.push(coefficientOf(term, 'y'));
    else if (term) throw new Error(`Tenglamadagi qo‘shimcha hadni ajratib bo‘lmadi: ${term}`);
  }
  const rhs = normalizeExpression(equation[1]);
  if (!rhs) throw new Error('Tenglamaning o‘ng tomoni bo‘sh qolmasligi kerak.');
  return { p: pTerms.join(' + ').replace(/\+ -/g, '- ') || '0', q: qTerms.join(' + ').replace(/\+ -/g, '- ') || '0', f: rhs };
}

export function parseBvpProblem(text: string, current: BvpInput): BvpInput {
  const lines = text.split(/[\n;]/).map((line) => line.trim()).filter(Boolean);
  const stepLine = text.match(/\bh\s*=\s*(\d+(?:[.,]\d+)?)/i);
  if (!stepLine) throw new Error('Qadamni h = 0.1 ko‘rinishida kiriting.');
  const h = decimal(stepLine[1]);
  if (!Number.isFinite(h) || h <= 0) throw new Error('h musbat son bo‘lishi kerak.');

  const odeLine = lines.find((line) => /y\s*[′’]{2}|y\s*''/.test(line));
  if (!odeLine) throw new Error('Ikkinchi tartibli tenglamani kiriting (masalan: y″ - x y′ + 2x y = 0.8).');
  const ode = parseOde(odeLine);
  const boundaries = lines.map((line) => parseBoundary(line)).filter((item) => item !== null);
  if (boundaries.length !== 2) throw new Error('Chap va o‘ng chegaraviy shartlarni alohida kiriting.');
  const [first, second] = boundaries.sort((a, b) => a.x - b.x);
  if (first.x >= second.x) throw new Error('O‘ng chegara chap chegaradan katta bo‘lishi kerak.');
  const intervalCount = (second.x - first.x) / h;
  const roundedCount = Math.round(intervalCount);
  if (roundedCount < 2 || roundedCount > 80 || Math.abs(intervalCount - roundedCount) > 1e-8) {
    throw new Error('Kesma uzunligi h ga butun marta bo‘linishi kerak (2–80 ta qadam).');
  }
  return {
    ...current,
    ...ode,
    a: String(first.x),
    b: String(second.x),
    intervals: String(roundedCount),
    m0: String(first.y), m1: String(first.derivative), m2: String(first.rhs),
    g0: String(second.y), g1: String(second.derivative), g2: String(second.rhs),
  };
}
