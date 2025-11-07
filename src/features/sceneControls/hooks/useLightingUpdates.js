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
 * @param {number} lightingProps.metalness - Metalness value (0-1) for intensity boosting
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
    metalness = 0,
  } = lightingProps;

  // AMBIENT LIGHT UPDATER
  useEffect(() => {
    if (ambientLightRef.current) {
      // Boost intensity for metallic materials (metalness > 0.4)
      // Metallic surfaces need more light to show their reflective properties
      const metalnessBoost = metalness > 0.4 ? 1 + (metalness - 0.4) * 6 : 1; // 1x to 4.6x boost
      const boostedIntensity = ambientLightIntensity * metalnessBoost;
      const safeIntensity = Math.max(0, boostedIntensity);
      
      // Convert hex color to Three.js color number with validation
      const colorString = ambientLightColor.replace("#", "");
      const convertedColor = parseInt(colorString, 16);
      // Validate color conversion
      if (!isNaN(convertedColor)) {
        ambientLightRef.current.color.setHex(convertedColor);
      }
      ambientLightRef.current.intensity = safeIntensity;
    }
  }, [ambientLightColor, ambientLightIntensity, metalness]);

  // DIRECTIONAL LIGHT UPDATER
  useEffect(() => {
    if (directionalLightRef.current) {
      // Boost intensity for metallic materials (metalness > 0.4)
      // Metallic surfaces need stronger directional light to show highlights and reflections
      const metalnessBoost = metalness > 0.4 ? 1 + (metalness - 0.4) * 5 : 1; // 1x to 4x boost
      const boostedIntensity = directionalLightIntensity * metalnessBoost;
      const safeIntensity = Math.max(0.05, boostedIntensity);
      
      // Clamp position to a reasonable range
      const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
      const safeX = clamp(directionalLightX, -50, 50);
      const safeY = clamp(directionalLightY, -50, 50);
      const safeZ = clamp(directionalLightZ, -50, 50);
      // Convert hex color to Three.js color number with validation
      const colorString = directionalLightColor.replace("#", "");
      const convertedColor = parseInt(colorString, 16);
      // Validate color conversion and apply
      if (!isNaN(convertedColor)) {
        directionalLightRef.current.color.setHex(convertedColor);
      }
      directionalLightRef.current.intensity = safeIntensity;
      // Position the light using clamped coordinates
      directionalLightRef.current.position.set(safeX, safeY, safeZ);
    }
  }, [
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
    metalness,
  ]);
}
