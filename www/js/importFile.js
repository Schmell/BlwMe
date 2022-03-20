const Csv = {
  // Use file from file input button
  fromInput: function (e) {
    let file;
    let fileName;
    let url;
    if (e.target.files) {
      file = e.target.files[0];
    } else {
      url = e.target.urlSelect.value;
      fileName = url.substr(url.lastIndexOf("/") + 1);
      console.log("target file: ", url);
      e.preventDefault();
      // Return some file info
      file = {
        name: fileName,
        url: url,
      };
    }

    // Organize localstorage so we can tell if file is current
    let last = JSON.parse(localStorage.getItem("using"));
    if (!last) {
      console.log("no last");
      last = {};
      last.name = "nofile";
      last.lastModified = Date.now();
    }

    if (
      file.name != last.name ||
      (file.lastModified != last.lastModified && last)
    ) {
      console.log("File has been changed, using new file");
      // Back up old file and remove current so we can store new file
      let oldFile = localStorage.getItem("currentFile");
      let notUsing = localStorage.getItem("using");
      localStorage.setItem("oldFile", oldFile);
      localStorage.setItem("notUsing", notUsing);
      localStorage.removeItem("currentFile");
      localStorage.removeItem("using");

      // if there is url then it is fromUrl file
      if (file.url) {
        file = file.url;
      }
      Papa.parse(file, {
        // download: true,
        complete: function (results) {
          let unParsed = Papa.unparse(results.data, {
            quotes: true,
            quoteChar: '"',
          });

          // Cant seem to figure out how to get File info
          // so just make so me dummy stuff
          if (!file.name) {
            file = {
              name: fileName,
              url: url,
              lastModified: "?",
              lastModifiedDate: "?",
              size: "?",
            };
          }

          let fileArr = {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            size: file.size,
          };
          localStorage.setItem("using", JSON.stringify(fileArr));
          localStorage.setItem("currentFile", unParsed);
        },
      });
    } else {
      console.log("File not changed, using file from storage");
      console.log("using:", JSON.parse(localStorage.getItem("using")));
    }
  }, // fromInput

  fromUrl: function (e) {
    let url = document.querySelector("#urlSelect").value;
  },

  backUpCurrent: function () {
    let file = localStorage.getItem("currentFile");
    console.log("file: ", file);
    var myBlob = URL.createObjectURL(new Blob([file]));
    console.log("myBlob: ", myBlob);
    // var request = require("request");
    return myBlob;
  },

  getStarts: function () {
    let file = localStorage.getItem("currentFile");
    let parsed = Papa.parse(file);
    let data = parsed.data;
    let startData = [];
  },

  getComps: function () {
    let file = localStorage.getItem("currentFile");
    let parsed = Papa.parse(file);
    let data = parsed.data;

    var compData = [];
    // Filter for csv property that is on every comp
    // to make an array of all comps ids
    var compBoats = data.filter(function (item) {
      return item[0] == "comphigh";
    });

    compBoats.sort().forEach(function (compBoat) {
      let competitor = {};
      competitor.id = parseInt(compBoat[2]);
      competitor.compid = compBoat[2];
      let compRows = data.filter(function (item) {
        var regex = new RegExp(`^comp`, "g");
        return item[0].match(regex) && item[2] == compBoat[2];
      });
      compRows.forEach(function (item) {
        const newName = item[0].replace("comp", "");
        competitor[newName] = item[1];
      });
      compData.push(competitor);
    }); //each compBoats
    var sorted = compData.sort(function (a, b) {
      return a.boat - b.boat;
    });
    //console.log(compData)
    return compData;
  }, // getComps

  /** RESULT ROWS
   *   This is the result rows from blw file
   *   "rft","19:37:23","26","106"
   *   "rst","18:40:00","26","106"
   *   "rpts","5","26","106"
   *   "rpos","5","26","106"
   *   "rdisc","0","26","106"
   *   "rcor","0:57:05","26","106"
   *   "rrestyp","4","26","106"
   *   "rele","0:57:23","26","106"
   *   "srat","0","26","106"
   *   "rewin","0:06:21","26","106"
   *   "rrwin","238.841","26","106"
   *   "rrset","0","26","106"
   */

  getResults: function () {
    let file = localStorage.getItem("currentFile");
    let parsed = Papa.parse(file);
    let data = parsed.data;

    let resultsArr = [];
    // Filter results using a prperty that always exists on result
    // to make results array
    let results = data.filter((item) => {
      return item[0] == "rdisc";
    });
    //console.log('results', results)
    results.forEach(function (result) {
      // have to map this manually as there is no prefix
      let resultRow = {
        id: parseInt(result[3] + result[2]),
        compid: result[2],
        raceid: result[3],
        finish: Csv.resultHelp("rft", data, result),
        start: Csv.resultHelp("rst", data, result),
        points: Csv.resultHelp("rpts", data, result),
        position: Csv.resultHelp("rpos", data, result),
        discard: Csv.resultHelp("rdisc", data, result),
        corrected: Csv.resultHelp("rcor", data, result),
        rrestyp: Csv.resultHelp("rrestyp", data, result),
        elapsed: Csv.resultHelp("rele", data, result),
        srat: Csv.resultHelp("srat", data, result),
        rewin: Csv.resultHelp("rewin", data, result),
        rrwin: Csv.resultHelp("rrwin", data, result),
        rrset: Csv.resultHelp("rrset", data, result),
      };
      resultsArr.push(resultRow);
    }); // forEach
    //console.log(resultsArr);
    return resultsArr;
  }, // getResults

  resultHelp: function (resultTag, data, result) {
    let res = data.filter(function (item) {
      // console.log(resultTag);
      return (
        item[0] == resultTag && item[2] == result[2] && item[3] == result[3]
      );
    });
    if (res[0]) {
      return res[0][1];
    }
  }, // resultsHelp

  getFleets: function () {
    let file = localStorage.getItem("currentFile");
    let parsed = Papa.parse(file);
    let data = parsed.data;
    var fleetsRaw = data.filter(function (item) {
      return item[0] == "serpubgroupvalues";
    });
    var fleets = fleetsRaw[0][1].match(/[^|]+/g);
    //console.log(fleets);
    return fleets;
  }, // getFleets

  getRaces: function () {
    let file = localStorage.getItem("currentFile");
    let parsed = Papa.parse(file);
    let data = parsed.data;
    var raceData = [];
    //races =[0-racename,1-NAME,2-space,3-ID]
    var races = data.filter(function (item) {
      return item[0] == "racerank";
    });
    races.forEach(function (race) {
      //console.log('race',race)
      var raceObj = {};
      raceObj.id = parseInt(race[3]);
      raceObj.raceid = race[3];
      let resultRows = data.filter(function (item) {
        var regex = new RegExp(`^race`, "g");
        return item[0].match(regex) && item[3] == race[3];
      });
      let raceStarts = [];
      resultRows.forEach((item) => {
        if (item[0] == "racestart") {
          let stringToSplit = item[1].split("|");
          let fleetStart = stringToSplit[1];
          let fleetName = stringToSplit[0].split("^")[1];
          // console.log(fleetStart, fleetName);
          raceStarts.push({ fleet: fleetName, start: fleetStart });
        } else {
          const newName = item[0].replace("race", "");
          raceObj[newName] = item[1];
        }
      });
      raceStarts.forEach((start) => {
        raceObj.starts = raceStarts;
      });
      // for (let i = 0; i < raceStarts.length; i++) {
      //   raceObj.racestart = raceStarts;
      // }
      raceData.push(raceObj);
    });

    return raceData;
  }, // getRaces

  getSeries: () => {
    const file = localStorage.getItem("currentFile");
    const parsed = Papa.parse(file);
    const data = parsed.data;
    let seriesData = [];
    const seriesRows = data.filter((item) => {
      const regex = new RegExp(`^ser`, "g");
      return item[0].match(regex);
    });

    let seriesObj = {};
    seriesRows.forEach((item) => {
      const newName = item[0].replace("ser", "");
      seriesObj[newName] = item[1];
    });

    seriesData.push(seriesObj);
    return seriesData;
  }, // getSeries

  downloadURL: function (url, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  },

  downloadFile: function (localStoreFile) {
    var data = localStorage.getItem("savedFile");
    var blob = new Blob([data], { type: "text/txt" });
    var url = window.URL.createObjectURL(blob);
    var using = JSON.parse(localStorage.getItem("using"));
    // console.log(using)
    downloadURL(url, using.name);
  },
}; // Csv namespace
