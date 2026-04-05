/**
 * pwa-install.js — Sonli Usullar PWA Install Prompt
 *
 * Features:
 *  1. Catches the `beforeinstallprompt` event and shows a custom install banner
 *  2. Shows an iOS Safari guide if running on iOS (no native prompt)
 *  3. Tracks install state in sessionStorage (don't re-show after dismiss)
 *  4. Injects all required CSS inline — no external stylesheet needed
 *  5. "App installed" toast on `appinstalled` event
 *  6. Offline / online status badge
 */

(function () {
  'use strict';

  /* ── Constants ────────────────────────────────────────────────────── */
  const STORAGE_KEY   = 'pwa-install-dismissed';
  const INSTALL_STYLE = `
    /* ── PWA Install Banner ─────────────────────────────────── */
    #pwa-install-banner {
      position: fixed;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%) translateY(120%);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 14px;
      background: #0f172a;
      color: #fff;
      border: 2px solid #00f2ff;
      box-shadow: 6px 6px 0 #00f2ff;
      padding: 14px 18px;
      max-width: 420px;
      width: calc(100% - 2rem);
      clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Segoe UI', sans-serif;
    }
    #pwa-install-banner.show {
      transform: translateX(-50%) translateY(0);
    }
    #pwa-install-banner .pwa-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 2px solid #00f2ff;
    }
    #pwa-install-banner .pwa-text {
      flex: 1;
      min-width: 0;
    }
    #pwa-install-banner .pwa-title {
      font-weight: 900;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      color: #00f2ff;
    }
    #pwa-install-banner .pwa-desc {
      font-size: 0.72rem;
      color: #94a3b8;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pwa-install-banner .pwa-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    #pwa-install-btn {
      background: #00f2ff;
      color: #000;
      border: none;
      font-weight: 900;
      font-size: 0.75rem;
      padding: 8px 14px;
      cursor: pointer;
      letter-spacing: 0.06em;
      clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
      white-space: nowrap;
      transition: background 0.2s;
    }
    #pwa-install-btn:hover { background: #ff00ea; color: #fff; }
    #pwa-dismiss-btn {
      background: transparent;
      color: #64748b;
      border: 1px solid #334155;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 8px 10px;
      cursor: pointer;
      transition: color 0.2s;
    }
    #pwa-dismiss-btn:hover { color: #fff; }

    /* ── iOS Install Guide ──────────────────────────────────── */
    #pwa-ios-guide {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #0f172a;
      border-top: 2px solid #00f2ff;
      padding: 1.25rem 1.5rem 2rem;
      font-family: 'Segoe UI', sans-serif;
      transform: translateY(100%);
      transition: transform 0.4s ease;
    }
    #pwa-ios-guide.show { transform: translateY(0); }
    #pwa-ios-guide h3 {
      color: #00f2ff;
      font-size: 0.9rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
    }
    #pwa-ios-guide ol {
      color: #cbd5e1;
      font-size: 0.8rem;
      line-height: 1.7;
      padding-left: 1.2rem;
    }
    #pwa-ios-guide .ios-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #64748b;
      font-size: 1.2rem;
      cursor: pointer;
    }
    #pwa-ios-guide .share-icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin: 0 2px;
    }

    /* ── Online / Offline Badge ─────────────────────────────── */
    #pwa-status-badge {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 99998;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 5px 12px;
      border: 1.5px solid currentColor;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
    #pwa-status-badge.online  { color: #22c55e; border-color: #22c55e; background: rgba(34,197,94,.12); }
    #pwa-status-badge.offline { color: #ef4444; border-color: #ef4444; background: rgba(239,68,68,.12); opacity: 1; }
    #pwa-status-badge.show    { opacity: 1; }

    /* ── Installed Toast ────────────────────────────────────── */
    #pwa-toast {
      position: fixed;
      top: 1.25rem;
      left: 50%;
      transform: translateX(-50%) translateY(-120%);
      z-index: 99999;
      background: #0f172a;
      border: 2px solid #22c55e;
      color: #22c55e;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 10px 20px;
      white-space: nowrap;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #pwa-toast.show { transform: translateX(-50%) translateY(0); }
  `;

  /* ── Inject styles ────────────────────────────────────────────────── */
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'pwa-install-styles';
    style.textContent = INSTALL_STYLE;
    document.head.appendChild(style);
  }

  /* ── Detect iOS ───────────────────────────────────────────────────── */
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  function isInStandaloneMode() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  /* ── Online/Offline badge ─────────────────────────────────────────── */
  function initStatusBadge() {
    const badge = document.createElement('div');
    badge.id = 'pwa-status-badge';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-live', 'polite');
    document.body.appendChild(badge);

    function update(online) {
      badge.textContent = online ? 'ONLINE' : 'OFFLINE — OFFLINE REJIM';
      badge.className = online ? 'online' : 'offline';
      if (!online) {
        badge.classList.add('show');
      } else {
        // Show "online" briefly then hide
        badge.classList.add('show');
        setTimeout(() => badge.classList.remove('show'), 3000);
      }
    }

    window.addEventListener('online',  () => update(true));
    window.addEventListener('offline', () => update(false));

    // Init state
    if (!navigator.onLine) update(false);
  }

  /* ── Toast ────────────────────────────────────────────────────────── */
  function showToast(msg) {
    let toast = document.getElementById('pwa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pwa-toast';
      toast.setAttribute('role', 'alert');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ── Install Banner (Chrome / Edge / Android) ─────────────────────── */
  function initInstallBanner(deferredPrompt) {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', "Ilovani o'rnatish");
    banner.innerHTML = `
      <img class="pwa-icon" src="/src/assets/images/favicon-192x192.png" alt="Sonli Usullar ikona">
      <div class="pwa-text">
        <div class="pwa-title">ILOVANI O'RNATISH</div>
        <div class="pwa-desc">Sonli Usullar — oflayn ishlaydi</div>
      </div>
      <div class="pwa-actions">
        <button id="pwa-install-btn" aria-label="Ilovani o'rnatish">O'RNATISH</button>
        <button id="pwa-dismiss-btn" aria-label="Keyinroq">✕</button>
      </div>
    `;
    document.body.appendChild(banner);

    // Animate in after a short delay
    setTimeout(() => banner.classList.add('show'), 1500);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      banner.classList.remove('show');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast("Ilova muvaffaqiyatli o'rnatildi!");
      }
      sessionStorage.setItem(STORAGE_KEY, '1');
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      banner.classList.remove('show');
      sessionStorage.setItem(STORAGE_KEY, '1');
    });
  }

  /* ── iOS Install Guide ────────────────────────────────────────────── */
  function initIOSGuide() {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (!isIOS() || isInStandaloneMode()) return;

    const guide = document.createElement('div');
    guide.id = 'pwa-ios-guide';
    guide.setAttribute('role', 'dialog');
    guide.setAttribute('aria-label', "Ilovani o'rnatish yo'riqnomasi");
    guide.innerHTML = `
      <button class="ios-close" id="pwa-ios-close" aria-label="Yopish">✕</button>
      <h3>ILOVANI O'RNATISH (iOS)</h3>
      <ol>
        <li>Safari pastidagi <svg class="share-icon" viewBox="0 0 24 24" fill="#00f2ff"><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.11 0 2 .89 2 2z"/></svg> tugmasini bosing</li>
        <li>"Bosh ekranga qo'shish" (Add to Home Screen) ni tanlang</li>
        <li>"Qo'shish" (Add) tugmasini bosing</li>
      </ol>
    `;
    document.body.appendChild(guide);

    setTimeout(() => guide.classList.add('show'), 2000);

    document.getElementById('pwa-ios-close').addEventListener('click', () => {
      guide.classList.remove('show');
      sessionStorage.setItem(STORAGE_KEY, '1');
    });
  }

  /* ── Service Worker Registration ──────────────────────────────────── */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[PWA] Service Worker registered:', reg.scope);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available — show update banner
              showUpdateBanner(reg);
            }
          });
        });
      } catch (err) {
        console.error('[PWA] Service Worker registration failed:', err);
      }
    });
  }

  /* ── Update Banner ────────────────────────────────────────────────── */
  function showUpdateBanner(reg) {
    const existing = document.getElementById('pwa-update-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.style.cssText = `
      position:fixed; bottom:1.25rem; right:1rem; z-index:99999;
      background:#0f172a; color:#fff; border:2px solid #ff00ea;
      box-shadow: 4px 4px 0 #ff00ea; padding:12px 16px;
      font-family:'Segoe UI',sans-serif; font-size:0.78rem; font-weight:700;
      display:flex; gap:12px; align-items:center; letter-spacing:0.05em;
    `;
    banner.innerHTML = `
      <span>Yangi versiya mavjud!</span>
      <button id="pwa-update-btn" style="
        background:#ff00ea; color:#fff; border:none; padding:6px 14px;
        font-weight:900; font-size:0.72rem; cursor:pointer; letter-spacing:0.06em;
      ">YANGILASH</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
  }

  /* ── Main ─────────────────────────────────────────────────────────── */
  function init() {
    injectStyles();
    initStatusBadge();
    registerServiceWorker();

    // Capture install prompt
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      initInstallBanner(deferredPrompt);
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      showToast("Sonli Usullar ilovasi o'rnatildi!");
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.remove('show');
    });

    // iOS fallback
    initIOSGuide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
