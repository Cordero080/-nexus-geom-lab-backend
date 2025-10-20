import React from 'react';

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
        onChange={(event) => onAmbientLightColorChange(event.target.value)}
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
        onChange={(event) => onAmbientLightIntensityChange(parseFloat(event.target.value))}
      />

      {/* Directional Light Controls */}
      <label>
        Directional Light Color:
      </label>
      <input 
        type="color" 
        value={directionalLightColor}
        onChange={(event) => onDirectionalLightColorChange(event.target.value)}
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
        onChange={(event) => onDirectionalLightIntensityChange(parseFloat(event.target.value))}
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
        onChange={(event) => onDirectionalLightXChange(parseFloat(event.target.value))}
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
        onChange={(event) => onDirectionalLightYChange(parseFloat(event.target.value))}
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
        onChange={(event) => onDirectionalLightZChange(parseFloat(event.target.value))}
      />
    </div>
  );
}

export default LightingControls;