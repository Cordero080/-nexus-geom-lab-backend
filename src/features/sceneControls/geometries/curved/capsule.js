import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a compound capsule/spherocylinder geometry
 *
 * A capsule is a cylinder with spherical caps at both ends, creating smooth
 * curved geometry with perfect tangency. This compound version merges multiple
 * capsules at different orientations and scales.
 *
 * Components:
 * - 1 main vertical capsule
 * - 2 horizontal capsules (X and Z axes)
 * - 4 diagonal capsules at 45° angles
 * - 6 small orbital capsules
 * - 3 golden ratio scaled mini capsules
 *
 * Total: 16 capsules creating flowing organic shapes
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCapsule(options = {}) {
  const capsules = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Helper to create a capsule (cylinder with spherical caps)
  const createCapsuleGeometry = (radius, height, segments = 16) => {
    const parts = [];

    // Central cylinder
    const cylinder = new THREE.CylinderGeometry(radius, radius, height, segments);
    parts.push(cylinder);

    // Top sphere cap
    const topSphere = new THREE.SphereGeometry(radius, segments, segments);
    topSphere.translate(0, height / 2, 0);
    parts.push(topSphere);

    // Bottom sphere cap
    const bottomSphere = new THREE.SphereGeometry(radius, segments, segments);
    bottomSphere.translate(0, -height / 2, 0);
    parts.push(bottomSphere);

    return mergeGeometries(parts, false);
  };

  // Main vertical capsule
  const mainCapsule = createCapsuleGeometry(0.3, 1.5, 24);
  capsules.push(mainCapsule);

  // Horizontal X-axis capsule
  const xCapsule = createCapsuleGeometry(0.25, 1.3, 20);
  xCapsule.rotateZ(Math.PI / 2);
  capsules.push(xCapsule);

  // Horizontal Z-axis capsule
  const zCapsule = createCapsuleGeometry(0.25, 1.3, 20);
  zCapsule.rotateX(Math.PI / 2);
  capsules.push(zCapsule);

  // Diagonal capsules at 45° angles
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const diagCapsule = createCapsuleGeometry(0.15, 1.0, 16);
    diagCapsule.rotateZ(Math.PI / 4);
    diagCapsule.rotateY(angle);
    capsules.push(diagCapsule);
  }

  // Small accent capsules in orbital pattern
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const smallCapsule = createCapsuleGeometry(0.08, 0.5, 12);
    smallCapsule.rotateX(Math.PI / 3);
    smallCapsule.rotateY(angle);
    smallCapsule.translate(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
    capsules.push(smallCapsule);
  }

  // Golden ratio scaled mini capsules
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const miniCapsule = createCapsuleGeometry(0.12 / phi, 0.6 / phi, 12);
    miniCapsule.rotateZ(Math.PI / 6);
    miniCapsule.rotateY(angle + Math.PI / 6);
    miniCapsule.translate(Math.cos(angle) * 0.5, Math.sin(angle) * 0.3, Math.sin(angle) * 0.5);
    capsules.push(miniCapsule);
  }

  // Merge all capsules
  const mergedCapsule = mergeGeometries(capsules, false);
  mergedCapsule.computeVertexNormals();

  // Mark as compound capsule
  mergedCapsule.userData.isCompound = true;
  mergedCapsule.userData.baseType = 'CapsuleGeometry';
  mergedCapsule.userData.componentCount = capsules.length;

  return mergedCapsule;
}

/**
 * Metadata for the capsule geometry
 */
export const metadata = {
  name: 'capsule',
  displayName: '⬭ Compound Capsule',
  category: 'curved',
  description:
    'Smooth spherocylinders with perfect tangency - 16 capsules in flowing organic arrangement',
  isCompound: true,
  defaultOptions: {},
};
