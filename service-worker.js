let MY_CACHE = 'mycache-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(MY_CACHE).then(function (cache) {
            return cache.addAll(
                [
                    '.',
                    './manifest.json'
                ]
            );
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
      caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== MY_CACHE) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(MY_CACHE)
        .then(function (cache) {
            return fetch(event.request)
                .then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(function () {
                    return caches.match(event.request);
                })
        })
    );
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       fetch(event.request).catch(function() {
//         return caches.match(event.request);
//       })
//     );
//   });

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.open('myCache').then(function (cache) {
//             console.log(event.request.url);
//             return cache.match(event.request).then(function (response) {
//                 return response || fetch(event.request).then(function (response) {
//                     cache.put(event.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });