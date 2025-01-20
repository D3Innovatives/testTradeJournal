import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material'

export default function NotificationDialog({ open, onClose }) {
  const [error, setError] = useState('')

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive trade notifications',
        })
        onClose()
      } else {
        setError('Please allow notifications in your browser settings to receive trade alerts.')
      }
    } catch (error) {
      setError('Notifications are not supported in this environment. Please use HTTPS or localhost.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enable Notifications</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          To receive trade alerts, you need to:
        </Typography>
        <Typography component="div">
          1. Access the site through localhost or HTTPS<br />
          2. Allow notifications in your browser<br />
          3. Keep the browser running to receive alerts
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleEnableNotifications} variant="contained">
          Enable Notifications
        </Button>
      </DialogActions>
    </Dialog>
  )
} 