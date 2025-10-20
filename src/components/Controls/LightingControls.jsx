import React from 'react';
import * as handlers from '../../handlers';

function LightingControls({
  ambientLightColor,
  onAmbientLightColorChange,
  ambientLightIntensity,
  onAmbientLightIntensityChange,
  directionalLightColor,
  onDirectionalLightColorChange,
  directionalLightIntensity,
  onDirectionalLightIntensityChange,
  directionalLightX,
  onDirectionalLightXChange,
  directionalLightY,
  onDirectionalLightYChange,
  directionalLightZ,
  onDirectionalLightZChange
}) {
  // Defensive: ensure all values are numbers before using toFixed
  const safeNumber = (val, digits = 1, fallback = '0') => {
    if (typeof val === 'number' && !isNaN(val)) return val.toFixed(digits);
    return fallback;
  };

  return (
    <div className="section-content lighting-open open">
      {/* Ambient Light Controls */}
      <label>
        Ambient Light Color:
      </label>
      <input 
        type="color" 
        value={ambientLightColor}
        onChange={handlers.handleAmbientLightColorChange(onAmbientLightColorChange)}
      />

      <label>
        Ambient Light Intensity: <span className="value-display">{safeNumber(ambientLightIntensity, 2)}</span>
      </label>
      <input 
        type="range" 
        min="0" 
        max="2" 
        step="0.05"
        value={ambientLightIntensity}
        onChange={handlers.handleAmbientLightIntensityChange(onAmbientLightIntensityChange)}
      />

      {/* Directional Light Controls */}
      <label>
        Directional Light Color:
      </label>
      <input 
        type="color" 
        value={directionalLightColor}
        onChange={handlers.handleDirectionalLightColorChange(onDirectionalLightColorChange)}
      />

      <label>
        Directional Light Intensity: <span className="value-display">{safeNumber(directionalLightIntensity, 1)}</span>
      </label>
      <input 
        type="range" 
        min="0" 
        max="20" 
        step="0.5"
        value={directionalLightIntensity}
        onChange={handlers.handleDirectionalLightIntensityChange(onDirectionalLightIntensityChange)}
      />

      {/* Directional Light Position Controls */}
      <label>
        Directional Light X: <span className="value-display">{safeNumber(directionalLightX, 1)}</span>
      </label>
      <input 
        type="range" 
        min="-20" 
        max="20" 
        step="0.5"
        value={directionalLightX}
        onChange={handlers.handleDirectionalLightXChange(onDirectionalLightXChange)}
      />

      <label>
        Directional Light Y: <span className="value-display">{safeNumber(directionalLightY, 1)}</span>
      </label>
      <input 
        type="range" 
        min="-20" 
        max="20" 
        step="0.5"
        value={directionalLightY}
        onChange={handlers.handleDirectionalLightYChange(onDirectionalLightYChange)}
      />

      <label>
        Directional Light Z: <span className="value-display">{safeNumber(directionalLightZ, 1)}</span>
      </label>
      <input 
        type="range" 
        min="-20" 
        max="20" 
        step="0.5"
        value={directionalLightZ}
        onChange={handlers.handleDirectionalLightZChange(onDirectionalLightZChange)}
      />
    </div>
  );
}

export default LightingControls;