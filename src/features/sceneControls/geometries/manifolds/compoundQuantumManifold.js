import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a compound quantum manifold - two complete quantum manifolds merged
 *
 * This is the ultimate hyperdimensional structure combining 6 Klein bottles total.
 * Each manifold contains 3 Klein bottles, and they're merged at golden angle
 * rotation for optimal symmetry.
 *
 * Components:
 * - First quantum manifold: 3 Klein bottles
 * - Second quantum manifold: 3 Klein bottles (rotated by golden angle)
 * - Total: 6 Klein bottles in super-compound structure
 *
 * @param {Object} options - Configuration options
 * @param {number} options.uSegments - U-direction segments (default: 160)
 * @param {number} options.vSegments - V-direction segments (default: 80)
 * @param {number} options.scale - Overall scale (default: 0.52)
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundQuantumManifold(options = {}) {
  const uSegments = Math.max(32, options.uSegments || 160);
  const vSegments = Math.max(16, options.vSegments || 80);
  const scale = options.scale || 0.479; // Scaled to match compound icosahedron visual size

  // Klein bottle parametric function
  const klein = (u, v) => {
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const c2 = Math.cos(u / 2);
    const s2 = Math.sin(u / 2);
    const sv = Math.sin(v);
    const s2v = Math.sin(2 * v);

    const R = 1.2;
    const x = (R + c2 * sv - s2 * s2v) * cu;
    const y = (R + c2 * sv - s2 * s2v) * su;
    const z = s2 * sv + c2 * s2v;
    return new THREE.Vector3(x, y, z);
  };

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

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  // FIRST QUANTUM MANIFOLD (3 Klein bottles)
  const klein1A = createKleinGeometry();
  const klein2A = createKleinGeometry();
  klein2A.rotateX(Math.PI / 2);
  klein2A.rotateY(Math.PI / 3);
  const klein3A = createKleinGeometry();
  klein3A.rotateY(Math.PI / 2);
  klein3A.rotateZ(Math.PI / 4);

  // SECOND QUANTUM MANIFOLD (3 Klein bottles, rotated for compound)
  const klein1B = createKleinGeometry();
  const klein2B = createKleinGeometry();
  const klein3B = createKleinGeometry();

  // Golden ratio for hyperdimensional symmetry
  const phi = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = (2 * Math.PI) / (phi * phi);

  // Rotate second manifold using golden angle
  [klein1B, klein2B, klein3B].forEach((geom) => {
    geom.rotateX(goldenAngle);
    geom.rotateY(Math.PI / phi);
    geom.rotateZ(goldenAngle / 2);
  });

  // Apply second manifold's internal rotations AFTER golden rotation
  klein2B.rotateX(Math.PI / 2);
  klein2B.rotateY(Math.PI / 3);
  klein3B.rotateY(Math.PI / 2);
  klein3B.rotateZ(Math.PI / 4);

  // Merge all 6 Klein bottles into super-compound
  const merged = mergeGeometries(
    [
      klein1A.toNonIndexed(),
      klein2A.toNonIndexed(),
      klein3A.toNonIndexed(),
      klein1B.toNonIndexed(),
      klein2B.toNonIndexed(),
      klein3B.toNonIndexed(),
    ],
    false
  );
  merged.computeVertexNormals();

  // Mark as compound quantum manifold (THE ULTIMATE STRUCTURE)
  merged.userData.isCompound = true;
  merged.userData.isSuperCompound = true;
  merged.userData.baseType = 'ParametricKlein';
  merged.userData.isQuantumManifold = true;
  merged.userData.isCompoundQuantumManifold = true;
  merged.userData.componentCount = 6; // 6 Klein bottles!

  return merged;
}

/**
 * Metadata for the compound quantum manifold geometry
 */
export const metadata = {
  name: 'compoundquantummanifold',
  displayName: '🌌 Compound Quantum Manifold',
  category: 'manifolds',
  description: 'Ultimate hyperdimensional structure - 6 Klein bottles merged at golden angle',
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {
    uSegments: 160,
    vSegments: 80,
    scale: 0.52,
  },
};
