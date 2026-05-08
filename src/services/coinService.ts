import axios from 'axios';
import type { Coin } from '../models/Coin';
import type { CoinDetail } from '../models/CoinDetail';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const CRYPTOCOMPARE_BASE = 'https://min-api.cryptocompare.com';

export const fetchCoins = async (): Promise<Coin[]> => {
  const response = await axios.get<Coin[]>(`${COINGECKO_BASE}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '30d,60d,200d',
    },
  });
  return response.data;
};

export interface CoinPrices {
  usd: number;
  eur: number;
  ils: number;
}

export const fetchCoinPrices = async (coinId: string): Promise<CoinPrices> => {
  const response = await axios.get<Record<string, CoinPrices>>(
    `${COINGECKO_BASE}/simple/price`,
    { params: { ids: coinId, vs_currencies: 'usd,eur,ils' } }
  );
  const data = response.data[coinId];
  if (!data) throw new Error('Price data not available for this coin');
  return data;
};

export const fetchCoinDetail = async (coinId: string): Promise<CoinDetail> => {
  const response = await axios.get<CoinDetail>(`${COINGECKO_BASE}/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    },
  });
  return response.data;
};

export const fetchRealTimePrices = async (
  symbols: string[]
): Promise<Record<string, { USD: number }>> => {
  const fsyms = symbols.join(',');
  const response = await axios.get<Record<string, { USD: number }>>(
    `${CRYPTOCOMPARE_BASE}/data/pricemulti`,
    { params: { fsyms, tsyms: 'USD' } }
  );
  return response.data;
};
