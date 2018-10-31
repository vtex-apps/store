self.addEventListener('install', function(event) {
  console.log('sw event: ', event)
  event.waitUntil(Promise.resolve(true))
})
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate: ', e)
})
