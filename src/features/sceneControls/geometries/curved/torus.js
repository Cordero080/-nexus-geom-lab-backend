import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a compound torus geometry with multiple nested and intersecting tori
 *
 * Components:
 * - 1 main torus (primary ring)
 * - 1 nested inner torus (scaled by golden ratio)
 * - 1 orthogonal torus (90° rotation)
 * - 1 orthogonal inner torus
 * - 1 diagonal torus (45° rotation)
 * - 3 mini accent tori at different angles
 * - 4 Villarceau circles (small rings showing hidden toroidal structure)
 *
 * Total: 12 tori with beautiful flowing curved geometry and toroidal symmetry
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createTorus(options = {}) {
  const tori = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Main torus - primary ring
  const mainRadius = 1.0;
  const mainTube = 0.35;
  const mainTorus = new THREE.TorusGeometry(mainRadius, mainTube, 24, 48);
  tori.push(mainTorus);

  // Nested inner torus - scaled by golden ratio
  const innerRadius = mainRadius / phi; // ~0.618
  const innerTube = mainTube / phi; // ~0.216
  const innerTorus = new THREE.TorusGeometry(innerRadius, innerTube, 20, 40);
  tori.push(innerTorus);

  // Orthogonal torus (90° rotation on X) - creates ring intersection
  const orthoTorus = new THREE.TorusGeometry(mainRadius, mainTube, 24, 48);
  orthoTorus.rotateX(Math.PI / 2);
  tori.push(orthoTorus);

  // Orthogonal inner torus
  const orthoInnerTorus = new THREE.TorusGeometry(innerRadius, innerTube, 20, 40);
  orthoInnerTorus.rotateX(Math.PI / 2);
  tori.push(orthoInnerTorus);

  // Diagonal torus (45° on both X and Y) - third axis
  const diagTorus = new THREE.TorusGeometry(mainRadius * 0.85, mainTube * 0.85, 24, 48);
  diagTorus.rotateX(Math.PI / 4);
  diagTorus.rotateY(Math.PI / 4);
  tori.push(diagTorus);

  // Mini accent tori - 3 small tori at different angles
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const miniRadius = mainRadius * 0.4;
    const miniTube = mainTube * 0.3;
    const miniTorus = new THREE.TorusGeometry(miniRadius, miniTube, 16, 32);

    // Rotate and position
    miniTorus.rotateY(angle);
    miniTorus.rotateX(Math.PI / 3);
    miniTorus.translate(Math.cos(angle) * mainRadius * 0.6, 0, Math.sin(angle) * mainRadius * 0.6);
    tori.push(miniTorus);
  }

  // Villarceau circles - 4 small rings showing hidden toroidal structure
  const villRadius = mainRadius * 0.25;
  const villTube = mainTube * 0.2;
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const villTorus = new THREE.TorusGeometry(villRadius, villTube, 12, 24);
    villTorus.rotateZ(Math.PI / 6);
    villTorus.translate(Math.cos(angle) * mainRadius * 0.7, Math.sin(angle) * mainRadius * 0.7, 0);
    tori.push(villTorus);
  }

  // Merge all tori
  const mergedTorus = mergeGeometries(tori, false);
  mergedTorus.computeVertexNormals();

  // Mark as compound torus
  mergedTorus.userData.isCompound = true;
  mergedTorus.userData.baseType = 'TorusGeometry';
  mergedTorus.userData.componentCount = tori.length;

  return mergedTorus;
}

/**
 * Metadata for the torus geometry
 */
export const metadata = {
  name: 'torus',
  displayName: '🔮 Compound Torus',
  category: 'curved',
  description: 'Multiple nested and intersecting tori - 12 tori with toroidal symmetry',
  isCompound: true,
  defaultOptions: {},
};
