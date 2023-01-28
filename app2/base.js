const VERSION = "0.0.0.4";
const CACHE_NAME = `${registration.scope}${VERSION}`;
const CACHE_ITEMS = [
  "./icon.png",
  "./manifest.json",
  "./sw.js",
  "./",
];

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
