import { all, create } from 'mathjs';

// Global Math.js instance
export const math = create(all, {});

// Function names followed directly by their argument, with an optional power:
// cosx -> cos(x), COS X -> cos(x), cos x^2 -> cos(x^2), sin2x -> sin(2x).
// Brackets are still required for anything longer than a single token: cos(x+1) is left unchanged.
const IMPLICIT_CALL =
  /\b(sinh|cosh|tanh|asin|acos|atan|sin|cos|tan|cot|sec|csc|exp|log|sqrt|abs)\s*((?:\d+(?:\.\d+)?\*?)?x|pi|\d+(?:\.\d+)?)(\^\d+(?:\.\d+)?)?(?![\w.])/gi;

export function expandImplicitCalls(expression: string): string {
  return expression.replace(
    IMPLICIT_CALL,
    (_match: string, fn: string, arg: string, power: string | undefined) =>
      `${fn.toLowerCase()}(${arg.toLowerCase()}${power ?? ''})`,
  );
}

// Helper: Fix common user syntax issues
export function normalizeExpression(expression: string) {
  // If user typed equation "f(x) = ...", extract the right side
  let expr = expression.trim();
  const parts = expr.split('=');
  if (parts.length === 2) {
    const left = parts[0].trim().toLowerCase();
    if (left === 'f(x)' || left === 'y' || left === 'f') {
      expr = parts[1].trim();
    } else {
      expr = `(${parts[0].trim()}) - (${parts[1].trim()})`;
    }
  }

  return expandImplicitCalls(expr);
}

// Global compile function
export function compileMath(expression: string) {
  try {
    const code = math.compile(normalizeExpression(expression));
    return code;
  } catch (cause) {
    return null;
  }
}

// Type guard for mathjs sum/subtraction operator nodes
export function isSumOperatorNode(node: unknown): boolean {
  return (
    typeof node === 'object' &&
    node !== null &&
    'op' in node &&
    (node.op === '+' || node.op === '-')
  );
}
