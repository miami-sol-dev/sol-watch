# SolWatch 🌴

Real-time Solana arbitrage opportunity scanner with Miami Vice aesthetics.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/React-19.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Overview

SolWatch is a professional-grade dashboard for monitoring arbitrage opportunities across Solana DEXs (Raydium, Orca, Jupiter). Built with performance and scalability in mind, targeting real-world trading use cases.

**Current Status:** Phase 1 Complete - UI/UX foundation built, ready for real DEX integration.

---

## 🎯 Project Goals

- **Primary:** Detect profitable arbitrage opportunities across Solana DEXs in real-time
- **Secondary:** Execute trades automatically (future phase)
- **Tertiary:** Track performance, P&L, and optimize strategies

**Target User:** Crypto traders looking for $250K+ opportunities in DeFi arbitrage.

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.0** (App Router) - React framework with server-side rendering
- **React 19.2** - Latest React with modern patterns (use hook, Suspense)
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling with custom theme
- **RTK Query** - Data fetching, caching, and state management
- **Recharts** - Price charts and visualizations
- **Lucide React** - Icon library

### Backend (Next.js API Routes)
- **@solana/web3.js** - Solana blockchain interactions (ready for integration)
- **CoinGecko API** - Current price data source (temporary, will be replaced)
- **Raydium SDK** - DEX integration (planned)
- **Orca Whirlpools SDK** - DEX integration (planned)
- **Jupiter Aggregator** - Price aggregation (planned)

### Infrastructure
- **Vercel** - Deployment platform (planned)
- **Helius RPC** - Solana RPC provider (needs setup)
- **PostgreSQL/Supabase** - Trade history database (planned)

---

## 🚀 Current Features (Phase 1 - Complete)

### ✅ Core Dashboard
- **Multi-token price grid** - Real-time prices for SOL, BONK, JUP, WIF, USDC
- **Auto-refresh** - Updates every 30 seconds via RTK Query polling
- **Responsive layout** - Mobile, tablet, desktop optimized

### ✅ Price Visualization
- **24h price changes** - Green/red indicators with trend arrows
- **Mini sparkline charts** - Live price movement tracking (client-side)
- **Expandable modals** - Full 24h historical charts with interactive tooltips

### ✅ Theme System
- **Miami Vice aesthetic** - Pink/cyan gradient design
- **Light/Dark mode** - Toggle in upper right, persists to localStorage
- **Smooth transitions** - All theme changes animated

### ✅ Performance & UX
- **Smart caching** - 5-minute cache for historical data, prevents rate limits
- **Error boundaries** - Graceful error handling, no full-page crashes
- **Loading states** - Skeleton screens, animated pulses
- **Lazy loading** - Charts only fetch when modal opens

### ✅ Code Quality
- **React 19 patterns** - Modern hooks, Suspense boundaries
- **TypeScript strict mode** - Full type coverage
- **Component architecture** - Modular, reusable, scalable
- **API route structure** - Clean separation of concerns

---

## 📦 Installation & Setup

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```bash
# Not currently needed for CoinGecko free tier
# Will need these for Phase 2:
# NEXT_PUBLIC_HELIUS_RPC_URL=
# HELIUS_API_KEY=
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure
```
solwatch/
├── app/
│   ├── api/
│   │   └── prices/
│   │       ├── jupiter/route.ts          # Currently uses CoinGecko
│   │       └── history/route.ts          # Historical price data
│   ├── page.tsx                          # Main dashboard
│   ├── layout.tsx                        # Root layout with providers
│   ├── providers.tsx                     # Redux provider
│   ├── theme-provider.tsx                # Theme context
│   └── globals.css                       # Global styles + CSS variables
│
├── components/
│   ├── prices/
│   │   ├── PriceGrid.tsx                 # Main price grid component
│   │   ├── PriceSparkline.tsx            # Mini chart component
│   │   └── DetailedChart.tsx             # Full modal chart
│   └── ui/
│       ├── Modal.tsx                     # Reusable modal component
│       ├── ThemeToggle.tsx               # Light/dark mode toggle
│       └── ErrorBoundary.tsx             # Error handling wrapper
│
├── store/
│   ├── store.ts                          # Redux store configuration
│   └── api/
│       └── pricesApi.ts                  # RTK Query API slice
│
├── lib/
│   ├── tokens.ts                         # Token configuration (mints, symbols)
│   └── theme.ts                          # Theme color definitions
│
├── hooks/
│   └── usePriceHistory.ts                # Client-side price tracking
│
└── types/                                 # (to be created)
    ├── dex.ts
    ├── opportunity.ts
    └── token.ts
