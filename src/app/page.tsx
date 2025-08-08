"use client"
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Wallet, Shield, Clock, BarChart3, ArrowRight, Star, Users, DollarSign, Activity, Grid } from 'lucide-react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import GridBackground from '@/components/Grid';
import Footer from '@/components/Footer';


interface LiveDataCardProps {
  chain: string;
  price: string;
  volume: string
}

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 128, y: 300 });
  const [currentStat, setCurrentStat] = useState(0);

  function LiveDataCard({ chain, price, volume }: React.FC<LiveDataCardProps>) {
  // price: current gas price, volume: 24h on-chain volume
  return (

    <div className="rounded-2xl ml-5 w-70 bg-white/5 border border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-105 transition-all duration-300">
      <div className='ml-40 flex p-1'>
        <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab'/>
      </div>
      
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
       backdrop-blur-sm border border-white/10 rounded-xl
      ${hover ? ' hover:border-white/20 ' : ''}
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
            <Image src="/assets/bg_webpage.png" height={450} width={650} alt='bg' className='mr-7  -ml-40 -mt-24 ' />
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
                  <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                    <div className="">
                      <div className=' -ml-6 -mt-6 flex p-1'>
                        <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab'/>
                      </div>
                      <div className="text-2xl font-bold font-mono ">Ethereum (Layer1)</div>
                      <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                        Live Gas Price <Image alt="blink" className='-mt-3 -ml-7' src="/assets/download.png" height={90} width={90}/>
                      </div>
                      <div className="text-3xl mb-5 font-mono text-blue-400">23.23 GWei</div>
                      <div className="text-lg mt-5 -mb-1 text-purple-400">$231.23B</div>
                      <div className="text-sm text-gray-400">Market Volume</div>
                     </div>
                  </GlassCard>
                  <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                    <div className="">
                      <div className=' -ml-6 -mt-6 flex p-1'>
                        <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab'/>
                      </div>
                      <div className="text-2xl font-bold font-mono ">Polygon <br></br> (Layer 2)</div>
                      <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                        Live Gas Price <Image alt="blink" className='-mt-3 -ml-7' src="/assets/download.png" height={90} width={90}/>
                      </div>
                      <div className="text-3xl mb-5 font-mono text-blue-400">23.23 GWei</div>
                      <div className="text-lg mt-5 -mb-1 text-purple-400">$231.23B</div>
                      <div className="text-sm text-gray-400">Market Volume</div>
                     </div>
                  </GlassCard>
                  <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                    <div className="">
                      <div className=' -ml-6 -mt-6 flex p-1'>
                        <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab' className='animate-[blink_3s_ease-in-out_infinite]'/>
                      </div>
                      <div className="text-2xl font-bold font-mono ">Arbitrum (Layer 2)</div>
                      <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                        Live Gas Price <Image alt="blink" className='-mt-3 -ml-7' src="/assets/download.png" height={90} width={90}/>
                      </div>

                      <div className="text-3xl mb-5 font-mono text-blue-400">23.23 GWei</div>
                      <div className="text-lg mt-5 -mb-1 text-purple-400">$231.23B</div>
                      <div className="text-sm text-gray-400">Market Volume</div>
                     </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}

        </div>
      </section>

      {/* Features Section */}
      <div className='flex gap-8'>
        <GlassCard className='p-10 w-200 bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_1px)] [background-size:16px_16px] bg-red-400/10 h-180 ml-15'>
        <h2 className="text-4xl text-[#d45f63] font-bold font-mono mb-2">Why does tracking 15-minute gas data matter?</h2>
        <p className="text-gray-300 font-mono font-extrabold text-2xl ">
            Network congestion can change rapidly throughout the day. By analyzing gas price volatility in rolling 15-minute intervals, you get actionable insights into periods of high and low on-chain activity. <br></br>This helps you:
          </p>
          <ul className="list-disc font-extrabold text-left my-3 font-mono text-xl  pl-6 text-gray-200 space-y-1">
            <li>Spot patterns in gas surges during popular NFT mints, DeFi launches, or market volatility.</li>
            <li>Schedule your transactions when on-chain fees are predictably lower.</li>
            <li>Save money by avoiding network rush hours—up-to-date every 15 minutes.</li>
          </ul>
          <p className="text-gray-200 text-2xl font-bold font-mono mt-2">
            With Live charting, you see not only averages, but real extremes (highs/lows) within each 15-minute window, giving you deeper control over your transaction timing.
          </p>
      </GlassCard>
      <div>
        <GlassCard className='w-130 h-55 bg-green-300/20 text-3xl p-5 font-mono text-green-700 font-extrabold '>
          <h2 className=''>
            Fetches real-time gas prices from Ethereum, Polygon, and Arbitrum using their native RPC endpoints
          </h2>
        </GlassCard>
        <GlassCard className='w-130 mt-7 h-55 bg-pink-300/20 text-3xl p-5 font-mono text-pink-500 font-extrabold '>
          <h2 className=''>
            Real-time ETH/USD pricing via ethers.getLogs from "Uniswap V3" ETH/USDC pool ensures accurate cost calculations
          </h2>
        </GlassCard>
        <GlassCard className='w-130 mt-7 h-55 bg-orange-300/20 text-3xl p-5 font-mono text-orange-700 font-extrabold '>
          <h2 className=''>
            Include priority fees and base fees, and handle chain-specific data structures
          </h2>
        </GlassCard>
        
      </div>
      </div>
      
      
      {/* How It Works */}



      {/* CTA Section */}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;