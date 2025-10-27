import * as THREE from "three";
import {
  mergeGeometries,
  mergeVertices,
} from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Create a tesseract with connecting frustum faces between outer and inner cubes
 * @param {number} outerSize - Size of outer cube
 * @param {number} innerSize - Size of inner cube
 * @param {THREE.Euler} rotation - Optional rotation to apply
 * @returns {THREE.BufferGeometry} Complete tesseract with outer, inner, and connecting faces
 */
function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
  const geometries = [];

  // Outer cube
  const outer = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
  if (rotation) outer.rotateY(rotation);
  geometries.push(outer);

  // Inner cube
  const inner = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
  if (rotation) inner.rotateY(rotation);
  inner.translate(0, 0.01, 0); // Slight offset to prevent z-fighting
  geometries.push(inner);

  // Create 6 connecting frustums (one for each face of the cube)
  // Each frustum connects a face of the outer cube to the corresponding face of the inner cube
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  const depth = (outerSize - innerSize) / 2;

  // Top face frustum (Y+)
  const topFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  topFrustum.rotateY(Math.PI / 4); // Align square cross-section
  topFrustum.translate(0, halfOuter + depth / 2, 0);
  if (rotation) topFrustum.rotateY(rotation);
  geometries.push(topFrustum);

  // Bottom face frustum (Y-)
  const bottomFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  // Front face frustum (Z+)
  const frontFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  // Back face frustum (Z-)
  const backFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  // Right face frustum (X+)
  const rightFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  // Left face frustum (X-)
  const leftFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

//

