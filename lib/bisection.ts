import { all, create } from 'mathjs';

const math = create(all, {});

export type Step = {
  iteration: number;
  a: number;
  b: number;
  c: number;
  fa: number;
  fb: number;
  fc: number;
  width: number;
  done: boolean;
  interval: string;
  nextA: number;
  nextB: number;
  explanation: string;
  decision: string;
};

export type Result = { root: number; iterations: number; steps: Step[] };

export function normalizeExpression(expression: string) {
  const parts = expression.split('=');
  return parts.length === 2
    ? `(${parts[0].trim()}) - (${parts[1].trim()})`
    : expression.trim();
}

export function format(value: number, digits = 6) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

export function compile(expression: string) {
  try {
    const code = math.compile(normalizeExpression(expression));
    return (x: number) => Number(code.evaluate({ x }));
  } catch {
    return null;
  }
}

export function calculateBisection(expression: string, a: string, b: string, epsilon: string): Result {
  const left = Number(a), right = Number(b), tolerance = Number(epsilon);
  if (![left, right, tolerance].every(Number.isFinite) || tolerance <= 0 || left >= right) {
    throw new Error('a < b bo‘lishi va aniqlik (ε) 0 dan katta bo‘lishi kerak.');
  }
  const f = compile(expression);
  if (!f) throw new Error('Formula yoki parametrlarni tekshiring.');
  let low = left, high = right, fa = f(low), fb = f(high);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) throw new Error('Funksiya berilgan nuqtalarda aniqlanmagan.');
  if (fa === 0) return { root: low, iterations: 0, steps: [] };
  if (fb === 0) return { root: high, iterations: 0, steps: [] };
  if (fa * fb > 0) throw new Error(`f(a) va f(b) ishoralari bir xil: f(a) = ${format(fa, 4)}, f(b) = ${format(fb, 4)}. Ildizni qamrab olish uchun f(a) · f(b) < 0 bo‘lishi kerak.`);

  const steps: Step[] = [];
  for (let iteration = 1; iteration <= 100; iteration++) {
    const c = (low + high) / 2, fc = f(c), width = high - low;
    const done = width <= tolerance || Math.abs(fc) < 1e-15;
    const leftHasRoot = fa * fc < 0;
    const interval = leftHasRoot ? `[${format(low)}, ${format(c)}]` : `[${format(c)}, ${format(high)}]`;
    const nextA = leftHasRoot ? low : c;
    const nextB = leftHasRoot ? c : high;
    const explanation = done ? 'Oraliq uzunligi ε dan kichik — hisoblash to‘xtadi.' : leftHasRoot ? 'f(a) va f(c) ishoralari qarama-qarshi. Ildiz chap yarim oraliqda qoldi.' : 'f(c) va f(b) ishoralari qarama-qarshi. Ildiz o‘ng yarim oraliqda qoldi.';
    const decision = done ? `|b - a| = ${format(width)} ≤ ε — aniqlikka erishildi.` : leftHasRoot ? `f(a) · f(c) < 0 bo‘lgani uchun yangi oraliq [a, c] = ${interval}` : `f(c) · f(b) < 0 bo‘lgani uchun yangi oraliq [c, b] = ${interval}`;
    steps.push({ iteration, a: low, b: high, c, fa, fb, fc, width, done, interval, nextA, nextB, explanation, decision });
    if (done) return { root: c, iterations: iteration, steps };
    if (leftHasRoot) { high = c; fb = fc; } else { low = c; fa = fc; }
  }
  return { root: (low + high) / 2, iterations: steps.length, steps };
}
