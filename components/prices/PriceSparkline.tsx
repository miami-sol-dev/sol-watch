'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PriceSparklineProps {
  data: Array<{ timestamp: number; price: number }>;
  isPositive: boolean;
}

export default function PriceSparkline({ data, isPositive }: PriceSparklineProps) {
  if (data.length < 2) {
    return (
      <div className="h-12 w-full flex items-center justify-center">
        <span className="text-xs opacity-40">Gathering data...</span>
      </div>
    );
  }

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}