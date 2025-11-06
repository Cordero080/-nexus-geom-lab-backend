import React, { useState } from 'react';
import styles from './Controls.module.scss';
import LightingControls from './LightingControls';
import MaterialPropertiesSection from './sections/MaterialPropertiesSection';
import SceneControlsSection from './sections/SceneControlsSection';
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
  const [lightingOpen, setLightingOpen] = useState(false)   // Lighting Controls section closed by default
  const [isHidden, setIsHidden] = useState(true)            // Controls panel hidden by default on page load
  // Note: materialOpen, surfaceOpen, geometryOpen, sceneOpen are now managed in their respective section components

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

  // ====================================
  // GROUPED PROPS FOR CHILD COMPONENTS
  // ====================================
  
  // GROUP 1: Surface Properties (colors, metalness, emissive)
  const surfaceProps = {
    baseColor,
    handleBaseColorChange,
    emissiveIntensity,
    handleEmissiveIntensityChange,
    metalness,
    handleMetalnessChange,
  };

  // GROUP 2: Geometry & Effects (wireframe, hyperframe, object types)
  const geometryProps = {
    wireframeIntensity,
    handleWireframeIntensityChange,
    handleWireframeToggle,
    hyperframeColor,
    handleHyperframeColorChange,
    hyperframeLineColor,
    handleHyperframeLineColorChange,
    objectType,
    handleObjectTypeChange,
    animationStyle,
    handleAnimationStyleChange,
  };

  // GROUP 3: Animation Speeds
  const speedProps = {
    objectSpeed,
    handleObjectSpeedChange,
    orbSpeed,
    handleOrbSpeedChange,
  };

  // GROUP 4: Scene/Camera Controls
  const sceneProps = {
    scale,
    onScaleChange,
    handleScaleChange,
    cameraView,
    onCameraViewChange,
    environment,
    onEnvironmentChange,
    environmentHue,
    onEnvironmentHueChange,
    handleEnvironmentHueChange,
    objectCount,
    onObjectCountChange,
    handleObjectCountChange,
  };

  // GROUP 5: Lighting Controls
  const lightingProps = {
    ambientLightColor,
    onAmbientLightColorChange,
    ambientLightIntensity,
    onAmbientLightIntensityChange,
    directionalLightColor,
    onDirectionalLightColorChange,
    directionalLightIntensity,
    onDirectionalLightIntensityChange,
  };

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

      {/* MATERIAL PROPERTIES SECTION - Now modularized with grouped props */}
      <MaterialPropertiesSection
        {...surfaceProps}      // Base color, emissive, metalness
        {...geometryProps}     // Wireframe, hyperframe, object type, animation style
        {...speedProps}        // Object speed, orb speed
      />

      {/* SCENE CONTROLS SECTION - Now modularized with grouped props */}
      <SceneControlsSection
        {...sceneProps}        // Scale, camera, environment, object count
      />

      {/* LIGHTING CONTROLS SECTION */}
      <div 
        className={`${styles.sectionHeader} ${lightingOpen ? styles.sectionHeaderLightingOpen : styles.sectionHeaderLightingClosed}`}
        onClick={() => setLightingOpen(!lightingOpen)}
      >
        <span>💡 LIGHTING CONTROLS</span>
        <span>{lightingOpen ? '▼' : '▶'}</span>
      </div>
      
      {lightingOpen && (
        <LightingControls {...lightingProps} />
      )}
      </div>
    </>
  )
}

export default Controls