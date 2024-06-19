import { useEffect } from "react";


const JoinRoomModal = ({socket}:{socket:WebSocket}) => {
    const getRoomNo = () =>{
        const roomNo:HTMLInputElement=document.getElementById('room-number').value;
        console.log(socket,'',roomNo);
        const message={
            type: 'request',
            command: 'JOIN ROOM',
            roomID: roomNo,
            data: '',
        }
        socket.send(JSON.stringify(message));
                // const dull=document.getElementById('dull');
                // dull?.parentNode?.removeChild(dull);
    }
    return (
        
        <div>
            <input type="number" id='room-number' className="border border-grey"></input>
            <button onClick={getRoomNo}>Room Id</button>
        </div>

    )
}

export default JoinRoomModal;