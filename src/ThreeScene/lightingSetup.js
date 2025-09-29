import * as THREE from "three";

export function initializeLighting({
  ambientLightColor = "#ffffff",
  ambientLightIntensity = 0.5,
  directionalLightColor = "#ffffff",
  directionalLightIntensity = 1,
  directionalLightPosition = { x: 0, y: 10, z: 10 },
}) {
  // Convert hex color strings to Three.js color numbers
  const ambientLightColorHex = parseInt(ambientLightColor.replace("#", ""), 16);
  const directionalLightColorHex = parseInt(
    directionalLightColor.replace("#", ""),
    16
  );

  // Create ambient light
  const ambientLight = new THREE.AmbientLight(
    ambientLightColorHex,
    ambientLightIntensity
  );

  // Create directional light
  const directionalLight = new THREE.DirectionalLight(
    directionalLightColorHex,
    directionalLightIntensity
  );
  directionalLight.position.set(
    directionalLightPosition.x,
    directionalLightPosition.y,
    directionalLightPosition.z
  );
  directionalLight.castShadow = true;

  return { ambientLight, directionalLight };
}
