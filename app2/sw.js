importScripts('base.js');
VERSION = "0.0.0.4";
CACHE_NAME = `${registration.scope}${VERSION}`;
CACHE_ITEMS = [
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

  _setCache("keySw", "valueSw");

});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ? response : fetch(event.request);
    })
  );
});