```

---

## 🔮 Detailed Next Steps

### Phase 2: Real DEX Integration (Next Session)

**Goal:** Replace CoinGecko with real-time DEX data for actual arbitrage detection.

#### Step 1: Setup Helius RPC (15 min)

**Why Helius?**
- WebSocket support for real-time updates
- 1000+ req/s on Pro tier ($50-100/mo)
- Built for trading applications
- Better than free Solana RPC (40 req/s limit)

**Action Items:**
1. Sign up at https://helius.dev
2. Create new project, get API key
3. Add to `.env.local`:
```bash
   NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
   HELIUS_API_KEY=YOUR_KEY
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```
4. Create `lib/solana/connection.ts`:
```typescript
   import { Connection } from '@solana/web3.js';
   
   export const connection = new Connection(
     process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '',
     'confirmed'
   );
```

#### Step 2: Integrate Raydium SDK (30-45 min)

**Why Raydium?**
- Largest Solana DEX by volume
- Direct SDK access to pool data
- Most accurate pricing (no middleman)

**Action Items:**

1. **Install Raydium SDK:**
```bash
   npm install @raydium-io/raydium-sdk-v2
```

2. **Create Raydium integration:**
```typescript
   // lib/dex/raydium.ts
   import { Raydium } from '@raydium-io/raydium-sdk-v2';
   import { connection } from '@/lib/solana/connection';
   
   export async function getRaydiumPrice(
     tokenMint: string,
     baseMint: string = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
   ) {
     // Initialize Raydium
     const raydium = await Raydium.load({
       connection,
       cluster: 'mainnet',
     });
     
     // Get pool info
     const poolInfo = await raydium.liquidity.getPoolInfoByMints({
       mint1: tokenMint,
       mint2: baseMint,
     });
     
     // Calculate price from pool reserves
     const price = calculatePriceFromReserves(poolInfo);
     
     return {
       dex: 'Raydium',
       price,
       liquidity: poolInfo.liquidity,
       fee: poolInfo.feeRate,
     };
   }
```

3. **Documentation:**
   - Raydium SDK docs: https://docs.raydium.io/raydium/protocol/developers
   - Pool math: https://docs.raydium.io/raydium/protocol/concentrated-liquidity/math

#### Step 3: Integrate Orca Whirlpools SDK (30-45 min)

**Why Orca?**
- Second largest DEX
- Concentrated liquidity (better for large trades)
- Clean SDK, well-documented

**Action Items:**

1. **Install Orca SDK:**
```bash
   npm install @orca-so/whirlpools-sdk
   npm install @orca-so/common-sdk
   npm install @coral-xyz/anchor
```

2. **Create Orca integration:**
```typescript
   // lib/dex/orca.ts
   import { WhirlpoolContext, buildWhirlpoolClient } from '@orca-so/whirlpools-sdk';
   import { connection } from '@/lib/solana/connection';
   
   export async function getOrcaPrice(
     tokenMint: string,
     baseMint: string = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
   ) {
     const ctx = WhirlpoolContext.from(
       connection,
       wallet, // Need to handle this
       ORCA_WHIRLPOOL_PROGRAM_ID
     );
     
     const client = buildWhirlpoolClient(ctx);
     
     // Get whirlpool for token pair
     const whirlpool = await client.getPool(tokenMint, baseMint);
     
     // Get current price from pool
     const price = await whirlpool.getPrice();
     
     return {
       dex: 'Orca',
       price,
       liquidity: whirlpool.getLiquidity(),
       fee: whirlpool.getFee(),
     };
   }
```

3. **Documentation:**
   - Orca SDK: https://orca-so.gitbook.io/orca-developer-portal/
   - Whirlpools: https://orca-so.gitbook.io/orca-developer-portal/whirlpools/overview

#### Step 4: Create Unified Price Aggregator (20 min)

**Goal:** Single function that fetches from all DEXs and compares.

**Action Items:**

1. **Create aggregator:**
```typescript
   // lib/dex/aggregator.ts
   import { getRaydiumPrice } from './raydium';
   import { getOrcaPrice } from './orca';
   import { TOKENS } from '../tokens';
   
   export interface DexPrice {
     dex: string;
     price: number;
     liquidity: number;
     fee: number;
     timestamp: number;
   }
   
   export async function fetchAllDexPrices(tokenMint: string): Promise<DexPrice[]> {
     const [raydium, orca] = await Promise.allSettled([
       getRaydiumPrice(tokenMint),
       getOrcaPrice(tokenMint),
     ]);
     
     const prices: DexPrice[] = [];
     
     if (raydium.status === 'fulfilled') {
       prices.push({ ...raydium.value, timestamp: Date.now() });
     }
     
     if (orca.status === 'fulfilled') {
       prices.push({ ...orca.value, timestamp: Date.now() });
     }
     
     return prices;
   }
