import * as THREE from "three";

export function initializeLighting({
  ambientLightColor = "#ffffff",
  ambientLightIntensity = 1.2,
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

  // Create ambient light - uniform illumination from all directions
  const ambientLight = new THREE.AmbientLight(
    ambientLightColorHex,
    ambientLightIntensity
  );

  // Create directional light - sun-like parallel rays with shadows
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

  // Add hemisphere light for natural sky/ground gradient (subtle fill light)
  const hemisphereLight = new THREE.HemisphereLight(
    0xffffff, // Sky color (white/blue)
    0x444444, // Ground color (dark gray)
    0.3 // Intensity
  );

  // Single PointLight for subtle sci-fi accent
  const pointLight1 = new THREE.PointLight(0x00d4ff, 1.2, 25); // Cyan glow
  pointLight1.position.set(5, 5, 5);

  // Second directional light from bottom left
  const directionalLight2 = new THREE.DirectionalLight(
    directionalLightColorHex,
    directionalLightIntensity
  );
  directionalLight2.position.set(-10, -10, 5); // Bottom left position
  directionalLight2.target.position.set(0, 0, 0); // Point at origin

  return {
    ambientLight,
    directionalLight,
    directionalLight2,
    hemisphereLight,
    pointLight1,
  };
}
