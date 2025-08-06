import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { formatUnits } from 'ethers';
import http from 'http';

dotenv.config();

type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
};

type JsonRpcResponse = {
  jsonrpc: string;
  id: number;
  result: string;
};

const url = process.env.ARB_NODE_URL; // Make sure this is set correctly in your .env
const PORT = 4005;

const server = http.createServer();
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients.delete(ws);
  });
});

async function getGasPrice(): Promise<void> {
  const requestBody: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 1
  };

  try {
    const response = await fetch(url!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data: JsonRpcResponse = await response.json();
    if (!data.result) throw new Error("Invalid JSON-RPC response");

    const gasPriceGwei = parseFloat(formatUnits(data.result, 'gwei')).toFixed(9);

    console.log(`⛽ Arbitrum Gas Price: ${gasPriceGwei} Gwei`);

    const payload = JSON.stringify({ gasPrice: gasPriceGwei });
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });

  } catch (error) {
    console.error("❌ Error fetching gas price:", error);
  }
}

// Poll every second
setInterval(getGasPrice, 1000);

// Start WebSocket server
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});
