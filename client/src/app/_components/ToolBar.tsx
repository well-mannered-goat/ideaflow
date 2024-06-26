import React, { useEffect, useState } from 'react';
const Toolbar = ({ selectTool, websocket, createRoom, leaveRoom }:{selectTool:(tool:string)=>void, websocket:WebSocket|null, createRoom:()=>void, leaveRoom:()=>void}) => {

  const [drawing, setDrawing] = useState('');

  const chooseTool = (e:React.MouseEvent<HTMLElement>) => {
    const tool = (e.target as HTMLElement).innerHTML.toLowerCase();
    selectTool(tool);
  };

  useEffect(() => {
    const svgElement = document.getElementById('svg');
    const saveButton = document.getElementById('save');
    saveButton?.addEventListener('click', () => {
      var svgString = new XMLSerializer().serializeToString(svgElement!);

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      var DOMURL = self.URL || self.webkitURL || self;
      var img = new Image();
      var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      var png: string;
      img.onload = function () {
        ctx!.drawImage(img, 0, 0);
        png = canvas.toDataURL("image/png");
        DOMURL.revokeObjectURL(png);
      };
      img.src = url;

      const downloadLInk = document.createElement('a');
      downloadLInk.href = url;
      downloadLInk.download = 'drawing.png';
      downloadLInk.click();
    })


    const resetButton = document.getElementById('reset');
    resetButton?.addEventListener('click', () => {
      while (svgElement?.lastChild) {
        svgElement.removeChild(svgElement.lastChild);
      }
    })


  }, []);

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