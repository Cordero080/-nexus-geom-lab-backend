import * as THREE from "three";

/**
 * Create a solid material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {string} options.specularColor - Specular highlight color hex string
 * @param {number} options.metalness - Metalness value (0-1)
 * @param {number} options.emissiveIntensity - Emissive intensity (0-2, multiplied by baseColor)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used to calculate solid opacity
 * @returns {THREE.MeshStandardMaterial} The solid material with PBR support
 */
export function createSolidMaterial({
  baseColor,
  specularColor,
  metalness,
  emissiveIntensity,
  wireframeIntensity,
}) {
  const currentBaseColor = new THREE.Color(baseColor);
  const emissiveColor = new THREE.Color(baseColor).multiplyScalar(
    emissiveIntensity
  );

  return new THREE.MeshStandardMaterial({
    color: currentBaseColor,
    metalness: metalness, // Real metalness (0 = plastic, 1 = metal)
    roughness: 0.2, // Low roughness for shiny reflections
    wireframe: false,
    transparent: true,
    opacity: 1 - wireframeIntensity / 100,
    flatShading: false,
    emissive: emissiveColor,
    emissiveIntensity: 1,
  });
}

/**
 * Create a wireframe material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {string} options.specularColor - Specular highlight color hex string
 * @param {number} options.metalness - Metalness value (0-1)
 * @param {number} options.emissiveIntensity - Emissive intensity (0-2, multiplied by baseColor)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used as opacity
 * @param {boolean} options.isStandardWireframe - Whether to use standard wireframe mode (for TorusKnot, etc.)
 * @returns {THREE.MeshStandardMaterial} The wireframe material with PBR support
 */
export function createWireframeMaterial({
  baseColor,
  specularColor,
  metalness,
  emissiveIntensity,
  wireframeIntensity,
  isStandardWireframe = false,
}) {
  const currentBaseColor = new THREE.Color(baseColor);
  const emissiveColor = new THREE.Color(baseColor).multiplyScalar(
    emissiveIntensity
  );

  return new THREE.MeshStandardMaterial({
    color: currentBaseColor,
    metalness: metalness,
    roughness: 0.2,
    wireframe: isStandardWireframe,
    transparent: true,
    opacity: wireframeIntensity / 100,
    flatShading: false,
    emissive: emissiveColor,
    emissiveIntensity: 1,
  });
}

/**
 * Get color objects for material creation
 * @param {string} baseColor - Base color hex string
 * @param {string} specularColor - Specular highlight color hex string
 * @returns {Object} Color objects { currentBaseColor, currentSpecularColor }
 */
export function getColorObjects(baseColor, specularColor) {
  return {
    currentBaseColor: new THREE.Color(baseColor),
    currentSpecularColor: new THREE.Color(specularColor),
  };
}
