import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  wss.clients.forEach((client:WebSocket)=>{
    if(client!== ws && client.readyState===WebSocket.OPEN){
        client.send("Hello from 8080");
    }
  })

  ws.on('message', (message) => {
    console.log(`Received: ${typeof(message)}`);
    // Send the message to all other connected clients
    wss.clients.forEach((client: WebSocket) => {
      if (client!== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');
