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
        onChange={e => onAmbientLightColorChange(e.target.value)}
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
        onChange={onAmbientLightIntensityChange}
      />

      {/* Directional Light Controls */}
      <label>
        Directional Light Color:
      </label>
      <input 
        type="color" 
        value={directionalLightColor}
        onChange={e => onDirectionalLightColorChange(e.target.value)}
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
        onChange={e => {
          const val = parseFloat(e.target.value);
          console.log('[LightingControls] Directional Light Intensity changed:', val);
          onDirectionalLightIntensityChange(val);
        }}
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
        onChange={e => {
          const val = parseFloat(e.target.value);
          console.log('[LightingControls] Directional Light X changed:', val);
          onDirectionalLightXChange(val);
        }}
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
        onChange={e => {
          console.log('[LightingControls] Slider Y changed:', e.target.value);
          onDirectionalLightYChange(parseFloat(e.target.value));
        }}
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
        onChange={e => onDirectionalLightZChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default LightingControls;
