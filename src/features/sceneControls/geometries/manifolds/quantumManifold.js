import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a quantum manifold geometry with multiple Klein bottles
 *
 * Klein bottle: A non-orientable surface with no distinguishable inside or outside.
 * This geometry merges 3 Klein bottles at different rotations to create a
 * hyperdimensional manifold structure.
 *
 * Components:
 * - 3 Klein bottles at different rotations
 * - Each Klein bottle uses parametric equations for surface generation
 * - High segment count for smooth curves (160×80 segments)
 *
 * @param {Object} options - Configuration options
 * @param {number} options.uSegments - U-direction segments (default: 160)
 * @param {number} options.vSegments - V-direction segments (default: 80)
 * @param {number} options.scale - Overall scale (default: 0.52)
 * @returns {THREE.BufferGeometry}
 */
export function createQuantumManifold(options = {}) {
  const uSegments = Math.max(32, options.uSegments || 160);
  const vSegments = Math.max(16, options.vSegments || 80);
  const scale = options.scale || 0.52; // Reduced from 0.65 by 20%

  // Klein bottle parametric function
  const klein = (u, v) => {
    // u, v in [0, 2π]
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const c2 = Math.cos(u / 2);
    const s2 = Math.sin(u / 2);
    const sv = Math.sin(v);
    const s2v = Math.sin(2 * v);

    const R = 1.2; // radius scale
    const x = (R + c2 * sv - s2 * s2v) * cu;
    const y = (R + c2 * sv - s2 * s2v) * su;
    const z = s2 * sv + c2 * s2v;
    return new THREE.Vector3(x, y, z);
  };

  // Create base Klein bottle geometry
  const createKleinGeometry = () => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array((uSegments + 1) * (vSegments + 1) * 3);
    const uvs = new Float32Array((uSegments + 1) * (vSegments + 1) * 2);
    const twoPi = Math.PI * 2;

    let ptr = 0;
    let uvptr = 0;
    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * twoPi;
      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments) * twoPi;
        const p = klein(u, v).multiplyScalar(scale);
        positions[ptr++] = p.x;
        positions[ptr++] = p.y;
        positions[ptr++] = p.z;
        uvs[uvptr++] = i / uSegments;
        uvs[uvptr++] = j / vSegments;
      }
    }

    // Build indices
    const indices = [];
    const vert = (i, j) => i * (vSegments + 1) + j;
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = vert(i, j);
        const b = vert(i + 1, j);
        const c = vert(i + 1, j + 1);
        const d = vert(i, j + 1);
        indices.push(a, b, d, b, c, d);
      }
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  // Create 3 Klein bottles with different rotations
  const klein1 = createKleinGeometry();
  const klein2 = createKleinGeometry();
  klein2.rotateX(Math.PI / 2);
  klein2.rotateY(Math.PI / 3);

  const klein3 = createKleinGeometry();
  klein3.rotateY(Math.PI / 2);
  klein3.rotateZ(Math.PI / 4);

  // Merge all three into compound manifold
  const merged = mergeGeometries(
    [klein1.toNonIndexed(), klein2.toNonIndexed(), klein3.toNonIndexed()],
    false
  );
  merged.computeVertexNormals();

  // Mark as compound quantum manifold
  merged.userData.isCompound = true;
  merged.userData.baseType = "ParametricKlein";
  merged.userData.isQuantumManifold = true;
  merged.userData.componentCount = 3;

  return merged;
}

/**
 * Metadata for the quantum manifold geometry
 */
export const metadata = {
  name: "quantummanifold",
  displayName: "🌀 Quantum Manifold",
  category: "manifolds",
  description:
    "Non-orientable Klein bottle topology - 3 Klein bottles merged for hyperdimensional structure",
  isCompound: true,
  defaultOptions: {
    uSegments: 160,
    vSegments: 80,
    scale: 0.52,
  },
};
