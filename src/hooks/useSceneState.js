import { useState } from 'react';

/**
 * Custom hook to manage all scene state in one place
 * Extracts 20+ state variables from App.jsx for better organization
 *
 * @returns {Object} { sceneState, sceneActions }
 */
export function useSceneState() {
  // Default colors for psychedelic theme
  const defaultBaseColor = '#4a0e78'; // Deep purple
  const defaultHyperframeColor = '#00d9ff'; // Bright cyan
  const defaultHyperframeLineColor = '#00ff41'; // Electric lime green

  // ============================================
  // MATERIAL PROPERTIES STATE
  // ============================================
  const [metalness, setMetalness] = useState(0.5); // 0 = plastic, 1 = full metal
  const [emissiveIntensity, setEmissiveIntensity] = useState(0); // 0 = no glow, 2 = bright glow
  const [baseColor, setBaseColor] = useState(defaultBaseColor);
  const [wireframeIntensity, setWireframeIntensity] = useState(50);

  // ============================================
  // HYPERFRAME STATE
  // ============================================
  const [hyperframeColor, setHyperframeColor] = useState(defaultHyperframeColor);
  const [hyperframeLineColor, setHyperframeLineColor] = useState(defaultHyperframeLineColor);

  // ============================================
  // SCENE BEHAVIOR STATE
  // ============================================
  const [cameraView, setCameraView] = useState('free');
  const [environment, setEnvironment] = useState('matrix');
  const [environmentHue, setEnvironmentHue] = useState(0); // Hue rotation for environment (0-360)
  const [objectCount, setObjectCount] = useState(1);
  const [animationStyle, setAnimationStyle] = useState('rotate');
  const [objectType, setObjectType] = useState('icosahedron');

  // ============================================
  // LIGHTING STATE
  // ============================================
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff');
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(1.2);
  const [directionalLightColor, setDirectionalLightColor] = useState('#ffffff');
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.0);
  const [directionalLightX, setDirectionalLightX] = useState(10);
  const [directionalLightY, setDirectionalLightY] = useState(10);
  const [directionalLightZ, setDirectionalLightZ] = useState(5);

  // ============================================
  // ANIMATION STATE
  // ============================================
  const [scale, setScale] = useState(1);
  const [objectSpeed, setObjectSpeed] = useState(1.0);
  const [orbSpeed, setOrbSpeed] = useState(1.0);

  // ============================================
  // RETURN: All state values and setters
  // ============================================
  return {
    // Material properties
    metalness,
    setMetalness,
    emissiveIntensity,
    setEmissiveIntensity,
    baseColor,
    setBaseColor,
    wireframeIntensity,
    setWireframeIntensity,

    // Hyperframe
    hyperframeColor,
    setHyperframeColor,
    hyperframeLineColor,
    setHyperframeLineColor,

    // Scene behavior
    cameraView,
    setCameraView,
    environment,
    setEnvironment,
    environmentHue,
    setEnvironmentHue,
    objectCount,
    setObjectCount,
    animationStyle,
    setAnimationStyle,
    objectType,
    setObjectType,

    // Lighting
    ambientLightColor,
    setAmbientLightColor,
    ambientLightIntensity,
    setAmbientLightIntensity,
    directionalLightColor,
    setDirectionalLightColor,
    directionalLightIntensity,
    setDirectionalLightIntensity,
    directionalLightX,
    setDirectionalLightX,
    directionalLightY,
    setDirectionalLightY,
    directionalLightZ,
    setDirectionalLightZ,

    // Animation
    scale,
    setScale,
    objectSpeed,
    setObjectSpeed,
    orbSpeed,
    setOrbSpeed,
  };
}

export default useSceneState;
