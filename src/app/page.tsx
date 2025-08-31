"use client"
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CryptoList from '@/components/CryptoList';

const LandingPage = () => {
  const GlassCard = ({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
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
      <section className="relative mt-25  z-10 pt-20 ">
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
                                     <Link href="/liveEth">
                     <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                       <div className="">
                         <div className=' -ml-6 -mt-6 flex p-1'>
                           <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab'/>
                         </div>
                         <div className="text-2xl font-bold font-mono ">Ethereum (Layer1)</div>
                         <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                           Live Gas Price <div className="w-2 h-2 ml-2 mt-2 bg-green-400 rounded-full animate-pulse"></div>
                         </div>
                         <div className="text-3xl mb-5 font-mono text-blue-400">04.323 GWei</div>
                         <div className="text-lg mt-5 -mb-1 text-purple-400">$67.23B</div>
                         <div className="text-sm text-gray-400">Market Volume</div>
                        </div>
                     </GlassCard>
                   </Link>
                                     <Link href="/livePol">
                     <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                       <div className="">
                         <div className=' -ml-6 -mt-6 flex p-1'>
                           <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab'/>
                         </div>
                         <div className="text-2xl font-bold font-mono ">Polygon <br></br> (Layer 2)</div>
                         <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                           Live Gas Price <div className="w-2 h-2 ml-2 mt-2 bg-green-400 rounded-full animate-pulse"></div>
                         </div>
                         <div className="text-3xl mb-5 font-mono text-blue-400">29.23 GWei</div>
                         <div className="text-lg mt-5 -mb-1 text-purple-400">$231.23M</div>
                         <div className="text-sm text-gray-400">Market Volume</div>
                        </div>
                     </GlassCard>
                   </Link>
                                     <Link href="/liveArb">
                     <GlassCard className="ml-5 w-70 border-white/10 p-8 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-102 transition-all duration-900">
                       <div className="">
                         <div className=' -ml-6 -mt-6 flex p-1'>
                           <Image src="/assets/new-tab.png" height={25} width={25} alt='new_tab' className='animate-[blink_3s_ease-in-out_infinite]'/>
                         </div>
                         <div className="text-2xl font-bold font-mono ">Arbitrum (Layer 2)</div>
                         <div className="text-shadow-md ml-11 mt-3 flex text-gray-300">
                           Live Gas Price <div className="w-2 h-2 ml-2 mt-2 bg-green-400 rounded-full animate-pulse"></div>
                         </div>
                         <div className="text-3xl mb-5 font-mono text-blue-400">0.923 GWei</div>
                         <div className="text-lg mt-5 -mb-1 text-purple-400">$1.273B</div>
                         <div className="text-sm text-gray-400">Market Volume</div>
                        </div>
                     </GlassCard>
                   </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}

        </div>
      </section>

      {/* Features Section */}
      <div id='features' className='flex gap-8'>
        <GlassCard className='p-10 w-200 bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_1px)] [background-size:16px_16px] bg-red-400/10 h-140 ml-15'>
        <h2 className="text-xl text-[#d45f63] font-bold font-mono mb-2">Why  tracking gas price matter?</h2>
        <p className="text-gray-300 font-mono font-extrabold text-xl ">
            Network congestion can change rapidly throughout the day. By analyzing gas price volatility in rolling 15-minute intervals, you get actionable insights into periods of high and low on-chain activity. <br></br>This helps you:
          </p>
          <ul className="list-disc font-extrabold text-left my-3 font-mono text-xl  pl-6 text-gray-200 space-y-1">
            <li>Spot patterns in gas surges during popular NFT mints, DeFi launches, or market volatility.</li>
            <li>Schedule your transactions when on-chain fees are predictably lower.</li>
            <li>Save money by avoiding network rush hours—up-to-date every 15 minutes.</li>
          </ul>
          <p className="text-gray-200 text-xl font-bold font-mono mt-2">
            With Live charting, you see not only averages, but real extremes (highs/lows) within each 15-minute window, giving you deeper control over your transaction timing.
          </p>
      </GlassCard>
      <div>
        <GlassCard className='w-130 h-35 bg-amber-200/10 text-xl p-5 font-mono text-yellow-300 font-extrabold '>
          <h2 className=''>
            Fetches real-time gas prices from Ethereum, Polygon, and Arbitrum using their native RPC endpoints
          </h2>
        </GlassCard>
        
        <GlassCard className='w-130 mt-7 h-45 bg-orange-300/20 text-xl p-5 font-mono text-orange-700 font-extrabold '>
          <h2 className=''>
            Includes priority fees and base fees, and handle chain-specific data structures.<br></br> Order Book Integration – Track real-time market depth.
          </h2>
        </GlassCard>
        
        <GlassCard className='w-130 mt-7 h-45 bg-pink-300/20 text-xl p-5 font-mono text-pink-500 font-extrabold mb-30'>
          <h2 className=''>
            Real-time Visual representation of gas price trends from Main-Net Nodes & Track real-time market depth.
          </h2>
        </GlassCard>
        
      </div>
      </div>
      <div>
        <CryptoList />
      </div>
      <div id='aboutMe'>
        <Footer />
      </div>
      
    </div>
  );
};

export default LandingPage;