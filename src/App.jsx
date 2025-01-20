import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './store/store'
import theme from './theme'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import SessionList from './components/SessionList'
import SessionDetail from './components/SessionDetail'
import NewSession from './components/NewSession'
import { useEffect, useState } from 'react'
import NotificationAlertDialog from './components/NotificationAlertDialog'

function App() {
  const [showNotificationAlert, setShowNotificationAlert] = useState(false)

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        if (Notification.permission === 'denied') {
          setShowNotificationAlert(true)
        } else if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission()
          if (permission === 'denied') {
            setShowNotificationAlert(true)
          }
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error)
        setShowNotificationAlert(true)
      }
    }

    requestNotificationPermission()
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sessions" element={<SessionList />} />
              <Route path="/sessions/new" element={<NewSession />} />
              <Route path="/sessions/:id" element={<SessionDetail />} />
            </Routes>
          </Layout>
        </Router>
        <NotificationAlertDialog
          open={showNotificationAlert}
          onClose={() => setShowNotificationAlert(false)}
        />
      </ThemeProvider>
    </Provider>
  )
}

export default App
