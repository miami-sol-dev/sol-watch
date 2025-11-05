'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ArrowRight, Clock, Activity, AlertCircle } from 'lucide-react';
import { ArbitrageOpportunity } from '@/types/dex';

interface ScanResult {
  opportunities: ArbitrageOpportunity[];
  totalScanned: number;
  successfulScans: number;
  failedScans: number;
  scanDuration: number;
  timestamp: number;
}

export default function OpportunityList() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  async function fetchOpportunities() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/opportunities');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setScanResult(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchOpportunities();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchOpportunities, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !scanResult) {
    return (
      <div 
        className="rounded-xl p-8 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent"
               style={{ borderColor: 'var(--accent-pink)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            Scanning DEXs for arbitrage opportunities...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="rounded-xl p-8 border border-red-500"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-red-500">Scan Error</h3>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {error}
        </p>
        <button
          onClick={fetchOpportunities}
          className="px-4 py-2 rounded-lg text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)' }}
        >
          Retry Scan
        </button>
      </div>
    );
  }

  const opportunities = scanResult?.opportunities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Arbitrage Opportunities 🎯
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Real-time cross-DEX price differences on Solana
          </p>
        </div>
        
        {/* Stats */}
        {scanResult && (
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: 'var(--accent-pink)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {scanResult.successfulScans}/{scanResult.totalScanned} scanned
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {scanResult.scanDuration}ms
                </span>
              </div>
            </div>
            {lastUpdate && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Opportunities Grid */}
      {opportunities.length === 0 ? (
        <div 
          className="rounded-xl p-12 border text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Opportunities Found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Currently scanning {scanResult?.totalScanned || 0} tokens across Raydium and Orca.
            <br />
            Opportunities appear when price differences exceed 0.1% after fees.
          </p>
          <button
            onClick={fetchOpportunities}
            className="px-4 py-2 rounded-lg text-white font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)' }}
          >
            Refresh Scan
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {opportunities.map((opp, idx) => (
            <OpportunityCard key={`${opp.tokenMint}-${idx}`} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: ArbitrageOpportunity }) {
  const confidenceColors = {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#6B7280',
  };

  const confidenceColor = confidenceColors[opportunity.confidence];

  return (
    <div
      className="rounded-xl p-6 border transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-pink)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 76, 155, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Token Info */}
        <div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {opportunity.tokenSymbol}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {opportunity.tokenName}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {opportunity.buyDex}
            </span>
            <ArrowRight className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {opportunity.sellDex}
            </span>
          </div>
        </div>

        {/* Profit Info */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <TrendingUp className="w-6 h-6" style={{ color: '#10B981' }} />
            <span className="text-3xl font-bold" style={{ color: '#10B981' }}>
              +{opportunity.estimatedProfitPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            ~${opportunity.estimatedProfit.toFixed(2)} profit
          </p>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ 
              backgroundColor: `${confidenceColor}20`,
              color: confidenceColor,
            }}
          >
            {opportunity.confidence.toUpperCase()} CONFIDENCE
          </span>
        </div>
      </div>

      {/* Price Details */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            Buy Price
          </p>
          <p className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            ${opportunity.buyPrice.toFixed(4)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            on {opportunity.buyDex}
          </p>
        </div>

        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            Sell Price
          </p>
          <p className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            ${opportunity.sellPrice.toFixed(4)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            on {opportunity.sellDex}
          </p>
        </div>

        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            Spread
          </p>
          <p className="text-sm font-mono font-semibold" style={{ color: '#10B981' }}>
            ${opportunity.spread.toFixed(4)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            {opportunity.spreadPercent.toFixed(3)}% difference
          </p>
        </div>
      </div>

      {/* Liquidity Info */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs" 
           style={{ borderColor: 'var(--border-default)' }}>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Min Liquidity: </span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            ${(opportunity.minLiquidity / 1000).toFixed(1)}K
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Updated: </span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {new Date(opportunity.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}