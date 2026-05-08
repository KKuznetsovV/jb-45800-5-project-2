# CryptoScope 🪙

> **Track. Analyze. Decide.** — Real-time crypto tracking, live charts, and AI-powered investment insights.

A modern Single Page Application (SPA) built with **React 19 + TypeScript + Redux Toolkit**.

---

## Features

| Feature | Description |
|---|---|
| 🏠 Home | Top 100 coins by market cap with live search (case-insensitive, on every keystroke) |
| 💳 Coin Cards | Symbol, name, icon, 24h % change, toggle switch, More Info button |
| 🔍 More Info | Current price in **USD, EUR, ILS** fetched from CoinGecko (animated modal) |
| 🔄 Switch | Track up to **5 coins** — a swap dialog appears when you try to add a 6th |
| 📈 Live Data | Multi-line price chart refreshing every **5 seconds** (CryptoCompare API) |
| 🤖 AI Advisor | Buy / Hold / Sell recommendations via LLM (NVIDIA NIM or OpenAI) using **Promise.all** |
| 👤 About | Developer profile and project description |

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Redux Toolkit** (global state for coins + selected coins)
- **React Router DOM v7** (SPA routing)
- **Recharts** (real-time line chart)
- **Axios** (API calls)
- **CoinGecko API** — market data & coin details
- **CryptoCompare API** — real-time multi-coin prices
- **NVIDIA NIM** or **OpenAI** — AI recommendations

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

---

## AI Setup

The AI Advisor page requires an API key. Your key is saved **only in your browser's localStorage** — never sent to any server.

1. Click **⚙ API Settings** on the AI Advisor page
2. Choose provider: **NVIDIA NIM** (free models) or **OpenAI**
3. Paste your API key
4. Free NVIDIA models: [build.nvidia.com/models](https://build.nvidia.com/models)

---

## Project Structure

```
src/
├── components/
│   ├── app/          # App.tsx + routing
│   ├── layout/       # Navbar
│   ├── pages/        # Home, RealTime, AI, About
│   └── ui/           # CoinCard, MoreInfoModal, MaxCoinsDialog, ApiKeyModal
├── hooks/            # useAppSelector, useAppDispatch
├── models/           # TypeScript interfaces (Coin, CoinDetail)
├── redux/            # store, coinsSlice, selectedCoinsSlice
└── services/         # coinService, aiService
```

---

## Deployment

### GitHub Pages
After building, deploy the `dist/` folder to GitHub Pages. Update `vite.config.ts`:
```ts
base: '/your-repo-name/'
```

### Firebase / Vercel / Netlify
Point the build output (`dist/`) directory to your host and enable SPA redirect rules.

---

*Built with ❤ — CryptoScope Project*
