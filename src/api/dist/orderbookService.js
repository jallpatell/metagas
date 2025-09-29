"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/orderbookService.ts
const ws_1 = __importDefault(require("ws"));
const orderbookBridge_1 = require("./orderbookBridge");
class OrderBookService {
    constructor() {
        this.connections = new Map();
        this.orderBookData = new Map();
        this.retryIntervals = new Map();
        this.symbols = ['ethusdt', 'maticusdt', 'arbusdt'];
        this.baseRetryMs = 5000;
        this.maxRetryMs = 60000;
        this.symbols.forEach(s => this.orderBookData.set(s, { bids: new Map(), asks: new Map() }));
        this.symbols.forEach(s => this.connectToBinance(s));
    }
    connectToBinance(symbol) {
        const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
        const ws = new ws_1.default(wsUrl);
        ws.on('open', () => {
            console.log(`📊 Connected to Binance order book for ${symbol}`);
            this.retryIntervals.set(symbol, this.baseRetryMs);
        });
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                this.processOrderBookUpdate(symbol, msg);
            }
            catch (err) {
                console.error(`Error processing order book for ${symbol}:`, err);
            }
        });
        ws.on('close', () => {
            console.warn(`WebSocket closed for ${symbol}, reconnecting...`);
            this.scheduleReconnect(symbol);
        });
        ws.on('error', (err) => {
            console.error(`WebSocket error for ${symbol}:`, err);
        });
        this.connections.set(symbol, ws);
    }
    scheduleReconnect(symbol) {
        const current = this.retryIntervals.get(symbol) ?? this.baseRetryMs;
        const next = Math.min(current * 2, this.maxRetryMs);
        setTimeout(() => this.connectToBinance(symbol), current);
        this.retryIntervals.set(symbol, next);
    }
    processOrderBookUpdate(symbol, msg) {
        const orderBook = this.orderBookData.get(symbol);
        if (!orderBook)
            return;
        msg.b.forEach(([priceStr, amountStr]) => {
            const price = parseFloat(priceStr);
            const amount = parseFloat(amountStr);
            if (isNaN(price))
                return;
            if (amount === 0)
                orderBook.bids.delete(price);
            else
                orderBook.bids.set(price, amount);
        });
        msg.a.forEach(([priceStr, amountStr]) => {
            const price = parseFloat(priceStr);
            const amount = parseFloat(amountStr);
            if (isNaN(price))
                return;
            if (amount === 0)
                orderBook.asks.delete(price);
            else
                orderBook.asks.set(price, amount);
        });
        const bids = Array.from(orderBook.bids.entries())
            .sort((a, b) => b[0] - a[0])
            .slice(0, 10)
            .map(([p, a]) => [p.toString(), a.toString()]);
        const asks = Array.from(orderBook.asks.entries())
            .sort((a, b) => a[0] - b[0])
            .slice(0, 10)
            .map(([p, a]) => [p.toString(), a.toString()]);
        (0, orderbookBridge_1.updateOrderBook)(symbol, bids, asks);
    }
    closeAll() {
        this.connections.forEach(ws => ws.close());
        this.connections.clear();
    }
}
const orderBookService = new OrderBookService();
process.on('SIGINT', () => {
    console.log('Shutting down order book service...');
    orderBookService.closeAll();
    process.exit(0);
});
exports.default = orderBookService;
