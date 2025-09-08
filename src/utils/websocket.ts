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

const LOCAL_WS_URL = "ws://localhost:4000";
const REMOTE_WS_URL = "wss://metagas.onrender.com/";

function getCachedGasPrices(): GasPriceData | null {
  try {
    const cached = localStorage.getItem('gas_prices');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}
  return null;
}

function setCachedGasPrices(data: GasPriceData) {
  try {
    localStorage.setItem('gas_prices', JSON.stringify(data));
  } catch {}
}

export const useGasPriceFeed = () => {
  // Try to get cached prices immediately
  const [gasPrices, setGasPrices] = useState<GasPriceData | null>(() => getCachedGasPrices());
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const wsUrl = retryCount === 0 ? LOCAL_WS_URL : REMOTE_WS_URL;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected to ${retryCount === 0 ? 'local' : 'remote'} server`);
      setIsConnected(true);
      setRetryCount(0);
    };

    ws.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        if (message.type === 'gasprice') {
          const data: GasPriceData = message.data;
          setGasPrices(data);
          setCachedGasPrices(data);
        } else if (retryCount > 0) {
          // If using remote server, handle the old format
          const data: GasPriceData = message as any;
          setGasPrices(data);
          setCachedGasPrices(data);
        }
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
