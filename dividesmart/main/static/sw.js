

const version = "0.0.1"
const cacheName = `weshare-${version}`

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('install service worker and cache data')
      return cache.addAll([
        `/`,
        // `/login/`,
        `/static/bundle/main/index.js`,
        // `/static/bundle/main/login.js`,
      ]).then(() => self.skipWaiting())
    })
  )
})

self.addEventListener('activate', event => {
  console.log('active and control this domain')
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log(event.request.url)
  if (!event.request.url.includes('login'))
    event.respondWith(
      caches.open(cacheName).then(cache => cache.match(event.request))
      .then(response => {
        if (response) {
          console.log('hit')
          return response
        }
        else {
          console.log('not hit')
          return fetch(event.request);
        }
      })
    )
})
