'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = {
  time: string; // HH:mm:ss
  price: number;
};

type GasChartProps = {
  gasPrice: string | null;
};


export default function LivePriceChart({ gasPrice }: GasChartProps) {
  const [data, setData] = useState<DataPoint[]>(() => {
  const now = new Date();
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };
  const initial: DataPoint[] = [];

  for (let i = 14; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000); // 1 second apart
    const price =
      Math.random() * (0.5 - 0.2) + 0.2; // Random between 0.3 and 0.5
      initial.push({
      time: formatTime(time),
      price: parseFloat(price.toFixed(9)),
    });
  }

  return initial;
});


  const MAX_POINTS = 15 * 60; // 900 points = 15 minutes

  // Format current time as HH:mm:ss
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  // Push new point to the chart whenever gasPrice updates
  useEffect(() => {
    if (!gasPrice) return;

    const numericPrice = parseFloat(gasPrice);
    if (isNaN(numericPrice)) return;

    const newPoint: DataPoint = {
      time: formatTime(new Date()),
      price: numericPrice,
    };

    setData((prev) => {
      const updated = [...prev, newPoint];
      if (updated.length > MAX_POINTS) {
        updated.shift(); // Keep only the latest MAX_POINTS
      }
      return updated;
    });
  }, [gasPrice]); // 🔁 runs every time gasPrice changes

  return (
    <div className="w-full h-64 p-4">
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
    <XAxis
      dataKey="time"
      tick={{ fontSize: 10, fill: '#ffffff' }}
    />
    <YAxis
      domain={['auto', 'auto']}
      tick={{ fontSize: 10, fontFamily: 'Arial', fill: '#ffffff' }}
    />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="price"
      stroke="#8884d8"
      strokeWidth={2.7}
      fill="url(#colorPrice)" // gradient fill
      fillOpacity={1}
      dot={false}
      isAnimationActive={false}
    />
  </AreaChart>
</ResponsiveContainer>

    </div>
  );
}
