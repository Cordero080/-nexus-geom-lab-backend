import React, { useState } from 'react';
import styles from './Controls.module.scss';
import LightingControls from './LightingControls';
import CustomSelect from '../../ui/CustomSelect/CustomSelect';
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

/*
 * DATA FLOW EXAMPLE (using metalness):
 * 1. App.jsx has: setMetalness (the actual function)
 *                     ↓
 * 2. App.jsx passes it as: onMetalnessChange={setMetalness}
 *                     ↓
 * 3. Controls.jsx receives: onMetalnessChange (as a prop)
 *                     ↓
 * 4. Controls wraps it: handleMetalnessChange = createMetalnessHandler(onMetalnessChange)
 *                     ↓
 * 5. Slider uses it: onChange={handleMetalnessChange}
 *                     ↓
 * 6. User moves slider → handleMetalnessChange fires → onMetalnessChange(newValue) → setMetalness updates App.jsx state
 */

// PROPS RECEIVED FROM App.jsx - These are the data connections
function Controls({ 
  // MATERIAL PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
  scale, onScaleChange,                            // Current scale value + function to update it
  objectSpeed, onObjectSpeedChange,                // Current object animation speed + function to update it
  orbSpeed, onOrbSpeedChange,                      // Current orb animation speed + function to update it
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
  const [materialOpen, setMaterialOpen] = useState(false)    // Material Properties section collapsed by default
  const [surfaceOpen, setSurfaceOpen] = useState(true)      // Surface subsection open by default
  const [geometryOpen, setGeometryOpen] = useState(true)    // Geometry subsection open by default
  const [sceneOpen, setSceneOpen] = useState(false)         // Scene Controls section closed by default
  const [lightingOpen, setLightingOpen] = useState(false)   // Lighting Controls section closed by default
  const [isHidden, setIsHidden] = useState(true)            // Controls panel hidden by default on page load

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
  const handleObjectSpeedChange = (e) => onObjectSpeedChange(parseFloat(e.target.value));
  const handleOrbSpeedChange = (e) => onOrbSpeedChange(parseFloat(e.target.value));
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
          <span>◀</span>
          <span className={styles.controlsToggleText}>Controls</span>
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
        
        {/* NESTED SUBSECTION: SURFACE PROPERTIES */}
        <div 
          className={`${styles.subSectionHeader} ${surfaceOpen ? styles.subSectionHeaderOpen : styles.subSectionHeaderClosed}`}
          onClick={(e) => { e.stopPropagation(); setSurfaceOpen(!surfaceOpen); }}
        >
          <span>✨ Surface</span>
          <span>{surfaceOpen ? '▼' : '▶'}</span>
        </div>
        
        <div className={`${styles.subSectionContent} ${surfaceOpen ? styles.subSectionContentOpen : styles.subSectionContentClosed}`}>
          {/* BASE COLOR PICKER */}
          <label>
            Base Color:
          </label>
          <input 
            type="color" 
            value={baseColor}                      
            onChange={handleBaseColorChange}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />
          
          {/* EMISSIVE INTENSITY SLIDER */}
          <label>
            Emissive Intensity: <span className={styles.valueDisplay}>{emissiveIntensity.toFixed(1)}</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            value={emissiveIntensity}                   
            onChange={handleEmissiveIntensityChange}    
          />
          
          {/* METALNESS SLIDER */}
          <label>
            Metalness: <span className={styles.valueDisplay}>{metalness.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={metalness}
            onChange={handleMetalnessChange}
          />
        </div>

        {/* NESTED SUBSECTION: GEOMETRY & EFFECTS */}
        <div 
          className={`${styles.subSectionHeader} ${geometryOpen ? styles.subSectionHeaderOpen : styles.subSectionHeaderClosed}`}
          onClick={(e) => { e.stopPropagation(); setGeometryOpen(!geometryOpen); }}
        >
          <span>🔷 Geometry & Effects</span>
          <span>{geometryOpen ? '▼' : '▶'}</span>
        </div>
        
        <div className={`${styles.subSectionContent} ${geometryOpen ? styles.subSectionContentOpen : styles.subSectionContentClosed}`}>
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
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />

          {/* Hyperframe lines color picker */}
          <label>
            Hyperframe Lines Color:
          </label>
          <input 
            type="color" 
            value={hyperframeLineColor}
            onChange={handleHyperframeLineColorChange}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />

          {/* Object Type Control */}
          <label>
            Object Type:
          </label>
          <CustomSelect
            value={objectType}
            onChange={onObjectTypeChange}
            options={[
              { value: 'quantummanifold', label: '∞ Quantum Manifold (Klein+)' },
              { value: 'compoundquantummanifold', label: '◈ Cpd-Quantum Manifold' },
              { value: 'icosahedron', label: '⬢ Cpd-Icosahedron' },
              { value: 'sphere', label: '● Cpd-Sphere' },
              { value: 'compoundsphere', label: '◉ Super-Cpd-Sphere' },
              { value: 'compoundfloatingcity', label: '∿ Compound Curves' },
              { value: 'hessianpolychoron', label: '✦ Hessian Polychoron' },
              { value: 'mobiussphere', label: '⟲ Möbius Sphere' },
              { value: 'cube', label: '■ Cube' },
              { value: 'box', label: '▦ Cpd-Tesseract' },
              { value: 'cpdtesseract', label: '◆ Mega-Tesseract' },
              { value: 'cpd-megatesseract', label: '◇ Cpd-Mega-Tesseract' },
              { value: 'cpd-megatesseract-2', label: '◈ Cpd-Mega-Tesseract II' },
              { value: 'cpd-megatesseract-3', label: '⬙ Cpd-Mega-Tesseract III' },
              { value: 'cpd-megatesseract-4', label: '⬥ Cpd-Mega-Tesseract IV' },
              { value: 'octahedron', label: '◇ Cpd-Octahedron' },
              { value: 'tetrahedron', label: '▲ Cpd-Tetrahedron' },
              { value: '120cell', label: '⬡ 120-Cell' },
              { value: 'compound120cell', label: '⬢ Cpd-120-Cell' },
              { value: '600cell', label: '⬣ 600-Cell' },
              { value: 'compound600cell', label: '⬤ Cpd-600-Cell' },
              { value: '24cell', label: '⬟ 24-Cell' },
              { value: 'compound24cell', label: '⬠ Cpd-24-Cell' },
              { value: '16cell', label: '◆ 16-Cell' },
            ]}
          />

          {/* Animation Style Control */}
          <label>
            Animation Style:
          </label>
          <CustomSelect
            value={animationStyle}
            onChange={onAnimationStyleChange}
            options={[
            { value: 'rotate', label: 'Simple Rotation' },
            { value: 'float', label: 'Floating Dance' },
            { value: 'omniIntel', label: 'Omni-Intel' },
          ]}
        />

        {/* Object Speed Control */}
        <label>
          Object Speed: <span className={styles.valueDisplay}>{(objectSpeed || 1.0).toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={objectSpeed || 1.0}
          onChange={handleObjectSpeedChange}
        />

        {/* Orb Speed Control */}
        <label>
          Orb Speed: <span className={styles.valueDisplay}>{(orbSpeed || 1.0).toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={orbSpeed || 1.0}
          onChange={handleOrbSpeedChange}
        />
        </div>
      </div>

      {/* NEW: SCENE CONTROLS SECTION */}
      <div 
        className={`${styles.sectionHeader} ${sceneOpen ? styles.sectionHeaderSceneOpen : styles.sectionHeaderSceneClosed}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA/SCENE</span>
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
        <CustomSelect
          value={cameraView}
          onChange={onCameraViewChange}
          options={[
            { value: 'free', label: 'Free Camera' },
            { value: 'orbit', label: 'Orbit View' },
            { value: 'top', label: 'Top Down' },
          ]}
        />

        {/* Environment Control */}
        <label>
          Environment:
        </label>
        <CustomSelect
          value={environment}
          onChange={onEnvironmentChange}
          options={[
            { value: 'nebula', label: 'Nebula' },
            { value: 'space', label: 'Space Scene' },
            { value: 'sunset', label: 'Sunset Sky' },
            { value: 'matrix', label: 'Matrix Code' },
          ]}
        />

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