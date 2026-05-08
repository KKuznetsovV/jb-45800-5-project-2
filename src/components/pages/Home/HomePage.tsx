import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loadCoins, setSearchQuery } from '../../../redux/coinsSlice';
import { addCoin, removeCoin, swapCoin } from '../../../redux/selectedCoinsSlice';
import CoinCard from '../../ui/CoinCard/CoinCard';
import MoreInfoModal from '../../ui/MoreInfoModal/MoreInfoModal';
import MaxCoinsDialog from '../../ui/MaxCoinsDialog/MaxCoinsDialog';
import type { Coin } from '../../../models/Coin';
import './HomePage.css';

type ActiveModal =
  | { type: 'moreInfo'; coin: Coin }
  | { type: 'maxCoins'; newCoin: Coin };

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { list, loading, error, searchQuery } = useAppSelector((s) => s.coins);
  const selectedIds = useAppSelector((s) => s.selectedCoins.ids);

  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(loadCoins());
    }
  }, [dispatch, list.length]);

  const filteredCoins = searchQuery.trim()
    ? list.filter(
        (c) =>
          c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : list;

  const selectedCoins = list.filter((c) => selectedIds.includes(c.id));

  const handleToggle = (coinId: string) => {
    if (selectedIds.includes(coinId)) {
      dispatch(removeCoin(coinId));
    } else if (selectedIds.length >= 5) {
      const coin = list.find((c) => c.id === coinId);
      if (coin) setActiveModal({ type: 'maxCoins', newCoin: coin });
    } else {
      dispatch(addCoin(coinId));
    }
  };

  const handleMoreInfo = (coinId: string) => {
    const coin = list.find((c) => c.id === coinId);
    if (coin) setActiveModal({ type: 'moreInfo', coin });
  };

  const handleSwapConfirm = (removeId: string) => {
    if (activeModal?.type === 'maxCoins') {
      dispatch(swapCoin({ removeId, addId: activeModal.newCoin.id }));
      setActiveModal(null);
    }
  };

  return (
    <main className="page">
      <div className="container">
        {/* Hero */}
        <header className="home-page__hero">
          <div className="page-header">
            <h1 className="page-header__title">Crypto Markets</h1>
            <p className="page-header__subtitle">
              Top 100 cryptocurrencies by market cap. Track up to 5 coins for live analysis.
            </p>
          </div>

          <div className="home-page__stats">
            <div className="stat-chip">
              Total coins: <span className="stat-chip__value">{list.length}</span>
            </div>
            {selectedIds.length > 0 && (
              <div className="stat-chip">
                Tracking: <span className="stat-chip__value">{selectedIds.length} / 5</span>
              </div>
            )}
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="error-banner">
            ⚠ {error}
            <button
              className="btn btn-ghost"
              style={{ marginLeft: 'auto' }}
              onClick={() => dispatch(loadCoins())}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="spinner-container">
            <div className="spinner" />
            <span>Loading top 100 cryptocurrencies…</span>
          </div>
        )}

        {/* Search results banner */}
        {!loading && searchQuery.trim() && (
          <div className="search-results-banner">
            <span>
              Showing <strong>{filteredCoins.length}</strong> result
              {filteredCoins.length !== 1 ? 's' : ''} for{' '}
              <strong>"{searchQuery}"</strong>
            </span>
            <button onClick={() => dispatch(setSearchQuery(''))}>
              Clear ✕
            </button>
          </div>
        )}

        {/* Coins grid */}
        {!loading && filteredCoins.length > 0 && (
          <div className="coins-grid">
            {filteredCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onToggle={handleToggle}
                onMoreInfo={handleMoreInfo}
              />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filteredCoins.length === 0 && searchQuery.trim() && (
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <h2 className="empty-state__title">No coins found</h2>
            <p className="empty-state__desc">
              No results for <strong>"{searchQuery}"</strong>. Try a different name or symbol.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal?.type === 'moreInfo' && (
        <MoreInfoModal
          coinId={activeModal.coin.id}
          coinName={activeModal.coin.name}
          coinSymbol={activeModal.coin.symbol}
          coinImage={activeModal.coin.image}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'maxCoins' && (
        <MaxCoinsDialog
          newCoin={activeModal.newCoin}
          selectedCoins={selectedCoins}
          onConfirm={handleSwapConfirm}
          onClose={() => setActiveModal(null)}
        />
      )}
    </main>
  );
}