```

2. **Create API route:**
```typescript
   // app/api/dex-prices/route.ts
   import { NextResponse } from 'next/server';
   import { fetchAllDexPrices } from '@/lib/dex/aggregator';
   
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const mint = searchParams.get('mint');
     
     if (!mint) {
       return NextResponse.json({ error: 'Missing mint' }, { status: 400 });
     }
     
     try {
       const prices = await fetchAllDexPrices(mint);
       return NextResponse.json({ prices });
     } catch (error) {
       console.error('DEX price fetch error:', error);
       return NextResponse.json(
         { error: 'Failed to fetch DEX prices' },
         { status: 500 }
       );
     }
   }
```

#### Step 5: Build Arbitrage Detection Logic (30 min)

**Goal:** Calculate profitable opportunities from price differences.

**Action Items:**

1. **Create arbitrage calculator:**
```typescript
   // lib/calculations/arbitrage.ts
   import { DexPrice } from '../dex/aggregator';
   
   export interface ArbitrageOpportunity {
     tokenSymbol: string;
     tokenMint: string;
     buyDex: string;
     buyPrice: number;
     sellDex: string;
     sellPrice: number;
     spread: number;
     spreadPercent: number;
     estimatedProfit: number;
     estimatedProfitPercent: number;
     liquidity: number;
     timestamp: number;
   }
   
   export function calculateArbitrage(
     tokenSymbol: string,
     tokenMint: string,
     prices: DexPrice[],
     tradeSize: number = 1000 // $1000 USD
   ): ArbitrageOpportunity | null {
     if (prices.length < 2) return null;
     
     // Sort by price
     const sorted = [...prices].sort((a, b) => a.price - b.price);
     const buyDex = sorted[0]; // Cheapest
     const sellDex = sorted[sorted.length - 1]; // Most expensive
     
     // Calculate spread
     const spread = sellDex.price - buyDex.price;
     const spreadPercent = (spread / buyDex.price) * 100;
     
     // Calculate fees (both buy and sell)
     const totalFee = buyDex.fee + sellDex.fee;
     
     // Estimate profit
     const grossProfit = spread * (tradeSize / buyDex.price);
     const fees = tradeSize * totalFee;
     const netProfit = grossProfit - fees;
     const profitPercent = (netProfit / tradeSize) * 100;
     
     // Only return if profitable after fees
     if (profitPercent <= 0.1) return null; // Min 0.1% profit
     
     return {
       tokenSymbol,
       tokenMint,
       buyDex: buyDex.dex,
       buyPrice: buyDex.price,
       sellDex: sellDex.dex,
       sellPrice: sellDex.price,
       spread,
       spreadPercent,
       estimatedProfit: netProfit,
       estimatedProfitPercent: profitPercent,
       liquidity: Math.min(buyDex.liquidity, sellDex.liquidity),
       timestamp: Date.now(),
     };
   }
```

2. **Create scanner that checks all tokens:**
```typescript
   // lib/calculations/scanner.ts
   import { TOKENS } from '../tokens';
   import { fetchAllDexPrices } from '../dex/aggregator';
   import { calculateArbitrage } from './arbitrage';
   
   export async function scanForOpportunities() {
     const opportunities = await Promise.all(
       TOKENS.map(async (token) => {
         const prices = await fetchAllDexPrices(token.mint!);
         return calculateArbitrage(token.symbol, token.mint!, prices);
       })
     );
     
     // Filter out nulls, sort by profit %
     return opportunities
       .filter(Boolean)
       .sort((a, b) => b!.estimatedProfitPercent - a!.estimatedProfitPercent);
   }
