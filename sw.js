// Renovasi Tracker — Service Worker v1.0
const CACHE = 'renovasi-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'
];

// Install: cache semua asset penting
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Cache satu per satu agar satu gagal tidak blok yang lain
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(() => console.warn('Cache miss:', url)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: hapus cache lama
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first untuk asset, network-first untuk lainnya
self.addEventListener('fetch', e => {
  // Skip non-GET dan chrome-extension
  if(e.request.method !== 'GET') return;
  if(e.request.url.startsWith('chrome-extension')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;

      return fetch(e.request).then(response => {
        // Hanya cache response yang valid
        if(!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        // Cache dinamis untuk font dan resource penting
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback — kembalikan index.html
        if(e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
