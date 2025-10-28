import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a Möbius sphere with twisted topology
 *
 * Uses tori with parametric twisting to simulate non-orientable surface topology.
 * The Möbius strip is a surface with only one side and one boundary component.
 * This 3D interpretation creates a sphere-like structure with twisted paths.
 *
 * Components:
 * - 1 central sphere core
 * - 4 main and orthogonal tori creating twisted paths
 * - 12 orbital spheres following twisted pattern
 * - 8 inner spheres at golden ratio positions
 * - 5 vertical axis spheres showing non-orientability
 * - 4 mini accent tori at perpendicular angles
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createMobiusSphere(options = {}) {
  const parts = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Central sphere core
  const centerSphere = new THREE.SphereGeometry(0.5, 32, 32);
  parts.push(centerSphere);

  // Main torus ring
  const mainTorus = new THREE.TorusGeometry(1.0, 0.15, 16, 48);
  parts.push(mainTorus);

  // Orthogonal torus
  const orthoTorus = new THREE.TorusGeometry(1.0, 0.15, 16, 48);
  orthoTorus.rotateX(Math.PI / 2);
  parts.push(orthoTorus);

  // Diagonal torus at 45°
  const diagTorus1 = new THREE.TorusGeometry(0.85, 0.12, 16, 40);
  diagTorus1.rotateX(Math.PI / 4);
  diagTorus1.rotateY(Math.PI / 4);
  parts.push(diagTorus1);

  // Counter-diagonal torus
  const diagTorus2 = new THREE.TorusGeometry(0.85, 0.12, 16, 40);
  diagTorus2.rotateX(-Math.PI / 4);
  diagTorus2.rotateY(Math.PI / 4);
  parts.push(diagTorus2);

  // Orbital spheres following the twisted path
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 1.0;

    // Create twisted orbital pattern
    const twist = angle * 0.5;
    const x = Math.cos(angle) * (radius + 0.15 * Math.cos(twist));
    const y = Math.sin(angle) * (radius + 0.15 * Math.cos(twist));
    const z = 0.2 * Math.sin(twist);

    const orbSphere = new THREE.SphereGeometry(0.08, 16, 16);
    orbSphere.translate(x, y, z);
    parts.push(orbSphere);
  }

  // Inner spheres at golden ratio positions
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const innerRadius = 0.6;
    const sphere = new THREE.SphereGeometry(0.06, 12, 12);
    sphere.translate(
      Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
      0
    );
    parts.push(sphere);
  }

  // Vertical axis spheres showing non-orientability
  for (let i = 0; i < 5; i++) {
    const z = (i / 4 - 0.5) * 1.5;
    const sphere = new THREE.SphereGeometry(0.05, 12, 12);
    sphere.translate(0, 0, z);
    parts.push(sphere);
  }

  // Mini accent tori at perpendicular angles
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const miniTorus = new THREE.TorusGeometry(0.3, 0.05, 12, 24);
    miniTorus.rotateZ(Math.PI / 2);
    miniTorus.rotateY(angle);
    miniTorus.translate(Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0);
    parts.push(miniTorus);
  }

  // Merge all parts
  const mergedMobius = mergeGeometries(parts, false);
  mergedMobius.computeVertexNormals();

  // Mark as Möbius sphere
  mergedMobius.userData.isCompound = true;
  mergedMobius.userData.baseType = "SphereGeometry";
  mergedMobius.userData.isMobiusSphere = true;
  mergedMobius.userData.componentCount = parts.length;

  return mergedMobius;
}

/**
 * Metadata for the Möbius sphere geometry
 */
export const metadata = {
  name: "mobiussphere",
  displayName: "∞ Möbius Sphere",
  category: "manifolds",
  description:
    "Twisted topology sphere with non-orientable surface - simulates Möbius strip in 3D",
  isCompound: true,
  defaultOptions: {},
};
