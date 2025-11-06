import * as THREE from "three";

/**
 * Create hyperframe for hypercube (tesseract) with inner cube wireframe and vertex connections
 * Creates edge lines for inner cube and connecting lines from outer to inner vertices
 * @param {THREE.BufferGeometry} geometry - The hypercube geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createHypercubeHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating hypercube (tesseract) hyperframe");

  const outerScale = geometry.userData.outerScale || 1.0;
  const innerScale = geometry.userData.innerScale || 0.5;

  // Define 8 vertices of a cube
  const cubeVertices = [
    [-1, -1, -1], // 0
    [1, -1, -1], // 1
    [1, 1, -1], // 2
    [-1, 1, -1], // 3
    [-1, -1, 1], // 4
    [1, -1, 1], // 5
    [1, 1, 1], // 6
    [-1, 1, 1], // 7
  ];

  // Outer cube vertices (scaled)
  const outerVertices = cubeVertices.map((v) => [
    v[0] * outerScale,
    v[1] * outerScale,
    v[2] * outerScale,
  ]);

  // Inner cube vertices (scaled)
  const innerVertices = cubeVertices.map((v) => [
    v[0] * innerScale,
    v[1] * innerScale,
    v[2] * innerScale,
  ]);

  // Define the 12 edges of a cube (vertex index pairs)
  const cubeEdges = [
    // Bottom face
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Top face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Vertical edges
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  // 1. Create inner cube wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerCubeGroup = new THREE.Group();

  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubeGroup.add(cylinderMesh);
  });

  console.log(
    `Created hypercube inner wireframe with ${cubeEdges.length} cylinder edges`
  );

  // 2. Create vertex-to-vertex connections (outer to inner)
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const hypercubeConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from the merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  // Extract unique vertices from merged geometry
  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
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

  // Connect each outer vertex to its corresponding inner vertex
  for (let i = 0; i < 8; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    hypercubeConnectionGroup.add(cylinderMesh);
  }

  console.log(`Created hypercube connections: 8 vertex-to-vertex connections`);

  return {
    centerLines: innerCubeGroup,
    centerLinesMaterial,
    curvedLines: hypercubeConnectionGroup,
    curvedLinesMaterial,
  };
}
