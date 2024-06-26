"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocket.Server({ port: 8080 });
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
    var _a, _b, _c;
    let res;
    let WSindex = (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.indexOf(ws);
    let Nameindex = (_b = rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.userNames.indexOf(name);
    console.log(WSindex, ' ', Nameindex);
    if (WSindex !== undefined) {
        if (WSindex >= 0) {
            const room = rooms.get(roomId);
            if (room && room.users) {
                room.users.splice(WSindex, 1);
            }
        }
    }
    if (Nameindex !== undefined) {
        if (Nameindex >= 0) {
            const room = rooms.get(roomId);
            if (room && room.userNames) {
                room.userNames.splice(Nameindex, 1);
            }
            console.log((_c = rooms.get(roomId)) === null || _c === void 0 ? void 0 : _c.userNames);
        }
    }
    res = {
        type: 'response',
        roomID: roomId,
        data: '',
        command: 'LEFT ROOM',
        name: name,
    };
    console.log(rooms.get(roomId));
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
        if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
            console.log(drawData, 'sending to clients');
            res.data = JSON.stringify(drawData);
            client.send(JSON.stringify(res));
        }
    });
    return res;
};
const sendUnames = (roomID) => {
    var _a;
    (_a = rooms.get(roomID)) === null || _a === void 0 ? void 0 : _a.users.forEach((client) => {
        var _a;
        let res = {
            type: 'response',
            roomID: roomID,
            data: '',
            command: 'USERNAMES',
            name: (_a = rooms.get(Number(roomID))) === null || _a === void 0 ? void 0 : _a.userNames.toString(),
        };
        client.send(JSON.stringify(res));
    });
};
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
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
                sendUnames(Number(roomID));
                break;
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server started on port 8080');
