
var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
  'error_connect.html',
];

const foldersToCache = [
  '/aelmardhi',
  'games',
  '/dithering',
  '/filter',
  '/jpeg',
  '/jpeg',
  '/screenRecorder',
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
  e.respondWith((async ()=>{
    let cache = await caches.open(cacheName);
    let cacheResponse = await cache.match(e.request);
    if(cacheResponse){
      fetch(e.request).then(function(networkResponse){
        cache.put(e.request,networkResponse);
      })
      return cacheResponse;
    }
    try{
    let networkResponse = await fetch(e.request)
    const path = new URL(e.request.url).pathname
    if(foldersToCache.some(l=> path.match(l))){
      cache.put(e.request,networkResponse);
    }
    return networkResponse
    }catch (e){
     return await cache.match('error_connect.html');
    }
  })())

});

// Immediately take control of the page, see the 'Immediate Claim' recipe
// for a detailed explanation of the implementation of the following two
// event listeners.

// self.addEventListener('install', function(event) {
//   event.waitUntil(self.skipWaiting());
// });

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  event.waitUntil(
    // Retrieve a list of the clients of this service worker.
    self.clients.matchAll().then(function(clientList) {
      // Check if there's at least one focused client.
      var focused = clientList.some(function(client) {
        return client.focused;
      });
      var payload = event.data.json();
      // var notificationMessage;
      // if (focused) {
      //   notificationMessage = 'You\'re still here, thanks!';
      // } else if (clientList.length > 0) {
      //   notificationMessage = 'You haven\'t closed the page, ' +
      //                         'click here to focus it!';
      // } else {
      //   notificationMessage = 'You have closed the page, ' +
      //                         'click here to re-open it!';
      // }

      
      return self.registration.showNotification('Dardasha', {
        body: payload.body,
        title: payload.title,
        icon:'/icons/icon144.png',
        badge:'/icons/icon192_maskable.png',
      });
    })
  );
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
    // Retrieve a list of the clients of this service worker.
    self.clients.matchAll().then(function(clientList) {
      // If there is at least one client, focus it.
      if (clientList.length > 0) {
        return clientList[0].focus();
      }

      // Otherwise, open a new page.
      return self.clients.openWindow('/index.html');
    })
  );
});