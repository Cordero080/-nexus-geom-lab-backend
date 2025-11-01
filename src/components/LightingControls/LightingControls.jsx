import React from 'react';

function LightingControls({
  ambientLightColor,
  onAmbientLightColorChange,
  ambientLightIntensity,
  onAmbientLightIntensityChange,
  directionalLightColor,
  onDirectionalLightColorChange,
  directionalLightIntensity,
  onDirectionalLightIntensityChange
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
    </div>
  );
}

export default LightingControls;