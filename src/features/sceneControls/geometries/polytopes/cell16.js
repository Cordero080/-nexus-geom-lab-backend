import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a 16-cell (4D polytope) projection
 *
 * The 16-cell is the simplest regular 4D polytope (hyperdiamond/hyperoctahedron).
 * It's made of 16 regular tetrahedra and is the dual of the 24-cell.
 *
 * Properties:
 * - 16 tetrahedral cells
 * - 8 vertices positioned at (±1,0,0,0) and permutations in 4D
 * - Dual of the 24-cell
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function create16Cell(options = {}) {
  // Create 3 nested tetrahedra layers (simpler structure)
  const outerSize = 1.2; // Outer boundary
  const middleSize = 0.7; // Middle layer
  const innerSize = 0.35; // Inner core

  const outerTet = new THREE.TetrahedronGeometry(outerSize);
  const middleTet = new THREE.TetrahedronGeometry(middleSize);
  const innerTet = new THREE.TetrahedronGeometry(innerSize);

  // Merge all three layers
  const merged16Cell = mergeGeometries([outerTet, middleTet, innerTet]);

  // Mark as 16-cell for wireframe/hyperframe builders
  merged16Cell.userData.is16Cell = true;
  merged16Cell.userData.baseType = 'TetrahedronGeometry';
  merged16Cell.userData.layers = {
    outer: outerSize,
    middle: middleSize,
    inner: innerSize,
  };

  return merged16Cell;
}

/**
 * Metadata for the 16-cell geometry
 */
export const metadata = {
  name: '16cell',
  displayName: '▲ 16-Cell',
  category: 'polytopes',
  description: 'Simplest 4D polytope (hyperdiamond) - 16 tetrahedral cells, dual of 24-cell',
  isCompound: false,
  defaultOptions: {},
};
