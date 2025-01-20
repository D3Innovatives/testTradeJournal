import { ExpirationPlugin } from 'workbox-expiration'
import { createHandlerBoundToURL, precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Register precache routes
precacheAndRoute(self.__WB_MANIFEST || [])

// Clean up old cache
cleanupOutdatedCaches()

// Cache strategies
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 5184000 }),
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
)

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: "gstatic-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 5184000 }),
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
)

// Install and activate
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

// Push notification handler
self.addEventListener('push', function(e) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return
  }

  if (e.data) {
    const message = e.data.json()
    e.waitUntil(
      self.registration.showNotification(message.title, {
        body: message.body,
        icon: '/icons/icon-192x192.png',
        tag: 'trade-notification',
        renotify: true,
        data: { timestamp: Date.now() }
      })
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
}) 