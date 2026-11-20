'use client';

import { useEffect, useRef } from 'react';

/**
 * Brings the attached element into view when `result` changes to a new value,
 * but only when it is not already fully visible. On desktop the user keeps
 * their place; on phones and tablets the result is no longer lost below the
 * fold after pressing "calculate".
 */
export function useScrollToResult<T>(result: T | null) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!result || !element) return;

    const rect = element.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (fullyVisible) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [result]);

  return ref;
}
