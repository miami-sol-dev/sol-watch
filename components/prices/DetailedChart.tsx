'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface DetailedChartProps {
  coingeckoId: string;
  symbol: string;
  isPositive: boolean;
  isOpen: boolean;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

interface CachedData {
  data: PricePoint[];
  timestamp: number;
}

const chartCache = new Map<string, CachedData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function DetailedChart({ coingeckoId, symbol, isPositive, isOpen }: DetailedChartProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);

        const cached = chartCache.get(coingeckoId);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          console.log('Using cached data for', coingeckoId);
          setData(cached.data);
          setLoading(false);
          return;
        }

        console.log('Fetching fresh data for', coingeckoId);
        const response = await fetch(`/api/prices/history?id=${coingeckoId}&days=1`);
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit - try again in a moment');
          }
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        const prices = result.prices || [];
        
        chartCache.set(coingeckoId, {
          data: prices,
          timestamp: now,
        });
        
        setData(prices);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [coingeckoId, isOpen]);

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-3 py-1 rounded"
          style={{ 
            background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)',
            color: 'white'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(timestamp: number) => {
              const date = new Date(timestamp);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => `$${value.toFixed(2)}`}
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelFormatter={(timestamp: number) => {
              const date = new Date(timestamp);
              return date.toLocaleString();
            }}
            formatter={(value: number) => [`$${value.toFixed(4)}`, symbol]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={3}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}