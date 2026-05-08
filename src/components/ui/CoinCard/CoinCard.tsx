import type { Coin } from '../../../models/Coin';
import { useAppSelector } from '../../../redux/hooks';
import './CoinCard.css';

interface Props {
  coin: Coin;
  onToggle: (coinId: string) => void;
  onMoreInfo: (coinId: string) => void;
}

export default function CoinCard({ coin, onToggle, onMoreInfo }: Props) {
  const isSelected = useAppSelector((s) =>
    s.selectedCoins.ids.includes(coin.id)
  );

  const change = coin.price_change_percentage_24h ?? 0;
  const isUp = change >= 0;

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  };

  return (
    <article className={`coin-card${isSelected ? ' coin-card--selected' : ''}`}>
      <div className="coin-card__header">
        <div className="coin-card__identity">
          <img
            className="coin-card__img"
            src={coin.image}
            alt={coin.name}
            loading="lazy"
          />
          <div className="coin-card__info">
            <div className="coin-card__symbol">{coin.symbol.toUpperCase()}</div>
            <div className="coin-card__name">{coin.name}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className="coin-card__rank">#{coin.market_cap_rank}</span>
          <label className="toggle-switch" title={isSelected ? 'Remove from tracking' : 'Track this coin'}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(coin.id)}
              aria-label={`Track ${coin.name}`}
            />
            <span className="toggle-switch__track" />
          </label>
        </div>
      </div>

      <div className="coin-card__price-row">
        <span className="coin-card__price">{formatPrice(coin.current_price)}</span>
        <span className={`coin-card__change coin-card__change--${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      <button className="coin-card__btn" onClick={() => onMoreInfo(coin.id)}>
        More Info
      </button>
    </article>
  );
}
