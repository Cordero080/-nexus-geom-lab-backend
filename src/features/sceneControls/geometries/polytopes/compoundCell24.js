import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a compound 24-cell - two 24-cells merged at cross-axes
 *
 * The 24-cell is self-dual, so this creates perfect symmetry when merged.
 *
 * Properties:
 * - 48 octahedral cells total (24 × 2)
 * - Perfect rotational symmetry
 * - Self-dual compound structure
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompound24Cell(options = {}) {
  // Create 4 nested octahedra layers (matching 24-cell structure)
  const outerSize = 1.0;
  const layer1Size = 0.7;
  const layer2Size = 0.45;
  const innerSize = 0.25;

  // First 24-cell (standard orientation)
  const outerOct1 = new THREE.OctahedronGeometry(outerSize);
  const layer1Oct1 = new THREE.OctahedronGeometry(layer1Size);
  const layer2Oct1 = new THREE.OctahedronGeometry(layer2Size);
  const innerOct1 = new THREE.OctahedronGeometry(innerSize);

  // Second 24-cell (rotated 45° on X, Y, and Z for maximal intersection)
  const outerOct2 = new THREE.OctahedronGeometry(outerSize);
  const layer1Oct2 = new THREE.OctahedronGeometry(layer1Size);
  const layer2Oct2 = new THREE.OctahedronGeometry(layer2Size);
  const innerOct2 = new THREE.OctahedronGeometry(innerSize);

  // Rotate second set for compound effect
  [outerOct2, layer1Oct2, layer2Oct2, innerOct2].forEach((geo) => {
    geo.rotateX(Math.PI / 4);
    geo.rotateY(Math.PI / 4);
    geo.rotateZ(Math.PI / 6);
  });

  // Merge all eight layers (4 from each 24-cell)
  const mergedCompound24Cell = mergeGeometries([
    outerOct1,
    layer1Oct1,
    layer2Oct1,
    innerOct1,
    outerOct2,
    layer1Oct2,
    layer2Oct2,
    innerOct2,
  ]);

  // Mark as compound 24-cell
  mergedCompound24Cell.userData.isCompound24Cell = true;
  mergedCompound24Cell.userData.baseType = 'OctahedronGeometry';
  mergedCompound24Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    inner: innerSize,
  };

  return mergedCompound24Cell;
}

/**
 * Metadata for the compound 24-cell geometry
 */
export const metadata = {
  name: 'compound24cell',
  displayName: '◆◆ Compound 24-Cell',
  category: 'polytopes',
  description: 'Two self-dual 24-cells merged - 48 octahedral cells with perfect symmetry',
  isCompound: true,
  defaultOptions: {},
};
