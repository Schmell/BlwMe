# BlwMe

<br/>
This is a third party app for the popular **Sailwave sailboat scoring** application.  
The idea is that you would import your *.blw sailwave file and that will automaticlly set up your races and competitors.  

When on the water you can simply select and cue competitors as they approach the finish and press a single button as they finish.  
This app will work off line bd the informtion is stored, plus you can download an entire updated original *.blw that all you hve to is open and press score series. Or download the results.csv and imoprt into sailwave series  

Currently this works on your phone, but is not a very responsive design and things are a little small.  
<br/>

## Usage:

First open the **localStorage.html** and select the one 1 of the WedSummer---.blw or MyNewTest.blw (empty races) files from the repos blw folder (the others don't always work)

Then go to **Racing.html** and that should populte the indexedDB (you may have to refresh). You can use chrome dev tools under the application tab to see the database and localStorage items

I have a github page set up for this at https://Schmell.github.io/BlwMe/www, but you will need to download one of the suggested files from the repo in the blw folder

<hr/>
Select a race to begin editing (Dark colored are races that have been sailed). I recommend using Race 3 to start

The idea is that you cue multiple competitors as you see the boats approach the finish line.  

While the competitor is cued you can click to un-cue or use adjustment button to change cue order  

When the boats cross the line use the finish button to add a finish time to competitor

When the boat is finished you can now use the adjustment buttons to add or subtract seconds from the finish time. You can also double click the finish time to bring up a full text edit

<br/>

Once the race is complete, pressing save will save the whole .blw file with the added results for that current race in it to localStorage of the browser.
The button should change to download and that will download file with .blw extension.

If this file is opened with sailwave the results will already be in there and all that would be needed is to press score series button and it should work.

<br/>

The export button will give you a download csv that you need to import (file menu) into the sailwave series first and then score the series.

<br/>

**In hind sight** using the export/import feature would have been the way to go as it takes way less code and is simpler than trying to keep "the one" file synced in central location. However I now have some tools i can re-use if i wnat to make a full featured sailwave clone as an imort/export to sailwave

<hr/>

DbManger uses a serviceworker to serve up indexedDb stuff, but i felt is was redundant, but might be a thing if the server DB is not dexie cloud (indexedDb server side)


## TODO:

There are all kinds of problems with this app and I don't really plan to fix them all as want to move on and make this a PWA using some more modern frameworks an libraries (React , dexie.js, graphql, node, etc..)

I would like to be able to read/write to a ftp, but i think this will be awkward anyway because sailwave cant realy do read/write to ftp without some kind off set up
