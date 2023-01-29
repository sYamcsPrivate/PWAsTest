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



const _getCache = async(key) => {
  _writeLog("[base.js]_getCache-Start");
  let req = new Request("./" + key, {
    method: "GET",
    mode: "same-origin",
    cache: "only-if-cached",
  });
  return new Promise(async(resolve, reject) => {
    await fetch(req).then((res) => {
      if (res.ok) {
        _writeLog("[base.js]_getCache-res.ok : " + res);
        resolve(res);
      } else {
        _writeLog("[base.js]_getCache-res.ng : " + res);
        reject("not response.ok");
      }
    }).catch((err) => {
      _writeLog("[base.js]_getCache-Catch(err) : " + err);
      reject(err);
    });
  });
}
const _getCacheText = async(key) => {
  _writeLog("[base.js]_getCacheText-Start");
  await _getCache(key).then((res) => {
    _writeLog("[base.js]_getCacheText-Then(res) : " + res);
    res.text();
  }).then((res) => {
    _writeLog("[base.js]_getCacheText-Then-Then(res) : " + res);
    return res;
  }).catch((err) => {
    _writeLog("[base.js]_getCacheText-Catch(err) : " + err);
    return undefined;
  });
}
const _getCacheName = () => {
  _writeLog("[base.js]_getCacheName-Start");

  let res = _getCacheText("CACHE_NAME");

  _writeLog("[base.js]_getCacheName(cachename) : " + res);

  while (res === undefined) {
    _sleep(1000);
    res = _getCacheText("CACHE_NAME");
    //res = _getCacheText("CACHE_NAME").then((res) => res).catch((err) => err);
  }
  return res;
};
const _setCache = async(key, value) => {
  _writeLog("[base.js]_setCache-Start");
  let req = "./" + key;
  let cachename = _getCacheName();

  _writeLog("[base.js]_setCache(cachename) : " + cachename);

  await caches.open(cachename).then(async(cache) => {
    await cache.put(req, new Response(value));
  });
};
