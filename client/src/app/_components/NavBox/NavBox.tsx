import React, { useEffect } from "react";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import LeaveRoom from "./LeaveRoom";

function NavBox() {
    useEffect(()=>{
        const cRoom=document.getElementById('createRoom');
        cRoom?.addEventListener('click',()=>{
            console.log('daba diya');
        })
        console.log(cRoom);
    })
    return (
        <div className="flex flex-col items-start p-6">
            <div className="border border-4 border-solid border-black rounded-2xl p-3 w-32 space-y-5">
                <div className="cursor-pointer" id="createRoom">
                    Create Room
                </div>
                <JoinRoom />
                <LeaveRoom />
            </div>
        </div>
    )
}

export default NavBox;