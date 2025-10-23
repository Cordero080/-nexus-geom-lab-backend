import * as THREE from "three";

/**
 * Create intricate hyper-octahedron wireframe with inner octahedron and vertex connections
 * @param {THREE.BufferGeometry} geometry - The octahedron geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createOctahedronIntricateWireframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  // Get the 6 vertices of the octahedron (top, bottom, and 4 around the middle)
  const size = 1.0; // Octahedron radius
  const outerVertices = [
    [0, size, 0], // 0: Top vertex
    [0, -size, 0], // 1: Bottom vertex
    [size, 0, 0], // 2: Right vertex
    [-size, 0, 0], // 3: Left vertex
    [0, 0, size], // 4: Front vertex
    [0, 0, -size], // 5: Back vertex
  ];

  // Create inner octahedron (scaled down)
  const innerScale = 0.5;
  const innerVertices = outerVertices.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  // 1. Create inner octahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(hyperframeColor),
    transparent: false,
    opacity: 1.0,
  });

  const innerOctahedronGroup = new THREE.Group();

  // Define the 12 edges of the octahedron
  const octahedronEdges = [
    // Top pyramid edges (from top vertex to middle ring)
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    // Bottom pyramid edges (from bottom vertex to middle ring)
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    // Middle ring edges (connecting the 4 middle vertices)
    [2, 4],
    [4, 3],
    [3, 5],
    [5, 2],
  ];

  // Create cylinder for each inner octahedron edge
  octahedronEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    // Create thick cylinder for inner octahedron edge
    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerOctahedronGroup.add(cylinderMesh);
  });

  console.log(
    `Created hyper-octahedron inner wireframe with ${octahedronEdges.length} cylinder edges`
  );

  // 2. Create hyper-octahedron connections using thick cylinders
  const curvedLinesMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(hyperframeLineColor),
    transparent: true,
    opacity: 0.7,
  });

  const octahedronConnectionGroup = new THREE.Group();

  // Connect each inner vertex to corresponding outer vertex
  for (let i = 0; i < 6; i++) {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...outerVertices[i]);
    const distance = start.distanceTo(end);

    // Create cylinder for each connection line
    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    octahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created hyper-octahedron connections: 6 vertex-to-vertex connections`
  );

  return {
    centerLines: innerOctahedronGroup,
    centerLinesMaterial,
    curvedLines: octahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
