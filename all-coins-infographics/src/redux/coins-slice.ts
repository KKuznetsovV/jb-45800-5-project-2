import type Coin from "../models/Coin"
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CoinsState {
    coins: Coin[]
}

const initialState: CoinsState = {
    coins: [],
}

const coinsSlice = createSlice({
    name: 'coins',
    initialState,
    reducers: {
        populate: (state, action: PayloadAction<Coin[]>) => {
            state.coins = action.payload
        },
    }
})

export const { populate } = coinsSlice.actions

export default coinsSlice.reducer
