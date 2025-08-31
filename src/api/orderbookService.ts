import WebSocket from 'ws';
import { updateOrderBook } from './fetchGas';

type BinanceDepthStreamMessage = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID in event
  u: number; // Final update ID in event
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
};

class OrderBookService {
  private connections: Map<string, WebSocket> = new Map();
  private orderBookData: Map<string, { bids: Map<number, number>; asks: Map<number, number> }> = new Map();

  constructor() {
    this.initializeConnections();
  }

  private initializeConnections() {
    const symbols = ['ethusdt', 'maticusdt', 'arbusdt'];
    
    symbols.forEach(symbol => {
      this.connectToBinance(symbol);
      this.orderBookData.set(symbol, {
        bids: new Map(),
        asks: new Map()
      });
    });
  }

  private connectToBinance(symbol: string) {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log(`📊 Connected to Binance order book for ${symbol}`);
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const message: BinanceDepthStreamMessage = JSON.parse(data.toString());
        this.processOrderBookUpdate(symbol, message);
      } catch (error) {
        console.error(`Error processing order book message for ${symbol}:`, error);
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${symbol}:`, error);
    });

    ws.on('close', () => {
      console.log(`WebSocket closed for ${symbol}, reconnecting...`);
      setTimeout(() => {
        this.connectToBinance(symbol);
      }, 5000);
    });

    this.connections.set(symbol, ws);
  }

  private processOrderBookUpdate(symbol: string, message: BinanceDepthStreamMessage) {
    const orderBook = this.orderBookData.get(symbol);
    if (!orderBook) return;

    // Update bids
    message.b.forEach(([priceStr, amountStr]) => {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      
      if (amount === 0) {
        orderBook.bids.delete(price);
      } else {
        orderBook.bids.set(price, amount);
      }
    });

    // Update asks
    message.a.forEach(([priceStr, amountStr]) => {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      
      if (amount === 0) {
        orderBook.asks.delete(price);
      } else {
        orderBook.asks.set(price, amount);
      }
    });

    // Convert to arrays and send to server
    const bidsArray: [string, string][] = Array.from(orderBook.bids.entries())
      .sort((a, b) => b[0] - a[0]) // Sort bids descending
      .slice(0, 10) // Take top 10
      .map(([price, amount]) => [price.toString(), amount.toString()]);

    const asksArray: [string, string][] = Array.from(orderBook.asks.entries())
      .sort((a, b) => a[0] - b[0]) // Sort asks ascending
      .slice(0, 10) // Take top 10
      .map(([price, amount]) => [price.toString(), amount.toString()]);

    // Send to server for distribution to all clients
    updateOrderBook(symbol, bidsArray, asksArray);
  }

  public getOrderBook(symbol: string) {
    const orderBook = this.orderBookData.get(symbol);
    if (!orderBook) return null;

    const bidsArray: [string, string][] = Array.from(orderBook.bids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([price, amount]) => [price.toString(), amount.toString()]);

    const asksArray: [string, string][] = Array.from(orderBook.asks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 10)
      .map(([price, amount]) => [price.toString(), amount.toString()]);

    return {
      symbol,
      bids: bidsArray,
      asks: asksArray,
      timestamp: Date.now()
    };
  }

  public closeAll() {
    this.connections.forEach((ws, symbol) => {
      ws.close();
    });
    this.connections.clear();
  }
}

// Start the order book service
const orderBookService = new OrderBookService();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down order book service...');
  orderBookService.closeAll();
  process.exit(0);
});

export default orderBookService;
