/**
 * sw.js — Sonli Usullar PWA Service Worker
 *
 * Caching Strategy:
 *  - App Shell (HTML, CSS, JS, fonts, icons) → Cache First
 *  - CDN resources (KaTeX, Math.js, Font Awesome) → Stale-While-Revalidate
 *  - External images / analytics → Network Only (don't cache)
 *  - Navigation requests → Cache First, fallback to offline page
 *
 * Version bump this CACHE_VERSION to force a full cache refresh on deploy.
 */

'use strict';

const CACHE_VERSION = 'v2.4.2';
const SHELL_CACHE   = `sonli-shell-${CACHE_VERSION}`;
const CDN_CACHE     = `sonli-cdn-${CACHE_VERSION}`;
const PAGE_CACHE    = `sonli-pages-${CACHE_VERSION}`;

/* ── App Shell — always cached on install ───────────────────────────── */
const APP_SHELL = [
  '/',
  '/index.html',
  '/src/assets/css/output.css',
  '/src/assets/css/sidebar.css',
  '/src/assets/css/native.css',
  '/src/assets/js/head-manager.js',
  '/src/assets/js/sidebar.js',
  '/src/assets/js/capacitor-app.js',
  '/src/assets/js/pwa-install.js',
  '/src/assets/images/logo-glass.png',
  '/src/assets/images/logo-glass-optimazed.png',
  '/src/assets/images/favicon.ico',
  '/src/assets/images/favicon-192x192.png',
  '/src/assets/images/favicon-512x512.png',
  '/src/assets/images/apple-touch-icon-180x180.png',
  '/manifest.json',
  '/offline.html',
];

/* ── All content pages ──────────────────────────────────────────────── */
const CONTENT_PAGES = [
  '/src/Sonli-Usullar/Iteratsiya-Usuli.html',
  '/src/Sonli-Usullar/Vatar-Usuli.html',
  '/src/Sonli-Usullar/Urinma-Usuli.html',
  "/src/Sonli-Usullar/KesmaniTengIkkigaBo'lish-Usuli.html",
  '/src/Sonli-Usullar/Zeydel-usuli.html',
  '/src/Sonli-Usullar/Oddiy-Nyuton-Usuli.html',
  '/src/Sonli-Usullar/Haydash-Usuli.html',
  '/src/Sonli-Usullar/3nd-Oddiy-Iteratsiya-Usuli.html',
  '/src/Sonli-Usullar/FunksiyaKesishishNuqtasiAniqlash.html',
  '/src/Sonli-Usullar/Nazariya.html',
  '/src/about.html',
];

/* ── CDN origins — stale-while-revalidate ───────────────────────────── */
const CDN_ORIGINS = [
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

/* ═══════════════════════════════════════════════════════════════════════
   INSTALL — pre-cache app shell + all pages
   ═══════════════════════════════════════════════════════════════════════ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shellCache = await caches.open(SHELL_CACHE);
      // Cache app shell (critical, must succeed)
      await shellCache.addAll(APP_SHELL);

      // Cache content pages best-effort (don't block install)
      const pageCache = await caches.open(PAGE_CACHE);
      await Promise.allSettled(
        CONTENT_PAGES.map((url) =>
          pageCache.add(url).catch((err) => {
            console.warn(`[SW] Could not cache ${url}:`, err.message);
          })
        )
      );

      // Take control immediately without waiting for old SW to be replaced
      await self.skipWaiting();
    })()
  );
});

/* ═══════════════════════════════════════════════════════════════════════
   ACTIVATE — clean up old caches
   ═══════════════════════════════════════════════════════════════════════ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const VALID = [SHELL_CACHE, CDN_CACHE, PAGE_CACHE];
      await Promise.all(
        keys
          .filter((key) => !VALID.includes(key))
          .map((key) => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      );
      // Claim all open clients immediately
      await self.clients.claim();
    })()
  );
});

/* ═══════════════════════════════════════════════════════════════════════
   FETCH — routing strategy
   ═══════════════════════════════════════════════════════════════════════ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET and cross-origin analytics/tracking
  if (request.method !== 'GET') return;
  if (isAnalytics(url)) return;

  // CDN resources → Stale-While-Revalidate
  if (CDN_ORIGINS.some((origin) => request.url.startsWith(origin))) {
    event.respondWith(staleWhileRevalidate(request, CDN_CACHE));
    return;
  }

  // Same-origin navigation (HTML pages) → Cache First with network fallback
  if (request.mode === 'navigate' || isHTMLRequest(request)) {
    event.respondWith(navigationHandler(request));
    return;
  }

  // Same-origin assets (CSS, JS, images, fonts) → Cache First
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }
});

/* ─────────────────────────────────────────────────────────────────────
   Strategy helpers
   ───────────────────────────────────────────────────────────────────── */

/** Cache First → good for versioned assets that rarely change */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone()); // async, don't await
    }
    return response;
  } catch {
    return new Response('Asset unavailable offline.', { status: 503 });
  }
}

