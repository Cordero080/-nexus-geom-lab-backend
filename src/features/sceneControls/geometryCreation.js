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

/**
 * Create a novel multi-layered alien-like structure from twin torus knots.
 * Phyllotaxis-inspired layering: each layer contains a symmetric twin pair,
 * rotated by the golden angle around Y, translated along a gentle helix,
 * and scaled slightly to create an organic, non-repeating macroform.
 */
function createCompoundTorusKnot({
  R = 1.2, // major radius of underlying torus
  r = 0.5, // minor radius of underlying torus
  p = 2,
  q = 3,
  tubeRadius = 0.08,
  tubularSegments = 480,
  radialSegments = 16,
  gap = 0.12, // desired minimum gap between tube surfaces
} = {}) {
  const twoPi = Math.PI * 2;

  // Parametric torus-knot curve offset along the torus surface normal
  class TorusKnotCurve extends THREE.Curve {
    constructor({ R, r, p, q, phi = 0, normalSign = 1, delta }) {
      super();
      Object.assign(this, { R, r, p, q, phi, normalSign, delta });
    }
    getPoint(u) {
      const t = u * twoPi;
      const uAng = this.p * t;
      const vAng = this.q * t + this.phi;
      const cosPt = Math.cos(uAng);
      const sinPt = Math.sin(uAng);
      const cosQt = Math.cos(vAng);
      const sinQt = Math.sin(vAng);

      const baseX = (this.R + this.r * cosQt) * cosPt;
      const baseY = (this.R + this.r * cosQt) * sinPt;
      const baseZ = this.r * sinQt;

      const Nx = Math.cos(vAng) * Math.cos(uAng);
      const Ny = Math.cos(vAng) * Math.sin(uAng);
      const Nz = Math.sin(vAng);

      return new THREE.Vector3(
        baseX + this.normalSign * this.delta * Nx,
        baseY + this.normalSign * this.delta * Ny,
        baseZ + this.normalSign * this.delta * Nz
      );
    }
  }

  // Twin symmetry rotations: rotate twin by Z(pi/p) then Y(pi/2)
  const angZ = Math.PI / p;
  const angY = Math.PI / 2;
  const twinRot = new THREE.Matrix4()
    .makeRotationY(angY)
    .multiply(new THREE.Matrix4().makeRotationZ(angZ));

  // Clearance enforcement between twin centerlines under final rotation
  const ensureTwinClearance = (curveA, curveB, targetClear) => {
    const SA = 240;
    const SB = 240;
    const ptsA = new Array(SA);
    const ptsB = new Array(SB);
    for (let i = 0; i < SA; i++) ptsA[i] = curveA.getPoint(i / SA);
    for (let j = 0; j < SB; j++)
      ptsB[j] = curveB.getPoint(j / SB).applyMatrix4(twinRot);
    let minD = Infinity;
    for (let i = 0; i < SA; i++) {
      const a = ptsA[i];
      for (let j = 0; j < SB; j++) {
        const d = a.distanceTo(ptsB[j]);
        if (d < minD) minD = d;
      }
    }
    return minD >= targetClear
      ? { ok: true, boost: 0 }
      : { ok: false, boost: targetClear - minD + 0.02 };
  };

  const targetClear = 2 * tubeRadius + gap;
  const baseDelta = tubeRadius + gap;

  let curveA = new TorusKnotCurve({
    R,
    r,
    p,
    q,
    phi: 0,
    normalSign: +1,
    delta: baseDelta,
  });
  let curveB = new TorusKnotCurve({
    R,
    r,
    p,
    q,
    phi: Math.PI / q,
    normalSign: -1,
    delta: baseDelta,
  });

  // Adaptive delta boost to guarantee clearance
  let attempts = 0;
  while (attempts < 4) {
    const res = ensureTwinClearance(curveA, curveB, targetClear);
    if (res.ok) break;
    const nd = baseDelta + (attempts + 1) * res.boost;
    curveA = new TorusKnotCurve({
      R,
      r,
      p,
      q,
      phi: 0,
      normalSign: +1,
      delta: nd,
    });
    curveB = new TorusKnotCurve({
      R,
      r,
      p,
      q,
      phi: Math.PI / q,
      normalSign: -1,
      delta: nd,
    });
    attempts++;
  }

  const tubeA = new THREE.TubeGeometry(
    curveA,
    tubularSegments,
    tubeRadius,
    radialSegments,
    true
  );
  const tubeB = new THREE.TubeGeometry(
    curveB,
    tubularSegments,
    tubeRadius,
    radialSegments,
    true
  );

  // Apply intrinsic twin symmetry
  tubeB.applyMatrix4(twinRot);

  const merged = mergeGeometries(
    [tubeA.toNonIndexed(), tubeB.toNonIndexed()],
    false
  );
  merged.computeVertexNormals();
  merged.userData.isCompound = true;
  merged.userData.baseType = "TorusKnotGeometry";
  merged.userData.isCpdTorusKnot = true;
  merged.userData.componentCount = 2;
  // Reduce default size for better framing
  merged.scale(0.5525, 0.5525, 0.5525);
  return merged;
}

