'use client'
import React, { useEffect } from "react";

function CreateRoom(){
    useEffect(()=>{
        const cRoom=document.getElementById('createRoom');
        cRoom?.addEventListener('click',()=>{
            console.log('daba diya')
    })

    })
    return(
        
    )
}

export default CreateRoom;