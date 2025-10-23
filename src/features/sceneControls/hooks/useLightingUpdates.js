import { useEffect } from "react";

/**
 * Manages lighting updates based on prop changes
 * Updates ambient and directional lights without recreating them
 *
 * @param {Object} refs - References to light objects
 * @param {Object} refs.ambientLightRef - Reference to ambient light
 * @param {Object} refs.directionalLightRef - Reference to directional light
 * @param {Object} lightingProps - Lighting configuration properties
 * @param {string} lightingProps.ambientLightColor - Ambient light color hex
 * @param {number} lightingProps.ambientLightIntensity - Ambient light intensity
 * @param {string} lightingProps.directionalLightColor - Directional light color hex
 * @param {number} lightingProps.directionalLightIntensity - Directional light intensity
 * @param {number} lightingProps.directionalLightX - Directional light X position
 * @param {number} lightingProps.directionalLightY - Directional light Y position
 * @param {number} lightingProps.directionalLightZ - Directional light Z position
 */
export function useLightingUpdates(refs, lightingProps) {
  const { ambientLightRef, directionalLightRef } = refs;
  const {
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
  } = lightingProps;

  // AMBIENT LIGHT UPDATER
  useEffect(() => {
    if (ambientLightRef.current) {
      // Convert hex color to Three.js color number
      const convertedColor = parseInt(ambientLightColor.replace("#", ""), 16);
      ambientLightRef.current.color.setHex(convertedColor);
      ambientLightRef.current.intensity = ambientLightIntensity;
      console.log(
        "Updated ambient light:",
        ambientLightColor,
        ambientLightIntensity
      );
    }
  }, [ambientLightColor, ambientLightIntensity]);

  // DIRECTIONAL LIGHT UPDATER
  useEffect(() => {
    if (directionalLightRef.current) {
      // Clamp intensity to a minimum value
      const safeIntensity = Math.max(0.05, directionalLightIntensity);
      // Clamp position to a reasonable range
      const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
      const safeX = clamp(directionalLightX, -50, 50);
      const safeY = clamp(directionalLightY, -50, 50);
      const safeZ = clamp(directionalLightZ, -50, 50);
      // Convert hex color to Three.js color number
      const convertedColor = parseInt(
        directionalLightColor.replace("#", ""),
        16
      );
      directionalLightRef.current.color.setHex(convertedColor);
      directionalLightRef.current.intensity = safeIntensity;
      // Position the light using clamped coordinates
      directionalLightRef.current.position.set(safeX, safeY, safeZ);
      console.log(
        "[ThreeScene] Updated directional light:",
        directionalLightColor,
        safeIntensity,
        "position:",
        safeX,
        safeY,
        safeZ,
        "| prop Y:",
        directionalLightY
      );
    }
  }, [
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
  ]);
}
