import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedCoinsState {
  ids: string[];
}

const loadFromStorage = (): string[] => {
  try {
    const raw = localStorage.getItem('selectedCoinIds');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const initialState: SelectedCoinsState = {
  ids: loadFromStorage(),
};

const selectedCoinsSlice = createSlice({
  name: 'selectedCoins',
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<string>) => {
      if (!state.ids.includes(action.payload) && state.ids.length < 5) {
        state.ids.push(action.payload);
      }
    },
    removeCoin: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    swapCoin: (
      state,
      action: PayloadAction<{ removeId: string; addId: string }>
    ) => {
      const { removeId, addId } = action.payload;
      state.ids = state.ids.filter((id) => id !== removeId);
      if (!state.ids.includes(addId)) {
        state.ids.push(addId);
      }
    },
  },
});

export const { addCoin, removeCoin, swapCoin } = selectedCoinsSlice.actions;
export default selectedCoinsSlice.reducer;
