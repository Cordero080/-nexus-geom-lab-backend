import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a super-compound torus geometry - two complete compound tori merged
 *
 * Each compound torus contains 12 tori:
 * - 1 main torus
 * - 1 nested inner torus (scaled by golden ratio)
 * - 1 orthogonal torus (90° rotation)
 * - 1 orthogonal inner torus
 * - 1 diagonal torus (45° rotation)
 * - 3 mini accent tori at different angles
 * - 4 Villarceau circle tori
 *
 * Total: 24 tori (12 × 2)
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundTorus(options = {}) {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const goldenAngle = (2 * Math.PI) / (phi * phi);
  const tubeScale = 0.5 * 0.75 * 0.85; // Reduced by 50%, then 25%, then 15% (68.125% total reduction)

  // Helper function to create one complete compound torus
  const createCompoundTorusGeometry = (rotationOffset = 0) => {
    const tori = [];

    // Main torus
    const mainRadius = 1.0;
    const mainTube = 0.35 * tubeScale;
    const mainTorus = new THREE.TorusGeometry(mainRadius, mainTube, 24, 48);
    tori.push(mainTorus);

    // Nested inner torus (scaled by golden ratio)
    const innerRadius = mainRadius / phi;
    const innerTube = mainTube / phi;
    const innerTorus = new THREE.TorusGeometry(innerRadius, innerTube, 20, 40);
    tori.push(innerTorus);

    // Orthogonal torus (90° rotation on X)
    const orthoTorus = new THREE.TorusGeometry(mainRadius, mainTube, 24, 48);
    orthoTorus.rotateX(Math.PI / 2);
    tori.push(orthoTorus);

    // Orthogonal inner torus
    const orthoInnerTorus = new THREE.TorusGeometry(
      innerRadius,
      innerTube,
      20,
      40
    );
    orthoInnerTorus.rotateX(Math.PI / 2);
    tori.push(orthoInnerTorus);

    // Diagonal torus (45° on both X and Y)
    const diagTorus = new THREE.TorusGeometry(
      mainRadius * 0.85,
      mainTube * 0.85,
      24,
      48
    );
    diagTorus.rotateX(Math.PI / 4);
    diagTorus.rotateY(Math.PI / 4);
    tori.push(diagTorus);

    // Mini accent tori (3 small tori at different angles)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const miniRadius = mainRadius * 0.4;
      const miniTube = mainTube * 0.3;
      const miniTorus = new THREE.TorusGeometry(miniRadius, miniTube, 16, 32);
      miniTorus.rotateY(angle);
      miniTorus.rotateX(Math.PI / 3);
      miniTorus.translate(
        Math.cos(angle) * mainRadius * 0.6,
        0,
        Math.sin(angle) * mainRadius * 0.6
      );
      tori.push(miniTorus);
    }

    // Villarceau circles (4 small rings showing hidden toroidal structure)
    const villRadius = mainRadius * 0.25;
    const villTube = mainTube * 0.2;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const villTorus = new THREE.TorusGeometry(villRadius, villTube, 12, 24);
      villTorus.rotateZ(Math.PI / 6);
      villTorus.translate(
        Math.cos(angle) * mainRadius * 0.7,
        Math.sin(angle) * mainRadius * 0.7,
        0
      );
      tori.push(villTorus);
    }

    // Merge all tori
    const merged = mergeGeometries(tori, false);
    merged.computeVertexNormals();

    // Apply rotation offset for compound
    if (rotationOffset !== 0) {
      merged.rotateY(rotationOffset);
      merged.rotateX(Math.PI / 5);
      merged.rotateZ(rotationOffset / 3);
    }

    return merged;
  };

  // Create two complete compound tori
  const compoundTorus1 = createCompoundTorusGeometry(0);
  const compoundTorus2 = createCompoundTorusGeometry(goldenAngle);

  // Merge both into super-compound
  const superCompoundTorus = mergeGeometries(
    [compoundTorus1, compoundTorus2],
    false
  );
  superCompoundTorus.computeVertexNormals();

  // Mark as super-compound torus
  superCompoundTorus.userData.isCompound = true;
  superCompoundTorus.userData.isSuperCompound = true;
  superCompoundTorus.userData.baseType = "TorusGeometry";
  superCompoundTorus.userData.isCompoundTorus = true;
  superCompoundTorus.userData.componentCount = 24; // 12 tori × 2

  return superCompoundTorus;
}

/**
 * Metadata for the compound torus geometry
 */
export const metadata = {
  name: "compoundtorus",
  displayName: "🔮 Super-Compound Torus",
  category: "compound",
  description:
    "Two complete compound tori merged - 24 tori total with toroidal symmetry",
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
