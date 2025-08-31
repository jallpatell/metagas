import { useEffect, useState } from "react";

interface GasPriceData {
  arbitrum: string;
  ethereum: string;
  polygon: string;
  timestamp: number;
}

const WS_URL = "wss://metagas.onrender.com/";

export const useGasPriceFeed = () => {
  const [gasPrices, setGasPrices] = useState<GasPriceData | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data: GasPriceData = JSON.parse(event.data);
      setGasPrices(data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return gasPrices;
};
