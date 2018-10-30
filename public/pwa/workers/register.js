console.log('navigator: ', navigator)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register(
        '/_v/private/assets/v1/linked/vtex.store@1.26.0/public/pwa/workers/register.js'
      )
      .then(function(registration) {
        // Registration was successful
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        )
      })
      .catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      })
  })
}
