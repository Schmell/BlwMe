const version = 5;
const defaultStore = "stores";
var db;
const logging = false;
var LL = console.log;
self.addEventListener("install", (e) => {
  // add stuff to cache
  log("dbManager: install", e);
});
self.addEventListener("activate", (e) => {
  // clean up old stuff
  e.waitUntil(clients.claim());
  log("dbManager: activate", e);
});
self.addEventListener("fetch", (e) => {
  // manage fetching for cache or not
  //log('dbManager: fetch',e)
});

self.addEventListener("message", (e) => {
  // manage messages from browser
  log("dbManager: message", e);

  let data = e.data;
  let clientId = e.source.id;

  if ("getRaces" in data) {
    gimmeDb(data, clientId, getRaces);
  } // get races

  if ("getRace" in data) {
    gimmeDb(data, clientId, getRace);
  }
  if ("getResults" in data) {
    gimmeDb(data, clientId, getResults);
  }
  if ("getResult" in data) {
    gimmeDb(data, clientId, getResult);
  }
  if ("getComps" in data) {
    gimmeDb(data, clientId, getComps);
  }
  if ("getComp" in data) {
    gimmeDb(data, clientId, getComp);
  }
}); // message

function gimmeDb(data, clientId, callback) {
  if (db) {
    callback(data, clientId);
  } else {
    openDatabase(() => {
      log("new openDb");
      callback(data, clientId);
    });
  }
}

function getRaces(data, clientId) {
  let store = getStore("races").getAll();
  store.onsuccess = () => {
    //LL("store result: ", store.result);
    sendMessage({ message: { racesReturned: store.result } }, clientId);
  };
}

function getRace(data, clientId) {
  let store = getStore("races").get(data.getRace)
  store.onsuccess = ()=>{
    log(store.result)
    sendMessage({ message: { racesReturned: store.result } }, clientId);

  }
}

function getResults(data, clientId) {
  let store = getStore("results").getAll()
  store.onsuccess = ()=>{
    log(store.result)
    sendMessage({ message: { resultsReturned: store.result } }, clientId);

  }
}

function getResult(data, clientId) {
  let store = getStore("results").get(data.getResult)
  store.onsuccess = ()=>{
    log(store.result)
    sendMessage({ message: { resultsReturned: store.result } }, clientId);

  }
}
function getComps(data, clientId) {
  let store = getStore("comps").getAll()
  store.onsuccess = ()=>{
    log(store.result)
    sendMessage({ message: { compsReturned: store.result } }, clientId);

  }
}
function getComp(data, clientId) {
  LL(data.getComp)
  let store = getStore("comps").get(data.getComp)
  store.onsuccess = ()=>{
    log(store.result)
    sendMessage({ message: { compsReturned: store.result } }, clientId);

  }
}

const sendMessage = async (msg, clientId) => {
  let allClients = [];
  if (clientId) {
    //LL('got cient id',msg)
    let client = await clients.get(clientId);
    allClients.push(client);
  } else {
    log("no client id");
    allClients = await clients.matchAll({ includeUncontrolled: true });
  }
  return Promise.all(
    allClients.map((client) => {
      log("postMessage", msg, "to", client.id);
      return client.postMessage(msg);
    })
  );
};
function makeTx(storeName, mode) {
  if (mode == "undefined") {
    mode = "readwrite";
  }
  let tx = db.transaction(storeName, mode);
  tx.onerror = (err) => {
    console.error("makeTX onerror", err.target.error);
  };
  return tx;
}
function getStore(storeName, mode) {
  let store = makeTx(storeName, mode).objectStore(storeName);
  return store;
}
const openDatabase = function (callback) {
  // if (!window.indexedDB) { console.log("Your browser doesn't support a stable version of IndexedDB."); }
  const dbVersion = 10;
  //if(!name){name = defaultStore}
  let dbOpen = indexedDB.open("store", dbVersion);

  dbOpen.onupgradeneeded = function (e) {
    log("onupgradeneeded", dbVersion);
    db = e.target.result;

    if (!db.objectStoreNames.contains("races")) {
      let store = db.createObjectStore("races", { keyPath: "id" });
      store.createIndex("name", "name", { unique: true });
      store.createIndex("date", "date", { unique: false });
      store.createIndex("time", "time", { unique: false });
      store.createIndex("sailed", "sailed", { unique: false });
    }

    if (!db.objectStoreNames.contains("comps")) {
      let store = db.createObjectStore("comps", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("compid", "compid", { unique: false });
      store.createIndex("boat", "boat", { unique: true });
      store.createIndex("fleet", "fleet", { unique: false });
      store.createIndex("helm", "helm", { unique: true });
      store.createIndex("sailno", "sailno", { unique: false });
      store.createIndex("class", "class", { unique: false });
      store.createIndex("rank", "rank", { unique: false });
      store.createIndex("nett", "nett", { unique: false });
      store.createIndex("total", "total", { unique: false });
    }

    if (!db.objectStoreNames.contains("fleets")) {
      let store = db.createObjectStore("fleets", { keyPath: "id" });
      store.createIndex("name", "name", { unique: false });
    }

    if (!db.objectStoreNames.contains("results")) {
      let store = db.createObjectStore("results", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("raceid", "raceid", { unique: false });
      store.createIndex("compid", "compid", { unique: false });
      store.createIndex("start", "start", { unique: false });
      store.createIndex("elapsed", "elapsed", { unique: false });
      store.createIndex("finish", "finish", { unique: false });
    }
    if (!db.objectStoreNames.contains("series")) {
      let store = db.createObjectStore("series", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("using")) {
      let store = db.createObjectStore("using", { keyPath: "id" });
    }

    return db;
  }; // onupgradeneeded

  dbOpen.onerror = function (err) {
    console.log("DBOpen-Error", err.target.error);
  };
  dbOpen.onblocked = function (e) {
    console.log("onblocked", e.target.result);
  };
  dbOpen.onsuccess = function (e) {
    db = e.target.result;
    if (callback) {
      callback();
    }
  };
}; // openDatabase

function log(e, eObj) {
  if (logging) {
    console.log(e, eObj);
  }
}