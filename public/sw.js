/**
 * Al-Asmaa — Service Worker v5.0
 * Network-first: always fetch fresh files, fallback to cache offline
 */
const CACHE_NAME = 'al-asmaa-v22.5';
const STATIC_ASSETS = [
  '/',
  '/player.html',
  '/spectator.html',
  '/404.html',
  '/room-not-found.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/modes.css',
  '/css/mini-games.css',
  '/js/bomb.js',
  '/js/audio.js',
  '/js/validator.js',
  '/js/glossary.js',
  '/js/training.js',
  '/js/background.js',
  '/js/modes.js',
  '/js/mini-games.js',
  '/js/ilm-quest.js',
  '/js/app.js',
  '/js/player-app.js',
  '/js/spectator-app.js',
  '/data/names.js',
  '/data/encyclopedia.js',
  '/data/encyclopedia-v2.js',
  '/data/encyclopedia-direct-links.js',
  '/data/glossary.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/contenu/al_asma_logo_icon.svg'
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — NETWORK-FIRST: try network, fallback to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip socket.io, API, and join/lobby routes (server handles redirects)
  if (url.pathname.startsWith('/socket.io') || url.pathname.startsWith('/api')
      || url.pathname.startsWith('/join/') || url.pathname.startsWith('/lobby/') || url.pathname.startsWith('/iq/')) {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      // Got a fresh response — update cache
      if (response.ok && event.request.method === 'GET') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(() => {
      // Network failed — try cache
      return caches.match(event.request).then((cached) => {
        if (cached) return cached;
        // Offline fallback for documents: show 404 page for unknown routes, home for known SPA routes
        if (event.request.destination === 'document') {
          const knownRoutes = ['/', '/entrainement', '/encyclopedie', '/guide', '/99-noms-allah', '/mini-jeux'];
          const isKnown = knownRoutes.includes(url.pathname) || url.pathname.startsWith('/nom/');
          return caches.match(isKnown ? '/' : '/404.html');
        }
      });
    })
  );
});
