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
  left: 0vw;
  top: 0vh;
  user-select: none;
}
.area {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.area_pop {
  padding: 10px;
  max-width: 95vw;
  max-height: 95vh;
}
.flex_top_fix {
  display: flex;
  position: fixed;
  left: 0vw;
  top: 0vh;
  z-index: 1;
}
.flex_right_down {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  padding-bottom: 15px;
}
.button {
  margin: 5px;
  width: 80px;
  height: 30px;
}
.loading_wrap {
  width: 100vw;
  height: 100vh;
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
.table_wrap {
  /* display: flex; */
  /* align-items: center; */ /* 縦方向中央 */
  /* justify-content: center;*/ /* 横方向中央 */
  overflow: auto;
  padding: 5px;
  padding-bottom: 30px;
  position: relative;
  left: 0vw;
  top: 35px;
}
.table_pop_wrap {
  padding: 5px;
  overflow-y: auto;
  width: calc(100% - 10px);
}
*:popover-open {
  width: 90%;
  border: none;
  /* margin-left: 10px;
  margin-right: 10px; */
  position: absolute;
  overflow-y: auto;
}
*::backdrop {
  background-color: rgba(0, 0, 0, 0.3);

}
.rect {
  border: none;
  border: 1px solid #333;
  border-radius: 3px;
/*
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
*/
  padding: 10px;
  margin: 5px;
  width: calc(100% - 31.6px);
}
hr{
  border: none;
  border-bottom: 1px solid #333;
  margin-inline: 10px;
  width: calc(100% - 20px);
}
textarea {
  position: relative;
  width: 99%;
  field-sizing: content;
  /* overflow-y: hidden; */
  /* resize: none; */
}
</style>
<div class="pos">
  <div class="area" id="show"></div>
</div>
<div id="pop1" popover="auto">
  <div class="area_pop" id="show_pop"></div>
</div>
  `)

  let arr = []
  let selectRow = 0

  const showLoading=()=>{
    document.getElementById("show").innerHTML = String.raw`<div class="loading_wrap"><div class="loading"></div></div>`
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

  const makePopTableHTML=(args)=>{
    let tableHTML = String.raw`<div class="table_pop_wrap">`
    arr[0].forEach((col, colIndex)=>{
      tableHTML = tableHTML + String.raw`<div class="rect">`
      tableHTML = tableHTML + String.raw`<div>` + col + String.raw`</div>`
      if (args === "add") {
        tableHTML = tableHTML + String.raw`<textarea id="pop_` + col + String.raw`"></textarea>`
      } else if (args === "edit") {
        tableHTML = tableHTML + String.raw`<textarea id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</textarea>`
      } else {
        //tableHTML = tableHTML + String.raw`<textarea readonly="true" id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</textarea>`
        tableHTML = tableHTML + String.raw`<hr>`
        tableHTML = tableHTML + String.raw`<div id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</div>`
      }
      tableHTML = tableHTML + String.raw`</div>`
    })
    tableHTML = tableHTML + String.raw`</div>`
/*
    let tableHTML = String.raw`<div class="table_pop_wrap"><table class="pure-table pure-table-horizontal" style="border: none;" id="tbl2">`
    arr[0].forEach((col, colIndex)=>{
      tableHTML = tableHTML + String.raw`<tr>`
      tableHTML = tableHTML + String.raw`<td>` + col + String.raw`</td>`
      if (args === "add") {
        tableHTML = tableHTML + String.raw`<td><textarea id="pop_` + col + String.raw`"></textarea></td>`
      } else if (args === "edit") {
        tableHTML = tableHTML + String.raw`<td><textarea id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</textarea></td>`
      } else {
        //tableHTML = tableHTML + String.raw`<td id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</td>`
        tableHTML = tableHTML + String.raw`<td><textarea readonly=true id="pop_` + col + String.raw`">` + arr[selectRow][colIndex] + String.raw`</textarea></td>`
      }
      tableHTML = tableHTML + String.raw`</tr>`
    })
    tableHTML = tableHTML + String.raw`</table></div>`
*/
    return tableHTML
  }

  globalThis.AppPerformClick=async(args)=>{
    console.log("AppPerformClick: start, args: " + args)
    console.time("AppPerformClick: time")
    showLoading()

    if (args === "add") {
      let values = []
      arr[0].forEach((col, colIndex)=>{
        const id = "pop_" + col
        const value = document.getElementById(id).value
        values.push(value)
      })
      console.log(values)
      console.log("テーブル追加中…")
      const obj = await doPost({
        func: "insert",
        args: {
          "values": [values],
          "sheet": "sheet1",
          "spread": "temp1",
          "folder": "spreads",
        },
      })
      console.log(obj.return)
      if (obj.status === "OK") {
        console.log("テーブル追加完了")
      } else {
        console.log("テーブル追加失敗")
      }

    } else if (args === "edit") {
      let sets = {}
      arr[0].forEach((col, colIndex)=>{
        const id = "pop_" + col
        const value = document.getElementById(id).value
        sets[col] = value
      })
      console.log("indexes: " + selectRow)
      console.log(sets)
      console.log("テーブル更新中…")
      const obj = await doPost({
        func: "update",
        args: {
          "sets": sets,
          "indexes": [selectRow],
          "sheet": "sheet1",
          "spread": "temp1",
          "folder": "spreads",
        },
      })
      console.log(obj.return)
      if (obj.status === "OK") {
        console.log("テーブル更新完了")
      } else {
        console.log("テーブル更新失敗")
      }

    } else if (args === "delete") {
      console.log("indexes: " + selectRow)
      console.log("テーブル削除中…")
      const obj = await doPost({
        func: "delete",
        args: {
          "indexes": [selectRow],
          "sheet": "sheet1",
          "spread": "temp1",
          "folder": "spreads",
        },
      })
      console.log(obj.return)
      if (obj.status === "OK") {
        console.log("テーブル削除完了")
      } else {
        console.log("テーブル削除失敗")
      }

    }
    await showTabel()
    console.timeEnd("AppPerformClick: time")
    console.log("AppPerformClick: end")
  }

  const makePopButtonHTML=(args)=>{
    let html = String.raw`<div class="flex_right_down">`
    if (args !== "view") {
      html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="hide" id="btn_perform" onclick="AppPerformClick('` + args + String.raw`')">perform</button>`
    }
    html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="hide" id="btn_close">close</button>`
    html = html + String.raw`</div>`
    return html
  }

  globalThis.AppAddClick=()=>{
    console.log("AppAddClick")
    let popHTML = ""
    popHTML = "<h3>add</h3>"
    popHTML = popHTML + makePopTableHTML("add")
    popHTML = popHTML + makePopButtonHTML("add")
    document.getElementById("show_pop").innerHTML = popHTML
  }
  globalThis.AppEditClick=()=>{
    console.log("AppEditClick")
    if (selectRow === 0) {
      document.getElementById("show_pop").innerHTML = "Please select a row"
      return
    }
    let popHTML = ""
    popHTML = "<h3>edit(#" + selectRow + ")</h3>"
    popHTML = popHTML + makePopTableHTML("edit")
    popHTML = popHTML + makePopButtonHTML("edit")
    document.getElementById("show_pop").innerHTML = popHTML
  }
  globalThis.AppDeleteClick=()=>{
    console.log("AppDeleteClick")
    if (selectRow === 0) {
      document.getElementById("show_pop").innerHTML = "Please select a row"
      return
    }
    let popHTML = ""
    popHTML = "<h3>delete(#" + selectRow + ")</h3>"
    popHTML = popHTML + makePopTableHTML("delete")
    popHTML = popHTML + makePopButtonHTML("delete")
    document.getElementById("show_pop").innerHTML = popHTML
  }
  globalThis.AppViewClick=()=>{
    console.log("AppViewClick")
    if (selectRow === 0) {
      document.getElementById("show_pop").innerHTML = "Please select a row"
      return
    }
    let popHTML = ""
    popHTML = "<h3>view(#" + selectRow + ")</h3>"
    popHTML = popHTML + makePopTableHTML("view")
    popHTML = popHTML + makePopButtonHTML("view")
    document.getElementById("show_pop").innerHTML = popHTML
  }

  const makeButtonHTML=()=>{
    let html = String.raw`<div class="flex_top_fix">`
    html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="show" id="btn_add"onclick="AppAddClick()">add</button>`
    html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="show" id="btn_edit" onclick="AppEditClick()">edit</button>`
    html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="show" id="btn_delete" onclick="AppDeleteClick()">delete</button>`
    html = html + String.raw`<button class="button" popovertarget="pop1" popovertargetaction="show" id="btn_view"onclick="AppViewClick()">view</button>`
    html = html + String.raw`</div>`
    return html
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
    const tbl1 = document.getElementById("tbl1")
    ;[...tbl1.rows].forEach((row, index)=>{
      if (index !== 0) {
        if (index === rowIndex) {
          row.style.backgroundColor = "#e0ffff"
        } else {
          row.style.backgroundColor = ""
        }
      }
    })
  }

  const makeTableHTML=(arr)=>{
    let tableHTML = String.raw`<div class="table_wrap"><table class="pure-table" id="tbl1">`
    arr.forEach((row, rowIndex)=>{

      if (rowIndex === 0) {
        tableHTML = tableHTML + String.raw`<thead>`
      } else if (rowIndex === 1){
        tableHTML = tableHTML + String.raw`<tbody>`
      } else {
      }

      tableHTML = tableHTML + String.raw`<tr onclick="AppRowClick(` + rowIndex + String.raw`)">`

      row.forEach((cell, colIndex)=>{

        if (rowIndex === 0) {
          if (colIndex === 0) {
            tableHTML = tableHTML + String.raw`<th>#</th>`
          }
          tableHTML = tableHTML + String.raw`<th>`
        } else {
          if (colIndex === 0) {
            tableHTML = tableHTML + String.raw`<td>` + rowIndex + `</td>`
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
    innerHTML = innerHTML + makeButtonHTML()
    arr = await getTableArray()
    innerHTML = innerHTML + makeTableHTML(arr)
    document.getElementById("show").innerHTML = innerHTML
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
