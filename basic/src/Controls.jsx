/*
 * CONTROLS.JSX - DETAILED DATA FLOW EXPLANATION
 * 
 * PURPOSE: This component creates the user interface that allows users to control the 3D scene
 * 
 * COMPLETE DATA FLOW TRACE:
 * 1. USER INTERACTION: User moves slider, clicks color picker, selects dropdown option
 * 2. BROWSER EVENT: Browser creates 'change' event with event.target.value containing new value
 * 3. REACT HANDLER: onChange attribute calls our handler function (e.g., handleShininessChange)
 * 4. VALUE EXTRACTION: Handler extracts value from event.target.value (usually a string)
 * 5. TYPE CONVERSION: Handler converts string to appropriate type (parseFloat, parseInt, or keep as string)
 * 6. PARENT CALLBACK: Handler calls the setter function passed from App.jsx (e.g., onShininessChange)
 * 7. STATE UPDATE: App.jsx updates its state using the setter function (e.g., setShininess)
 * 8. RE-RENDER CASCADE: App.jsx re-renders and passes new values to both Controls and ThreeScene
 * 9. UI SYNC: Controls displays updated value, ThreeScene updates 3D scene
 * 
 * KEY CONCEPTS:
 * - VALUES FLOW DOWN: App.jsx → Controls (as props like 'shininess')
 * - FUNCTIONS FLOW DOWN: App.jsx → Controls (as props like 'onShininessChange')
 * - UPDATES FLOW UP: Controls → App.jsx (via function calls)
 * - parseFloat() converts "1.5" → 1.5 (decimal numbers)
 * - parseInt() converts "5" → 5 (whole numbers)
 * - Color values stay as strings like "#ff0000"
 * 
 * EXAMPLE TRACE: User moves shininess slider
 * 1. User drags slider → Browser fires onChange event
 * 2. onChange={handleShininessChange} calls our function
 * 3. handleShininessChange gets event, extracts event.target.value
 * 4. parseFloat(event.target.value) converts "100" → 100
 * 5. onShininessChange(100) calls App.jsx's setShininess function
 * 6. App.jsx state updates, re-renders, passes new shininess value back down
 * 7. ThreeScene receives new shininess and updates 3D material
 */

import { useState } from 'react' // Import React's useState hook for managing collapsible section state

/*
 * CONTROLS COMPONENT - User Interface for Three.js Scene
 * 
 * DATA FLOW OVERVIEW:
 * 1. App.jsx creates state variables (like shininess, specularColor, etc.)
 * 2. App.jsx passes these VALUES and their SETTER FUNCTIONS as props to Controls
 * 3. Controls receives: current values + functions to update those values
 * 4. User interacts with Controls UI (sliders, color pickers, dropdowns)
 * 5. Controls calls the setter functions, which update App.jsx state
 * 6. Updated state flows back down to ThreeScene.jsx to update the 3D scene
 * 
 * NAMING PATTERN:
 * - Values: shininess, specularColor, etc. (FROM App.jsx)
 * - Setters: onShininessChange, onSpecularColorChange, etc. (FROM App.jsx)
 * - Handlers: handleShininessChange, handleSpecularColorChange, etc. (CREATED in Controls)
 */

