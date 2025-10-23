import * as THREE from "three";

/**
 * Create intricate hypercube wireframe with inner cube and corner-to-corner connections
 * @param {THREE.BufferGeometry} geometry - The box geometry
 * @param {string} intricateWireframeSpiralColor - Color for inner wireframe
 * @param {string} intricateWireframeEdgeColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createBoxIntricateWireframe(
  geometry,
  intricateWireframeSpiralColor,
  intricateWireframeEdgeColor
) {
  console.log('Creating hypercube wireframe for BoxGeometry');

  // Get the 8 corners of the outer cube (BoxGeometry 1.5x1.5x1.5)
  const size = 0.75; // Half of 1.5
  const outerCorners = [
    [-size, -size, -size], // 0: bottom-back-left
    [size, -size, -size],  // 1: bottom-back-right
    [size, size, -size],   // 2: top-back-right
    [-size, size, -size],  // 3: top-back-left
    [-size, -size, size],  // 4: bottom-front-left
    [size, -size, size],   // 5: bottom-front-right
    [size, size, size],    // 6: top-front-right
    [-size, size, size],   // 7: top-front-left
  ];

  // Create inner cube (scaled down to be INSIDE the outer cube)
  const innerScale = 0.5;
  const innerCorners = outerCorners.map((corner) => [
    corner[0] * innerScale,
    corner[1] * innerScale,
    corner[2] * innerScale,
  ]);

  // 1. Create inner cube wireframe using thick cylinders
  // Inner cube edges - proper cube wireframe structure
  const innerEdges = [
    // Back face (z = -size)
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Front face (z = +size)
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

  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#5900ffff'), // Bright purple for inner cube
    transparent: false,
    opacity: 1.0,
  });

  // Create thick visible lines using cylinder geometry
  const innerCubeGroup = new THREE.Group();

  innerEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerCorners[i]);
    const end = new THREE.Vector3(...innerCorners[j]);
    const distance = start.distanceTo(end);

    // Create cylinder for each edge
    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.008, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubeGroup.add(cylinderMesh);
  });

  console.log(`Created hypercube inner cube with ${innerEdges.length} cylinder edges`);

  // 2. Create hypercube connections (corner to corner) using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#00ff00'), // Bright green for connections
    transparent: false,
    opacity: 1.0,
  });

  // Create thick connection lines using cylinder geometry
  const connectionGroup = new THREE.Group();

  // Connect each inner corner to corresponding outer corner
  for (let i = 0; i < 8; i++) {
    const start = new THREE.Vector3(...innerCorners[i]);
    const end = new THREE.Vector3(...outerCorners[i]);
    const distance = start.distanceTo(end);

    // Create cylinder for each connection line
    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.005, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(`Created hypercube connections: ${innerEdges.length} thick cylinder connections`);

  return {
    centerLines: innerCubeGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
