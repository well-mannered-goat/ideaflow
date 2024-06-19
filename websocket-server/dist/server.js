"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8080 });
let rooms = new Map;
const createRoom = (message, ws) => {
    let res;
    let roomId = Math.floor(Math.random() * 10000);
    console.log(roomId);
    if (!rooms.has(roomId)) {
        let newRoom = {
            users: [ws],
            data: undefined,
        };
        rooms.set(roomId, newRoom);
        res = {
            type: 'response',
            roomID: roomId,
            data: '',
            command: 'ROOM CREATED',
        };
    }
    else {
        res = createRoom(message, ws);
    }
    return res;
};
const joinRoom = (roomId, ws) => {
    var _a;
    let res;
    let thisRoom = rooms.get(roomId);
    if (thisRoom && thisRoom.users.length > 10) {
        res = {
            roomID: roomId,
            type: 'response',
            data: '',
            command: 'FULL SERVER',
        };
    }
    else {
        (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.push(ws);
        res = {
            type: 'response',
            roomID: roomId,
            data: '',
            command: 'JOINED ROOM',
        };
    }
    console.log(rooms.keys());
    console.log(thisRoom);
    return res;
};
const leaveRoom = (roomId, ws) => {
    var _a, _b;
    let res;
    let index = (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.indexOf(ws);
    if (index) {
        if (index > -1) {
            (_b = rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.users.splice(index, 1);
        }
    }
    res = {
        type: 'response',
        roomID: roomId,
        data: '',
        command: 'LEFT ROOM',
    };
    return res;
};
const sendData = (roomId, drawData, ws) => {
    var _a;
    let res;
    res = {
        type: 'response',
        roomID: roomId,
        data: '',
        command: 'DRAWING DATA',
    };
    (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.forEach((client) => {
        if (client !== ws && client.readyState === ws_1.default.OPEN) {
            console.log(drawData, 'sending to clients');
            res.data = JSON.stringify(drawData);
            client.send(JSON.stringify(res));
        }
    });
    return res;
};
wss.on('connection', (ws) => {
    console.log('Client connected');
    // wss.clients.forEach((client: WebSocket) => {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send("Hello from 8080");
    //   }
    // })
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        const { command, data, type, roomID } = JSON.parse(message.toString());
        let res;
        switch (command) {
            case 'CREATE ROOM':
                res = createRoom(JSON.parse(message.toString()), ws);
                ws.send(JSON.stringify(res));
                break;
            case 'JOIN ROOM':
                res = joinRoom(Number(roomID), ws);
                ws.send(JSON.stringify(res));
                break;
            case 'LEAVE ROOM':
                res = leaveRoom(roomID, ws);
                ws.send(JSON.stringify(res));
                break;
            case 'SEND DATA':
                const drawData = JSON.parse(JSON.parse(message.toString()).data);
                res = {
                    type: 'response',
                    roomID: roomID,
                    data: '',
                    command: 'DATA SENT',
                };
                sendData(Number(roomID), drawData, ws);
                ws.send(JSON.stringify(res));
                break;
        }
        // wss.clients.forEach((client: WebSocket) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     console.log(message.toString(), 'sending to clients');
        //     client.send(message.toString());
        //   }
        // });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server started on port 8080');
