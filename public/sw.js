const CACHE_NAME = 'samfem-app-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        new URL('./', self.registration.scope).href,
        new URL('./manifest.webmanifest', self.registration.scope).href,
        new URL('./favicon.ico', self.registration.scope).href,
        new URL('./pwa-192x192.png', self.registration.scope).href,
        new URL('./pwa-512x512.png', self.registration.scope).href
      ])
    )
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('samfem-app-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ||
          (await caches.match(new URL('./', self.registration.scope).href))
        )
    );
    return;
  }

  if (
    url.pathname.includes('/assets/') ||
    /\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(async cached => {
        if (cached) return cached;

        const response = await fetch(request);

        if (response.ok) {
          const copy = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, copy);
        }

        return response;
      })
    );
  }
});
