'use client';

import { Activity, Zap, Database } from 'lucide-react';
import { DashboardData } from './Dashboard';
import Tooltip, { TooltipTitle, TooltipSection, TooltipExample } from '@/components/ui/Tooltip';

interface NetworkStatsCardProps {
  data: DashboardData | null;
  error: string | null;
  onRetry: () => void;
}

export default function NetworkStatsCard({ data, error, onRetry }: NetworkStatsCardProps) {
  if (error) {
    return (
      <div
        className="rounded-xl p-6 border border-red-500"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <h3 className="text-red-500 font-bold mb-2">Network Error</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg gradient-miami text-white hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Block Height */}
      <div
        className="rounded-xl p-6 border hover:scale-[1.02] transition-transform cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-6 h-6" style={{ color: '#F94C9B' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Current Block
          </span>
          <Tooltip
            content={
              <>
                <TooltipTitle>What is a Block?</TooltipTitle>
                <TooltipSection>
                  Think of blocks like pages in a ledger book. Each block contains a bunch of 
                  transactions (transfers, swaps, etc.) that have been verified and permanently 
                  recorded on the blockchain.
                </TooltipSection>
                <TooltipSection title="Block Height">
                  This is simply the number of blocks that have been created since Solana launched. 
                  It's like saying "we're on page #280,123 of the ledger." Higher numbers = older blockchain.
                </TooltipSection>
                <TooltipSection title="Why It Matters">
                  • Shows the blockchain is actively processing transactions
                  <br />
                  • Each new block = ~400ms on Solana (super fast!)
                  <br />
                  • Used to track when transactions happened
                </TooltipSection>
                <TooltipExample>
                  If you sent SOL in block 280,000, and we're now at 280,123, your transaction 
                  was 123 blocks ago (~49 seconds).
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
        <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {data.blockHeight.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Slot: {data.slot.toLocaleString()}
          </p>
          <Tooltip
            content={
              <>
                <TooltipTitle>What is a Slot?</TooltipTitle>
                <TooltipSection>
                  Slots are Solana's time measurement unit. Think of them like seconds on a clock, 
                  but for the blockchain. Every slot is an opportunity to create a new block.
                </TooltipSection>
                <TooltipSection title="Key Differences">
                  • <strong>Slot:</strong> Time-based (every ~400ms)
                  <br />
                  • <strong>Block:</strong> Contains actual transactions
                  <br />
                  • Not every slot produces a block (sometimes there's no transactions to process)
                </TooltipSection>
                <TooltipSection title="Why Two Numbers?">
                  Slot number is always equal to or higher than block height. The difference shows 
                  how many "empty" slots occurred (no transactions to process).
                </TooltipSection>
                <TooltipExample>
                  Current slot: 280,123 → Block: 280,100 → Means 23 slots had no blocks (network was quiet).
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
      </div>

      {/* Network Status */}
      <div
        className="rounded-xl p-6 border hover:scale-[1.02] transition-transform cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-6 h-6" style={{ color: '#10B981' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Network Status
          </span>
          <Tooltip
            content={
              <>
                <TooltipTitle>Network Status Explained</TooltipTitle>
                <TooltipSection>
                  This shows whether we can successfully connect to the Solana blockchain through 
                  our Helius RPC (Remote Procedure Call) endpoint.
                </TooltipSection>
                <TooltipSection title="What's an RPC?">
                  Think of it like a phone line to the blockchain. Instead of running your own 
                  Solana node (which requires tons of computing power), we use Helius to "call" 
                  the blockchain and get data.
                </TooltipSection>
                <TooltipSection title="Status Indicators">
                  • <span style={{ color: '#10B981' }}>🟢 ONLINE</span> - Connected and receiving data
                  <br />
                  • <span style={{ color: '#EF4444' }}>🔴 OFFLINE</span> - Connection lost or RPC issue
                  <br />
                  • <span style={{ color: '#F59E0B' }}>🟡 DEGRADED</span> - Slow or intermittent connection
                </TooltipSection>
                <TooltipSection title="Why Use Helius?">
                  Helius provides enterprise-grade infrastructure with:
                  <br />
                  • Faster response times
                  <br />
                  • Higher rate limits
                  <br />
                  • Enhanced APIs for token data
                  <br />
                  • 99.9% uptime guarantee
                </TooltipSection>
                <TooltipExample>
                  Without RPC services like Helius, you'd need to download ~100GB+ and maintain 
                  a full Solana node just to read blockchain data!
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#10B981' }}></span>
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: '#10B981' }}></span>
          </div>
          <span className="text-2xl font-bold" style={{ color: '#10B981' }}>ONLINE</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          Helius RPC Connected
        </p>
      </div>

      {/* Update Rate */}
      <div
        className="rounded-xl p-6 border hover:scale-[1.02] transition-transform cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6" style={{ color: '#00B8D4' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Update Rate
          </span>
          <Tooltip
            content={
              <>
                <TooltipTitle>How Often Do We Refresh?</TooltipTitle>
                <TooltipSection>
                  This shows how frequently the dashboard fetches new data from the Solana 
                  blockchain. Think of it like hitting "refresh" on a webpage automatically.
                </TooltipSection>
                <TooltipSection title="Current Rate: 10 Seconds">
                  We update every 10 seconds, which means:
                  <br />
                  • You see ~6 updates per minute
                  <br />
                  • Data is never more than 10 seconds old
                  <br />
                  • Balance between freshness and API limits
                </TooltipSection>
                <TooltipSection title="Why Not Real-Time?">
                  While Solana creates blocks every ~400ms, updating that fast would:
                  <br />
                  • Overwhelm your browser with constant redraws
                  <br />
                  • Hit API rate limits quickly
                  <br />
                  • Use unnecessary bandwidth
                  <br />
                  • Make numbers hard to read
                </TooltipSection>
                <TooltipSection title="Different Update Rates">
                  • Network stats: 10 seconds
                  <br />
                  • Token prices: 30 seconds (prices don't change that fast)
                  <br />
                  • Transaction feed: Real-time (when implemented with WebSocket)
                </TooltipSection>
                <TooltipExample>
                  With Helius Pro, you could update even faster without hitting limits. 
                  Free tier = 100 requests/hour, Pro = unlimited!
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
        <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          10s
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          Last: {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
        </p>
      </div>
    </div>
  );
}