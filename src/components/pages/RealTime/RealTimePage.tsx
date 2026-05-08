import { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../../../redux/hooks';
import { fetchRealTimePrices } from '../../../services/coinService';
import './RealTimePage.css';

const COIN_COLORS = [
  '#F5A623',
  '#22C55E',
  '#3B82F6',
  '#A855F7',
  '#EF4444',
];

const MAX_DATA_POINTS = 40;

interface DataPoint {
  time: string;
  [key: string]: number | string;
}

export default function RealTimePage() {
  const selectedIds = useAppSelector((s) => s.selectedCoins.ids);
  const allCoins = useAppSelector((s) => s.coins.list);

  const selectedCoins = allCoins.filter((c) => selectedIds.includes(c.id));

  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [latestPrices, setLatestPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAndUpdate = async () => {
    if (selectedCoins.length === 0) return;
    const symbols = selectedCoins.map((c) => c.symbol.toUpperCase());
    try {
      const data = await fetchRealTimePrices(symbols);
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });

      const point: DataPoint = { time: now };
      const latest: Record<string, number> = {};
      symbols.forEach((sym) => {
        const price = data[sym]?.USD ?? 0;
        point[sym] = price;
        latest[sym] = price;
      });

      setChartData((prev) => {
        const updated = [...prev, point];
        return updated.length > MAX_DATA_POINTS
          ? updated.slice(updated.length - MAX_DATA_POINTS)
          : updated;
      });
      setLatestPrices(latest);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    }
  };

  useEffect(() => {
    if (selectedCoins.length === 0) return;

    setChartData([]);
    fetchAndUpdate();
    intervalRef.current = setInterval(fetchAndUpdate, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedIds.join(',')]); 

  if (selectedCoins.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-header__title">Live Data</h1>
            <p className="page-header__subtitle">Real-time prices for your tracked coins</p>
          </div>
          <div className="empty-state">
            <span className="empty-state__icon">📊</span>
            <h2 className="empty-state__title">No coins tracked yet</h2>
            <p className="empty-state__desc">
              Go to Home and toggle the switch on up to 5 coins to see their live price chart here.
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
          <h1 className="page-header__title">Live Data</h1>
          <p className="page-header__subtitle">
            Prices refresh every second — tracking {selectedCoins.length} coin
            {selectedCoins.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error && <div className="error-banner">⚠ {error}</div>}

        {/* Info bar */}
        <div className="realtime-page__info-bar">
          <div className="realtime-page__pulse">
            <span className="pulse-dot" />
            Live — updates every 1s
          </div>
          <div className="realtime-page__legend">
            {selectedCoins.map((coin, i) => (
              <div key={coin.id} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: COIN_COLORS[i] }}
                />
                {coin.symbol.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="realtime-page__chart-wrapper">
          <div className="realtime-page__chart-title">
            {selectedCoins.map((c) => c.symbol.toUpperCase()).join(', ')} to USD
          </div>
          {chartData.length < 2 ? (
            <div className="spinner-container">
              <div className="spinner" />
              <span>Collecting data…</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a52" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#7A91B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3a52' }}
                />
                <YAxis
                  tick={{ fill: '#7A91B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000
                      ? `$${(v / 1000).toFixed(1)}k`
                      : `$${v.toFixed(4)}`
                  }
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1A2235',
                    border: '1px solid #2d3a52',
                    borderRadius: 8,
                    color: '#E8EDF5',
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: value >= 1 ? 2 : 6,
                    })}`,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{ color: '#7A91B8', fontSize: 12 }}
                />
                {selectedCoins.map((coin, i) => (
                  <Line
                    key={coin.id}
                    type="monotone"
                    dataKey={coin.symbol.toUpperCase()}
                    stroke={COIN_COLORS[i]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Snapshot cards */}
        {Object.keys(latestPrices).length > 0 && (
          <div className="realtime-page__snapshot">
            {selectedCoins.map((coin, i) => {
              const sym = coin.symbol.toUpperCase();
              const price = latestPrices[sym];
              return (
                <div
                  key={coin.id}
                  className="snapshot-card"
                  style={{ borderTopColor: COIN_COLORS[i] }}
                >
                  <div className="snapshot-card__symbol">{sym}</div>
                  <div className="snapshot-card__price">
                    {price !== undefined
                      ? `$${price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: price >= 1 ? 2 : 6,
                        })}`
                      : '—'}
                  </div>
                  <div className="snapshot-card__label">{coin.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
