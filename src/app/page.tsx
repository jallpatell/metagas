"use client"
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const GlassCard = ({
    children,
    className = "",
    hover = true,
  }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }) => (
    <div
      className={`
        backdrop-blur-sm border border-white/10 rounded-xl
        ${hover ? "hover:border-white/20" : ""}
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(25deg);
          }
          50% {
            transform: translateY(-20px) rotate(25deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(25deg);
          }
          50% {
            transform: translateY(-30px) rotate(25deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <Navbar />

      {/* Floating Logos */}
      <div className="absolute inset-0 mt-12 pointer-events-none overflow-hidden z-0">
        {/* Floating Logos */}
<Image
  src="/assets/ethlogo.svg"
  alt="Ethereum"
  width={100}
  height={100}
  className="absolute top-[10%] left-[5%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float"
/>

<Image
  src="/assets/ethlogo.svg"
  alt="Ethereum"
  width={100}
  height={100}
  className="absolute top-[21%] left-[45%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float"
/>


<Image
  src="/assets/polygon-matic-logo.svg"
  alt="Polygon"
  width={90}
  height={90}
  className="absolute top-[25%] right-[10%] opacity-15 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float-slow"
/>
<Image
  src="/assets/polygon-matic-logo.svg"
  alt="Polygon"
  width={90}
  height={90}
  className="absolute top-[7%] left-[67%] opacity-15 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float-slow"
/>
<Image
  src="/assets/polygon-matic-logo.svg"
  alt="Polygon"
  width={90}
  height={90}
  className="absolute top-[55%] right-[47%] opacity-15 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float-slow"
/>

<Image
  src="/assets/arbitrum-logo.svg"
  alt="Arbitrum"
  width={100}
  height={100}
  className="absolute top-[15%] left-[95%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float"
/>

<Image
  src="/assets/arbitrum-logo.svg"
  alt="Optimism"
  width={85}
  height={85}
  className="absolute top-[37%] right-[85%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float-fast"
/>

<Image
  src="/assets/ethlogo.svg"
  alt="Solana"
  width={90}
  height={90}
  className="absolute top-[70%] left-[10%] opacity-15 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float"
/>

<Image
  src="/assets/arbitrum-logo.svg"
  alt="Avalanche"
  width={95}
  height={95}
  className="absolute top-[85%] right-[5%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float-slow"
/>

<Image
  src="/assets/ethlogo.svg"
  alt="Ethereum"
  width={100}
  height={100}
  className="absolute top-[85%] left-[5%] opacity-20 hover:opacity-0 transition-opacity duration-500 pointer-events-auto animate-float"
/>

      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 flex items-center justify-center min-h-[90vh]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="bg-white text-transparent bg-clip-text">
              Stop Overpaying
            </span>
            <br />
            <span className="bg-white text-transparent bg-clip-text text-5xl sm:text-6xl md:text-7xl font-extrabold">
              Gas Fees
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-300 font-medium max-w-2xl mx-auto mb-12">
            Most advanced real-time cross-chain gas tracker for Web3. <br />
            Monitor Ethereum, Polygon, and Arbitrum with precision timing and
            smart wallet simulation.
          </p>

          {/* Cards Row */}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Ethereum */}
            <Link href="/liveEth">
              <GlassCard className="w-full md:w-72 bg-[#141414] p-6 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-105 transition-all">
                <Image src="/assets/new-tab.png" height={24} width={24} alt="new_tab" />
                <div className="text-xl font-bold font-mono">Ethereum (Layer 1)</div>
                <div className="flex items-center text-gray-300 text-sm">
                  Live Gas Price
                  <div className="w-2 h-2 ml-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-mono text-blue-400">04.323 GWei</div>
                <div className="text-md text-purple-400">$67.23B</div>
                <div className="text-xs text-gray-400">Market Volume</div>
              </GlassCard>
            </Link>

            {/* Polygon */}
            <Link href="/livePol">
              <GlassCard className="w-full md:w-72 bg-[#141414] p-6 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-105 transition-all">
                <Image src="/assets/new-tab.png" height={24} width={24} alt="new_tab" />
                <div className="text-xl font-bold font-mono">Polygon (Layer 2)</div>
                <div className="flex items-center text-gray-300 text-sm">
                  Live Gas Price
                  <div className="w-2 h-2 ml-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-mono text-blue-400">29.23 GWei</div>
                <div className="text-md text-purple-400">$231.23M</div>
                <div className="text-xs text-gray-400">Market Volume</div>
              </GlassCard>
            </Link>

            {/* Arbitrum */}
            <Link href="/liveArb">
              <GlassCard className="w-full md:w-72 bg-[#141414] p-6 flex flex-col items-center space-y-2 shadow hover:bg-blue-400/20 hover:scale-105 transition-all">
                <Image src="/assets/new-tab.png" height={24} width={24} alt="new_tab" />
                <div className="text-xl font-bold font-mono">Arbitrum (Layer 2)</div>
                <div className="flex items-center text-gray-300 text-sm">
                  Live Gas Price
                  <div className="w-2 h-2 ml-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-mono text-blue-400">0.923 GWei</div>
                <div className="text-md text-purple-400">$1.273B</div>
                <div className="text-xs text-gray-400">Market Volume</div>
              </GlassCard>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Large Card */}
          <GlassCard className="p-8 bg-[radial-gradient(rgba(229,231,235,0.2)_1px,transparent_1px)] bg-red-400/10">
            <h2 className="text-2xl text-[#d45f63] font-bold mb-4">
              Why tracking gas prices matter?
            </h2>
            <p className="text-gray-300 font-medium mb-4">
              Network congestion can change rapidly throughout the day. By
              analyzing gas price volatility in rolling 15-minute intervals, you
              get actionable insights into periods of high and low on-chain
              activity.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-200 font-semibold">
              <li>
                Spot patterns in gas surges during NFT mints, DeFi launches, or
                market volatility.
              </li>
              <li>
                Schedule your transactions when on-chain fees are lower.
              </li>
              <li>
                Save money by avoiding rush hours—updated every 15 minutes.
              </li>
            </ul>
            <p className="text-gray-200 mt-4">
              With live charting, you see not only averages, but real extremes
              (highs/lows) within each window, giving you deeper control.
            </p>
          </GlassCard>

          {/* Right Column Cards */}
          <div className="flex flex-col gap-6">
            <GlassCard className="p-6 bg-amber-200/10 text-yellow-300 font-semibold">
              Fetches real-time gas prices from Ethereum, Polygon, and Arbitrum
              using their native RPC endpoints.
            </GlassCard>
            <GlassCard className="p-6 bg-orange-300/20 text-orange-700 font-semibold">
              Includes priority fees & base fees. Handles chain-specific data
              structures. Order book integration for real-time depth.
            </GlassCard>
            <GlassCard className="p-6 bg-pink-300/20 text-pink-500 font-semibold">
              Real-time visual representation of gas trends from mainnet nodes &
              live market tracking.
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
