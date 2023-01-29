importScripts('base.js');
const VERSION = "0.0.0.6";
//const CACHE_NAME = `${registration.scope}${VERSION}`;
const CACHE_NAME = registration.scope + VERSION;
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./base.js",
  "./sw.js",
  "./",
];
self.addEventListener("install", (event) => {
  _writeLog("[sw.js]eventInstall-start");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async(cache) => {
      await cache.put("./CACHE_NAME", new Response(CACHE_NAME));

      //return cache.addAll(CACHE_ITEMS);

      let res = cache.addAll(CACHE_ITEMS);

      _writeLog("[sw.js]eventInstall-addAllFinish");
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
