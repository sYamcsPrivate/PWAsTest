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
      _writeLog("[sw.js]eventInstall");
      return cache.addAll(CACHE_ITEMS);
    })
  );
});
self.addEventListener("fetch", (event) => {
  _writeLog("[sw.js]eventFetch(event.request.url) : " + event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      try {
        _writeLog("[sw.js]eventFetch(response.url) : " + response.url);
      } catch {
        _writeLog("[sw.js]eventFetch(response) : " + response);
      }
      return response ? response : fetch(event.request);
    })
  );
});



_setCache("key1", "+fromSW");
_addCacheText("key2", "+fromSW");
