import { useEffect } from 'react';

/**
 * PROPERTY UPDATE HOOK - Updates light properties when state changes
 *
 * What it does:
 * 1. Accesses existing lights via refs (created by useSceneInitialization)
 * 2. Updates color, intensity, and position without recreating lights
 * 3. Boosts intensity when metalness is high for dramatic effect
 * 4. Reacts to any lighting prop changes
 *
 * Why it matters:
 * - Efficient updates (modify existing objects, don't recreate)
 * - Keeps Three.js lights in sync with React state
 * - Runs AFTER useSceneInitialization (depends on lights existing in refs)
 *
 * @param {Object} refs - Refs containing light objects
 * @param {Object} lightingProps - Current state values for lighting
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
      const colorString = ambientLightColor.replace('#', '');
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
      const colorString = directionalLightColor.replace('#', '');
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
