/**
 * Central Golden Symmetry Decorator
 *
 * Creates a golden ratio-based ring at the center of compound geometries
 * Features gentle breathing animation for organic feel while maintaining symmetry
 */

import * as THREE from "three";

/**
 * Creates a symmetric golden tube ring around the calm core
 * 
 * @returns {THREE.Mesh} Animated golden ring mesh
 */
export function createCentralGoldenSymmetry() {
  const R = 0.45; // ring radius at center
  const tubularSegments = 240;
  const radialSegments = 10;
  const thickness = 0.018;
  const positions = [];
  const normals = [];
  const indices = [];

  // Build a simple circle curve around Y-axis
  const twoPi = Math.PI * 2;
  const framesTangent = [];
  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const ang = t * twoPi;
    const x = Math.cos(ang) * R;
    const y = 0;
    const z = Math.sin(ang) * R;

    // Tangent for ring around Y-axis
    const tangent = new THREE.Vector3(-Math.sin(ang), 0, Math.cos(ang));
    const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();
    const binormal = tangent.clone().cross(normal).normalize();
    framesTangent.push({
      p: new THREE.Vector3(x, y, z),
      n: normal,
      b: binormal,
    });
  }

  const segRing = radialSegments + 1;
  for (let i = 0; i <= tubularSegments; i++) {
    const { p, n, b } = framesTangent[i];
    for (let j = 0; j <= radialSegments; j++) {
      const ang = (j / radialSegments) * twoPi;
      const dir = n
        .clone()
        .multiplyScalar(Math.cos(ang))
        .add(b.clone().multiplyScalar(Math.sin(ang)));
      const v = p.clone().add(dir.multiplyScalar(thickness));
      positions.push(v.x, v.y, v.z);
      normals.push(dir.x, dir.y, dir.z);
    }
  }
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * segRing + j;
      const bIdx = (i + 1) * segRing + j;
      const c = (i + 1) * segRing + (j + 1);
      const d = i * segRing + (j + 1);
      indices.push(a, bIdx, d, bIdx, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);

  const colGold = new THREE.Color("#FFD700");
  const mat = new THREE.MeshStandardMaterial({
    color: colGold,
    emissive: colGold.clone().multiplyScalar(0.6),
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geo, mat);
  // Gentle breathing to feel alive but organized
  const phase = Math.random() * Math.PI * 2;
  ring.onBeforeRender = (renderer, scene, camera, g, m) => {
    const t = performance.now() * 0.001 + phase;
    const s = 1 + Math.sin(t * 0.8) * 0.015;
    ring.scale.set(s, s, s);
    m.opacity = 0.8 + Math.sin(t * 0.5) * 0.08;
  };
  return ring;
}
