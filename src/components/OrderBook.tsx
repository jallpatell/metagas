import React, { useEffect, useState, useRef } from "react";

// Types for the order book entries
type Order = {
  price: number;
  amount: number;
};

type ServerMessage = {
  type: 'orderbook' | 'gasprice';
  data: any;
};

type OrderBookData = {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
};

type OrderBookProps = {
  blockchainName: string;
};

// Boilerplate data for realistic order book simulation
const getBoilerplateData = (blockchainName: string) => {
  let basePrice: number;
  let spread: number;
  
  switch (blockchainName) {
    case "Ethereum":
      basePrice = 3200; // ETH ~$3200
      spread = 0.5; // Reduced spread for more realistic data
      break;
    case "Polygon":
      basePrice = 0.85; // MATIC ~$0.85
      spread = 0.0005; // Reduced spread
      break;
    case "Arbitrum":
      basePrice = 1.20; // ARB ~$1.20
      spread = 0.001; // Reduced spread
      break;
    default:
      basePrice = 3200;
      spread = 0.5;
  }
  
  const generateOrders = (isAsk: boolean, count: number) => {
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
      const priceOffset = (i + 1) * (spread / 20); // Reduced variation
      const price = isAsk ? basePrice + priceOffset : basePrice - priceOffset;
      
      let amount: number;
      if (blockchainName === "Ethereum") {
        amount = Math.random() * 20 + 15; // 15-35 ETH (more realistic)
      } else if (blockchainName === "Polygon") {
        amount = Math.random() * 50000 + 50000; // 50k-100k MATIC
      } else if (blockchainName === "Arbitrum") {
        amount = Math.random() * 20000 + 20000; // 20k-40k ARB
      } else {
        amount = Math.random() * 20 + 15;
      }
      
      const decimalPlaces = blockchainName === "Ethereum" ? 2 : 4;
      orders.push({
        price: parseFloat(price.toFixed(decimalPlaces)),
        amount: parseFloat(amount.toFixed(2))
      });
    }
    return orders;
  };

  const decimalPlaces = blockchainName === "Ethereum" ? 2 : 4;
  return {
    asks: generateOrders(true, 10),
    bids: generateOrders(false, 10),
    lastPrice: parseFloat(basePrice.toFixed(decimalPlaces))
  };
};

const OrderBook: React.FC<OrderBookProps> = ({ blockchainName }) => {
  const [bids, setBids] = useState<Map<number, number>>(new Map());
  const [asks, setAsks] = useState<Map<number, number>>(new Map());
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [boilerplateData] = useState(() => getBoilerplateData(blockchainName));
  
  // Use refs to track state that shouldn't cause re-renders
  const hasReceivedRealDataRef = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let symbol: string;
    switch (blockchainName) {
      case "Ethereum":
        symbol = "ethusdt";
        break;
      case "Polygon":
        symbol = "maticusdt";
        break;
      case "Arbitrum":
        symbol = "arbusdt";
        break;
      default:
        symbol = "ethusdt";
    }
    
    // Try local server first, then fallback to direct Binance connection
    const localWsUrl = "ws://localhost:4000";
    const binanceWsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    
    let useLocalServer = true;
    let connectionTimeout: NodeJS.Timeout;

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    const connectToServer = () => {
      const wsUrl = useLocalServer ? localWsUrl : binanceWsUrl;
      
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        // Set connection timeout
        connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.log("Connection timeout, trying fallback...");
            ws.close();
          }
        }, 5000); // 5 second timeout

        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          if (useLocalServer) {
            console.log(`Connected to local server for ${symbol}`);
            setIsConnected(true);
            
            // Subscribe to order book updates for this symbol
            ws.send(JSON.stringify({
              type: 'subscribe_orderbook',
              symbol: symbol
            }));
          } else {
            console.log(`Connected directly to Binance for ${symbol}`);
            setIsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          try {
            if (useLocalServer) {
              const message: ServerMessage = JSON.parse(event.data);
              
              if (message.type === 'orderbook') {
                const orderBookData: OrderBookData = message.data;
                
                // Only process data for our symbol
                if (orderBookData.symbol === symbol) {
                  // Mark that we've received real data
                  hasReceivedRealDataRef.current = true;
                  console.log(`Received real order book data for ${symbol}`);

                  // Update bids
                  const newBids = new Map<number, number>();
                  orderBookData.bids.forEach(([priceStr, amountStr]) => {
                    const price = parseFloat(priceStr);
                    const amount = parseFloat(amountStr);
                    newBids.set(price, amount);
                  });
                  setBids(newBids);

                  // Update asks
                  const newAsks = new Map<number, number>();
                  orderBookData.asks.forEach(([priceStr, amountStr]) => {
                    const price = parseFloat(priceStr);
                    const amount = parseFloat(amountStr);
                    newAsks.set(price, amount);
                  });
                  setAsks(newAsks);
                }
              }
            } else {
              // Direct Binance connection (fallback)
              const data = JSON.parse(event.data);
              
              // Mark that we've received real data
              hasReceivedRealDataRef.current = true;
              console.log(`Received real data from Binance for ${symbol}`);

              setBids((prevBids) => {
                const newBids = new Map(prevBids);
                data.b.forEach(([priceStr, amountStr]: [string, string]) => {
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
                data.a.forEach(([priceStr, amountStr]: [string, string]) => {
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
            }
          } catch (error) {
            console.error("Error parsing server message:", error);
          }
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("WebSocket error:", error);
          setIsConnected(false);
          
          if (useLocalServer) {
            console.log("Local server not available, trying direct Binance connection...");
            useLocalServer = false;
            setTimeout(() => {
              connectToServer();
            }, 1000);
          }
        };

        ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket disconnected for ${symbol}`, event.code, event.reason);
          setIsConnected(false);
          
          // If local server connection was closed unexpectedly, try Binance
          if (useLocalServer && event.code !== 1000) {
            console.log("Local server connection closed, trying direct Binance connection...");
            useLocalServer = false;
            setTimeout(() => {
              connectToServer();
            }, 1000);
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        setIsConnected(false);
        
        if (useLocalServer) {
          console.log("Failed to create local server connection, trying direct Binance connection...");
          useLocalServer = false;
          setTimeout(() => {
            connectToServer();
          }, 1000);
        }
      }
    };

    // Add a small delay to ensure server is ready
    setTimeout(() => {
      connectToServer();
    }, 100);

    return () => {
      clearTimeout(connectionTimeout);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [blockchainName]); // Only depend on blockchainName

  useEffect(() => {
    if (!hasReceivedRealDataRef.current) {
      // Use boilerplate data only if we haven't received real data
      setLastPrice(boilerplateData.lastPrice);
    } else {
      // Calculate last price from the updated bids and asks
      const sortedBids = Array.from(bids.entries()).sort((a, b) => b[0] - a[0]);
      const sortedAsks = Array.from(asks.entries()).sort((a, b) => a[0] - b[0]);

      if (sortedBids.length > 0 && sortedAsks.length > 0) {
        const midPrice = (sortedBids[0][0] + sortedAsks[0][0]) / 2;
        setLastPrice(parseFloat(midPrice.toFixed(blockchainName === "Ethereum" ? 2 : 4)));
      } else {
        setLastPrice(null);
      }
    }
  }, [bids, asks, boilerplateData.lastPrice, blockchainName]);

  // Determine which data to display
  const displayBids = !hasReceivedRealDataRef.current 
    ? boilerplateData.bids
    : Array.from(bids.entries())
        .map(([price, amount]) => ({ price, amount }))
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);

  const displayAsks = !hasReceivedRealDataRef.current
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
