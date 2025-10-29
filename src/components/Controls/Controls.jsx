import React, { useState } from 'react';
import styles from './Controls.module.scss';
import LightingControls from './LightingControls';
import SaveButton from './SaveButton/SaveButton';
import {
  createMetalnessHandler,
  createScaleHandler,
  createEmissiveIntensityHandler,
  createBaseColorHandler,
  createWireframeIntensityHandler,
  createWireframeToggleHandler,
  createHyperframeColorHandler,
  createHyperframeLineColorHandler,
  createCameraViewHandler,
  createEnvironmentHandler,
  createEnvironmentHueHandler,
  createObjectCountHandler,
  createAnimationStyleHandler,
  createObjectTypeHandler,
} from './controlsHandlers';

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
}) {
  
  // LOCAL STATE - These are managed by Controls component itself (NOT from App.jsx)
  // These control whether each section is expanded or collapsed in the UI
  const [materialOpen, setMaterialOpen] = useState(false)   // Material Properties section closed by default
  const [sceneOpen, setSceneOpen] = useState(false)         // Scene Controls section closed by default
  const [lightingOpen, setLightingOpen] = useState(false)   // Lighting Controls section closed by default
  const [isHidden, setIsHidden] = useState(false)           // Controls panel visibility state

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
  
  // Create handler functions using factories from controlsHandlers.js
  const handleMetalnessChange = createMetalnessHandler(onMetalnessChange);
  const handleScaleChange = createScaleHandler(onScaleChange);
  const handleEmissiveIntensityChange = createEmissiveIntensityHandler(onEmissiveIntensityChange);
  const handleBaseColorChange = createBaseColorHandler(onBaseColorChange);
  const handleWireframeIntensityChange = createWireframeIntensityHandler(onWireframeIntensityChange);
  const handleWireframeToggle = createWireframeToggleHandler(onWireframeIntensityChange);
  const handleHyperframeColorChange = createHyperframeColorHandler(onHyperframeColorChange);
  const handleHyperframeLineColorChange = createHyperframeLineColorHandler(onHyperframeLineColorChange);
  const handleCameraViewChange = createCameraViewHandler(onCameraViewChange);
  const handleEnvironmentChange = createEnvironmentHandler(onEnvironmentChange);
  const handleEnvironmentHueChange = createEnvironmentHueHandler(onEnvironmentHueChange);
  const handleObjectCountChange = createObjectCountHandler(onObjectCountChange);
  const handleAnimationStyleChange = createAnimationStyleHandler(onAnimationStyleChange);
  const handleObjectTypeChange = createObjectTypeHandler(onObjectTypeChange);


  // Lighting event handlers are now handled in LightingControls

  /*
   * JSX RETURN - THE USER INTERFACE
   * This section connects UI elements to handler functions
   * Look for onChange attributes to see which elements trigger which handlers
   */
  return (
    <>
      {/* Toggle Button - Shows when controls are hidden */}
      {isHidden && (
        <button 
          className={`${styles.controlsToggleBtn} ${styles.controlsToggleBtnShow}`}
          onClick={() => setIsHidden(false)}
          title="Show Controls"
        >
          ◀
        </button>
      )}

      <div className={`${styles.controls} ${isHidden ? styles.controlsHidden : ''}`}>
        {/* Hide Button - Shows when controls are visible */}
        <button 
          className={`${styles.controlsToggleBtn} ${styles.controlsToggleBtnHide}`}
          onClick={() => setIsHidden(true)}
          title="Hide Controls"
        >
          <span>▶</span>
          <span className={styles.controlsToggleText}>Hide</span>
        </button>

      {/* 
       * DEBUG DISPLAY SECTION
       * Shows current values FROM App.jsx - these update automatically when state changes
       * These are NOT interactive - they just display the current values
       */}
      
   
      
      <hr />

      {/* COLLAPSIBLE SECTION: MATERIAL PROPERTIES */}
      <div 
        className={`${styles.sectionHeader} ${materialOpen ? styles.sectionHeaderMaterialOpen : styles.sectionHeaderMaterialClosed}`}
        onClick={() => setMaterialOpen(!materialOpen)} // CLICK HANDLER: Toggles section open/closed - updates LOCAL state
      >
        <span>🎨 MATERIAL PROPERTIES</span>
        <span>{materialOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`${styles.sectionContent} ${materialOpen ? `${styles.sectionContentMaterialOpen} ${styles.sectionContentOpen}` : styles.sectionContentClosed}`}>
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
          Emissive Intensity: <span className={styles.valueDisplay}>{emissiveIntensity.toFixed(1)}</span> {/* Shows current value FROM App.jsx */}
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
          Metalness: <span className={styles.valueDisplay}>{metalness.toFixed(2)}</span> {/* Shows current value FROM App.jsx */}
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
        <label className={styles.futuristicCheckboxLabel}>
          <input
            type="checkbox"
            checked={wireframeIntensity > 0}
            onChange={handleWireframeToggle}
            className={styles.futuristicCheckbox}
          />
          <span className={styles.futuristicCustomCheckbox}></span>
          <span className={styles.futuristicCheckboxText}>Wireframe</span>
        </label>
        {/* Wireframe intensity slider */}
        <label>
          Wireframe Intensity: <span className={styles.valueDisplay}>{wireframeIntensity}%</span>
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
          <option value="compoundquantummanifold">
            🌀 Cpd-Quantum Manifold
          </option>
          <option value="icosahedron">🔯 Cpd-Icosahedron</option>
          <option value="sphere">⚪ Cpd-Sphere (Cross)</option>
          <option value="compoundsphere">💫 Super-Cpd-Sphere</option>
          <option value="compoundfloatingcity">🌆 Compound Curves</option>
          <option value="hessianpolychoron">✦ Hessian Polychoron</option>
          <option value="mobiussphere">🌀 Möbius Sphere</option>
          <option value="cube">🧊 Cube</option>
          <option value="box">🔷 Cpd-Tesseract</option>
          <option value="cpdtesseract">💎 Mega-Tesseract</option>
          <option value="cpd-megatesseract">💎💎💎 Cpd-Mega-Tesseract</option>
          <option value="cpd-megatesseract-2">💎💎 Cpd-Mega-Tesseract II</option>
          <option value="cpd-megatesseract-3">💎💎💎 Cpd-Mega-Tesseract III</option>
          <option value="cpd-megatesseract-4">💎💎💎 Cpd-Mega-Tesseract IV</option>
          <option value="octahedron">🔸 Cpd-Octahedron</option>
          <option value="tetrahedron">🔻 Cpd-Tetrahedron</option>
          <option value="120cell">🌐 120-Cell</option>
          <option value="compound120cell">🌌 Cpd-120-Cell</option>
          <option value="600cell">🔮 600-Cell</option>
          <option value="compound600cell">✨ Cpd-600-Cell</option>
          <option value="24cell">⬡ 24-Cell</option>
          <option value="compound24cell">🔶 Cpd-24-Cell</option>
          <option value="16cell">◆ 16-Cell</option>
        </select>

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
        className={`${styles.sectionHeader} ${sceneOpen ? styles.sectionHeaderSceneOpen : styles.sectionHeaderSceneClosed}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA & SCENE</span>
        <span>{sceneOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`${styles.sectionContent} ${sceneOpen ? `${styles.sectionContentSceneOpen} ${styles.sectionContentOpen}` : styles.sectionContentClosed}`}>
        {/* Scale Control */}
        <label>
          Scale: <span className={styles.valueDisplay}>{scale.toFixed(1)}</span>
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
          Environment Hue: <span className={styles.valueDisplay}>{environmentHue}°</span>
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
          Object Count: <span className={styles.valueDisplay}>{objectCount}</span>
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
        className={`${styles.sectionHeader} ${lightingOpen ? styles.sectionHeaderLightingOpen : styles.sectionHeaderLightingClosed}`}
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