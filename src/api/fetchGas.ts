import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

/** Server config */
const PORT = parseInt(process.env.PORT || '4000', 10);
const WS_AUTH_TOKEN = process.env.WS_AUTH_TOKEN || '';
const USE_AUTH = !!WS_AUTH_TOKEN; // Enable auth if token exists

/** Order book fetching from Binance (no changes) */
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

  constructor(private broadcastFn: (type: string, data: any) => void) {
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

    this.broadcastFn('orderbook', { symbol, bids, asks, timestamp: Date.now() });
  }

  public closeAll() {
    this.connections.forEach((ws) => ws.close());
    this.connections.clear();
  }
}

// --- WebSocket Server Section --- //

/** Create HTTP server (for health checks and ws upgrade) */
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'MetaGas WS API alive.' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found.' }));
});

const wss = new WebSocketServer({ server });

function broadcast(type: string, data: any) {
  const payload = JSON.stringify({ type, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // Optionally, only send to authorized clients (with .isAuthed)
      if (!USE_AUTH || (client as any).isAuthed) {
        client.send(payload);
      }
    }
  });
}

const orderBookService = new OrderBookService(broadcast);

wss.on('connection', (ws, req) => {
  if (USE_AUTH) {
    // Simple API token authentication: require token header or initial message
    let authed = false;
    let token = '';
    // Try header first (for custom ws clients)
    if (req.headers['sec-websocket-protocol']) {
      token = req.headers['sec-websocket-protocol'].split(',')[0].trim();
      if (token === WS_AUTH_TOKEN) authed = true;
    }
    // Fallback: wait for client to send token as first message (for browsers)
    if (!authed) {
      ws.once('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'auth' && msg.token === WS_AUTH_TOKEN) {
            (ws as any).isAuthed = true;
            ws.send(JSON.stringify({ type: 'auth', status: 'ok' }));
          } else {
            ws.send(JSON.stringify({ type: 'auth', status: 'error', error: 'Invalid token' }));
            ws.close();
          }
        } catch {
          ws.send(JSON.stringify({ type: 'auth', status: 'error', error: 'Malformed auth' }));
          ws.close();
        }
      });
      return;
    }
    (ws as any).isAuthed = authed;
  }

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to MetaGas real-time WS.' }));

  ws.on('close', () => {
    // Cleanup, log out, or similar if needed
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down order book service...');
  orderBookService.closeAll();
  server.close(() => process.exit(0));
});

server.listen(PORT, () => {
  console.log(`🚀 MetaGas backend listening on port ${PORT}`);
  if (USE_AUTH)
    console.log('🔐 WebSocket AUTH required. Set WS_AUTH_TOKEN for clients.');
  else
    console.log('⚠️ WebSocket backend is PUBLIC for real-time data.');
});

export default orderBookService;
