# WebSocket Server for Collaborative Whiteboard

This document outlines the WebSocket server specifications for our collaborative whiteboard application.

## Server URL

The WebSocket Server is accessible at:
[wss://ideaflow-websocket-server.onrender.com](https://ideaflow-websocket-server.onrender.com)

**Note:** The server is hosted on Render, which spins down instances during inactivity. It may take up to 1 minute to start after the first request.

## Message Format

Messages sent from the client side should adhere to the following interface:

```typescript
interface Message {
    type: string;
    roomID: string | null;
    data: string;
    command: string;
    name: string;
}
```
## Client Requests
For client requests, set type: 'request'.
### Available Commands:

1. CREATE ROOM: Creates a new room and returns a room ID
2. JOIN ROOM: Adds the client to the specified room
3. LEAVE ROOM: Removes the client from their current room
4. SEND NAMES: Retrieves names of clients currently in the room

## Server Responses
For server responses, type will be set to 'response'.
Response Types:

1. ROOM CREATED: Confirms successful room creation
2. FULL SERVER: Indicates the room has reached capacity
3. JOINED ROOM: Confirms successful room join
4. LEFT ROOM: Confirms successful room exit
5. DRAWING DATA: Contains drawing information to be sent to clients
6. USERNAMES: List of usernames in the current room

## Example Usage

```typescript
// Connecting to the WebSocket server
const socket = new WebSocket('wss://ideaflow-websocket-server.onrender.com');

// Creating a room
socket.send(JSON.stringify({
    type: 'request',
    command: 'CREATE ROOM',
    roomID: null,
    data: '',
    name: 'Alice'
}));

// Joining a room
socket.send(JSON.stringify({
    type: 'request',
    command: 'JOIN ROOM',
    roomID: '1234',
    data: '',
    name: 'Bob'
}));

// Handle incoming messages
socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log('Received:', response);
};
```
