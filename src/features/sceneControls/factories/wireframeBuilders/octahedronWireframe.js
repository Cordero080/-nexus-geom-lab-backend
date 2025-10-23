import * as THREE from "three";
import { nearestVertexIndex } from "../../utils/geometryHelpers";

/**
 * Create a thick wireframe for OctahedronGeometry using cylinders
 * @param {THREE.BufferGeometry} geometry - The octahedron geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createOctahedronWireframe(geometry, wireframeMaterial) {
  // Create thick wireframe using cylinders for octahedron edges
  const octahedronWireframeGroup = new THREE.Group();
  const octaEdgePairs = [];

  // Use canonical octahedron vertices for consistent wireframe
  const octaVertices = [
    [0, 1, 0], // 0: Top vertex
    [0, -1, 0], // 1: Bottom vertex
    [1, 0, 0], // 2: Right vertex
    [-1, 0, 0], // 3: Left vertex
    [0, 0, 1], // 4: Front vertex
    [0, 0, -1], // 5: Back vertex
  ];

  // Define the 12 edges of the octahedron
  const octahedronMainEdges = [
    // Top pyramid edges
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    // Bottom pyramid edges
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    // Middle ring edges
    [2, 4],
    [4, 3],
    [3, 5],
    [5, 2],
  ];

  // Create cylinder for each octahedron edge
  octahedronMainEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...octaVertices[i]);
    const end = new THREE.Vector3(...octaVertices[j]);
    const distance = start.distanceTo(end);

    // Create thick cylinder for octahedron edge - ADJUST 0.012 TO CHANGE MAIN WIREFRAME THICKNESS
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
  });

  octahedronWireframeGroup.userData.edgePairs = octaEdgePairs;

  console.log(
    "Created thick wireframe for octahedron with",
    octahedronMainEdges.length,
    "cylinder edges"
  );

  return octahedronWireframeGroup;
}
