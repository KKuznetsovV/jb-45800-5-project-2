import { useEffect, useState } from 'react';
import type { Coin } from '../../../models/Coin';
import './MaxCoinsDialog.css';

interface Props {
  newCoin: Coin;
  selectedCoins: Coin[];
  onConfirm: (removeId: string) => void;
  onClose: () => void;
}

export default function MaxCoinsDialog({
  newCoin,
  selectedCoins,
  onConfirm,
  onClose,
}: Props) {
  const [removeId, setRemoveId] = useState<string>(selectedCoins[0]?.id ?? '');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="max-coins-dialog">
        <div className="max-coins-dialog__header">
          <span className="max-coins-dialog__icon">🚨</span>
          <h2 className="max-coins-dialog__title" id="dialog-title">
            Maximum Coins Reached
          </h2>
          <p className="max-coins-dialog__subtitle">
            You can track up to <strong>5 coins</strong>. To add{' '}
            <strong>{newCoin.name}</strong>, choose one to remove:
          </p>
        </div>

        <p className="max-coins-dialog__label">Select a coin to remove</p>

        <div className="max-coins-dialog__list">
          {selectedCoins.map((coin) => (
            <label
              key={coin.id}
              className={`radio-coin-option${removeId === coin.id ? ' radio-coin-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="remove-coin"
                value={coin.id}
                checked={removeId === coin.id}
                onChange={() => setRemoveId(coin.id)}
              />
              <img
                className="radio-coin-option__img"
                src={coin.image}
                alt={coin.name}
              />
              <div className="radio-coin-option__info">
                <div className="radio-coin-option__symbol">
                  {coin.symbol.toUpperCase()}
                </div>
                <div className="radio-coin-option__name">{coin.name}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="max-coins-dialog__actions">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm(removeId)}
            disabled={!removeId}
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  );
}
