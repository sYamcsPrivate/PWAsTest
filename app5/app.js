"use strict";
(async()=>{

//common
console.log("[common]start")

const bc1 = new BroadcastChannel("bc1");



//win
if (typeof window !== "undefined") {
  Console.promise.then(()=>Console.settings({storage:true}))
  console.log("[win]start")

  document.body.insertAdjacentHTML("beforeend", String.raw`
    <button id="btn1">ローカル通知テスト</button>
  `)

  let sw=null

  document.addEventListener("DOMContentLoaded", async()=>{
    const res = await Notification.requestPermission()
    console.log(`[win]通知許可ステータス：${res}`);
    await navigator.serviceWorker.register("./app.js");
    sw = await navigator.serviceWorker.ready

    document.getElementById("btn1").addEventListener("click", async()=>{
      const msg = {type:"wait", time:5}
      console.log(`[win]送信メッセージ内容：${JSON.stringify(msg)}`)
      bc1.postMessage(msg);
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

  self.addEventListener("install", event=>{
    event.waitUntil(
      caches.open(cacheName).then(cache=>cache.addAll(cacheItems))
    )
  })
  self.addEventListener("activate", event=>{
    event.waitUntil(
      self.clients.claim()
    )
  })
  self.addEventListener("fetch", event=>{
    if (event.request.method == "POST") return
    event.respondWith(
      caches.match(event.request).then(res=> res ? res : fetch(event.request))
    )
  })

  bc1.addEventListener("message", event=>{
    console.log(`[sw]受信メッセージ内容：${JSON.stringify(event.data)}`)
    if (event.data.type === "wait") {
      const time = event.data.time * 1000;
      setTimeout(()=>{
        const notify_body = event.data.time + "秒経ちました"
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
})()
