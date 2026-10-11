'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const themeEvent = 'numeric-theme-change';

function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('numeric-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light');
  const isDark = theme === 'dark';

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = isDark ? 'light' : 'dark';

    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('numeric-theme', next);
      window.dispatchEvent(new Event(themeEvent));
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('numeric-theme', next);
      window.dispatchEvent(new Event(themeEvent));
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // To light: new view expands. To dark: old view shrinks (revealing dark underneath)
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  }

  return (
    <button 
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 font-mono text-xs font-semibold tracking-wide text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]" 
      onClick={toggleTheme} 
      aria-label={`${isDark ? 'Light' : 'Dark'} modega o'tish`} 
      // title="Ko'rinishni almashtirish"
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
      <span className="max-[620px]:hidden">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
