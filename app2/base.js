const _getCache = (key) => {
  let path = "./" + key;
  return fetch(new Request(path)).then((value) => {
    return value;
  }).catch((err) => {
    return undefined;
  });
};
const _setCache = async (key, value) => {
  let path = "./" + key;
  let cacheName = _getCache("CACHE_NAME");
  if (cacheName) {
    await caches.open(cacheName).then(async (cache) => {
      await cache.put(path, new Response(value));
      return true;
    });
  } else {
    return false;
  }
};
