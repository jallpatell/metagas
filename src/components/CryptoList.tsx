"use client";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// ✅ Declare interface at top level
interface Crypto {
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

// ✅ Typed fetch function
const fetchCryptoData = async (): Promise<Crypto[]> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const CryptoListInner = () => {
  // ✅ Pass type here
  const { data: cryptos, isLoading } = useQuery<Crypto[]>({
    queryKey: ["cryptos"],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30s
  });

  if (isLoading)
    return <div className="glass-card rounded-lg p-6 animate-pulse">Loading...</div>;

  return (
    <div className="glass-card rounded-2xl p-6 bg-black border-1 border-gray-900 -mt-10 ml-7 w-354 animate-fade-in">
      <h2 className="text-3xl font-sans mb-6 font-extralight">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="text-left text-lg text-[#fefefe] font-sans font-extralight text-muted-foreground">
              <th className="py-3 px-4 border-b border-gray-700">Name</th>
              <th className="py-3 px-4 border-b border-gray-700">Price</th>
              <th className="py-3 px-4 border-b border-gray-700">24h Change</th>
              <th className="py-3 px-4 border-b border-gray-700">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos?.map((crypto: Crypto, idx: number) => (
              <tr
                key={crypto.symbol}
                className={`transition-colors rounded-4xl  duration-300 cursor-pointer ${
                  idx % 2 === 0 ? "bg-#151515" : "bg-blue-400/5"
                } hover:bg-blue-500/20`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono">
                  ${crypto.current_price.toLocaleString()}
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
                <td className="py-3 px-4 font-mono">
                  ${(crypto.total_volume / 1e9).toFixed(1)}B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
