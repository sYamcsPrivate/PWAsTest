(()=>{

const VERSION = "0.0.0.1";

let CACHENAME = "";
const getCacheName=()=>{
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

const getDateTime=()=>{
  let toDoubleDigits=(i)=>{
    let res = "" + i;
    if (res < 10) {
      res = "0" + i;
    }
    return res;
  }
  let toTripleDigits=(i)=>{
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

const view=()=>{
  //console.log("view: start")
  //log("view: start")
  if (document.getElementById("viewer") != null) {
    const convlog = storelog.split("\n").join("<br>")
    document.getElementById("viewer").innerHTML=`<span id="text">${convlog}<br></span>`
    const viewer = document.getElementById("viewer")
    viewer.scrollTop = viewer.scrollHeight
  }
}

let storelog="";
const log=(args)=>{
  let str = getDateTime() + "|" + args
  console.log(str)
  storelog=storelog+str+"\n"
  if (isdoc) view()
}

const isdoc = self.hasOwnProperty("document")
log("app.js: start, self.document: " + isdoc)

const f1=()=>{
  log("f1: start")
}
const f2=()=>{
  log("f2: start")
}

let postURL = "https://..."
let folderURL = "https://..."
let fileName = "log.txt"
const f3=()=>{
  log("f3: start")
  let res
  res = prompt("ポスト先(URL)", postURL)
  if (res != null) postURL = res
  log("postURL? res: " + res + ", postURL: " + postURL)
  res = prompt("フォルダ(URL)", folderURL)
  if (res != null) folderURL = res
  log("folderURL? res: " + res + ", folderURL: " + folderURL)
  res = prompt("ファイル(名称)", fileName)
  if (res != null) fileName = res
  log("fileName? res: " + res + ", fileName: " + fileName)
}

const addEvents=()=>{
  log("addEvents: start")
  document.getElementById("menu1").addEventListener("click",()=>{
    log("menu1: click")
    f1()
  });
  document.getElementById("menu2").addEventListener("click",()=>{
    log("menu2: click")
    f2()
  });
  document.getElementById("menu3").addEventListener("click",()=>{
    log("menu3: click")
    f3()
  });
  document.getElementById("toggle").addEventListener("click",()=>{
    log("toggle: click")
    const rapper = document.getElementById("menu");
    rapper.classList.toggle("notshow");
  });
/*
  document.body.addEventListener("click",()=>{
    log("body: click")
  });
*/
}

const hideContents=()=>{
  log("hideContents: start")
  document.getElementById("app").style.visibility ="hidden";
}
const addContents=()=>{
log("addContents: start")
document.body.insertAdjacentHTML("beforeend", `
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.1/css/all.css">
<style>
#menu {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}
.menuitem {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 15px;
  transition: all 0.5s ease;
  position: relative;
}
.menuitem a {
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
/*#viewer {*/
.menuitem.viewer {
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
  font-size: 0.85rem;
  box-shadow: 0 0 3px 0 rgb(0 0 0 / 12%), 0 2px 3px 0 rgb(0 0 0 / 22%);
  border-radius: 3px;
}
@media (min-width: 540px) {
  .menuitem.viewer {
    bottom: 40px;
    right: 100px;
    width: 80%;
    height: 80%;
    max-width: 400px;
    max-height: 600px;
  }
}
.menuitem.top a:hover, .menuitem.middle a:hover {
  opacity: 0.8;
}
.menuitem a i {
  color: #FFF;
}
.menuitem.bottom a:before {
  content: "\\f068";
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900;
  color: #FFF;
}

#menu.notshow {
  gap: 0;
}
#menu.notshow > .menuitem.viewer {
  bottom: 40px;
  right: 40px;
  width: 0px;
  height: 0px;
}
#menu.notshow > .menuitem.viewer span {
  display: none;
}

#menu.notshow > .menuitem.top, div#menu.notshow > .menuitem.middle {
  gap: 0;
  margin-bottom: -58px;
}
#menu.notshow > .menuitem.top a, div#menu.notshow > .menuitem.middle a {
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 15%), 0 1px 2px 0 rgb(0 0 0 / 22%);
}
#menu.notshow .menuitem.bottom a:before {
  content: "\\f067";
}
</style>
<div id="app">
  <div id="menu" class="notshow">
    <div id="viewer" class="menuitem viewer">
      <span id="text"></span>
    </div>
    <div id="menu1" class="menuitem top">
      <a><i class="fa-solid fa-cloud-arrow-up"></i></a>
    </div>
    <div id="menu2" class="menuitem middle">
      <a><i class="fa-solid fa-cloud-arrow-down"></i></a>
    </div>
    <div id="menu3" class="menuitem middle">
      <a><i class="fa-solid fa-gear"></i></a>
    </div>
    <div id="toggle" class="menuitem bottom">
      <a></a>
    </div>
  </div>
</div>
<script defer src="https://use.fontawesome.com/releases/v6.2.1/js/all.js"/>
`)
}

const swreg=()=>{
  log("swreg: start")
  navigator.serviceWorker.register("./app.js")
  .then(res=>log("swreg: success: scope: "+res.scope))
  .catch(res=>log("swreg: error: "+res))
}

const main=(args={
  pwa: false,
  hide: false,
})=>{
  log("main: pwa: "+args.pwa)
  log("main: hide: "+args.hide)
  if (args.pwa) swreg()
  addContents()
  addEvents()
  if (args.hide) hideContents()
}



//----
// sw
if (!isdoc) {
  const CACHE_ITEMS = [
    "./icon.png",
    "./manifest.json",
    "./app.js",
    "./",
  ];
  self.addEventListener("install", event=>{
    event.waitUntil(
      caches.open(getCacheName()).then(cache=>cache.addAll(CACHE_ITEMS))
    );
  });
  self.addEventListener("fetch", event=>{
    event.respondWith(
      caches.match(event.request).then(res=> res ? res : fetch(event.request))
    );
  });
}
//----
// object
app=Object.assign(main, {
  "log": log,
  "pwa": swreg,
  "hide": hideContents,
})})()
