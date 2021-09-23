
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

    function writeResult(resultObj){
      if(resultObj.compId){
        let tx = getStore("results",'readwrite');
        tx.openCursor(resultObj.id).onsuccess = function(e){
          var cursor = e.target.result;
          if (cursor){
            console.log('result already entered');
          }else{
            tx.add(resultObj)
            console.log('add result:', resultObj.boat);
          }
        } 
      }else{
        console.log("no resultObj")
      }
    } // writeResult
    