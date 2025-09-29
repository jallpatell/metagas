import WebSocket from 'ws';
import { updateOrderBook } from './fetchGas';

type BinanceDepthStreamMessage = {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
};

class OrderBookService {
  private connections = new Map<string, WebSocket>();
  private orderBookData = new Map<string, { bids: Map<number, number>; asks: Map<number, number> }>();
  private retryIntervals = new Map<string, number>();

  private readonly symbols = ['ethusdt', 'maticusdt', 'arbusdt'];
  private readonly baseRetryMs = 5000;
  private readonly maxRetryMs = 60000;

  constructor() {
    this.symbols.forEach((symbol) => {
      this.orderBookData.set(symbol, { bids: new Map(), asks: new Map() });
      this.connectToBinance(symbol);
    });
  }

  private connectToBinance(symbol: string) {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log(`📊 Connected to Binance order book for ${symbol}`);
      this.retryIntervals.set(symbol, this.baseRetryMs);
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const msg: BinanceDepthStreamMessage = JSON.parse(data.toString());
        this.processOrderBookUpdate(symbol, msg);
      } catch (err) {
        console.error(`Error processing order book for ${symbol}:`, err);
      }
    });

    ws.on('close', () => {
      console.warn(`WebSocket closed for ${symbol}, reconnecting...`);
      this.scheduleReconnect(symbol);
    });

    ws.on('error', (err) => console.error(`WebSocket error for ${symbol}:`, err));
    this.connections.set(symbol, ws);
  }

  private scheduleReconnect(symbol: string) {
    const current = this.retryIntervals.get(symbol) || this.baseRetryMs;
    const next = Math.min(current * 2, this.maxRetryMs);

    setTimeout(() => this.connectToBinance(symbol), current);
    this.retryIntervals.set(symbol, next);
  }

  private processOrderBookUpdate(symbol: string, msg: BinanceDepthStreamMessage) {
    const orderBook = this.orderBookData.get(symbol);
    if (!orderBook) return;

    msg.b.forEach(([priceStr, amountStr]) => {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      if (amount === 0) orderBook.bids.delete(price);
      else orderBook.bids.set(price, amount);
    });

    msg.a.forEach(([priceStr, amountStr]) => {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      if (amount === 0) orderBook.asks.delete(price);
      else orderBook.asks.set(price, amount);
    });

    const bids = Array.from(orderBook.bids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([p, a]) => [p.toString(), a.toString()] as [string, string]);

    const asks = Array.from(orderBook.asks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 10)
      .map(([p, a]) => [p.toString(), a.toString()] as [string, string]);

    updateOrderBook(symbol, bids, asks);
  }

  public closeAll() {
    this.connections.forEach((ws) => ws.close());
    this.connections.clear();
  }
}

const orderBookService = new OrderBookService();

process.on('SIGINT', () => {
  console.log('Shutting down order book service...');
  orderBookService.closeAll();
  process.exit(0);
});

export default orderBookService;
