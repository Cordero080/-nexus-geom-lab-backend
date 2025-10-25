import * as THREE from "three";
import { nearestVertexIndex } from "../../utils/geometryHelpers";

/**
 * Create a thick wireframe for TetrahedronGeometry using cylinders
 * Uses EdgesGeometry to automatically extract all edges from compound geometry
 * @param {THREE.BufferGeometry} geometry - The tetrahedron geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createTetrahedronWireframe(geometry, wireframeMaterial) {
  // Use EdgesGeometry to reliably get all edges (6 for simple, 12 for compound)
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;
  const tetrahedronWireframeGroup = new THREE.Group();
  const tetraEdgePairs = [];

  for (let j = 0; j < edgeVertices.length; j += 6) {
    const start = new THREE.Vector3(
      edgeVertices[j],
      edgeVertices[j + 1],
      edgeVertices[j + 2]
    );
    const end = new THREE.Vector3(
      edgeVertices[j + 3],
      edgeVertices[j + 4],
      edgeVertices[j + 5]
    );
    const distance = start.distanceTo(end);

    // Create thick cylinder for tetrahedron edge
    const cylinderGeom = new THREE.CylinderGeometry(0.011, 0.011, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    const iA_t = nearestVertexIndex(geometry, start);
    const iB_t = nearestVertexIndex(geometry, end);
    tetraEdgePairs.push([iA_t, iB_t]);
    tetrahedronWireframeGroup.add(cylinderMesh);
  }

  tetrahedronWireframeGroup.userData.edgePairs = tetraEdgePairs;

  console.log(
    "Created thick wireframe for tetrahedron with",
    edgeVertices.length / 6,
    "cylinder edges"
  );

  return tetrahedronWireframeGroup;
}

/**
 * Create a thick wireframe for IcosahedronGeometry using cylinders
 * @param {THREE.BufferGeometry} geometry - The icosahedron geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createIcosahedronWireframe(geometry, wireframeMaterial) {
  // Use EdgesGeometry to reliably get all 30 edges
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;
  const icosahedronWireframeGroup = new THREE.Group();
  const icoEdgePairs = [];
  const upVector = new THREE.Vector3(0, 1, 0);
  const __Q = new THREE.Quaternion();

  for (let j = 0; j < edgeVertices.length; j += 6) {
    const start = new THREE.Vector3(
      edgeVertices[j],
      edgeVertices[j + 1],
      edgeVertices[j + 2]
    );
    const end = new THREE.Vector3(
      edgeVertices[j + 3],
      edgeVertices[j + 4],
      edgeVertices[j + 5]
    );
    const direction = end.clone().sub(start);
    const distance = direction.length();

    // Create thick cylinder for icosahedron edge - ADJUST 0.012 for radius
    const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder at midpoint
    cylinderMesh.position.copy(start).add(end).multiplyScalar(0.5);

    // Orient cylinder using quaternion helper
    __Q.setFromUnitVectors(upVector, direction.normalize());
    cylinderMesh.quaternion.copy(__Q);

    // Store original length and vertex indices
    cylinderMesh.userData.baseLength = distance;
    const iA_ico = nearestVertexIndex(geometry, start);
    const iB_ico = nearestVertexIndex(geometry, end);
    icoEdgePairs.push([iA_ico, iB_ico]);
    icosahedronWireframeGroup.add(cylinderMesh);
  }

  icosahedronWireframeGroup.userData.edgePairs = icoEdgePairs;

  console.log(
    "Created thick wireframe for icosahedron with",
    edgeVertices.length / 6,
    "cylinder edges"
  );

  return icosahedronWireframeGroup;
}

/**
 * Create a standard thin wireframe for other geometries (TorusKnot, etc.)
 * @param {THREE.BufferGeometry} geometry - The geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Mesh} The wireframe mesh
 */
export function createCommonWireframe(geometry, wireframeMaterial) {
  return new THREE.Mesh(geometry, wireframeMaterial);
}
