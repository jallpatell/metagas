// server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fetchEthGas from '@/app/api/fetchEthGas';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // adjust in prod
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected');

  const interval = setInterval(async () => {
    const gasPrice = await fetchEthGas();
    if (gasPrice) {
      socket.emit('gasPrice', gasPrice.toString()); // Send to frontend
    }
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
