import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Helper functions and constants for wireframe conformance
const __UP = new THREE.Vector3(0, 1, 0);
const __Q = new THREE.Quaternion();
const __TMP = new THREE.Vector3();
const __A = new THREE.Vector3();
const __B = new THREE.Vector3();
const __M = new THREE.Matrix4();
const __Inv = new THREE.Matrix4();

/**
 * Returns the index of the vertex in geometry closest to the given position.
 * @param {THREE.BufferGeometry} geometry
 * @param {THREE.Vector3} v
 * @returns {number}
 */
function nearestVertexIndex(geometry, v) {
  const pos = geometry.attributes.position;
  let best = -1,
    bestD = Infinity;
  for (let i = 0; i < pos.count; i++) {
    __TMP.fromBufferAttribute(pos, i);
    const d = __TMP.distanceTo(v);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/**
 * Updates thick wireframe cylinders for a mesh.
 * @param {Object} objData
 */
function updateThickWireframeCylinders(objData) {
  const { solidMesh, wireframeMesh, edgePairs } = objData;
  if (!solidMesh || !wireframeMesh || !edgePairs) return;
  if (!wireframeMesh.isGroup) return;

  const cylinders = wireframeMesh.children?.filter((c) => c.isMesh) || [];
  const pos = solidMesh.geometry.attributes.position;

  // solid world -> wireframe parent local
  __M.copy(solidMesh.matrixWorld);
  const wfParent = wireframeMesh.parent;
  if (wfParent) __Inv.copy(wfParent.matrixWorld).invert();
  else __Inv.identity();

  const n = Math.min(edgePairs.length, cylinders.length);
  for (let k = 0; k < n; k++) {
    const cyl = cylinders[k];
    const [iA, iB] = edgePairs[k];
    __A.fromBufferAttribute(pos, iA).applyMatrix4(__M).applyMatrix4(__Inv);
    __B.fromBufferAttribute(pos, iB).applyMatrix4(__M).applyMatrix4(__Inv);

    // midpoint
    cyl.position.copy(__A).add(__B).multiplyScalar(0.5);

    // orientation
    const dir = __B.clone().sub(__A);
    const len = dir.length() || 1e-6;
    __Q.setFromUnitVectors(__UP, dir.normalize());
    cyl.quaternion.copy(__Q);

    // scale Y to length
    const base = cyl.userData.baseLength ?? (cyl.geometry?.parameters?.height || len);
    cyl.userData.baseLength = base;
    cyl.scale.set(1, len / base, 1);
  }
}

/**
 * Creates a tesseract (4D hypercube) geometry with frustum faces
 *
 * This is the canonical implementation that should be used across the application.
 * Previously duplicated in geometryCreation.js, compoundTesseract.js, and megaTesseract.js.
 *
 * @param {number} outerSize - Size of the outer cube
 * @param {number} innerSize - Size of the inner cube
 * @param {number} rotation - Optional rotation to apply
 * @returns {THREE.BufferGeometry} Complete tesseract with outer, inner, and connecting faces
 */
export function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
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
  const bottomFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  // Front face frustum (Z+)
  const frontFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  // Back face frustum (Z-)
  const backFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  // Right face frustum (X+)
  const rightFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  // Left face frustum (X-)
  const leftFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

export {
  __UP,
  __Q,
  __TMP,
  __A,
  __B,
  __M,
  __Inv,
  nearestVertexIndex,
  updateThickWireframeCylinders,
};
