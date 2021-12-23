
var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(cacheName).then(function(cache) {
      cache.match(e.request).then(function(cacheResponse) {
        if(cacheResponse){
          fetch(e.request).then(function(networkResponse){
            cache.put(e.request,networkResponse);
          })
          return cacheResponse;
        }
        return fetch(e.request);
      })
    })
  );
});