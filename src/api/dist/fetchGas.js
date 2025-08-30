"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = require("ws");
const ethers_1 = require("ethers");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
// Configuration
const PORT = 4000;
const POLL_INTERVAL = 1000;
const ARB_URL = process.env.ARB_NODE_URL;
const ETH_URL = process.env.ETH_NODE_URL || 'https://mainnet.infura.io/v3/your-key';
const POL_URL = process.env.POL_NODE_URL;
if (!ARB_URL || !POL_URL) {
    throw new Error('Missing required environment variables: ARB_NODE_URL, POL_NODE_URL');
}
// Server setup
const server = http_1.default.createServer();
const wss = new ws_1.WebSocketServer({ server });
const clients = new Set();
// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
    clients.add(ws);
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
    // Send initial data on connection
    getGasPrices().then(data => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    });
});
// Function to fetch gas price from a specific chain
async function fetchGasPrice(chain, url) {
    const requestBody = {
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 1
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.result) {
            throw new Error("Invalid JSON-RPC response");
        }
        return parseFloat((0, ethers_1.formatUnits)(data.result, 'gwei')).toFixed(9);
    }
    catch (error) {
        console.error(`Error fetching ${chain} gas price:`, error);
        return "0"; // Return a default value or handle error as needed
    }
}
// Function to get all gas prices
async function getGasPrices() {
    try {
        // Fetch all gas prices in parallel
        const [arbitrum, ethereum, polygon] = await Promise.all([
            fetchGasPrice('Arbitrum', ARB_URL),
            fetchGasPrice('Ethereum', ETH_URL),
            fetchGasPrice('Polygon', POL_URL)
        ]);
        return {
            arbitrum,
            ethereum,
            polygon,
            timestamp: Date.now()
        };
    }
    catch (error) {
        console.error('Error fetching gas prices:', error);
        return {
            arbitrum: "0",
            ethereum: "0",
            polygon: "0",
            timestamp: Date.now()
        };
    }
}
// Function to broadcast gas prices to all clients
function broadcastGasPrices(data) {
    const payload = JSON.stringify(data);
    clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    });
}
// Poll for gas prices
async function pollGasPrices() {
    try {
        const gasPrices = await getGasPrices();
        console.log(`Gas Prices - Arbitrum: ${gasPrices.arbitrum} Gwei, Ethereum: ${gasPrices.ethereum} Gwei, Polygon: ${gasPrices.polygon} Gwei`);
        broadcastGasPrices(gasPrices);
    }
    catch (error) {
        console.error('Error in pollGasPrices:', error);
    }
}
// Start polling
setInterval(pollGasPrices, POLL_INTERVAL);
// Start WebSocket server
server.listen(PORT, () => {
    console.log(`Consolidated WebSocket server running at ws://localhost:${PORT}`);
    console.log('Polling gas prices every second...');
});
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    clients.forEach(client => client.close());
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
