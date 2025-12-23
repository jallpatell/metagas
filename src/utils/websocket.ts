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

// Default to local server for cloned repos; remote URL is opt-in via env
const LOCAL_WS_URL = "ws://localhost:4000";
const REMOTE_WS_URL = process.env.NEXT_PUBLIC_WS_URL;
// HTTP fallback URL must be explicitly configured; we don't hard-code a path
const HTTP_FALLBACK_URL = process.env.NEXT_PUBLIC_HTTP_FALLBACK_URL;

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
  const [endpointIndex, setEndpointIndex] = useState(0);
  const [reconnectSeq, setReconnectSeq] = useState(0);
  const [httpFallbackActive, setHttpFallbackActive] = useState(false);

  useEffect(() => {
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    const startHttpPolling = () => {
      if (httpFallbackActive) return;
      if (!HTTP_FALLBACK_URL) {
        console.warn("HTTP fallback URL is not configured; skipping HTTP polling");
        return;
      }
      setHttpFallbackActive(true);
      console.warn("Starting HTTP fallback polling for gas prices");

      const poll = async () => {
        try {
          const response = await fetch(HTTP_FALLBACK_URL, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data: GasPriceData = await response.json();

          if (data?.ethereum && data?.polygon && data?.arbitrum) {
            setGasPrices(data);
            setCachedGasPrices(data);
          } else {
            console.warn("HTTP fallback returned unexpected payload");
          }
        } catch (error) {
          console.error("HTTP fallback polling failed:", error);
        }
      };

      poll(); // immediate attempt
      pollTimer = setInterval(poll, 15000); // 15s cadence
    };

    const isLocalHost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname.startsWith('127.')
    );

    const endpoints = isLocalHost
      ? [LOCAL_WS_URL, REMOTE_WS_URL].filter(Boolean)
      : (REMOTE_WS_URL ? [REMOTE_WS_URL] : [LOCAL_WS_URL]);
    const url = endpoints[Math.min(endpointIndex, endpoints.length - 1)];

    let ws: WebSocket | null = null;
    let connectionTimeout: ReturnType<typeof setTimeout> | undefined;
    let isMounted = true;
    const AUTH_TOKEN = process.env.NEXT_PUBLIC_WS_TOKEN;
    let authSent = false;

    const connect = () => {
      if (!url) {
        console.warn('WebSocket URL is not configured.');
        return;
      }
      ws = new WebSocket(url);
      authSent = false;
      connectionTimeout = setTimeout(() => {
        console.warn(`WebSocket to ${url} timed out, trying fallback`);
        ws?.close();
        if (endpointIndex < endpoints.length - 1) {
          setEndpointIndex((prev) => Math.min(prev + 1, endpoints.length - 1));
        }
      }, 5000);

      ws.onopen = () => {
        if (!isMounted) return;
        clearTimeout(connectionTimeout);
        console.log(`WebSocket connected to ${url}`);
        // --- Authenticate if token is set and not yet sent ---
        if (AUTH_TOKEN && !authSent) {
          try {
            ws?.send(JSON.stringify({ type: 'auth', token: AUTH_TOKEN }));
            authSent = true;
          } catch (err) {
            console.warn('Failed to send auth on ws connect:', err);
          }
        }
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const message: ServerMessage = JSON.parse(event.data);
          if (message.type === 'gasprice') {
            const data: GasPriceData = message.data;
            setGasPrices(data);
            setCachedGasPrices(data);
          } else {
            // Some deployments send the raw object without a wrapper
            const data: GasPriceData = message as any;
            if (data?.ethereum && data?.polygon && data?.arbitrum) {
              setGasPrices(data);
              setCachedGasPrices(data);
            }
          }
        } catch (error) {
          console.error("Error parsing server message:", error);
        }
      };

      const handleErrorOrClose = () => {
        if (!isMounted) return;
        clearTimeout(connectionTimeout);
        if (endpointIndex < endpoints.length - 1) {
          console.log(`Switching WebSocket endpoint (current: ${url})`);
          setEndpointIndex((prev) => Math.min(prev + 1, endpoints.length - 1));
        } else {
          // No other endpoint to try; trigger a reconnect attempt on the same URL
          setTimeout(() => {
            setReconnectSeq((prev) => prev + 1);
          }, 2000);
          // Also start HTTP polling as a safety net
          startHttpPolling();
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        handleErrorOrClose();
      };

      ws.onclose = () => {
        console.log(`WebSocket disconnected from ${url}`);
        handleErrorOrClose();
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (connectionTimeout) clearTimeout(connectionTimeout);
      ws?.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [endpointIndex, reconnectSeq, httpFallbackActive]);

  return gasPrices;
};
