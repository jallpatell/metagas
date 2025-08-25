"use client";
import React, { useState } from "react";
import Image from "next/image"
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

const StockTradingInterface: React.FC<StockTradingInterfaceProps> = ({ gasPrice, blockchainName, imageSource }) => {
  return (
    <div className="min-h-screen bg-[#141414] text-white relative">
      <Navbar />
      <section className="z-10 max-w-7xl mt-0 h mx-auto px-6 mt-5s py-6">
        <div className="grid grid-cols-1 mt-20 lg:grid-cols-10 gap-8">
          {/* CHART AND HEADER */}
          <div className="items-center col-span-1 lg:col-span-7 flex flex-col gap-6">
            <div className="p-8 w-full">
              <GlassCard className=" mr-20 -ml-32 mb-5 bg-black -mt-9 h-23 w-355">
                <div className="">
                  <div className="flex text-3xl font-extralight justify-between">
                    <div className="flex ml-30 gap-5">
                      <Image src={imageSource} alt="logo" width={45} height={45}/>
                      <h1 className="font-medium text-gray-300 ml-3 font-mono mt-6 text-4xl">{blockchainName}</h1>
                    </div>
                    <div className="flex bg-black p-2 gap-3  rounded-xl mr-30">
                      <div className="rounded-xl p-2 bg-blue-400/20">
                        <h2 className="text-xl ml-4 font-light font-mono text-gray-500">Gas</h2>
                        <h2 className="font-sans font-bold text-xl text-blue-400 ml-4">00.70 Wei</h2>
                      </div>
                      <div className="rounded-xl p-2 bg-green-300/20">
                        <h2 className="text-xl ml-4 font-light font-mono text-gray-500">24H High</h2>
                        <h2 className="font-sans font-bold text-xl text-green-400 ml-4">$4384.74</h2>
                      </div>
                      <div className="bg-red-400/20 rounded-xl p-2">
                        <h2 className="text-xl ml-4 font-light font-mono text-gray-500">24H Low</h2>
                        <h2 className="font-sans font-bold text-xl text-red-400 ml-4">$4206.20</h2>
                      </div>
                      <div className="bg-blue-400/20 rounded-xl p-2">
                        <h2 className="text-xl ml-4 font-light font-mono text-gray-500">{ blockchainName }</h2>
                        <h2 className="font-sans font-extrabold text-xl text-blue-400 ml-4">$4290.20</h2>
                      </div>
                    </div> 
                  </div>
                </div>
              </GlassCard>
              <div className="w-240 h-130 bg-black rounded-xl -ml-30">
                <GasChartEth gasPrice={gasPrice} />
              </div>
            </div>
          </div>

          {/* ORDER BOOK - Added this new section */}
          <div className="col-span-1 mt-28 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
              </div>
              <OrderBook />
          </div>
          
        </div>
      </section>
      <section>
        <div className="bg-#131313">
            <CryptoList />
          </div>
      </section>
      <Footer />
    </div>
  );
};

export default StockTradingInterface;