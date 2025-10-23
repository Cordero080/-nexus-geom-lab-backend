import * as THREE from "three";
import { nearestVertexIndex } from "../../utils/geometryHelpers";

/**
 * Create a thick wireframe for BoxGeometry using cylinders
 * @param {THREE.BufferGeometry} geometry - The box geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createBoxWireframe(geometry, wireframeMaterial) {
  // Create thick wireframe using cylinders for cube edges
  const cubeWireframeGroup = new THREE.Group();
  const cubeEdgePairs = [];

  // Get the 8 corners of the cube
  const size = 0.75; // Half of 1.5
  const cubeCorners = [
    [-size, -size, -size],
    [size, -size, -size],
    [size, size, -size],
    [-size, size, -size], // Back face
    [-size, -size, size],
    [size, -size, size],
    [size, size, size],
    [-size, size, size], // Front face
  ];

  // Define the 12 edges of the cube
  const cubeEdges = [
    // Back face edges
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Front face edges
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Connecting edges between front and back
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  // Create cylinder for each cube edge
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cubeCorners[i]);
    const end = new THREE.Vector3(...cubeCorners[j]);
    const distance = start.distanceTo(end);

    // Create thick cylinder for cube edge - ADJUST 0.015 TO CHANGE MAIN WIREFRAME THICKNESS
    const cylinderGeom = new THREE.CylinderGeometry(0.015, 0.015, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    const iA_c = nearestVertexIndex(geometry, start);
    const iB_c = nearestVertexIndex(geometry, end);
    cubeEdgePairs.push([iA_c, iB_c]);
    cubeWireframeGroup.add(cylinderMesh);
  });

  cubeWireframeGroup.userData.edgePairs = cubeEdgePairs;

  console.log(
    "Created thick wireframe for cube with",
    cubeEdges.length,
    "cylinder edges"
  );

  return cubeWireframeGroup;
}
