ximport dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";
import { formatUnits } from "ethers";


dotenv.config();

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

const url = process.env.POL_NODE_URL!;
const PORT = 4002;

const server = http.createServer();
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();
// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("🔌 Client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});

// Function to broadcast gas price to all clients
function broadcastGasPrice(price: string) {
  const payload = JSON.stringify({ gasPrice: price });
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}

async function getGasPrice(): Promise<void> {
  const requestBody: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 1,
  };

  try {

    // Fetch gas price from Polygon RPC
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data: JsonRpcResponse = await response.json();

    if (!data.result) throw new Error("Invalid JSON-RPC response");

    const gasPriceWei = data.result;
    const gasPriceGWei = formatUnits(gasPriceWei, "gwei");
    const gasPriceFixed = parseFloat(gasPriceGWei).toFixed(9);

    console.log(`Polygon Gas Price: ${gasPriceFixed} GWei`);


    // Broadcast to connected clients
    broadcastGasPrice(gasPriceFixed);
  } catch (error) {
    console.error("Error fetching gas price:", error);
  }
}

// Poll every 1 second
setInterval(getGasPrice, 1000);

server.listen(PORT, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});
