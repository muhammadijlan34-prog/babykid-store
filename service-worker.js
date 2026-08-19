/* =========================================================
   BABY KID
   FILE 8 — service-worker.js
   ========================================================= */

const CACHE_NAME = "baby-kid-v1";


const CORE_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./products.html",
    "./product.html",
    "./gallery.html",
    "./manifest.json"
];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        CORE_FILES
                    );

                })

        );


        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames
                            .filter(
                                cacheName =>
                                    cacheName !== CACHE_NAME
                            )
                            .map(
                                cacheName =>
                                    caches.delete(
                                        cacheName
                                    )
                            )

                    );

                })

        );


        self.clients.claim();

    }
);


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
    "fetch",
    event => {

        /*
         * Only handle GET requests.
         */

        if (event.request.method !== "GET") {
            return;
        }


        event.respondWith(

            caches.match(event.request)
                .then(cachedResponse => {

                    /*
                     * Use cached file if available.
                     */

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    /*
                     * Otherwise request it
                     * from the network.
                     */

                    return fetch(event.request)
                        .then(networkResponse => {

                            /*
                             * Save successful responses
                             * for future visits.
                             */

                            if (
                                networkResponse &&
                                networkResponse.status === 200 &&
                                networkResponse.type === "basic"
                            ) {

                                const responseClone =
                                    networkResponse.clone();


                                caches.open(CACHE_NAME)
                                    .then(cache => {

                                        cache.put(
                                            event.request,
                                            responseClone
                                        );

                                    });

                            }


                            return networkResponse;

                        })
                        .catch(() => {

                            /*
                             * If network is unavailable,
                             * fall back to the home page.
                             */

                            return caches.match(
                                "./index.html"
                            );

                        });

                })

        );

    }
);