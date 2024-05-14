import React, { useEffect } from 'react';

const Toolbar = ({ selectTool }) => {
  const chooseTool = (e) => {
    const tool = e.target.innerHTML.toLowerCase();
    console.log(tool);
    selectTool(tool);
  };

  useEffect(() => {
    const svgElement = document.getElementById('svg');
    const saveButton = document.getElementById('save');
    let data:string|undefined;
    saveButton?.addEventListener('click',()=>{
      console.log(svgElement?.innerHTML  );
      data=svgElement?.innerHTML;
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