'use client';

import { useState, useEffect } from 'react';
import NetworkStatsCard from './NetworkStatsCard';
import TokenListCard from './TokenListCard';
import RecentActivityCard from './RecentActivityCard';
import PerformanceCard from './PerformanceCard';

export interface DashboardData {
  blockHeight: number;
  slot: number;
  timestamp: number;
  tps?: number;
  performance?: {
    numTransactions: number;
    numSlots: number;
    samplePeriodSecs: number;
    tps: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(false); // Don't show loading after initial load
      setError(null);

      const response = await fetch('/api/helius/data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  }

  if (loading && !data) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full gradient-miami mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div
        className="rounded-xl p-6 border border-red-500"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <h3 className="text-red-500 font-bold mb-2">Connection Error</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 rounded-lg gradient-miami text-white"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Network Stats */}
      <NetworkStatsCard data={data} error={error} onRetry={fetchDashboardData} />

      {/* Middle Row - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenListCard />
        <PerformanceCard performance={data?.performance} />
      </div>

      {/* Bottom Row - Recent Activity */}
      <RecentActivityCard slot={data?.slot} />
    </div>
  );
}