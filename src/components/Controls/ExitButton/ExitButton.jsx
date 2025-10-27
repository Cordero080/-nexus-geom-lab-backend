import React from 'react';
import './ExitButton.css';
import '../../../styles/shared.css';

function ExitButton({ onClick, textColor }) {
  return (
    <button 
      onClick={onClick}
      className="exit-button angled-corners"
      style={textColor ? { color: textColor } : {}} // Apply custom text color if provided
    >
      <div className="beam-scan-effect"></div>
      ← Exit Lab
    </button>
  );
}

export default ExitButton;
