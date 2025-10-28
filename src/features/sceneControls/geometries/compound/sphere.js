import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a harmonic sphere composition with nested icosahedra + golden ratio sizing + axis symmetry
 *
 * Components (~143 spheres total):
 * - 1 center sphere (foundation)
 * - 12 outer icosahedral layer spheres
 * - 12 inner nested icosahedral layer spheres (scaled by 1/φ)
 * - 6 axis spheres (±X, ±Y, ±Z) - kissing configuration
 * - 12 antipodal pairs (opposite outer vertices)
 * - 6 Steiner chain spheres (equator)
 * - 36 ring spheres (3 rings × 12 each: XY, YZ, diagonal)
 * - 24 Fibonacci lattice spheres (natural spiral distribution)
 * - 20 dodecahedral vertex spheres (dual of icosahedron)
 * - 24 Hopf fibration circles (4D→3D projection)
 * - 40 geodesic connection spheres (tracing great circles)
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createSphere(options = {}) {
  const spheres = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio: 1.618...

  // Center sphere - foundation
  const centerRadius = 0.899;
  const centerSphere = new THREE.SphereGeometry(centerRadius, 16, 16);
  spheres.push(centerSphere);

  // Icosahedral geometry constants
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

  // Outer icosahedral layer (12 spheres) - scaled by φ
  const outerScale = 0.88;
  const outerRadius = 0.35;
  icoVertices.forEach(([x, y, z], i) => {
    // Organic flow: vary size slightly based on position for natural feel
    const sizeVariation = 1 + Math.sin(i * 0.5) * 0.08;
    const s = new THREE.SphereGeometry(outerRadius * sizeVariation, 16, 16);
    s.translate(x * outerScale, y * outerScale, z * outerScale);
    spheres.push(s);
  });

  // Inner nested icosahedral layer (12 spheres) - scaled by 1/φ for golden harmony
  const innerScale = outerScale / phi; // ~0.544
  const innerRadius = outerRadius / phi; // ~0.216
  icoVertices.forEach(([x, y, z], i) => {
    // Organic flow with different phase
    const sizeVariation = 1 + Math.cos(i * 0.7) * 0.08;
    const s = new THREE.SphereGeometry(innerRadius * sizeVariation, 16, 16);
    s.translate(x * innerScale, y * innerScale, z * innerScale);
    spheres.push(s);
  });

  // Axis spheres (6 spheres on ±X, ±Y, ±Z) - tangent-accurate kissing configuration
  const axisDistance = centerRadius + 0.24; // Kissing: center radius + axis radius
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

  // Antipodal pairs (12 tiny spheres) - opposite each outer icosahedral vertex
  const antipodalScale = outerScale * 1.15; // Slightly further out
  const antipodalRadius = 0.12;
  icoVertices.forEach(([x, y, z]) => {
    const s = new THREE.SphereGeometry(antipodalRadius, 16, 16);
    s.translate(-x * antipodalScale, -y * antipodalScale, -z * antipodalScale);
    spheres.push(s);
  });

  // Steiner chain (6 spheres around equator) - tangent-accurate to center
  const steinerRadius = 0.22;
  const steinerOrbitRadius = centerRadius + steinerRadius; // Perfect tangency
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const s = new THREE.SphereGeometry(steinerRadius, 16, 16);
    s.translate(
      Math.cos(angle) * steinerOrbitRadius,
      0,
      Math.sin(angle) * steinerOrbitRadius
    );
    spheres.push(s);
  }

  // Ring spheres - Three orbital rings at different angles (like Saturn's rings)
  const ringRadius = 0.08;
  const ringOrbitRadius = 1.15;
  const spheresPerRing = 12;

  // Ring 1: XY plane
  for (let i = 0; i < spheresPerRing; i++) {
    const angle = (i / spheresPerRing) * Math.PI * 2;
    const s = new THREE.SphereGeometry(ringRadius, 12, 12);
    s.translate(
      Math.cos(angle) * ringOrbitRadius,
      Math.sin(angle) * ringOrbitRadius,
      0
    );
    spheres.push(s);
  }

  // Ring 2: YZ plane (rotated 60°)
  for (let i = 0; i < spheresPerRing; i++) {
    const angle = (i / spheresPerRing) * Math.PI * 2;
    const s = new THREE.SphereGeometry(ringRadius, 12, 12);
    s.translate(
      0,
      Math.cos(angle) * ringOrbitRadius,
      Math.sin(angle) * ringOrbitRadius
    );
    spheres.push(s);
  }

  // Ring 3: Diagonal plane (45° tilt)
  for (let i = 0; i < spheresPerRing; i++) {
    const angle = (i / spheresPerRing) * Math.PI * 2;
    const x = Math.cos(angle) * ringOrbitRadius * 0.707;
    const y = Math.sin(angle) * ringOrbitRadius * 0.707;
    const z = Math.cos(angle) * ringOrbitRadius * 0.707;
    const s = new THREE.SphereGeometry(ringRadius, 12, 12);
    s.translate(x, y, z);
    spheres.push(s);
  }

  // Fibonacci lattice spheres - Natural spiral distribution
  const fibCount = 24;
  const fibRadius = 0.09;
  const fibOrbitRadius = 0.68;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

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

  // Dodecahedral vertices (20 spheres) - Dual of icosahedron
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

  const dodecaScale = 0.72;
  const dodecaRadius = 0.15;
  dodecaBaseVertices.forEach(([x, y, z], i) => {
    const len = Math.sqrt(x * x + y * y + z * z);
    const sizeVar = 1 + Math.sin(i * 0.3) * 0.06;
    const s = new THREE.SphereGeometry(dodecaRadius * sizeVar, 12, 12);
    s.translate(
      (x / len) * dodecaScale,
      (y / len) * dodecaScale,
      (z / len) * dodecaScale
    );
    spheres.push(s);
  });

  // Hopf fibration circles - 3 circles showing 4D→3D projection
  const hopfRadius = 0.06;
  const hopfCircleRadius = 0.55;
  const spheresPerHopf = 8;

  for (let circle = 0; circle < 3; circle++) {
    const circlePhase = (circle / 3) * Math.PI * 2;
    for (let i = 0; i < spheresPerHopf; i++) {
      const t = (i / spheresPerHopf) * Math.PI * 2;
      // Parametric Hopf circle
      const x = hopfCircleRadius * Math.cos(t) * Math.cos(circlePhase);
      const y = hopfCircleRadius * Math.cos(t) * Math.sin(circlePhase);
      const z = hopfCircleRadius * Math.sin(t);

      const s = new THREE.SphereGeometry(hopfRadius, 10, 10);
      s.translate(x, y, z);
      spheres.push(s);
    }
  }

  // Geodesic connection spheres - Trace great circles between icosahedral vertices
  const geodesicRadius = 0.055;
  const geodesicSteps = 6;
  // Connect some key icosahedral vertex pairs
  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Top ring
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 7], // Bottom ring
  ];

  connections.forEach(([idx1, idx2]) => {
    const [x1, y1, z1] = icoVertices[idx1];
    const [x2, y2, z2] = icoVertices[idx2];

    for (let step = 1; step < geodesicSteps; step++) {
      const t = step / geodesicSteps;
      // Spherical interpolation (slerp)
      const x = x1 * (1 - t) + x2 * t;
      const y = y1 * (1 - t) + y2 * t;
      const z = z1 * (1 - t) + z2 * t;
      const len = Math.sqrt(x * x + y * y + z * z);

      const s = new THREE.SphereGeometry(geodesicRadius, 10, 10);
      s.translate(
        (x / len) * outerScale,
        (y / len) * outerScale,
        (z / len) * outerScale
      );
      spheres.push(s);
    }
  });

  // Merge all spheres
  const mergedSphere = mergeGeometries(spheres, false);
  mergedSphere.computeVertexNormals();

  // Mark as compound for wireframe builders
  mergedSphere.userData.isCompound = true;
  mergedSphere.userData.baseType = "SphereGeometry";
  mergedSphere.userData.componentCount = spheres.length;

  return mergedSphere;
}

/**
 * Metadata for the sphere geometry
 */
export const metadata = {
  name: "sphere",
  displayName: "🌐 Harmonic Sphere",
  category: "compound",
  description:
    "Nested icosahedra with golden ratio sizing and axis symmetry - ~143 spheres",
  isCompound: true,
  defaultOptions: {},
};
