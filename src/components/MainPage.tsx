"use client";
import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import GasChartEth from "./GasChart";
import OrderBook from "./OrderBook";
import GlassCard from "./GlassCard";
import Footer from "./Footer";
import CryptoList from "./CryptoList";

type StockTradingInterfaceProps = {
  gasPrice: string | null;
  blockchainName: string;
  imageSource: string;
};

const StockTradingInterface: React.FC<StockTradingInterfaceProps> = ({ 
  gasPrice, 
  blockchainName, 
  imageSource 
}) => {
  return (
    <div className="min-h-screen w-full bg-[#141414] text-white relative overflow-x-hidden">
      <Navbar />
      
      {/* Main content with increased top padding to prevent navbar overlap */}
      <main className="pt-28 pb-10 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-2">
          
          {/* CHART AND HEADER SECTION */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Header Card */}
            <GlassCard className="w-full bg-black p-4 sm:p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                    <Image 
                      src={imageSource} 
                      alt="logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-gray-300 font-mono">
                    {blockchainName}
                  </h1>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">Gas</h2>
                    <h2 className="font-sans font-bold text-sm sm:text-base text-blue-400 truncate">
                      {gasPrice || "Loading..."}
                    </h2>
                  </div>
                  <div className="rounded-lg p-2 bg-green-300/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">24H High</h2>
                    <h2 className="font-sans font-bold text-sm sm:text-base text-green-400 truncate">$4384.74</h2>
                  </div>
                  <div className="rounded-lg p-2 bg-red-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">24H Low</h2>
                    <h2 className="font-sans font-bold text-sm sm:text-base text-red-400 truncate">$4206.20</h2>
                  </div>
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">{blockchainName}</h2>
                    <h2 className="font-sans font-bold text-sm sm:text-base text-blue-400 truncate">$4290.20</h2>
                  </div>
                </div>
              </div>
            </GlassCard>
            
            {/* Chart Container - Fixed dimensions to prevent overflow */}
            <div className="w-full bg-black rounded-xl p-4">
              <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[420px]">
                <GasChartEth gasPrice={gasPrice} />
              </div>
            </div>
          </div>

          <div>
            {/* ORDER BOOK SECTION - Now properly positioned below navbar */}
          <div className="w-full mt-6 lg:w-80 xl:w-96 flex-shrink-0">
            <OrderBook blockchainName={blockchainName} />
          </div>
            {/* Chain Data */}
          <div className="bg-black h-30 mt-2 lg:w-95 rounded-xl">
          </div>
          </div>
          
        </div>
        
        
      </main>
      <div className="-mt-17">
        <Footer />
      </div>
      
    </div>
  );
};

export default StockTradingInterface;