/**
 * capacitor-app.js — Native-like enhancements for Sonli Usullar Android App
 *
 * Features:
 *  1. Page loader overlay (shows until DOM is ready, then fades out)
 *  2. Offline detection (shows styled "No Internet" screen)
 *  3. Android back-button navigation via Capacitor App plugin
 *  4. Share FAB button using Web Share API
 *  5. Splash screen fade-out trigger
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * 1. PAGE LOADER
   * ───────────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById('app-loader');
    if (!loader) return;

    // Hide loader after DOM + resources settle
    function hideLoader() {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 400);
    }

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 300));
    }
  }

  /* ─────────────────────────────────────────────
   * 2. SPLASH SCREEN (index.html only)
   * ───────────────────────────────────────────── */
  function initSplash() {
    const splash = document.getElementById('app-splash');
    if (!splash) return;

    function hideSplash() {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 600);
    }

    if (document.readyState === 'complete') {
      setTimeout(hideSplash, 1200);
    } else {
      window.addEventListener('load', () => setTimeout(hideSplash, 1200));
    }
  }

  /* ─────────────────────────────────────────────
   * 5. SHARE FAB BUTTON
   * ───────────────────────────────────────────── */
  function initShareFab() {
    // Only show if Web Share API is supported (Android WebView supports it)
    if (!navigator.share) return;

    const fab = document.createElement('button');
    fab.id = 'share-fab';
    fab.setAttribute('aria-label', 'Ulashish');
    fab.title = 'Bu sahifani ulashing';
    fab.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
      </svg>
    `;

    fab.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: document.title || 'Sonli Usullar',
          text: 'Sonli usullarni interaktiv o\'rganing — QarDU Amaliy Matematika',
          url: 'https://www.sonli-usullar.uz',
        });
      } catch (err) {
        // User cancelled share or not supported — ignore
      }
    });

    document.body.appendChild(fab);
  }

  /* ─────────────────────────────────────────────
   * INIT ALL
   * ───────────────────────────────────────────── */
  function init() {
    initLoader();
    initSplash();
    initShareFab();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
