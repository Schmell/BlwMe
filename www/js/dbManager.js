//import APP from './app.js'

const DBM = {
    DB: null,
    SW: null,

    init() {
        DB.registerServiceWorker()
        DB.openDB()
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register a service worker hosted at the root of the site
            navigator.serviceWorker.register('/www/sw.js')
                .then( (registration) => {
                        APP.SW = registration.installing || registration.waiting || registration.active;
                    },
                    (error) => {
                        console.log('Service worker registration failed:', error);
                    }
                ); // then
            navigator.serviceWorker.addEventListener('controllerchange', async () => {
                APP.SW = navigator.serviceWorker.controller;
                })
    
            navigator.serviceWorker.addEventListener('message', APP.onMessage);

        } else {
          console.log('Service workers are not supported.');
        }
    } // registerServiceWorker
} // DBM
