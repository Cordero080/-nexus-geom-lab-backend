import { useEffect } from "react";
import { updateMousePosition } from "../spectralOrbs";
import { updateEnvironment } from "../environmentSetup";

/**
 * Handles mouse tracking for orb interaction
 *
 * @param {Object} rendererRef - Reference to the Three.js renderer
 * @param {Object} cameraRef - Reference to the Three.js camera
 */
export function useMouseTracking(rendererRef, cameraRef) {
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (rendererRef.current && cameraRef.current) {
        updateMousePosition(
          event,
          cameraRef.current,
          rendererRef.current.domElement
        );
      }
    };

    // Add mouse move listener to the entire window for smooth tracking
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array = run once on mount
}

/**
 * Update environment when environment type or hue changes
 *
 * @param {Object} sceneRef - Reference to the Three.js scene
 * @param {string} environment - Environment type
 * @param {number} environmentHue - Hue shift in degrees (0-360)
 */
export function useEnvironmentUpdate(sceneRef, environment, environmentHue) {
  useEffect(() => {
    console.log(
      "[useEnvironmentUpdate] Updating environment:",
      environment,
      "hue:",
      environmentHue
    );
    if (!sceneRef.current) return;
    updateEnvironment(sceneRef.current, environment, environmentHue);
  }, [environment, environmentHue]);
}
