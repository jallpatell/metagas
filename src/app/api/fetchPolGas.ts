"use client"
import dotenv from 'dotenv'
import { WebSocketServer } from 'ws'
import http from 'http'
import { formatUnits } from 'ethers'
dotenv.config() 

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

const url = process.env.POL_NODE_URL
const PORT = 4002
const server = http.createServer();
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('🔌Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('❌Client disconnected');
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

    const gasPriceWei = data.result; // string in wei
    const gasPriceGWei = formatUnits(gasPriceWei, 'gwei'); // specify 'gwei' for correct unit conversion
    const gasPriceFixed = parseFloat(gasPriceGWei).toFixed(9);

    console.log(`Polygon Gas Price: ${gasPriceFixed} GWei`);

    // Send to all connected clients
    const payload = JSON.stringify({ gasPrice: gasPriceFixed });
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });

  } catch (error) {
    console.error("Error fetching gas price:", error);
  }
}

// Poll every 1 second(s)
setInterval(getGasPrice, 1000);

// Start server
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});