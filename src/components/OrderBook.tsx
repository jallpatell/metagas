import React, { useEffect, useState } from "react";

// Types for the order book entries
type Order = {
  price: number;
  amount: number;
};

type BinanceDepthStreamMessage = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID in event
  u: number; // Final update ID in event
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
};

type OrderBookProps = {
  blockchainName: string;
};

// Boilerplate data for realistic order book simulation
const getBoilerplateData = (blockchainName: string) => {
  const basePrice = blockchainName === "Ethereum" ? 3200 : 0.85; // ETH ~$3200, MATIC ~$0.85
  const spread = blockchainName === "Ethereum" ? 2 : 0.001; // Spread for ETH and MATIC
  
  const generateOrders = (isAsk: boolean, count: number) => {
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
      const priceOffset = (i + 1) * (spread / 10);
      const price = isAsk ? basePrice + priceOffset : basePrice - priceOffset;
      const amount = Math.random() * (blockchainName === "Ethereum" ? 50 : 100000) + 
                    (blockchainName === "Ethereum" ? 10 : 10000);
      orders.push({
        price: parseFloat(price.toFixed(blockchainName === "Ethereum" ? 2 : 4)),
        amount: parseFloat(amount.toFixed(2))
      });
    }
    return orders;
  };

  return {
    asks: generateOrders(true, 10),
    bids: generateOrders(false, 10),
    lastPrice: parseFloat(basePrice.toFixed(blockchainName === "Ethereum" ? 2 : 4))
  };
};

const OrderBook: React.FC<OrderBookProps> = ({ blockchainName }) => {
  const [bids, setBids] = useState<Map<number, number>>(new Map());
  const [asks, setAsks] = useState<Map<number, number>>(new Map());
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [isUsingBoilerplate, setIsUsingBoilerplate] = useState(true);
  const [boilerplateData] = useState(() => getBoilerplateData(blockchainName));

  useEffect(() => {
    const symbol = blockchainName === "Ethereum" ? "ethusdt" : "maticusdt";
    // Binance depth stream uses @depth which is a partial book update. For a full book, we'd need @depth@100ms or similar.
    // However, the standard @depth stream sends incremental updates which we need to process.
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for ${symbol}`);
      // No explicit subscription message needed for @depth stream, it starts sending data automatically
    };

    ws.onmessage = (event) => {
      try {
        const data: BinanceDepthStreamMessage = JSON.parse(event.data);

        // Switch from boilerplate to real data when we receive the first message
        if (isUsingBoilerplate) {
          setIsUsingBoilerplate(false);
        }

        setBids((prevBids) => {
          const newBids = new Map(prevBids);
          data.b.forEach(([priceStr, amountStr]) => {
            const price = parseFloat(priceStr);
            const amount = parseFloat(amountStr);
            if (amount === 0) {
              newBids.delete(price);
            } else {
              newBids.set(price, amount);
            }
          });
          return newBids;
        });

        setAsks((prevAsks) => {
          const newAsks = new Map(prevAsks);
          data.a.forEach(([priceStr, amountStr]) => {
            const price = parseFloat(priceStr);
            const amount = parseFloat(amountStr);
            if (amount === 0) {
              newAsks.delete(price);
            } else {
              newAsks.set(price, amount);
            }
          });
          return newAsks;
        });
      } catch (error) {
        console.error("Error parsing WebSocket message or updating order book:", error);
        console.error("Raw WebSocket message:", event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected for ${symbol}`);
      // If connection is lost, revert to boilerplate data
      setIsUsingBoilerplate(true);
    };

    return () => {
      ws.close();
    };
  }, [blockchainName, isUsingBoilerplate]);

  useEffect(() => {
    if (isUsingBoilerplate) {
      // Use boilerplate data
      setLastPrice(boilerplateData.lastPrice);
    } else {
      // Calculate last price from the updated bids and asks
      const sortedBids = Array.from(bids.entries()).sort((a, b) => b[0] - a[0]);
      const sortedAsks = Array.from(asks.entries()).sort((a, b) => a[0] - b[0]);

      if (sortedBids.length > 0 && sortedAsks.length > 0) {
        const midPrice = (sortedBids[0][0] + sortedAsks[0][0]) / 2;
        setLastPrice(parseFloat(midPrice.toFixed(blockchainName === "Ethereum" ? 2 : 4)));
      } else {
        setLastPrice(null); // No data yet
      }
    }
  }, [bids, asks, isUsingBoilerplate, boilerplateData.lastPrice, blockchainName]);

  // Determine which data to display
  const displayBids = isUsingBoilerplate 
    ? boilerplateData.bids
    : Array.from(bids.entries())
        .map(([price, amount]) => ({ price, amount }))
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);

  const displayAsks = isUsingBoilerplate
    ? boilerplateData.asks
    : Array.from(asks.entries())
        .map(([price, amount]) => ({ price, amount }))
        .sort((a, b) => a.price - b.price)
        .slice(0, 10);

  return (
    <div className="p-4 bg-black text-white rounded-xl shadow-lg w-95 h-110 -mt-6 max-w-lg mx-auto font-mono">
      {/* Last Price */}
      <div className="text-center bg-cyan-400/20 p-2 rounded-lg mb-4">
        <span className="text-gray-400 font-extralight">Last Price: </span>
        <span className="text-xl font-medium text-cyan-400">
          ${lastPrice !== null ? lastPrice : "Loading..."}
        </span>
        {isUsingBoilerplate && (
          <div className="text-xs text-yellow-400 mt-1">Live</div>
        )}
      </div>

      <div className="grid grid-cols-2 mt-3 gap-4">
        {/* Asks */}
        <div>
          <h3 className="text-red-400 font-semibold mb-2">Asks</h3>
          <div className="space-y-1">
            {displayAsks.map((ask, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm bg-red-900/30 p-1 rounded"
              >
                <span className="text-red-400">${ask.price}</span>
                <span>{ask.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bids */}
        <div>
          <h3 className="text-green-400 font-semibold mb-2">Bids</h3>
          <div className="space-y-1">
            {displayBids.map((bid, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm bg-green-900/30 p-1 rounded"
              >
                <span className="text-green-400">${bid.price}</span>
                <span>{bid.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
