import { useRouter } from "next/router";
import { useEffect } from "react";


const JoinRoomModal = ({ socket, name, getRoomNo }: { socket: WebSocket, name: string, getRoomNo:()=>void }) => {
    // const router=useRouter();
    // const getRoomNo = () => {
    //     const roomNo: string = document.getElementById('room-number').value;
    //     console.log(typeof (roomNo))
    //     if (roomNo !== '') {
    //         console.log(socket, '', roomNo);
    //         const message = {
    //             type: 'request',
    //             command: 'JOIN ROOM',
    //             roomID: roomNo,
    //             data: '',
    //             name: name,
    //         }
    //         socket.send(JSON.stringify(message));

    //         let mes1 = {
    //             type: 'request',
    //             command: 'SEND NAMES',
    //             roomID: roomNo,
    //             data: '',
    //             name: name
    //         }
    //         socket.send(JSON.stringify(mes1));

    //     }
    //     else {
    //         alert('Help!!!!');
    //     }
    // }
    return (


        <div className="flex flex-col items-center">
            <input
                id="room-number"
                className="w-full mb-4 px-3 py-2 text-black bg-white rounded-md font-amatic text-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Enter Room Number"
            ></input>
            <button
                id="room-id-button"
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 font-amatic text-3xl rounded-md hover:bg-green-700 transition duration-300"
                onClick={getRoomNo}
            >
                Join Room
            </button>
        </div>


    )
}

export default JoinRoomModal;