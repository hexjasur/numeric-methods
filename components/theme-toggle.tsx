'use client';

import { Moon, Palette, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
export type VisualTheme = 'print' | 'minimal';
const themeEvent = 'numeric-theme-change';
const visualThemeEvent = 'numeric-visual-theme-change';

function getVisualTheme(): VisualTheme {
  if (typeof window === 'undefined') return 'print';
  return window.localStorage.getItem('numeric-visual-theme') === 'minimal'
    ? 'minimal'
    : 'print';
}

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
  const visualTheme = useSyncExternalStore(
    (callback) => {
      window.addEventListener(visualThemeEvent, callback);
      return () => window.removeEventListener(visualThemeEvent, callback);
    },
    getVisualTheme,
    () => 'print',
  );
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.visualTheme = visualTheme;
  }, [visualTheme]);

  function setTheme(next: Theme, event?: React.MouseEvent<HTMLButtonElement>) {
    const apply = () => {
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('numeric-theme', next);
      window.dispatchEvent(new Event(themeEvent));
    };
    if (!event || !document.startViewTransition) {
      apply();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: isDark ? [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`] : [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)' },
      );
    });
  }

  function setVisualTheme(next: VisualTheme) {
    document.documentElement.dataset.visualTheme = next;
    window.localStorage.setItem('numeric-visual-theme', next);
    window.dispatchEvent(new Event(visualThemeEvent));
  }

  return (
    <div className="relative flex items-center gap-1.5">
      <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 font-mono text-xs font-semibold tracking-wide text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]" onClick={(event) => setTheme(isDark ? 'light' : 'dark', event)} aria-label={`${isDark ? 'Light' : 'Dark'} modega o'tish`}>
        {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        <span className="max-[620px]:hidden">{isDark ? 'Light' : 'Dark'}</span>
      </button>
      <details className="group relative">
        <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]" aria-label="Theme sozlamalari">
          <Palette size={16} aria-hidden="true" />
        </summary>
        <div className="absolute right-0 top-12 z-40 w-64 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Theme sozlamalari</p>
          <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]">
            Design
            <select value={visualTheme} onChange={(event) => setVisualTheme(event.target.value as VisualTheme)} className="h-10 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)]">
              <option value="print">Print Stream — Retro</option>
              <option value="minimal">Minimal — Clean</option>
            </select>
          </label>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">Tanlovingiz shu qurilmada saqlanadi.</p>
        </div>
      </details>
    </div>
  );
}
