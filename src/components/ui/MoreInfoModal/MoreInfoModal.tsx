import { useEffect, useState } from 'react';
import { fetchCoinPrices, type CoinPrices } from '../../../services/coinService';
import './MoreInfoModal.css';

interface Props {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  onClose: () => void;
}

export default function MoreInfoModal({ coinId, coinName, coinSymbol, coinImage, onClose }: Props) {
  const [prices, setPrices] = useState<CoinPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCoinPrices(coinId)
      .then(setPrices)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load price data')
      )
      .finally(() => setLoading(false));
  }, [coinId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const fmtUsd = (n: number) =>
    n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: n >= 1 ? 2 : 6,
    });

  const fmtEur = (n: number) =>
    n.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: n >= 1 ? 2 : 6,
    });

  const fmtIls = (n: number) =>
    '₪ ' +
    n.toLocaleString('he-IL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: n >= 1 ? 2 : 6,
    });

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Coin price details"
    >
      <div className="more-info-modal">
        <button className="more-info-modal__close-x" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {loading && (
          <div className="more-info-modal__loading">
            <div className="spinner" />
            Loading price data…
          </div>
        )}

        {error && (
          <div className="more-info-modal__error">⚠ {error}</div>
        )}

        {prices && !loading && (
          <>
            <div className="more-info-modal__header">
              <img
                className="more-info-modal__img"
                src={coinImage}
                alt={coinName}
              />
              <div className="more-info-modal__title">
                <div className="more-info-modal__symbol">
                  {coinSymbol.toUpperCase()}
                </div>
                <div className="more-info-modal__name">{coinName}</div>
              </div>
            </div>

            <p className="more-info-modal__label">Current Price</p>

            <div className="more-info-modal__prices">
              <div className="price-row">
                <div className="price-row__currency">
                  <span className="price-row__flag">🇺🇸</span>
                  <span className="price-row__currency-name">US Dollar</span>
                </div>
                <span className="price-row__amount">
                  <span className="price-row__symbol">$</span>
                  {fmtUsd(prices.usd).replace('$', '')}
                </span>
              </div>

              <div className="price-row">
                <div className="price-row__currency">
                  <span className="price-row__flag">🇪🇺</span>
                  <span className="price-row__currency-name">Euro</span>
                </div>
                <span className="price-row__amount">
                  {fmtEur(prices.eur)}
                </span>
              </div>

              <div className="price-row">
                <div className="price-row__currency">
                  <span className="price-row__flag">🇮🇱</span>
                  <span className="price-row__currency-name">Israeli Shekel</span>
                </div>
                <span className="price-row__amount">
                  {fmtIls(prices.ils)}
                </span>
              </div>
            </div>

            <button className="more-info-modal__close-btn" onClick={onClose}>
              Close Info
            </button>
          </>
        )}
      </div>
    </div>
  );
}
