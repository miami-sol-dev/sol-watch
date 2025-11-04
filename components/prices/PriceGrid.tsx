'use client';

import { useState } from 'react';
import { useGetPriceQuery } from '@/store/api/pricesApi';
import { TOKENS } from '@/lib/tokens';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import PriceSparkline from './PriceSparkline';
import Modal from '@/components/ui/Modal';
import DetailedChart from './DetailedChart';

function formatPrice(price: number, symbol: string): string {
  if (symbol === 'USDC') return price.toFixed(4);
  if (price < 0.01) return price.toFixed(8);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

function formatChange(change: number): string {
  return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
}

function TokenCard({ token }: { token: typeof TOKENS[0] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allMints = TOKENS.map(t => t.mint).filter(Boolean).join(',');
  const { data } = useGetPriceQuery(allMints, {
    pollingInterval: 30000,
  });

  const tokenData = token.mint ? data?.data[token.mint] : null;
  const change24h = tokenData?.change24h || 0;
  const isPositive = change24h > 0;

  const priceHistory = usePriceHistory(tokenData?.price);

  return (
    <>
      <div
        className="rounded-xl p-6 border transition-all duration-300 hover:scale-105 cursor-pointer group relative"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 76, 155, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        {/* Expand Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {token.symbol}/USD
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
              {token.name}
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)',
              color: '#FFFFFF'
            }}
          >
            LIVE
          </span>
        </div>

        <div
          className="text-4xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          ${tokenData?.price ? formatPrice(tokenData.price, token.symbol) : '-.--'}
        </div>

        <div className="flex items-center gap-2 mb-3">
          {isPositive ? (
            <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: '#EF4444' }} />
          )}
          <span
            className="text-sm font-semibold"
            style={{ color: isPositive ? '#10B981' : '#EF4444' }}
          >
            {formatChange(change24h)}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            24h
          </span>
        </div>

        <PriceSparkline data={priceHistory} isPositive={isPositive} />

        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
          Click for details
        </p>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {token.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {token.symbol}/USD
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${tokenData?.price ? formatPrice(tokenData.price, token.symbol) : '-.--'}
              </div>
              <div className="flex items-center gap-2 justify-end mt-2">
                {isPositive ? (
                  <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
                ) : (
                  <TrendingDown className="w-5 h-5" style={{ color: '#EF4444' }} />
                )}
                <span
                  className="text-lg font-semibold"
                  style={{ color: isPositive ? '#10B981' : '#EF4444' }}
                >
                  {formatChange(change24h)}
                </span>
              </div>
            </div>
          </div>

          {/* 24h Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Last 24 Hours
            </h3>
            <DetailedChart
              coingeckoId={token.coingeckoId}
              symbol={token.symbol}
              isPositive={isPositive}
              isOpen={isModalOpen}  // ADD THIS LINE
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                Mint Address
              </p>
              <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                {token.mint?.slice(0, 8)}...{token.mint?.slice(-8)}
              </p>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                24h Change
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: isPositive ? '#10B981' : '#EF4444' }}
              >
                {formatChange(change24h)}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function PriceGrid() {
  const allMints = TOKENS.map(t => t.mint).filter(Boolean).join(',');
    const {  error, isLoading } = useGetPriceQuery(allMints, {
    pollingInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOKENS.map((token) => (
          <div
            key={token.symbol}
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)'
            }}
          >
            <div className="animate-pulse">
              <div className="h-4 rounded w-20 mb-4" style={{ backgroundColor: 'var(--border-default)' }}></div>
              <div className="h-8 rounded w-32" style={{ backgroundColor: 'var(--border-default)' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 border border-red-500"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <p className="text-red-500">Error loading prices</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TOKENS.map((token) => (
        <TokenCard key={token.symbol} token={token} />
      ))}
    </div>
  );
}