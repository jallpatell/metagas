"use client";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Enhanced interface with more data
interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  last_updated: string;
}

// Enhanced fetch function with better error handling
const fetchCryptoData = async (): Promise<Crypto[]> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,30d,1y"
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

// Format price
const formatPrice = (price: number): string => {
  if (price >= 1000) return `$${price.toLocaleString()}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
};

const CryptoListInner = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Enhanced query with better caching and error handling
  const { data: cryptos, isLoading, error, refetch } = useQuery<Crypto[]>({
    queryKey: ["cryptos"],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30s
    refetchIntervalInBackground: true,
    staleTime: 25000, // Consider data stale after 25s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update timestamp when data refreshes
  useEffect(() => {
    if (cryptos) {
      setLastUpdate(new Date());
    }
  }, [cryptos]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 bg-black border-1 border-gray-900 -mt-10 ml-7 w-354">
        <h2 className="text-3xl font-sans mb-6 font-extralight">Top Cryptocurrencies</h2>
        <div className="animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 bg-black border-1 border-gray-900 -mt-10 ml-7 w-354">
        <h2 className="text-3xl font-sans mb-6 font-extralight">Top Cryptocurrencies</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Failed to load cryptocurrency data</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 bg-black border-1 border-gray-900 -mt-10 ml-7 w-354 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-sans font-extralight">Top Cryptocurrencies</h2>
        <div className="text-xs text-gray-400">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="text-left text-lg text-[#fefefe] font-sans font-extralight text-muted-foreground">
              <th className="py-3 px-4 border-b border-gray-700">#</th>
              <th className="py-3 px-4 border-b border-gray-700">Name</th>
              <th className="py-3 px-4 border-b border-gray-700">Price</th>
              <th className="py-3 px-4 border-b border-gray-700">24h</th>
              <th className="py-3 px-4 border-b border-gray-700">Month</th>
              <th className="py-3 px-4 border-b border-gray-700">1Y</th>
              <th className="py-3 px-4 border-b border-gray-700">Max</th>
              <th className="py-3 px-4 border-b border-gray-700">Market Cap</th>
              <th className="py-3 px-4 border-b border-gray-700">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos?.map((crypto: Crypto, idx: number) => (
              <tr
                key={crypto.id}
                className={`transition-colors rounded-4xl duration-300 cursor-pointer ${
                  idx % 2 === 0 ? "bg-#151515" : "bg-blue-400/5"
                } hover:bg-blue-500/20`}
              >
                <td className="py-3 px-4 text-gray-400 font-mono">
                  #{crypto.market_cap_rank}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/32/666666/FFFFFF?text=?';
                      }}
                    />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono">
                  {formatPrice(crypto.current_price)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 font-semibold text-sm ${
                      crypto.price_change_percentage_30d >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_30d >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_30d).toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 font-semibold text-sm ${
                      crypto.price_change_percentage_1y >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_1y >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_1y).toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 font-semibold text-sm ${
                      crypto.ath_change_percentage >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.ath_change_percentage >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.ath_change_percentage).toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-sm">
                  ${formatNumber(crypto.market_cap)}
                </td>
                <td className="py-3 px-4 font-mono text-sm">
                  ${formatNumber(crypto.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Data provided by CoinGecko • Auto-refresh every 30 seconds
      </div>
    </div>
  );
};

const CryptoList = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CryptoListInner />
    </QueryClientProvider>
  );
};

export default CryptoList;
