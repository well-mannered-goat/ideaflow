import { error } from "console";
import { useEffect, useState } from "react";

const useWebsocket = (url: string): WebSocket | null => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Websocket connected');
        }

        ws.onmessage = (event: MessageEvent) => {
            const message = event.data;
            console.log("data received", message);
        }

        ws.onerror = (er) =>{
            console.error(er);
        }

        ws.onclose = () =>{
            console.log('Websocket disconnected');
        }

        setSocket(ws);

        return ()=>{
            ws.close();
        };
    },[url]);

    return socket;
}

export default useWebsocket;