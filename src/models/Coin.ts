export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_30d_in_currency?: number | null;
  price_change_percentage_60d_in_currency?: number | null;
  price_change_percentage_200d_in_currency?: number | null;
  circulating_supply: number;
  last_updated: string;
}
