"use strict";
(async()=>{
console.log("app.js: start")
console.time("app.js: time")



//common
console.log("[common]start")

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



//sw
if (typeof(window) === "undefined") {
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

//win
} else {
  navigator.serviceWorker.register("./app.js")
  Console.promise.then(()=>Console.settings({storage:true, show:false, pos:"right-top", posx:65, posy:-65}))



const app=async()=>{
  console.log("app.js.app: start")
  console.time("app.js.app: time")

  document.body.insertAdjacentHTML("beforeend", String.raw`
<style>
body {
  overflow-wrap: break-word;
}
.pos {
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  position: fixed;
  left: 0svw;
  top: 0svh;
  user-select: none;
}
.is_hidden {
  display: none !important;
}

.area_button {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column-reverse;
}
.style_button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  width: 30px;
  height: 30px;
  font-weight: bold;
  background-color: #fff;
  opacity: 0.5;
  z-index: 1;
  border-style: solid;
}

.area_main {
  width: 100svw;
  height: 100svh;
  overflow-x: hidden;
  overflow-y: auto;
}
.table_main_wrap {
  overflow: auto;
  position: relative;
  left: 0svw;
  top: 0svh;
}
.table_main_wrap th, .table_main_wrap td {
  white-space: nowrap;
}
.table_row_wrap {
  overflow-y: auto;
}
.table_row, .table_row thead, .table_row th, .table_row tbody, .table_row td {
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

/* https://jiguma.com/form-css-summary/#width100 */
textarea {
  position: relative;
  width: 100%;
  min-height: 2.5em;
  //field-sizing: content;
  overflow-y: auto;
  resize: none;
  box-sizing: border-box;
  display: block;
  -webkit-appearance: none;
  border-radius: 0;
}

.loading_wrap {
  width: 100svw;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading {
  border: 4px solid #000000;
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>

<div class="pos">
  <div class="area_button" id="show_button"></div>
  <div class="area_main" id="show_main"></div>
  <div class="area_main is_hidden" id="show_row"></div>
</div>


  `)

  let arr = []
  let selectRow = 0
  let phase = "main";

  globalThis.AppShowEdit=(args)=>{
    if (phase === "row_view"){
      document.getElementById("button_delete").classList.remove("is_hidden");
      arr[0].forEach((col, colIndex)=>{
        const idx = colIndex + 1
        const id = "row_col" + idx
        console.log(id)
        let textareaHeight = document.getElementById(id).scrollHeight
        const rowHeight = document.getElementById("show_row").clientHeight
        if (textareaHeight > rowHeight * 0.8) textareaHeight = rowHeight * 0.8
        document.getElementById(id).parentNode.innerHTML = String.raw`<textarea style="height:` + textareaHeight + `px" id="` + id + String.raw`">` + document.getElementById(id).textContent + String.raw`</textarea>`
      })
      phase = "row_edit";
    }
  }

  globalThis.AppShowMain=()=>{
    phase = "main";
    document.getElementById("show_main").classList.remove("is_hidden");
    document.getElementById("show_row").classList.add("is_hidden");
    document.getElementById("button_add").classList.remove("is_hidden");
    document.getElementById("button_cancel").classList.add("is_hidden");
    document.getElementById("button_edit").classList.add("is_hidden");
    document.getElementById("button_delete").classList.add("is_hidden");
  }

  const showButton=()=>{
    document.getElementById("show_button").innerHTML = String.raw`
      <div class="style_button" id="button_add">a</div>
      <div class="style_button is_hidden" id="button_cancel" onclick="AppShowMain()">c</div>
      <div class="style_button is_hidden" id="button_edit" onclick="AppShowEdit()">e</div>
      <div class="style_button is_hidden" id="button_delete">d</div>
    `
  }

  const showLoading=()=>{
    document.getElementById("show_main").innerHTML = String.raw`<div class="loading_wrap"><div class="loading"></div></div>`
  }
  showLoading()

  const doPost=async(req)=>{
    const url = "https://script.google.com/macros/s/AKfycbz3DYzJpGr2lHQjZEaAsqMTcVldIivV11VtI2fYvCWp1SDxAXlHwIbVS0SqI7-V702Z/exec"
    const res = await fetch(url, {
      "method":"post",
      "Content-Type":"application/json",
      "body":JSON.stringify(req),
    })
    return res.json()
  }

  const makerowTableHTML=(args)=>{
    let tableHTML = String.raw`<div class="table_row_wrap">`
    arr[0].forEach((col, colIndex)=>{
      tableHTML = tableHTML + String.raw`<table class="pure-table table_row">`
      tableHTML = tableHTML + String.raw`<thead><tr><th>` + col + String.raw`<//th></tr></thead>`
      tableHTML = tableHTML + String.raw`<tbody><tr><td>`
      tableHTML = tableHTML + String.raw`<div id="row_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</div>`
      tableHTML = tableHTML + String.raw`</td></tr></tbody>`
      tableHTML = tableHTML + String.raw`</table>`
    })
    tableHTML = tableHTML + String.raw`</div>`
    return tableHTML
  }

  const getTableArray=async()=>{
    console.log("テーブル読込中…")
    const obj = await doPost({
      func: "select",
      args: {
        "sheet": "sheet1",
        "spread": "temp1",
        "folder": "spreads",
      },
    })
    //console.log(obj.return)
    if (obj.status === "OK") {
      console.log("テーブル読込完了")
      return obj.return
    } else {
      console.log("テーブル読込失敗")
      return []
    }
  }

  globalThis.AppRowClick=(rowIndex)=>{
    console.log("クリック行: " + rowIndex)
    selectRow = rowIndex
   // const tbl1 = document.getElementById("tbl1")
    let rowHTML = ""
    //rowHTML = "<h3>view(#" + selectRow + ")</h3>"
    rowHTML = rowHTML + makerowTableHTML("view")
    document.getElementById("show_row").innerHTML = rowHTML

    phase = "row_view";
    document.getElementById("show_main").classList.toggle("is_hidden");
    document.getElementById("show_row").classList.toggle("is_hidden");
    document.getElementById("button_add").classList.toggle("is_hidden");
    document.getElementById("button_cancel").classList.toggle("is_hidden");
    document.getElementById("button_edit").classList.toggle("is_hidden");
    document.getElementById("button_delete").classList.toggle("is_hidden");
  }

  const makeTableHTML=(arr)=>{
    let tableHTML = String.raw`<div class="table_main_wrap"><table class="pure-table" id="tbl1">`
    arr.forEach((row, rowIndex)=>{

      if (rowIndex === 0) {
        tableHTML = tableHTML + String.raw`<thead>`
      } else if (rowIndex === 1){
        tableHTML = tableHTML + String.raw`<tbody>`
      } else {
      }

      tableHTML = tableHTML + String.raw`<tr>`

      row.forEach((cell, colIndex)=>{

        if (rowIndex === 0) {
          if (colIndex === 0) {
            tableHTML = tableHTML + String.raw`<th onclick="AppRowClick(` + rowIndex + String.raw`)">` + "#" + `</th>`
          }
          tableHTML = tableHTML + String.raw`<th>`
        } else {
          if (colIndex === 0) {
            tableHTML = tableHTML + String.raw`<td onclick="AppRowClick(` + rowIndex + String.raw`)">` + rowIndex + `</td>`
          }
          tableHTML = tableHTML + String.raw`<td>`
        }

        if (cell.length > 20) cell = cell.slice(0, 19) + "..."
        tableHTML = tableHTML + cell

        if (rowIndex === 0) {
          tableHTML = tableHTML + String.raw`</th>`
        } else {
          tableHTML = tableHTML + String.raw`</td>`
        }

      })

      tableHTML = tableHTML + String.raw`</tr>`

      if (rowIndex === 0) {
        tableHTML = tableHTML + String.raw`</thead>`
      } else if (rowIndex === arr.length - 1){
        tableHTML = tableHTML + String.raw`</tbody>`
      } else {
      }

    })
    tableHTML = tableHTML + String.raw`</table></div>`
    return tableHTML
  }

  const showTabel=async()=>{
    selectRow = 0
    let innerHTML = ""
    arr = await getTableArray()
    innerHTML = innerHTML + makeTableHTML(arr)
    document.getElementById("show_main").innerHTML = innerHTML
    showButton()
  }
  await showTabel()

  console.timeEnd("app.js.app: time")
  console.log("app.js.app: end")
}
app()



console.log("[common]end")
}
console.timeEnd("app.js: time")
console.log("app.js: end")
})()
