import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isActive: false,
  startTime: null,
  sessionId: null,
  lastNotificationTime: null
}

const validateState = (state) => ({
  ...state,
  isActive: Boolean(state.isActive),
  startTime: state.startTime ? new Date(state.startTime).toISOString() : null,
  sessionId: state.sessionId ? Number(state.sessionId) : null,
  lastNotificationTime: state.lastNotificationTime ? new Date(state.lastNotificationTime).toISOString() : null
})

export const activeTradeSlice = createSlice({
  name: 'activeTrade',
  initialState,
  reducers: {
    startTrade: (state, action) => {
      const newState = {
        isActive: true,
        startTime: new Date().toISOString(),
        sessionId: action.payload,
        lastNotificationTime: new Date().toISOString()
      }
      return validateState(newState)
    },
    endTrade: () => initialState,
    updateLastNotification: (state) => {
      state.lastNotificationTime = new Date().toISOString()
    }
  }
})

export const { startTrade, endTrade, updateLastNotification } = activeTradeSlice.actions
export default activeTradeSlice.reducer 