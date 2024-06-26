import React, { useEffect, useState } from 'react';
import WebSocket from 'ws';
import Link from 'next/link';
import svg2img from 'svg2img';
import { Elsie_Swash_Caps } from 'next/font/google';

const Toolbar = ({ selectTool, websocket, createRoom, leaveRoom }) => {

  const [drawing, setDrawing] = useState('');

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
    if (svgElement) {
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
    saveButton?.addEventListener('click', () => {
      //const svgString = svgElement?.outerHTML;
      //console.log(svgString);
      var svgString = new XMLSerializer().serializeToString(svgElement!);

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      var DOMURL = self.URL || self.webkitURL || self;
      var img = new Image();
      var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      var png:string;
      img.onload = function () {
        ctx!.drawImage(img, 0, 0);
        png = canvas.toDataURL("image/png");
        //document.querySelector('#png-container').innerHTML = '<img src="' + png + '"/>';
        DOMURL.revokeObjectURL(png);
      };
      img.src = url;
      
      const downloadLInk=document.createElement('a');
      downloadLInk.href=url;
      downloadLInk.download='drawing.png';
      downloadLInk.click();
      console.log(img);



    })

    const loadImage = async url => {
      const img = document.createElement('img')
      img.src = url
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })
    }

    const resetButton = document.getElementById('reset');
    resetButton?.addEventListener('click', () => {
      while (svgElement?.lastChild) {
        svgElement.removeChild(svgElement.lastChild);
      }
    })

    const getButton = document.getElementById('get');
    getButton?.addEventListener('click', () => {
      if (svgElement) {
        svgElement.innerHTML = data;
      }
    })
  }, []);

  const handleClick = () => {
    console.log(Date.now());
  }

  return (
    <div className="flex flex-row justify-center space-x-5 cursor-default font-amatic text-2xl">
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
      <div className="cursor-pointer" onClick={createRoom}>
        Create Room
      </div>
      <div className="cursor-pointer" id='open-modal'>
        Join room
      </div>
      <div className="cursor-pointer" id='leave-room' onClick={leaveRoom}>
        Leave room
      </div>

    </div>
  );
};

export default Toolbar;


1718207954846

1718207970445