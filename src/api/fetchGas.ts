import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { formatUnits } from "ethers";
import './orderbookService'; // Start the order book service

dotenv.config();

// Types
type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params: string[];
  id: number;
};

type JsonRpcResponse = {
  jsonrpc: string;
  id: number;
  result: string;
};

type GasPriceData = {
  arbitrum: string;
  ethereum: string;
  polygon: string;
  timestamp: number;
};

type OrderBookData = {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
};

type OrderBookMessage = {
  type: 'orderbook';
  data: OrderBookData;
};

type GasPriceMessage = {
  type: 'gasprice';
  data: GasPriceData;
};

type ClientMessage = {
  type: 'subscribe_orderbook';
  symbol: string;
};

// Config
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const POLL_INTERVAL = 1000;
const HISTORY_WINDOW_MS =
  (process.env.GAS_HISTORY_MINUTES ? parseInt(process.env.GAS_HISTORY_MINUTES, 10) : 12) * 60 * 1000;

const ARB_URL = process.env.ARB_NODE_URL;
const ETH_URL = process.env.ETH_NODE_URL || "https://mainnet.infura.io/v3/your-key";
const POL_URL = process.env.POL_NODE_URL;

if (!ARB_URL || !POL_URL) {
  throw new Error("Missing required environment variables: ARB_NODE_URL, POL_NODE_URL");
}

// Server-side order book storage
const orderBookDataMap = new Map<string, OrderBookData>();
const orderBookConnections = new Map<string, Set<WebSocket>>();

// Server-side gas price history (rolling window)
type GasHistoryPoint = {
  time: number; // seconds since epoch
  arbitrum: number;
  ethereum: number;
  polygon: number;
};
const gasHistory: GasHistoryPoint[] = [];

// Express setup
const app = express();

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("WebSocket server is running 🚀");
});

app.get("/gas/history", (req: Request, res: Response) => {
  const minutesParam = parseInt((req.query.minutes as string) || "", 10);
  const windowMs =
    (!isNaN(minutesParam) && minutesParam > 0 ? minutesParam : HISTORY_WINDOW_MS / (60 * 1000)) * 60 * 1000;
  const cutoffSec = Math.floor((Date.now() - windowMs) / 1000);
  const historySlice = gasHistory.filter(p => p.time >= cutoffSec);
  res.json({ history: historySlice });
});

app.get("/orderbook/:symbol", (req: Request, res: Response) => {
  const symbol = (req.params.symbol || "").toLowerCase();
  const data = orderBookDataMap.get(symbol);
  if (!data) return res.status(404).json({ error: "No data for symbol" });
  res.json(data);
});

// HTTP + WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

// WebSocket handling
wss.on("connection", (ws: WebSocket) => {
  console.log("🔄 New WebSocket client connected");
  clients.add(ws);

  ws.on("message", (message: string) => {
    try {
      const data: ClientMessage = JSON.parse(message);
      if (data.type === 'subscribe_orderbook') {
        if (!orderBookConnections.has(data.symbol)) {
          orderBookConnections.set(data.symbol, new Set());
        }
        orderBookConnections.get(data.symbol)!.add(ws);

        const currentData = orderBookDataMap.get(data.symbol);
        if (currentData && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'orderbook', data: currentData }));
        }
      }
    } catch (error) {
      console.error("❌ Error parsing client message:", error);
      console.error("Raw message:", message);
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket client disconnected");
    clients.delete(ws);
    orderBookConnections.forEach(connections => connections.delete(ws));
  });

  ws.on("error", (error: Error) => {
    console.error("❌ WebSocket error:", error);
  });

  getGasPrices().then((data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'gasprice', data }));
    }
  });
});

// Fetch gas price for a specific chain
async function fetchGasPrice(chain: string, url: string): Promise<string> {
  const requestBody: JsonRpcRequest = { jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 };

  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: JsonRpcResponse = await response.json();
    if (!data.result) throw new Error("Invalid JSON-RPC response");

    return parseFloat(formatUnits(data.result, "gwei")).toFixed(9);
  } catch {
    return "0";
  }
}

// Gas history handling
function appendGasHistoryPoint(data: GasPriceData) {
  const point: GasHistoryPoint = {
    time: Math.floor(data.timestamp / 1000),
    arbitrum: parseFloat(data.arbitrum) || 0,
    ethereum: parseFloat(data.ethereum) || 0,
    polygon: parseFloat(data.polygon) || 0,
  };
  gasHistory.push(point);

  const cutoff = Date.now() - HISTORY_WINDOW_MS;
  while (gasHistory.length && gasHistory[0].time * 1000 < cutoff) {
    gasHistory.shift();
  }
}

async function getGasPrices(): Promise<GasPriceData> {
  try {
    const [arbitrum, ethereum, polygon] = await Promise.all([
      fetchGasPrice("Arbitrum", ARB_URL!),
      fetchGasPrice("Ethereum", ETH_URL),
      fetchGasPrice("Polygon", POL_URL!),
    ]);

    return { arbitrum, ethereum, polygon, timestamp: Date.now() };
  } catch {
    return { arbitrum: "0", ethereum: "0", polygon: "0", timestamp: Date.now() };
  }
}

// Broadcast functions
function broadcastGasPrices(data: GasPriceData) {
  const payload = JSON.stringify({ type: 'gasprice', data });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

function broadcastOrderBook(symbol: string, data: OrderBookData) {
  const payload = JSON.stringify({ type: 'orderbook', data });
  const connections = orderBookConnections.get(symbol);
  connections?.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

// Order book update
function updateOrderBook(symbol: string, bids: [string, string][], asks: [string, string][]) {
  const orderBookData: OrderBookData = { symbol, bids, asks, timestamp: Date.now() };
  orderBookDataMap.set(symbol, orderBookData);
  broadcastOrderBook(symbol, orderBookData);
}

// Polling
async function pollGasPrices() {
  try {
    const gasPrices = await getGasPrices();
    appendGasHistoryPoint(gasPrices);
    broadcastGasPrices(gasPrices);
  } catch {}
}

// Initialize order book connections
function initializeOrderBookConnections() {
  ['ethusdt', 'maticusdt', 'arbusdt'].forEach(symbol => {
    if (!orderBookConnections.has(symbol)) orderBookConnections.set(symbol, new Set());
  });
}

// Start polling and server
setInterval(pollGasPrices, POLL_INTERVAL);
initializeOrderBookConnections();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  console.log(`📊 Order book data will be shared across all clients`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  clients.forEach(client => client.close());
  server.close(() => process.exit(0));
});

export { updateOrderBook };
