"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
  Globe,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Shield,
  Database,
  Cpu,
  Signal,
} from "lucide-react";

const TIMEFRAMES = ["Live Price", "Simulated Price"];

type StockTradingInterfaceProps = {
  gasPrice: string | null;
  blockchainName: string;
  imageSource: string;
};

type Trade = {
  id: string;
  time: string;
  price: number;
  size: number;
  side: "buy" | "sell";
};

// Glass Card Component
const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl ${className}`}>
    {children}
  </div>
);

// Navbar Component
const Navbar = () => (
  <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          BlockchainX
        </div>
        <div className="text-sm text-gray-400">Professional Trading Platform</div>
      </div>
      
    </div>
  </nav>
);

// Chart Component
const GasChartEth = ({ gasPrice }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Generate sample chart data
    const data = Array.from({ length: 50 }, (_, i) => ({
      time: i,
      price: Number(gasPrice || 0) + Math.sin(i * 0.1) * 5 + Math.random() * 3,
      volume: Math.random() * 1000 + 500
    }));
    setChartData(data);
  }, [gasPrice]);

  return (
    <div className="h-80 relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4">
      <div className="absolute inset-0 flex items-end justify-around">
        {chartData.slice(-20).map((point, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-blue-500 to-cyan-400 w-2 rounded-t opacity-60 hover:opacity-100 transition-opacity"
            style={{ height: `${(point.price / Math.max(...chartData.map(d => d.price))) * 100}%` }}
          />
        ))}
      </div>
      <div className="absolute top-4 left-4 text-xs text-gray-400">
        Live Gas Price Chart
      </div>
    </div>
  );
};

const StockTradingInterface: React.FC<StockTradingInterfaceProps> = ({ 
  gasPrice, 
  blockchainName, 
  imageSource 
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState("Live Price");
  const [realTimeData, setRealTimeData] = useState({
    marketCap: 425780000000,
    volume24h: 28540000000,
    circulatingSupply: 120000000,
    totalSupply: 120000000,
    holders: 1250000,
    transactions24h: 1850000,
    blockTime: 12.5,
    networkHashrate: "180.2 TH/s",
    activeValidators: 584923,
  });

  const [stockData] = useState({
    symbol: blockchainName,
    change: 0.000000176,
    changePercent: 1.35,
  });

  const [liveMetrics, setLiveMetrics] = useState({
    price: Number(gasPrice || 0),
    lastUpdate: new Date().toLocaleTimeString(),
    dayHigh: Number(gasPrice || 0) * 1.15,
    dayLow: Number(gasPrice || 0) * 0.85,
    openPrice: Number(gasPrice || 0) * 0.98,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 0.001,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
      
      setRealTimeData(prev => ({
        ...prev,
        volume24h: prev.volume24h + Math.random() * 1000000,
        transactions24h: prev.transactions24h + Math.floor(Math.random() * 100),
        holders: prev.holders + Math.floor(Math.random() * 10),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | string | null | undefined): string => {
    const num = typeof price === "number" ? price : Number(price ?? 0);
    return num.toFixed(9);
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
  };

  const isPositive = stockData.change >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <section className="z-10 pt-10 pb-4">
        <div className="mt-3"></div>
      </section>
      
      <section className="z-10 max-w-7xl mx-auto px-6 mt-8 py-6 relative">
        {/* Top Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Market Cap</div>
            <div className="text-lg font-bold text-green-400">{formatCurrency(realTimeData.marketCap)}</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">24h Volume</div>
            <div className="text-lg font-bold text-blue-400">{formatCurrency(realTimeData.volume24h)}</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Holders</div>
            <div className="text-lg font-bold text-purple-400">{formatNumber(realTimeData.holders)}</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">24h Transactions</div>
            <div className="text-lg font-bold text-cyan-400">{formatNumber(realTimeData.transactions24h)}</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Block Time</div>
            <div className="text-lg font-bold text-yellow-400">{realTimeData.blockTime}s</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Validators</div>
            <div className="text-lg font-bold text-pink-400">{formatNumber(realTimeData.activeValidators)}</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* MAIN CHART SECTION */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <GlassCard className="p-8">
              {/* Header with Token Info */}
              <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="flex items-center space-x-6">
                  <GlassCard className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Database size={16} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">{blockchainName}</h1>
                      <div className="text-xs text-gray-400">Blockchain Network</div>
                    </div>
                  </GlassCard>

                  <div className="flex space-x-4">
                    <GlassCard className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`${isPositive ? "text-green-400" : "text-red-400"}`}>
                          {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">24h Change</div>
                          <div className={`font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                            {isPositive ? "+" : "-"}{formatPrice(stockData.change)} 
                            ({isPositive ? "+" : ""}{stockData.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="text-blue-400" size={18} />
                        <div>
                          <div className="text-sm text-gray-400">Gas Price</div>
                          <div className="text-lg font-bold text-blue-400">
                            {gasPrice}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>

              {/* Price Action Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <GlassCard className="p-4">
                  <div className="text-xs text-gray-400 mb-1">Current Price</div>
                  <div className="text-xl font-bold text-white">{formatPrice(liveMetrics.price)}</div>
                  <div className="text-xs text-gray-500">Last: {liveMetrics.lastUpdate}</div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="text-xs text-gray-400 mb-1">24h High</div>
                  <div className="text-xl font-bold text-green-400">{formatPrice(liveMetrics.dayHigh)}</div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="text-xs text-gray-400 mb-1">24h Low</div>
                  <div className="text-xl font-bold text-red-400">{formatPrice(liveMetrics.dayLow)}</div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="text-xs text-gray-400 mb-1">Open Price</div>
                  <div className="text-xl font-bold text-gray-300">{formatPrice(liveMetrics.openPrice)}</div>
                </GlassCard>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  {TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setActiveTimeframe(tf)}
                      className={`
                        px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border
                        ${activeTimeframe === tf
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg"
                          : "bg-transparent border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/40"
                        }
                      `}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Signal size={16} className="text-green-400" />
                  <span>Live Data</span>
                </div>
              </div>

              {/* Chart */}
              <div className="mt-8">
                <GasChartEth gasPrice={gasPrice} />
              </div>
            </GlassCard>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            {/* Network Stats */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Activity className="text-blue-400" size={20} />
                <span>Network Statistics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Cpu size={16} className="text-purple-400" />
                    <span className="text-sm text-gray-400">Total Supply</span>
                  </div>
                  <span className="font-bold">{formatNumber(realTimeData.totalSupply)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-cyan-400" />
                    <span className="text-sm text-gray-400">Circulating Supply</span>
                  </div>
                  <span className="font-bold">{formatNumber(realTimeData.circulatingSupply)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-green-400" />
                    <span className="text-sm text-gray-400">Network Hashrate</span>
                  </div>
                  <span className="font-bold">{realTimeData.networkHashrate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-sm text-gray-400">Avg Block Time</span>
                  </div>
                  <span className="font-bold">{realTimeData.blockTime}s</span>
                </div>
              </div>
            </GlassCard>

            {/* Market Overview */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <BarChart3 className="text-green-400" size={20} />
                <span>Market Overview</span>
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
                  <div className="text-xs text-gray-400">Market Cap Rank</div>
                  <div className="text-2xl font-bold text-green-400">#2</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
                  <div className="text-xs text-gray-400">Fully Diluted Valuation</div>
                  <div className="text-xl font-bold text-blue-400">{formatCurrency(realTimeData.marketCap * 1.15)}</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
                  <div className="text-xs text-gray-400">Volume/Market Cap</div>
                  <div className="text-xl font-bold text-purple-400">
                    {((realTimeData.volume24h / realTimeData.marketCap) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Live Activity Feed */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Flame className="text-orange-400" size={20} />
                <span>Live Activity</span>
              </h3>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Block #{12345678 + i}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.floor(Math.random() * 60)}s ago
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StockTradingInterface;