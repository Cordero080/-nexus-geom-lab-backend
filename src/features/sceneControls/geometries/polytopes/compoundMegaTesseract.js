import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

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
    // Failed to stringify options for cache
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
function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
  const geometries = [];

  // Outer cube
  const outer = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
  if (rotation) outer.rotateY(rotation);
  geometries.push(outer);

  // Inner cube
  const inner = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
  if (rotation) inner.rotateY(rotation);
  inner.translate(0, 0.01, 0); // Slight offset to prevent z-fighting
  geometries.push(inner);

  // Create 6 connecting frustums (one for each face of the cube)
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  const depth = (outerSize - innerSize) / 2;

  // Top face frustum (Y+)
  const topFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  topFrustum.rotateY(Math.PI / 4);
  topFrustum.translate(0, halfOuter + depth / 2, 0);
  if (rotation) topFrustum.rotateY(rotation);
  geometries.push(topFrustum);

  // Bottom face frustum (Y-)
  const bottomFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  // Front face frustum (Z+)
  const frontFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  // Back face frustum (Z-)
  const backFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  // Right face frustum (X+)
  const rightFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  // Left face frustum (X-)
  const leftFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

/**
 * Creates a compound mega tesseract starting from the mega baseline. This mirrors the
 * mega tesseract geometry verbatim so that future tweaks can diverge independently without
 * touching the original mega implementation.
 *
 * @param {Object} options - Configuration options (currently unused)
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundMegaTesseract(options = {}) {
  const cacheKey = createCacheKey(options);
  const cachedGeometry = cacheKey ? geometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  // Duplicate the mega tesseract construction so this file can evolve separately.
  const primaryTesseract = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  primaryTesseract.translate(0, 0.01, 0);

  const rotatedTesseract = createTesseractWithFaces(2.0, 1.5, Math.PI / 8 + Math.PI / 4);
  rotatedTesseract.translate(0, 0.02, 0);

  const sweepOffset = Math.PI / 6; // 30° phase shift for additional copies

  const positivePrimary = primaryTesseract.clone();
  positivePrimary.rotateY(sweepOffset);
  positivePrimary.translate(0, 0.03, 0);

  const positiveRotated = rotatedTesseract.clone();
  positiveRotated.rotateY(sweepOffset);
  positiveRotated.translate(0, 0.04, 0);

  const negativePrimary = primaryTesseract.clone();
  negativePrimary.rotateY(-sweepOffset);
  negativePrimary.translate(0, 0.05, 0);

  const negativeRotated = rotatedTesseract.clone();
  negativeRotated.rotateY(-sweepOffset);
  negativeRotated.translate(0, 0.06, 0);

  const mergedCompoundMega = mergeGeometries(
    [
      primaryTesseract,
      rotatedTesseract,
      positivePrimary,
      positiveRotated,
      negativePrimary,
      negativeRotated,
    ],
    false
  );

  mergedCompoundMega.computeVertexNormals();

  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.isCpdTesseract = true;
  mergedCompoundMega.userData.baseType = 'BoxGeometry';
  mergedCompoundMega.userData.isMegaTesseract = true;
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.componentCount = 6;

  if (cacheKey) geometryCache.set(cacheKey, mergedCompoundMega);

  return cloneWithUserData(mergedCompoundMega);
}

/**
 * Metadata for the compound mega tesseract geometry
 */
export const metadata = {
  name: 'cpd-megatesseract',
  displayName: '💎💎💎 Compound Mega-Tesseract',
  category: 'polytopes',
  description: 'Phased rotation sweep of mega-tesseract pairs rotated ±30° for rhythmic overlap',
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
