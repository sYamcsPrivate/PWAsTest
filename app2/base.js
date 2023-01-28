const _getCache = (key) => {
  let path = "./" + key;
  return fetch(new Request(path)).then((value) => {
    return value;
  }).catch((err) => {
    return undefined;
  });
};
const _getCacheName = async() => {
  let res = _getCache("CACHE_NAME");
  while (typeof cacheName === "undefined" || cacheName == "") {
    await new Promise(s => setTimeout(s, 1000))
    res = _getCache("CACHE_NAME");
  }
  return res;
};
const _setCache = async(key, value) => {
  let path = "./" + key;
  let cacheName = _getCacheName();
  await caches.open(cacheName).then(async (cache) => {
    await cache.put(path, new Response(value));
  });
};