```

#### Step 6: Build Opportunities UI Component (30 min)

**Goal:** Display arbitrage opportunities in a dedicated section.

**Action Items:**

1. **Create opportunities component:**
```typescript
   // components/opportunities/OpportunityList.tsx
   'use client';
   
   import { useEffect, useState } from 'react';
   import { ArbitrageOpportunity } from '@/lib/calculations/arbitrage';
   import { TrendingUp, ArrowRight } from 'lucide-react';
   
   export default function OpportunityList() {
     const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       async function fetchOpportunities() {
         try {
           const response = await fetch('/api/opportunities');
           const data = await response.json();
           setOpportunities(data.opportunities || []);
         } catch (error) {
           console.error('Failed to fetch opportunities:', error);
         } finally {
           setLoading(false);
         }
       }
       
       fetchOpportunities();
       const interval = setInterval(fetchOpportunities, 30000); // 30s
       return () => clearInterval(interval);
     }, []);
     
     if (loading) {
       return <div>Scanning for opportunities...</div>;
     }
     
     if (opportunities.length === 0) {
       return (
         <div className="text-center p-8">
           <p style={{ color: 'var(--text-secondary)' }}>
             No profitable opportunities found at this time.
           </p>
         </div>
       );
     }
     
     return (
       <div className="space-y-4">
         <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
           Arbitrage Opportunities 🎯
         </h2>
         
         <div className="grid gap-4">
           {opportunities.map((opp, idx) => (
             <div
               key={`${opp.tokenMint}-${idx}`}
               className="border rounded-xl p-6 hover:scale-[1.02] transition-all"
               style={{
                 backgroundColor: 'var(--bg-card)',
                 borderColor: 'var(--border-default)',
               }}
             >
               <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                     {opp.tokenSymbol}
                   </h3>
                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                     {opp.buyDex} → {opp.sellDex}
                   </p>
                 </div>
                 
                 <div className="text-right">
                   <div className="flex items-center gap-2">
                     <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
                     <span className="text-2xl font-bold" style={{ color: '#10B981' }}>
                       +{opp.estimatedProfitPercent.toFixed(2)}%
                     </span>
                   </div>
                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                     Est. ${opp.estimatedProfit.toFixed(2)} profit
                   </p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4 text-sm">
                 <div>
                   <span style={{ color: 'var(--text-secondary)' }}>Buy: </span>
                   <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                     ${opp.buyPrice.toFixed(4)}
                   </span>
                 </div>
                 
                 <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                 
                 <div>
                   <span style={{ color: 'var(--text-secondary)' }}>Sell: </span>
                   <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                     ${opp.sellPrice.toFixed(4)}
                   </span>
                 </div>
                 
                 <div className="ml-auto">
                   <span style={{ color: 'var(--text-secondary)' }}>Spread: </span>
                   <span className="font-semibold" style={{ color: '#10B981' }}>
                     {opp.spreadPercent.toFixed(3)}%
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     );
   }
```

2. **Add to main page:**
```typescript
   // app/page.tsx - add after PriceGrid
   import OpportunityList from '@/components/opportunities/OpportunityList';
   
   // Inside the main div:
   <ErrorBoundary>
     <OpportunityList />
   </ErrorBoundary>
```

3. **Create API route:**
```typescript
   // app/api/opportunities/route.ts
   import { NextResponse } from 'next/server';
   import { scanForOpportunities } from '@/lib/calculations/scanner';
   
   export async function GET() {
     try {
       const opportunities = await scanForOpportunities();
       return NextResponse.json({ opportunities });
     } catch (error) {
       console.error('Opportunity scan error:', error);
       return NextResponse.json(
         { error: 'Failed to scan for opportunities' },
         { status: 500 }
       );
     }
   }
```

---

### Phase 3: WebSocket Real-Time Updates (Future)

**Goal:** Sub-second latency for detecting opportunities before others.

**Key Changes:**
- Replace polling with WebSocket connections
- Use Helius WebSocket API
- Update UI in real-time as pool prices change
- Add sound/notification alerts for high-profit opportunities

**Resources:**
- Helius WebSocket docs: https://docs.helius.dev/websockets-and-webhooks/websockets

---

### Phase 4: Trade Execution (Future)

**Goal:** Automatically execute profitable trades.

**Requirements:**
- Wallet integration (@solana/wallet-adapter)
- Transaction building with Raydium/Orca SDKs
- Slippage protection
- MEV protection (Jito bundles)
- Position sizing logic
- Risk management

**⚠️ WARNING:** This phase involves real money. Requires extensive testing on devnet first.

---

### Phase 5: Performance Tracking & Analytics (Future)

**Goal:** Track trades, calculate P&L, optimize strategy.

**Features:**
- Trade history database (Supabase/PostgreSQL)
- P&L charts
- Win rate, avg profit, max drawdown metrics
- Strategy backtesting
- Performance dashboard

---

## 🐛 Known Issues & Limitations

### Current (Phase 1)
- **CoinGecko rate limits** - Free tier is very limited (10-30 req/min)
  - Mitigation: 5-minute cache, 30s polling interval
  - Fix: Move to Helius RPC + DEX SDKs in Phase 2
  
- **No real arbitrage detection** - Just displaying prices
  - Fix: Phase 2 will add multi-DEX comparison
  
- **Sparklines are flat initially** - Need time to accumulate data
  - This is expected behavior, will improve with WebSockets

### Technical Debt
- API route naming (`/jupiter` calls CoinGecko) - will fix when switching to real DEX data
- No database yet - all data is ephemeral
- No error retry logic - should add exponential backoff
- No rate limit handling on client - could be smarter about it

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] All 5 tokens display prices correctly
- [ ] Theme toggle works (light/dark persist)
- [ ] Modal opens/closes for each token
- [ ] Historical charts load without errors
- [ ] Price updates every 30 seconds
- [ ] Rate limit errors handled gracefully
- [ ] Mobile responsive (test on phone)

### Future: Automated Testing
- Unit tests for arbitrage calculations
- Integration tests for DEX SDK calls
- E2E tests for critical user flows
- Load testing for WebSocket connections

---

## 📊 Performance Targets

### Current
- Initial page load: <2s
- Price update latency: 30s (polling)
- Modal open time: <500ms

### Phase 2 Goals
- Price update latency: <1s (WebSocket)
- Arbitrage detection: <100ms
- UI update after opportunity found: <200ms

### Phase 3 Goals (Trading)
- Opportunity detected → Trade submitted: <500ms
- This is competitive with other MEV bots

---

## 🤝 Contributing

This is a solo project for now, but following best practices for potential future collaboration:

1. **Branch naming:** `feature/description` or `fix/description`
2. **Commit messages:** Use conventional commits (feat:, fix:, docs:, etc.)
3. **Code style:** Prettier + ESLint (will add configs)
4. **PR template:** Will create when needed

---

## 📝 Development Log

### Session 1 (Nov 3, 2024) - Foundation
**Time:** ~4 hours  
**Completed:**
- ✅ Project setup (Next.js 15, TypeScript, Tailwind)
- ✅ RTK Query integration
- ✅ Multi-token price grid (5 tokens)
- ✅ CoinGecko API integration
- ✅ Miami Vice theme system (light/dark)
- ✅ 24h price change indicators
- ✅ Mini sparkline charts
- ✅ Expandable modal with full charts
- ✅ Error boundaries
- ✅ Smart caching (rate limit mitigation)
- ✅ React 19 best practices

**Key Decisions:**
- Chose RTK Query over SWR (better for complex state)
- Used CoinGecko as temporary data source (will switch to DEX SDKs)
- Implemented client-side price history tracking (will move to WebSocket)
- 30s polling to respect free tier limits

**Blockers Resolved:**
- Jupiter API 401 errors → Switched to CoinGecko
- CoinGecko 429 rate limits → Added 5-min cache + lazy loading

### Session 2 (TBD) - Real DEX Integration
**Planned:**
- [ ] Helius RPC setup
- [ ] Raydium SDK integration
- [ ] Orca Whirlpools integration
- [ ] Arbitrage detection logic
- [ ] Opportunities UI component

---

## 🔗 Useful Resources

### Solana Development
- [Solana Cookbook](https://solanacookbook.com/) - Best practices
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework](https://www.anchor-lang.com/) - For Orca integration

### DEX Documentation
- [Raydium Docs](https://docs.raydium.io/)
- [Orca Docs](https://docs.orca.so/)
- [Jupiter Docs](https://station.jup.ag/docs/)

### RPC Providers
- [Helius](https://docs.helius.dev/) - Recommended
- [QuickNode](https://www.quicknode.com/docs/solana)
- [Triton (RPC One)](https://docs.triton.one/)

### Trading & MEV
- [Jito Labs](https://www.jito.wtf/) - MEV protection
- [Solana MEV Dashboard](https://www.jito.wtf/dashboard/)

---

## 💰 Cost Breakdown

### Current (Phase 1)
- **$0/month** - Using free tiers only

### Phase 2 (Real DEX Integration)
- **Helius Pro:** $50-100/month
  - 1000+ req/s
  - WebSocket access
  - Required for production

### Phase 3+ (Trading)
- **Helius:** $50-100/month (same)
- **Jito Bundles:** Variable, paid per bundle
- **Infrastructure:** $10-50/month (database, monitoring)
- **Total:** ~$100-200/month operational costs

**ROI Target:** First profitable trade should cover monthly costs. Break-even within week 1 of trading.

---

## 📄 License

Private project - All rights reserved

---

## 🙏 Acknowledgments

Built during one epic coding session. Shoutout to:
- The Solana developer community
- Raydium, Orca, Jupiter teams for open-source SDKs
- Miami for the vibes 🌴

---

**Last Updated:** Nov 3, 2024  
**Status:** Phase 1 Complete ✅ | Phase 2 Ready to Start 🚀