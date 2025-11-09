import * as THREE from "three";
import { nearestVertexIndex } from "../../../utils/geometryHelpers";

/**
 * Create a thick wireframe for OctahedronGeometry using cylinders
 * Uses EdgesGeometry to automatically extract all edges from compound geometry
 * @param {THREE.BufferGeometry} geometry - The octahedron geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createOctahedronWireframe(geometry, wireframeMaterial) {
  // Use EdgesGeometry to reliably get all edges (12 for simple, 24 for compound)
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;
  const octahedronWireframeGroup = new THREE.Group();
  const octaEdgePairs = [];

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

    // Create thick cylinder for octahedron edge
    const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    const iA_o = nearestVertexIndex(geometry, start);
    const iB_o = nearestVertexIndex(geometry, end);
    octaEdgePairs.push([iA_o, iB_o]);
    octahedronWireframeGroup.add(cylinderMesh);
  }

  octahedronWireframeGroup.userData.edgePairs = octaEdgePairs;

  console.log(
    "Created thick wireframe for octahedron with",
    edgeVertices.length / 6,
    "cylinder edges"
  );

  return octahedronWireframeGroup;
}
