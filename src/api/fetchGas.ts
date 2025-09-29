// src/api/fetchGas.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { formatUnits } from 'ethers';
import { initializeOrderBookSymbols, subscribeClientToSymbol, removeClientFromAll, getOrderBookSnapshot, updateOrderBook, OrderBookData } from './orderbookBridge';
import './orderbookService'; // ensures orderbookService starts

dotenv.config();

// Types
type JsonRpcRequest = { jsonrpc: string; method: string; params: string[]; id: number; };
type JsonRpcResponse = { jsonrpc: string; id: number; result: string; };

export type GasPriceData = { arbitrum: string; ethereum: string; polygon: string; timestamp: number; };

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const POLL_INTERVAL = 1000;
const HISTORY_WINDOW_MS = (process.env.GAS_HISTORY_MINUTES ? parseInt(process.env.GAS_HISTORY_MINUTES, 10) : 12) * 60 * 1000;

const ARB_URL = process.env.ARB_NODE_URL;
const ETH_URL = process.env.ETH_NODE_URL || 'https://mainnet.infura.io/v3/your-key';
const POL_URL = process.env.POL_NODE_URL;

if (!ARB_URL || !POL_URL) {
  throw new Error('Missing required environment variables: ARB_NODE_URL, POL_NODE_URL');
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();
const gasHistory: { time: number; arbitrum: number; ethereum: number; polygon: number }[] = [];

initializeOrderBookSymbols(['ethusdt', 'maticusdt', 'arbusdt']);

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') res.sendStatus(200); else next();
});

app.get('/', (_req: Request, res: Response) => res.send('WebSocket server is running 🚀'));

app.get('/gas/history', (req: Request, res: Response) => {
  const minutesParam = parseInt((req.query.minutes as string) || '', 10);
  const windowMs = (!isNaN(minutesParam) && minutesParam > 0 ? minutesParam : HISTORY_WINDOW_MS / (60 * 1000)) * 60 * 1000;
  const cutoffSec = Math.floor((Date.now() - windowMs) / 1000);
  const historySlice = gasHistory.filter(p => p.time >= cutoffSec);
  res.json({ history: historySlice });
});

app.get('/orderbook/:symbol', (req: Request, res: Response) => {
  const symbol = (req.params.symbol || '').toLowerCase();
  const data = getOrderBookSnapshot(symbol);
  if (!data) return res.status(404).json({ error: 'No data for symbol' });
  res.json(data);
});

wss.on('connection', (ws: WebSocket) => {
  console.log('🔄 New WebSocket client connected');
  clients.add(ws);

  ws.on('message', (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed?.type === 'subscribe_orderbook' && typeof parsed.symbol === 'string') {
        const symbol = parsed.symbol.toLowerCase();
        subscribeClientToSymbol(symbol, ws);
        const snapshot = getOrderBookSnapshot(symbol);
        if (snapshot && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'orderbook', data: snapshot }));
      }
    } catch (err) {
      console.error('Error parsing client message:', err, message);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    removeClientFromAll(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket client error:', err);
  });

  // send immediate gas price snapshot
  getGasPrices().then(data => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'gasprice', data }));
  });
});

async function fetchGasPrice(url: string): Promise<string> {
  const requestBody: JsonRpcRequest = { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 };
  try {
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data: JsonRpcResponse = await resp.json();
    return parseFloat(formatUnits(data.result, 'gwei')).toFixed(9);
  } catch {
    return '0';
  }
}

async function getGasPrices(): Promise<GasPriceData> {
  try {
    const [arbitrum, ethereum, polygon] = await Promise.all([fetchGasPrice(ARB_URL!), fetchGasPrice(ETH_URL), fetchGasPrice(POL_URL!)]);
    return { arbitrum, ethereum, polygon, timestamp: Date.now() };
  } catch {
    return { arbitrum: '0', ethereum: '0', polygon: '0', timestamp: Date.now() };
  }
}

function appendGasHistoryPoint(data: GasPriceData) {
  gasHistory.push({
    time: Math.floor(data.timestamp / 1000),
    arbitrum: parseFloat(data.arbitrum) || 0,
    ethereum: parseFloat(data.ethereum) || 0,
    polygon: parseFloat(data.polygon) || 0,
  });
  const cutoff = Date.now() - HISTORY_WINDOW_MS;
  while (gasHistory.length && gasHistory[0].time * 1000 < cutoff) gasHistory.shift();
}

function broadcastGasPrices(data: GasPriceData) {
  const payload = JSON.stringify({ type: 'gasprice', data });
  clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(payload); });
}

setInterval(async () => {
  const gp = await getGasPrices();
  appendGasHistoryPoint(gp);
  broadcastGasPrices(gp);
}, POLL_INTERVAL);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

process.on('SIGINT', () => {
  clients.forEach(ws => ws.close());
  server.close(() => process.exit(0));
});
