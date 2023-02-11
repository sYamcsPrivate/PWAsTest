(()=>{

const VERSION = "0.0.0.54";

//const p = Math.random().toString(36).substring(2)
const p = ((Math.random()*26)+10).toString(36).replace(".","")
const isdoc = self.hasOwnProperty("document")

let localPrefix = ""
let cacheName = "";

let pos = "";
let posX = 0;
let posY = 0;



let recObj = {
  "localname": "logger.js.rec",
  //"localtimestamp": "",
  //"postname": "",
  //"posttimestamp": "",
  //"posturl": "",
  //"mainargs": {},
  //"log": "",
}

//forTest
recObj.posturl = "https://script.google.com/macros/s/AKfycbztpS68-LlWTOIcb-nF_rNwwBUY--M8x-J7O-Am_D8edkTUOndHAZ22oiyVwN36BB2_-Q/exec"

const getRecObj=()=>recObj
const setRecObj=(args)=>{
  if (args!==undefined && args.log!==undefined) recObj.log = args.log
  if (args!==undefined && args.localname!==undefined) recObj.localname = args.localname
  if (args!==undefined && args.postname!==undefined) recObj.postname = args.postname
  if (args!==undefined && args.posturl!==undefined) recObj.posturl = args.posturl
  recObj.localtimestamp = getDateTime()
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

const getPrefix=()=>{
  if (isdoc) {
    const href = window.location.href
    const pos = href.lastIndexOf("?")
    if (pos<0) {
      if (href.slice(-1)=="/") {
        return href
      } else if (href.slice(-4)=="html") {
        return href.substr(0, href.lastIndexOf("/")+1)
      } else {
        return href + "/"
      }
    } else {
      return href.substr(0, pos)
    }
  } else {
    return undefined
  }
}
if (isdoc) {
  localPrefix = getPrefix()
  cacheName = getPrefix() + VERSION
}



const getLocalName=(name)=>localPrefix + name

const getLocal=(obj)=>{ //jsonオブジェクトからlocalnameを取り出して、jsonオブジェクトで返る
  try {
    return JSON.parse(localStorage.getItem(getLocalName(obj.localname)))
  } catch(e) {
    console.log("getLocal: catch(e): " + e)
    return undefined
  }
}
if (getLocal(recObj)) recObj=getLocal(recObj)

const setLocal=(obj)=>{ //jsonオブジェクトを渡す
  try {
    obj.localtimestamp = getDateTime()
    localStorage.setItem(getLocalName(obj.localname), JSON.stringify(obj))
    return true
  } catch(e) {
    console.log("setLocal: catch(e): " + e)
    return false
  }
}
const delLocal=(obj)=>{ //jsonオブジェクトからlocalnameを取り出して削除する
  try {
    if (localStorage.getItem(getLocalName(obj.localname))!=null) {
      localStorage.removeItem(getLocalName(obj.localname))
      log(`localkey: ${getLocalName(obj.localname)} -> clear`)
    } else {
      log(`localkey: ${getLocalName(obj.localname)} -> nothing`)
    }
    return true
  } catch(e) {
    console.log("delLocal: catch(e): " + e)
    return false
  }
}
const delLocalAll=(name)=>{ //localPrefixを渡してprefixを含むもの全てを削除する
  log(`delLocalAll(${name}): start`)
  try {
    Object.keys(localStorage).forEach(key=>{
      if (key.indexOf(name)>=0) {
        localStorage.removeItem(key)
        log(`localkey: ${key} -> clear`)
      }
    })
    log(`delLocalAll(${name}): end`)
  } catch(e) {
    console.log("delLocalAll: catch(e): " + e)
    return false
  }
}

const logObj=(args)=>{
  let obj=args
  const objLoop=(o)=>{
    Object.keys(o).forEach(key=>{
      switch (typeof(o[key])) {
        case "object":
          objLoop(o[key])
          break
        case "string":
          o[key]=o[key].split("\n").join(" ")
          break
        default:
          break
      }
      try {
        const logconv=(args)=>(args.length>100) ? args.substring(0, 35) + " ..." : args
        if (key=="log") {
          o.log=logconv(o.log)
        } else {
          let jo = JSON.parse(o[key])
          jo.log = logconv(jo.log)
          o[key]=JSON.stringify(jo)
        }
      } catch {}
    })
  }
  objLoop(obj)
  return JSON.stringify(obj, null, "&ensp;").split("\n").join("<br>")
}

/*
const logLocalKeys=()=>{
  log("logLocalKeys: start")
  try {
    Object.keys(localStorage).forEach(key=>{
      log(`LocalKey: ${key}`)
    })
    log(`logLocalKeys: local.length:${localStorage.length}`)
    log(`logLocalKeys: end`)
  } catch(e) {
    log("logLocalKeys: catch(e): " + e)
    return false
  }
}
*/

const logLocalKeyItems=()=>{
  log(`logLocalKeyItems: start`)
  log("localStorage " + logObj(localStorage))
  log(`logLocalKeyItems: end`)
}



const getCacheName=()=>{
  let res
  if (cacheName == "") {
    res = getPrefix()
    if (res === undefined || res === null) {
      res = registration.scope + VERSION
    } else {
      res = res + VERSION
    }
  } else {
    res = cacheName
  }
  return res
}

const getCache=async(key)=>{ //文字列を渡して、jsonオブジェクトで返る
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

const setCache=async(key, value)=>{ //jsonオブジェクトを渡す（非使用）
  try {
    value.posttimestamp = getDateTime()
    const req = "./" + key
    const cache = await caches.open(getCacheName())
    await cache.put(req, new Response(JSON.stringify(value)))
    return true
  } catch(e) {
    console.log("setCache: catch(e): " + e)
    return false
  }
}

const logCacheNames=async(isClear=false)=>{
  log(`logCacheNames(isClear:${isClear}): start`)
  try {
    log("CacheName(self): " + cacheName)
    const cache = await caches.keys()
    cache.forEach(cn=>{
      if (isClear && (cn.substring(0, cn.lastIndexOf("/")+1)==cacheName.substring(0, cacheName.lastIndexOf("/")+1))) {
        caches.delete(cn)
        log(`CacheName: ${cn} -> clear`)
      } else {
        log(`CacheName: ${cn}`)
      }
    })
    log(`logCacheNames(isClear:${isClear}): names.length:${cache.length}`)
    log(`logCacheNames(isClear:${isClear}): end`)
  } catch(e) {
    log(`logCacheNames(isClear:${isClear}): catch(e): ${e}`)
    return false
  }
}
const logCacheKeys=async()=>{
  log("logCacheKeys: start")
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    keys.forEach((request, index, array)=>{
      log(`CacheKey: ${request.url}`)
    })
    log(`logCacheKeys: keys.length:${keys.length}`)
    log(`logCacheKeys: end`)
  } catch(e) {
    log("logCacheKeys: catch(e): " + e)
    return false
  }
}



const getPostURL=()=>recObj.posturl
const setPostURL=(url)=>recObj.posturl=url

const doPost = async(req, url=recObj.posturl) => { //jsonオブジェクトを渡して、jsonオブジェクトで返る
  log("doPost: start")
  try {
    if (!navigator.onLine) throw "offline now"
    try {new URL(url)} catch {throw "post url error"}
    const strJSON = await fetch(url, {
      "method": "post",
      "Content-Type": "application/json",
      "body": JSON.stringify(req),
    })
    const objJSON = await strJSON.json()
    if (objJSON.status == "OK") {
      log("doPost: end")
      return objJSON.data
    } else {
      log("doPost: error: " + JSON.stringify(objJSON))
      throw "response ng"
    }
  } catch(e) {
    log("doPost: catch(e): " + e)
    throw e
  }
}

const setPost=async(obj)=>{
  log("setPost: start")
  try {
    obj.posttimestamp = getDateTime()
    const objJSON = await doPost({
      "action": "set",
      "data": obj,
    })
    log("setPost: end")
    return objJSON.postname
  } catch(e) {
    log("setPost: catch(e): " + e)
    alert(e)
    throw e
  }
}

const getPost=async(obj)=>{
  log("getPost: start")
  try {
    const objJSON = await doPost({
      "action": "get",
      "data": {
        "postname": obj.postname,
      },
    })
    log("getPost: end")
    return objJSON
  } catch(e) {
    log("getPost: catch(e): " + e)
    alert(e)
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
    const convlog = recObj.log.split("\\n").join("<br>")
    document.getElementById(`${p}viewer`).innerHTML=`<span id="${p}contents">${convlog}<br></span>`
    const viewer = document.getElementById(`${p}viewer`)
    viewer.scrollTop = viewer.scrollHeight
  }
}

const log=(args)=>{
  let str = getDateTime() + "|" + args
  console.log(str)
  if (recObj.log) {
    setRecObj({"log": recObj.log+str+"\\n"})
  } else {
    setRecObj({"log": str+"\\n"})
  }
  setLocal(recObj)
  //if (isLocal) sync(`setLocal("${recKey}", ${JSON.stringify(recObj)})`)
  //if (isCache) sync(`setCache("${recKey}", ${JSON.stringify(recObj)})`)
  if (isdoc) view()
}

log("version: " + VERSION)
log("self.document: " + isdoc)



const viewInfo=async()=>{
  log("viewInfo: start")
  await logCacheNames()
  await logCacheKeys()
  await logLocalKeyItems()
  log("viewInfo: end")
}

const regsw=()=>{
  log("regsw: start")
  navigator.serviceWorker.register("./logger.js")
  .then(res=>log("regsw: success: scope: "+res.scope))
  .catch(res=>log("regsw: error: "+res))
}

const delsw=()=>{
  log("delsw: start")
  navigator.serviceWorker.getRegistration()
  .then(registration=>registration.unregister())
  .finally(()=>log("delsw: end"))
}

const delCache=()=>logCacheNames(true)



const f1=()=>{
  log("f1: start")
  document.getElementById(`${p}menu1`).innerHTML=`<a><i class="fa-solid fa-spinner fa-spin"></i></a>`
  setPost(recObj).then(postname=>{
    log("f1: success, postname: " + postname)
    recObj.postname=(recObj.postname)?recObj.postname:postname
  }).catch(err=>{
    log("f1: catch(e): " + err)
  }).finally(()=>{
    document.getElementById(`${p}menu1`).innerHTML=`<a><i class="fa-solid fa-cloud-arrow-up"></i></a>`
    log("f1: end")
  })
}

const f2=()=>{
  log("f2: start")
  document.getElementById(`${p}menu2`).innerHTML=`<a><i class="fa-solid fa-spinner fa-spin"></i></a>`
  getPost(recObj).then(obj=>{
    log("f2: success, obj.postname: " + obj.postname)
    recObj=(obj)?obj:recObj
  }).catch(err=>{
    log("f2: catch(e): " + err)
  }).finally(()=>{
    document.getElementById(`${p}menu2`).innerHTML=`<a><i class="fa-solid fa-cloud-arrow-down"></i></a>`
    log("f2: end")
  })
}

const f3=()=>{
  log("f3: start")
  let res = `settings ... (version: ${VERSION})

<br><br>
  <button onClick='(()=>{
    logger.log("click: view info")
    logger.viewInfo()
  })()'>view info</button>

<br><br>
  <button onClick='(()=>{ //true:サーバから再読込/false:キャッシュから再読込
    logger.log("click: reload")
    location.reload(true)
  })()'>reload</button>

<br><br>
  <button onClick='(()=>{
    logger.log("click: clear service worker")
    logger.delsw()
  })()'>clear service worker</button>

<br><br>
  <button onClick='(()=>{
    logger.log("click: clear cache")
    logger.delCache()
  })()'>clear cache</button>

<br><br>
  <button onClick='(()=>{
    logger.log("click: clear local")
    const res = confirm("clear local?")
    logger.log("clear local?: " + res)
    if (res) logger.delLocalAll("${localPrefix}")
  })()'>clear local</button>

<br><br>
  <button onClick='(()=>{
    logger.setRecObj({"log":""})
    logger.log("click: clear log")
  })()'>clear log</button>

<br><br>
  <button onClick='(()=>{
    logger.log("click: post url")
    const res = prompt("post url?", logger.getPostURL())
    if (res != null) logger.setPostURL(res)
    logger.log("post url: " + logger.getPostURL())
  })()'>post url</button><br>${recObj.posturl}

<br><br>
  <button onClick='(()=>{
    logger.log("click: post name")
    const res = prompt("post name?", logger.getRecObj().postname)
    if (res != null) logger.setRecObj({"postname":res})
    logger.log("post name: " + logger.getRecObj().postname)
  })()'>post name</button><br>${recObj.postname}

<br>
`

  log(res)
  log("f3: end")
}



const hideToggle=()=>{
  log("hideToggle: start")
  const rapper = document.getElementById(`${p}logger`);
  rapper.classList.toggle(`${p}notshowtoggle`);
  log("hideToggle: end")
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
    const rapper = document.getElementById(`${p}logger`);
    rapper.classList.toggle(`${p}notshow`);
    if (recObj.mainargs.hide) hideToggle()
  });
/*
  document.body.addEventListener("click",()=>{
    log("body: click")
  });
*/

  log("addEvents: end")
}

const addContents=()=>{
log("addContents: start")
document.body.insertAdjacentHTML("beforeend", String.raw`
${(()=>{
const cdn = getRecObj().mainargs.cdn
if (cdn==undefined || cdn==true) {
  return String.raw`<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.1/css/all.css">`
} else {
  return String.raw`<link rel="stylesheet" href="./css/fontawesome-free-6.3.0-web-all.min.css">`
  }
})()}
<style>
#${p}logger {
  font-family: 'M PLUS Rounded 1c', 游ゴシック体, 'Yu Gothic', YuGothic, 'ヒラギノ角ゴシック Pro', 'Hiragino Kaku Gothic Pro', メイリオ, Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  position: fixed;
  right: 30px;
  left: inherit;
  top: inherit;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
  transition: all 0.5s ease;
}
.${p}item {
  display: flex;
  align-items: baseline;
  gap: 15px;
  transition: all 0.5s ease;
  position: relative;
}

