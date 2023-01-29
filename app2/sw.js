importScripts('base.js');
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./base.js",
  "./sw.js",
  "./",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(_getCacheName()).then(async(cache) => {
      return cache.addAll(CACHE_ITEMS);
    })
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ? response : fetch(event.request);
    })
  );
});



_setCache("key1", "+fromSW");
_addCacheText("key2", "+fromSW");
//_writeLog("[sw.js]LastLine");
