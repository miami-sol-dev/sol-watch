'use client';

import { Gauge, TrendingUp, Clock, Activity } from 'lucide-react';
import Tooltip, { TooltipTitle, TooltipSection, TooltipExample } from '@/components/ui/Tooltip';

interface PerformanceData {
  numTransactions: number;
  numSlots: number;
  samplePeriodSecs: number;
  tps: number;
}

interface PerformanceCardProps {
  performance?: PerformanceData;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  return (
    <div
      className="rounded-xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center gap-3">
          <Gauge className="w-6 h-6" style={{ color: '#00B8D4' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Network Performance
          </h2>
          <Tooltip
            content={
              <>
                <TooltipTitle>Network Performance Metrics</TooltipTitle>
                <TooltipSection>
                  These metrics show how well Solana is performing right now. Think of it like 
                  measuring a highway's traffic flow - how many cars (transactions) can pass 
                  through per second?
                </TooltipSection>
                <TooltipSection title="Why Performance Matters">
                  • Faster networks = quicker transaction confirmations
                  <br />
                  • Higher capacity = lower fees
                  <br />
                  • Consistent performance = reliable blockchain
                  <br />
                  • For arbitrage: Speed is profit!
                </TooltipSection>
                <TooltipSection title="Solana vs Others">
                  • <strong>Solana:</strong> Up to ~65,000 TPS theoretical
                  <br />
                  • <strong>Ethereum:</strong> ~15-30 TPS
                  <br />
                  • <strong>Bitcoin:</strong> ~7 TPS
                  <br />
                  • <strong>Visa:</strong> ~24,000 TPS (for comparison!)
                </TooltipSection>
                <TooltipExample>
                  Solana's speed is why it's popular for DeFi and NFTs - you can swap tokens 
                  or mint NFTs in under a second!
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Real-time metrics from recent network samples
        </p>
      </div>

      <div className="p-6">
        {performance ? (
          <div className="space-y-6">
            {/* TPS - Main Metric */}
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-5 h-5" style={{ color: '#F94C9B' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Transactions Per Second
                </span>
                <Tooltip
                  content={
                    <>
                      <TooltipTitle>TPS: Transactions Per Second</TooltipTitle>
                      <TooltipSection>
                        This is THE key metric for blockchain performance. It tells you how many 
                        transactions the network can process every single second.
                      </TooltipSection>
                      <TooltipSection title="What Counts as a Transaction?">
                        Every action on Solana is a transaction:
                        <br />
                        • Sending SOL to someone
                        <br />
                        • Swapping tokens on a DEX
                        <br />
                        • Minting an NFT
                        <br />
                        • Updating a smart contract
                        <br />
                        • Even just checking your balance!
                      </TooltipSection>
                      <TooltipSection title="Current TPS: {Math.round(performance.tps).toLocaleString()}">
                        {performance.tps < 1000 && "Network is relatively quiet right now. "}
                        {performance.tps >= 1000 && performance.tps < 3000 && "Moderate activity - typical usage. "}
                        {performance.tps >= 3000 && "High activity! Network is busy. 🔥 "}
                        <br />
                        <br />
                        This is calculated from actual recent network data, not theoretical maximums.
                      </TooltipSection>
                      <TooltipSection title="Why It Fluctuates">
                        TPS changes constantly based on:
                        <br />
                        • Time of day (more activity during US hours)
                        <br />
                        • Market conditions (high during volatile price moves)
                        <br />
                        • NFT drops or new token launches
                        <br />
                        • Bot activity and arbitrage trading
                      </TooltipSection>
                      <TooltipExample>
                        During major NFT mints or market crashes, Solana can spike to 5,000+ TPS. 
                        Current {Math.round(performance.tps)} TPS means the network is handling 
                        {Math.round(performance.tps * 60).toLocaleString()} transactions per minute!
                      </TooltipExample>
                    </>
                  }
                  position="bottom"
                />
              </div>
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {Math.round(performance.tps).toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                TPS
              </div>
            </div>

            {/* Additional Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Transactions */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Transactions
                  </span>
                  <Tooltip
                    content={
                      <>
                        <TooltipTitle>Total Transactions in Sample</TooltipTitle>
                        <TooltipSection>
                          This shows the total number of transactions that were processed during 
                          our sample period ({performance.samplePeriodSecs} seconds).
                        </TooltipSection>
                        <TooltipSection title="The Math">
                          {performance.numTransactions.toLocaleString()} transactions 
                          ÷ {performance.samplePeriodSecs} seconds 
                          = {Math.round(performance.tps)} TPS
                        </TooltipSection>
                        <TooltipSection title="Why This Number?">
                          We take a recent sample period rather than looking at every single 
                          transaction since genesis (would be billions!). This gives us a 
                          "snapshot" of current network activity.
                        </TooltipSection>
                        <TooltipSection title="Transaction Types Included">
                          This includes ALL transaction types:
                          <br />
                          • User transactions (transfers, swaps)
                          <br />
                          • System transactions (consensus, voting)
                          <br />
                          • Smart contract executions
                          <br />
                          • Failed transactions (they still use network resources!)
                        </TooltipSection>
                        <TooltipExample>
                          If you're seeing {performance.numTransactions.toLocaleString()} 
                          transactions in {performance.samplePeriodSecs} seconds, that means 
                          roughly {Math.round(performance.numTransactions / performance.numSlots)} 
                          transactions per slot on average!
                        </TooltipExample>
                      </>
                    }
                    position="bottom"
                  />
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {performance.numTransactions.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                  in sample period
                </div>
              </div>

              {/* Slots */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Slots
                  </span>
                  <Tooltip
                    content={
                      <>
                        <TooltipTitle>Slots in Sample Period</TooltipTitle>
                        <TooltipSection>
                          Slots are Solana's time measurement. Each slot is ~400 milliseconds 
                          (0.4 seconds) and represents an opportunity to create a block.
                        </TooltipSection>
                        <TooltipSection title="Current Sample">
                          {performance.numSlots.toLocaleString()} slots 
                          in {performance.samplePeriodSecs} seconds
                          <br />
                          <br />
                          That's about {(performance.numSlots / performance.samplePeriodSecs).toFixed(1)} 
                          slots per second (should be ~2.5 slots/sec on average).
                        </TooltipSection>
                        <TooltipSection title="Slots vs Blocks">
                          Not every slot produces a block:
                          <br />
                          • <strong>Slot:</strong> Time interval (every 400ms)
                          <br />
                          • <strong>Block:</strong> Contains actual transactions
                          <br />
                          • Empty slots = no transactions to process
                          <br />
                          • Skipped slots = network missed the opportunity
                        </TooltipSection>
                        <TooltipSection title="Why Slots Matter">
                          • Provides precise timestamp for transactions
                          <br />
                          • Shows network timing consistency
                          <br />
                          • Helps calculate block production rate
                          <br />
                          • Used for scheduling and ordering events
                        </TooltipSection>
                        <TooltipExample>
                          If Solana produced 2.5 slots/second perfectly, we'd have 150 slots per minute. 
                          Current rate: {Math.round(performance.numSlots / (performance.samplePeriodSecs / 60))} 
                          slots/minute in this sample.
                        </TooltipExample>
                      </>
                    }
                    position="bottom"
                  />
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {performance.numSlots.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                  in {performance.samplePeriodSecs}s
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>Network Load</span>
                  <Tooltip
                    content={
                      <>
                        <TooltipTitle>Network Load / Capacity</TooltipTitle>
                        <TooltipSection>
                          This bar shows how much of Solana's capacity is currently being used. 
                          Think of it like a highway - is it empty, flowing smoothly, or congested?
                        </TooltipSection>
                        <TooltipSection title="How It's Calculated">
                          We compare current TPS against a realistic maximum:
                          <br />
                          <br />
                          ({Math.round(performance.tps)} current TPS ÷ 5,000 max TPS) 
                          × 100 = {Math.round((performance.tps / 5000) * 100)}%
                        </TooltipSection>
                        <TooltipSection title="Load Levels">
                          • <span style={{color: '#10B981'}}>0-40%: Low</span> - Network has plenty of capacity
                          <br />
                          • <span style={{color: '#F59E0B'}}>40-70%: Medium</span> - Moderate usage, still fast
                          <br />
                          • <span style={{color: '#EF4444'}}>70-100%: High</span> - Heavy usage, may slow down
                        </TooltipSection>
                        <TooltipSection title="Why 5,000 TPS Max?">
                          While Solana's theoretical max is ~65,000 TPS, in practice the network 
                          typically handles 2,000-5,000 TPS comfortably. We use 5,000 as a 
                          realistic "full capacity" benchmark.
                        </TooltipSection>
                        <TooltipExample>
                          Current {Math.round((performance.tps / 5000) * 100)}% load means 
                          the network could handle about {Math.round((1 - performance.tps / 5000) * 100)}% 
                          more traffic before experiencing congestion!
                        </TooltipExample>
                      </>
                    }
                    position="top"
                  />
                </div>
                <span style={{ color: 'var(--text-primary)' }} className="font-semibold">
                  {Math.round((performance.tps / 5000) * 100)}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--border-default)' }}
              >
                <div
                  className="h-full gradient-miami transition-all duration-500"
                  style={{ width: `${Math.min((performance.tps / 5000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                  Based on ~5,000 TPS typical capacity
                </p>
                <Tooltip
                  content={
                    <>
                      <TooltipTitle>About Network Capacity</TooltipTitle>
                      <TooltipSection>
                        Solana's capacity varies based on:
                      </TooltipSection>
                      <TooltipSection title="Technical Factors">
                        • Validator hardware performance
                        <br />
                        • Network bandwidth
                        <br />
                        • Transaction complexity
                        <br />
                        • Number of active validators
                      </TooltipSection>
                      <TooltipSection title="Theoretical vs Practical">
                        • <strong>Lab tests:</strong> 65,000+ TPS possible
                        <br />
                        • <strong>Mainnet typical:</strong> 2,000-5,000 TPS
                        <br />
                        • <strong>Peak observed:</strong> ~7,000+ TPS during spikes
                      </TooltipSection>
                      <TooltipSection title="Why The Difference?">
                        Real-world networks face challenges that don't exist in controlled tests:
                        <br />
                        • Geographic distribution of validators
                        <br />
                        • Varying transaction types and sizes
                        <br />
                        • Consensus overhead
                        <br />
                        • Spam and bot activity
                      </TooltipSection>
                      <TooltipExample>
                        During the 2024 NFT boom, Solana sustained 4,000+ TPS for hours without 
                        degradation. The network is constantly being optimized to increase this!
                      </TooltipExample>
                    </>
                  }
                  position="top"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-24 rounded-xl mx-auto" style={{ backgroundColor: 'var(--border-default)' }}></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--border-default)' }}></div>
                <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--border-default)' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}