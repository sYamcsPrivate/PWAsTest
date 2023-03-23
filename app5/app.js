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
if (typeof window !== "undefined") {
  Console.promise.then(()=>Console.settings({storage:true}))
  console.log("[win]start")

  const sw = await navigator.serviceWorker.register("./app.js")
  console.log(`[win]swRegister:${sw}`)

  document.body.insertAdjacentHTML("beforeend", String.raw`
    <button id="btn1">ローカル通知テスト</button>
  `)

  document.addEventListener("DOMContentLoaded", async()=>{
    console.log(`[win]Notification：${typeof(Notification)}`);

    const res = await Notification.requestPermission()
    console.log(`[win]通知許可ステータス：${res}`);

    document.getElementById("btn1").addEventListener("click", async()=>{
      console.log(`[win]btn1Click`)
      const sw = await navigator.serviceWorker.ready
      console.log(`[win]sw:${sw}`)
      if (sw) {
        const msg = {type:"wait", time:5}
        console.log(`[win]送信メッセージ内容：${JSON.stringify(msg)}`)
        bc1.postMessage(msg);
      } else {
        console.log(`[win]swが準備できてないためreload推奨`)
      }
    },false);

  },false);

  bc1.addEventListener("message", (event) => {
    console.log(`[win]受信メッセージ内容：${JSON.stringify(event.data)}`)
  },false);



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

  bc1.addEventListener("message", event=>{
    console.log(`[sw]受信メッセージ内容：${JSON.stringify(event.data)}`)
    if (event.data.type === "wait") {
      const time = event.data.time * 1000;
      setTimeout(()=>{
        const notify_body = getDateTime() + "|" + event.data.time + "秒経ちました"
        console.log(`[sw]ローカル通知テスト内容：${notify_body}`)
        self.registration.showNotification("", {
          body: notify_body,
        });
      }, time); 
    }

  });

  console.log("[sw]end")
}



console.log("[common]end")


/*
} catch(e) {
  console.log(`[catch]${e}`)
}
*/

})()
