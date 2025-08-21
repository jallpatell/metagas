import React, { useEffect, useState } from "react";

// Types for the order book entries
type Order = {
  price: number;
  amount: number;
};

// Utility to generate random number within range
const randomInRange = (min: number, max: number, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generateOrders = (
  type: "bids" | "asks",
  count: number,
  basePrice: number
): Order[] => {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const price =
      type === "bids"
        ? basePrice - i * randomInRange(0.5, 1.5)
        : basePrice + i * randomInRange(0.5, 1.5);
    orders.push({
      price: parseFloat(price.toFixed(2)),
      amount: randomInRange(0.1, 5, 3),
    });
  }
  return orders;
};

const OrderBook: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastPrice, setLastPrice] = useState(4200);

  // Initialize and update order book whenever lastPrice changes
  useEffect(() => {
    setBids(generateOrders("bids", 10, lastPrice));
    setAsks(generateOrders("asks", 10, lastPrice));
  }, [lastPrice]); // ✅ Added lastPrice as dependency

  // Simulate price updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastPrice((prevPrice) => {
        const newPrice = prevPrice + randomInRange(-20, 20);
        return parseFloat(newPrice.toFixed(2));
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-black text-white rounded-xl shadow-lg w-100 max-w-lg mx-auto font-mono">
      {/* Last Price */}
      <div className="text-center mb-4">
        <span className="text-gray-400 font-extralight">Last Price: </span>
        <span className="text-2xl font-medium">${lastPrice}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Asks */}
        <div>
          <h3 className="text-red-400 font-semibold mb-2">Asks</h3>
          <div className="space-y-1">
            {asks.map((ask, idx) => (
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
            {bids.map((bid, idx) => (
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
