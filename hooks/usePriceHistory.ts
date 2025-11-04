import { useEffect, useRef } from 'react';

interface PricePoint {
  timestamp: number;
  price: number;
}

export function usePriceHistory(currentPrice: number | undefined, maxPoints: number = 20) {
  const historyRef = useRef<PricePoint[]>([]);

  useEffect(() => {
    if (currentPrice === undefined) return;

    const now = Date.now();
    const newPoint = { timestamp: now, price: currentPrice };

    // Add new point
    historyRef.current = [...historyRef.current, newPoint];

    // Keep only last N points
    if (historyRef.current.length > maxPoints) {
      historyRef.current = historyRef.current.slice(-maxPoints);
    }
  }, [currentPrice, maxPoints]);

  return historyRef.current;
}