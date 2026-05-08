import { useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import type { Coin } from '../../../models/Coin';
import {
  getAIRecommendation,
  getAllAIRecommendations,
  getStoredApiKey,
  type AIRecommendation,
} from '../../../services/aiService';
import type { CoinForAI } from '../../../models/CoinDetail';
import ApiKeyModal from '../../ui/ApiKeyModal/ApiKeyModal';
import './AIPage.css';

type RecMap = Map<string, { data: AIRecommendation | null; error: string | null; loading: boolean }>;

const initEntry = () => ({ data: null, error: null, loading: false });

export default function AIPage() {
  const selectedIds = useAppSelector((s) => s.selectedCoins.ids);
  const allCoins = useAppSelector((s) => s.coins.list);
  const selectedCoins: Coin[] = allCoins.filter((c: Coin) => selectedIds.includes(c.id));

  const [recs, setRecs] = useState<RecMap>(new Map());
  const [showApiModal, setShowApiModal] = useState(false);
  const [analyzingAll, setAnalyzingAll] = useState(false);
  const hasKey = Boolean(getStoredApiKey());

  const setLoading = (symbol: string, loading: boolean) =>
    setRecs((prev) => {
      const next = new Map(prev);
      next.set(symbol, { ...(next.get(symbol) ?? initEntry()), loading });
      return next;
    });

  const setResult = (symbol: string, data: AIRecommendation) =>
    setRecs((prev) => {
      const next = new Map(prev);
      next.set(symbol, { data, error: null, loading: false });
      return next;
    });

  const setRecError = (symbol: string, error: string) =>
    setRecs((prev) => {
      const next = new Map(prev);
      next.set(symbol, { data: null, error, loading: false });
      return next;
    });

  const buildCoinForAI = (coin: Coin): CoinForAI => ({
    name: coin.name,
    symbol: coin.symbol,
    current_price_usd: coin.current_price,
    market_cap_usd: coin.market_cap,
    volume_24h_usd: coin.total_volume,
    price_change_percentage_30d: coin.price_change_percentage_30d_in_currency ?? 0,
    price_change_percentage_60d: coin.price_change_percentage_60d_in_currency ?? 0,
    price_change_percentage_200d: coin.price_change_percentage_200d_in_currency ?? 0,
  });

  const handleSingleRec = async (coin: Coin) => {
    if (!getStoredApiKey()) {
      setShowApiModal(true);
      return;
    }
    setLoading(coin.symbol, true);
    try {
      const coinData = buildCoinForAI(coin);
      const rec = await getAIRecommendation(coinData);
      setResult(coin.symbol, rec);
    } catch (err) {
      setRecError(coin.symbol, err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleAnalyzeAll = async () => {
    if (!getStoredApiKey()) {
      setShowApiModal(true);
      return;
    }
    setAnalyzingAll(true);

    setRecs(() => {
      const next = new Map<string, { data: AIRecommendation | null; error: string | null; loading: boolean }>();
      selectedCoins.forEach((c) =>
        next.set(c.symbol, { data: null, error: null, loading: true })
      );
      return next;
    });

    try {
      const coinDataList = selectedCoins.map((c) => buildCoinForAI(c));
      const results = await getAllAIRecommendations(coinDataList);

      setRecs(() => {
        const next = new Map<string, { data: AIRecommendation | null; error: string | null; loading: boolean }>();
        results.forEach((result, symbol) => {
          if (result instanceof Error) {
            next.set(symbol, { data: null, error: result.message, loading: false });
          } else {
            next.set(symbol, { data: result, error: null, loading: false });
          }
        });
        return next;
      });
    } catch (err) {
      selectedCoins.forEach((c) => {
        setRecError(
          c.symbol,
          err instanceof Error ? err.message : 'Unknown error'
        );
      });
    } finally {
      setAnalyzingAll(false);
    }
  };

  if (selectedCoins.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-header__title">AI Advisor</h1>
            <p className="page-header__subtitle">
              AI-powered buy / hold / sell analysis for your tracked coins
            </p>
          </div>
          <div className="empty-state">
            <span className="empty-state__icon">🤖</span>
            <h2 className="empty-state__title">No coins tracked</h2>
            <p className="empty-state__desc">
              Enable the switch on coins from the Home page to get AI recommendations here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title">AI Advisor</h1>
          <p className="page-header__subtitle">
            AI-powered analysis for your {selectedCoins.length} tracked coin
            {selectedCoins.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Key setup banner */}
        {!hasKey && (
          <div className="ai-key-banner">
            <div className="ai-key-banner__title">🔑 API Key Required</div>
            <p className="ai-key-banner__desc">
              Connect a free Google Gemini key or your OpenAI key to unlock AI recommendations.
            </p>
            <button className="btn btn-primary" onClick={() => setShowApiModal(true)}>
              Set Up API Key
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="ai-page__toolbar">
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>
            Click "Analyze" per coin or analyze all at once
          </span>
          <div className="ai-page__actions">
            <button
              className="btn btn-ghost"
              onClick={() => setShowApiModal(true)}
            >
              ⚙ API Settings
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAnalyzeAll}
              disabled={analyzingAll || !hasKey}
            >
              {analyzingAll ? (
                <><span className="ai-coin-row__spinner" /> Analyzing all…</>
              ) : (
                '⚡ Analyze All'
              )}
            </button>
          </div>
        </div>

        {/* Coin rows */}
        {selectedCoins.map((coin) => {
          const sym = coin.symbol.toUpperCase();
          const rec = recs.get(coin.symbol);

          return (
            <div key={coin.id} className="ai-coin-row">
              <div className="ai-coin-row__identity">
                <img
                  className="ai-coin-row__img"
                  src={coin.image}
                  alt={coin.name}
                />
                <div>
                  <div className="ai-coin-row__symbol">{sym}</div>
                  <div className="ai-coin-row__name">{coin.name}</div>
                </div>
              </div>

              <div className="ai-rec-box">
                {!rec && (
                  <p className="ai-rec-box__placeholder">
                    Hit "Analyze" to get an AI recommendation for this coin.
                  </p>
                )}

                {rec?.loading && (
                  <p className="ai-rec-box__placeholder">
                    <span className="ai-coin-row__spinner" />
                    Analyzing {coin.name}…
                  </p>
                )}

                {rec?.error && (
                  <div className="ai-rec-error">⚠ {rec.error}</div>
                )}

                {rec?.data && !rec.loading && (
                  <div
                    className={`ai-rec-result ${
                      rec.data.shouldBuy ? 'ai-rec-result--buy' : 'ai-rec-result--sell'
                    }`}
                  >
                    <div className="ai-rec-result__verdict">
                      <span
                        className={
                          rec.data.shouldBuy ? 'verdict-buy' : 'verdict-sell'
                        }
                      >
                        {rec.data.shouldBuy ? '✅ BUY' : '⚠ HOLD / SELL'}
                      </span>
                    </div>
                    <div className="ai-rec-result__text">
                      {rec.data.reasoning}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="ai-coin-row__btn"
                onClick={() => handleSingleRec(coin)}
                disabled={rec?.loading || analyzingAll}
              >
                {rec?.loading ? (
                  <><span className="ai-coin-row__spinner" />Analyzing…</>
                ) : (
                  '✨ Analyze'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {showApiModal && (
        <ApiKeyModal onClose={() => setShowApiModal(false)} />
      )}
    </main>
  );
}
