import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title">About</h1>
          <p className="page-header__subtitle">Developer info &amp; project overview</p>
        </div>

        <div className="about-page__content">
          {/* Developer Profile */}
          <div className="profile-card">
            <img
              className="profile-card__avatar"
              src="/student_photo.jpeg"
              alt="Kirill Kuznetsov"
            />
            <div className="profile-card__info">
              <h2 className="profile-card__name">Kirill Kuznetsov</h2>
              <p className="profile-card__title">Front-End Developer · React &amp; TypeScript</p>
              <p className="profile-card__bio">
                Student developer passionate about building modern web applications.
                This project was built as part of a front-end development course, exploring
                real-time data fetching, state management with Redux, and AI integration
                powered by Google Gemini.
              </p>
              <div className="profile-card__links">
                <a
                  className="profile-card__link"
                  href="https://github.com/KKuznetsovV"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🐱 GitHub
                </a>

              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="project-card">
            <h3 className="project-card__title">
              <img src="/logo.png" alt="CryptoPulse AI" style={{ width: '1.2em', verticalAlign: 'middle' }} /> About CryptoPulse AI
            </h3>
            <p className="project-card__desc">
              CryptoPulse AI is a real-time cryptocurrency tracking platform that aggregates
              market data from multiple APIs, visualizes live price movements, and leverages
              AI to provide personalized investment analysis. Track up to 5 coins, monitor
              live price charts that update every second, and get AI-powered buy/hold/sell
              recommendations powered by Google Gemini.
            </p>

            <div className="tech-stack">
              {['React 19', 'TypeScript', 'Redux Toolkit', 'React Router', 'Recharts', 'Vite', 'CoinGecko API', 'CryptoCompare API', 'Google Gemini API'].map(
                (t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Features */}
          <div className="project-card">
            <h3 className="project-card__title">
              <span>🚀</span> Features
            </h3>
            <div className="features-list">
              {[
                'Top 100 coins by market cap',
                'Live search (case-insensitive)',
                'Price in USD, EUR &amp; ILS',
                'Track up to 5 coins',
                'Real-time price chart',
                'Chart refreshes every 5s',
                'AI buy/hold/sell analysis',
                'Parallel AI calls (Promise.all)',
                'Max-coins swap dialog',
                'Secure API key storage',
              ].map((f) => (
                <div
                  key={f}
                  className="feature-item"
                  dangerouslySetInnerHTML={{ __html: f }}
                />
              ))}
            </div>
          </div>

          {/* APIs */}
          <div className="project-card">
            <h3 className="project-card__title">
              <span>🔌</span> APIs Used
            </h3>
            <div className="features-list" style={{ gridTemplateColumns: '1fr' }}>
              {[
                'CoinGecko — market data, coin details',
                'CryptoCompare — real-time multi-coin prices',
                'Google Gemini API — AI buy/hold/sell recommendations',
              ].map((a) => (
                <div key={a} className="feature-item">
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
