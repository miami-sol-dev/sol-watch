'use client';

import { useGetPriceQuery } from '@/store/api/pricesApi';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

export default function LivePrice() {
  const { data, error, isLoading, refetch } = useGetPriceQuery(SOL_MINT, {
    pollingInterval: 10000, // Refetch every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="border border-gray-700 rounded-lg p-6 bg-zinc-900">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-20 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500 rounded-lg p-6 bg-zinc-900">
        <p className="text-red-500">Error loading price</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 text-sm text-gray-400 hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const solPrice = data?.data[SOL_MINT];

  return (
    <div className="border border-purple-500/20 rounded-lg p-6 bg-zinc-900 hover:border-purple-500/40 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm text-gray-400 font-medium">SOL/USD</h3>
        <span className="text-xs text-green-500">● LIVE</span>
      </div>
      
      <div className="text-4xl font-bold text-white mb-1">
        ${solPrice?.price.toFixed(2)}
      </div>
      
      <p className="text-xs text-gray-500">
        Updates every 10s
      </p>
    </div>
  );
}