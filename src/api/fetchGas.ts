import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { formatUnits } from "ethers";

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

// Config
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const POLL_INTERVAL = 1000;

const ARB_URL = process.env.ARB_NODE_URL;
const ETH_URL =
  process.env.ETH_NODE_URL || "https://mainnet.infura.io/v3/your-key";
const POL_URL = process.env.POL_NODE_URL;

if (!ARB_URL || !POL_URL) {
  throw new Error(
    "Missing required environment variables: ARB_NODE_URL, POL_NODE_URL"
  );
}

// Express setup
const app = express();
app.get("/", (_, res) => {
  res.send("WebSocket server is running 🚀");
});

const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

// WebSocket connection handling
wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
  });

  // Send initial data
  getGasPrices().then((data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
});

// Fetch gas price for a specific chain
async function fetchGasPrice(chain: string, url: string): Promise<string> {
  const requestBody: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 1,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: JsonRpcResponse = await response.json();

    if (!data.result) {
      throw new Error("Invalid JSON-RPC response");
    }

    return parseFloat(formatUnits(data.result, "gwei")).toFixed(9);
  } catch {
    return "0";
  }
}

// Get all gas prices
async function getGasPrices(): Promise<GasPriceData> {
  try {
    const [arbitrum, ethereum, polygon] = await Promise.all([
      fetchGasPrice("Arbitrum", ARB_URL!),
      fetchGasPrice("Ethereum", ETH_URL),
      fetchGasPrice("Polygon", POL_URL!),
    ]);

    return {
      arbitrum,
      ethereum,
      polygon,
      timestamp: Date.now(),
    };
  } catch {
    return {
      arbitrum: "0",
      ethereum: "0",
      polygon: "0",
      timestamp: Date.now(),
    };
  }
}

// Broadcast to all clients
function broadcastGasPrices(data: GasPriceData) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Poll prices
async function pollGasPrices() {
  try {
    const gasPrices = await getGasPrices();
    broadcastGasPrices(gasPrices);
  } catch {}
}

setInterval(pollGasPrices, POLL_INTERVAL);

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  clients.forEach((client) => client.close());
  server.close(() => process.exit(0));
});