import * as THREE from "three";
import { nearestVertexIndex } from "../../../utils/geometryHelpers";

/**
 * Create a thick wireframe for SphereGeometry using cylinders
 * @param {THREE.BufferGeometry} geometry - The sphere geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createSphereWireframe(geometry, wireframeMaterial) {
  // Create thick wireframe using cylinders for sphere edges
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;
  const sphereWireframeGroup = new THREE.Group();
  const sphereEdgePairs = [];

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

    // Create thick cylinder for sphere edge - ADJUST 0.005 TO CHANGE THICKNESS
    const cylinderGeom = new THREE.CylinderGeometry(0.005, 0.005, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);
    cylinderMesh.userData.baseLength = distance;

    const iA_s = nearestVertexIndex(geometry, start);
    const iB_s = nearestVertexIndex(geometry, end);
    sphereEdgePairs.push([iA_s, iB_s]);
    sphereWireframeGroup.add(cylinderMesh);
  }

  sphereWireframeGroup.userData.edgePairs = sphereEdgePairs;

  console.log(
    "Created thick wireframe for sphere with",
    edgeVertices.length / 6,
    "cylinder edges"
  );

  return sphereWireframeGroup;
}
