const VERSION = 'top-holidays-v1';
const STATIC_CACHE = `${VERSION}-static`;
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (!key.startsWith(VERSION)) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Network-first for API, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass non-GET
  if (request.method !== 'GET') return;

  // Handle API calls with network-first
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (err) {
          const cached = await caches.match(request);
          return cached || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Static assets cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => caches.match(OFFLINE_URL));
    })
  );
});