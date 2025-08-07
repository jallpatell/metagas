"use client";
import React, { useState } from "react";
import Image from "next/image"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";
import Navbar from "./Navbar";
import GasChartEth from "./GasChart"; // ✅ FIX: move to /components or make this a client component
import GlassCard from "./GlassCard";
import GridBackground from "./Grid";

const TIMEFRAMES = ["Live Price", "Simulated Price"];

type StockTradingInterfaceProps = {
  gasPrice:  string | null;
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

const StockTradingInterface: React.FC<StockTradingInterfaceProps> = ({ gasPrice, blockchainName, imageSource }) => {
  const [activeTimeframe, setActiveTimeframe] = useState("Live Price");

  const [stockData] = useState({
    symbol: blockchainName,
    change: 0.000000176,
    changePercent: 1.35,
  });

  

  const formatPrice = (price: number | string | null | undefined): string => {
    const num = typeof price === "number" ? price : Number(price ?? 0);
    return num.toFixed(9);
  };

  const isPositive = stockData.change >= 0;

  return (
    <div className="min-h-screen  bg-[#131313] text-white relative ">
      <GridBackground />
      <Navbar />
      <section className="z-10 pt-10 pb-4">
        <div className="mt-3"></div>
      </section>
      <section className="z-10 max-w-7xl mx-auto px-6 mt-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

        
          {/* CHART AND HEADER */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <GlassCard className="p-8 w-320">
              <div className="flex flex-wrap justify-between items-center mb-8">
                <div>
                  <div className="flex items-center align-middle bg-center space-x-3">
                    <GlassCard className="p-5 ml-7 mb-8 w-50">
                      <div className="flex gap-4">
                        <h1 className="flex align-middle">{blockchainName}</h1>
                        <Image src={imageSource} alt="My-Image" width={15} height={15} className="mb-10 " />
                      </div>
                      
                    </GlassCard>
                    <div className="flex ml-130">
                      <GlassCard>
                      <div className=" font-mono text-lg flex items-baseline gap-4">
                        <span className={`inline-flex items-center gap-1 font-bold p-8 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                          {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                          {isPositive ? "+" : ""}
                          {formatPrice(stockData.change)} ({isPositive ? "+" : ""}
                          {stockData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </GlassCard>
                    <GlassCard className="p-8 w-70font-extrabold text-2xl ml-5">
                        <p>Gas Price</p>
                        <span className="text-blue-500 text-2xl font-extrabold">
                      {gasPrice}
                      </span>
                    </GlassCard>
                    </div> 
                    

                  </div>
                  
                </div>
                {/* OHLC */}
              </div>

              {/* CHART */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex ml-15 -mt-1 space-x-2">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`
                          px-3 py-1 rounded-2xl font-semibold text-sm  transition-colors border
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
                  <GasChartEth gasPrice={gasPrice}/>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StockTradingInterface;