export function createGeometry(type = "icosahedron", options = {}) {
  switch (type) {
    case "quantummanifold": {
      // Create compound quantum manifold with multiple Klein bottles
      const opts = options.quantummanifold || {};
      const uSegments = Math.max(32, opts.uSegments || 160);
      const vSegments = Math.max(16, opts.vSegments || 80);
      const scale = opts.scale || 0.52; // Reduced from 0.65 by 20%

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
        const positions = new Float32Array(
          (uSegments + 1) * (vSegments + 1) * 3
        );
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
    case "icosahedron":
      // Create compound icosahedron - two merged together
      const ico1 = new THREE.IcosahedronGeometry();
      const ico2 = new THREE.IcosahedronGeometry();

      // Rotate second icosahedron to create stella octangula / merkaba effect
      ico2.rotateX(Math.PI / 2);
      ico2.rotateY(Math.PI / 6);

      // Merge the two geometries
      const mergedIco = mergeGeometries([ico1, ico2]);
      // Mark it as compound for wireframe builders
      mergedIco.userData.isCompound = true;
      mergedIco.userData.baseType = "IcosahedronGeometry";

      return mergedIco;
    case "sphere": {
      // Harmonic sphere composition: nested icosahedra + golden ratio sizing + axis symmetry
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
        s.translate(
          -x * antipodalScale,
          -y * antipodalScale,
          -z * antipodalScale
        );
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
      const dodecaVertices = [];
      // Generate dodecahedron vertices (face centers of icosahedron)
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
    case "cube":
      // Simple cube (BoxGeometry) for classic cube shape
      // Kept separate from "box" which represents the compound tesseract variant
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "box":
      // COMPOUND TESSERACT (was "hypercube") - two 4D hypercubes interpenetrating
      // Each tesseract has outer cube, inner cube, AND 6 connecting frustum faces
      // Second tesseract rotated 45° to create compound 4D structure

      // First tesseract with connecting faces
      const tesseract1 = createTesseractWithFaces(1.5, 0.75, null);

      // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
      const tesseract2 = createTesseractWithFaces(1.5, 0.75, Math.PI / 4);
      tesseract2.translate(0, 0.02, 0); // Slight offset to prevent z-fighting

      // Merge both complete tesseracts
      const mergedCpdTesseract = mergeGeometries(
        [tesseract1, tesseract2],
        false
      );

      // Recompute normals for proper lighting
      mergedCpdTesseract.computeVertexNormals();

      // Mark it as compound tesseract for wireframe builders
      mergedCpdTesseract.userData.isCompound = true;
      mergedCpdTesseract.userData.baseType = "BoxGeometry";
      mergedCpdTesseract.userData.isCpdTesseract = true; // Flag for compound tesseract

      return mergedCpdTesseract;
    case "hypercube":
      // OLD HYPERCUBE (simple concentric cubes) - kept for reference
      // Use "box" for the new compound tesseract instead
      const outerCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const innerCube = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      innerCube.translate(0, 0.02, 0);
      const mergedBox = mergeGeometries([outerCube, innerCube], false);
      mergedBox.computeVertexNormals();
      mergedBox.userData.isCompound = true;
      mergedBox.userData.baseType = "BoxGeometry";
      mergedBox.userData.isHypercube = true;
      return mergedBox;
    case "cpdtesseract":
      // MEGA TESSERACT - scaled down version of compound tesseract with OUTER LAYER
      // Each tesseract has outer cube, inner cube, AND 6 connecting frustum faces
      // Second tesseract rotated 45° to create compound 4D structure

      // INNER PAIR - First tesseract with connecting faces (SMALLER)
      const megaTess1 = createTesseractWithFaces(0.75, 0.375, null);

      // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
      const megaTess2 = createTesseractWithFaces(0.75, 0.375, Math.PI / 4);
      megaTess2.translate(0, 0.01, 0); // Slight offset to prevent z-fighting

      // OUTER PAIR - Larger encasing layer
      const megaTess3 = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
      megaTess3.translate(0, 0.02, 0);

      const megaTess4 = createTesseractWithFaces(
        2.0,
        1.5,
        Math.PI / 8 + Math.PI / 4
      );
      megaTess4.translate(0, 0.03, 0);

      // Merge all four tesseracts
      const mergedMegaTesseract = mergeGeometries(
        [megaTess1, megaTess2, megaTess3, megaTess4],
        false
      );

      // Recompute normals for proper lighting
      mergedMegaTesseract.computeVertexNormals();

      // Mark it as compound tesseract for wireframe builders
      mergedMegaTesseract.userData.isCompound = true;
      mergedMegaTesseract.userData.baseType = "BoxGeometry";
      mergedMegaTesseract.userData.isMegaTesseract = true; // Flag for MEGA tesseract (not cpd)

      return mergedMegaTesseract;
    case "octahedron":
      // Create compound octahedron - two merged at 45° rotation
      const oct1 = new THREE.OctahedronGeometry();
      const oct2 = new THREE.OctahedronGeometry();

      // Rotate second octahedron 45° on Y axis for compound effect
      oct2.rotateY(Math.PI / 4);

      // Slight vertical offset to prevent z-fighting on overlapping faces
      oct2.translate(0, 0.02, 0);

      // Merge the two geometries
      const mergedOct = mergeGeometries([oct1, oct2], false);

      // Recompute normals for proper lighting
      mergedOct.computeVertexNormals();

      // Mark it as compound for wireframe builders
      mergedOct.userData.isCompound = true;
      mergedOct.userData.baseType = "OctahedronGeometry";

      return mergedOct;
    case "tetrahedron":
      // Create compound tetrahedron (stella octangula) - two interpenetrating tetrahedrons
      const tet1 = new THREE.TetrahedronGeometry(1.2);
      const tet2 = new THREE.TetrahedronGeometry(1.2);

      // Invert second tetrahedron by scaling -1 on all axes (creates true dual tetrahedron)
      tet2.scale(-1, -1, -1);

      // Slight vertical offset to prevent z-fighting on overlapping faces
      tet2.translate(0, 0.02, 0);

      // Merge the two geometries
      const mergedTet = mergeGeometries([tet1, tet2], false);

      // Recompute normals for proper lighting
      mergedTet.computeVertexNormals();

      // Mark it as compound for wireframe builders
      mergedTet.userData.isCompound = true;
      mergedTet.userData.baseType = "TetrahedronGeometry";

      return mergedTet;

    case "120cell": {
      // 120-Cell: 4D polytope made of 120 regular dodecahedra
      // This 3D shadow shows 5 nested layers representing dimensional compression

      // Create 5 nested dodecahedra layers (scaled down by 0.6x)
      const outerSize = 1.2; // Outer boundary (was 2.0)
      const layer1Size = 0.96; // First intermediate layer (was 1.6)
      const layer2Size = 0.72; // Second intermediate layer (was 1.2)
      const layer3Size = 0.54; // Third intermediate layer (was 0.9)
      const innerSize = 0.36; // Inner core (was 0.6)

      const outerDodec = new THREE.DodecahedronGeometry(outerSize);
      const layer1Dodec = new THREE.DodecahedronGeometry(layer1Size);
      const layer2Dodec = new THREE.DodecahedronGeometry(layer2Size);
      const layer3Dodec = new THREE.DodecahedronGeometry(layer3Size);
      const innerDodec = new THREE.DodecahedronGeometry(innerSize);

      // Merge all five layers
      const merged120Cell = mergeGeometries([
        outerDodec,
        layer1Dodec,
        layer2Dodec,
        layer3Dodec,
        innerDodec,
      ]);

      // Mark as 120-cell for wireframe/hyperframe builders
      merged120Cell.userData.is120Cell = true;
      merged120Cell.userData.baseType = "DodecahedronGeometry";
      merged120Cell.userData.layers = {
        outer: outerSize,
        layer1: layer1Size,
        layer2: layer2Size,
        layer3: layer3Size,
        inner: innerSize,
      };

      return merged120Cell;
    }

    default:
      return new THREE.IcosahedronGeometry();
  }
}
