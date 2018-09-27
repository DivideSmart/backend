

const version = "0.0.1"
const cacheName = `weshare-${version}`
const cacheAssets = [
  `/`,
  `/static/bundle/main/index.js`,

  // `/login/`,
  // `/static/bundle/main/login.js`,
]


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('SW: installed and cache data')
      return cache.addAll(cacheAssets).then(() => self.skipWaiting())
    })
  )
})


self.addEventListener('activate', event => {
  console.log('SW: active and control this domain')
  event.waitUntil(
    self.clients.claim().then(() => {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== cacheName) {
              console.log('SW: clearing old cache')
              return caches.delete(cache)
            }
          })
        )
      })
    })
  );
})


self.addEventListener('fetch', event => {
  if (event.request.url.includes('login') || event.request.method != 'GET')
    return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone()
        caches
          .open(cacheName)
          .then(cache => {
            cache.put(event.request.url, responseClone)
          })
        return response
      })
      .catch(() => {
        return caches
                .open(cacheName).then(cache => cache.match(event.request.url))
                .then(response => {
                  if (response) {
                    console.log('SW offline: hit')
                    console.log(event.request.url)
                    return response
                  }
                })
      })
  )
})














