import React, { useState } from 'react';
import './controls.css';
import LightingControls from './LightingControls';
import SaveButton from './SaveButton/SaveButton';

// PROPS RECEIVED FROM App.jsx - These are the data connections
function Controls({ 
  // MATERIAL PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  scale, onScaleChange,                            // Current scale value + function to update it
  metalness, onMetalnessChange,                    // Current metalness value + function to update it
  emissiveIntensity, onEmissiveIntensityChange,    // Current emissive intensity + function to update it
  baseColor, onBaseColorChange,                    // Current base color + function to update it
  wireframeIntensity, onWireframeIntensityChange,  // Current wireframe intensity + function to update it
  
  // HYPERFRAME PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  hyperframeColor, onHyperframeColorChange,    // Current spiral color + function to update it
  hyperframeLineColor, onHyperframeLineColorChange,        // Current edge color + function to update it
  
  // SCENE PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  cameraView, onCameraViewChange,                  // Current camera view mode + function to update it
  environment, onEnvironmentChange,                // Current environment setting + function to update it
  environmentHue, onEnvironmentHueChange,          // Current environment hue shift + function to update it
  objectCount, onObjectCountChange,                // Current object count + function to update it
  animationStyle, onAnimationStyleChange,          // Current animation style + function to update it
  objectType, onObjectTypeChange,                  // Current object type + function to update it
  
  // LIGHTING PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  ambientLightColor, onAmbientLightColorChange,
  ambientLightIntensity, onAmbientLightIntensityChange,
  directionalLightColor, onDirectionalLightColorChange,
  directionalLightIntensity, onDirectionalLightIntensityChange
  ,
  // GEOMETRY-SPECIFIC: Compound Torus Knot (Twin)
  cpdTK_p, onCpdTK_pChange,
  cpdTK_q, onCpdTK_qChange,
  cpdTK_tubeRadius, onCpdTK_tubeRadiusChange,
  cpdTK_gap, onCpdTK_gapChange
}) {
  
  // LOCAL STATE - These are managed by Controls component itself (NOT from App.jsx)
  // These control whether each section is expanded or collapsed in the UI
  const [materialOpen, setMaterialOpen] = useState(false)   // Material Properties section closed by default
  const [sceneOpen, setSceneOpen] = useState(false)         // Scene Controls section closed by default
  const [lightingOpen, setLightingOpen] = useState(false)   // Lighting Controls section closed by default

  /*
  // EVENT HANDLER FUNCTIONS
   * These functions bridge between user interactions and App.jsx state updates
   * 
   * PATTERN FOR EACH HANDLER:
   * 1. USER INTERACTION triggers onChange event on UI element
   * 2. onChange calls our handler function with 'event' parameter
   * 3. Handler extracts new value from event.target.value
   * 4. Handler calls the setter function passed from App.jsx
   * 5. Setter function updates App.jsx state
   * 6. Updated state flows to ThreeScene.jsx
   */

  /*
  // EVENT HANDLER FUNCTIONS
   * These functions are now imported from handlers/controlHandlers.js
   * Each handler is a higher-order function that takes a setter function and returns an event handler
   */
  
  // Define handler functions directly
  const handleMetalnessChange = (event) => {
    const newMetalness = parseFloat(event.target.value);
    onMetalnessChange(newMetalness);
  };
  
  const handleScaleChange = (event) => {
    onScaleChange(parseFloat(event.target.value));
  };
  
  const handleEmissiveIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value);
    onEmissiveIntensityChange(newIntensity);
  };
  
  const handleBaseColorChange = (event) => {
    const newColor = event.target.value;
    onBaseColorChange(newColor);
  };
  
  const handleWireframeIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value);
    onWireframeIntensityChange(newIntensity);
  };
  
  const handleWireframeToggle = (event) => {
    onWireframeIntensityChange(event.target.checked ? 100 : 0);
  };
  
  const handleHyperframeColorChange = (event) => {
    const newColor = event.target.value;
    onHyperframeColorChange(newColor);
  };
  
  const handleHyperframeLineColorChange = (event) => {
    const newColor = event.target.value;
    onHyperframeLineColorChange(newColor);
  };
  
  const handleCameraViewChange = (event) => {
    const newView = event.target.value;
    onCameraViewChange(newView);
  };
  
  const handleEnvironmentChange = (event) => {
    const newEnv = event.target.value;
    onEnvironmentChange(newEnv);
  };
  
  const handleEnvironmentHueChange = (event) => {
    const newHue = parseInt(event.target.value, 10);
    onEnvironmentHueChange(newHue);
  };
  
  const handleObjectCountChange = (event) => {
    const newCount = parseInt(event.target.value);
    onObjectCountChange(newCount);
  };
  
  const handleAnimationStyleChange = (event) => {
    const newStyle = event.target.value;
    onAnimationStyleChange(newStyle);
  };
  
  const handleObjectTypeChange = (event) => {
    const newType = event.target.value;
    onObjectTypeChange(newType);
  };

  // Geometry-specific handlers (cpd torus knot)
  const handleCpdTK_pChange = (event) => {
    const v = Math.max(2, parseInt(event.target.value || 2, 10));
    onCpdTK_pChange(isNaN(v) ? 2 : v);
  };
  const handleCpdTK_qChange = (event) => {
    const v = Math.max(2, parseInt(event.target.value || 3, 10));
    onCpdTK_qChange(isNaN(v) ? 3 : v);
  };
  const handleCpdTK_tubeRadiusChange = (event) => {
    const v = Math.max(0.01, parseFloat(event.target.value || 0.08));
    onCpdTK_tubeRadiusChange(isNaN(v) ? 0.08 : v);
  };
  const handleCpdTK_gapChange = (event) => {
    const v = Math.max(0.0, parseFloat(event.target.value || 0.12));
    onCpdTK_gapChange(isNaN(v) ? 0.12 : v);
  };


  // Lighting event handlers are now handled in LightingControls

  /*
   * JSX RETURN - THE USER INTERFACE
   * This section connects UI elements to handler functions
   * Look for onChange attributes to see which elements trigger which handlers
   */
  return (
    <>
      <div className="controls">
      {/* 
       * DEBUG DISPLAY SECTION
       * Shows current values FROM App.jsx - these update automatically when state changes
       * These are NOT interactive - they just display the current values
       */}
      
   
      
      <hr />

      {/* COLLAPSIBLE SECTION: MATERIAL PROPERTIES */}
      <div 
        className={`section-header ${materialOpen ? 'material-open' : 'material-closed'}`}
        onClick={() => setMaterialOpen(!materialOpen)} // CLICK HANDLER: Toggles section open/closed - updates LOCAL state
      >
        <span>🎨 MATERIAL PROPERTIES</span>
        <span>{materialOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${materialOpen ? 'material-open open' : 'closed'}`}>
        {/* 
         * MATERIAL PROPERTY CONTROLS
         * Each input element has an onChange attribute that connects to a handler function
         */}
        
        {/* BASE COLOR PICKER: User clicks/changes → handleBaseColorChange → App.jsx setState */}
        <label>
          Base Color: {/* Label shows current value from App.jsx: {baseColor} */}
        </label>
        {/* This color input DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user changes color */}
        <input 
          type="color" 
          value={baseColor}                      
          onChange={handleBaseColorChange}       
        />
        
        {/* EMISSIVE INTENSITY SLIDER: User drags → handleEmissiveIntensityChange → App.jsx setState */}
        <label>
          Emissive Intensity: <span className="value-display">{emissiveIntensity.toFixed(1)}</span> {/* Shows current value FROM App.jsx */}
        </label>
        {/* This range slider DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user drags slider */}
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.1"
          value={emissiveIntensity}                   
          onChange={handleEmissiveIntensityChange}    
        />
        
        {/* METALNESS SLIDER: User drags → handleMetalnessChange → App.jsx setState */}
        <label>
          Metalness: <span className="value-display">{metalness.toFixed(2)}</span> {/* Shows current value FROM App.jsx */}
        </label>
        {/* This range slider DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user drags slider */}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={metalness}
          onChange={handleMetalnessChange}
        />

        {/* Wireframe visibility toggle */}
        <label className="futuristic-checkbox-label">
          <input
            type="checkbox"
            checked={wireframeIntensity > 0}
            onChange={handleWireframeToggle}
            className="futuristic-checkbox"
          />
          <span className="futuristic-custom-checkbox"></span>
          <span className="futuristic-checkbox-text">Wireframe</span>
        </label>
        {/* Wireframe intensity slider */}
        <label>
          Wireframe Intensity: <span className="value-display">{wireframeIntensity}%</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={wireframeIntensity}
          onChange={handleWireframeIntensityChange}
        />

        {/* Hyperframe color picker */}
        <label>
          Hyperframe Color:
        </label>
        <input 
          type="color" 
          value={hyperframeColor}
          onChange={handleHyperframeColorChange}
        />

        {/* Hyperframe lines color picker */}
        <label>
          Hyperframe Lines Color:
        </label>
        <input 
          type="color" 
          value={hyperframeLineColor}
          onChange={handleHyperframeLineColorChange}
        />

        {/* Object Type Control */}
        <label>
          Object Type:
        </label>
        <select value={objectType} onChange={handleObjectTypeChange}>
          <option value="quantummanifold">♾️ Quantum Manifold (Klein+)</option>
          <option value="icosahedron">🔯 Cpd-Icosahedron</option>
          <option value="sphere">⚪ Cpd-Sphere (Cross)</option>
          <option value="cube">🧊 Cube</option>
          <option value="box">🔷 Cpd-Tesseract</option>
          <option value="cpdtesseract">💎 Mega-Tesseract</option>
          <option value="octahedron">🔸 Cpd-Octahedron</option>
          <option value="tetrahedron">🔻 Cpd-Tetrahedron</option>
          <option value="torusknot">🌀 Torus Knot</option>
          <option value="cpdtorusknot">🪢 Cpd-Torus Knot (Twin)</option>
          <option value="alienintellect">🧠 Alien Intellect (Knots)</option>
        </select>

        {/* Geometry-specific controls: only when selected */}
        {objectType === 'cpdtorusknot' && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid rgba(0,255,255,0.2)',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>🪢 Torus Knot (Twin) Params</div>
            <label>
              p (longitudinal wraps): <span className="value-display">{cpdTK_p}</span>
            </label>
            <input
              type="number"
              min="2"
              step="1"
              value={cpdTK_p}
              onChange={handleCpdTK_pChange}
            />

            <label>
              q (minor rotations): <span className="value-display">{cpdTK_q}</span>
            </label>
            <input
              type="number"
              min="2"
              step="1"
              value={cpdTK_q}
              onChange={handleCpdTK_qChange}
            />

            <label>
              Tube Thickness: <span className="value-display">{cpdTK_tubeRadius.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.02"
              max="0.2"
              step="0.005"
              value={cpdTK_tubeRadius}
              onChange={handleCpdTK_tubeRadiusChange}
            />

            <label>
              Knot Gap: <span className="value-display">{cpdTK_gap.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.3"
              step="0.005"
              value={cpdTK_gap}
              onChange={handleCpdTK_gapChange}
            />
          </div>
        )}

        {/* Animation Style Control */}
        <label>
          Animation Style:
        </label>
        <select value={animationStyle} onChange={handleAnimationStyleChange}>
          <option value="rotate">Simple Rotation</option>
          <option value="float">Floating Dance</option>
          <option value="omniIntel">Omni-Intel</option>
        </select>
      </div>

      {/* NEW: SCENE CONTROLS SECTION */}
      <div 
        className={`section-header ${sceneOpen ? 'scene-open' : 'scene-closed'}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA & SCENE</span>
        <span>{sceneOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${sceneOpen ? 'scene-open open' : 'closed'}`}>
        {/* Scale Control */}
        <label>
          Scale: <span className="value-display">{scale.toFixed(1)}</span>
        </label>
        <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={scale}
        onChange={handleScaleChange}
        />

        {/* Camera View Control */}
        <label>
          Camera View:
        </label>
        <select value={cameraView} onChange={handleCameraViewChange}>
          <option value="free">Free Camera</option>
          <option value="orbit">Orbit View</option>
          <option value="top">Top Down</option>
        </select>

        {/* Environment Control */}
        <label>
          Environment:
        </label>
        <select value={environment} onChange={handleEnvironmentChange}>
          <option value="nebula">Nebula</option>
          <option value="space">Space Scene</option>
          <option value="sunset">Sunset Sky</option>
          <option value="matrix">Matrix Code</option>
        </select>

        {/* Environment Hue Shift Control */}
        <label>
          Environment Hue: <span className="value-display">{environmentHue}°</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={environmentHue}
          onChange={handleEnvironmentHueChange}
        />

        {/* Object Count Control */}
        <label>
          Object Count: <span className="value-display">{objectCount}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={objectCount}
          onChange={handleObjectCountChange}
        />
      </div>

      {/* NEW: LIGHTING CONTROLS SECTION */}
      <div 
        className={`section-header ${lightingOpen ? 'lighting-open' : 'lighting-closed'}`}
        onClick={() => setLightingOpen(!lightingOpen)}
      >
        <span>💡 LIGHTING CONTROLS</span>
        <span>{lightingOpen ? '▼' : '▶'}</span>
      </div>
      
      {lightingOpen && (
        <LightingControls
          ambientLightColor={ambientLightColor}
          onAmbientLightColorChange={onAmbientLightColorChange}
          ambientLightIntensity={ambientLightIntensity}
          onAmbientLightIntensityChange={onAmbientLightIntensityChange}
          directionalLightColor={directionalLightColor}
          onDirectionalLightColorChange={onDirectionalLightColorChange}
          directionalLightIntensity={directionalLightIntensity}
          onDirectionalLightIntensityChange={onDirectionalLightIntensityChange}
        />
      )}
      </div>
    </>
  )
}

export default Controls