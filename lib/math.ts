import { all, create } from 'mathjs';

// Global Math.js instance
export const math = create(all, {});

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

  return expr;
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
