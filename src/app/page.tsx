"use client"
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Wallet, Shield, Clock, BarChart3, ArrowRight, Star, Users, DollarSign, Activity, Grid } from 'lucide-react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { StringifyOptions } from 'querystring';

interface LiveDataCardProps {
  chain: string;
  price: string;
  volume: string
}

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 128, y: 300 });
  const [currentStat, setCurrentStat] = useState(0);

  function LiveDataCard({ chain, price, volume, className = "" }: React.FC<LiveDataCardProps>) {
  // price: current gas price, volume: 24h on-chain volume
  return (
    <div className="rounded-2xl ml-5 w-70 bg-white/5 border border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-105 transition-all duration-300">
      <div className="text-2xl font-bold font-mono ">{chain}</div>

      <div className="text-shadow-md mt-3 text-gray-300">Live Gas Price</div>
      <div className="text-3xl mb-5 font-mono text-blue-400">{price ?? "..."}</div>
      
      <div className="text-lg mt-5 -mb-1 text-purple-400">{volume ?? "..."}</div>
      <div className="text-sm text-gray-400">Market Volume</div>

      
    </div>
  );
}




  const GlassCard = ({ children, className = "", hover = true }) => (
    <div className={`
      bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl
      ${hover ? 'hover:bg-white/7 hover:border-white/20 ' : ''}
      transition-all duration-500 ease-out
      ${className}
    `}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white  relative overflow-hidden">

      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <section className="relative mt-15  z-10 pt-20 ">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className=' flex'>
            <Image src="/assets/bg_webpage.png" height={450} width={650} alt='bg' className='mr-7 -ml-40 -mt-30 ' />
            <div  className='ml-28 mt-1'>
              <h1 className="text-5xl md:text-7xl  lg:text-6xl  font-sans -mt-10 mb-10 leading-tight">
                <span className="bg-white font-sans bg-clip-text  text-transparent ">
                  Stop Overpaying
                </span>
                <br />
                <span className="bg-white font-sans-extrabold text-7xl font-stretch-ultra-condensed bg-clip-text text-transparent">
                  Gas Fees
                </span>
              </h1>
              <p className="text-2xl md:text-sxl  text-blue-300 font-sans font-medium -mt-6 mb-16 ">
                The most advanced real-time cross-chain gas tracker for Web3. <br />
                Monitor Ethereum, Polygon, and Arbitrum <br /> with precision timing and smart wallet simulation.
              </p>
              <div>
                <div className='flex gap-4  -mt-6 -ml-27'>
                  <LiveDataCard chain="Ethereum [L1]" price="12" volume="12.23B">
                  </LiveDataCard>
                  <LiveDataCard chain="Polygon [L2]" price="1123" volume="12.23B">
                  </LiveDataCard>
                  <LiveDataCard chain="Arbitrum [L3]" price="1232" volume="12.23B">
                  </LiveDataCard>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}

        </div>
      </section>

      {/* Features Section */}
      <GlassCard className='p-10 w-200 bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_1px)] [background-size:16px_16px] h-180 ml-15'>
        <h2 className="text-4xl text-[#d45f63] font-bold font-mono mb-2">Why does tracking 15-minute gas data matter?</h2>
        <p className="text-gray-300 font-mono font-extrabold text-2xl ">
            Network congestion can change rapidly throughout the day. By analyzing gas price volatility in rolling 15-minute intervals, you get actionable insights into periods of high and low on-chain activity. <br></br>This helps you:
          </p>
          <ul className="list-disc font-extrabold text-left my-3 font-mono text-xl  pl-6 text-gray-200 space-y-1">
            <li>Spot patterns in gas surges during popular NFT mints, DeFi launches, or market volatility.</li>
            <li>Schedule your transactions when on-chain fees are predictably lower.</li>
            <li>Save money by avoiding network rush hours—up-to-date every 15 minutes.</li>
          </ul>
          <p className="text-gray-400 text-2xl font-bold font-mono mt-2">
            With candlestick charting, you see not only averages, but real extremes (highs/lows) within each 15-minute window, giving you deeper control over your transaction timing.
          </p>
      </GlassCard>
      
      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400">Simple, powerful, and completely transparent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Connect Directly</h3>
              <p className="text-gray-400">
                We connect directly to Ethereum, Polygon, and Arbitrum RPC endpoints. No middlemen, no delays.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Real-Time Analysis</h3>
              <p className="text-gray-400">
                Advanced algorithms parse Uniswap V3 events for accurate ETH/USD pricing and gas calculations.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Decisions</h3>
              <p className="text-gray-400">
                Get instant notifications, simulate costs, and make informed decisions before every transaction.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">GasTracker Pro</span>
          </div>
          <p className="text-gray-500 mb-6">
            The future of gas fee optimization is here
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

export default LandingPage;