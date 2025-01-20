import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material'
import { addTrade } from '../store/slices/sessionsSlice'
import { startTrade, endTrade } from '../store/slices/activeTradeSlice'
import { useTradeNotification } from '../hooks/useTradeNotification'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationDialog from './NotificationDialog'
import NotificationAlertDialog from './NotificationAlertDialog'
import IOSNotification from './IOSNotification'

export default function SessionDetail() {
  const { isIOSPWA, tradeDuration } = useTradeNotification()
  const { id } = useParams()
  const dispatch = useDispatch()
  const session = useSelector((state) =>
    state.sessions.sessions.find((s) => s.id === Number(id))
  )
  const activeTrade = useSelector((state) => state.activeTrade)
  const [openDialog, setOpenDialog] = useState(false)
  const [newTrade, setNewTrade] = useState({
    profitLoss: '',
    percentage: '',
    rightDecisions: '',
    wrongDecisions: '',
  })
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [showNotificationAlert, setShowNotificationAlert] = useState(false)

  if (!session) {
    return <Typography>Session not found</Typography>
  }

  const handleAddTrade = () => {
    dispatch(addTrade({
      sessionId: session.id,
      trade: newTrade
    }))
    setOpenDialog(false)
    setNewTrade({
      profitLoss: '',
      percentage: '',
      rightDecisions: '',
      wrongDecisions: '',
    })
    dispatch(endTrade())
  }

  const formatDuration = (startTime) => {
    if (!startTime) return '0 minutes'
    const duration = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000)
    return `${duration} minute${duration !== 1 ? 's' : ''}`
  }

  const handleStartTrade = useCallback(async () => {
    if (Notification.permission === 'default') {
      setShowNotificationDialog(true)
    } else if (Notification.permission === 'denied') {
      setShowNotificationAlert(true)
    } else {
      dispatch(startTrade(Number(id)))
    }
  }, [dispatch, id])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {session.name}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Session Details</Typography>
        <Typography>Initial Money: ${session.initialMoney}</Typography>
        <Typography>Target Percentage: {session.targetPercentage}%</Typography>
        <Typography>Duration: {session.duration} days</Typography>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color={activeTrade.isActive ? "error" : "primary"}
          onClick={() => {
            if (activeTrade.isActive) {
              setOpenDialog(true)
            } else {
              handleStartTrade()
            }
          }}
        >
          {activeTrade.isActive ? "Close Trade" : "Start Trade"}
        </Button>

        {activeTrade.isActive && (
          <Chip
            icon={<NotificationsActiveIcon />}
            label={`Active for ${formatDuration(activeTrade.startTime)}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Profit/Loss</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Right Decisions</TableCell>
              <TableCell>Wrong Decisions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {session.trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                <TableCell>${trade.profitLoss}</TableCell>
                <TableCell>{trade.percentage}%</TableCell>
                <TableCell>{trade.rightDecisions}</TableCell>
                <TableCell>{trade.wrongDecisions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Trade Result</DialogTitle>
        <DialogContent>
          <TextField
            label="Profit/Loss"
            type="number"
            fullWidth
            margin="normal"
            value={newTrade.profitLoss}
            onChange={(e) => setNewTrade({ ...newTrade, profitLoss: e.target.value })}
          />
          <TextField
            label="Percentage"
            type="number"
            fullWidth
            margin="normal"
            value={newTrade.percentage}
            onChange={(e) => setNewTrade({ ...newTrade, percentage: e.target.value })}
          />
          <TextField
            label="Right Decisions"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            value={newTrade.rightDecisions}
            onChange={(e) => setNewTrade({ ...newTrade, rightDecisions: e.target.value })}
          />
          <TextField
            label="Wrong Decisions"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            value={newTrade.wrongDecisions}
            onChange={(e) => setNewTrade({ ...newTrade, wrongDecisions: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTrade} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <NotificationDialog 
        open={showNotificationDialog} 
        onClose={() => setShowNotificationDialog(false)} 
      />

      <NotificationAlertDialog
        open={showNotificationAlert}
        onClose={() => setShowNotificationAlert(false)}
      />

      {isIOSPWA && (
        <IOSNotification 
          isActive={activeTrade.isActive}
          duration={tradeDuration}
        />
      )}
    </Box>
  )
} 