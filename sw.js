const CACHE_NAME = "an-quy-che-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.jpg"
];

/* INSTALL */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(res =>
      res ||
      fetch(e.request).then(netRes => {
        return caches.open(CACHE_NAME).then(c => {
          c.put(e.request, netRes.clone());
          return netRes;
        });
      })
    )
  );
});
