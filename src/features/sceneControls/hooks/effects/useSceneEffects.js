import { useEffect } from 'react';
import * as THREE from 'three';
import { updateEnvironment } from '../../threeSetup/environmentSetup';
import { updateMousePosition } from '../../objects/spectralOrbs';

/**
 * VISUAL EFFECTS HOOK - Mouse tracking for spectral orbs
 *
 * What it does:
 * 1. Tracks mouse movement across the window
 * 2. Updates spectral orb positions to follow cursor
 * 3. Provides smooth interactive movement
 *
 * Why it matters:
 * - Creates interactive visual feedback
 * - Runs once on mount, listener persists until unmount
 */
export function useMouseTracking(rendererRef, cameraRef) {
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (rendererRef.current && cameraRef.current) {
        updateMousePosition(event, cameraRef.current, rendererRef.current.domElement);
      }
    };

    // Add mouse move listener to the entire window for smooth tracking
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array = run once on mount
}

/**
 * VISUAL EFFECTS HOOK - Updates scene environment settings
 *
 * What it does:
 * 1. Calls threeSetup/environmentSetup to configure fog, background, etc
 * 2. Updates when environment or hue changes
 * 3. Applies environment-specific visual settings to the scene
 *
 * Why it matters:
 * - Keeps environment visuals in sync with user selections
 * - Bridges React state changes to Three.js scene properties
 * - Runs after scene initialization but before rendering
 */
export function useEnvironmentUpdate(sceneRef, environment, environmentHue) {
  useEffect(() => {
    if (!sceneRef.current) return;
    updateEnvironment(sceneRef.current, environment, environmentHue);
  }, [environment, environmentHue]);
}
