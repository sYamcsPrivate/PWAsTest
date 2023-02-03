(()=>{



//----
// window
let strlog="";
const log=(args)=>{
  console.log("log: "+args)
  strlog=strlog+args+"\n"
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

const addContents=()=>{document.body.insertAdjacentHTML("beforeend", `
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
`)}}

const swreg=()=>{
  log("swreg: start")
  navigator.serviceWorker.register("./_.js")
  .then(res=>log("swreg: end, sw.scope: "+res.scope))
  .catch(res=>log("swreg: end, sw.error: "+res))
}

const main=(args=false)=>{
  log("main: "+args)
  if (args) swreg()
  addcontents()
  addEvents()
}



//----
// sw

const isdoc = self.hasOwnProperty("document")
log("_.js: start, self.document: " + isdoc)

if (!isdoc) {
  const CACHE_ITEMS = [
    "./icon.png",
    "./manifest.json",
    "./_.js",
    "./",
  ];
  self.addEventListener("install", event=>{
    event.waitUntil(
      caches.open(_getCacheName()).then(cache=>cache.addAll(CACHE_ITEMS))
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
