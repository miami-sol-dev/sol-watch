'use client';

import { useState, useEffect } from 'react';
import { Clock, ExternalLink, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import Tooltip, { TooltipTitle, TooltipSection, TooltipExample } from '@/components/ui/Tooltip';

interface Transaction {
  signature: string;
  slot: number;
  timestamp: number;
  type: 'transfer' | 'swap' | 'other';
  amount?: number;
  success: boolean;
}

interface RecentActivityCardProps {
  slot?: number;
}

export default function RecentActivityCard({ slot }: RecentActivityCardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000); // Update every 15s
    return () => clearInterval(interval);
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(false);
      setError(null);

      const response = await fetch('/api/helius/transactions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setTransactions(result.transactions || []);
    } catch (err) {
      console.error('Transaction fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'swap':
        return <ArrowDownLeft className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transfer':
        return '#10B981';
      case 'swap':
        return '#F94C9B';
      default:
        return '#6B7280';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'Transfer';
      case 'swap':
        return 'Swap';
      default:
        return 'Contract';
    }
  };

  return (
    <div
      className="rounded-xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" style={{ color: '#F94C9B' }} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recent Activity
                </h2>
                <Tooltip
                  content={
                    <>
                      <TooltipTitle>Live Blockchain Activity</TooltipTitle>
                      <TooltipSection>
                        This shows real transactions happening on the Solana blockchain right now. 
                        Each entry represents an actual transfer, swap, or smart contract interaction 
                        that was just processed.
                      </TooltipSection>
                      <TooltipSection title="What's a Transaction?">
                        A transaction is any action recorded on the blockchain:
                        <br />
                        • <strong style={{color: '#10B981'}}>Transfer:</strong> Moving tokens from one wallet to another
                        <br />
                        • <strong style={{color: '#F94C9B'}}>Swap:</strong> Trading one token for another on a DEX
                        <br />
                        • <strong style={{color: '#6B7280'}}>Contract:</strong> Interacting with smart contracts (NFTs, DeFi, etc.)
                      </TooltipSection>
                      <TooltipSection title="Why Watch This?">
                        For arbitrage trading, monitoring transactions helps you:
                        <br />
                        • Spot large trades that might affect prices
                        <br />
                        • See which tokens are being actively traded
                        <br />
                        • Identify patterns and opportunities
                        <br />
                        • Monitor network activity levels
                      </TooltipSection>
                      <TooltipSection title="Data Source">
                        These are real transactions fetched directly from Helius RPC, showing 
                        actual activity on popular DEX contracts like Raydium. Updates every 15 seconds.
                      </TooltipSection>
                      <TooltipExample>
                        When you see a large swap transaction, it might create a temporary price 
                        difference between exchanges - that's your arbitrage opportunity!
                      </TooltipExample>
                    </>
                  }
                  position="bottom"
                />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Live from Solana blockchain via Helius
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#10B981' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#10B981' }}></span>
            </span>
            Live Feed
          </span>
        </div>
      </div>

      <div className="p-6">
        {loading && transactions.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--border-default)' }}></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 rounded mb-2" style={{ backgroundColor: 'var(--border-default)' }}></div>
                  <div className="h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--border-default)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Unable to fetch live transactions
            </p>
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 rounded-lg text-sm gradient-miami text-white hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No recent transactions found
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, idx) => (
              <div
                key={tx.signature}
                className="flex items-center gap-3 p-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <Tooltip
                    content={
                      <>
                        <TooltipTitle>Transaction Type: {getTypeName(tx.type)}</TooltipTitle>
                        {tx.type === 'transfer' && (
                          <TooltipSection>
                            <strong>Transfer Transaction</strong>
                            <br />
                            Someone sent tokens from their wallet to another wallet. This could be:
                            <br />
                            • Payment for goods/services
                            <br />
                            • Moving funds between own wallets
                            <br />
                            • Funding a trading account
                            <br />
                            • Withdrawing profits
                          </TooltipSection>
                        )}
                        {tx.type === 'swap' && (
                          <TooltipSection>
                            <strong>Swap Transaction</strong>
                            <br />
                            Someone traded one token for another on a DEX (Decentralized Exchange) like:
                            <br />
                            • Jupiter (aggregates best prices)
                            <br />
                            • Raydium (AMM)
                            <br />
                            • Orca (AMM)
                            <br />
                            <br />
                            This is the main activity you want to watch for arbitrage!
                          </TooltipSection>
                        )}
                        {tx.type === 'other' && (
                          <TooltipSection>
                            <strong>Smart Contract Interaction</strong>
                            <br />
                            This could be many different things:
                            <br />
                            • NFT minting or trading
                            <br />
                            • Staking/unstaking tokens
                            <br />
                            • Providing liquidity to pools
                            <br />
                            • Interacting with DeFi protocols
                            <br />
                            • Voting on governance proposals
                          </TooltipSection>
                        )}
                        <TooltipExample>
                          For arbitrage, focus on "Swap" transactions involving your target tokens. 
                          Large swaps can temporarily move prices!
                        </TooltipExample>
                      </>
                    }
                    position="right"
                  >
                    <div style={{ color: getTypeColor(tx.type) }}>
                      {getTypeIcon(tx.type)}
                    </div>
                  </Tooltip>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Transaction Signature</TooltipTitle>
                          <TooltipSection>
                            <span className="font-mono text-xs break-all">{tx.signature}</span>
                          </TooltipSection>
                          <TooltipSection title="What is this?">
                            Every transaction on Solana gets a unique signature - like a tracking 
                            number for a package. It's a cryptographic hash that:
                            <br />
                            • Proves the transaction is authentic
                            <br />
                            • Can't be duplicated or faked
                            <br />
                            • Lets you look up transaction details
                            <br />
                            • Acts as permanent receipt
                          </TooltipSection>
                          <TooltipSection title="Why So Long?">
                            Signatures are 88 characters long (base58 encoded) to ensure uniqueness. 
                            With this length, the chance of two transactions having the same signature 
                            is astronomically impossible.
                          </TooltipSection>
                          <TooltipSection title="View Full Details">
                            Click this transaction to view it on Solscan block explorer, where you can see:
                            <br />
                            • All accounts involved
                            <br />
                            • Exact token amounts
                            <br />
                            • Fees paid
                            <br />
                            • Program logs
                          </TooltipSection>
                          <TooltipExample>
                            Like a FedEx tracking number, you can follow this transaction's journey 
                            from submission → validation → finalization!
                          </TooltipExample>
                        </>
                      }
                      position="right"
                    >
                      <span
                        className="text-sm font-mono font-semibold truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                      </span>
                    </Tooltip>
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Transaction Status</TooltipTitle>
                          <TooltipSection>
                            {tx.success ? (
                              <>
                                <span style={{color: '#10B981'}}>✓ Success</span>
                                <br />
                                This transaction was validated by the network and included in a block. 
                                The action is complete and permanent!
                              </>
                            ) : (
                              <>
                                <span style={{color: '#EF4444'}}>✗ Failed</span>
                                <br />
                                This transaction was submitted but failed to execute. The user still 
                                paid a small fee, but their intended action didn't complete.
                              </>
                            )}
                          </TooltipSection>
                          <TooltipSection title="Why Transactions Fail">
                            Common reasons:
                            <br />
                            • Insufficient balance
                            <br />
                            • Slippage too high (price moved too much)
                            <br />
                            • Smart contract error
                            <br />
                            • Account doesn't exist
                            <br />
                            • Network congestion timeout
                          </TooltipSection>
                          <TooltipSection title="Failed ≠ Free">
                            Even failed transactions cost a small fee (~0.000005 SOL) because:
                            <br />
                            • Validators still processed it
                            <br />
                            • Network resources were used
                            <br />
                            • Prevents spam attacks
                          </TooltipSection>
                          <TooltipExample>
                            {tx.success ? (
                              "This successful transaction means the tokens/action was completed and is now irreversible."
                            ) : (
                              "This failed transaction means the user tried something but it didn't work - maybe they set slippage too tight on a swap!"
                            )}
                          </TooltipExample>
                        </>
                      }
                      position="right"
                    >
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {tx.success ? '✓' : '✗'}
                      </span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <span className="capitalize">{getTypeName(tx.type)}</span>
                    <span>•</span>
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Slot Number</TooltipTitle>
                          <TooltipSection>
                            Slot #{tx.slot.toLocaleString()}
                          </TooltipSection>
                          <TooltipSection>
                            This shows which "time slot" the transaction was processed in. Remember:
                            <br />
                            • Each slot = ~400 milliseconds
                            <br />
                            • Slots increase sequentially
                            <br />
                            • Used for ordering transactions
                            <br />
                            • Acts as blockchain timestamp
                          </TooltipSection>
                          <TooltipSection title="Relative to Current">
                            {slot ? (
                              <>
                                Current slot: {slot.toLocaleString()}
                                <br />
                                This transaction: {tx.slot.toLocaleString()}
                                <br />
                                Difference: {(slot - tx.slot).toLocaleString()} slots ago
                                <br />
                                Time ago: ~{Math.round((slot - tx.slot) * 0.4)} seconds
                              </>
                            ) : (
                              <>
                                This transaction happened at slot {tx.slot.toLocaleString()}.
                              </>
                            )}
                          </TooltipSection>
                          <TooltipExample>
                            If two transactions happen in the same slot, the blockchain uses additional 
                            ordering rules to determine which one gets processed first.
                          </TooltipExample>
                        </>
                      }
                      position="right"
                    >
                      <span>Slot {tx.slot.toLocaleString()}</span>
                    </Tooltip>
                    <span>•</span>
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Transaction Time</TooltipTitle>
                          <TooltipSection>
                            This shows when the transaction was processed by the network.
                          </TooltipSection>
                          <TooltipSection title="Timing on Solana">
                            From submission to finalization:
                            <br />
                            • Submitted by user: instant
                            <br />
                            • Processed by validator: ~400ms
                            <br />
                            • Confirmed: ~400ms (1 slot)
                            <br />
                            • Finalized: ~13 seconds (31 slots)
                          </TooltipSection>
                          <TooltipSection title="Confirmation Levels">
                            • <strong>Processed:</strong> In a block, but not final
                            <br />
                            • <strong>Confirmed:</strong> Probably won't be reversed
                            <br />
                            • <strong>Finalized:</strong> 100% permanent (31 slots)
                          </TooltipSection>
                          <TooltipExample>
                            Most users consider "confirmed" good enough (~400ms), but exchanges 
                            often wait for "finalized" (~13s) before crediting deposits.
                          </TooltipExample>
                        </>
                      }
                      position="right"
                    >
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </Tooltip>
                  </div>
                </div>

                {/* Amount & Link */}
                <div className="flex items-center gap-3">
                  {tx.amount && tx.amount > 0 && (
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Transaction Amount</TooltipTitle>
                          <TooltipSection>
                            {tx.amount.toFixed(4)} SOL was involved in this transaction.
                          </TooltipSection>
                          <TooltipSection title="What This Represents">
                            Depending on transaction type:
                            <br />
                            • <strong>Transfer:</strong> Amount sent
                            <br />
                            • <strong>Swap:</strong> Input token amount
                            <br />
                            • <strong>Contract:</strong> Value locked or transferred
                          </TooltipSection>
                          <TooltipSection title="Does Size Matter?">
                            Larger transactions can:
                            <br />
                            • Move market prices (especially in small liquidity pools)
                            <br />
                            • Indicate whale activity
                            <br />
                            • Create arbitrage opportunities
                            <br />
                            • Signal important events
                          </TooltipSection>
                          <TooltipExample>
                            If someone swaps 100 SOL for BONK in a small pool, the price impact 
                            could create an arbitrage opportunity on other exchanges!
                          </TooltipExample>
                        </>
                      }
                      position="left"
                    >
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {tx.amount.toFixed(4)} SOL
                        </div>
                      </div>
                    </Tooltip>
                  )}
                  <Tooltip
                    content={
                      <>
                        <TooltipTitle>View on Solscan</TooltipTitle>
                        <TooltipSection>
                          Click to view full transaction details on Solscan block explorer.
                        </TooltipSection>
                        <TooltipSection title="What You'll See">
                          • Complete transaction details
                          <br />
                          • All accounts involved
                          <br />
                          • Exact fees paid
                          <br />
                          • Smart contract logs
                          <br />
                          • Token changes
                          <br />
                          • Program instructions
                        </TooltipSection>
                        <TooltipSection title="Block Explorers">
                          • <strong>Solscan:</strong> Most popular, great UI
                          <br />
                          • <strong>Solana Explorer:</strong> Official explorer
                          <br />
                          • <strong>SolanaFM:</strong> Advanced features
                        </TooltipSection>
                        <TooltipExample>
                          Block explorers are like "viewing the source code" of a transaction - 
                          you can see every detail of what happened!
                        </TooltipExample>
                      </>
                    }
                    position="left"
                  >
                    <ExternalLink
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {!error && transactions.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Showing recent activity from Raydium DEX • Updates every 15s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}