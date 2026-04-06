/**
 * Service Worker Registration & PWA Initialization
 *
 * Include this file in your HTML pages:
 * <script src="/sw-register.js"></script>
 *
 * This handles:
 * - Service Worker registration
 * - Update checking and notification
 * - Install prompt (Add to Home Screen)
 * - Offline/Online status
 * - Cache management
 */

(function () {
  'use strict';

  // Check if browser supports service workers
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Workers not supported by this browser');
    return;
  }

  /**
   * Register Service Worker
   */
  function registerServiceWorker() {
    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
      })
      .then((registration) => {
        console.log(
          '[PWA] Service Worker registered successfully:',
          registration,
        );

        // Check for updates periodically
        const updateCheckInterval = setInterval(() => {
          registration.update().catch((error) => {
            console.warn('[PWA] Update check error:', error);
          });
        }, 60000); // Check every minute

        // Listen for new Service Worker activation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('[PWA] New Service Worker activated');
              notifyUpdate();
            }
          });
        });

        return registration;
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  }

  /**
   * Notify user about app update
   */
  function notifyUpdate() {
    const updatePrompt = document.createElement('div');
    updatePrompt.id = 'pwa-update-prompt';
    updatePrompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 400px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      animation: slideUp 0.3s ease;
    `;

    const message = document.createElement('div');
    message.style.flex = '1';
    message.innerHTML =
      "<strong>🎉 Yangi versiya mavjud!</strong><br><small>Sahifani qayta yuklang yangi xususiyatlarni ko'rish uchun</small>";

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.whiteSpace = 'nowrap';

    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = '🔄 Qayta yuklash';
    reloadBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.25);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.5);
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.2s ease;
    `;
    reloadBtn.onmouseover = () => {
      reloadBtn.style.background = 'rgba(255, 255, 255, 0.35)';
    };
    reloadBtn.onmouseout = () => {
      reloadBtn.style.background = 'rgba(255, 255, 255, 0.25)';
    };
    reloadBtn.onclick = () => {
      window.location.reload();
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    };
    closeBtn.onclick = () => {
      updatePrompt.remove();
    };

    buttonContainer.appendChild(reloadBtn);
    buttonContainer.appendChild(closeBtn);

    updatePrompt.appendChild(message);
    updatePrompt.appendChild(buttonContainer);

    document.body.appendChild(updatePrompt);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (updatePrompt.parentNode) {
        updatePrompt.remove();
      }
    }, 10000);
  }

  /**
   * Handle Install Prompt (Add to Home Screen)
   */
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing
    event.preventDefault();

    // Store the event for later use
    deferredPrompt = event;

    console.log('[PWA] Install prompt available');

    // Show install button if it exists
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', showInstallPrompt);
    }
  });

  /**
   * Show Install Prompt
   */
  function showInstallPrompt() {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] App installed');
      } else {
        console.log('[PWA] App installation declined');
      }
      deferredPrompt = null;
    });
  }

  /**
   * Handle App Installed Event
   */
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;

    // Hide install button
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  });

  /**
   * Add installation button styles if not already present
   */
  function injectInstallButtonStyles() {
    if (document.getElementById('pwa-install-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'pwa-install-styles';
    style.textContent = `
      #pwa-install-btn {
        display: none;
        padding: 10px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
      }

      #pwa-install-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      #pwa-install-btn:active {
        transform: translateY(0);
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Detect Online/Offline status
   */
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    document.body.classList.remove('offline');
    document.body.classList.add('online');

    // Trigger update check
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
    }
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Offline');
    document.body.classList.add('offline');
    document.body.classList.remove('online');
  });

  /**
   * Expose PWA API globally
   */
  window.PWA = {
    /**
     * Check if app is installed (running as PWA)
     */
    isInstalled: () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        document.referrer.includes('android-app://')
      );
    },

    /**
     * Request installation
     */
    install: showInstallPrompt,

    /**
     * Clear all caches (useful for debugging)
     */
    clearCache: () => {
      return new Promise((resolve) => {
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller
        ) {
          const channel = new MessageChannel();
          channel.port1.onmessage = (event) => {
            if (event.data.cleared) {
              console.log('[PWA] Cache cleared');
              resolve(true);
            }
          };
          navigator.serviceWorker.controller.postMessage(
            { type: 'CLEAR_CACHE' },
            [channel.port2],
          );
        } else {
          resolve(false);
        }
      });
    },

    /**
     * Get current cache version
     */
    getCacheVersion: () => {
      return 'v1';
    },

    /**
     * Check if online
     */
    isOnline: () => {
      return navigator.onLine;
    },

    /**
     * Unregister service worker (for debugging)
     */
    unregisterServiceWorker: async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        await reg.unregister();
      }
      console.log('[PWA] Service Worker unregistered');
    },
  };

  /**
   * Initialize PWA
   */
  function init() {
    console.log('[PWA] Initializing...');

    // Register service worker
    registerServiceWorker();

    // Inject button styles
    injectInstallButtonStyles();

    // Set initial online status
    if (navigator.onLine) {
      document.body.classList.add('online');
    } else {
      document.body.classList.add('offline');
    }

    console.log('[PWA] Initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
