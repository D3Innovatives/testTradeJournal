import { Snackbar, Alert } from '@mui/material'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'

export default function IOSNotification({ isActive, duration }) {
  const [open, setOpen] = useState(false)
  const [play] = useSound('/sounds/notification.mp3')

  useEffect(() => {
    let interval
    if (isActive) {
      // Show initial notification
      setOpen(true)
      play()
      
      // Set up interval for periodic notifications
      interval = setInterval(() => {
        setOpen(true)
        play()
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([200])
        }
      }, 60000) // Every minute
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, play])

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      className="ios-notification"
      sx={{ 
        top: { xs: 16, sm: 24 },
        '& .MuiAlert-root': {
          width: '100%',
          maxWidth: '400px'
        }
      }}
    >
      <Alert
        severity="warning"
        variant="filled"
        sx={{ width: '100%' }}
        onClose={() => setOpen(false)}
      >
        Active Trade Running for {duration} minutes
      </Alert>
    </Snackbar>
  )
} 