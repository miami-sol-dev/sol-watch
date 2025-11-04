import PriceGrid from '@/components/prices/PriceGrid';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const Home = () => {
  return (
    <main className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header with Miami Vice gradient */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-7xl font-bold">
            <span style={{ color: 'var(--text-primary)' }}>Sol</span>
            <span className="gradient-miami-text">Watch</span>
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time Solana arbitrage scanner
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full gradient-miami text-white font-medium">
              LIVE
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Miami • {new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })}
            </span>
          </div>
        </div>

        {/* Price Grid with Error Boundary */}
        <ErrorBoundary>
          <PriceGrid />
        </ErrorBoundary>

        {/* Footer */}
        <div className="text-center text-sm pb-8" style={{ color: 'var(--text-secondary)' }}>
          <p>Week 1: Miami Vice Edition 🌴</p>
        </div>
      </div>
    </main>
  );
};

export default Home;