    var db;
    var dbPromise;
    const dbVersion = 1;
    function openDatabase(name){
        if (!window.indexedDB) { console.log("Your browser doesn't support a stable version of IndexedDB."); }

        let dbPromise = indexedDB.open(name, dbVersion);
    
        dbPromise.onupgradeneeded = function(e) {
            console.log('onupgradeneeded');
            db = e.target.result;
        
            if (!db.objectStoreNames.contains('races')) {
                let store = db.createObjectStore('races', {keyPath: 'id'});
                store.createIndex("name", "name", { unique: true });
                store.createIndex("date", "date", { unique: false });
                store.createIndex("time", "time", { unique: false });
                store.createIndex("sailed", "sailed", { unique: false });
            }
        
            if (!db.objectStoreNames.contains('comps')) {
                let store = db.createObjectStore('comps', {keyPath: 'id'});
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
        
            if (!db.objectStoreNames.contains('fleets')) {
                let store = db.createObjectStore('fleets', {keyPath: 'id'});
                store.createIndex("name", "name", { unique: false });
            }
        
            if (!db.objectStoreNames.contains('results')) { 
                let store = db.createObjectStore('results', {keyPath: 'id', autoIncrement:true});
                store.createIndex("raceid", "raceid", { unique: false });
                store.createIndex("compid", "compid", { unique: false });
                store.createIndex("start", "start", { unique: false });
                store.createIndex("elapsed", "elapsed", { unique: false });
                store.createIndex("finish", "finish", { unique: false });
            }
            return db;
    
        }; // onupgradeneeded
    
        dbPromise.onerror = function(e) { console.warn("Error", e.target.result); };

        dbPromise.onsuccess = function(e) {
            db = e.target.result;
            writeRacesDB(db);
            writeCompsDB(db);
            writeFleetsDB(db)
            writeResultsDB(db)
            return db;
        };

    } // openDatabase
//  var dbw = openDatabase('store');

    function writeCompsDB(db){
        let comps = Csv.getComps()
        let transaction = db.transaction("comps", "readwrite");
        let compsData = transaction.objectStore("comps");
        comps.forEach(function(comps){
          let comp = {
              'boat': comps.compboat, 
              'rating': comps.comprating, 
              'fleet': comps.compfleet, 
              'id': comps.compid, 
              'helm': comps.comphelmname, 
              'alias':comps.compalias, 
              'club':comps.compclub, 
              'exclude':comps.compexclude, 
              'high':comps.comphigh, 
              'medicalflag':comps.compmedicalflag, 
              'nett':comps.compnett, 
              'rank':comps.comprank, 
              'total':comps.comptotal
            }
          let request = compsData.add(comp);
          //console.log(comp);
        });
    }

    function writeFleetsDB(db){
         let fleets = Csv.getFleets();
        let tx = makeTX('fleets', 'readwrite');
        let store = tx.objectStore('fleets')
        for (let i = 0; i < fleets.length; i++) {
          let fleet = {'name':fleets[i],'id':i}
          let request = store.put(fleet);
        }
        store.onerror = function(e){
          console.warn('onerror',e)
        }
    }
    
    function writeRacesDB(db){
        let races = Csv.getRaces();
        let transaction = makeTX("races", "readwrite");
        let racesData = transaction.objectStore("races");
        
        for (let i = 0; i < races.length; i++) {
          let race = {
            'id':races[i].id,
            'raceid':races[i].raceid,
            'name':races[i].racename,
            'date':races[i].racedate, 
            'notes':races[i].racenotes, 
            'rank':races[i].racerank, 
            'sailed': races[i].racesailed, 
            'start':races[i].racestart, 
            'time':races[i].racetime
            }
          let request = racesData.put(race);
          //console.log('race',race);
        }
    }

    function writeResultsDB(db){
        let results = Csv.getResults();
        //LL(results)  
        let transaction = makeTX("results", "readwrite");
        let resultsData = transaction.objectStore("results");
        for (let i = 0; i < results.length; i++) {

            let request = resultsData.put(results[i]);
            //console.log(results[i]);
        }
    }

