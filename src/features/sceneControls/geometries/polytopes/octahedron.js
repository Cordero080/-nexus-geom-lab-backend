import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a compound octahedron - two octahedra merged at 45° rotation
 *
 * The second octahedron is rotated 45° on Y-axis for a compound effect,
 * creating an interesting interpenetrating structure.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createOctahedron(options = {}) {
  // Create two octahedra
  const oct1 = new THREE.OctahedronGeometry();
  const oct2 = new THREE.OctahedronGeometry();

  // Rotate second octahedron 45° on Y axis for compound effect
  oct2.rotateY(Math.PI / 4);

  // Slight vertical offset to prevent z-fighting on overlapping faces
  oct2.translate(0, 0.02, 0);

  // Merge the two geometries
  const mergedOct = mergeGeometries([oct1, oct2], false);

  // Recompute normals for proper lighting
  mergedOct.computeVertexNormals();

  // Mark it as compound for wireframe builders
  mergedOct.userData.isCompound = true;
  mergedOct.userData.baseType = 'OctahedronGeometry';

  return mergedOct;
}

/**
 * Metadata for the octahedron geometry
 */
export const metadata = {
  name: 'octahedron',
  displayName: '◆ Compound Octahedron',
  category: 'polytopes',
  description: 'Two octahedra merged at 45° rotation',
  isCompound: true,
  defaultOptions: {},
};
