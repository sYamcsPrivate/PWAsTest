(()=>{

const VERSION = "0.0.0.8";

const p = Math.random().toString(36).substring(2)
const isdoc = self.hasOwnProperty("document")

let varLog = ""
let varPost = "https://..."
let varId = "log.txt"

let isHideToggle = false;


let isCache = false;
let cacheName = "";
let cacheKey = "app.js.cache"
let cacheObj = {}

const setCacheObj=()=>{
  cacheObj = {
    "log": varLog,
    "post": varPost,
    "id": varId,
  }
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

const getCacheKeys=(isClear=false)=>{
  //console.log("getCacheKeys: start")
  log(`getCacheKeys(isClear:${isClear}): start`)
  try {
    log("cacheName(Self): " + cacheName)
    caches.keys().then(cache=>{
      cache.forEach(cn=>{
        log(`cacheName:${cn}`)
        if (cn.substring(0, cn.lastIndexOf("/")+1)==cacheName.substring(0, cn.lastIndexOf("/")+1)) {
          if (cn.substring(cn.lastIndexOf("/")+1)!=cacheName.substring(cn.lastIndexOf("/")+1)) {
            caches.delete(cn)
          }
        }
      })
    })
    caches.open(cacheName).then(cache=>{
      cache.keys().then(keys=>{
        keys.forEach((request, index, array)=>{
          //log(`cache request:${request}, index:${index}, array:${array}`)
          log(`cache request.url:${request.url}`)
          if (isClear && request.url.indexOf(cacheKey)==-1) cache.delete(request)
        })
        log(`getCacheKeys(isClear:${isClear}): end, keys.length:${keys.length}`)
      })
    })
  } catch(e) {
    log(`getCacheKeys(isClear:${isClear}): catch(e): ${e}`)
    return false
  }
}

const getCache = async(key) => { //jsonオブジェクトで返る
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
const setCache = async(key, value) => { //jsonオブジェクトで渡す
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
    const convlog = varLog.split("\\n").join("<br>")
    document.getElementById(`${p}viewer`).innerHTML=`<span id="${p}contents">${convlog}<br></span>`
    const viewer = document.getElementById(`${p}viewer`)
    viewer.scrollTop = viewer.scrollHeight
  }
}

const log=(args)=>{
  let str = getDateTime() + "|" + args
  console.log(str)
  varLog=varLog+str+"\\n"
  setCacheObj()
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
}
const f2=()=>{
  log("f2: start")
}

const f3=()=>{
  log("f3: start")
  let res
  //getCacheKeys()

  res = confirm("reload?")
  log("reload? res: " + res)
  if (res) {
    location.reload(true) //true:サーバから再読込/false:キャッシュから再読込
    return
  }

  res = confirm("clear service worker?")
  log("clear service worker? res: " + res)
  if (res) {
    swdel()
    return
  }

  res = confirm("clear cache?")
  log("clear cache? res: " + res)
  if (res) {
    getCacheKeys(true)
    return
  }

  res = confirm("clear log?")
  log("clear log? res: " + res)
  if (res) {
    varLog = ""
    setCacheObj()
    return
  }

  res = prompt("post(URL)", varPost)
  if (res != null) varPost = res
  setCacheObj()
  log("post(URL)? res: " + res + ", post(URL): " + varPost)

  res = prompt("ID", varId)
  if (res != null) varId = res
  setCacheObj()
  log("ID? res: " + res + ", ID: " + varId)

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
    getCacheKeys()
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
  cache: false,
  pwa: false,
})=>{
  log("main: hide: "+args.hide)
  log("main: cache: "+args.cache)
  log("main: pwa: "+args.pwa)
  if (args.pwa) swreg()
  addContents()
  addEvents()
  if (args.hide) {
    isHideToggle = true
    hideToggle()
  }
  isCache = args.cache ? true : false
  if (isCache) {
    getCache(cacheKey)
    .then(res=>{
      if (res !== undefined) {
        varLog = res.log + varLog
        varPost = res.post
        varId = res.id
        setCacheObj()
      }
    }).finally(()=>log(`${cacheKey}: getter end`))
  }
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
  "log": log,
  "getCacheItems": getCacheItems,
  "setCacheItems": setCacheItems,
})})()
