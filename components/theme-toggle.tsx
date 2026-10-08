"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const themeEvent = "numeric-theme-change";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("numeric-theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("numeric-theme", next);
    window.dispatchEvent(new Event(themeEvent));
  }

  return <button className="theme-toggle" onClick={toggleTheme} aria-label={`${theme === "light" ? "Dark" : "Light"} modega o‘tish`} title="Ko‘rinishni almashtirish">
    <span className="theme-icon" aria-hidden="true">{theme === "light" ? "☾" : "☼"}</span><span className="theme-label">{theme === "light" ? "Dark" : "Light"}</span>
  </button>;
}
