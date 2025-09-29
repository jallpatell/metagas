"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOrderBookSymbols = initializeOrderBookSymbols;
exports.subscribeClientToSymbol = subscribeClientToSymbol;
exports.removeClientFromAll = removeClientFromAll;
exports.getOrderBookSnapshot = getOrderBookSnapshot;
exports.broadcastOrderBook = broadcastOrderBook;
exports.updateOrderBook = updateOrderBook;
// src/api/orderbookBridge.ts
const ws_1 = require("ws");
// WebSocket connections subscribed per symbol
const orderBookConnections = new Map();
// Server-side snapshot map
const orderBookDataMap = new Map();
function initializeOrderBookSymbols(symbols) {
    symbols.forEach(s => {
        if (!orderBookConnections.has(s))
            orderBookConnections.set(s, new Set());
    });
}
function subscribeClientToSymbol(symbol, ws) {
    if (!orderBookConnections.has(symbol))
        orderBookConnections.set(symbol, new Set());
    orderBookConnections.get(symbol).add(ws);
}
function removeClientFromAll(ws) {
    orderBookConnections.forEach(set => set.delete(ws));
}
function getOrderBookSnapshot(symbol) {
    return orderBookDataMap.get(symbol);
}
function broadcastOrderBook(symbol, data) {
    const payload = JSON.stringify({ type: 'orderbook', data });
    const conns = orderBookConnections.get(symbol);
    if (!conns)
        return;
    conns.forEach(ws => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(payload);
        }
    });
}
function updateOrderBook(symbol, bids, asks) {
    const data = { symbol, bids, asks, timestamp: Date.now() };
    orderBookDataMap.set(symbol, data);
    broadcastOrderBook(symbol, data);
}
