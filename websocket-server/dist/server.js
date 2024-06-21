"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8080 });
let rooms = new Map;
const createRoom = (message, ws, name) => {
    let res;
    let roomId = Math.floor(Math.random() * 10000);
    console.log(roomId);
    if (!rooms.has(roomId)) {
        let newRoom = {
            users: [ws],
            userNames: [name],
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
        res = createRoom(message, ws, name);
    }
    return res;
};
const joinRoom = (roomId, ws, name) => {
    var _a, _b;
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
        (_b = rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.userNames.push(name);
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
const leaveRoom = (roomId, ws, name) => {
    var _a, _b, _c, _d;
    let res;
    let WSindex = (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.indexOf(ws);
    let Nameindex = (_b = rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.userNames.indexOf(name);
    if (WSindex) {
        if (WSindex > -1) {
            (_c = rooms.get(roomId)) === null || _c === void 0 ? void 0 : _c.users.splice(WSindex, 1);
        }
    }
    if (Nameindex) {
        if (Nameindex > -1) {
            (_d = rooms.get(roomId)) === null || _d === void 0 ? void 0 : _d.userNames.splice(Nameindex, 1);
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
    ws.on('message', (message) => {
        var _a;
        console.log(`Received: ${message}`);
        const { command, data, type, roomID, name } = JSON.parse(message.toString());
        let res;
        switch (command) {
            case 'CREATE ROOM':
                res = createRoom(JSON.parse(message.toString()), ws, name);
                ws.send(JSON.stringify(res));
                break;
            case 'JOIN ROOM':
                res = joinRoom(Number(roomID), ws, name);
                ws.send(JSON.stringify(res));
                break;
            case 'LEAVE ROOM':
                res = leaveRoom(roomID, ws, name);
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
            case 'SEND NAMES':
                res = {
                    type: 'response',
                    roomID: roomID,
                    data: '',
                    command: 'USERNAMES',
                    name: (_a = rooms.get(Number(roomID))) === null || _a === void 0 ? void 0 : _a.userNames.toString(),
                };
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
