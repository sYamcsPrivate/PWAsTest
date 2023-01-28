const VERSION = "0.0.0.2";
const CACHE_NAME = `${registration.scope}!${VERSION}`;
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./sw.js",
  "./",
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
