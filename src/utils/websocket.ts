import { useEffect, useState } from "react";

interface GasPriceData {
  arbitrum: string;
  ethereum: string;
  polygon: string;
  timestamp: number;
}

type ServerMessage = {
  type: 'orderbook' | 'gasprice';
  data: any;
};

// Use environment variable or fallback to localhost for development
const LOCAL_WS_URL = "ws://localhost:4000";
const REMOTE_WS_URL = "wss://metagas.onrender.com/";

export const useGasPriceFeed = () => {
  const [gasPrices, setGasPrices] = useState<GasPriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Try local server first, then fallback to remote
    const wsUrl = retryCount === 0 ? LOCAL_WS_URL : REMOTE_WS_URL;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected to ${retryCount === 0 ? 'local' : 'remote'} server`);
      setIsConnected(true);
      setRetryCount(0); // Reset retry count on successful connection
    };

    ws.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        
        if (message.type === 'gasprice') {
          const data: GasPriceData = message.data;
          setGasPrices(data);
        } else if (retryCount > 0) {
          // If using remote server, handle the old format
          const data: GasPriceData = message as any;
          setGasPrices(data);
        }
        // Order book messages are handled by the OrderBook component
      } catch (error) {
        console.error("Error parsing server message:", error);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected from ${retryCount === 0 ? 'local' : 'remote'} server`);
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      
      if (retryCount === 0) {
        console.log("Local server not available, trying remote server...");
        setRetryCount(1);
      } else {
        console.log("Both local and remote servers unavailable");
      }
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [retryCount]);

  return gasPrices;
};
