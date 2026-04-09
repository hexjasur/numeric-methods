/**
 * app-init.js — Centralized Application Initialization
 *
 * Bu fayl barcha scriptlarni markaziylashtirilgan o'rinde boshqaradi
 * DRY prinsipi bilan takroriy kodlarni yo'q qiladi
 *
 * Foydalanish:
 * <script>
 *   window.APP_CONFIG = {
 *     basePath: '../../',
 *     sidebarActive: 'iteratsiya',
 *     pageConfig: { ... }
 *   };
 * </script>
 * <script src="../../assets/js/app-init.js"></script>
 */

(function () {
  'use strict';

  // ============================================
  // CONFIG MANAGEMENT
  // ============================================
  const config = window.APP_CONFIG || {};
  const basePath = config.basePath || './';

  // Merge with PAGE_CONFIG if it exists
  const pageConfig = {
    ...config.pageConfig,
    basePath: basePath,
  };

  // ============================================
  // HEAD MANAGER INITIALIZATION
  // ============================================
  function initHeadManager() {
    // Create PAGE_CONFIG for head-manager-improved.js
    window.PAGE_CONFIG = {
      basePath: basePath,
      title: config.pageTitle || 'Sonli Usullar',
      description: config.pageDescription || '',
      keywords: config.pageKeywords || '',
      image: config.pageImage || '/src/assets/images/logo-dark.jpg',
      type: config.pageType || 'website',
      themeColor: config.themeColor || '#00f2ff',
      imageWidth: config.imageWidth,
      imageHeight: config.imageHeight,
      jsonLdType: config.jsonLdType,
    };

    // Dynamically load head-manager
    const script = document.createElement('script');
    script.src = basePath + 'src/assets/js/head-manager-improved.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);
  }

  // ============================================
  // SIDEBAR MANAGER INITIALIZATION
  // ============================================
  function initSidebarManager() {
    // Create SIDEBAR_CONFIG
    window.SIDEBAR_CONFIG = {
      basePath: basePath,
      activeItem: config.sidebarActive || null,
      customLinks: config.sidebarLinks || [],
    };

    // Dynamically load sidebar.js
    const script = document.createElement('script');
    script.src = basePath + 'src/assets/js/sidebar.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

  // ============================================
  // COMMON UTILITIES
  // ============================================
  const Utils = {
    /**
     * Debounce function — prevent excessive function calls
     */
    debounce: (func, wait = 300) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function — limit function execution rate
     */
    throttle: (func, limit = 300) => {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    /**
     * Format number with thousands separator
     */
    formatNumber: (num, decimals = 2) => {
      return parseFloat(num)
        .toFixed(decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Deep clone object
     */
    deepClone: (obj) => {
      return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Add class with delay
     */
    addClassWithDelay: (element, className, delay = 300) => {
      setTimeout(() => element.classList.add(className), delay);
    },

    /**
     * Remove class with delay
     */
    removeClassWithDelay: (element, className, delay = 300) => {
      setTimeout(() => element.classList.remove(className), delay);
    },

    /**
     * Show element with fade
     */
    show: (element, duration = 300) => {
      element.style.display = 'block';
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease-in`;
        element.style.opacity = '1';
      }, 10);
    },

    /**
     * Hide element with fade
     */
    hide: (element, duration = 300) => {
      element.style.transition = `opacity ${duration}ms ease-out`;
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.display = 'none';
      }, duration);
    },

    /**
     * Get URL parameter
     */
    getUrlParam: (param) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
    },

    /**
     * Parse mathematical expression safely
     */
    evaluateExpression: (expr) => {
      try {
        // Remove whitespace
        expr = expr.replace(/\s/g, '');

        // Validate expression (basic)
        if (!/^[0-9+\-*/().\w]+$/.test(expr)) {
          throw new Error('Invalid characters in expression');
        }

        // Use Function constructor (safer than eval)
        return new Function('return ' + expr)();
      } catch (error) {
        throw new Error(`Expression parsing error: ${error.message}`);
      }
    },
  };

  // ============================================
  // NOTIFICATION SYSTEM
  // ============================================
  const Notification = {
    show: (message, type = 'info', duration = 5000) => {
      const container =
        document.querySelector('.notification-container') ||
        (() => {
          const div = document.createElement('div');
          div.className = 'notification-container';
          div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
          `;
          document.body.appendChild(div);
          return div;
        })();

      const notification = document.createElement('div');
      notification.className = `alert alert-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        margin-bottom: 10px;
        animation: slideIn 0.3s ease-out;
      `;

      container.appendChild(notification);

      if (duration > 0) {
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }, duration);
      }

      return notification;
    },

    success: (message, duration = 3000) =>
      Notification.show(message, 'success', duration),
    error: (message, duration = 5000) =>
      Notification.show(message, 'error', duration),
    warning: (message, duration = 4000) =>
      Notification.show(message, 'warning', duration),
    info: (message, duration = 3000) =>
      Notification.show(message, 'info', duration),
  };

  // ============================================
  // PERFORMANCE MONITORING
  // ============================================
  const Performance = {
    init: () => {
      if (!window.performance) return;

      // Log Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              console.log('FID:', entry.processingDuration);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                console.log('CLS:', entry.value);
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('Performance monitoring not available:', e);
        }
      }

      // Log page load time
      window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
      });
    },
  };

  // ============================================
  // LAZY IMAGE LOADING
  // ============================================
  const LazyLoad = {
    init: () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              imageObserver.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img);
        });
      }
    },
  };

  // ============================================
  // SERVICE WORKER REGISTRATION
  // ============================================
  const ServiceWorker = {
    register: (swPath = '/sw.js') => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register(swPath)
          .then((registration) => {
            console.log('Service Worker registered:', registration);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error) => {
            console.warn('Service Worker registration failed:', error);
          });
      }
    },
  };

  // ============================================
  // INITIALIZATION SEQUENCE
  // ============================================
  function initialize() {
    console.log('🚀 Initializing Sonli Usullar app...');

    // Step 1: Initialize head manager (for metadata)
    if (config.initHeadManager !== false) {
      initHeadManager();
    }

    // Step 2: Initialize sidebar (if needed)
    if (config.initSidebar !== false) {
      initSidebarManager();
    }

    // Step 3: Initialize utilities
    if (config.initLazyLoad !== false) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LazyLoad.init());
      } else {
        LazyLoad.init();
      }
    }

    // Step 4: Initialize service worker (PWA support)
    if (config.initServiceWorker !== false) {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          ServiceWorker.register(basePath + 'sw.js');
        });
      }
    }

    // Step 5: Performance monitoring
    if (config.monitorPerformance) {
      Performance.init();
    }

    console.log('✅ App initialization complete');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // ============================================
  // EXPORT GLOBAL API
  // ============================================
  window.AppUtils = Utils;
  window.AppNotification = Notification;
  window.AppPerformance = Performance;
  window.AppLazyLoad = LazyLoad;
  window.AppServiceWorker = ServiceWorker;
  window.APP = {
    config,
    Utils,
    Notification,
    Performance,
    LazyLoad,
    ServiceWorker,
  };
})();
