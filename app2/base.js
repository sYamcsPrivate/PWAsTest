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
  try {
    let res = await fetch(req);
    if (res.ok) {
      _writeLog("[base.js]_getCache-res.ok : " + res);
      return res;
    } else {
      _writeLog("[base.js]_getCache-res.ng : " + res);
      throw new Error("not response.ok");
    }
  } catch(e) {
    _writeLog("[base.js]_getCache-catch(e) : " + e);
    return new Error(e);
  }
}
const _getCacheText = async(key) => {
  _writeLog("[base.js]_getCacheText-start");
  try {
    let res = await _getCache(key);
    _writeLog("[base.js]_getCacheText(res) : " + res);
    let text = await res.text();
    _writeLog("[base.js]_getCacheText(text) : " + text);
    return text;
  } catch(e) {
    _writeLog("[base.js]_getCacheText-catch(e) : " + e);
    return undefined;
  }
}
const _setCache = async(key, value) => {
  _writeLog("[base.js]_setCache-start");
  let req = "./" + key;
  let cachename = await _getCacheText("CACHE_NAME");

  _writeLog("[base.js]_setCache(cachename) : " + cachename);

  if (cachename === undefined) {
    _writeLog("[base.js]_setCache : Cachename is undefined and will be reloaded after 60 seconds");
    await _sleep(60000);
    await location.reload(false);
  } else {
    await caches.open(cachename).then(async(cache) => {
      await cache.put(req, new Response(value));
    });
  }
};
