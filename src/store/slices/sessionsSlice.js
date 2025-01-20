import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessions: [],
}

const validateSession = (session) => {
  return {
    ...session,
    id: Number(session.id),
    initialMoney: Number(session.initialMoney),
    targetPercentage: Number(session.targetPercentage),
    duration: Number(session.duration),
    trades: Array.isArray(session.trades) ? session.trades.map(trade => ({
      ...trade,
      id: Number(trade.id),
      profitLoss: Number(trade.profitLoss),
      percentage: Number(trade.percentage)
    })) : []
  }
}

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession: (state, action) => {
      state.sessions.push(validateSession({
        id: Date.now(),
        name: action.payload.name,
        initialMoney: action.payload.initialMoney,
        targetPercentage: action.payload.targetPercentage,
        duration: action.payload.duration,
        trades: [],
      }))
    },
    addTrade: (state, action) => {
      const { sessionId, trade } = action.payload
      const session = state.sessions.find(s => s.id === sessionId)
      if (session) {
        session.trades.push({
          id: Date.now(),
          date: new Date().toISOString(),
          profitLoss: Number(trade.profitLoss),
          percentage: Number(trade.percentage),
          rightDecisions: trade.rightDecisions,
          wrongDecisions: trade.wrongDecisions,
        })
      }
    },
  },
})

export const { addSession, addTrade } = sessionsSlice.actions
export default sessionsSlice.reducer 