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



/*
const _getCachePromise = (req) => {
  let reqPath = "./" + req;
  return new Promise( async (resolve, reject) => {
    fetch(reqPath)
    .then(res => res.text())
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
}
const _getCache = async(key) => {
  await _getCachePromise(key).then ( (value) => {

    console.log(_getDateTime() + "|value:" + value);

    return value;
  }).catch(() => {
    return undefined;
  });
}
*/


/*
const _getCache = async(key) => {
  let req = "./" + key;
  await caches.match(new Request(req)).then((res) => {
    console.log(_getDateTime() + "|_getCacheThen:" + res);
    return res ? res : "";
  }).catch(() => {
    console.log(_getDateTime() + "|_getCacheCatch");
    return "";
  });
}
*/

const _getCache = async(key) => {
  let req = "./" + key;
  await fetch(req).then((res) => {
    console.log(_getDateTime() + "|_getCacheThen:" + res);
    return res ? res : "";
  }).catch(() => {
    console.log(_getDateTime() + "|_getCacheCatch");
    return "";
  });
}
const _getCacheName = async() => {
  let res = await _getCache("CACHE_NAME");
  while (res == "") {
    await new Promise(s => setTimeout(s, 1000))
    res = await _getCache("CACHE_NAME");
  }
  return res;
};
const _setCache = async(key, value) => {
  let req = "./" + key;
  let cacheName = await _getCacheName();

  console.log(_getDateTime() + "|cacheName:" + cacheName);

  await caches.open(cacheName).then(async (cache) => {
    await cache.put(req, new Response(value));
  });
};
