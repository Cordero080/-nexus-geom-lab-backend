import React, { useState } from 'react';
import styles from './Controls.module.scss';
import LightingControls from './LightingControls';
import MaterialPropertiesSection from './_sections/MaterialPropertiesSection';
import SceneControlsSection from './_sections/SceneControlsSection';
import CustomSelect from '@/components/ui/CustomSelect/CustomSelect';
import {
  createMetalnessHandler,
  createScaleHandler,
  createEmissiveIntensityHandler,
  createBaseColorHandler,
  createWireframeIntensityHandler,
  createWireframeToggleHandler,
  createHyperframeColorHandler,
  createHyperframeLineColorHandler,
  createEnvironmentHueHandler,
  createObjectCountHandler,
  createAnimationStyleHandler,
  createObjectTypeHandler,
} from './controlsHandlers';

/*
 * DATA FLOW EXAMPLE (using metalness):
 * 1. App.jsx has: setMetalness (the actual function)
 *                     ↓
 * 2. App.jsx passes it in onChange object: onChange.setMetalness
 *                     ↓
 * 3. Controls.jsx receives: onChange.setMetalness (as a prop)
 *                     ↓
 * 4. Controls wraps it: handleMetalnessChange = createMetalnessHandler(onChange.setMetalness)
 *                     ↓
 * 5. Slider uses it: onChange={handleMetalnessChange}
 *                     ↓
 * 6. User moves slider → handleMetalnessChange fires → onChange.setMetalness(newValue) → setMetalness updates App.jsx state
 */

// PROPS RECEIVED FROM App.jsx - config object and onChange object with all setters
function Controls({ config, onChange }) {
  // Destructure all current values from config
  const {
    // MATERIAL PROPERTIES
    scale,
    objectSpeed,
    orbSpeed,
    metalness,
    emissiveIntensity,
    baseColor,
    wireframeIntensity,
    // HYPERFRAME PROPERTIES
    hyperframeColor,
    hyperframeLineColor,
    // SCENE PROPERTIES
    cameraView,
    environment,
    environmentHue,
    objectCount,
    animationStyle,
    objectType,
    // LIGHTING PROPERTIES
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
  } = config;
  // LOCAL STATE - These are managed by Controls component itself (NOT from App.jsx)
  // These control whether each section is expanded or collapsed in the UI
  const [lightingOpen, setLightingOpen] = useState(false); // Lighting Controls section closed by default
  const [isHidden, setIsHidden] = useState(true); // Controls panel hidden by default on page load
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
  // Now using onChange object instead of individual setter props

  // example to track the flow for metalness:
  // handleMetalnessChange(event) →
  // onChange.setMetalness(newValue) →
  // setMetalness(newValue)
  const handleMetalnessChange = createMetalnessHandler(onChange.setMetalness);
  const handleScaleChange = createScaleHandler(onChange.setScale);
  const handleObjectSpeedChange = (e) => onChange.setObjectSpeed(parseFloat(e.target.value));
  const handleOrbSpeedChange = (e) => onChange.setOrbSpeed(parseFloat(e.target.value));
  const handleEmissiveIntensityChange = createEmissiveIntensityHandler(onChange.setEmissiveIntensity);
  const handleBaseColorChange = createBaseColorHandler(onChange.setBaseColor);
  const handleWireframeIntensityChange = createWireframeIntensityHandler(
    onChange.setWireframeIntensity
  );
  const handleWireframeToggle = createWireframeToggleHandler(onChange.setWireframeIntensity);
  const handleHyperframeColorChange = createHyperframeColorHandler(onChange.setHyperframeColor);
  const handleHyperframeLineColorChange = createHyperframeLineColorHandler(
    onChange.setHyperframeLineColor
  );
  const handleEnvironmentHueChange = createEnvironmentHueHandler(onChange.setEnvironmentHue);
  const handleObjectCountChange = createObjectCountHandler(onChange.setObjectCount);
  const handleAnimationStyleChange = createAnimationStyleHandler(onChange.setAnimationStyle);
  const handleObjectTypeChange = createObjectTypeHandler(onChange.setObjectType);

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
    onScaleChange: onChange.setScale,
    handleScaleChange,
    cameraView,
    onCameraViewChange: onChange.setCameraView,
    environment,
    onEnvironmentChange: onChange.setEnvironment,
    environmentHue,
    onEnvironmentHueChange: onChange.setEnvironmentHue,
    handleEnvironmentHueChange,
    objectCount,
    onObjectCountChange: onChange.setObjectCount,
    handleObjectCountChange,
  };

  // GROUP 5: Lighting Controls (refactored to bypass prop drilling)
  const lightingProps = {
    ambientLightColor,
    onAmbientLightColorChange: onChange.setAmbientLightColor,
    ambientLightIntensity,
    onAmbientLightIntensityChange: onChange.setAmbientLightIntensity,
    directionalLightColor,
    onDirectionalLightColorChange: onChange.setDirectionalLightColor,
    directionalLightIntensity,
    onDirectionalLightIntensityChange: onChange.setDirectionalLightIntensity,
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
         * DISPLAY SECTION
         * Shows current values FROM App.jsx - these update automatically when state changes
         * These are NOT interactive - they just display the current values
         */}

        <hr />

        {/* MATERIAL PROPERTIES SECTION - Now modularized with grouped props */}
        <MaterialPropertiesSection
          {...surfaceProps} // Base color, emissive, metalness
          {...geometryProps} // Wireframe, hyperframe, object type, animation style
          {...speedProps} // Object speed, orb speed
        />

        {/* SCENE CONTROLS SECTION - Now modularized with grouped props */}
        <SceneControlsSection
          {...sceneProps} // Scale, camera, environment, object count
        />

        {/* LIGHTING CONTROLS SECTION */}
        <div
          className={`${styles.sectionHeader} ${lightingOpen ? styles.sectionHeaderLightingOpen : styles.sectionHeaderLightingClosed}`}
          onClick={() => setLightingOpen(!lightingOpen)}
        >
          <span>💡 LIGHTING CONTROLS</span>
          <span>{lightingOpen ? '▼' : '▶'}</span>
        </div>

        {lightingOpen && <LightingControls {...lightingProps} />}
      </div>
    </>
  );
}

export default Controls;
