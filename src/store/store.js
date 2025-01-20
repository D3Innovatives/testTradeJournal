import { configureStore } from '@reduxjs/toolkit'
import sessionsReducer from './slices/sessionsSlice'
import activeTradeReducer from './slices/activeTradeSlice'
import { loadState, saveState } from '../utils/storage'
import throttle from 'lodash/throttle'

const persistedState = loadState()

export const store = configureStore({
  reducer: {
    sessions: sessionsReducer,
    activeTrade: activeTradeReducer,
  },
  preloadedState: persistedState
})

// Save state to localStorage whenever it changes, but throttle it to prevent performance issues
store.subscribe(
  throttle(() => {
    saveState({
      sessions: store.getState().sessions,
      activeTrade: store.getState().activeTrade
    })
  }, 1000) // Save at most once per second
) 