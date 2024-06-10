import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  wss.clients.forEach((client:WebSocket)=>{
    if(client!== ws && client.readyState===WebSocket.OPEN){
        client.send("Hello from 8080");
    }
  })

  function buffersToString(buffers:Buffer[]) {
    return buffers.map(buffer => buffer.toString()).join('');
}

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    const m=message.toLocaleString;
    // Send the message to all other connected clients
    wss.clients.forEach((client: WebSocket) => {
      if (client!== ws && client.readyState === WebSocket.OPEN) {
        console.log(message.toString(),'sending to clients');
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');
