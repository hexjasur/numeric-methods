/**
 * inject-dark-mode.js — Auto-injects dark mode CSS/JS into all pages
 * 
 * This script automatically adds dark mode links to all pages in the HTML head
 * without requiring manual edits to each page.
 * 
 * Usage: Add this script in the <head> of pages you want dark mode on:
 * <script src="path/to/inject-dark-mode.js"></script>
 */

(function () {
  'use strict';

  // Only inject if dark mode CSS is not already present
  function injectDarkMode() {
    const head = document.head;
    
    // Check if dark-mode CSS is already loaded
    const cssExists = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).some(
      link => link.href.includes('dark-mode.css')
    );

    // Check if dark-mode JS is already loaded
    const jsExists = Array.from(document.head.querySelectorAll('script')).some(
      script => script.src && script.src.includes('dark-mode.js')
    );

    if (!cssExists && !jsExists) {
      // Determine base path based on current page location
      const basePath = determineBasePath();

      // Inject dark-mode CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = basePath + 'src/assets/css/dark-mode.css';
      head.insertBefore(cssLink, head.firstChild);

      // Inject dark-mode JS
      const jsScript = document.createElement('script');
      jsScript.src = basePath + 'src/assets/js/dark-mode.js';
      head.insertBefore(jsScript, head.firstChild);

      console.log('[inject-dark-mode.js] Dark mode CSS and JS injected successfully');
    }
  }

  // Determine the base path (root of project)
  function determineBasePath() {
    const currentPath = window.location.pathname;
    
    // If on root page (index.html)
    if (currentPath === '/' || currentPath.endsWith('index.html')) {
      return './';
    }
    
    // If in src/Sonli-Usullar/ subdirectory
    if (currentPath.includes('/src/Sonli-Usullar/')) {
      return '../../';
    }
    
    // If in src/ subdirectory
    if (currentPath.includes('/src/')) {
      return '../';
    }
    
    // Default fallback
    return './';
  }

  // Inject when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDarkMode);
  } else {
    injectDarkMode();
  }
})();
