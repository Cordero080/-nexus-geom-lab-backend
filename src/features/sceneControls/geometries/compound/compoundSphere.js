import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a super-compound sphere geometry - two complete compound spheres merged
 *
 * Each compound sphere contains ~143 spheres arranged in multiple layers:
 * - 1 center sphere
 * - 12 outer icosahedral spheres
 * - 12 inner icosahedral spheres
 * - 6 axis spheres
 * - 12 antipodal pairs
 * - 6 Steiner chain spheres
 * - 36 ring spheres (3 rings × 12 each)
 * - 24 Fibonacci lattice spheres
 * - 20 dodecahedral vertex spheres
 * - 24 Hopf fibration spheres
 * - 12 geodesic connection spheres
 *
 * Total: ~286 spheres (143 × 2)
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundSphere(options = {}) {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Helper function to create one complete compound sphere
  const createCompoundSphereGeometry = (rotationOffset = 0) => {
    const spheres = [];

    // Center sphere
    const centerRadius = 0.899;
    const centerSphere = new THREE.SphereGeometry(centerRadius, 16, 16);
    spheres.push(centerSphere);

    // Icosahedral vertices
    const a = 1.0 / Math.sqrt(3);
    const b = a / phi;
    const c = a * phi;
    const icoVertices = [
      [0, b, -c],
      [b, c, 0],
      [-b, c, 0],
      [0, b, c],
      [0, -b, c],
      [-c, 0, b],
      [c, 0, b],
      [0, -b, -c],
      [c, 0, -b],
      [-c, 0, -b],
      [b, -c, 0],
      [-b, -c, 0],
    ];

    // Outer icosahedral layer (12 spheres)
    const outerScale = 0.88;
    const outerRadius = 0.35;
    icoVertices.forEach(([x, y, z], i) => {
      const sizeVariation = 1 + Math.sin(i * 0.5) * 0.08;
      const s = new THREE.SphereGeometry(outerRadius * sizeVariation, 16, 16);
      s.translate(x * outerScale, y * outerScale, z * outerScale);
      spheres.push(s);
    });

    // Inner nested icosahedral layer (12 spheres)
    const innerScale = outerScale / phi;
    const innerRadius = outerRadius / phi;
    icoVertices.forEach(([x, y, z], i) => {
      const sizeVariation = 1 + Math.cos(i * 0.7) * 0.08;
      const s = new THREE.SphereGeometry(innerRadius * sizeVariation, 16, 16);
      s.translate(x * innerScale, y * innerScale, z * innerScale);
      spheres.push(s);
    });

    // Axis spheres (6 spheres)
    const axisDistance = centerRadius + 0.24;
    const axisRadius = 0.24;
    const axisPositions = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
    axisPositions.forEach(([x, y, z]) => {
      const s = new THREE.SphereGeometry(axisRadius, 16, 16);
      s.translate(x * axisDistance, y * axisDistance, z * axisDistance);
      spheres.push(s);
    });

    // Antipodal pairs (12 spheres)
    const antipodalScale = outerScale * 1.15;
    const antipodalRadius = 0.12;
    icoVertices.forEach(([x, y, z]) => {
      const s = new THREE.SphereGeometry(antipodalRadius, 16, 16);
      s.translate(-x * antipodalScale, -y * antipodalScale, -z * antipodalScale);
      spheres.push(s);
    });

    // Steiner chain (6 spheres)
    const steinerRadius = 0.22;
    const steinerOrbitRadius = centerRadius + steinerRadius;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const s = new THREE.SphereGeometry(steinerRadius, 16, 16);
      s.translate(Math.cos(angle) * steinerOrbitRadius, 0, Math.sin(angle) * steinerOrbitRadius);
      spheres.push(s);
    }

    // Ring spheres (36 spheres - 12 per ring × 3 rings)
    const ringRadius = 0.08;
    const ringOrbitRadius = 1.15;
    const spheresPerRing = 12;

    // Ring 1: XY plane
    for (let i = 0; i < spheresPerRing; i++) {
      const angle = (i / spheresPerRing) * Math.PI * 2;
      const s = new THREE.SphereGeometry(ringRadius, 12, 12);
      s.translate(Math.cos(angle) * ringOrbitRadius, Math.sin(angle) * ringOrbitRadius, 0);
      spheres.push(s);
    }

    // Ring 2: YZ plane
    for (let i = 0; i < spheresPerRing; i++) {
      const angle = (i / spheresPerRing) * Math.PI * 2;
      const s = new THREE.SphereGeometry(ringRadius, 12, 12);
      s.translate(0, Math.cos(angle) * ringOrbitRadius, Math.sin(angle) * ringOrbitRadius);
      spheres.push(s);
    }

    // Ring 3: Diagonal
    for (let i = 0; i < spheresPerRing; i++) {
      const angle = (i / spheresPerRing) * Math.PI * 2;
      const x = Math.cos(angle) * ringOrbitRadius * 0.707;
      const y = Math.sin(angle) * ringOrbitRadius * 0.707;
      const z = Math.cos(angle) * ringOrbitRadius * 0.707;
      const s = new THREE.SphereGeometry(ringRadius, 12, 12);
      s.translate(x, y, z);
      spheres.push(s);
    }

    // Fibonacci lattice (24 spheres)
    const fibCount = 24;
    const fibRadius = 0.09;
    const fibOrbitRadius = 0.68;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < fibCount; i++) {
      const t = i / fibCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = goldenAngle * i;
      const x = Math.sin(inclination) * Math.cos(azimuth) * fibOrbitRadius;
      const y = Math.sin(inclination) * Math.sin(azimuth) * fibOrbitRadius;
      const z = Math.cos(inclination) * fibOrbitRadius;
      const s = new THREE.SphereGeometry(fibRadius, 12, 12);
      s.translate(x, y, z);
      spheres.push(s);
    }

    // Dodecahedral vertices (20 spheres)
    const t = (1 + Math.sqrt(5)) / 2;
    const dodecaBaseVertices = [
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, 1],
      [1, -1, -1],
      [-1, 1, 1],
      [-1, 1, -1],
      [-1, -1, 1],
      [-1, -1, -1],
      [0, 1 / t, t],
      [0, 1 / t, -t],
      [0, -1 / t, t],
      [0, -1 / t, -t],
      [1 / t, t, 0],
      [1 / t, -t, 0],
      [-1 / t, t, 0],
      [-1 / t, -t, 0],
      [t, 0, 1 / t],
      [t, 0, -1 / t],
      [-t, 0, 1 / t],
      [-t, 0, -1 / t],
    ];
    const dodecaScale = 0.95;
    const dodecaRadius = 0.15;
    dodecaBaseVertices.forEach(([x, y, z], i) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      const sizeVar = 1 + Math.sin(i * 0.3) * 0.06;
      const s = new THREE.SphereGeometry(dodecaRadius * sizeVar, 12, 12);
      s.translate((x / len) * dodecaScale, (y / len) * dodecaScale, (z / len) * dodecaScale);
      spheres.push(s);
    });

    // Hopf fibration circles (24 spheres)
    const hopfRadius = 0.06;
    const hopfCircleRadius = 0.55;
    const spheresPerHopf = 8;
    for (let circle = 0; circle < 3; circle++) {
      const circlePhase = (circle / 3) * Math.PI * 2;
      for (let i = 0; i < spheresPerHopf; i++) {
        const t = (i / spheresPerHopf) * Math.PI * 2;
        const x = hopfCircleRadius * Math.cos(t) * Math.cos(circlePhase);
        const y = hopfCircleRadius * Math.cos(t) * Math.sin(circlePhase);
        const z = hopfCircleRadius * Math.sin(t);
        const s = new THREE.SphereGeometry(hopfRadius, 10, 10);
        s.translate(x, y, z);
        spheres.push(s);
      }
    }

    // Geodesic connection spheres (reduced for compound)
    const geodesicRadius = 0.055;
    const geodesicSteps = 4; // Reduced from 6
    const connections = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];
    connections.forEach(([idx1, idx2]) => {
      const [x1, y1, z1] = icoVertices[idx1];
      const [x2, y2, z2] = icoVertices[idx2];
      const v1 = new THREE.Vector3(x1, y1, z1).normalize().multiplyScalar(outerScale);
      const v2 = new THREE.Vector3(x2, y2, z2).normalize().multiplyScalar(outerScale);
      for (let step = 1; step < geodesicSteps; step++) {
        const t = step / geodesicSteps;
        const mid = new THREE.Vector3()
          .lerpVectors(v1, v2, t)
          .normalize()
          .multiplyScalar(outerScale);
        const s = new THREE.SphereGeometry(geodesicRadius, 10, 10);
        s.translate(mid.x, mid.y, mid.z);
        spheres.push(s);
      }
    });

    // Merge all spheres
    const merged = mergeGeometries(spheres, false);
    merged.computeVertexNormals();

    // Apply rotation offset for compound
    if (rotationOffset !== 0) {
      merged.rotateY(rotationOffset);
      merged.rotateX(Math.PI / 5);
      merged.rotateZ(rotationOffset / 2);
    }

    return merged;
  };

  // Create two complete compound spheres
  const goldenAngle = (2 * Math.PI) / (phi * phi);
  const compoundSphere1 = createCompoundSphereGeometry(0);
  const compoundSphere2 = createCompoundSphereGeometry(goldenAngle);

  // Merge both compound spheres into super-compound
  const superCompound = mergeGeometries([compoundSphere1, compoundSphere2], false);
  superCompound.computeVertexNormals();

  // Mark as super-compound sphere
  superCompound.userData.isCompound = true;
  superCompound.userData.isSuperCompound = true;
  superCompound.userData.baseType = 'SphereGeometry';
  superCompound.userData.isCompoundSphere = true;
  superCompound.userData.componentCount = 286; // Approximate total spheres

  return superCompound;
}

/**
 * Metadata for the compound sphere geometry
 */
export const metadata = {
  name: 'compoundsphere',
  displayName: '🌐 Super-Compound Sphere',
  category: 'compound',
  description: 'Two complete compound spheres merged - ~286 spheres total',
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
