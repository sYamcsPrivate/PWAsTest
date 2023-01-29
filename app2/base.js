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
  _writeLog("[base.js]_getCache-start");
  let req = new Request("./" + key, {
    method: "GET",
    mode: "same-origin",
    cache: "only-if-cached",
  });
  await fetch(req).then((res) => {
    if (res.ok) {
      _writeLog("[base.js]_getCache-res.ok : " + res);
      resolve(res);
    } else {
      _writeLog("[base.js]_getCache-res.ng : " + res);
      reject("not response.ok");
    }
  }).catch((err) => {
    _writeLog("[base.js]_getCache-catch(err) : " + err);
    reject(err);
  });
}
const _getCacheText = async(key) => {
  _writeLog("[base.js]_getCacheText-start");
  return await _getCache(key).then((res) => {
    _writeLog("[base.js]_getCacheText-then(res) : " + res);
    return res.text();
  }).then((res) => {
    _writeLog("[base.js]_getCacheText-then-then(res) : " + res);
    return res;
  }).catch((err) => {
    _writeLog("[base.js]_getCacheText-catch(err) : " + err);
    return undefined;
  });
}
const _getCacheName = async() => {
  _writeLog("[base.js]_getCacheName-start");

  let res = await _getCacheText("CACHE_NAME");

  _writeLog("[base.js]_getCacheName(cachename) : " + res);

  if (res === undefined) {
    _writeLog("[base.js]_getCacheName : Cachename is undefined and will be reloaded after 10 seconds");
    await _sleep(10000);
    await location.reload(false);
  }

/*
  while (res === undefined) {
    await _sleep(5000);
    res = await _getCacheText("CACHE_NAME");
    //res = _getCacheText("CACHE_NAME").then((res) => res).catch((err) => err);
  }
*/

  return res;
};
const _setCache = async(key, value) => {
  _writeLog("[base.js]_setCache-start");
  let req = "./" + key;
  let cachename = await _getCacheName();

  _writeLog("[base.js]_setCache(cachename) : " + cachename);

  await caches.open(cachename).then(async(cache) => {
    await cache.put(req, new Response(value));
  });
};
