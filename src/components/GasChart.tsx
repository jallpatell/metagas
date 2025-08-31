'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ISeriesApi, AreaSeries, Time } from 'lightweight-charts';

type GasChartProps = {
  gasPrice: string | null;
  blockchainName?: string;
};

type ChartDataPoint = {
  time: number;
  value: number;
};

export default function LivePriceChart({ gasPrice, blockchainName = 'default' }: GasChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const gasPriceRef = useRef<string | null>(null);
  const chartRef = useRef<any>(null);
  const blockchainNameRef = useRef<string>(blockchainName);

  // Update blockchain name ref when it changes
  useEffect(() => {
    blockchainNameRef.current = blockchainName;
  }, [blockchainName]);

  // Load data from localStorage with blockchain-specific key
  const loadChartData = (): ChartDataPoint[] => {
    try {
      const storageKey = `gas_chart_data_${blockchainNameRef.current}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Only keep data from the last 24 hours
        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
        return data.filter((point: ChartDataPoint) => point.time > oneDayAgo);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
    return [];
  };

  // Save data to localStorage with blockchain-specific key
  const saveChartData = (data: ChartDataPoint[]) => {
    try {
      const storageKey = `gas_chart_data_${blockchainNameRef.current}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving chart data:', error);
    }
  };

  // Add new data point and save to localStorage
  const addDataPoint = (time: number, value: number) => {
    const newPoint = { time, value };
    const currentData = loadChartData();
    
    // Check if we already have data for this timestamp
    const existingIndex = currentData.findIndex(point => point.time === time);
    let updatedData;
    
    if (existingIndex >= 0) {
      // Update existing point instead of adding duplicate
      updatedData = [...currentData];
      updatedData[existingIndex] = newPoint;
    } else {
      // Add new point
      updatedData = [...currentData, newPoint];
    }
    
    // Sort by time and keep only last 24 hours of data (86400 seconds)
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const filteredData = updatedData
      .filter(point => point.time > oneDayAgo)
      .sort((a, b) => a.time - b.time);
    
    saveChartData(filteredData);
    return filteredData;
  };

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
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
    chartRef.current = chart;

    // Load existing data or create initial data
    let chartData = loadChartData();
    
    if (chartData.length === 0) {
      // Create initial data if no stored data exists
      const now = Math.floor(Date.now() / 1000);
      chartData = Array.from({ length: 900 }, (_, i) => {
        const t = now - (900 - i);
        const v = Math.random() * (0.8 - 0.6) + 0.6;
        return { time: t, value: parseFloat(v.toFixed(9)) };
      });
      saveChartData(chartData);
    }

    // Sort and deduplicate data to ensure ascending order by time
    const sortedData = chartData
      .sort((a, b) => a.time - b.time)
      .filter((point, index, array) => {
        // Remove duplicates by keeping only the first occurrence of each timestamp
        return index === 0 || point.time !== array[index - 1].time;
      });

    // Set the data on the chart
    areaSeries.setData(sortedData.map(point => ({
      time: point.time as Time,
      value: point.value
    })));

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current?.clientWidth || 0 });
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update gas price ref
  useEffect(() => {
    gasPriceRef.current = gasPrice;
  }, [gasPrice]);

  // Update chart with new data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gasPriceRef.current || !seriesRef.current) return;
      const price = parseFloat(gasPriceRef.current);
      if (isNaN(price)) return;
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Add new data point to localStorage
      addDataPoint(currentTime, price);
      
      // Update the chart
      seriesRef.current.update({
        time: currentTime as Time,
        value: price,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once

  return (
    <div className="p-4 w-full rounded-4xl h-[220px] scale-100 h-40 sm:h-[400px] lg:h-[500px]">
      <div ref={containerRef} className="w-full h-100 rounded-xl" />
    </div>
  );
}