function createAlienIntellectShape({
  layers = 5,
  R = 1.2,
  r = 0.5,
  p = 3,
  q = 5,
  tubeRadius = 0.075,
  tubularSegments = 360,
  radialSegments = 14,
  gap = 0.1,
  orbitRadius = 0.6,
  yStep = 0.5,
  scaleFalloff = 0.15,
} = {}) {
  const twoPi = Math.PI * 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  class TorusKnotCurve extends THREE.Curve {
    constructor(
      R,
      r,
      p,
      q,
      phi = 0,
      tStart = 0,
      tEnd = twoPi,
      normalSign = 1,
      deltaLocal = tubeRadius + gap
    ) {
      super();
      this.R = R;
      this.r = r;
      this.p = p;
      this.q = q;
      this.phi = phi;
      this.tStart = tStart;
      this.tEnd = tEnd;
      this.normalSign = normalSign;
      this.delta = deltaLocal;
    }
    getPoint(u) {
      const t = this.tStart + u * (this.tEnd - this.tStart);
      const uAng = this.p * t;
      const vAng = this.q * t + this.phi;
      const cosPt = Math.cos(uAng);
      const sinPt = Math.sin(uAng);
      const cosQt = Math.cos(vAng);
      const sinQt = Math.sin(vAng);

      const baseX = (this.R + this.r * cosQt) * cosPt;
      const baseY = (this.R + this.r * cosQt) * sinPt;
      const baseZ = this.r * sinQt;

      const Nx = Math.cos(vAng) * Math.cos(uAng);
      const Ny = Math.cos(vAng) * Math.sin(uAng);
      const Nz = Math.sin(vAng);

      return new THREE.Vector3(
        baseX + this.normalSign * this.delta * Nx,
        baseY + this.normalSign * this.delta * Ny,
        baseZ + this.normalSign * this.delta * Nz
      );
    }
  }

  const geoms = [];
  const angZ = Math.PI / p;
  const angY = Math.PI / 2;
  const rotZY = new THREE.Matrix4()
    .makeRotationY(angY)
    .multiply(new THREE.Matrix4().makeRotationZ(angZ));

  const ensureTwinClearance = (curveA, curveB, targetClear) => {
    const S_A = 240;
    const S_B = 240;
    const ptsA = new Array(S_A);
    const ptsB = new Array(S_B);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < S_A; i++) ptsA[i] = curveA.getPoint(i / S_A);
    for (let j = 0; j < S_B; j++)
      ptsB[j] = curveB.getPoint(j / S_B).applyMatrix4(rotZY);
    let minD = Infinity;
    for (let i = 0; i < S_A; i++) {
      const a = ptsA[i];
      for (let j = 0; j < S_B; j++) {
        const d = a.distanceTo(tmp.copy(ptsB[j]));
        if (d < minD) minD = d;
      }
    }
    return minD >= targetClear
      ? { ok: true, deltaBoost: 0 }
      : { ok: false, deltaBoost: targetClear - minD + 0.02 };
  };

  const targetClear = 2 * tubeRadius + gap;
  const layerCount = Math.max(1, layers | 0);
  const half = Math.floor(layerCount / 2);
  let index = 0;
  for (let li = -half; li <= half; li++) {
    const phi = index++ * goldenAngle;
    const scale = 1 - scaleFalloff * Math.abs(li);
    const localR = R * scale;
    const localr = r * scale;
    const localTube = tubeRadius;
    const localGap = gap;

    const baseDelta = localTube + localGap;
    let curveA = new TorusKnotCurve(
      localR,
      localr,
      p,
      q,
      0,
      0,
      twoPi,
      +1,
      baseDelta
    );
    let curveB = new TorusKnotCurve(
      localR,
      localr,
      p,
      q,
      Math.PI / q,
      0,
      twoPi,
      -1,
      baseDelta
    );

    let attempts = 0;
    while (attempts < 4) {
      const res = ensureTwinClearance(curveA, curveB, targetClear);
      if (res.ok) break;
      const nd = baseDelta + (attempts + 1) * res.deltaBoost;
      curveA = new TorusKnotCurve(localR, localr, p, q, 0, 0, twoPi, +1, nd);
      curveB = new TorusKnotCurve(
        localR,
        localr,
        p,
        q,
        Math.PI / q,
        0,
        twoPi,
        -1,
        nd
      );
      attempts++;
    }

    const tubeA = new THREE.TubeGeometry(
      curveA,
      tubularSegments,
      localTube,
      radialSegments,
      true
    );
    const tubeB = new THREE.TubeGeometry(
      curveB,
      tubularSegments,
      localTube,
      radialSegments,
      true
    );

    tubeB.rotateZ(angZ);
    tubeB.rotateY(angY);

    const layerRot = new THREE.Matrix4()
      .multiply(new THREE.Matrix4().makeRotationY(phi))
      .multiply(new THREE.Matrix4().makeRotationX(Math.sin(li * 0.7) * 0.4))
      .multiply(new THREE.Matrix4().makeRotationZ(Math.cos(li * 0.5) * 0.3));

    const cx = Math.cos(phi) * orbitRadius * (1 + 0.25 * Math.sin(li));
    const cz = Math.sin(phi) * orbitRadius * (1 + 0.25 * Math.cos(li));
    const cy = li * yStep;
    const layerTr = new THREE.Matrix4().makeTranslation(cx, cy, cz);
    const layerM = new THREE.Matrix4().copy(layerRot).multiply(layerTr);

    tubeA.applyMatrix4(layerM);
    tubeB.applyMatrix4(layerM);

    geoms.push(tubeA.toNonIndexed(), tubeB.toNonIndexed());
  }

  const merged = mergeGeometries(geoms, false);
  merged.computeVertexNormals();
  merged.userData.isCompound = true;
  merged.userData.baseType = "TorusKnotGeometry";
  merged.userData.isAlienIntellect = true;
  merged.userData.componentCount = geoms.length;
  merged.scale(0.504, 0.504, 0.504);
  return merged;
}

