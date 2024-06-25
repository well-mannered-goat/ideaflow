import { isElementAccessExpression } from 'typescript';
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

interface room {
  users: WebSocket[],
  userNames:string[],
  data: Object | undefined,
}

interface response {
  type: string,
  roomID: number,
  data: string,
  command:string,
  name?:string,
}

let rooms = new Map<number, room>;

const createRoom = (message: Object, ws: WebSocket,name:string) => {
  let res: response;
  let roomId = Math.floor(Math.random()*10000);
  console.log(roomId);
  if (!rooms.has(roomId)) {
    let newRoom: room = {
      users: [ws],
      userNames:[name],
      data: undefined,
    }
    rooms.set(roomId, newRoom);
    res={
      type:'response',
      roomID:roomId,
      data:'',
      command:'ROOM CREATED',
    }
  }
  else {
    res = createRoom(message, ws,name);
  }
  return res;
}

const joinRoom = (roomId: number, ws: WebSocket,name:string) => {
  let res: response;
  let thisRoom=rooms.get(roomId);
  if (thisRoom && thisRoom.users.length>10){
    res = {
      roomID:roomId,
      type :'response',
      data  :'',
      command:'FULL SERVER',
    }
  }
  else {
    rooms.get(roomId)?.users.push(ws);
    rooms.get(roomId)?.userNames.push(name);
    res = {
      type: 'response',
      roomID: roomId,
      data: '',
      command:'JOINED ROOM',
    }
  }
  console.log(rooms.keys());
  console.log(thisRoom);
  return res;
}

const leaveRoom = (roomId: number, ws: WebSocket,name:string) => {
  let res: response;
  let WSindex = rooms.get(roomId)?.users.indexOf(ws);
  let Nameindex=rooms.get(roomId)?.userNames.indexOf(name);

  console.log(WSindex,' ',Nameindex);
  if (WSindex !== undefined) {
    if (WSindex >= 0) {
      const room=rooms.get(roomId);
      if(room && room.users){
        room.users.splice(WSindex, 1);
      }
    }
  }
  if(Nameindex !== undefined){
    if(Nameindex>=0){
      const room=rooms.get(roomId);
      if(room && room.userNames){
        room.userNames.splice(Nameindex,1);
      }
      console.log(rooms.get(roomId)?.userNames);
    }
  }
  res = {
    type: 'response',
    roomID: roomId,
    data: '',
    command:'LEFT ROOM',
    name: name,
  }

  console.log(rooms.get(roomId))
  return res;
}

const sendData = (roomId:number,drawData:Object,ws:WebSocket) =>{
  let res:response;
  res={
    type:'response',
    roomID:roomId,
    data:'',
    command:'DRAWING DATA',
  }
  rooms.get(roomId)?.users.forEach((client:WebSocket)=>{
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      console.log(drawData, 'sending to clients');
      res.data=JSON.stringify(drawData)
      client.send(JSON.stringify(res));
    }
  })
  return res;
}

const sendUnames = (roomID:number) =>{
  rooms.get(roomID)?.users.forEach((client:WebSocket)=>{
    let res={
      type:'response',
      roomID:roomID,
      data:'',
      command:'USERNAMES',
      name: rooms.get(Number(roomID))?.userNames.toString()!,
    }
    client.send(JSON.stringify(res));
  })
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');


  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    const {command,data,type,roomID,name} = JSON.parse(message.toString());

    let res:response;
    switch (command) {
      case 'CREATE ROOM':
        res = createRoom(JSON.parse(message.toString()), ws,name);
        ws.send(JSON.stringify(res));
        break;

      case 'JOIN ROOM':
        res = joinRoom(Number(roomID), ws,name);
        ws.send(JSON.stringify(res));
        break;

      case 'LEAVE ROOM':
        res=leaveRoom(roomID,ws,name);
        ws.send(JSON.stringify(res));
        break;

      case 'SEND DATA':
        const drawData=JSON.parse(JSON.parse(message.toString()).data);
        res={
          type:'response',
          roomID:roomID,
          data:'',
          command:'DATA SENT',
        }
        sendData(Number(roomID),drawData,ws);
        ws.send(JSON.stringify(res));
        break;

        case 'SEND NAMES':
          // res={
          //   type:'response',
          //   roomID:roomID,
          //   data:'',
          //   command:'USERNAMES',
          //   name: rooms.get(Number(roomID))?.userNames.toString()!,
          // }
          // ws.send(JSON.stringify(res));

          sendUnames(Number(roomID));
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
