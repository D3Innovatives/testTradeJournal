import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'

export default function SessionList() {
  const sessions = useSelector((state) => state.sessions.sessions)
  const navigate = useNavigate()

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Trading Sessions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sessions/new')}
        >
          New Session
        </Button>
      </Box>

      <Paper>
        <List>
          {sessions.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No sessions found" 
                secondary="Create a new trading session to get started"
              />
            </ListItem>
          ) : (
            sessions.map((session) => (
              <ListItem
                key={session.id}
                button
                onClick={() => navigate(`/sessions/${session.id}`)}
              >
                <ListItemText
                  primary={session.name}
                  secondary={`Initial: $${session.initialMoney} | Target: ${session.targetPercentage}% | Duration: ${session.duration} days`}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  )
} 