.${p}item.${p}right-bottom {
  justify-content: flex-end;
}
.${p}item.${p}right-top {
  justify-content: flex-end;
}
.${p}item.${p}left-bottom {
  justify-content: flex-start;
}
.${p}item.${p}left-top {
  justify-content: flex-start;
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
  right: 0px;
  bottom: 0px;
  width: calc(100% - 30px);
  height: calc(100% - 15px);
  overflow: auto;
  overflow-x:hidden;
  word-break: break-all;
  justify-content: start;
  margin: 5px;
  background: #FFF;
  padding: 2px 10px 0;
  font-size: 0.6rem;
  box-shadow: 0 0 3px 0 rgb(0 0 0 / 12%), 0 2px 3px 0 rgb(0 0 0 / 22%);
  border-radius: 3px;
  -webkit-overflow-scrolling: touch;
}
@media (min-width: 650px) {
  .${p}item.${p}viewer {
    right: 100px;
    bottom: 40px;
    width: 80%;
    height: 80%;
    max-width: 600px;
    max-height: 800px;
  }
}
.${p}item.${p}viewer button{
  background: #FFF;
  color: #000;
  font-size: 1.5rem;
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
#${p}logger.${p}notshow {
  gap: 0;
}
#${p}logger.${p}notshow > .${p}item.${p}viewer {
  bottom: 40px;
  right: 40px;
  width: 0px;
  height: 0px;
}
#${p}logger.${p}notshow > .${p}item.${p}viewer, #${p}logger.${p}notshow > .${p}item.${p}menu {
  gap: 0;
  margin-bottom: -58px;
  opacity: 0;
}
#${p}logger.${p}notshow > .${p}item.${p}menu a {
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 15%), 0 1px 2px 0 rgb(0 0 0 / 22%);
}
#${p}logger.${p}notshow > .${p}item.${p}toggle a:before {
  content: "\f067";
}
#${p}logger.${p}notshow.${p}right-bottom {
  right: calc(30px - ${posX}px);
  left: inherit;
  top: inherit;
  bottom: calc(30px - ${posY}px);
}
#${p}logger.${p}notshow.${p}right-top {
  right: calc(30px - ${posX}px);
  left: inherit;
  top: calc(30px + ${posY}px);
  bottom: inherit;
}
#${p}logger.${p}notshow.${p}left-bottom {
  right: inherit;
  left: calc(30px + ${posX}px);
  top: inherit;
  bottom: calc(30px - ${posY}px);
}
#${p}logger.${p}notshow.${p}left-top {
  right: inherit;
  left: calc(30px + ${posX}px);
  top: calc(30px + ${posY}px);
  bottom: inherit;
}
#${p}logger.${p}notshowtoggle > .${p}item.${p}toggle {
  opacity: 0;
}
</style>
<div id="${p}logger" class="${p}${pos} ${p}notshow">
  <div id="${p}viewer" class="${p}${pos} ${p}item ${p}viewer">
    <span id="${p}contents"></span>
  </div>
  <div id="${p}menu1" class="${p}${pos} ${p}item ${p}menu">
    <a><i class="fa-solid fa-cloud-arrow-up"></i></a>
  </div>
  <div id="${p}menu2" class="${p}${pos} ${p}item ${p}menu">
    <a><i class="fa-solid fa-cloud-arrow-down"></i></a>
  </div>
  <div id="${p}menu3" class="${p}${pos} ${p}item ${p}menu">
    <a><i class="fa-solid fa-gear"></i></a>
  </div>
  <div id="${p}toggle" class="${p}${pos} ${p}item ${p}toggle">
    <a></a>
  </div>
