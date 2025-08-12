import { WebSocketServer, WebSocket } from "ws";

// Store connected Node.js WebSocket clients
const clients = new Set<WebSocket>();

const wss = new WebSocketServer({ port: 4001 });

wss.on("connection", (ws: WebSocket) => {
  console.log("🔌 Client connected");
  clients.add(ws);

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});

// Example: broadcast to all clients
function broadcastGasPrice(price: string) {
  const data = JSON.stringify({ gasPrice: price });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export { wss, broadcastGasPrice };
