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

type BackendHistoryPoint = {
  time: number; // seconds
  arbitrum: number;
  ethereum: number;
  polygon: number;
};

type BackendHistoryResponse = {
  history: BackendHistoryPoint[];
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

  // Load history from backend
  const loadHistoryFromBackend = async (): Promise<ChartDataPoint[]> => {
    const ENV_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://metagas.onrender.com';
    const LOCAL_BASE = 'http://localhost:4000';
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.'));

    const urls = isLocal
      ? [
          `${LOCAL_BASE}/gas/history?minutes=12`,
          `${ENV_BASE}/gas/history?minutes=12`
        ]
      : [
          `${ENV_BASE}/gas/history?minutes=12`
        ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        
        const data: BackendHistoryResponse = await response.json();
        
        // Map blockchain name to backend field
        let blockchainField: keyof BackendHistoryPoint;
        switch (blockchainNameRef.current.toLowerCase()) {
          case 'ethereum':
            blockchainField = 'ethereum';
            break;
          case 'polygon':
            blockchainField = 'polygon';
            break;
          case 'arbitrum':
            blockchainField = 'arbitrum';
            break;
          default:
            blockchainField = 'ethereum';
        }
        
        const chartData: ChartDataPoint[] = data.history.map(point => ({
          time: point.time,
          value: point[blockchainField] || 0
        }));
        
        console.log(`Loaded ${chartData.length} history points from backend for ${blockchainNameRef.current}`);
        return chartData;
      } catch (error) {
        console.error(`Failed to load from ${url}:`, error);
      }
    }
    
    console.warn('Could not load history from any backend, using localStorage fallback');
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

    // Load existing data (try backend first, then localStorage)
    let chartData: ChartDataPoint[] = [];
    
    const initializeChart = async () => {
      // Try to load from backend first
      chartData = await loadHistoryFromBackend();
      
      // If backend fails, try localStorage
      if (chartData.length === 0) {
        chartData = loadChartData();
      }
      
      // Only create fake data if both backend and localStorage are empty (shouldn't happen in production)
      if (chartData.length === 0) {
        console.warn('No data available from backend or cache, showing empty chart until real data arrives');
        chartData = [];
      }
      
      // Sort and deduplicate data to ensure ascending order by time
      const sortedData = chartData
        .sort((a, b) => a.time - b.time)
        .filter((point, index, array) => {
          // Remove duplicates by keeping only the first occurrence of each timestamp
          return index === 0 || point.time !== array[index - 1].time;
        });
      
      // Set the data on the chart
      if (sortedData.length > 0) {
        areaSeries.setData(sortedData.map(point => ({
          time: point.time as Time,
          value: point.value
        })));
      }
    };
    
    initializeChart();


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
