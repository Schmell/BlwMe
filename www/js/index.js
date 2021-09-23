/**
 * cordova create [folder] [packagename] [app name]
 *
 * cordova platform add ios
 * cordova platform add android
 *
 * cordova plugin add cordova-plugin-camera --variable CAMERA_USAGE_DESCRIPTION="your usage message"  --variable PHOTOLIBRARY_USAGE_DESCRIPTION="your usage message"
 * cordova plugin add cordova-plugin-file
 *
 * navigator.camera.getPicture(success, fail, options)
 * success(fileuri)
 *
 * resolveLocalFileSystemURL(path, success, fail)
 *
 * success returns either
 * directoryEntry
 *  .getDirectory(name, {create:true}, success, fail)
 *  .getFile("newFile.txt", {create: true}, success, fail)
 * fileEntry
 *  .isFile
 *
 * which inherit from
 * Entry
 * .nativeURL - absolute device OS path to file. entry.toURL() method
 * .fullPath - relative to the HTML root
 * .toInternalURL() - returns a cdvfile:// path
 *    Add <access origin="cdvfile://*" /> to config.xml
 *    Add cdvfile: to your Content-Security-Policy
 * .name
 * .type
 * .copyTo()
 * .remove()
 *
 * cordova.file.dataDirectory - save your permanent files here
 * cordova.file.applicationDirectory + "www/" - your www folder for your Cordova project
 *
 * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html
 * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html
 *
 * Error Codes for Files
 * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#list-of-error-codes-and-meanings
 * Writing to a file
 * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#write-to-a-file
 */





var app = {
    tempURL: null,
    permFolder: null,
    oldFile: null,
    permFile: null,
    KEY: "OLDfileNAMEkey",

    init: () => {
        setTimeout(function() {
            console.log("File system/plugin is ready");
            app.addListeners();
            app.getPermFolder();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            navigator.webkitPersistentStorage.requestQuota(1024*1024*1024, function(grantedBytes) {
                window.webkitRequestFileSystem(LocalFileSystem.PERSISTENT, grantedBytes, onFileSystemSuccess.bind(this), this.errorHandler);
            }, function(e) {
                console.log('Error', e);
            });
        }, 2000);


    },

    addListeners: () => {
        document.getElementById("file").addEventListener("input", app.getFile);
    //document.getElementById("btnFile").addEventListener("click", app.copyImage);
    },

    getFile: (e) => {
        console.log('file',e.target.value)
    },


    getPermFolder: () => {
        let path = cordova.file.dataDirectory;
        console.log('path', path, app.permFolder)
        //save the reference to the folder as a global app property
        resolveLocalFileSystemURL(
          path,
          dirEntry => {
            //create the permanent folder
            dirEntry.getDirectory(
                "blw_files", { create: true },
                permDir => {
                    app.permFolder = permDir;
                    console.log("Created or opened", permDir.nativeURL);
                //check for an old image from last time app ran
                    //app.loadOldImage();
                },
                err => {
                    console.warn("failed to create or open permanent image dir");
              }
            );
          },
          err => {
            console.warn("We should not be getting an error yet");
          }
        );
    },
};// app
document.addEventListener("deviceready", function() {
  app.init();
}, false);
//const ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";
//document.addEventListener(ready, app.init);
