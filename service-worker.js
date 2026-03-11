const CACHE_NAME = "rrinvest-cache-v5";

const urlsToCache = [
  "/RRinvest/",
  "/RRinvest/index.html",
  "/RRinvest/login.html",
  "/RRinvest/style.css",
  "/RRinvest/config.js",
  "/RRinvest/manifest.json",
  "/RRinvest/icons/icon-192.png",
  "/RRinvest/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.log("Falha ao cachear:", url);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone).catch(() => {});
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
