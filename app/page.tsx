import { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span style={{ color: 'var(--text-primary)' }}>Sol</span>
            <span className="gradient-miami-text">Watch</span>
          </h1>
          <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time Solana Analytics & Arbitrage Scanner
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full gradient-miami text-white font-medium">
              ⚡ HELIUS PRO
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Direct On-Chain Data
            </span>
          </div>
        </div>

        {/* Dashboard */}
        <ErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        </ErrorBoundary>

        {/* Footer */}
        <div className="text-center text-sm pb-8" style={{ color: 'var(--text-secondary)' }}>
          <p>🌴 Powered by Helius RPC • Built with Next.js & Solana Web3.js</p>
        </div>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-6 border animate-pulse"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="h-4 rounded w-24 mb-4" style={{ backgroundColor: 'var(--border-default)' }}></div>
            <div className="h-8 rounded w-32 mb-2" style={{ backgroundColor: 'var(--border-default)' }}></div>
            <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--border-default)' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}