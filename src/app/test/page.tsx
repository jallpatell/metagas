"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GasChartEth from "@/app/gasChartEth/page";

// Glassmorphic Card component (as in landing page)
const GlassCard = ({ children, className = "", hover = true }) => (
  <div
    className={`
      bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-md
      ${hover ? "    hover:border-white/20" : ""}
      transition-all duration-500 ease-out
      ${className}
    `}
  >
    {children}
  </div>
);

// Grid and radial gradient background (non-interactive version)
const GridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0 L0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="smallGrid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M80 0 L0 0 0 80"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="mouseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.14)" />
          <stop offset="80%" stopColor="rgba(59,130,246,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
      <circle
        cx="58%"
        cy="45%"
        r="520"
        fill="url(#mouseGlow)"
        className="transition-all duration-500"
      />
    </svg>
  </div>
);

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y"];

const StockTradingInterface = ({ gasPrice }) => {
  const [activeTimeframe, setActiveTimeframe] = useState("1D");
  const [stockData] = useState({
    symbol: "Ethereum Mainnet",
    change: 2.34,
    changePercent: 1.35,
    volume: "1.2M",
    high: gasPrice + 10,
    low: gasPrice - 10,
    open: gasPrice,
  });
  const [orderBook] = useState({
    bids: [
      { price: 175.4, size: 150, total: 150 },
      { price: 175.39, size: 200, total: 350 },
      { price: 175.38, size: 100, total: 450 },
      { price: 175.37, size: 300, total: 750 },
      { price: 175.36, size: 250, total: 1000 },
    ],
    asks: [
      { price: 175.43, size: 120, total: 120 },
      { price: 175.44, size: 180, total: 300 },
      { price: 175.45, size: 220, total: 520 },
      { price: 175.46, size: 160, total: 680 },
      { price: 175.47, size: 140, total: 820 },
    ],
  });
  const [recentTrades] = useState([
    // Example trades; use actual data in production
  ]);

  const formatPrice = (price) => `$${(price ?? 0).toFixed(9)}`;
  const isPositive = stockData.change >= 0;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GridBackground />
      <Navbar />
      <section className="z-10 pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-6 mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between space-y-2 sm:space-y-0">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-white drop-shadow-lg">
              Ethereum Mainnet Trading Dashboard
            </h1>
            
          </div>
          <p className="text-md md:text-lg text-white-00 max-w-2xl mt-4">
            Track live Ethereum gas prices, explore recent trades, and view market depth in a real-time, glassy Web3 interface.
          </p>
        </div>
      </section>
      <section className="z-10 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main Chart and Stock Info */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <GlassCard className="p-8 w-full">
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center mb-8">
                {/* Ticker Info */}
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-bold text-2xl">{stockData.symbol}</h2>
                  </div>
                  <div className="mt-2 font-mono text-lg flex items-baseline gap-4">
                    <span className="text-white text-2xl font-extrabold">{gasPrice}</span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      {isPositive ? "+" : ""}
                      {formatPrice(stockData.change)} ({isPositive ? "+" : ""}
                      {stockData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {/* OHLC and Volume */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 md:mt-0">
                  <div>
                    <div className="text-gray-400">Open</div>
                    <div className="font-bold">{formatPrice(stockData.open)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">High</div>
                    <div className="font-bold text-green-400">{formatPrice(stockData.high)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Low</div>
                    <div className="font-bold text-red-400">{formatPrice(stockData.low)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Volume</div>
                    <div className="font-bold">{stockData.volume}</div>
                  </div>
                </div>
              </div>
              {/* Chart with Timeframes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-300" /> Price Chart
                  </h3>
                  <div className="flex space-x-2">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`
                          px-3 py-1 rounded-4xl font-semibold text-sm
                          transition-colors border
                          ${activeTimeframe === tf
                            ? "bg-blue-500 text-white border-transparent"
                            : "bg-transparent border-white/10 text-gray-300 hover:bg-white/10"
                          }
                        `}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <GasChartEth />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Order Book & Recent Trades */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-8">
            {/* Order Book */}
            <GlassCard className="p-6 w-full">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="text-blue-400" size={20} />
                <h3 className="text-lg font-semibold">Order Book</h3>
                <Zap className="w-5 h-5 ml-1 text-green-200 animate-pulse" />
              </div>
              <div className="space-y-2">
                {/* Asks */}
                <div>
                  <div className="text-xs text-red-400 font-bold mb-1">
                    ASKS
                  </div>
                  <div className="space-y-1">
                    {[...orderBook.asks]
                      .reverse()
                      .map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 text-xs">
                          <span className="text-red-400 font-medium">
                            {formatPrice(ask.price)}
                          </span>
                          <span className="text-right text-gray-300">
                            {ask.size}
                          </span>
                          <span className="text-right text-gray-500">
                            {ask.total}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                {/* Spread */}
                <div className="py-2 border-t border-b border-white/10">
                  <div className="text-center text-xs">
                    <span className="text-gray-400">Spread:</span>
                    <span className="font-semibold text-yellow-400 ml-2">
                      {formatPrice(
                        Math.abs(
                          orderBook.asks[0]?.price - orderBook.bids[0]?.price
                        ) || 0
                      )}
                    </span>
                  </div>
                </div>
                {/* Bids */}
                <div>
                  <div className="text-xs text-green-400 font-bold mb-1">
                    BIDS
                  </div>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid, i) => (
                      <div key={i} className="grid grid-cols-3 text-xs">
                        <span className="text-green-400 font-medium">
                          {formatPrice(bid.price)}
                        </span>
                        <span className="text-right text-gray-300">
                          {bid.size}
                        </span>
                        <span className="text-right text-gray-500">
                          {bid.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
            {/* Recent Trades */}
            <GlassCard className="p-6 w-full">
              <div className="flex items-center mb-3 gap-2">
                <BarChart3 className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold">Recent Trades</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-2 font-semibold">
                <span>Time</span>
                <span>Price</span>
                <span>Size</span>
                <span>Side</span>
              </div>
              <div className="divide-y divide-white/10 max-h-52 overflow-y-auto">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="grid grid-cols-4 gap-2 text-xs py-1 group hover:bg-white/10 rounded-lg px-1 transition-all"
                  >
                    <span className="text-gray-400">{trade.time}</span>
                    <span
                      className={
                        trade.side === "buy"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {formatPrice(trade.price)}
                    </span>
                    <span className="text-gray-300">{trade.size}</span>
                    <span
                      className={`capitalize font-semibold ${
                        trade.side === "buy" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
      <section className="z-10 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <GlassCard className="p-10">
            <h2 className="">

            </h2>
            <p className="">

            </p>
            <button className="">
              <span></span>
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </GlassCard>
        </div>
      </section>
      <footer className="relative z-10 border-t border-white/5 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">GasTracker Pro</span>
          </div>
          <p className="text-gray-500 mb-6">
            The most advanced Ethereum gas trading interface.
          </p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StockTradingInterface;
