let VERSION;
let CACHE_NAME;
let CACHE_ITEMS;

const _getCache = async (key) => {
  let path = "./" + key;
  await caches.open(CACHE_NAME).then(async (cache) => {
    await caches.match(path).then((value) => {
      return value ? value : undefined;
    })
  });
};

const _setCache = async (key, value) => {
  let path = "./" + key;
  await caches.open(CACHE_NAME).then((cache) => {
    return cache.put(path, value);
  });
};
