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

let storelog="";
const log=(args)=>{
  let str = getDateTime() + "|" + args
  console.log(str)
  storelog=storelog+str+"\n"
}

const viewer=(args)=>{
  log("viewer: "+args)
  let convlog = strlog.split("\n").join("<br>")
  document.getElementById("viewer").textContent(convlog);
}

const addEvents=()=>{
  log("addEvents: start")
  document.body.addEventListener("click",()=>{
    log("body: click")
  });
}

const addContents=()=>{
log("addContents: start")
document.body.insertAdjacentHTML("beforeend", `
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.1/css/all.css">
<style>
body{
  margin: 0;
  padding: 0;
}
.fullscreen {
  height: 100vh;
}
.text {
  margin: 0;
  background: #FFF;
  padding: 2px 10px 0;
  font-size: 0.85rem;
  box-shadow: 0 0 3px 0 rgb(0 0 0 / 12%), 0 2px 3px 0 rgb(0 0 0 / 22%);
  border-radius: 3px;
}
</style>
<div class="fullscreen">
<div id="viewer" class="text"></div>
<div>
<script defer src="https://use.fontawesome.com/releases/v6.2.1/js/all.js"/>
`)
}

const swreg=()=>{
  log("swreg: start")
  navigator.serviceWorker.register("./app.js")
  .then(res=>log("swreg: end, sw.scope: "+res.scope))
  .catch(res=>log("swreg: end, sw.error: "+res))
}

const main=(args=false)=>{
  log("main: "+args)
  if (args) swreg()
  addContents()
  addEvents()
}



//----
// sw
const isdoc = self.hasOwnProperty("document")
log("app.js: start, self.document: " + isdoc)
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
  "viewer": viewer,
})})()
