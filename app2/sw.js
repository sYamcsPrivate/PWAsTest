const VERSION = "0.0.0.2";
const CACHE_NAME = `${registration.scope}!${VERSION}`;
const CACHE_ITEMS = [
  "/PWAsTest/icons/icon-app2.png",
  "/PWAsTest/app1/manifest.json",
  "/PWAsTest/app1/sw.js",
  "/PWAsTest/app1/",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.put("/PWAsTest/app1/version", new Response(VERSION));
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
