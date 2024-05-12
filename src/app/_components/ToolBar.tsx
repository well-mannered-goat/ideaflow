import React from 'react';

const Toolbar = ({ selectTool }) => {
  const chooseTool = (e) => {
    const tool = e.target.innerHTML.toLowerCase();
    console.log(tool);
    selectTool(tool);
  };

  return (
    <div className="flex flex-row justify-center space-x-5 cursor-default">
      <div className="cursor-pointer" onClick={chooseTool}>
        Rectangle
      </div>
      <div className="cursor-pointer" onClick={chooseTool}>
        Circle
      </div>
    </div>
  );
};

export default Toolbar;