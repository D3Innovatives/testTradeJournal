self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Handle background notifications
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'trade-check') {
    event.waitUntil(checkActiveTrade())
  }
})

async function checkActiveTrade() {
  try {
    const cache = await caches.open('trade-state')
    const response = await cache.match('activeTradeState')
    if (response) {
      const data = await response.json()
      if (data.isActive) {
        await self.registration.showNotification('Active Trade Reminder', {
          body: 'You have an active trade running. Check your position!',
          icon: '/icons/icon-192x192.png',
          tag: 'trade-notification',
          renotify: true
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
    const cache = await caches.open('trade-state')
    await cache.put(
      'activeTradeState',
      new Response(JSON.stringify(event.data.payload))
    )

    // Register periodic sync if trade is active
    if (event.data.payload.isActive) {
      try {
        await self.registration.periodicSync.register('trade-check', {
          minInterval: 60000 // 1 minute
        })
      } catch (error) {
        console.error('Periodic Sync could not be registered:', error)
      }
    } else {
      try {
        await self.registration.periodicSync.unregister('trade-check')
      } catch (error) {
        console.error('Periodic Sync could not be unregistered:', error)
      }
    }
  }
}) 