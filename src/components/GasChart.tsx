'use client';

import { useEffect, useState, useRef } from 'react';
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
    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour12: false });
    const initial: DataPoint[] = [];

    for (let i = 899; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      const price = Math.random() * (0.8 - 0.6) + 0.6;
      initial.push({ time: formatTime(time), price: parseFloat(price.toFixed(9)) });
    }

    return initial;
  });

  const gasPriceRef = useRef<string | null>(null);
  const MAX_POINTS = 15 * 60;

  useEffect(() => {
    gasPriceRef.current = gasPrice;
  }, [gasPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentGas = gasPriceRef.current;
      if (!currentGas) return;

      const numericPrice = parseFloat(currentGas);
      if (isNaN(numericPrice)) return;

      const newPoint: DataPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        price: numericPrice,
      };

      setData((prev) => {
        const updated = [...prev, newPoint];
        if (updated.length > MAX_POINTS) updated.shift();
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Only run once on mount

  return (
    <div className="w-310 h-75 p-4">
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="1 1" strokeOpacity={.1} />
    <XAxis
      dataKey="time"
      tick={{ fontSize: 13,fontFamily: 'Arial', fill: '#ffffff' }}
    />
    <YAxis
      domain={['auto', 'auto']}
      tick={{ fontSize: 13, fontFamily: 'Arial', fill: '#ffffff' }}
    />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="price"
      stroke="#165394"
      strokeWidth={2.0}
      fill="url([#165394])" // gradient fill
      fillOpacity={3}
      dot={false}
      isAnimationActive={false}
    />
  </AreaChart>
</ResponsiveContainer>

    </div>
  );
}
