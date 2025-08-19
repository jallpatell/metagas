"use client";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const fetchCryptoData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const CryptoListInner = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ["cryptos"],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30s
  });

  if (isLoading) return <div className="glass-card rounded-lg p-6 animate-pulse">Loading...</div>;

  return (
    <div className="glass-card rounded-lg p-6 bg-[#131313] ml-10 mr-10 animate-fade-in">
      <h2 className="text-3xl font-sans mb-6 font-extralight">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-sm">
  <thead className="">
    <tr className="text-left text-lg text-[#fefefe] font-sans font-extralight text-muted-foreground">
      <th className="py-3 px-4 border-b border-gray-700">Name</th>
      <th className="py-3 px-4 border-b border-gray-700">Price</th>
      <th className="py-3 px-4 border-b border-gray-700">24h Change</th>
      <th className="py-3 px-4 border-b border-gray-700">Volume</th>
    </tr>
  </thead>
  <tbody>
    {cryptos?.map((crypto: any, idx: number) => (
      <tr
        key={crypto.symbol}
        className={`transition-colors rounded-2xl duration-300 cursor-pointer ${
          idx % 2 === 0 ? "bg-black" : "bg-gray-900"
        } hover:bg-gray-700`}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-medium">{crypto.name}</p>
              <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 font-mono">${crypto.current_price.toLocaleString()}</td>
        <td className="py-3 px-4">
          <span
            className={`flex items-center gap-1 font-semibold ${
              crypto.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
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
        <td className="py-3 px-4 font-mono">${(crypto.total_volume / 1e9).toFixed(1)}B</td>
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
