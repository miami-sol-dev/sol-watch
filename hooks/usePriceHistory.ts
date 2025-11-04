import { useState, useEffect } from 'react';

interface PricePoint {
  timestamp: number;
  price: number;
}

export function usePriceHistory(currentPrice: number | undefined, maxPoints: number = 20) {
  const [history, setHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    if (currentPrice === undefined) return;

    const newPoint = { timestamp: Date.now(), price: currentPrice };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    // Valid use case: We're intentionally tracking price changes over time
    // This is external data synchronization, not cascading renders
    setHistory((prev) => {
      const updated = [...prev, newPoint];
      // Keep only last N points
      return updated.length > maxPoints ? updated.slice(-maxPoints) : updated;
    });
  }, [currentPrice, maxPoints]);

  return history;
}