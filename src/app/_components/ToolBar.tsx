import React, { useState } from 'react';

const Toolbar = ({ onToolSelect }) => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    onToolSelect(tool);
  };

  return (
    <div className="toolbar">
      <button
        className={`toolbar-btn ${selectedTool === 'rectangle' ? 'active' : ''}`}
        onClick={() => handleToolSelect('rectangle')}
      >
        <i className="fas fa-rectangle-landscape"></i>
        Rectangle
      </button>
      <button
        className={`toolbar-btn ${selectedTool === 'circle' ? 'active' : ''}`}
        onClick={() => handleToolSelect('circle')}
      >
        <i className="fas fa-circle"></i>
        Circle
      </button>
    </div>
  );
};

export default Toolbar;