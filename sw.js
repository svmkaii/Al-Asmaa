/**
 * Al-Asmaa — Service Worker for Offline Mode
 */

const CACHE_NAME = 'al-asmaa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/game.html',
  '/learn.html',
  '/scores.html',
  '/css/style.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/bomb.js',
  '/js/modes.js',
  '/js/players.js',
  '/js/ui.js',
  '/data/names.js',
  '/manifest.json'
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // Cache new requests
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
      .catch(() => {
        // Fallback for HTML pages
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      })
  );
});
