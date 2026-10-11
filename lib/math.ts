import { all, create } from 'mathjs';

// Global Math.js instance
export const math = create(all, {});

// Helper: Fix common user syntax issues
export function normalizeExpression(expression: string) {
  // If user typed equation "f(x) = ...", extract the right side
  let expr = expression;
  const parts = expression.split('=');
  if (parts.length === 2) {
    expr = `(${parts[0].trim()}) - (${parts[1].trim()})`;
  } else {
    expr = expression.trim();
  }
  
  // Implicit multiplication like '2x' to '2*x' could be added here
  // But math.js already handles some implicit multiplications well.
  
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
