'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap, Database } from 'lucide-react';

interface HeliusData {
  blockHeight: number;
  slot: number;
  timestamp: number;
  solBalance?: number;
}

export default function HeliusTokenData() {
  const [data, setData] = useState<HeliusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHeliusData();
    const interval = setInterval(fetchHeliusData, 10000); // Update every 10s with paid Helius
    return () => clearInterval(interval);
  }, []);

  async function fetchHeliusData() {
    try {
      setLoading(true);
      setError(null);

      // Call our Helius API route
      const response = await fetch('/api/helius/data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Helius fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: '#F94C9B' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Connecting to Helius...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 border border-red-500"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <h3 className="text-red-500 font-bold mb-2">Helius Error</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button
          onClick={() => fetchHeliusData()}
          className="mt-4 px-4 py-2 rounded-lg gradient-miami text-white"
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
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Block Height */}
        <div
          className="rounded-xl p-6 border hover:scale-105 transition-all"
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
          </div>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {data.blockHeight.toLocaleString()}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Slot: {data.slot.toLocaleString()}
          </p>
        </div>

        {/* Network Status */}
        <div
          className="rounded-xl p-6 border hover:scale-105 transition-all"
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
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#10B981' }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: '#10B981' }}></span>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#10B981' }}>ONLINE</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Direct Helius RPC
          </p>
        </div>

        {/* Update Rate */}
        <div
          className="rounded-xl p-6 border hover:scale-105 transition-all"
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
          </div>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            10s
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Auto-refresh enabled
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div
        className="rounded-xl p-8 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          ✅ Helius Integration Active
        </h2>
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>• Connected to Helius Pro RPC endpoint</p>
          <p>• Fetching real-time Solana blockchain data</p>
          <p>• Updates every 10 seconds (no rate limits!)</p>
          <p>• Ready to build advanced features on top</p>
        </div>
        
        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong>Last Updated:</strong> {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}