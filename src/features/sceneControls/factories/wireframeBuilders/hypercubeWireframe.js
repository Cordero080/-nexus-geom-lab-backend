import * as THREE from "three";
import { nearestVertexIndex } from "../../utils/geometryHelpers";

/**
 * Create a thick wireframe for Hypercube (Tesseract) using cylinders
 * Uses EdgesGeometry to automatically detect all edges from the merged geometry
 * @param {THREE.BufferGeometry} geometry - The hypercube geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createHypercubeWireframe(geometry, wireframeMaterial) {
  console.log("🔷 HYPERCUBE WIREFRAME CALLED");
  console.log("Geometry:", geometry);
  console.log("Material:", wireframeMaterial);

  // Use EdgesGeometry to reliably get all edges from the merged hypercube
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;
  const hypercubeWireframeGroup = new THREE.Group();
  const edgePairs = [];
  const upVector = new THREE.Vector3(0, 1, 0);
  const __Q = new THREE.Quaternion();

  // Thick cylinder parameters - MUCH THICKER
  const MAIN_RADIUS = 0.01728;

  console.log("Edge vertices count:", edgeVertices.length / 6);

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

    // Create thick cylinder for edge
    const cylinderGeom = new THREE.CylinderGeometry(
      MAIN_RADIUS,
      MAIN_RADIUS,
      distance,
      8
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder at midpoint
    cylinderMesh.position.copy(start).add(end).multiplyScalar(0.5);

    // Orient cylinder using quaternion helper
    __Q.setFromUnitVectors(upVector, direction.normalize());
    cylinderMesh.quaternion.copy(__Q);

    // Store original length and vertex indices
    cylinderMesh.userData.baseLength = distance;
    const iA = nearestVertexIndex(geometry, start);
    const iB = nearestVertexIndex(geometry, end);
    edgePairs.push([iA, iB]);
    hypercubeWireframeGroup.add(cylinderMesh);
  }

  hypercubeWireframeGroup.userData.edgePairs = edgePairs;

  console.log(
    "Created thick wireframe for hypercube with",
    edgeVertices.length / 6,
    "cylinder edges"
  );

  return hypercubeWireframeGroup;
}
