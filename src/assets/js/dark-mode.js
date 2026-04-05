/**
 * dark-mode.js — Production-level dark mode system for Sonli Usullar
 * 
 * Features:
 * - Persistent theme preference (localStorage)
 * - No flickering on page load (theme applied before DOM render)
 * - Respects system preference (prefers-color-scheme)
 * - Smooth transitions between themes
 * - Works on all pages
 * 
 * Usage:
 * 1. Add to <head> (before other scripts):
 *    <script src="path/to/dark-mode.js"></script>
 * 2. Add CSS link in <head>:
 *    <link rel="stylesheet" href="path/to/dark-mode.css">
 * 3. Add toggle button HTML (optional, can be auto-injected):
 *    <button class="dark-mode-toggle" id="dark-mode-toggle"></button>
 */

(function () {
  'use strict';

  const THEME_KEY = 'theme-preference';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  // ── Apply theme immediately to prevent FOUC ──────────────────────
  (function applyThemeImmediately() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    let theme = savedTheme;

    // If no saved preference, use system preference
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? DARK_THEME : LIGHT_THEME;
    }

    // Apply theme to HTML element
    setTheme(theme, false); // false = skip transition on initial load
  })();

  // ── Set theme function ─────────────────────────────────────────────
  function setTheme(theme, shouldTransition = true) {
    if (theme !== LIGHT_THEME && theme !== DARK_THEME) {
      console.error('[dark-mode.js] Invalid theme:', theme);
      return;
    }

    // Remove transition class temporarily if not transitioning
    if (!shouldTransition) {
      document.documentElement.classList.add('no-transition');
    }

    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);

    // Re-enable transitions after applying theme
    if (!shouldTransition) {
      // Force reflow to apply changes before re-enabling transitions
      void document.documentElement.offsetHeight;
      document.documentElement.classList.remove('no-transition');
    }

    // Save preference to localStorage
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle button icon
    updateToggleIcon(theme);

    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme },
      })
    );
  }

  // ── Toggle theme function ──────────────────────────────────────────
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme, true);
  }

  // ── Update toggle button icon ──────────────────────────────────────
  function updateToggleIcon(theme) {
    const button = document.getElementById('dark-mode-toggle');
    if (!button) return;

    if (theme === DARK_THEME) {
      button.setAttribute('aria-label', 'Switch to light mode');
      button.setAttribute('title', 'Light Mode');
      button.textContent = '☀️'; // Sun icon for "switch to light"
    } else {
      button.setAttribute('aria-label', 'Switch to dark mode');
      button.setAttribute('title', 'Dark Mode');
      button.textContent = '🌙'; // Moon icon for "switch to dark"
    }
  }

  // ── Inject toggle button if not present ────────────────────────────
  function injectToggleButton() {
    if (!document.getElementById('dark-mode-toggle')) {
      const button = document.createElement('button');
      button.id = 'dark-mode-toggle';
      button.className = 'dark-mode-toggle';
      button.setAttribute('aria-label', 'Toggle dark mode');
      button.setAttribute('type', 'button');
      document.body.appendChild(button);
    }
  }

  // ── Listen for system theme changes ────────────────────────────────
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    // Only auto-update if user hasn't manually set preference
    if (!savedTheme) {
      const newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
      setTheme(newTheme, true);
    }
  });

  // ── Public API ─────────────────────────────────────────────────────
  window.DarkMode = {
    toggle: toggleTheme,
    set: setTheme,
    get: () => document.documentElement.getAttribute('data-theme') || LIGHT_THEME,
    injectToggle: injectToggleButton,
  };

  // ── Wait for DOM to be ready ───────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function init() {
      // Inject toggle button if not in HTML
      injectToggleButton();

      // Attach click handler to toggle button
      const button = document.getElementById('dark-mode-toggle');
      if (button) {
        button.addEventListener('click', toggleTheme);
      }

      // Update icon on load
      const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
      updateToggleIcon(currentTheme);
    });
  } else {
    // DOM already loaded
    injectToggleButton();
    const button = document.getElementById('dark-mode-toggle');
    if (button) {
      button.addEventListener('click', toggleTheme);
    }
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    updateToggleIcon(currentTheme);
  }
})();
