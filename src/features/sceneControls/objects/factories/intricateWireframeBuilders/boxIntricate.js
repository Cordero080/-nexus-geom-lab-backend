import * as THREE from 'three';

/**
 * Create intricate compound box (stella octangula) wireframe with dual inner cubes and vertex connections
 * Always creates two overlapping wireframe sets for 3D star pattern
 * @param {THREE.BufferGeometry} geometry - The compound box geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createBoxIntricateWireframe(geometry, hyperframeColor, hyperframeLineColor) {
  console.log('Creating compound box (stella octangula) wireframe');

  // Cube vertices for first box (8 corners)
  const size = 0.75; // Half of 1.5
  const cmpCubeOuterCorners1 = [
    [-size, -size, -size],
    [size, -size, -size],
    [size, size, -size],
    [-size, size, -size],
    [-size, -size, size],
    [size, -size, size],
    [size, size, size],
    [-size, size, size],
  ];

  // Create rotated second set for compound geometry (45° on Y axis)
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationY(Math.PI / 4);

  const cmpCubeOuterCorners2 = cmpCubeOuterCorners1.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return vec.toArray();
  });

  // Create inner cubes (scaled down)
  const innerScale = 0.5;
  const cmpCubeInnerCorners1 = cmpCubeOuterCorners1.map((corner) => [
    corner[0] * innerScale,
    corner[1] * innerScale,
    corner[2] * innerScale,
  ]);

  const cmpCubeInnerCorners2 = cmpCubeOuterCorners2.map((corner) => [
    corner[0] * innerScale,
    corner[1] * innerScale,
    corner[2] * innerScale,
  ]);

  // 1. Create inner cube wireframes using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerCmpCubeGroup = new THREE.Group();

  // Cube edges (12 edges connecting 8 vertices)
  const cmpCubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // front face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // connecting edges
  ];

  // First inner cube edges
  cmpCubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cmpCubeInnerCorners1[i]);
    const end = new THREE.Vector3(...cmpCubeInnerCorners1[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCmpCubeGroup.add(cylinderMesh);
  });

  // Second inner cube edges
  cmpCubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cmpCubeInnerCorners2[i]);
    const end = new THREE.Vector3(...cmpCubeInnerCorners2[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCmpCubeGroup.add(cylinderMesh);
  });

  console.log(
    `Created compound box inner wireframes with ${cmpCubeEdges.length} x2 cylinder edges`
  );

  // 2. Create vertex-to-core connections using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const cmpCubeConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from the merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  // Extract unique vertices from merged geometry
  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2]));
  }

  // Match each canonical outer vertex to its closest actual vertex
  const matchVertex = (canonical) => {
    const canonicalVec = new THREE.Vector3(...canonical);
    let closest = actualVertices[0];
    let minDist = canonicalVec.distanceTo(closest);

    for (let i = 1; i < actualVertices.length; i++) {
      const dist = canonicalVec.distanceTo(actualVertices[i]);
      if (dist < minDist) {
        minDist = dist;
        closest = actualVertices[i];
      }
    }
    return closest;
  };

  // First box connections (8 vertices)
  for (let i = 0; i < 8; i++) {
    const start = matchVertex(cmpCubeOuterCorners1[i]);
    const end = new THREE.Vector3(...cmpCubeInnerCorners1[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cmpCubeConnectionGroup.add(cylinderMesh);
  }

  // Second box connections (8 vertices)
  for (let i = 0; i < 8; i++) {
    const start = matchVertex(cmpCubeOuterCorners2[i]);
    const end = new THREE.Vector3(...cmpCubeInnerCorners2[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cmpCubeConnectionGroup.add(cylinderMesh);
  }

  console.log(`Created compound box connections: 16 vertex-to-core connections`);

  return {
    centerLines: innerCmpCubeGroup,
    centerLinesMaterial,
    curvedLines: cmpCubeConnectionGroup,
    curvedLinesMaterial,
  };
}
