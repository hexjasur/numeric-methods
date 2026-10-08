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

  function toggleTheme() {
    const next: Theme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('numeric-theme', next);
    window.dispatchEvent(new Event(themeEvent));
  }

  return <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 font-mono text-xs font-semibold tracking-wide text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]" onClick={toggleTheme} aria-label={`${isDark ? 'Light' : 'Dark'} modega o‘tish`} title="Ko‘rinishni almashtirish">
    {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    <span className="max-[620px]:hidden">{isDark ? 'Light' : 'Dark'}</span>
  </button>;
}
