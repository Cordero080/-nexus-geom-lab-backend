import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a stella octangula (compound tetrahedron)
 *
 * Two interpenetrating tetrahedra forming the classic stella octangula.
 * The second tetrahedron is inverted (dual tetrahedron) by scaling -1 on all axes.
 *
 * This is one of the most beautiful geometric forms, also known as the
 * "Star of David" in 3D.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.size - Size of the tetrahedra (default: 1.2)
 * @returns {THREE.BufferGeometry}
 */
export function createTetrahedron(options = {}) {
  const size = options.size || 1.2;

  // Create two tetrahedra
  const tet1 = new THREE.TetrahedronGeometry(size);
  const tet2 = new THREE.TetrahedronGeometry(size);

  // Invert second tetrahedron by scaling -1 on all axes (creates true dual tetrahedron)
  tet2.scale(-1, -1, -1);

  // Slight vertical offset to prevent z-fighting on overlapping faces
  tet2.translate(0, 0.02, 0);

  // Merge the two geometries
  const mergedTet = mergeGeometries([tet1, tet2], false);

  // Recompute normals for proper lighting
  mergedTet.computeVertexNormals();

  // Mark it as compound for wireframe builders
  mergedTet.userData.isCompound = true;
  mergedTet.userData.baseType = "TetrahedronGeometry";

  return mergedTet;
}

/**
 * Metadata for the tetrahedron geometry
 */
export const metadata = {
  name: "tetrahedron",
  displayName: "▲ Stella Octangula",
  category: "polytopes",
  description:
    "Two interpenetrating tetrahedra (Star of David in 3D) - classical compound",
  isCompound: true,
  defaultOptions: {
    size: 1.2,
  },
};
