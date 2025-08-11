import dotenv from 'dotenv'
import { WebSocketServer } from 'ws'
import { formatUnits } from 'ethers'
import http from 'http'
dotenv.config() 

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

const url = process.env.ETH_NODE_URL
const PORT = 4001
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

    const gasPriceWei = data.result
    const mid = formatUnits(gasPriceWei, 'gwei');
    const gasPriceGWei = parseFloat(mid).toFixed(9);

    console.log(`Ethereum Gas Price: ${gasPriceGWei} Gwei`);

    // Send to all connected clients
    const payload = JSON.stringify({ gasPrice: gasPriceGWei });
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });

  } catch (error) {
    console.error("❌ Error fetching gas price:", error);
  }
}

// Poll every 3 seconds
setInterval(getGasPrice, 1000);

// Start server
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});