// PROPS RECEIVED FROM App.jsx - These are the data connections
function Controls({ 
  // MATERIAL PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  scale, onScaleChange,                            // Current scale value + function to update it
  shininess, onShininessChange,                    // Current shininess value + function to update it
  specularColor, onSpecularColorChange,            // Current specular color + function to update it
  specularIntensity, onSpecularIntensityChange,    // Current specular intensity + function to update it
  baseColor, onBaseColorChange,                    // Current base color + function to update it
  wireframeIntensity, onWireframeIntensityChange,  // Current wireframe intensity + function to update it
  
  // SCENE PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  cameraView, onCameraViewChange,                  // Current camera view mode + function to update it
  environment, onEnvironmentChange,                // Current environment setting + function to update it
  objectCount, onObjectCountChange,                // Current object count + function to update it
  animationStyle, onAnimationStyleChange,          // Current animation style + function to update it
  objectType, onObjectTypeChange,                  // Current object type + function to update it
  
  // LIGHTING PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  ambientLightColor, onAmbientLightColorChange,           // Current ambient light color + function to update it
  ambientLightIntensity, onAmbientLightIntensityChange,   // Current ambient light intensity + function to update it
  directionalLightColor, onDirectionalLightColorChange,   // Current directional light color + function to update it
  directionalLightIntensity, onDirectionalLightIntensityChange, // Current directional light intensity + function to update it
  directionalLightX, onDirectionalLightXChange,           // Current directional light X position + function to update it
  directionalLightY, onDirectionalLightYChange,           // Current directional light Y position + function to update it
  directionalLightZ, onDirectionalLightZChange            // Current directional light Z position + function to update it
}) {
  
  // LOCAL STATE - These are managed by Controls component itself (NOT from App.jsx)
  // These control whether each section is expanded or collapsed in the UI
  const [materialOpen, setMaterialOpen] = useState(true)   // Material Properties section expanded by default
  const [sceneOpen, setSceneOpen] = useState(true)         // Scene Controls section expanded by default
  const [lightingOpen, setLightingOpen] = useState(true)   // Lighting Controls section expanded by default

  /*
   * EVENT HANDLER FUNCTIONS
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

  /* 
   * LIGHTING CONTROL EVENT HANDLERS
   * These handle all lighting-related user interactions
   */

  // TRIGGERED BY: User clicking/changing the ambient light color picker
  // DATA FLOW: color input onChange → handleAmbientLightColorChange → onAmbientLightColorChange(newColor) → App.jsx setState
  const handleAmbientLightColorChange = (event) => {
    // Color picker value is already a string like "#ffffff", no conversion needed
    const newColor = event.target.value  // Gets hex color string
    console.log('Ambient light color changed to:', newColor)
    onAmbientLightColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the ambient light intensity slider
  // DATA FLOW: slider onChange → handleAmbientLightIntensityChange → onAmbientLightIntensityChange(newIntensity) → App.jsx setState
  const handleAmbientLightIntensityChange = (event) => {
    // Extract slider value as string, convert to decimal number using parseFloat
    const newIntensity = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Ambient light intensity changed to:', newIntensity)
    onAmbientLightIntensityChange(newIntensity) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User clicking/changing the directional light color picker
  // DATA FLOW: color input onChange → handleDirectionalLightColorChange → onDirectionalLightColorChange(newColor) → App.jsx setState
  const handleDirectionalLightColorChange = (event) => {
    // Color picker value is already a string like "#ffffff", no conversion needed
    const newColor = event.target.value  // Gets hex color string
    console.log('Directional light color changed to:', newColor)
    onDirectionalLightColorChange(newColor) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the directional light intensity slider
  // DATA FLOW: slider onChange → handleDirectionalLightIntensityChange → onDirectionalLightIntensityChange(newIntensity) → App.jsx setState
  const handleDirectionalLightIntensityChange = (event) => {
    // Extract slider value as string, convert to decimal number using parseFloat
    const newIntensity = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Directional light intensity changed to:', newIntensity)
    onDirectionalLightIntensityChange(newIntensity) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the directional light X position slider
  // DATA FLOW: slider onChange → handleDirectionalLightXChange → onDirectionalLightXChange(newX) → App.jsx setState
  const handleDirectionalLightXChange = (event) => {
    // Extract slider value as string, convert to decimal number using parseFloat
    const newX = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Directional light X changed to:', newX)
    onDirectionalLightXChange(newX) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the directional light Y position slider
  // DATA FLOW: slider onChange → handleDirectionalLightYChange → onDirectionalLightYChange(newY) → App.jsx setState
  const handleDirectionalLightYChange = (event) => {
    // Extract slider value as string, convert to decimal number using parseFloat
    const newY = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Directional light Y changed to:', newY)
    onDirectionalLightYChange(newY) // CALL App.jsx setter function → updates App.jsx state
  }

  // TRIGGERED BY: User dragging the directional light Z position slider
  // DATA FLOW: slider onChange → handleDirectionalLightZChange → onDirectionalLightZChange(newZ) → App.jsx setState
  const handleDirectionalLightZChange = (event) => {
    // Extract slider value as string, convert to decimal number using parseFloat
    const newZ = parseFloat(event.target.value)  // STRING → NUMBER conversion
    console.log('Directional light Z changed to:', newZ)
    onDirectionalLightZChange(newZ) // CALL App.jsx setter function → updates App.jsx state
  }

  /*
   * JSX RETURN - THE USER INTERFACE
   * This section connects UI elements to handler functions
   * Look for onChange attributes to see which elements trigger which handlers
   */
  return (
    <div className="controls">
      {/* 
       * DEBUG DISPLAY SECTION
       * Shows current values FROM App.jsx - these update automatically when state changes
       * These are NOT interactive - they just display the current values
       */}
      <p>Current shininess: {shininess}</p>                                    {/* Displays current shininess value from App.jsx */}
      <p>Current specular: {specularColor}</p>                                {/* Displays current specular color from App.jsx */}
      <p>Current specular intensity: {specularIntensity}</p>                  {/* Displays current specular intensity from App.jsx */}
      <p>Current base: {baseColor}</p>                                        {/* Displays current base color from App.jsx */}
      <p>Current wireframe intensity: {wireframeIntensity}%</p>               {/* Displays current wireframe intensity from App.jsx */}
      <p>Camera: {cameraView} | Environment: {environment}</p>                {/* Displays current camera view and environment from App.jsx */}
      <p>Objects: {objectCount} | Animation: {animationStyle}</p>             {/* Displays current object count and animation style from App.jsx */}
      <p>Object Type: {objectType}</p>                                        {/* Displays current object type from App.jsx */}
      <p>Ambient: {ambientLightColor} @ {ambientLightIntensity}</p>           {/* Displays current ambient light values from App.jsx */}
      <p>Directional: {directionalLightColor} @ {directionalLightIntensity}</p> {/* Displays current directional light values from App.jsx */}
      <p>Dir Position: ({directionalLightX}, {directionalLightY}, {directionalLightZ})</p> {/* Displays current directional light position from App.jsx */}
      
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
      </div>
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
      {/* NEW: SCENE CONTROLS SECTION */}
      <div 
        className={`section-header ${sceneOpen ? 'scene-open' : 'scene-closed'}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA & SCENE</span>
        <span>{sceneOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${sceneOpen ? 'scene-open open' : 'closed'}`}>
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
          <option value="purple">Purple Gradient</option>
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
          <option value="dna">🧬 DNA Helix</option>
          <option value="liquid">🌊 Liquid Metal</option>
          <option value="magnetic">🧲 Magnetic Field</option>
        </select>
      </div>

      {/* NEW: LIGHTING CONTROLS SECTION */}
      <div 
        className={`section-header ${lightingOpen ? 'lighting-open' : 'lighting-closed'}`}
        onClick={() => setLightingOpen(!lightingOpen)}
      >
        <span>💡 LIGHTING CONTROLS</span>
        <span>{lightingOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${lightingOpen ? 'lighting-open open' : 'closed'}`}>
        {/* Ambient Light Controls */}
        <label>
          Ambient Light Color:
        </label>
        <input 
          type="color" 
          value={ambientLightColor}
          onChange={handleAmbientLightColorChange}
        />

        <label>
          Ambient Light Intensity: <span className="value-display">{ambientLightIntensity.toFixed(2)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.05"
          value={ambientLightIntensity}
          onChange={handleAmbientLightIntensityChange}
        />

        {/* Directional Light Controls */}
        <label>
          Directional Light Color:
        </label>
        <input 
          type="color" 
          value={directionalLightColor}
          onChange={handleDirectionalLightColorChange}
        />

        <label>
          Directional Light Intensity: <span className="value-display">{directionalLightIntensity.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="20" 
          step="0.5"
          value={directionalLightIntensity}
          onChange={handleDirectionalLightIntensityChange}
        />

        {/* Directional Light Position Controls */}
        <label>
          Directional Light X: <span className="value-display">{directionalLightX.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightX}
          onChange={handleDirectionalLightXChange}
        />

        <label>
          Directional Light Y: <span className="value-display">{directionalLightY.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightY}
          onChange={handleDirectionalLightYChange}
        />

        <label>
          Directional Light Z: <span className="value-display">{directionalLightZ.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightZ}
          onChange={handleDirectionalLightZChange}
        />
      </div>

    </div>
  )
}

export default Controls