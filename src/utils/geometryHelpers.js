import * as THREE from "three";
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
    const base =
      cyl.userData.baseLength ?? (cyl.geometry?.parameters?.height || len);
    cyl.userData.baseLength = base;
    cyl.scale.set(1, len / base, 1);
  }
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
