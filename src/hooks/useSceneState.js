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
    // All current state values in one object
    sceneState: {
      // Material properties
      metalness,
      emissiveIntensity,
      baseColor,
      wireframeIntensity,

      // Hyperframe
      hyperframeColor,
      hyperframeLineColor,

      // Scene behavior
      cameraView,
      environment,
      environmentHue,
      objectCount,
      animationStyle,
      objectType,

      // Lighting
      ambientLightColor,
      ambientLightIntensity,
      directionalLightColor,
      directionalLightIntensity,
      directionalLightX,
      directionalLightY,
      directionalLightZ,

      // Animation
      scale,
      objectSpeed,
      orbSpeed,
    },

    // All setter functions in one object
    sceneActions: {
      // Material property setters
      setMetalness,
      setEmissiveIntensity,
      setBaseColor,
      setWireframeIntensity,

      // Hyperframe setters
      setHyperframeColor,
      setHyperframeLineColor,

      // Scene behavior setters
      setCameraView,
      setEnvironment,
      setEnvironmentHue,
      setObjectCount,
      setAnimationStyle,
      setObjectType,

      // Lighting setters
      setAmbientLightColor,
      setAmbientLightIntensity,
      setDirectionalLightColor,
      setDirectionalLightIntensity,
      setDirectionalLightX,
      setDirectionalLightY,
      setDirectionalLightZ,

      // Animation setters
      setScale,
      setObjectSpeed,
      setOrbSpeed,
    },
  };
}
