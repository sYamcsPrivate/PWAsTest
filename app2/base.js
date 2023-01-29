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
const _writeLog = (log) => {
  console.log(_getDateTime() + "|" + log);
}
const _sleep = async(ms) => {
  await new Promise(resolve => setTimeout(resolve, ms));
}



/*
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
    return e;
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
*/

const _getCacheText = async(key) => {
  _writeLog("[base.js]_getCacheText-start");
  try {
    let req = "./" + key;
    let cache = await caches.open(_getCacheName());

    let data = await cache.match(req);
    _writeLog("[base.js]_getCacheText(data) : " + data);

    if (data === undefined) return undefined;

    let text = await data.text();
    _writeLog("[base.js]_getCacheText(text) : " + text);

    return text;
  } catch(e) {
    _writeLog("[base.js]_getCacheText-catch(e) : " + e);
    return undefined;
  }
}


const _setCache = async(key, value) => {
  _writeLog("[base.js]_setCache-start(key, value) : " + key + ", " + value);
  try {
    let req = "./" + key;
    let cache = await caches.open(_getCacheName());
    await cache.put(req, new Response(value));
    _writeLog("[base.js]_setCache-end(key, value) : " + key + ", " + value);
    return true;
  } catch(e) {
    return false;
  }
};
