var reader; //GLOBAL File Reader object for demo purpose only

    /**
     * Check for the various File API support.
     */
    

    /**
     * read text input
     */
    function readText(filePath) {
        var output = ""; //placeholder for text output
        if(filePath.files && filePath.files[0]) {
            reader.onload = function (e) {
                output = e.target.result;
                displayContents(output);
            };//end onload()
            reader.readAsText(filePath.files[0]);
        }//end if html5 filelist support
        return true;
    }

    /**
     * display content using a basic HTML replacement
     */
    function displayContents(txt) {
        //var el = document.getElementById('main');
        //el.innerHTML = txt; //display output in DOM
        console.log('displayContents')
        //let data = Pap
    }