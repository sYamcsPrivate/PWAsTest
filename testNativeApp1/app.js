"use strict";
(async()=>{



//common
//try {
console.log("[common]start")

const bc1 = new BroadcastChannel("bc1");

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



//win
if (typeof(window) !== "undefined") {
  Console.promise.then(()=>Console.settings({storage:true}))
  console.log("[win]start")

  document.body.insertAdjacentHTML("beforeend", String.raw`
<h1>ネイティブアプリテスト１</h1>
<h2>とりまマニフェストファイルをほにゃほにゃしてみる系</h2>
  `)

  const sw = await navigator.serviceWorker.register("./app.js")
  console.log("[win]end")



//sw
} else {
  importScripts("https://syamcspublic.github.io/ConsoleJS/Console.js")
  Console.promise.then(()=>Console.settings({storage:true}))
  console.log("[sw]start")

  const cacheName = registration.scope
  const cacheItems = [
    "./app.js",
    "./icon.png",
    "./index.html",
    "./manifest.json",
  ];

  self.addEventListener("install", (event)=>{
    console.log("[sw]install start")
    event.waitUntil((async()=>{
      self.skipWaiting()
      const cache = await caches.open(cacheName)
      const res = await cache.addAll(cacheItems)
      console.log("[sw]install end")
      return res
    })())
  })
  self.addEventListener("activate", (event)=>{
    console.log("[sw]activate start")
    event.waitUntil((async()=>{
      const res = await self.clients.claim()
      console.log("[sw]activate end")
      return res
    })())
  })
  self.addEventListener("fetch", (event)=>{
    if (event.request.method == "POST") return
    event.respondWith((async()=>{
      const cacheres = await caches.match(event.request)
      if (cacheres) return cacheres
      return fetch(event.request)
    })())
  })

  console.log("[sw]end")
}



console.log("[common]end")


/*
} catch(e) {
  console.log(`[catch]${e}`)
}
*/

})()
