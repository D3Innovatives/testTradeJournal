import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { useEffect, useState } from 'react'

export default function NotificationAlertDialog({ open, onClose }) {
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      // Check environment and set appropriate error message
      if (!('Notification' in window)) {
        setError('Notifications are not supported in your browser.')
      } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError('Notifications require a secure connection (HTTPS) or localhost.')
      } else {
        setError('Notifications are blocked. Please enable them in your browser settings.')
      }
    }
  }, [open])

  const getBrowserInstructions = () => {
    const browser = navigator.userAgent
    if (browser.includes('Chrome')) {
      return [
        'Click the lock/info icon (🔒) in the address bar',
        'Click "Notifications" in the permissions list',
        'Select "Allow"',
        'Refresh the page'
      ]
    } else if (browser.includes('Firefox')) {
      return [
        'Click the lock/info icon (🔒) in the address bar',
        'Clear the "Notifications" setting',
        'Refresh the page',
        'Allow notifications when prompted'
      ]
    } else if (browser.includes('Safari')) {
      return [
        'Open Safari Preferences',
        'Go to Websites tab',
        'Find "Notifications" in the left sidebar',
        'Allow notifications for this site'
      ]
    } else {
      return [
        'Look for notification settings in your browser settings',
        'Find site permissions or notifications section',
        'Allow notifications for this site',
        'Refresh the page'
      ]
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { minWidth: { sm: '400px' } }
      }}
    >
      <DialogTitle sx={{ 
        color: 'error.main',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Box component="span" sx={{ fontSize: '1.5rem' }}>🔔</Box>
        Notifications Required
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
          How to enable notifications:
        </Typography>
        
        <Box sx={{ 
          backgroundColor: 'grey.50',
          p: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200'
        }}>
          {getBrowserInstructions().map((instruction, index) => (
            <Typography 
              key={index} 
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                mb: 1
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                  fontSize: '0.875rem'
                }}
              >
                {index + 1}
              </Box>
              {instruction}
            </Typography>
          ))}
        </Box>

        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          After enabling notifications, you'll be able to receive important trade alerts and reminders.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => {
            window.location.reload()
          }} 
          variant="contained"
          color="primary"
        >
          Refresh Page
        </Button>
      </DialogActions>
    </Dialog>
  )
} 