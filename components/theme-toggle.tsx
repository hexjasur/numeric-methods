"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("numeric-theme") as Theme | null;
    return saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("numeric-theme", next);
  }

  return <button className="theme-toggle" onClick={toggleTheme} aria-label={`${theme === "light" ? "Dark" : "Light"} modega o‘tish`} title="Ko‘rinishni almashtirish">
    <span className="theme-icon">{theme === "light" ? "☾" : "☼"}</span><span className="theme-label">{theme === "light" ? "Dark" : "Light"}</span>
  </button>;
}
