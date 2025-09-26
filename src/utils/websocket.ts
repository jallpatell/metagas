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

// Prefer env-configured remote URL in production; use localhost only during local development
const LOCAL_WS_URL = "ws://localhost:4000";
const REMOTE_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://metagas.onrender.com";

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
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.'));
    const wsUrl = isLocal ? (retryCount === 0 ? LOCAL_WS_URL : REMOTE_WS_URL) : REMOTE_WS_URL;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected to ${isLocal && retryCount === 0 ? 'local' : 'remote'} server`);
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
        } else if (!isLocal || retryCount > 0) {
          // If using remote server (production) and message is raw
          const data: GasPriceData = message as any;
          setGasPrices(data);
          setCachedGasPrices(data);
        }
      } catch (error) {
        console.error("Error parsing server message:", error);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected from ${isLocal && retryCount === 0 ? 'local' : 'remote'} server`);
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (isLocal && retryCount === 0) {
        console.log("Local server not available, trying remote server...");
        setRetryCount(1);
      } else {
        console.log("WebSocket server unavailable");
      }
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [retryCount]);

  return gasPrices;
};
