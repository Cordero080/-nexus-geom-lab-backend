import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a 24-cell (4D polytope) projection
 *
 * The 24-cell is unique to 4D space - made of 24 regular octahedra.
 * It is self-dual (dual of itself), a property unique to this polytope.
 *
 * Properties:
 * - 24 octahedral cells
 * - 24 vertices
 * - Self-dual structure
 *
 * This 3D shadow shows nested octahedra representing dimensional projection.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function create24Cell(options = {}) {
  // Create 4 nested octahedra layers
  const outerSize = 1.0; // Outer boundary
  const layer1Size = 0.7; // First intermediate layer
  const layer2Size = 0.45; // Second intermediate layer
  const innerSize = 0.25; // Inner core

  const outerOct = new THREE.OctahedronGeometry(outerSize);
  const layer1Oct = new THREE.OctahedronGeometry(layer1Size);
  const layer2Oct = new THREE.OctahedronGeometry(layer2Size);
  const innerOct = new THREE.OctahedronGeometry(innerSize);

  // Merge all four layers
  const merged24Cell = mergeGeometries([outerOct, layer1Oct, layer2Oct, innerOct]);

  // Mark as 24-cell for wireframe/hyperframe builders
  merged24Cell.userData.is24Cell = true;
  merged24Cell.userData.baseType = 'OctahedronGeometry';
  merged24Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    inner: innerSize,
  };

  return merged24Cell;
}

/**
 * Metadata for the 24-cell geometry
 */
export const metadata = {
  name: '24cell',
  displayName: '◆ 24-Cell',
  category: 'polytopes',
  description: 'Self-dual 4D polytope with 24 octahedral cells - unique to 4D space',
  isCompound: false,
  defaultOptions: {},
};
