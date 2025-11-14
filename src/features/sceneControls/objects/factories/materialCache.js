/**
 * Material Cache
 *
 * Stores and reuses materials/hyperframes to prevent recreating them on every slider change.
 * Keeps performance smooth when users adjust colors or properties in real-time.
 */

import * as THREE from 'three';
import { createSolidMaterial, createWireframeMaterial } from './materialFactory';

// Shared caches - persist across multiple object creations
const solidMaterialPool = new Map();
const wireframeMaterialPool = new Map();
const hyperframeCache = new Map();

/**
 * Updates existing solid material with new configuration
 * Modifies material in-place instead of creating new one
 */
function ensureSolidMaterialConfig(material, config) {
  if (!material) return null;
  const { baseColor, metalness, emissiveIntensity, wireframeIntensity } = config;
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const color = new THREE.Color(rgbColor);
  material.color.copy(color);
  material.metalness = metalness;
  material.roughness = 0.2;
  material.emissive.copy(color).multiplyScalar(emissiveIntensity);
  const opacity = 1 - wireframeIntensity / 100;
  material.opacity = opacity;
  material.transparent = opacity < 1;
  material.needsUpdate = true;
  return material;
}

/**
 * Updates existing wireframe material with new configuration
 * Modifies material in-place instead of creating new one
 */
function ensureWireframeMaterialConfig(material, config) {
  if (!material) return null;
  const { baseColor, metalness, emissiveIntensity, wireframeIntensity } = config;
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const color = new THREE.Color(rgbColor);
  material.color.copy(color);
  material.metalness = metalness;
  material.roughness = 0.2;
  material.emissive.copy(color).multiplyScalar(emissiveIntensity);
  const opacity = wireframeIntensity / 100;
  material.opacity = opacity;
  material.transparent = true;
  material.needsUpdate = true;
  return material;
}

/**
 * Generates unique cache key for material pooling
 * Only mega-tesseract family uses pooling for performance
 */
function getMaterialPoolKey(geometry, objectType) {
  if (!geometry || !geometry.userData) return null;
  const { isMegaTesseract, isCompoundMegaTesseract, isCpdTesseract, variant } = geometry.userData;
  const isMegaFamily = isMegaTesseract || isCompoundMegaTesseract || isCpdTesseract;
  if (!isMegaFamily) return null;
  const variantKey = variant ? `-${variant}` : '';
  return `${objectType || geometry.type}${variantKey}`;
}

/**
 * Retrieves or creates solid material from cache
 * Uses pooling for mega-tesseract variants, fresh materials for others
 */
export function getSolidMaterial(materialKey, materialConfig) {
  if (!materialKey) {
    return createSolidMaterial(materialConfig);
  }
  if (!solidMaterialPool.has(materialKey)) {
    solidMaterialPool.set(materialKey, createSolidMaterial(materialConfig));
  }
  return ensureSolidMaterialConfig(solidMaterialPool.get(materialKey), materialConfig);
}

/**
 * Retrieves or creates wireframe material from cache
 * Uses pooling for mega-tesseract variants, fresh materials for others
 */
export function getWireframeMaterial(materialKey, materialConfig, overrides = {}) {
  if (!materialKey || overrides.isStandardWireframe) {
    return ensureWireframeMaterialConfig(
      createWireframeMaterial({ ...materialConfig, ...overrides }),
      { ...materialConfig, ...overrides }
    );
  }
  if (!wireframeMaterialPool.has(materialKey)) {
    wireframeMaterialPool.set(materialKey, createWireframeMaterial(materialConfig));
  }
  return ensureWireframeMaterialConfig(wireframeMaterialPool.get(materialKey), materialConfig);
}

/**
 * Deep clones a Three.js Group including all userData
 * Necessary for hyperframe caching (each instance needs independent userData)
 */
function cloneGroupWithUserData(group) {
  if (!group) return null;
  const cloned = group.clone(true);
  cloned.userData = { ...group.userData };
  cloned.traverse((child) => {
    if (child !== cloned) {
      child.userData = { ...child.userData };
    }
  });
  return cloned;
}

/**
 * Generates unique cache key for hyperframe based on geometry configuration
 * Includes colors so hyperframe updates when user changes colors
 */
function getHyperframeKey(geometry, hyperframeColor, hyperframeLineColor) {
  if (!geometry || !geometry.userData) return null;
  const { isMegaTesseract, isCompoundMegaTesseract, isCpdTesseract, variant } = geometry.userData;
  if (!isMegaTesseract && !isCompoundMegaTesseract && !isCpdTesseract) {
    return null;
  }
  let prefix = 'cpd';
  if (isCompoundMegaTesseract) prefix = 'compoundMega';
  else if (isMegaTesseract) prefix = 'mega';

  const signatureFields = [
    'translationStep',
    'layerGap',
    'baseOffset',
    'translationAxis',
    'sweepScales',
    'sweepOffsets',
    'radialStep',
    'twistStep',
    'duplicateScale',
    'duplicateRotation',
    'duplicateOffset',
    'mirrorEnabled',
    'baseTranslationStep',
    'baseLayerGap',
    'baseSweepScales',
    'baseTranslationAxis',
    'componentCount',
  ];

  const signature = { variant: variant || 'baseline' };
  signatureFields.forEach((field) => {
    if (field in geometry.userData && geometry.userData[field] !== undefined) {
      signature[field] = geometry.userData[field];
    }
  });

  // Include colors in cache key so hyperframe updates when colors change
  if (hyperframeColor !== undefined) signature.hyperframeColor = hyperframeColor;
  if (hyperframeLineColor !== undefined) signature.hyperframeLineColor = hyperframeLineColor;

  return `${prefix}:${JSON.stringify(signature)}`;
}

/**
 * Retrieves or creates hyperframe from cache
 * Returns cloned instance so each object has independent transforms
 */
export function getHyperframeFromCache(key, builder) {
  if (!key) return builder();
  if (!hyperframeCache.has(key)) {
    hyperframeCache.set(key, builder());
  }
  const cached = hyperframeCache.get(key);
  return {
    centerLines: cloneGroupWithUserData(cached.centerLines),
    centerLinesMaterial: cached.centerLinesMaterial,
    curvedLines: cloneGroupWithUserData(cached.curvedLines),
    curvedLinesMaterial: cached.curvedLinesMaterial,
  };
}

/**
 * Exports getMaterialPoolKey for use in objectFactory
 */
export { getMaterialPoolKey, getHyperframeKey };
