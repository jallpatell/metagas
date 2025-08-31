"use client";
import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#141414] text-white relative overflow-x-hidden">
      {/* Navbar Skeleton (static) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-gray-700 rounded"></div>
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <main className="pt-28 pb-10 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-2">
          
          {/* CHART AND HEADER SECTION */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Header Card Skeleton */}
            <div className="w-full bg-black p-4 sm:p-6 rounded-xl border border-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="h-8 w-40 bg-gray-800 rounded animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto">
                  {/* Gas Price Skeleton */}
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <div className="h-4 w-12 bg-gray-700 rounded mb-1"></div>
                    <div className="h-6 w-16 bg-blue-400/40 rounded animate-pulse"></div>
                  </div>
                  
                  {/* 24H High Skeleton */}
                  <div className="rounded-lg p-2 bg-green-300/20 min-w-0">
                    <div className="h-4 w-16 bg-gray-700 rounded mb-1"></div>
                    <div className="h-6 w-20 bg-green-400/40 rounded animate-pulse"></div>
                  </div>
                  
                  {/* 24H Low Skeleton */}
                  <div className="rounded-lg p-2 bg-red-400/20 min-w-0">
                    <div className="h-4 w-14 bg-gray-700 rounded mb-1"></div>
                    <div className="h-6 w-20 bg-red-400/40 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Price Skeleton */}
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <div className="h-4 w-20 bg-gray-700 rounded mb-1"></div>
                    <div className="h-6 w-20 bg-blue-400/40 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-500 text-4xl">Might take a few seconds to load for first time. Please wait. Sorry for the inconvenience.</div>
            {/* Chart Container Skeleton */}
            <div className="w-full bg-black rounded-xl p-4 border border-gray-800">
              <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[420px] bg-gray-900 rounded-lg animate-pulse">
                <div className="h-full flex items-end justify-between px-4 pb-4">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 md:w-12 bg-gray-700 rounded-t"
                      style={{ height: `${30 + (i * 10)}%` }}
                    > </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ORDER BOOK SECTION */}
          <div className="w-full mt-6 lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden">
              {/* Order Book Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="h-6 w-40 bg-gray-800 rounded mx-auto mb-2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 w-24 bg-gray-800 rounded"></div>
                  <div className="h-10 w-24 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-16 bg-cyan-400/40 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-800 rounded"></div>
                </div>
              </div>
              
              {/* Order Book Columns */}
              <div className="grid grid-cols-3 text-xs text-gray-500 py-2 border-b border-gray-800 px-4">
                <div className="text-left">Price</div>
                <div className="text-center">Size</div>
                <div className="text-right">Total</div>
              </div>
              
              {/* Bids Skeleton */}
              <div className="max-h-60 overflow-y-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={`bid-${i}`} className="grid grid-cols-3 text-sm px-4 py-1.5 hover:bg-gray-900/50 transition-colors">
                    <div className="text-left">
                      <div className="h-5 w-16 bg-green-400/40 rounded animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-5 w-12 bg-gray-700 rounded mx-auto"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-14 bg-gray-700 rounded ml-auto"></div>
                    </div>
                  </div>
                ))}
                
                {/* Asks Skeleton */}
                {[...Array(5)].map((_, i) => (
                  <div key={`ask-${i}`} className="grid grid-cols-3 text-sm px-4 py-1.5 hover:bg-gray-900/50 transition-colors">
                    <div className="text-left">
                      <div className="h-5 w-16 bg-red-400/40 rounded animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-5 w-12 bg-gray-700 rounded mx-auto"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-14 bg-gray-700 rounded ml-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chain Data Skeleton */}
            <div className="bg-black h-30 mt-2 rounded-xl border border-gray-800 p-4">
              <div className="h-6 w-32 bg-gray-800 rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-5 w-full bg-gray-800 rounded animate-pulse"></div>
                <div className="h-5 w-full bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Skeleton (static) */}
      <div className="-mt-17 bg-black/80 backdrop-blur-md border-t border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-48 bg-gray-800 rounded mx-auto mb-4"></div>
          <div className="flex justify-center gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-800 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;