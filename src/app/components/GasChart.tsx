'use client';

import { useEffect, useState, useRef } from 'react';
import {
  LineChart,
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

export default function LivePriceChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const MAX_POINTS = 15 * 60; // 900 points = 15 minutes
  const requestRef = useRef<number>();
  const lastTickRef = useRef<number>(Date.now());

  // Format current time as HH:mm:ss
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const updateChart = () => {
    const now = Date.now();
    if (now - lastTickRef.current >= 1000) {w
      const newPoint: DataPoint = {
        time: formatTime(new Date()),
        price: +(Math.random() * 1000).toFixed(2), // Replace with actual price
      };

      setData((prev) => {
        const updated = [...prev, newPoint];
        if (updated.length > MAX_POINTS) {
          updated.shift(); // Remove the oldest point
        }
        return updated;
      });

      lastTickRef.current = now;
    }

    requestRef.current = requestAnimationFrame(updateChart);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateChart);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="w-full h-64 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            minTickGap={20}
            interval="preserveStartEnd"
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip isAnimationActive={false} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
