import { Routes, Route } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import HomePage from '../pages/Home/HomePage';
import RealTimePage from '../pages/RealTime/RealTimePage';
import AIPage from '../pages/AI/AIPage';
import AboutPage from '../pages/About/AboutPage';
import './App.css';

export default function AppRouter() {
  return (
    <div className="app">
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/realtime" element={<RealTimePage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <footer className="app__footer">
          © {new Date().getFullYear()} <span>CryptoPulse AI</span> — Real-time crypto tracking &amp; AI insights
        </footer>
      </div>
  );
}
