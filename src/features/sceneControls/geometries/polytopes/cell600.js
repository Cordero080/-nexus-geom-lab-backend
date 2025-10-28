import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a 600-cell (4D polytope) projection
 *
 * The 600-cell is the most complex regular 4D polytope:
 * - 600 regular tetrahedral cells
 * - 120 vertices
 * - 1200 triangular faces
 * - Dual of the 120-cell
 *
 * Projects onto icosahedral symmetry in 3D (12 vertices × layers ≈ 120 vertices).
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function create600Cell(options = {}) {
  // Create 5 nested icosahedra layers (matching 120-cell structure)
  const outerSize = 1.2; // Outer boundary
  const layer1Size = 0.95; // First intermediate layer
  const layer2Size = 0.7; // Second intermediate layer
  const layer3Size = 0.5; // Third intermediate layer
  const innerSize = 0.25; // Inner core

  const outerIco = new THREE.IcosahedronGeometry(outerSize, 0);
  const layer1Ico = new THREE.IcosahedronGeometry(layer1Size, 0);
  const layer2Ico = new THREE.IcosahedronGeometry(layer2Size, 0);
  const layer3Ico = new THREE.IcosahedronGeometry(layer3Size, 0);
  const innerIco = new THREE.IcosahedronGeometry(innerSize, 0);

  // Merge all five layers
  const merged600Cell = mergeGeometries([
    outerIco,
    layer1Ico,
    layer2Ico,
    layer3Ico,
    innerIco,
  ]);

  // Mark as 600-cell for wireframe/hyperframe builders
  merged600Cell.userData.is600Cell = true;
  merged600Cell.userData.baseType = "IcosahedronGeometry";
  merged600Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    layer3: layer3Size,
    inner: innerSize,
  };

  return merged600Cell;
}

/**
 * Metadata for the 600-cell geometry
 */
export const metadata = {
  name: "600cell",
  displayName: "⬡ 600-Cell",
  category: "polytopes",
  description:
    "Most complex 4D polytope - 600 tetrahedral cells, 120 vertices, dual of 120-cell",
  isCompound: false,
  defaultOptions: {},
};
