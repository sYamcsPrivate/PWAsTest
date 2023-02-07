(()=>{

const VERSION = "0.0.0.25";

//const p = Math.random().toString(36).substring(2)
const p = ((Math.random()*26)+10).toString(36).replace(".","")
const isdoc = self.hasOwnProperty("document")

let isHideToggle = false;
let isCache = false;
let posX = 0;
let posY = 0;

let cacheName = "";
let cacheKey = "app.js.cache"
let cacheObj = {
  "log": "",
  "post": "https://...",
  "name": cacheKey + ".data",
}

//forTest
cacheObj.post = "https://script.google.com/macros/s/AKfycbztpS68-LlWTOIcb-nF_rNwwBUY--M8x-J7O-Am_D8edkTUOndHAZ22oiyVwN36BB2_-Q/exec"

const setCacheObj=(args)=>{
  if (args!==undefined && args.log!==undefined) cacheObj.log = args.log
  if (args!==undefined && args.post!==undefined) cacheObj.post = args.post
  if (args!==undefined && args.name!==undefined) cacheObj.name = args.name
}

const getDateTime=()=>{
  const toDoubleDigits=(i)=>{
    let res = "" + i
    if (res < 10) {
      res = "0" + i
    }
    return res
  }
  const toTripleDigits=(i)=>{
    let res = "" + i
    if (res < 10) {
      res = "00" + i
    } else if (res < 100) {
      res = "0" + i
    }
    return res
  }
  const DD = new Date()
  const Year = DD.getFullYear()
  const Month = toDoubleDigits(DD.getMonth() + 1)
  const Day = toDoubleDigits(DD.getDate())
  const Hours = toDoubleDigits(DD.getHours())
  const Minutes = toDoubleDigits(DD.getMinutes())
  const Seconds = toDoubleDigits(DD.getSeconds())
  const mSeconds = toTripleDigits(DD.getMilliseconds())
  const res = Year + "/" + Month + "/" + Day + "-" + Hours + ":" + Minutes + ":" + Seconds + ":" + mSeconds
  return res
}

const getCacheName=()=>{
  let res = "";
  if (cacheName == "") {
    try {
      const position = window.location.href.indexOf("?")
      if (position < 0) {
        res = window.location.href + VERSION
      } else {
        res = window.location.href.substr(0, position) + VERSION
      }
    } catch {
      res = registration.scope + VERSION
    }
    cacheName = res
  } else {
    res = cacheName
  }
  return res
}

const logCacheNames=(isClear=false)=>{
  log(`logCacheNames(isClear:${isClear}): start`)
  try {
    log("cachename(self): " + cacheName)
    caches.keys().then(cache=>{
      cache.forEach(cn=>{
        if (isClear && (cn.substring(0, cn.lastIndexOf("/")+1)==cacheName.substring(0, cacheName.lastIndexOf("/")+1))) {
          caches.delete(cn)
          log(`cachename: ${cn} -> clear`)
        } else {
          log(`cachename: ${cn}`)
        }
      })
      log(`logCacheNames(isClear:${isClear}): names.length:${cache.length}`)
    }).finally(()=>log(`logCacheNames(isClear:${isClear}): end`))
  } catch(e) {
    log(`logCacheNames(isClear:${isClear}): catch(e): ${e}`)
    return false
  }
}
const logCacheKeys=()=>{
  log("logCacheKeys: start")
  try {
    caches.open(cacheName).then(cache=>{
      cache.keys().then(keys=>{
        keys.forEach((request, index, array)=>{
          log(`cachekey: ${request.url}`)
          //log(`cache request: ${request}, index: ${index}, array: ${array}`)
          //if (isClear && request.url.indexOf(cacheKey)==-1) cache.delete(request)
        })
        log(`logCacheKeys: keys.length:${keys.length}`)
      }).finally(()=>log(`logCacheKeys: end`))
    })
  } catch(e) {
    log("logCacheKeys: catch(e): " + e)
    return false
  }
}
const logCacheKeyItems=()=>{
  log(`logCacheKeyItems(${cacheKey}): start`)
  try {
    getCache(cacheKey).then(res=>{
      if (res !== undefined) {
        Object.keys(res).forEach(key=>{
          //log("key: " + key)
          //log("typeof(res[key]): " + typeof(res[key]))
          const value = res[key].length < 150 ? res[key] : res[key].substring(0, 150) + " ..."
          log(`${key}: ${value}`)
        })
        log(`logCacheKeyItems(${cacheKey}): items.length:${Object.keys(res).length}`)
      } else {
        log(`logCacheKeyItems(${cacheKey}): items.length:0`)
      }
    }).finally(()=>log(`logCacheKeyItems(${cacheKey}): end`))
  } catch(e) {
    log(`logCacheKeyItems(${cacheKey}): catch(e): ${e}`)
    return false
  }
}

const getCache = async(key) => { //文字列を渡して、jsonオブジェクトで返る
  try {
    const req = "./" + key
    const cache = await caches.open(getCacheName())
    const data = await cache.match(req)
    if (data === undefined) return undefined
    const obj = await data.json()
    return obj
  } catch(e) {
    console.log("getCache: catch(e): " + e)
    return undefined
  }
}
const setCache = async(key, value) => { //jsonオブジェクトを渡す
  try {
    const req = "./" + key
    const cache = await caches.open(getCacheName())
    await cache.put(req, new Response(JSON.stringify(value)))
    return true
  } catch(e) {
    console.log("setCache: catch(e): " + e)
    return false
  }
}

const doPost = async(url, req) => { //jsonオブジェクトを渡して、jsonオブジェクトで返る
  log("doPost: start")
  try {
    const strJSON = await fetch(url, {
      "method": "post",
      "Content-Type": "application/json",
      "body": JSON.stringify(req),
    })
    const objJSON = await strJSON.json()
    if (objJSON.res == "OK") {
      log("doPost: success")
      return objJSON.data
    } else {
      log("doPost: error: " + JSON.stringify(objJSON))
      throw "response NG"
    }
  } catch(e) {
    log("doPost: catch(e): " + e)
    throw e
  }
}

let isasync = false
let fs=[]
const sync=(args)=>{
  fs.push(args)
  if (!isasync) {
    isasync = true
    const fr=()=>{
      eval(fs.shift())
      //.then(r=>console.log(r))
      .catch(e=>console.log(e))
      .finally(()=>fs.length<=0?isasync=false:fr())
    }
    fr()
  }
}

const view=()=>{
  //console.log("view: start")
  //log("view: start")
  if (document.getElementById(`${p}viewer`) != null) {
    const convlog = cacheObj.log.split("\\n").join("<br>")
    document.getElementById(`${p}viewer`).innerHTML=`<span id="${p}contents">${convlog}<br></span>`
    const viewer = document.getElementById(`${p}viewer`)
    viewer.scrollTop = viewer.scrollHeight
  }
}

const log=(args)=>{
  let str = getDateTime() + "|" + args
  console.log(str)
  cacheObj.log=cacheObj.log+str+"\\n"
  if (isCache) sync(`setCache("${cacheKey}", ${JSON.stringify(cacheObj)})`)
  if (isdoc) view()
}
log("version: " + VERSION)
log("self.document: " + isdoc)

const swreg=()=>{
  log("swreg: start")
  navigator.serviceWorker.register("./app.js")
  .then(res=>log("swreg: success: scope: "+res.scope))
  .catch(res=>log("swreg: error: "+res))
}

const swdel=()=>{
  log("swdel: start")
  navigator.serviceWorker.getRegistration()
  .then(registration=>registration.unregister())
  .finally(()=>log("swdel: end"))
}

const f1=()=>{
  log("f1: start")
  document.getElementById(`${p}menu1`).innerHTML=`<a><i class="fa-solid fa-spinner fa-spin"></i></a>`
  const req = {
    "action": "set",
    "name": cacheObj.name,
    "data": cacheObj,
  }
  doPost(cacheObj.post, req).catch(err=>{
    alert("Failed to send. please try again")
  }).finally(()=>{
    document.getElementById(`${p}menu1`).innerHTML=`<a><i class="fa-solid fa-cloud-arrow-up"></i></a>`
    log("f1: end")
  })
}
const f2=()=>{
  log("f2: start")
  document.getElementById(`${p}menu2`).innerHTML=`<a><i class="fa-solid fa-spinner fa-spin"></i></a>`
  const req = {
    "action": "get",
    "name": cacheObj.name,
    "data": {},
  }
  doPost(cacheObj.post, req).then(res=>cacheObj=(res)?res:cacheObj).catch(err=>{
    alert("Failed to receive. please try again")
  }).finally(()=>{
    document.getElementById(`${p}menu2`).innerHTML=`<a><i class="fa-solid fa-cloud-arrow-down"></i></a>`
    log("f2: end")
  })
}
const f3=()=>{
  log("f3: start")
  let res

  log(`<button onClick='(()=>{
    app.log("click: view cache info")
    app.logCacheNames()
    app.logCacheKeys()
    app.logCacheKeyItems()
  })()'>view cache info</button>`)

  log(`<button onClick='(()=>{ //true:サーバから再読込/false:キャッシュから再読込
    app.log("click: reload")
    location.reload(true)
  })()'>reload</button>`)

  log(`<button onClick='(()=>{
    app.log("click: clear service worker")
    app.swdel()
  })()'>clear service worker</button>`)

  log(`<button onClick='(()=>{
    app.log("click: clear cache")
    app.logCacheNames(true)
  })()'>clear cache</button>`)

  log(`<button onClick='(()=>{
    app.setCacheObj({"log":""})
    app.log("click: clear log")
  })()'>clear log</button>`)

  log(`<button onClick='(()=>{
    app.log("click: setting post(URL)")
    res = prompt("post(URL)?", app.cacheObj.post)
    if (res != null) app.setCacheObj({"post":res})
    app.log("setting post(URL): " + app.cacheObj.post)
  })()'>setting post(URL)</button> ${cacheObj.post}`)

  log(`<button onClick='(()=>{
    app.log("click: setting post(Name)")
    res = prompt("post(Name)?", app.cacheObj.name)
    if (res != null) app.setCacheObj({"name":res})
    app.log("setting post(Name): " + app.cacheObj.name)
  })()'>setting post(Name)</button> ${cacheObj.name}`)

  log("f3: end")
}

const hideToggle=()=>{
  log("hideToggle: start")
  const rapper = document.getElementById(`${p}app`);
  rapper.classList.toggle(`${p}notshowtoggle`);
}
const addEvents=()=>{
  log("addEvents: start")
  document.getElementById(`${p}menu1`).addEventListener("click",()=>{
    log("menu1: click")
    f1()
  });
  document.getElementById(`${p}menu2`).addEventListener("click",()=>{
    log("menu2: click")
    f2()
  });
  document.getElementById(`${p}menu3`).addEventListener("click",()=>{
    log("menu3: click")
    f3()
  });
  document.getElementById(`${p}toggle`).addEventListener("click",()=>{
    log("toggle: click")
    const rapper = document.getElementById(`${p}app`);
    rapper.classList.toggle(`${p}notshow`);
    if (isHideToggle) hideToggle()
  });
/*
  document.body.addEventListener("click",()=>{
    log("body: click")
  });
*/
}

const addContents=()=>{
log("addContents: start")
document.body.insertAdjacentHTML("beforeend", String.raw`
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.1/css/all.css">
<style>
#${p}app {
  font-family: 'M PLUS Rounded 1c', 游ゴシック体, 'Yu Gothic', YuGothic, 'ヒラギノ角ゴシック Pro', 'Hiragino Kaku Gothic Pro', メイリオ, Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
  transition: all 0.5s ease;
}
.${p}item {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 15px;
  transition: all 0.5s ease;
  position: relative;
}
.${p}item a {
  background: #b6b6b6;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: 0 0 6px 0 rgb(0 0 0 / 15%), 0 4px 5px 0 rgb(0 0 0 / 22%);
  position: relative;
  font-size: 1.2rem;
}
/*#${p}viewer {*/
.${p}item.${p}viewer {
  position: fixed;
  width: calc(100% - 30px);
  height: calc(100% - 15px);
  overflow: auto;
  overflow-x:hidden;
  word-break: break-all;
  justify-content: start;
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 5px;
  background: #FFF;
  padding: 2px 10px 0;
  /*font-size: 0.85rem;*/
  font-size: 0.6rem;
  box-shadow: 0 0 3px 0 rgb(0 0 0 / 12%), 0 2px 3px 0 rgb(0 0 0 / 22%);
  border-radius: 3px;
  -webkit-overflow-scrolling: touch;
}
@media (min-width: 540px) {
  .${p}item.${p}viewer {
    bottom: 40px;
    right: 100px;
    width: 80%;
    height: 80%;
    max-width: 400px;
    max-height: 600px;
  }
}
.${p}item.${p}viewer button{
  background: #FFF;
  font-size: 0.6rem;
  box-shadow: 0 0 3px 0 rgb(0 0 0 / 12%), 0 2px 3px 0 rgb(0 0 0 / 22%);
  border-radius: 3px;
  cursor: pointer;
}
.${p}item a i {
  color: #FFF;
}
.${p}item.${p}menu a:hover {
  opacity: 0.8;
}
.${p}item.${p}toggle a:before {
  content: "\f068";
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900;
  color: #FFF;
}
#${p}app.${p}notshow {
  gap: 0;
}
#${p}app.${p}notshow > .${p}item.${p}viewer {
  bottom: 40px;
  right: 40px;
  width: 0px;
  height: 0px;
}
#${p}app.${p}notshow > .${p}item.${p}viewer, #${p}app.${p}notshow > .${p}item.${p}menu {
  gap: 0;
  margin-bottom: -58px;
  opacity: 0;
}
#${p}app.${p}notshow > .${p}item.${p}menu a {
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 15%), 0 1px 2px 0 rgb(0 0 0 / 22%);
}
#${p}app.${p}notshow > .${p}item.${p}toggle a:before {
  content: "\f067";
}
#${p}app.${p}notshow {
  bottom: calc(30px - ${posX}px);
  right: calc(30px - ${posY}px);
}
#${p}app.${p}notshowtoggle > .${p}item.${p}toggle {
  opacity: 0;
}
</style>
<div id="${p}app" class="${p}notshow">
  <div id="${p}viewer" class="${p}item ${p}viewer">
    <span id="${p}contents"></span>
  </div>
  <div id="${p}menu1" class="${p}item ${p}menu">
    <a><i class="fa-solid fa-cloud-arrow-up"></i></a>
  </div>
  <div id="${p}menu2" class="${p}item ${p}menu">
    <a><i class="fa-solid fa-cloud-arrow-down"></i></a>
  </div>
  <div id="${p}menu3" class="${p}item ${p}menu">
    <a><i class="fa-solid fa-gear"></i></a>
  </div>
  <div id="${p}toggle" class="${p}item ${p}toggle">
    <a></a>
  </div>
</div>
<script defer src="https://use.fontawesome.com/releases/v6.2.1/js/all.js"/>
`)
}

const main=(args={
  hide: false,
  posx: 0,
  posy: 0,
  cache: false,
  pwa: false,
})=>{
  log("main: hide: "+args.hide)
  log("main: posx: "+args.posx)
  log("main: posy: "+args.posy)
  log("main: cache: "+args.cache)
  log("main: pwa: "+args.pwa)
  if (args.pwa) swreg()
  posX = args.posx ? args.posx : args.hide ? 65 : 0
  posY = args.posy ? args.posy : args.hide ? 65 : 0
  addContents()
  addEvents()
  if (args.hide) {
    isHideToggle = true
    hideToggle()
  }
  isCache = args.cache ? true : false
  if (isCache) getCache(cacheKey).then(res=>cacheObj=(res)?res:cacheObj).finally(()=>log(`${cacheKey}: getter end`))
}



//----
// sw
let cacheItems = [
  "./icon.png",
  "./manifest.json",
  "./app.js",
  "./",
];
const getCacheItems=()=>cacheItems
const setCacheItems=(args)=>cacheItems=args
if (!isdoc) {
  self.addEventListener("install", event=>{
    event.waitUntil(
      caches.open(getCacheName()).then(cache=>cache.addAll(cacheItems))
    )
  })
  self.addEventListener("fetch", event=>{
    if (event.request.method == "POST") return
    event.respondWith(
      caches.match(event.request).then(res=> res ? res : fetch(event.request))
    )
  })
}
//----
// object
app=Object.assign(main, {
  "swdel": swdel,
  "getCacheItems": getCacheItems,
  "setCacheItems": setCacheItems,
  "getCache": getCache, //async関数のため自前でpromiseを受け取る
  "setCache": setCache, //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "doPost": doPost,     //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "sync": sync,         //async関数をfifoで逐次実行する関数（当関数にコールバック関数や返り値考慮はないが、async関数自身から後続関数を処理することは可能）
  "logCacheNames": logCacheNames,
  "logCacheKeys": logCacheKeys,
  "logCacheKeyItems": logCacheKeyItems,
  "setCacheObj": setCacheObj,
  "cacheObj": cacheObj,
  "log": log,
})})()
