import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSearchQuery } from '../../redux/coinsSlice';
import './Navbar.css';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.coins.searchQuery);
  const selectedCount = useAppSelector((s) => s.selectedCoins.ids.length);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <NavLink to="/" className="navbar__brand">
          <img src="/logo.png" alt="CryptoPulse AI" className="navbar__logo" />
          <span className="navbar__brand-name">
            CryptoPulse<span> AI</span>
          </span>
        </NavLink>

        {/* Nav Links */}
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end>
              <span className="link-icon">🏠</span> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/realtime">
              <span className="link-icon">📈</span> Live Data
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai">
              <span className="link-icon">🤖</span> AI Advisor
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              <span className="link-icon">👤</span> About
            </NavLink>
          </li>
        </ul>

        {/* Search */}
        <div className="navbar__search">
          <div className="navbar__search-wrapper">
            <span className="navbar__search-icon">🔍</span>
            <input
              className="navbar__search-input"
              type="text"
              placeholder="Search coins…"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              aria-label="Search cryptocurrencies"
            />
          </div>

          {selectedCount > 0 && (
            <div className="navbar__counter">
              <span className="navbar__counter-badge">{selectedCount}</span>
              Tracked
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
