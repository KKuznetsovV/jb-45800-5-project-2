import coinsSlice from './coins-slice'
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
    reducer: {
        coinsSlice,
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