/** Stale-While-Revalidate → serve cached, refresh in background */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise) || offlineFallback(request);
}

/** Navigation handler — Cache First for HTML, offline fallback */
async function navigationHandler(request) {
  // Try page cache first
  for (const cacheName of [SHELL_CACHE, PAGE_CACHE]) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      // Revalidate in background
      fetch(request)
        .then((res) => { if (res.ok) cache.put(request, res.clone()); })
        .catch(() => {});
      return cached;
    }
  }

  // Try network
  try {
    const response = await fetch(request);
    if (response.ok) {
      const pageCache = await caches.open(PAGE_CACHE);
      pageCache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline fallback
    return (await caches.match('/offline.html')) ||
      new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } });
  }
}

/** Generic offline fallback */
async function offlineFallback(request) {
  if (isHTMLRequest(request)) {
    return (await caches.match('/offline.html')) ||
      new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } });
  }
  return new Response('', { status: 503 });
}

/* ─────────────────────────────────────────────────────────────────────
   Utility helpers
   ───────────────────────────────────────────────────────────────────── */

function isHTMLRequest(request) {
  const accept = request.headers.get('Accept') || '';
  return accept.includes('text/html');
}

function isAnalytics(url) {
  return (
    url.hostname.includes('yandex') ||
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('mc.yandex')
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Inline offline page (fallback if /offline.html is not cached yet)
   ───────────────────────────────────────────────────────────────────── */
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tarmoq yo'q — Sonli Usullar</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a;color:#fff;font-family:'Segoe UI',sans-serif;text-align:center;padding:2rem}
    .icon{font-size:5rem;margin-bottom:1.5rem;animation:pulse 2s infinite}
    h1{font-size:1.8rem;font-weight:900;letter-spacing:.1em;margin-bottom:.75rem;color:#00f2ff}
    p{color:#94a3b8;max-width:360px;line-height:1.6;margin-bottom:2rem}
    button{padding:.75rem 2rem;background:#00f2ff;color:#000;border:none;font-weight:900;font-size:1rem;cursor:pointer;letter-spacing:.08em;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
    button:hover{background:#ff00ea;color:#fff}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>INTERNET YO'Q</h1>
  <p>Tarmoq ulanishi mavjud emas. Iltimos, internetga ulanib qaytadan urinib ko'ring.</p>
  <button onclick="location.reload()">QAYTA URINISH</button>
</body>
</html>`;

/* ─────────────────────────────────────────────────────────────────────
   Background Sync — retry failed analytics or form posts (optional)
   ───────────────────────────────────────────────────────────────────── */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  // Placeholder — extend here if you add form submissions
  console.log('[SW] Background sync triggered');
}

/* ─────────────────────────────────────────────────────────────────────
   Push Notifications (placeholder — enable if needed)
   ───────────────────────────────────────────────────────────────────── */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Sonli Usullar', {
      body: data.body || '',
      icon: '/src/assets/images/favicon-192x192.png',
      badge: '/src/assets/images/favicon-192x192.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
