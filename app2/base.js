const _getDateTime = () => {
  let toDoubleDigits = (i) => {
    let res = "" + i;
    if (res < 10) {
      res = "0" + i;
    }
    return res;
  }
  let toTripleDigits = (i) => {
    let res = "" + i;
    if (res < 10) {
      res = "00" + i;
    } else if (res < 100) {
      res = "0" + i;
    }
    return res;
  }
  let DD = new Date();
  let Year = DD.getFullYear();
  let Month = toDoubleDigits(DD.getMonth() + 1);
  let Day = toDoubleDigits(DD.getDate());
  let Hours = toDoubleDigits(DD.getHours());
  let Minutes = toDoubleDigits(DD.getMinutes());
  let Seconds = toDoubleDigits(DD.getSeconds());
  let mSeconds = toTripleDigits(DD.getMilliseconds());
  let res = Year + "/" + Month + "/" + Day + "-" + Hours + ":" + Minutes + ":" + Seconds + ":" + mSeconds;
  return res;
}
var _getCache = (key) => {
  let path = "./" + key;
  return fetch(new Request(path)).then((res) => {
    return res.text();
  }).catch((err) => {
    return undefined;
  });
}
const _getCacheName = async() => {
  let res = _getCache("CACHE_NAME");
  while (typeof res === "undefined" || res == "") {
    await new Promise(s => setTimeout(s, 1000))
    res = _getCache("CACHE_NAME");
  }
  return res;
};
const _setCache = async(key, value) => {
  let path = "./" + key;
  let cacheName = _getCacheName();

  console.log(_getDateTime() + "|cacheName:" + cacheName);

  await caches.open(cacheName).then(async (cache) => {
    await cache.put(path, new Response(value));
  });
};
