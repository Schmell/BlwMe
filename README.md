# BlwMe

**Usage:**
First open the **localManager.html** and select the one 1 of the WedSummer---.blw or MyNewTest.blw (empty races) files from the repos blw folder (the others don't always work)

Then go to **Racing.html** and that should populte the indexedDB (you may have to refresh). You can use chrome dev tools under the application tab to see the database and localStorage items

<hr/>
Select a race to begin editing (Dark colored are races that have been sailed). I recommend using Race 3 to start

The idea is that you cue multiple competitors as they would approach the finish line.
While the competitor is cued you can click to un-cue or use adjustment button to change cue order
When the boats cross the line use the finish button to add a finish time to competitor
When the boat is finished you can now use the adjustment buttons to add or subtract seconds from the finish time. You can also double click the finish time to bring up a full text edit

Once the race is complete, pressing save will save the whole .blw file with the added results for that current race in it to localStorage of the browser.
The button should change to download and that will download file with .blw extension.
If this file is opened with sailwave the results will already be in there and all that would be needed is to press score series button and it should work.
<br/>

<hr/>
TODO:

There are all kinds of problems with this app and I don't really plan to fix them all as want to move on and make this a PWA using some more modern frameworks an libraries (React , dexie.js, graphql, node, etc..)
