import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material'
import { addSession } from '../store/slices/sessionsSlice'

export default function NewSession() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [session, setSession] = useState({
    name: '',
    initialMoney: '',
    targetPercentage: '',
    duration: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addSession({
      ...session,
      initialMoney: Number(session.initialMoney),
      targetPercentage: Number(session.targetPercentage),
      duration: Number(session.duration),
    }))
    navigate('/sessions')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Session
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Session Name"
            fullWidth
            margin="normal"
            value={session.name}
            onChange={(e) => setSession({ ...session, name: e.target.value })}
            required
          />
          <TextField
            label="Initial Money"
            type="number"
            fullWidth
            margin="normal"
            value={session.initialMoney}
            onChange={(e) => setSession({ ...session, initialMoney: e.target.value })}
            required
          />
          <TextField
            label="Target Percentage"
            type="number"
            fullWidth
            margin="normal"
            value={session.targetPercentage}
            onChange={(e) => setSession({ ...session, targetPercentage: e.target.value })}
            required
          />
          <TextField
            label="Duration (days)"
            type="number"
            fullWidth
            margin="normal"
            value={session.duration}
            onChange={(e) => setSession({ ...session, duration: e.target.value })}
            required
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">
              Create Session
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
} 