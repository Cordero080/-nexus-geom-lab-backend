import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { createTesseractWithFaces } from '../../utils/geometryHelpers';

// Cache built geometries to avoid recomputing the expensive sweep on reselection.
const geometryCache = new Map();

function stableStringify(value) {
  if (value === null) return 'null';
  const type = typeof value;
  if (type === 'number' || type === 'boolean') return JSON.stringify(value);
  if (type === 'string') return JSON.stringify(value);
  if (type === 'undefined') return '"__undefined__"';
  if (type === 'function') return '"__function__"';
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

function createCacheKey(options) {
  if (!options || typeof options !== 'object') return 'default';
  try {
    const signature = stableStringify(options);
    return signature === '{}' ? 'default' : `opts:${signature}`;
  } catch (error) {
    console.warn('megaTesseract: failed to stringify options for cache', error);
    return null;
  }
}

function cloneUserData(data = {}) {
  const cloned = { ...data };
  for (const key of Object.keys(cloned)) {
    const value = cloned[key];
    if (Array.isArray(value)) cloned[key] = value.slice();
  }
  return cloned;
}

function cloneWithUserData(source) {
  const geometryClone = source.clone();
  geometryClone.userData = cloneUserData(source.userData);
  return geometryClone;
}

/**
 * Helper function to create a tesseract with connecting frustum faces
 *
 * Creates a complete tesseract (4D hypercube) with:
 * - Outer cube
 * - Inner cube
 * - 6 connecting frustum faces (one for each cube face)
 *
 * @param {number} outerSize - Size of outer cube
 * @param {number} innerSize - Size of inner cube
 * @param {number} rotation - Optional rotation to apply (in radians)
 * @returns {THREE.BufferGeometry} Complete tesseract
 */

/**
 * Creates a mega tesseract - compound tesseract with outer encasing layer
 *
 * This version keeps only the large compound pairing. It merges two full-size
 * tesseracts (outer cube, inner cube, and frustum bridges) at offset rotations,
 * removing the smaller inner pair entirely.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createMegaTesseract(options = {}) {
  const cacheKey = createCacheKey(options);
  const cachedGeometry = cacheKey ? geometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  // LARGE COMPOUND PAIR ONLY - remove smaller inner pair entirely
  const primaryTesseract = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  primaryTesseract.translate(0, 0.01, 0);

  const rotatedTesseract = createTesseractWithFaces(2.0, 1.5, Math.PI / 8 + Math.PI / 4);
  rotatedTesseract.translate(0, 0.02, 0);

  // Merge only the two large tesseracts
  const mergedMegaTesseract = mergeGeometries([primaryTesseract, rotatedTesseract], false);

  // Recompute normals for proper lighting
  mergedMegaTesseract.computeVertexNormals();

  // Mark it as mega tesseract for wireframe builders
  mergedMegaTesseract.userData.isCompound = true;
  mergedMegaTesseract.userData.isCpdTesseract = true;
  mergedMegaTesseract.userData.baseType = 'BoxGeometry';
  mergedMegaTesseract.userData.isMegaTesseract = true;
  mergedMegaTesseract.userData.componentCount = 2;

  if (cacheKey) geometryCache.set(cacheKey, mergedMegaTesseract);

  return cloneWithUserData(mergedMegaTesseract);
}

/**
 * Metadata for the mega tesseract geometry
 */
export const metadata = {
  name: 'cpdtesseract',
  displayName: '📦📦 Mega Tesseract',
  category: 'polytopes',
  description:
    'Dual large tesseracts merged at offset rotations—outer compound only (no inner pair)',
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
