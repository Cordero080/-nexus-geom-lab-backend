import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { createTesseractWithFaces } from '../../utils/geometryHelpers';

/**
 * Creates a compound tesseract (4D hypercube) - two interpenetrating tesseracts
 *
 * Each tesseract consists of:
 * - Outer cube
 * - Inner cube
 * - 6 connecting frustum faces (representing 4D depth)
 *
 * The second tesseract is rotated 45° to create a compound 4D structure,
 * simulating rotation in the 4th dimension.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundTesseract(options = {}) {
  // 🎯 ADJUST SIZE HERE: Change these values to scale the compound tesseract
  // Current: 1.8 (outer), 0.9 (inner) = 120% of original 1.5/0.75
  // To scale by X%, multiply by (1 + X/100): e.g., 1.5 * 1.20 = 1.8
  const outerSize = 1.8; // Outer cube size
  const innerSize = 0.9; // Inner cube size (should be 50% of outer)

  // First tesseract with connecting faces
  const tesseract1 = createTesseractWithFaces(outerSize, innerSize, null);

  // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
  const tesseract2 = createTesseractWithFaces(outerSize, innerSize, Math.PI / 4);
  tesseract2.translate(0, 0.02, 0); // Slight offset to prevent z-fighting

  // Merge both complete tesseracts
  const mergedCpdTesseract = mergeGeometries([tesseract1, tesseract2], false);

  // Recompute normals for proper lighting
  mergedCpdTesseract.computeVertexNormals();

  // Mark it as compound tesseract for wireframe builders
  mergedCpdTesseract.userData.isCompound = true;
  mergedCpdTesseract.userData.baseType = 'BoxGeometry';
  mergedCpdTesseract.userData.isCpdTesseract = true; // Flag for compound tesseract

  return mergedCpdTesseract;
}

/**
 * Metadata for the compound tesseract geometry
 */
export const metadata = {
  name: 'box',
  displayName: '📦 Compound Tesseract',
  category: 'polytopes',
  description: 'Two 4D hypercubes interpenetrating - simulates 4D rotation',
  isCompound: true,
  defaultOptions: {},
};
