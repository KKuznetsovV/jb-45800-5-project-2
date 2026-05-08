import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCoins } from '../services/coinService';
import type { Coin } from '../models/Coin';

interface CoinsState {
  list: Coin[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: CoinsState = {
  list: [],
  loading: false,
  error: null,
  searchQuery: '',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loadCoins = createAsyncThunk('coins/loadCoins', async () => {
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchCoins();
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      await delay(attempt * 1000);
    }
  }
  throw new Error('Failed to load coins after retries');
});

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadCoins.rejected, (state, action) => {
        state.loading = false;
        const msg = action.error.message ?? '';
        state.error = msg.toLowerCase().includes('network')
          ? 'Network Error — CoinGecko rate limit hit. Click Retry in a few seconds.'
          : (msg || 'Failed to load coins');
      });
  },
});

export const { setSearchQuery } = coinsSlice.actions;
export default coinsSlice.reducer;
