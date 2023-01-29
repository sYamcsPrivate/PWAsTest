importScripts('base.js');
const VERSION = "0.0.0.5";
//const CACHE_NAME = `${registration.scope}${VERSION}`;
const CACHE_NAME = registration.scope + VERSION;
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./sw.js",
  "./",
];
self.addEventListener("install", (event) => {
  _writeLog("[sw.js]eventInstall-Start");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.put("./CACHE_NAME", new Response(CACHE_NAME));

      //return cache.addAll(CACHE_ITEMS);

      let res = cache.addAll(CACHE_ITEMS);

      _writeLog("[sw.js]eventInstall-addAllFinish");
      return res;

    })
  );
});
self.addEventListener("fetch", (event) => {
  _writeLog("[sw.js]eventFetch-Start");
  _writeLog("[sw.js]eventFetch(event.request.url) : " + event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {

      _writeLog("[sw.js]eventFetch(response) : " + response);

      return response ? response : fetch(event.request);
    })
  );
});
