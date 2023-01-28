importScripts('base.js');
const VERSION = "0.0.0.5";
const CACHE_NAME = `${registration.scope}${VERSION}`;
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./sw.js",
  "./",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.put("./CACHE_NAME", new Response(CACHE_NAME));
      return cache.addAll(CACHE_ITEMS);
    })
  );
});
self.addEventListener("fetch", (event) => {
  console.log(_getDateTime() + "|event.request:" + event.request);
  event.respondWith(
    caches.match(event.request).then((response) => {

      console.log(_getDateTime() + "|fetch:" + response);

      return response ? response : fetch(event.request);
    })
  );
});
