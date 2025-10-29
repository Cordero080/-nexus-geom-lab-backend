import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a Hessian polychoron with icosahedral 5-fold symmetry
 * Uses 5 compounds rotated by 72° (pentagonal symmetry)
 * Each compound has 3 nested icosahedra layers
 * Total: 15 shells with proper icosahedral orientation
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createHessianPolychoron(options = {}) {
  // Create 5-compound using icosahedral symmetry (72° rotations)
  // Based on compound of 5 cubes/tetrahedra inscribed in dodecahedron
  const baseRotationAngle = (2 * Math.PI) / 5; // 72° pentagonal symmetry

  const compounds = [];

  for (let i = 0; i < 5; i += 1) {
    // Each compound has 3 nested layers
    const outer = new THREE.IcosahedronGeometry(1.2, 1);
    const middle = new THREE.IcosahedronGeometry(1.0, 1);
    const inner = new THREE.IcosahedronGeometry(0.72, 1);

    // Apply icosahedral rotational symmetry
    // Rotate around Y-axis by 72° increments
    const primaryRotation = baseRotationAngle * i;

    // Secondary rotation around axis through opposite vertices
    // Creates proper icosahedral symmetry group orientation
    const secondaryRotation = Math.atan(2); // ~63.43° (golden angle complement)

    outer.rotateY(primaryRotation);
    outer.rotateX(secondaryRotation);

    middle.rotateY(primaryRotation);
    middle.rotateX(secondaryRotation);
    middle.rotateZ(Math.PI / 10); // Additional twist for depth

    inner.rotateY(primaryRotation);
    inner.rotateX(secondaryRotation);
    inner.rotateZ(Math.PI / 6);

    compounds.push(outer, middle, inner);
  }

  const merged = mergeGeometries(compounds, false);
  merged.computeVertexNormals();

  // Mark as Hessian polychoron for custom hyperframe
  merged.userData.isHessianPolychoron = true;
  merged.userData.isCompound = true;
  merged.userData.isSuperCompound = true;
  merged.userData.baseType = "IcosahedronGeometry";
  merged.userData.componentCount = 15; // 5 compounds × 3 layers
  merged.userData.symmetry = "icosahedral-5-fold";
  merged.userData.layers = {
    compounds: 5,
    layersPerCompound: 3,
    symmetryAngle: baseRotationAngle,
  };

  return merged;
}

export const metadata = {
  name: "hessianpolychoron",
  displayName: "✦ Hessian Polychoron",
  category: "polytopes",
  description:
    "5-compound with icosahedral symmetry: 15 nested shells (5 × 3) rotated by 72° pentagonal symmetry.",
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
