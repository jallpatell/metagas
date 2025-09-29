// src/api/orderbookBridge.ts
import { WebSocket } from 'ws';

export type OrderBookData = {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
};

// WebSocket connections subscribed per symbol
const orderBookConnections = new Map<string, Set<WebSocket>>();
// Server-side snapshot map
const orderBookDataMap = new Map<string, OrderBookData>();

export function initializeOrderBookSymbols(symbols: string[]) {
  symbols.forEach(s => {
    if (!orderBookConnections.has(s)) orderBookConnections.set(s, new Set());
  });
}

export function subscribeClientToSymbol(symbol: string, ws: WebSocket) {
  if (!orderBookConnections.has(symbol)) orderBookConnections.set(symbol, new Set());
  orderBookConnections.get(symbol)!.add(ws);
}

export function removeClientFromAll(ws: WebSocket) {
  orderBookConnections.forEach(set => set.delete(ws));
}

export function getOrderBookSnapshot(symbol: string): OrderBookData | undefined {
  return orderBookDataMap.get(symbol);
}

export function broadcastOrderBook(symbol: string, data: OrderBookData) {
  const payload = JSON.stringify({ type: 'orderbook', data });
  const conns = orderBookConnections.get(symbol);
  if (!conns) return;
  conns.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

export function updateOrderBook(symbol: string, bids: [string, string][], asks: [string, string][]) {
  const data: OrderBookData = { symbol, bids, asks, timestamp: Date.now() };
  orderBookDataMap.set(symbol, data);
  broadcastOrderBook(symbol, data);
}
