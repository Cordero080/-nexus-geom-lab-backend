/**
 * Quantum Manifold Decorators
 *
 * Creates advanced visual effects for Quantum Manifold geometries:
 * - Clifford attractor flows constrained to Klein bottle surface
 * - Golden spiral tubes following flow paths
 * - Quantum clouds at self-intersection regions
 * - Entanglement threads connecting opposite parametric points
 */

import * as THREE from 'three';

/**
 * Creates decorative extras for Quantum Manifold geometry
 * Includes Clifford flows, golden spiral, clouds, and threads
 *
 * @param {THREE.BufferGeometry} geometry - The base quantum manifold geometry
 * @returns {THREE.Group} Group containing all extra visual elements
 */
export function createQuantumManifoldExtras(geometry) {
  const group = new THREE.Group();

  // Colors
  const colGold = new THREE.Color('#FFD700');
  const colCyan = new THREE.Color('#80FFFF');
  const colDeepBlue = new THREE.Color('#0b3d91');
  const colPurple = new THREE.Color('#6A0DAD');

  // Parametric Klein (matches geometryCreation.js)
  const scale = 0.65;
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
    return new THREE.Vector3(x * scale, y * scale, z * scale);
  };

  // Clifford attractor mapped to (u,v) domain then onto surface
  const createCliffordFlows = () => {
    // Chaos-inspired flows constrained to the surface by integrating in (u,v)
    // Direction is snapped toward iso-param lines so paths follow mesh wireframe curvature.
    const flows = new THREE.Group();
    const a = -1.4,
      b = 1.6,
      c = 1.0,
      d = 0.7; // Clifford params
    const flowCount = 5;
    const steps = 620;
    const transient = 40;
    const stepUV = 0.035; // param step size
    const twoPi = Math.PI * 2;

    // Finite-difference tangent basis on the surface
    const h = 1e-3;
    const tangentBasis = (u, v) => {
      const p = klein(u, v);
      const pu = klein((u + h) % twoPi, v)
        .sub(p)
        .multiplyScalar(1 / h);
      const pv = klein(u, (v + h) % twoPi)
        .sub(p)
        .multiplyScalar(1 / h);
      // Normalize basis vectors in param space (we only use them for direction snapping)
      pu.normalize();
      pv.normalize();
      return { pu, pv, p };
    };

    for (let f = 0; f < flowCount; f++) {
      // Seed attractor state and (u,v)
      let x = (Math.random() * 2 - 1) * 0.6;
      let y = (Math.random() * 2 - 1) * 0.6;
      let u = Math.random() * twoPi;
      let v = Math.random() * twoPi;
      const positions = [];

      // Burn-in to stabilize the attractor
      for (let i = 0; i < transient; i++) {
        const xn = Math.sin(a * y) + c * Math.cos(a * x);
        const yn = Math.sin(b * x) + d * Math.cos(b * y);
        x = xn;
        y = yn;
      }

      for (let i = 0; i < steps; i++) {
        // Advance Clifford to get a direction cue
        const xn = Math.sin(a * y) + c * Math.cos(a * x);
        const yn = Math.sin(b * x) + d * Math.cos(b * y);
        const du_a = xn - x;
        const dv_a = yn - y;
        x = xn;
        y = yn;

        // Convert to param direction (normalized)
        let dirU = du_a;
        let dirV = dv_a;
        const len = Math.hypot(dirU, dirV) || 1;
        dirU /= len;
        dirV /= len;

        // Snap toward iso-param (wireframe) directions using surface tangents
        const { pu, pv, p } = tangentBasis(u, v);
        // Build an approximate 3D direction for (u) and (v) and pick whichever aligns with attractor direction
        // Project a blended param direction into 3D for the choice
        const candU = pu; // along ∂S/∂u
        const candV = pv; // along ∂S/∂v
        // Create a pseudo 3D attractor direction by mixing basis vectors with param dir
        const attract3D = candU
          .clone()
          .multiplyScalar(dirU)
          .add(candV.clone().multiplyScalar(dirV))
          .normalize();
        const dotU = Math.abs(attract3D.dot(candU));
        const dotV = Math.abs(attract3D.dot(candV));
        // Choose the dominant iso-direction and keep a small portion of the other for organic flow
        let stepU = 0,
          stepV = 0;
        if (dotU >= dotV) {
          stepU = Math.sign(dirU) || (Math.random() < 0.5 ? 1 : -1);
          stepV = 0.2 * Math.sign(dirV);
        } else {
          stepV = Math.sign(dirV) || (Math.random() < 0.5 ? 1 : -1);
          stepU = 0.2 * Math.sign(dirU);
        }

        // Advance in param space and wrap
        u = (u + stepUV * stepU + twoPi) % twoPi;
        v = (v + stepUV * stepV + twoPi) % twoPi;

        const pNext = klein(u, v);
        positions.push(pNext.x, pNext.y, pNext.z);
      }

      if (positions.length >= 6) {
        const buf = new THREE.BufferGeometry();
        buf.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const mat = new THREE.LineBasicMaterial({
          color: f === 0 ? colGold : f % 2 ? colDeepBlue : colPurple,
          transparent: true,
          opacity: f === 0 ? 0.85 : 0.52,
        });
        const line = new THREE.Line(buf, mat);
        const phase = Math.random() * Math.PI * 2;
        line.onBeforeRender = (renderer, scene, camera, geometry_, material_) => {
          const t = performance.now() * 0.001 + phase;
          material_.opacity = (f === 0 ? 0.7 : 0.48) + Math.sin(t * 1.0) * 0.09;
        };
        flows.add(line);
      }
    }
    return flows;
  };

  // Golden spiral tube following the first flow path
  const createGoldenSpiralTube = (flowsGroup) => {
    if (!flowsGroup || flowsGroup.children.length === 0) return null;
    const seedLine = flowsGroup.children[0];
    const posAttr = seedLine.geometry.getAttribute('position');
    const pts = [];
    for (let i = 0; i < posAttr.count; i++) {
      pts.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
    }
    if (pts.length < 8) return null;
    const curve = new THREE.CatmullRomCurve3(pts);
    const phi = (1 + Math.sqrt(5)) / 2;
    const tubularSegments = 300;
    const radiusBase = 0.02;
    const radialSegments = 8;

    const frames = curve.computeFrenetFrames(tubularSegments, true);
    const positions = [];
    const indices = [];
    const normals = [];
    for (let i = 0; i <= tubularSegments; i++) {
      const t = i / tubularSegments;
      const point = curve.getPoint(t);
      const n = frames.normals[i];
      const b = frames.binormals[i];
      const angleSteps = radialSegments;
      const radius = radiusBase * Math.pow(phi, (t - 0.5) * 0.5); // subtle phi growth
      for (let j = 0; j <= angleSteps; j++) {
        const ang = (j / angleSteps) * Math.PI * 2;
        const normal = new THREE.Vector3()
          .copy(n)
          .multiplyScalar(Math.cos(ang))
          .add(new THREE.Vector3().copy(b).multiplyScalar(Math.sin(ang)));
        const vertex = new THREE.Vector3().copy(point).add(normal.multiplyScalar(radius));
        positions.push(vertex.x, vertex.y, vertex.z);
        normals.push(normal.x, normal.y, normal.z);
      }
    }
    const segRing = radialSegments + 1;
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * segRing + j;
        const bIdx = (i + 1) * segRing + j;
        const c = (i + 1) * segRing + (j + 1);
        const d = i * segRing + (j + 1);
        indices.push(a, bIdx, d, bIdx, c, d);
      }
    }
    const tube = new THREE.BufferGeometry();
    tube.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    tube.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    tube.setIndex(indices);
    const mat = new THREE.MeshStandardMaterial({
      color: colGold,
      emissive: colGold.clone().multiplyScalar(0.6),
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(tube, mat);
    // Phase across dimensions (subtle scale/opacity pulse)
    const phase = Math.random() * Math.PI * 2;
    mesh.onBeforeRender = (renderer, scene, camera, geom_, mat_) => {
      const t = performance.now() * 0.001 + phase;
      mat_.opacity = 0.8 + Math.sin(t * 0.6) * 0.15;
      const s = 1 + Math.sin(t * 0.6) * 0.02;
      mesh.scale.set(s, s, s);
    };
    return mesh;
  };

  // Approximate self-intersections via coarse spatial binning of the parametric surface
  const createQuantumClouds = () => {
    const clouds = new THREE.Group();
    const uSeg = 72,
      vSeg = 36;
    const cell = 0.18;
    const bins = new Map();
    const paramPairs = new Map();
    const twoPi = Math.PI * 2;
    for (let i = 0; i <= uSeg; i++) {
      const u = (i / uSeg) * twoPi;
      for (let j = 0; j <= vSeg; j++) {
        const v = (j / vSeg) * twoPi;
        const p = klein(u, v);
        const kx = Math.round(p.x / cell);
        const ky = Math.round(p.y / cell);
        const kz = Math.round(p.z / cell);
        const key = `${kx},${ky},${kz}`;
        if (!bins.has(key)) bins.set(key, []);
        bins.get(key).push(p.clone());
        if (!paramPairs.has(key)) paramPairs.set(key, []);
        paramPairs.get(key).push(new THREE.Vector2(u, v));
      }
    }
    const cloudGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const cloudMat = new THREE.MeshPhysicalMaterial({
      color: colCyan,
      transmission: 0.9,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.0,
      emissive: colCyan.clone().multiplyScalar(0.5),
      emissiveIntensity: 1.0,
      depthWrite: false,
    });
    for (const [key, pts] of bins.entries()) {
      if (pts.length < 3) continue;
      // Roughly ensure different param sources
      const params = paramPairs.get(key);
      let farParam = false;
      for (let i = 0; i < params.length && !farParam; i++) {
        for (let j = i + 1; j < params.length; j++) {
          const du = Math.abs(params[i].x - params[j].x);
          const dv = Math.abs(params[i].y - params[j].y);
          if (du + dv > 1.5) {
            farParam = true;
            break;
          }
        }
      }
      if (!farParam) continue;
      const center = pts
        .reduce((acc, p) => acc.add(p), new THREE.Vector3())
        .multiplyScalar(1 / pts.length);
      const m = new THREE.Mesh(cloudGeom, cloudMat.clone());
      m.position.copy(center);
      m.userData.pulsePhase = Math.random() * Math.PI * 2;
      m.onBeforeRender = (renderer, scene, camera, g, mat) => {
        const tt = performance.now() * 0.001 + m.userData.pulsePhase;
        const s = 0.9 + Math.sin(tt * 1.8) * 0.2;
        m.scale.setScalar(s);
        mat.opacity = 0.35 + (Math.sin(tt * 1.8) * 0.5 + 0.5) * 0.3;
      };
      clouds.add(m);
    }
    return clouds;
  };

  // Entanglement threads connecting opposite param points
  const createEntanglementThreads = () => {
    const lines = new THREE.Group();
    const pairs = 28;
    const twoPi = Math.PI * 2;
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#FFFFFF'),
      transparent: true,
      opacity: 0.5,
    });
    for (let i = 0; i < pairs; i++) {
      const u = Math.random() * twoPi;
      const v = Math.random() * twoPi;
      const p1 = klein(u, v);
      const p2 = klein((u + Math.PI) % twoPi, (v + Math.PI) % twoPi);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z], 3)
      );
      const line = new THREE.Line(geo, mat);
      const phase = Math.random() * Math.PI * 2;
      line.onBeforeRender = (renderer, scene, camera, g, m) => {
        const t = performance.now() * 0.001 + phase;
        m.opacity = 0.35 + Math.sin(t * 1.2) * 0.15;
      };
      lines.add(line);
    }
    return lines;
  };

  // No internal elements - keep just the clean outer Klein surface
  return group;
}
