import * as THREE from "three";

/**
 * Create a solid material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {string} options.specularColor - Specular highlight color hex string
 * @param {number} options.shininess - Shininess value (0-100)
 * @param {number} options.specularIntensity - Specular intensity/reflectivity (0-1)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used to calculate solid opacity
 * @returns {THREE.MeshPhongMaterial} The solid material
 */
export function createSolidMaterial({
  baseColor,
  specularColor,
  shininess,
  specularIntensity,
  wireframeIntensity,
}) {
  const currentBaseColor = new THREE.Color(baseColor);
  const currentSpecularColor = new THREE.Color(specularColor);

  return new THREE.MeshPhongMaterial({
    color: currentBaseColor,
    specular: currentSpecularColor,
    shininess: shininess,
    wireframe: false, // Solid material is NEVER wireframe
    transparent: true, // Always transparent for blending
    opacity: 1 - wireframeIntensity / 100, // Inverse of wireframe intensity
    flatShading: false,
    reflectivity: specularIntensity,
  });
}

/**
 * Create a wireframe material for 3D objects
 * @param {Object} options - Material configuration options
 * @param {string} options.baseColor - Base color hex string
 * @param {string} options.specularColor - Specular highlight color hex string
 * @param {number} options.shininess - Shininess value (0-100)
 * @param {number} options.specularIntensity - Specular intensity/reflectivity (0-1)
 * @param {number} options.wireframeIntensity - Wireframe intensity (0-100) - used as opacity
 * @param {boolean} options.isStandardWireframe - Whether to use standard wireframe mode (for TorusKnot, etc.)
 * @returns {THREE.MeshPhongMaterial} The wireframe material
 */
export function createWireframeMaterial({
  baseColor,
  specularColor,
  shininess,
  specularIntensity,
  wireframeIntensity,
  isStandardWireframe = false,
}) {
  const currentBaseColor = new THREE.Color(baseColor);
  const currentSpecularColor = new THREE.Color(specularColor);

  return new THREE.MeshPhongMaterial({
    color: currentBaseColor,
    specular: currentSpecularColor,
    shininess: shininess,
    wireframe: isStandardWireframe, // Only true for standard thin wireframes
    transparent: true,
    opacity: wireframeIntensity / 100,
    flatShading: false,
    reflectivity: specularIntensity,
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
