import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#141414] text-white relative overflow-x-hidden">
      {/* Navbar Placeholder - Static */}
      <div className="h-16 bg-gray-800 w-full mb-6"></div>

      <main className="pt-28 pb-10 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-2">
          {/* CHART AND HEADER SKELETON (col-span-7) */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Header Card Placeholder */}
            <div className="w-full bg-black p-4 sm:p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Image Placeholder */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full animate-pulse"></div>
                  {/* Blockchain Name Placeholder */}
                  <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto">
                  {/* Gas Price Placeholder - Blinking blue */}
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">Gas</h2>
                    <div className="h-4 w-16 bg-blue-400 rounded animate-pulse"></div>
                  </div>
                  {/* 24H High Placeholder - Blinking green */}
                  <div className="rounded-lg p-2 bg-green-300/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">24H High</h2>
                    <div className="h-4 w-20 bg-green-400 rounded animate-pulse"></div>
                  </div>
                  {/* 24H Low Placeholder - Blinking red */}
                  <div className="rounded-lg p-2 bg-red-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">24H Low</h2>
                    <div className="h-4 w-20 bg-red-400 rounded animate-pulse"></div>
                  </div>
                  {/* Blockchain Value Placeholder - Blinking blue */}
                  <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
                    <h2 className="text-xs sm:text-sm font-light font-mono text-gray-500 truncate">Blockchain</h2>
                    <div className="h-4 w-20 bg-blue-400 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Container Placeholder */}
            <div className="w-full bg-black rounded-xl p-4">
              <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[420px] bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>

          {/* ORDER BOOK SKELETON (col-span-3) */}
          <div className="w-full mt-6 lg:w-80 xl:w-96 flex-shrink-0">
            <div className="p-4 bg-black rounded-xl shadow-lg font-mono">
              {/* Last Price Placeholder - Blinking cyan */}
              <div className="text-center bg-cyan-400/20 p-2 rounded-lg mb-4">
                <span className="text-gray-400 font-extralight">Last Price: </span>
                <div className="h-5 w-24 inline-block bg-cyan-400 rounded animate-pulse ml-2"></div>
              </div>

              <div className="grid grid-cols-2 mt-3 gap-4">
                {/* Asks Placeholder */}
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">Asks</h3>
                  <div className="space-y-1">
                    {[...Array(10)].map((_, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-red-900/30 p-1 rounded">
                        <div className="h-4 w-16 bg-red-400 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-red-400 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bids Placeholder */}
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Bids</h3>
                  <div className="space-y-1">
                    {[...Array(10)].map((_, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-green-900/30 p-1 rounded">
                        <div className="h-4 w-16 bg-green-400 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-green-400 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chain Data Placeholder */}
          <div className="bg-black h-30 mt-2 lg:w-95 rounded-xl animate-pulse">

          </div>
        </div>

        {/* Crypto List Section Placeholder */}
        <section className="mt-6 -ml-13">
          <div className="bg-[#131313] rounded-xl p-4 sm:p-6">
            <div className="h-72 bg-gray-800 rounded-xl animate-pulse"></div>
          </div>
        </section>
      </main>

      {/* Footer Placeholder - Static */}
      <div className="h-16 bg-gray-800 w-full mt-6"></div>
    </div>
  );
};

export default LoadingSkeleton;
