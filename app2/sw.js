importScripts('base.js');
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./base.js",
  "./sw.js",
  "./",
];

_setCache("keySw1", "valueSw1");

self.addEventListener("install", (event) => {
  _writeLog("[sw.js]eventInstall-start");
  event.waitUntil(
    caches.open(_getCacheName()).then(async(cache) => {
      _setCache("keySw2", "valueSw2");
      //await cache.put("./data.txt", new Response(_getCacheName()));

      //return cache.addAll(CACHE_ITEMS);

      let res = cache.addAll(CACHE_ITEMS);

      _writeLog("[sw.js]eventInstall-end");
      return res;

    })
  );
});
self.addEventListener("fetch", (event) => {
  _writeLog("[sw.js]eventFetch-start");
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
