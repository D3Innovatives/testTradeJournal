import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateLastNotification } from '../store/slices/activeTradeSlice'

const NOTIFICATION_INTERVAL = 60000 // 60000ms = 1 minute
const TEST_MODE = true // Set to false in production
const TEST_INTERVAL = 5000 // 5 seconds for testing

const isNotificationSupported = () => {
  return (
    'Notification' in window &&
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  )
}

const isIOSPWA = () => {
  return (
    ['iPhone', 'iPad', 'iPod'].includes(navigator.platform) &&
    window.navigator.standalone === true
  )
}

export function useTradeNotification() {
  const activeTrade = useSelector((state) => state.activeTrade)
  const dispatch = useDispatch()

  // Update service worker with trade state
  useEffect(() => {
    const updateServiceWorker = async () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          await navigator.serviceWorker.ready
          navigator.serviceWorker.controller.postMessage({
            type: 'TRADE_STATE_UPDATE',
            payload: activeTrade
          })
        } catch (error) {
          console.error('Error updating service worker:', error)
        }
      }
    }

    updateServiceWorker()
  }, [activeTrade])

  const showNotification = useCallback(async () => {
    if (isIOSPWA()) {
      // Use alternative notification method for iOS PWA
      // This could be a custom in-app notification UI
      return
    }

    if (!isNotificationSupported()) {
      console.warn('Notifications not supported in this environment')
      return
    }

    try {
      if (Notification.permission !== 'granted') {
        console.warn('Notifications not granted')
        return
      }

      const timeSinceStart = activeTrade.startTime 
        ? Math.floor((Date.now() - new Date(activeTrade.startTime).getTime()) / 60000)
        : 0

      new Notification('Active Trade Reminder', {
        body: `Trade running for ${timeSinceStart} minutes. Check your position!`,
        icon: '/icons/icon-192x192.png',
        tag: 'trade-notification',
        renotify: true
      })
      
      dispatch(updateLastNotification())
      console.log('Notification shown at:', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }, [activeTrade.startTime, dispatch])

  useEffect(() => {
    let notificationInterval

    const startNotifications = async () => {
      if (Notification.permission !== 'granted') {
        console.warn('Cannot start notifications - permission not granted')
        return
      }

      // Request background sync permission if available
      if ('permissions' in navigator) {
        try {
          const status = await navigator.permissions.query({
            name: 'periodic-background-sync',
          })
          console.log('Background sync permission:', status.state)
        } catch (error) {
          console.warn('Background sync not supported:', error)
        }
      }

      await showNotification()
      const interval = TEST_MODE ? TEST_INTERVAL : NOTIFICATION_INTERVAL
      notificationInterval = setInterval(showNotification, interval)
      console.log(`Notifications started with ${interval/1000}s interval`)
    }

    if (activeTrade.isActive) {
      startNotifications()
      
      if (Notification.permission === 'granted') {
        new Notification('Trade Started', {
          body: 'You have started a new trade. Good luck!',
          icon: '/icons/icon-192x192.png',
          tag: 'trade-status'
        })
      }
    } else if (!activeTrade.isActive && activeTrade.startTime && Notification.permission === 'granted') {
      new Notification('Trade Ended', {
        body: 'You have closed your trade. Remember to log your results!',
        icon: '/icons/icon-192x192.png',
        tag: 'trade-status'
      })
    }

    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval)
        console.log('Notifications stopped')
      }
    }
  }, [activeTrade.isActive, activeTrade.startTime, showNotification])
} 