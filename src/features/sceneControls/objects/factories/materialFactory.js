import * as THREE from 'three';

/**
 * Create a solid material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {number} options.metalness - Metalness value (0-1)
 * @param {number} options.emissiveIntensity - Emissive intensity (0-2, multiplied by baseColor)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used to calculate solid opacity
 * @returns {THREE.MeshStandardMaterial} The solid material with PBR support
 */
export function createSolidMaterial({
  baseColor,
  metalness,
  emissiveIntensity,
  wireframeIntensity,
}) {
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const currentBaseColor = new THREE.Color(rgbColor);
  const emissiveColor = new THREE.Color(rgbColor).multiplyScalar(emissiveIntensity);

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
    side: THREE.DoubleSide, // Render both sides for compound geometries
  });
}

/**
 * Create a wireframe material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {number} options.metalness - Metalness value (0-1)
 * @param {number} options.emissiveIntensity - Emissive intensity (0-2, multiplied by baseColor)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used as opacity
 * @param {boolean} options.isStandardWireframe - Whether to use standard wireframe mode
 * @returns {THREE.MeshStandardMaterial} The wireframe material with PBR support
 */
export function createWireframeMaterial({
  baseColor,
  metalness,
  emissiveIntensity,
  wireframeIntensity,
  isStandardWireframe = false,
}) {
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const currentBaseColor = new THREE.Color(rgbColor);
  const emissiveColor = new THREE.Color(rgbColor).multiplyScalar(emissiveIntensity);

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
    // Ensure wireframe shows on both sides and reduces z-fighting/occlusion
    side: THREE.DoubleSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

/**
 * Get color objects for material creation
 * @param {string} baseColor - Base color hex string
 * @returns {Object} Color object { currentBaseColor }
 */
export function getColorObjects(baseColor) {
  return {
    currentBaseColor: new THREE.Color(baseColor),
  };
}
