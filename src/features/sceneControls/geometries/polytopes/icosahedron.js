import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a compound icosahedron - two icosahedra merged together
 *
 * The second icosahedron is rotated to create a stella octangula / merkaba effect.
 * This sacred geometry pattern appears in many spiritual and mathematical contexts.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createIcosahedron(options = {}) {
  // Create two icosahedra with 15% larger scale
  const scale = 1.15;
  const ico1 = new THREE.IcosahedronGeometry(scale);
  const ico2 = new THREE.IcosahedronGeometry(scale);

  // Rotate second icosahedron to create stella octangula / merkaba effect
  ico2.rotateX(Math.PI / 2);
  ico2.rotateY(Math.PI / 6);

  // Merge the two geometries
  const mergedIco = mergeGeometries([ico1, ico2]);

  // Mark it as compound for wireframe builders
  mergedIco.userData.isCompound = true;
  mergedIco.userData.baseType = "IcosahedronGeometry";

  return mergedIco;
}

/**
 * Metadata for the icosahedron geometry
 */
export const metadata = {
  name: "icosahedron",
  displayName: "⬡ Compound Icosahedron",
  category: "polytopes",
  description: "Two icosahedra merged with stella octangula effect (merkaba)",
  isCompound: true,
  defaultOptions: {},
};
