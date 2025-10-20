import React, { useState } from 'react';
import './controls.css';
import LightingControls from './LightingControls';

// PROPS RECEIVED FROM App.jsx - These are the data connections
function Controls({ 
  // MATERIAL PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  scale, onScaleChange,                            // Current scale value + function to update it
  shininess, onShininessChange,                    // Current shininess value + function to update it
  specularColor, onSpecularColorChange,            // Current specular color + function to update it
  specularIntensity, onSpecularIntensityChange,    // Current specular intensity + function to update it
  baseColor, onBaseColorChange,                    // Current base color + function to update it
  wireframeIntensity, onWireframeIntensityChange,  // Current wireframe intensity + function to update it
  
  // INTRICATE WIREFRAME PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  intricateWireframeSpiralColor, onIntricateWireframeSpiralColorChange,    // Current spiral color + function to update it
  intricateWireframeEdgeColor, onIntricateWireframeEdgeColorChange,        // Current edge color + function to update it
  
  // SCENE PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  cameraView, onCameraViewChange,                  // Current camera view mode + function to update it
  environment, onEnvironmentChange,                // Current environment setting + function to update it
  objectCount, onObjectCountChange,                // Current object count + function to update it
  animationStyle, onAnimationStyleChange,          // Current animation style + function to update it
  objectType, onObjectTypeChange,                  // Current object type + function to update it
  
  // LIGHTING PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  ambientLightColor, onAmbientLightColorChange,
  ambientLightIntensity, onAmbientLightIntensityChange,
  directionalLightColor, onDirectionalLightColorChange,
  directionalLightIntensity, onDirectionalLightIntensityChange,
  directionalLightX, onDirectionalLightXChange,
  directionalLightY, onDirectionalLightYChange,
  directionalLightZ, onDirectionalLightZChange
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

  // TRIGGERED BY: User dragging the shininess slider
  // DATA FLOW: slider onChange → handleShininessChange → onShininessChange(newValue) → App.jsx setState
  const handleShininessChange = (event) => {
    // Extract slider value as string, convert to number using parseFloat
    // parseFloat converts "100" → 100, "50.5" → 50.5
    const newShininess = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Shininess changed to:', newShininess)
    onShininessChange(newShininess) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User clicking/changing the specular color picker
  // DATA FLOW: color input onChange → handleSpecularColorChange → onSpecularColorChange(newColor) → App.jsx setState
  const handleSpecularColorChange = (event) => {
    // Color picker value is already a string like "#ff0000", no conversion needed
    const newColor = event.target.value  // Gets hex color string like "#ff0000"
    console.log('Specular color changed to:', newColor)
    onSpecularColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }
const handleScaleChange = (event) => {
  onScaleChange(parseFloat(event.target.value))
}
  // TRIGGERED BY: User dragging the specular intensity slider
  // DATA FLOW: slider onChange → handleSpecularIntensityChange → onSpecularIntensityChange(newValue) → App.jsx setState
  const handleSpecularIntensityChange = (event) => {
    // Extract slider value as string, convert to number using parseFloat
    const newIntensity = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Specular intensity changed to:', newIntensity)
    onSpecularIntensityChange(newIntensity) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User clicking/changing the base color picker
  // DATA FLOW: color input onChange → handleBaseColorChange → onBaseColorChange(newColor) → App.jsx setState
  const handleBaseColorChange = (event) => {
    // Color picker value is already a string like "#222222", no conversion needed
    const newColor = event.target.value  // Gets hex color string
    console.log('Base color changed to:', newColor)
    onBaseColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the wireframe intensity slider
  // DATA FLOW: slider onChange → handleWireframeIntensityChange → onWireframeIntensityChange(newValue) → App.jsx setState
  const handleWireframeIntensityChange = (event) => {
    // Extract slider value as string, convert to number using parseFloat
    const newIntensity = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Wireframe intensity changed to:', newIntensity)
    onWireframeIntensityChange(newIntensity) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User changing the intricate wireframe spiral color picker
  // DATA FLOW: color picker onChange → handleIntricateWireframeSpiralColorChange → onIntricateWireframeSpiralColorChange(newColor) → App.jsx setState
  const handleIntricateWireframeSpiralColorChange = (event) => {
    const newColor = event.target.value // Get color value as hex string (like "#ff0000")
    console.log('Intricate wireframe spiral color changed to:', newColor)
    onIntricateWireframeSpiralColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User changing the intricate wireframe edge color picker
  // DATA FLOW: color picker onChange → handleIntricateWireframeEdgeColorChange → onIntricateWireframeEdgeColorChange(newColor) → App.jsx setState
  const handleIntricateWireframeEdgeColorChange = (event) => {
    const newColor = event.target.value // Get color value as hex string (like "#00ff00")
    console.log('Intricate wireframe edge color changed to:', newColor)
    onIntricateWireframeEdgeColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User selecting from camera view dropdown
  // DATA FLOW: select onChange → handleCameraViewChange → onCameraViewChange(newView) → App.jsx setState
  const handleCameraViewChange = (event) => {
    // Dropdown value is already a string like "free", "orbit", etc. - no conversion needed
    const newView = event.target.value  // Gets selected option value as string
    console.log('Camera view changed to:', newView)
    onCameraViewChange(newView) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User selecting from environment dropdown
  // DATA FLOW: select onChange → handleEnvironmentChange → onEnvironmentChange(newEnv) → App.jsx setState
  const handleEnvironmentChange = (event) => {
    // Dropdown value is already a string like "purple", "space", etc. - no conversion needed
    const newEnv = event.target.value  // Gets selected option value as string
    console.log('Environment changed to:', newEnv)
    onEnvironmentChange(newEnv) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the object count slider
  // DATA FLOW: slider onChange → handleObjectCountChange → onObjectCountChange(newCount) → App.jsx setState
  const handleObjectCountChange = (event) => {
    // Extract slider value as string, convert to integer using parseInt
    // parseInt converts "5" → 5, "10" → 10 (whole numbers only)
    const newCount = parseInt(event.target.value)  // STRING → INTEGER conversion
    console.log('Object count changed to:', newCount)
    onObjectCountChange(newCount) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User selecting from animation style dropdown
  // DATA FLOW: select onChange → handleAnimationStyleChange → onAnimationStyleChange(newStyle) → App.jsx setState
  const handleAnimationStyleChange = (event) => {
    // Dropdown value is already a string like "rotate", "float", etc. - no conversion needed
    const newStyle = event.target.value  // Gets selected option value as string
    console.log('Animation style changed to:', newStyle)
    onAnimationStyleChange(newStyle) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User selecting from object type dropdown
  // DATA FLOW: select onChange → handleObjectTypeChange → onObjectTypeChange(newType) → App.jsx setState
  const handleObjectTypeChange = (event) => {
    // Dropdown value is already a string like "icosahedron", "sphere", etc. - no conversion needed
    const newType = event.target.value  // Gets selected option value as string
    console.log('Object type changed to:', newType)
    onObjectTypeChange(newType) // CALL App.jsx setter function → updates App.jsx state
  }


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
        
        {/* SPECULAR COLOR PICKER: User clicks/changes → handleSpecularColorChange → App.jsx setState */}
        <label>
          Specular Color: {/* Label shows current value from App.jsx: {specularColor} */}
        </label>
        {/* This color input DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user changes color */}
        <input 
          type="color" 
          value={specularColor}                  
          onChange={handleSpecularColorChange}   
        />

        {/* SPECULAR INTENSITY SLIDER: User drags → handleSpecularIntensityChange → App.jsx setState */}
        <label>
          Specular Intensity: <span className="value-display">{specularIntensity}</span> {/* Shows current value FROM App.jsx */}
        </label>
        {/* This range slider DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user drags slider */}
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.1"
          value={specularIntensity}                   
          onChange={handleSpecularIntensityChange}    
        />
        
        {/* SHININESS SLIDER: User drags → handleShininessChange → App.jsx setState */}
        <label>
          Shininess: <span className="value-display">{shininess}</span> {/* Shows current value FROM App.jsx */}
        </label>
        {/* This range slider DISPLAYS current value FROM App.jsx and TRIGGERS handler WHEN user drags slider */}
        <input 
          type="range" 
          min="1" 
          max="2000" 
          value={shininess}
          onChange={handleShininessChange}
        />

        {/* Wireframe visibility toggle */}
        <label className="futuristic-checkbox-label">
          <input
            type="checkbox"
            checked={wireframeIntensity > 0}
            onChange={e => onWireframeIntensityChange(e.target.checked ? 100 : 0)}
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

        {/* Inner wireframe spiral color picker */}
        <label>
          Inner Wireframe Spiral Color:
        </label>
        <input 
          type="color" 
          value={intricateWireframeSpiralColor}
          onChange={handleIntricateWireframeSpiralColorChange}
        />

        {/* Inner wireframe edge color picker */}
        <label>
          Inner Wireframe Edge Color:
        </label>
        <input 
          type="color" 
          value={intricateWireframeEdgeColor}
          onChange={handleIntricateWireframeEdgeColorChange}
        />

        {/* Object Type Control */}
        <label>
          Object Type:
        </label>
        <select value={objectType} onChange={handleObjectTypeChange}>
          <option value="icosahedron">💎 Icosahedron</option>
          <option value="sphere">⚪ Sphere</option>
          <option value="box">📦 Box</option>
          <option value="octahedron">🔷 Octahedron</option>
          <option value="tetrahedron">🔺 Tetrahedron</option>
          <option value="torusknot">🌀 Torus Knot</option>
        </select>

        {/* Animation Style Control */}
        <label>
          Animation Style:
        </label>
        <select value={animationStyle} onChange={handleAnimationStyleChange}>
          <option value="rotate">Simple Rotation</option>
          <option value="float">Floating Dance</option>
          <option value="spiral">Spiral Motion</option>
          <option value="chaos">Chaotic Movement</option>
          <option value="alien">Omni</option>
          <option value="dna">🧬 DNA Helix</option>
          <option value="liquid">🌊 Liquid Metal</option>
          <option value="magnetic">🧲 Magnetic Field</option>
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
          <option value="side">Side View</option>
          <option value="cinematic">Cinematic</option>
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
          directionalLightX={directionalLightX}
          onDirectionalLightXChange={onDirectionalLightXChange}
          directionalLightY={directionalLightY}
          onDirectionalLightYChange={onDirectionalLightYChange}
          directionalLightZ={directionalLightZ}
          onDirectionalLightZChange={onDirectionalLightZChange}
        />
      )}
      </div>
    </>
  )
}

export default Controls