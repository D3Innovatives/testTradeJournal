import { Box, Typography, Paper, Grid } from '@mui/material'
import { useSelector } from 'react-redux'

function Dashboard() {
  const sessions = useSelector((state) => state.sessions.sessions)
  const activeTrade = useSelector((state) => state.activeTrade)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Sessions
            </Typography>
            <Typography>
              Total Sessions: {sessions.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trade Status
            </Typography>
            <Typography>
              {activeTrade.isActive ? 'Currently in Trade' : 'No Active Trade'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard 