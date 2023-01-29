const VERSION = "0.0.0.8";
let CACHENAME = "";
const _getCacheName = () => {
  let res = "";
  if (CACHENAME == "") {
    try {
      let position = window.location.href.indexOf("?");
      if (position < 0) {
        res = window.location.href + VERSION;
      } else {
        res = window.location.href.substr(0, position) + VERSION;
      }
    } catch {
      res = registration.scope + VERSION;
    }
    CACHENAME = res;
  } else {
    res = CACHENAME;
  }
  return res;
}
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
const _sleep = async(ms) => { // how to use ... 「await _sleep(1000);」
  await new Promise(resolve => setTimeout(resolve, ms));
}



/*
const _getCacheText = async(key) => {
  try {
    let req = "./" + key;
    let cache = await caches.open(_getCacheName());
    let data = await cache.match(req);
    if (data === undefined) return undefined;
    let text = await data.text();
    return text;
  } catch(e) {
    console.log("[base.js]_getCacheText-catch(e) : " + e);
    return undefined;
  }
}
*/



const _getCache = async(key) => {
  try {
    let req = "./" + key;
    let cache = await caches.open(_getCacheName());
    let data = await cache.match(req);
    return data;
  } catch(e) {
    console.log("[base.js]_getCache-catch(e) : " + e);
    return undefined;
  }
}
const _getCacheText = async(key) => {
  try {
    let data = await _getCache(key);
    if (data === undefined) return undefined;
    let text = await data.text();
    return text;
  } catch(e) {
    console.log("[base.js]_getCacheText-catch(e) : " + e);
    return undefined;
  }
}
const _setCache = async(key, value) => {
  try {
    let req = "./" + key;
    let cache = await caches.open(_getCacheName());
    await cache.put(req, new Response(value));
    return true;
  } catch(e) {
    console.log("[base.js]_setCache-catch(e) : " + e);
    return false;
  }
};
const _addCacheText = async(key, value) => {
  let cacheText = await _getCacheText(key)
  if (cacheText === undefined) cacheText = "";
  cacheText = cacheText + value;
  await _setCache(key, cacheText);
}
const _writeLog = async(log) => {
  let argsLog = _getDateTime() + "|" + log;
  console.log(argsLog);
  await _addCacheText("log.txt", argsLog + "\n");
}
