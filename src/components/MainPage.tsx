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
      <Navbar />
      <section className="z-10 max-w-7xl mx-auto px-6 mt-5s py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

        
          {/* CHART AND HEADER */}
          <div className="items-center col-span-1 scale-80 lg:col-span-7 flex flex-col gap-6">
            <div className="p-8  w-320">
              <div className="flex flex-wrap justify-between items-center ">
                <div>
                  <div className="flex bg-center space-x-3">
                      <div className="flex text-3xl font-extralight gap-4">
                        <Image alt="logo" src={ imageSource } height={70} width={70} className=""/>
                        <h1 className="flex ml-5 mt-5  font-extralight font-sans text-6xl  ">{blockchainName}</h1>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex ml-20 space-x-2">
                        {TIMEFRAMES.map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setActiveTimeframe(tf)}
                            className={`
                              px-6 py-1 rounded-xl font-extralight text-sm   border
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
                    

                  </div>
                  
                </div>
                {/* OHLC */}
              </div>

              {/* CHART */}
              <div>
                <div className="mt-8 ">
                  <GasChartEth gasPrice={gasPrice}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StockTradingInterface;
