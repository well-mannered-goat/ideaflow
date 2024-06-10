"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('Client connected');
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws_1.default.OPEN) {
            client.send("Hello from 8080");
        }
    });
    function buffersToString(buffers) {
        return buffers.map(buffer => buffer.toString()).join('');
    }
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        const m = message.toLocaleString;
        // Send the message to all other connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                console.log(message.toString(), 'sending to clients');
                client.send(message.toString());
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server started on port 8080');
