importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')

workbox.setConfig({
  debug: false
})

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Create a custom cache for trade state
const TRADE_CACHE = 'trade-state-v1'

// Handle background notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-trade') {
    event.waitUntil(checkActiveTrade())
  }
})

async function checkActiveTrade() {
  try {
    const cache = await caches.open(TRADE_CACHE)
    const response = await cache.match('activeTradeState')
    if (response) {
      const data = await response.json()
      if (data.isActive) {
        const timeSinceStart = data.startTime 
          ? Math.floor((Date.now() - new Date(data.startTime).getTime()) / 60000)
          : 0

        await self.registration.showNotification('Active Trade Reminder', {
          body: `Trade running for ${timeSinceStart} minutes. Check your position!`,
          icon: '/icons/icon-192x192.png',
          tag: 'trade-notification',
          renotify: true,
          data: { timestamp: Date.now() }
        })
      }
    }
  } catch (error) {
    console.error('Error checking active trade:', error)
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  if (event.data.type === 'TRADE_STATE_UPDATE') {
    const cache = await caches.open(TRADE_CACHE)
    await cache.put(
      'activeTradeState',
      new Response(JSON.stringify({
        ...event.data.payload,
        lastUpdated: Date.now()
      }))
    )

    if (event.data.payload.isActive) {
      // Register background sync
      try {
        await self.registration.sync.register('check-trade')
      } catch (error) {
        console.warn('Background Sync not supported:', error)
      }
    }
  }
})

// Use workbox for caching strategies
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache'
  })
)

workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
) 