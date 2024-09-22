
const SpreadsheetSQL=(args={})=>{

  const folderIds = { //スクリプトプロパティにフォルダIDを設定することを推奨
    "spreads": PropertiesService.getScriptProperties().getProperty("folderId_spreads"), //spreadsフォルダは必須
    "accounts": PropertiesService.getScriptProperties().getProperty("folderId_accounts"),
  }

  const convArraysToJsons=(args)=>{
    const [header, ...rows] = args
    return rows.map((row) => row.reduce((acc, cell, i) => ({ ...acc, [header[i]]: cell }), {}))
  }

  const convJsonsToArrays=(args)=>{
    let res=[]
    args.forEach((obj, index)=>{
      if (index === 0) res.push(Object.keys(obj))
      res.push(Object.values(obj))
    })
    return res
  }

  const getFileId=(fileName, folderName)=>{
    const folder = DriveApp.getFolderById(folderIds[folderName])
    let files = folder.getFiles()
    let fileId = ""
    while (files.hasNext()) {
      let file = files.next()
      if (file.getName() == fileName) fileId = file.getId()
    }
    return fileId
  }

  const getSheet=(sheetName, fileName, folderName)=>{
    const fileId = getFileId(fileName, folderName)
    const spread = SpreadsheetApp.openById(fileId)
    const sheet = spread.getSheetByName(sheetName)
    return sheet
  }

  const getFileNames=(folderName)=>{
    const folder = DriveApp.getFolderById(folderIds[folderName])
    let files = folder.getFiles()
    let fileNames = []
    while (files.hasNext()) {
      let file = files.next()
      fileNames.push(file.getName())
    }
    return fileNames
  }

  const isExistFileName=(fileName, folderName)=>{
    let fileNames = getFileNames(folderName)
    return fileNames.includes(fileName) //いない場合はfalse,いる場合はtrue
  }

  const checkArgs=(args)=>{
    if (typeof(args.folder) === "undefined") return {"status": "NG", "message": "folder does not exist in args"}
    if (typeof(folderIds[args.folder]) === "undefined") return {"status": "NG", "message": "folder does not exist in folderIds"}
    if (typeof(args.spread) === "undefined") return {"status": "NG", "message": "spread does not exist in args"}
    if (args._func === "createSpread") {
      if (isExistFileName(args.spread, args.folder)) return {"status": "NG", "message": "spread does exist in folder"}
    } else {
      if (!isExistFileName(args.spread, args.folder)) return {"status": "NG", "message": "spread does not exist in folder"}
      if (typeof(args.sheet) === "undefined") return {"status": "NG", "message": "sheet does not exist in args"}
      const sheet = getSheet(args.sheet, args.spread, args.folder)
      if (args._func === "createSheet") {
        if (sheet !== null) return {"status": "NG", "message": "sheet does exist in spread"}
        if (typeof(args.arrays) === "undefined") return {"status": "NG", "message": "arrays does not exist in args"}
        if (args.arrays.length < 1) return {"status": "NG", "message": "arrays does not have header"}
      } else {
        if (sheet === null) return {"status": "NG", "message": "sheet does not exist in spread"}
        if (args._func === "setSheetArray") {
          if (typeof(args.arrays) === "undefined") return {"status": "NG", "message": "arrays does not exist in args"}
          if (args.arrays.length < 1) return {"status": "NG", "message": "arrays does not have header"}
        } else if (args._func === "select") {
          if (typeof(args.indexes) !== "undefined" && typeof(args.where) !== "undefined") return {"status": "NG", "message": "indexes and where cannot be specified at the same time"}
        } else if (args._func === "insert") {
          if (typeof(args.values) === "undefined") return {"status": "NG", "message": "values does not exist in args"}
        } else if (args._func === "update") {
          if (typeof(args.sets) === "undefined") return {"status": "NG", "message": "sets does not exist in args"}
        }
      }
      return {
        "status": "OK",
        "sheet": sheet
      }
    }
    return {
      "status": "OK",
    }
  }

  const getSheetArray=(args)=>{
    console.log("getSheetArray: start, args:" + JSON.stringify(args))
    console.time("getSheetArray: time")
    const res = checkArgs(args)
    if (res.status === "NG") return res
    const arrays = res.sheet.getDataRange().getValues()
    console.timeEnd("getSheetArray: time")
    console.log("getSheetArray: end")
    return {
      "status": "OK",
      "return": arrays
    }
  }

  const setSheetArray=(args)=>{
    console.log("setSheetArray: start, args:" + JSON.stringify(args))
    console.time('setSheetArray: time')
    const res = checkArgs(args)
    if (res.status === "NG") return res
    if (res.sheet.getMaxColumns() > 1) {
      res.sheet.deleteColumns(2, res.sheet.getMaxColumns() - 1)
    }
    if (res.sheet.getMaxRows() > 1) {
      res.sheet.deleteRows(2, res.sheet.getMaxRows() - 1)
    }
    res.sheet.clear()
    //if (args.arrays[0].length > 1) res.sheet.insertColumns(1, args.arrays[0].length - 1) //insertせんでも以下setValuesで適当に広げてくれる
    //if (args.arrays.length > 1) res.sheet.insertRows(1, args.arrays.length - 1) //insertせんでも以下setValuesで適当に広げてくれる
    res.sheet.getRange(1, 1, args.arrays.length, args.arrays[0].length).setNumberFormat("@").setValues(args.arrays)
    console.timeEnd('setSheetArray: time');
    console.log('setSheetArray: end');
    return {
      "status": "OK",
    }
  }

  const createSpread=(args)=>{
    console.log("createSpread: start, args:" + JSON.stringify(args))
    console.time("createSpread: time")
    const res = checkArgs(args)
    if (res.status === "NG") return res
    const spreadId = SpreadsheetApp.create(args.spread).getId()
    const spreadFile = DriveApp.getFileById(spreadId)
    const folder = DriveApp.getFolderById(folderIds[args.folder])
    spreadFile.moveTo(folder)
    console.timeEnd("createSpread: time")
    console.log("createSpread: end")
    return {
      "status": "OK",
      "id": spreadId,
    }
  }

  const createSheet=(args)=>{
    console.log("createSheet: start, args:" + JSON.stringify(args))
    console.time("createSheet: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res
    const fileId = getFileId(args.spread, args.folder)
    const spreadFile = SpreadsheetApp.openById(fileId)
    spreadFile.insertSheet().setName(args.sheet)
    const delSheet = spreadFile.getSheetByName("シート1")
    if (delSheet !== null) spreadFile.deleteSheet(delSheet)
    args._func = "setSheetArray"
    res = setSheetArray(args)
    if (res.status === "NG") return res
    console.timeEnd("createSheet: time")
    console.log("createSheet: end")
    return {
      "status": "OK",
    }
  }

  const sel=(args)=>{
    console.log("sel: start, args:" + JSON.stringify(args))
    console.time("sel: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res

    args._func = "getSheetArray"
    res = getSheetArray(args)
    if (res.status === "NG") return res

    let indexes=[], arrays = []
    if (res.return.length <= 1 || (typeof(args.indexes) === "undefined" && typeof(args.where) === "undefined")) {
      res.return.forEach((getArray, resIndex)=>{
        if (resIndex !== 0) {
          indexes.push(resIndex)
        }
      })
      arrays = [...res.return]
    } else if (typeof(args.indexes) !== "undefined") {
      arrays.push(res.return[0])
      args.indexes.sort().forEach(index=>{
        indexes.push(index)
        arrays.push(res.return[index])
      })
    } else if (typeof(args.where) !== "undefined") {
      arrays.push(res.return[0])
      let whereIndexes = {}
      res.return[0].forEach((headerCol,index)=>{
        Object.keys(args.where).forEach(whereCol=>{
          if (headerCol === whereCol) whereIndexes[index] = args.where[whereCol]
        })
      })
      res.return.forEach((getArray, resIndex)=>{
        if (resIndex !== 0) {
          let isTarget = true
          Object.keys(whereIndexes).forEach(whereIndex=>{
            if (getArray[whereIndex] !== whereIndexes[whereIndex]) isTarget = false
          })
          if (isTarget) {
            indexes.push(resIndex)
            arrays.push(getArray)
          }
        }
      })
    }

    console.timeEnd("sel: time")
    console.log("sel: end")
    return {
      "status": "OK",
      "indexes": indexes,
      "return": arrays,
    }
  }

  const ins=(args)=>{
    console.log("ins: start, args:" + JSON.stringify(args))
    console.time("ins: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res

    const lastRow = res.sheet.getRange("A:A").getValues().filter(String).length //最終行
    res.sheet.insertRowsAfter(lastRow, args.values.length)
    res.sheet.getRange(lastRow + 1, 1, args.values.length, args.values[0].length).setNumberFormat("@").setValues(args.values)

    console.timeEnd("ins: time")
    console.log("ins: end")
    return {
      "status": "OK",
    }
  }

  const upd=(args)=>{
    console.log("upd: start, args:" + JSON.stringify(args))
    console.time("upd: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res

    args._func = "select"
    let selRes = sel(args)
    if (selRes.status === "NG") return selRes

    // 更新対象の列名を列インデックスに変換してオブジェクトのkeyにして、更新値と対応させる
    let setIndexes = {}
    selRes.return[0].forEach((headerCol,index)=>{
      Object.keys(args.sets).forEach(setCol=>{
        if (headerCol === setCol) setIndexes[index] = args.sets[setCol]
      })
    })

    // select結果の配列順とselRes.indexesと対応している(ヘッダーは除くので-1する)ことを利用して、実際のスプシの行に対応させて行単位で更新する
    selRes.return.forEach((selArray, selIndex)=>{
      if (selIndex !== 0) {
        Object.keys(setIndexes).forEach(setIndex=>{
          selArray[setIndex] = setIndexes[setIndex]
        })
        res.sheet.getRange(selRes.indexes[selIndex - 1] + 1, 1, 1, selArray.length).setNumberFormat("@").setValues([selArray])
      }
    })

    console.timeEnd("upd: time")
    console.log("upd: end")
    return {
      "status": "OK",
      "indexes": selRes.indexes,
    }
  }

  const del=(args)=>{
    console.log("del: start, args:" + JSON.stringify(args))
    console.time("del: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res

    args._func = "select"
    let selRes = sel(args)
    if (selRes.status === "NG") return selRes

    //逆順で1行ずつ削除する方法
    selRes.indexes.slice().reverse().forEach(index=>{
      res.sheet.deleteRow(index + 1)
    })

/*
    // dump->loadのイメージで削除する方法 ... 大量データを削除する際はこちらの方が早いがその場合はアプリ側で実装する方針
    if (selRes.indexes.length > 0) {
      args._func = "getSheetArray"
      let getRes = getSheetArray(args)
      if (getRes.status === "NG") return getRes
      args["arrays"] = []
      getRes.return.forEach((getArray, getIndex)=>{
        if (!selRes.indexes.includes(getIndex)) args.arrays.push(getArray)
      })
      args._func = "setSheetArray"
      let setRes = setSheetArray(args)
      if (setRes.status === "NG") return setRes
    }
*/

    console.timeEnd("del: time")
    console.log("del: end")
    return {
      "status": "OK",
      "indexes": selRes.indexes,
    }
  }

  const temp=(args)=>{
    console.log("temp: start, args:" + JSON.stringify(args))
    console.time("temp: time")
    let res = checkArgs(args)
    if (res.status === "NG") return res
    console.timeEnd("temp: time")
    console.log("temp: end")
    return {
      "status": "OK",
    }
  }

  return {
    "convArraysToJsons": convArraysToJsons,
    "convJsonsToArrays": convJsonsToArrays,
    "isExistFileName": isExistFileName,
    "getSheetArray": getSheetArray,
    "setSheetArray": setSheetArray,
    "createSpread": createSpread,
    "createSheet": createSheet,
    "select": sel,
    "insert": ins,
    "update": upd,
    "delete": del,
  }
}
const sSQL = SpreadsheetSQL()



// app: start
const Funcs=(args={})=>{

  const getRandomDigits=(digits)=>{
    let numPlus=1, numBase=9
    for (let i=1; i<digits; i++) {
      numPlus = numPlus * 10
      numBase = numBase * 10
    }
    return Math.floor(numPlus + Math.random() * numBase).toString()
  }

  const createAccountId=(args)=>{
    console.log("createAccountId: start, args:" + JSON.stringify(args))
    console.time("createAccountId: time")
    let newAccountId
    do {
      newAccountId = getRandomDigits(8)
    } while (sSQL.isExistFileName(newAccountId, "accounts"))
    let res = sSQL.createSpread({
      "spread": newAccountId,
      "folder": "accounts",
      "_func": "createSpread",
    }); if (res.status === "NG") return res
    const nowTime = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd-HH:mm:ss")
    res = sSQL.createSheet({
      "arrays": [
        ["key", "value"],
        ["createTime", nowTime],
        ["lastUpdateTime", nowTime],
        ["accountId", newAccountId],
        ["mailaddress", "aaa@bbb"],
        ["nickname", ""],
      ],
      "sheet": "sheet1",
      "spread": newAccountId,
      "folder": "accounts",
      "_func": "createSheet",
    }); if (res.status === "NG") return res
    console.timeEnd("createAccountId: time")
    console.log("createAccountId: end")
    return {
      "id": newAccountId,
    }
  }

  return {
    "getSheetArray": sSQL.getSheetArray,
    "setSheetArray": sSQL.setSheetArray,
    "createSpread": sSQL.createSpread,
    "createSheet": sSQL.createSheet,
    "select": sSQL.select,
    "insert": sSQL.insert,
    "update": sSQL.update,
    "delete": sSQL.delete,
    "createAccountId": createAccountId,
  }

}
const funcs = Funcs()
// app: end



const doPost=(e)=>{
  console.log("doPost: start")
  const reqJson = JSON.parse(e.postData.getDataAsString());
  console.log("reqJson:" + JSON.stringify(reqJson))
  if (typeof(reqJson.args) === "undefined") reqJson["args"]={}
  reqJson.args["_func"] = reqJson.func

  const lock = LockService.getScriptLock()
  let resJson
  if (lock.tryLock(300 * 1000)) { //5分間スクリプトロック取得トライ
    resJson = funcs[reqJson.func](reqJson.args)
    SpreadsheetApp.flush()
    lock.releaseLock()
  } else {
    resJson = {"status": "NG", "message": "Lock acquisition failed for 5 minutes and timed out"}
  }

  console.log("resJson:" + JSON.stringify(resJson))
  return ContentService.createTextOutput(JSON.stringify(resJson)).setMimeType(ContentService.MimeType.JSON);
}

/*
const doPostTest=(e)=>{
  console.log("doPostTest: start")
  console.log("reqJson:" + JSON.stringify(reqJson))
  if (typeof(reqJson.args) === "undefined") reqJson["args"]={}
  reqJson.args["_func"] = reqJson.func

  const lock = LockService.getScriptLock()
  let resJson
  if (lock.tryLock(300 * 1000)) { //5分間スクリプトロック取得トライ
    resJson = funcs[reqJson.func](reqJson.args)
    SpreadsheetApp.flush()
    lock.releaseLock()
  } else {
    resJson = {"status": "NG", "message": "Lock acquisition failed for 5 minutes and timed out"}
  }

  console.log("resJson:" + JSON.stringify(resJson))
}
*/

/*
const reqJson = {
  func: "getSheetArray",
  args: {
    "sheet": "シート1",
    "spread": "temp",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "setSheetArray",
  args: {
    "arrays": [
      ["col1","col2","col3","col4"],
      ["key1col1","key1col2","key1col3","key1col4"],
      ["key1col1","key2col2","key2col3","key9col4"],
      ["key3col1","key3col2","key3col3","key3col4"],
      ["key4col1","key4col2","key4col3","key4col4"],
      ["key1col1","key2col2","key1col3","key9col4"],
      ["key1col1","key2col2","key2col3","key9col4"],
    ],
    "sheet": "sheet2",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "createSpread",
  args: {
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "createSheet",
  args: {
    "arrays": [
      ["col1","col2","col3","col4"],
    ],
    "sheet": "sheet2",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "select",
  args: {
    "where": {
      "col2": "key4col2",
    },
    "sheet": "sheet1",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "select",
  args: {
    "indexes": [2, 3],
    "sheet": "sheet1",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "insert",
  args: {
    "values": [
      ["key3col1","key4col2","key7col3","key5col4"],
      ["key4col1","key6col2","key7col3","key5col4"],
    ],
    "sheet": "sheet2",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "update",
  args: {
    "sets": {
      "col4": "key2col4",
    },
    "where": {
      "col1": "key6col1",
      "col2": "key6col2",
    },
    "sheet": "sheet2",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "delete",
  args: {
    "indexes": [6, 1, 3],
    // "where": {
    //   "col1": "key1col1",
    //   "col2": "key2col2",
    // },
    "sheet": "sheet1",
    "spread": "temp1",
    "folder": "spreads",
  },
}
*/

/*
const reqJson = {
  func: "createAccountId",
}
*/

/*
const reqJson = {
  func: "update",
  args: {
    "sets": {
      "value": "hoge4@hoge.com",
    },
    "where": {
      "key": "mailaddress",
    },
    "sheet": "sheet1",
    "spread": "59532571",
    "folder": "accounts",
  },
}
*/

