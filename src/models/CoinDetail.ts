export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      ils: number;
    };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_30d_in_currency: { usd: number };
    price_change_percentage_60d_in_currency: { usd: number };
    price_change_percentage_200d: number;
  };
}

export interface CoinForAI {
  name: string;
  symbol: string;
  current_price_usd: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
}
