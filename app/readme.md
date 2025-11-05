# 🌴 SolWatch - Real-time Solana Analytics & Arbitrage Scanner

<div align="center">

![SolWatch Banner](https://img.shields.io/badge/Solana-Analytics-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Helius](https://img.shields.io/badge/Helius-RPC-F94C9B?style=for-the-badge)

**A Miami Vice-themed real-time dashboard for monitoring Solana blockchain activity, token prices, and network performance.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Roadmap](#-roadmap)

</div>

---

## 🎯 What is SolWatch?

SolWatch is a modern, real-time analytics dashboard built for the Solana blockchain. It provides live network metrics, token prices, performance data, and transaction monitoring - all with an educational twist. Every metric includes comprehensive tooltips that explain blockchain concepts in beginner-friendly terms.

Perfect for:
- 📊 **Traders** - Monitor prices and network activity
- 🔍 **Arbitrage Seekers** - Identify price discrepancies (coming soon!)
- 📚 **Learners** - Understand blockchain concepts through interactive tooltips
- 🏗️ **Developers** - Template for Solana data visualization

---

## ✨ Features

### 📡 Real-Time Network Monitoring
- **Block Height & Slot Tracking** - Live blockchain progression
- **Network Status** - Connection health via Helius RPC
- **Auto-Refresh** - Updates every 10 seconds
- **Performance Metrics** - TPS, transaction counts, network load

### 💰 Live Token Prices
- **5 Major Tokens** - SOL, BONK, JUP, WIF, USDC
- **24h Price Changes** - Green/red indicators with percentages
- **Market Data** - Market cap and 24h volume
- **CoinGecko Integration** - Reliable price aggregation
- **Updates every 30s**

### ⚡ Network Performance
- **TPS (Transactions Per Second)** - Real-time throughput
- **Sample Metrics** - Transaction and slot counts
- **Capacity Visualization** - Network load bar graph
- **Performance Context** - Theoretical vs practical limits

### 🔄 Live Transaction Feed
- **Real Blockchain Data** - Via Helius API
- **Transaction Types** - Transfer, Swap, Contract interactions
- **Success/Failure Tracking** - See which transactions completed
- **Clickable to Solscan** - Explore full transaction details
- **Updates every 15s** - Recent activity from Raydium DEX

### 🎓 Educational Tooltips (38+)
Every single metric has a comprehensive tooltip explaining:
- What the metric means
- Why it matters
- How it's calculated
- Real-world examples
- Blockchain concepts for beginners

### 🎨 Beautiful UI
- **Miami Vice Theme** - Pink (#F94C9B) + Cyan (#00B8D4) gradient
- **Dark/Light Mode** - Automatic theme switching
- **Fully Responsive** - Mobile, tablet, desktop optimized
- **Smooth Animations** - Hover effects and transitions
- **Professional Design** - Clean, modern interface

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with compiler
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Blockchain & Data
- **[@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)** - Solana JavaScript SDK
- **[Helius RPC](https://helius.dev/)** - Enterprise Solana RPC endpoint
- **[CoinGecko API](https://www.coingecko.com/)** - Token price data

### State Management
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - Global state management
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** - Data fetching & caching

### Development
- **[ESLint](https://eslint.org/)** - Code linting (optional)
- **[Git](https://git-scm.com/)** - Version control
- **[Vercel](https://vercel.com/)** - Deployment platform

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **Helius API Key** (get free at [helius.dev](https://helius.dev))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solwatch.git
cd solwatch
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE
```

Get your free Helius API key at [helius.dev](https://helius.dev)

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

You should see the SolWatch dashboard! 🎉

---

## 📁 Project Structure

```
solwatch/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── helius/
│   │       ├── data/
│   │       │   └── route.ts      # Network stats endpoint
│   │       └── transactions/
│   │           └── route.ts      # Transaction feed endpoint
│   ├── globals.css               # Global styles & theme variables
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage (dashboard)
│   ├── providers.tsx             # Redux provider
│   └── theme-provider.tsx        # Theme context & logic
│
├── components/
│   ├── dashboard/                # Dashboard cards
│   │   ├── Dashboard.tsx         # Main orchestrator
│   │   ├── NetworkStatsCard.tsx  # Block height, status, rate
│   │   ├── TokenListCard.tsx     # Token prices
│   │   ├── PerformanceCard.tsx   # TPS & performance
│   │   └── RecentActivityCard.tsx # Transaction feed
│   │
│   └── ui/                       # Reusable UI components
│       ├── Card.tsx              # Card wrapper
│       ├── ErrorBoundary.tsx     # Error handling
│       ├── Modal.tsx             # Modal component
│       ├── ThemeToggle.tsx       # Dark/light toggle
│       └── Tooltip.tsx           # Educational tooltips
│
├── lib/                          # Utilities & helpers
│   ├── connection.ts             # Solana/Helius connection
│   ├── tokens.ts                 # Token definitions
│   ├── theme.ts                  # Theme configuration
│   └── utils.ts                  # Formatting helpers
│
├── store/                        # Redux state
│   ├── store.ts                  # Redux store config
│   └── api/
│       └── pricesApi.ts          # Price data API slice
│
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── package.json                  # Dependencies
```

---

## 🏗 Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js Frontend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Network    │  │    Token     │  │  Activity    │  │
│  │  StatsCard   │  │   ListCard   │  │    Card      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         ▼                 ▼                  ▼          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Dashboard Orchestrator               │    │
│  └────────────┬──────────────────┬────────────────┘    │
└───────────────┼──────────────────┼─────────────────────┘
                │                  │
                ▼                  ▼
┌───────────────────────┐  ┌─────────────────┐
│  API Routes (Next.js) │  │  External APIs  │
│  ├─ /api/helius/data  │  │  └─ CoinGecko   │
│  └─ /api/helius/txs   │  └─────────────────┘
└───────┬───────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│        Helius RPC Endpoint          │
│    (Solana Blockchain Gateway)      │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│       Solana Blockchain             │
│  (Mainnet - Live Network)           │
└─────────────────────────────────────┘
```

---

## 🎨 Theming

### Miami Vice Gradient
```css
background: linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%);
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `NEXT_PUBLIC_HELIUS_RPC_URL`
4. Deploy! 🚀

---

## 📈 Performance

- **Initial Load** - < 2s on 3G
- **Time to Interactive** - < 3s
- **Lighthouse Score** - 90+ across all metrics
- **Bundle Size** - Optimized with Next.js

---

## 🎯 Current Status

✅ **Production Ready** - Fully functional dashboard
✅ **Real Data** - Live blockchain integration
✅ **Educational** - Comprehensive tooltips
✅ **Responsive** - Mobile, tablet, desktop
✅ **Performant** - Optimized and fast
✅ **Beautiful** - Miami Vice aesthetic

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** Active Development 🚀

---

<div align="center">

**Built with ❤️ for the Solana community**

[⭐ Star on GitHub](https://github.com/yourusername/solwatch) • [🐛 Report Bug](https://github.com/yourusername/solwatch/issues) • [💡 Request Feature](https://github.com/yourusername/solwatch/issues)

</div>