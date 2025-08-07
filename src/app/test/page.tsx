"use client";
import React from "react";

// Minimal Navbar
function Navbar() {
  return (
    <nav className="p-4 border-b border-gray-700 bg-black flex items-center justify-between text-white">
      <span className="text-lg font-bold">GasTracker Pro</span>
      <span className="text-sm text-gray-400">Real-Time Layer1 & Layer2 Analytics</span>
    </nav>
  );
}

// LiveDataCard dynamically receives props (to be fetched via hooks on integration)
function LiveDataCard({ chain, price, volume }) {
  // price: current gas price, volume: 24h on-chain volume
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center space-y-2 shadow hover:bg-white/10 transition-all duration-300">
      <div className="text-xl font-semibold">{chain}</div>
      <div className="text-3xl font-mono text-blue-400">{price ?? "..."}</div>
      <div className="text-sm text-gray-300">Live Gas Price</div>
      <div className="mt-2 text-lg text-purple-400">{volume ?? "..."}</div>
      <div className="text-xs text-gray-400">24h Market Volume</div>
    </div>
  );
}

export default function DocsLanding() {
  // Values are placeholders; replace with live data from your backend as needed
  const gasData = [
    { chain: "Ethereum Mainnet (Layer 1)", price: "28 Gwei", volume: "$14.7B" },
    { chain: "Arbitrum (Layer 2)", price: "0.82 Gwei", volume: "$870M" },
    { chain: "Polygon (Layer 2)", price: "1.7 Gwei", volume: "$290M" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto pt-14 px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">What is GasTracker Pro?</h1>
        <p className="text-lg text-gray-300 mb-8">
          GasTracker Pro empowers you with live, direct blockchain data for Ethereum Mainnet, Arbitrum, and Polygon.
          Track current gas prices and network activity with precision—no third-party APIs, no guesswork.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {gasData.map((d, i) => (
            <LiveDataCard key={i} {...d} />
          ))}
        </div>
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Why does tracking 15-minute gas data matter?</h2>
          <p className="text-gray-300">
            Network congestion can change rapidly throughout the day. By analyzing gas price volatility in rolling 15-minute intervals, you get actionable insights into periods of high and low on-chain activity. This helps you:
          </p>
          <ul className="list-disc text-left my-3 pl-6 text-gray-200 space-y-1">
            <li>Spot patterns in gas surges during popular NFT mints, DeFi launches, or market volatility.</li>
            <li>Schedule your transactions when on-chain fees are predictably lower.</li>
            <li>Save money by avoiding network rush hours—up-to-date every 15 minutes.</li>
          </ul>
          <p className="text-gray-400 mt-2">
            With candlestick charting, you see not only averages, but real extremes (highs/lows) within each 15-minute window, giving you deeper control over your transaction timing.
          </p>
        </section>
        <div className="text-center text-base text-gray-400 pt-2">
          Ready for smarter, cheaper Web3 transactions? Explore live analytics and simulation tools from the menu above.
        </div>
      </main>
    </div>
  );
}
