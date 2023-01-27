const VERSION = "0.0.0.1";
const CACHE_NAME = `${registration.scope}!${VERSION}`;
const CACHE_ITEMS = [
  "/PWAsTest/",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.put("/PWAsTest/version", new Response(VERSION));
      return cache.addAll(CACHE_ITEMS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ? response : fetch(event.request);
    })
  );
});
