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
const _writeLog = (log) => {
  console.log(_getDateTime() + "|" + log);
}
const _sleep = async(ms) => {
  await new Promise(resolve => setTimeout(resolve, ms));
}



const _getCache = (key) => {
  _writeLog("[base.js]_getCache-Start");
  let req = new Request("./" + key, {
    method: "GET",
    mode: "same-origin",
    cache: "only-if-cached",
  });
  return new Promise(async(resolve, reject) => {
    fetch(req).then((res) => {
      if (res.ok) {
        resolve(res);
      } else {
        reject();
      }
    }).catch((err) => {
      reject();
    });
  });
}
const _getCacheText = (key) => {
  _writeLog("[base.js]_getCacheText-Start");
  return _getCache(key)
  .then((res) => res.text())
  .then((text) => text)
  .catch(() => undefined);
}
const _getCacheName = () => {
  _writeLog("[base.js]_getCacheName-Start");

  let res = _getCacheText("CACHE_NAME");

  _writeLog("[base.js]_getCacheName(cachename) : " + res);

  while (res === undefined) {
    _sleep(1000);
    res = _getCacheText("CACHE_NAME");
  }
  return res;
};
const _setCache = async(key, value) => {
  _writeLog("[base.js]_setCache-Start");
  let req = "./" + key;
  let cachename = _getCacheName();

  _writeLog("[base.js]_setCacheName(cachename) : " + cachename);

  await caches.open(cachename).then(async(cache) => {
    await cache.put(req, new Response(value));
  });
};
