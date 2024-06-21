import { useRouter } from "next/router";
import { useEffect } from "react";


const JoinRoomModal = ({ socket, name }: { socket: WebSocket ,name:string}) => {
    // const router=useRouter();
    const getRoomNo = () => {

        const roomNo: string = document.getElementById('room-number').value;
        console.log(typeof(roomNo))
        if (roomNo !== '') {
            console.log(socket, '', roomNo);
            const message = {
                type: 'request',
                command: 'JOIN ROOM',
                roomID: roomNo,
                data: '',
                name: name,
            }
            socket.send(JSON.stringify(message));

            let mes1 = {
                type: 'request',
                command: 'SEND NAMES',
                roomID: roomNo,
                data: '',
                name:name
            }
            socket.send(JSON.stringify(mes1));

        }
        else{
            alert('Help!!!!');
        }


    }
    return (

        <div>
            <input type="number" id='room-number' className="border border-grey"></input>
            <button onClick={getRoomNo} id="room-id-button">Room Id</button>
        </div>

    )
}

export default JoinRoomModal;