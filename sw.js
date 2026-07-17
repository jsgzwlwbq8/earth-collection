const CACHE_NAME = "earth-collection-v19";
const FILES = [
  "./",
  "./index.html",
  "./styles.css?v=11",
  "./china-cities.js?v=2",
  "./popular-cities.js?v=1",
  "./app.js?v=13",
  "./local-share.js?v=1",
  "./shared-diary.js?v=1",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