//

export function createGeometry(type = "icosahedron", options = {}) {
  switch (type) {
    case "quantummanifold": {
      // Parametric Klein bottle projected into 3D (optionally thought of as 4D rotated and projected)
      const opts = options.quantummanifold || {};
      const uSegments = Math.max(32, opts.uSegments || 160);
      const vSegments = Math.max(16, opts.vSegments || 80);
      const scale = opts.scale || 0.65;

      // Original smooth parametric Klein embedding used earlier
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

      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array((uSegments + 1) * (vSegments + 1) * 3);
      const normals = new Float32Array((uSegments + 1) * (vSegments + 1) * 3);
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

      // Build indices (triangle strips)
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

      // Mark metadata for downstream builders
      geom.userData.isCompound = false;
      geom.userData.baseType = "ParametricKlein";
      geom.userData.isQuantumManifold = true;

      return geom;
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
      // ALIAS to "box" case - keeping for backward compatibility
      // Just return the same compound tesseract structure
      return createGeometry("box");
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
    case "torusknot":
      return new THREE.TorusKnotGeometry(1, 0.2, 150, 16);
    case "cpdtorusknot": {
      // Two intertwined torus knots (identical twin), built precisely
      // Allow overrides via options.cpdtorusknot
      const { R, r, p, q, tubeRadius, tubularSegments, radialSegments, gap } =
        options.cpdtorusknot || {};
      return createCompoundTorusKnot({
        R,
        r,
        p,
        q,
        tubeRadius,
        tubularSegments,
        radialSegments,
        gap,
      });
    }
    case "alienintellect": {
      const params = options.alienintellect || {};
      return createAlienIntellectShape(params);
    }

    default:
      return new THREE.IcosahedronGeometry();
  }
}