</div>
`)
log("addContents: end")
}



const main=(args={
  sw: false, //true時はcacheItemsをアプリそれぞれに応じて更新する必要あり
  cdn: true,
  pos: "right-bottom", //"right-bottom"(default), "right-top", "left-bottom", "left-top"
  posx: 0,
  posy: 0,
  hide: false,
})=>{
  recObj.mainargs=args
  log("main args.sw: "+args.sw)
  log("main args.cdn: "+args.cdn)
  log("main args.pos: "+args.pos)
  log("main args.posx: "+args.posx)
  log("main args.posy: "+args.posy)
  log("main args.hide: "+args.hide)
  if (args.sw) regsw()
  pos = args.pos ? args.pos : "right-bottom"
  posX = args.posx ? args.posx : 0
  posY = args.posy ? args.posy : 0
  addContents()
  addEvents()
  if (args.hide) hideToggle()
}



//----
// sw
//  main({sw:true})で起動する場合、logger.js(serviceWorker.register)とmanifest.jsonは、
//  index.htmlに相当するhtmlファイルと同位置(root)に配置する必要あり
let cacheItems = [
  "./image/icon.png",
  "./css/fontawesome-free-6.3.0-web-all.min.css",
  "./webfonts/fa-brands-400.ttf",
  "./webfonts/fa-brands-400.woff2",
  "./webfonts/fa-regular-400.ttf",
  "./webfonts/fa-regular-400.woff2",
  "./webfonts/fa-solid-900.ttf",
  "./webfonts/fa-solid-900.woff2",
  "./webfonts/fa-v4compatibility.ttf",
  "./webfonts/fa-v4compatibility.woff2",
  "./logger.js",
  "./manifest.json",
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
logger=Object.assign(main, {
  "getLocal": getLocal, //async関数のため自前でpromiseを受け取る
  "setLocal": setLocal, //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "delLocal": delLocal,
  "delLocalAll": delLocalAll,
  "getCacheItems": getCacheItems,
  "setCacheItems": setCacheItems,
  "getCache": getCache, //async関数のため自前でpromiseを受け取る
  "setCache": setCache, //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "delCache": delCache,
  "doPost": doPost,     //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "getPost": getPost, //async関数のため自前でpromiseを受け取る
  "setPost": setPost, //async関数のため自前でpromiseを受け取る、用途次第では以下のsync関数を利用すると設計しやすいかも
  "getPostURL": getPostURL,
  "setPostURL": setPostURL,
  "getRecObj": getRecObj,
  "setRecObj": setRecObj,
  "regsw": regsw,
  "delsw": delsw,
  "sync": sync,         //async関数をfifoで逐次実行する関数（当関数にコールバック関数や返り値考慮はないが、async関数自身から後続関数を処理することは可能）
  "viewInfo": viewInfo,
  "log": log,
})})()
