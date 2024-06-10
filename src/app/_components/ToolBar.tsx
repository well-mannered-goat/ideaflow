import React, { useEffect,useState } from 'react';
import useWebsocket from './WSCLient';

const Toolbar = ({ selectTool }) => {

  const [drawing,setDrawing]=useState('');
  
  const chooseTool = (e) => {
    const tool = e.target.innerHTML.toLowerCase();
    console.log(tool);
    selectTool(tool);
  };

  //const socket=new WebSocket('ws://localhost:8080');

  // socket.onopen=()=>{
  //   console.log('connected to websocket');
  //   socket.send('hello');
  // }

  useEffect(() => {
    const svgElement = document.getElementById('svg');
    if(svgElement){
      //svgElement.innerHTML=drawing;
      console.log(drawing);
    }
    const saveButton = document.getElementById('save');
    // if(socket){
    //   socket.onmessage = (ev:MessageEvent) =>{
    //     if(svgElement){
    //       svgElement.innerHTML+=ev.data;
    //     }
    //   }
    // }
    // let data={
    //   x1:t
    // }
    saveButton?.addEventListener('click',()=>{
      // console.log(typeof(svgElement?.innerHTML)  );
      // if(svgElement){
      //   data=svgElement.innerHTML!=undefined?(svgElement.innerHTML):"";
      //   console.log(data,"data sending");
      // }
      // if(socket?.OPEN){
      //   socket.send(data);
      // }
      //setDrawing(data);
    })

    const resetButton=document.getElementById('reset');
    resetButton?.addEventListener('click',()=>{
      while(svgElement?.lastChild){
        svgElement.removeChild(svgElement.lastChild);
      }
    })

    const getButton=document.getElementById('get');
    getButton?.addEventListener('click',()=>{
      if(svgElement){
        svgElement.innerHTML=data;
      }
    })
  }, []);

  return (
    <div className="flex flex-row justify-center space-x-5 cursor-default">
      <div className="cursor-pointer" onClick={chooseTool}>
        Rectangle
      </div>
      <div className="cursor-pointer" onClick={chooseTool}>
        Circle
      </div>
      <div className='cursor-pointer' id='save'>
        Save
      </div>
      <div className='cursor-pointer' id='reset'>
        Reset
      </div>
      <div className='cursor-pointer' id='get'>
        Get
      </div>
    </div>
  );
};

export default Toolbar;