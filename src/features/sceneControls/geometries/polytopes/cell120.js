import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a 120-cell (4D polytope) projection
 *
 * The 120-cell is a regular 4D polytope made of 120 regular dodecahedra.
 * This 3D shadow shows 5 nested layers representing dimensional compression.
 *
 * Properties:
 * - 120 dodecahedral cells
 * - 600 vertices
 * - 1200 pentagonal faces
 * - Unique to 4D space
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function create120Cell(options = {}) {
  // Create 5 nested dodecahedra layers (scaled down by 0.6x)
  const outerSize = 1.2; // Outer boundary (was 2.0)
  const layer1Size = 0.96; // First intermediate layer (was 1.6)
  const layer2Size = 0.72; // Second intermediate layer (was 1.2)
  const layer3Size = 0.54; // Third intermediate layer (was 0.9)
  const innerSize = 0.36; // Inner core (was 0.6)

  const outerDodec = new THREE.DodecahedronGeometry(outerSize);
  const layer1Dodec = new THREE.DodecahedronGeometry(layer1Size);
  const layer2Dodec = new THREE.DodecahedronGeometry(layer2Size);
  const layer3Dodec = new THREE.DodecahedronGeometry(layer3Size);
  const innerDodec = new THREE.DodecahedronGeometry(innerSize);

  // Merge all five layers
  const merged120Cell = mergeGeometries([
    outerDodec,
    layer1Dodec,
    layer2Dodec,
    layer3Dodec,
    innerDodec,
  ]);

  // Mark as 120-cell for wireframe/hyperframe builders
  merged120Cell.userData.is120Cell = true;
  merged120Cell.userData.baseType = 'DodecahedronGeometry';
  merged120Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    layer3: layer3Size,
    inner: innerSize,
  };

  return merged120Cell;
}

/**
 * Metadata for the 120-cell geometry
 */
export const metadata = {
  name: '120cell',
  displayName: '⬢ 120-Cell',
  category: 'polytopes',
  description: '4D polytope with 120 dodecahedral cells - 5 nested layers',
  isCompound: false,
  defaultOptions: {},
};
