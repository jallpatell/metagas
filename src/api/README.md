# MetaGas Server with Shared Order Book Data

This server provides shared order book data across all clients, ensuring that multiple users see the same live data feed.

## Features

- **Shared Order Book Data**: All clients see the same live order book data
- **Real-time Updates**: Live data from Binance WebSocket streams
- **Multiple Blockchains**: Support for Ethereum, Polygon, and Arbitrum
- **Persistent Data**: Data persists on the server, not individual clients

## Setup

1. **Install Dependencies**:
   ```bash
   cd src/api
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with:
   ```
   ARB_NODE_URL=your_arbitrum_node_url
   POL_NODE_URL=your_polygon_node_url
   ETH_NODE_URL=your_ethereum_node_url
   PORT=4000
   ```

3. **Build the Server**:
   ```bash
   npm run build
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

   Or for development:
   ```bash
   npm run dev
   ```

## How It Works

1. **Server Connects to Binance**: The server connects to Binance WebSocket streams for each blockchain
2. **Data Processing**: Order book data is processed and stored server-side
3. **Client Subscriptions**: Clients connect to the server and subscribe to specific symbols
4. **Shared Broadcasting**: All subscribed clients receive the same live data updates

## Architecture

- **fetchGas.ts**: Main server with WebSocket handling and gas price polling
- **orderbookService.ts**: Binance WebSocket connections and order book processing
- **Frontend**: Updated to connect to server instead of directly to Binance

## Benefits

- ✅ **Consistent Data**: All users see the same order book data
- ✅ **Reduced Load**: Single connection to Binance instead of multiple
- ✅ **Better Performance**: Server-side data processing
- ✅ **Scalable**: Can handle multiple clients efficiently

## API Endpoints

- `GET /`: Health check
- `WS /`: WebSocket connection for real-time data

## WebSocket Messages

### Client to Server:
```json
{
  "type": "subscribe_orderbook",
  "symbol": "ethusdt"
}
```

### Server to Client:
```json
{
  "type": "orderbook",
  "data": {
    "symbol": "ethusdt",
    "bids": [["3200.50", "10.5"], ...],
    "asks": [["3201.00", "8.2"], ...],
    "timestamp": 1234567890
  }
}
```

## Deployment

The server can be deployed to any Node.js hosting platform (Heroku, Railway, etc.) and the frontend WebSocket URL should be updated accordingly.
