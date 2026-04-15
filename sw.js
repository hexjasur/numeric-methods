/**
 * Service Worker for Sonli Usullar PWA
 * Implements offline-first caching strategy for static assets and pages
 *
 * Cache Strategy:
 * - CACHE_FIRST: CSS, JS, images, fonts (rarely change)
 * - NETWORK_FIRST: HTML pages (always try fresh, fallback to cache)
 *
 * Versioning: Update CACHE_VERSION when making changes
 */

const CACHE_VERSION = 'v1.1.3';
const CACHE_NAME_STATIC = `sonli-usullar-static-${CACHE_VERSION}`;
const CACHE_NAME_PAGES = `sonli-usullar-pages-${CACHE_VERSION}`;
const CACHE_NAME_OFFLINE = `sonli-usullar-offline-${CACHE_VERSION}`;

// Assets to precache on first install (static resources)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/assets/css/sidebar.css',
  '/src/assets/css/output.css',
  '/src/assets/css/native.css',
  '/src/assets/js/head-manager.js',
  '/src/assets/js/capacitor-app.js',
  '/src/assets/js/sidebar.js',
  '/src/assets/images/favicon.ico',
  '/src/assets/images/favicon-192x192.png',
  '/src/assets/images/favicon-512x512.png',
];

// HTML pages to precache
const PRECACHE_PAGES = [
  '/index.html',

  '/src/about.html',
  '/src/privacy.html',

  '/src/Sonli-Usullar/code.html',
  '/src/Sonli-Usullar/FunksiyaKesishishNuqtasiAniqlash.html',
  
  "/src/Sonli-Usullar/KesmaniTengIkkigaBo'lish-Usuli.html",
  '/src/Sonli-Usullar/Urinma-Usuli.html',
  '/src/Sonli-Usullar/Vatar-Usuli.html',
  '/src/Sonli-Usullar/Iteratsiya-Usuli.html',
  '/src/Sonli-Usullar/Chiziqli-Iteratsiya-Usuli.html',
  '/src/Sonli-Usullar/No-chiziqli-iteratsiya-usuli.html',
  '/src/Sonli-Usullar/Zeydel-usuli.html',
  '/src/Sonli-Usullar/Oddiy-Nyuton-Usuli.html',
  '/src/Sonli-Usullar/Haydash-Usuli.html',

  '/src/Sonli-Usullar/Chats-Oddiy-Iteratsiya-Usuli.html',
  '/src/Sonli-Usullar/Chats-Zeydel-Usuli.html',
  
  '/src/Sonli-Usullar/krylov-matrix-vector-method.html',
  '/src/Sonli-Usullar/lagranj-interpolatsiya-usuli.html',
  
  '/src/Sonli-Usullar/Nazariya.html',
  'src/Sonli-Usullar-Nazariya/Biseksiya-Usuli.html',
];

/**
 * INSTALL EVENT - Precache all static assets and pages
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing and precaching assets...');

  event.waitUntil(
    (async () => {
      try {
        // Precache static assets
        const staticCache = await caches.open(CACHE_NAME_STATIC);
        await staticCache.addAll(PRECACHE_ASSETS);
        console.log('[Service Worker] Static assets cached');

        // Precache pages
        const pagesCache = await caches.open(CACHE_NAME_PAGES);
        await pagesCache.addAll(PRECACHE_PAGES);
        console.log('[Service Worker] Pages cached');

        // Cache offline fallback
        const offlineCache = await caches.open(CACHE_NAME_OFFLINE);
        await offlineCache.add('/offline.html');
        console.log('[Service Worker] Offline page cached');

        // Activate immediately without waiting for other tabs
        self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] Install error:', error);
      }
    })(),
  );
});

/**
 * ACTIVATE EVENT - Clean up old cache versions
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating and cleaning old caches...');

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        (name) =>
          (name.startsWith('sonli-usullar-static-') ||
            name.startsWith('sonli-usullar-pages-') ||
            name.startsWith('sonli-usullar-offline-')) &&
          !name.includes(CACHE_VERSION),
      );

      const deletionPromises = oldCaches.map((name) => {
        console.log('[Service Worker] Deleting old cache:', name);
        return caches.delete(name);
      });

      await Promise.all(deletionPromises);
      console.log('[Service Worker] Old caches cleaned');

      // Claim all clients (pages) for this service worker
      self.clients.claim();
    })(),
  );
});

/**
 * FETCH EVENT - Implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external resources (CDN, third-party)
  if (url.origin !== location.origin) {
    // Still try to cache CDN resources if available
    event.respondWith(
      caches
        .match(request)
        .then((response) => response || fetch(request))
        .catch(() => {
          // Return offline page for failed external requests
          return caches.match('/offline.html');
        }),
    );
    return;
  }

  // STRATEGY 1: CACHE_FIRST for static assets (CSS, JS, images, fonts)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(
      /\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/,
    )
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response; // Return from cache
        }

        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (
              !response ||
              response.status !== 200 ||
              response.type === 'error'
            ) {
              return response;
            }

            // Clone and cache the response
            const responseToCache = response.clone();
            caches
              .open(CACHE_NAME_STATIC)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch((error) =>
                console.warn('[Service Worker] Cache write error:', error),
              );

            return response;
          })
          .catch((error) => {
            console.warn(
              '[Service Worker] Fetch error for asset:',
              url.pathname,
              error,
            );
            // Return placeholder or cached version if available
            return caches.match(request);
          });
      }),
    );
    return;
  }

  // STRATEGY 2: NETWORK_FIRST for HTML pages with fallback to cache
  if (
    request.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful HTML responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Clone and cache the response
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME_PAGES)
            .then((cache) => {
              cache.put(request, responseToCache);
            })
            .catch((error) =>
              console.warn('[Service Worker] Cache write error:', error),
            );

          return response;
        })
        .catch((error) => {
          console.warn(
            '[Service Worker] Network error for page:',
            url.pathname,
            error,
          );

          // Try to serve from cache
          return caches
            .match(request)
            .then((response) => response || caches.match('/offline.html'));
        }),
    );
    return;
  }

  // DEFAULT: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches
          .open(CACHE_NAME_STATIC)
          .then((cache) => {
            cache.put(request, responseToCache);
          })
          .catch((error) =>
            console.warn('[Service Worker] Cache write error:', error),
          );

        return response;
      })
      .catch(() => caches.match(request)),
  );
});

/**
 * MESSAGE HANDLER - for communication from pages
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith('sonli-usullar-static-') ||
                name.startsWith('sonli-usullar-pages-') ||
                name.startsWith('sonli-usullar-offline-'),
            )
            .map((name) => caches.delete(name)),
        );
      })
      .then(() => {
        event.ports[0].postMessage({ cleared: true });
      });
  }
});

console.log('[Service Worker] Service Worker file loaded');
