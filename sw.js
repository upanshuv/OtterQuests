// This service worker exists ONLY to remove itself and any old cached
// version of this app from devices that installed it before this fix.
// Any device stuck on an old service worker was silently serving stale
// JavaScript (from before group-quest syncing existed) and never
// contacting Firestore correctly — this forces every device back to
// always fetching fresh files from the network.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});
