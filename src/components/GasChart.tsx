'use client';

import { useEffect, useRef } from 'react';
import { createChart, ISeriesApi, AreaSeries, Time } from 'lightweight-charts';

type GasChartProps = {
  gasPrice: string | null;
};

export default function LivePriceChart({ gasPrice }: GasChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const gasPriceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#fff',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: true },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: 'rgba(22, 83, 148, 0.4)',
      bottomColor: 'rgba(22, 83, 148, 0)',
      lineColor: '#165394',
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    const now = Math.floor(Date.now() / 1000);
    const initData = Array.from({ length: 900 }, (_, i) => {
      const t = now - (900 - i);
      const v = Math.random() * (0.8 - 0.6) + 0.6;
      return { time: t as Time, value: parseFloat(v.toFixed(9)) };
    });

    areaSeries.setData(initData);

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current?.clientWidth || 0 });
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    gasPriceRef.current = gasPrice;
  }, [gasPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gasPriceRef.current || !seriesRef.current) return;
      const price = parseFloat(gasPriceRef.current);
      if (isNaN(price)) return;
      seriesRef.current.update({
        time: Math.floor(Date.now() / 1000) as Time,
        value: price,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 w-full rounded-4xl h-[220px] scale-100 h-40 sm:h-[400px] lg:h-[500px]">
      <div ref={containerRef} className="w-full h-100 rounded-xl" />
    </div>
  );
}
