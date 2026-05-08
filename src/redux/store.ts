import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';
import selectedCoinsReducer from './selectedCoinsSlice';

const store = configureStore({
  reducer: {
    coins: coinsReducer,
    selectedCoins: selectedCoinsReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    'selectedCoinIds',
    JSON.stringify(store.getState().selectedCoins.ids)
  );
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
