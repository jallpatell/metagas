"use strict";
// server/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var next_1 = require("next");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var dev = process.env.NODE_ENV !== 'production';
var port = parseInt(process.env.PORT || '3000', 10);
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
// Top-level await (ES2022)
await app.prepare();
var server = (0, express_1.default)();
// Example API route
server.get('/api/hello', function (req, res) {
    res.status(200).json({ message: 'Hello from ES2022 server!' });
});
// Handle everything else (Next.js pages)
server.all('*', function (req, res) {
    return handle(req, res);
});
// Start server
server.listen(port, function () {
    console.log("\uD83D\uDE80 Server running at http://localhost:".concat(port));
});
