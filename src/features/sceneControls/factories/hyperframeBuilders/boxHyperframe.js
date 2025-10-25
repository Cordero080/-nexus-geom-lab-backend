import * as THREE from "three";

/**
 * Create hyperframe for hypercube (tesseract projection) with inner/outer cubes and 8 connecting edges
 * Creates classic "cube within a cube" tesseract visualization
 * @param {THREE.BufferGeometry} geometry - The hypercube geometry (outer + inner cube)
 * @param {string} hyperframeColor - Color for inner cube wireframe
 * @param {string} hyperframeLineColor - Color for tesseract connections (8 edges)
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createBoxHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating hypercube (tesseract) hyperframe");

  // Tesseract: Outer cube (1.5 units) and inner cube (0.75 units)
  const outerSize = 0.75; // Half of 1.5
  const innerSize = 0.375; // Half of 0.75

  // 8 vertices of outer cube
  const outerCorners = [
    [-outerSize, -outerSize, -outerSize], // 0: back-bottom-left
    [outerSize, -outerSize, -outerSize], // 1: back-bottom-right
    [outerSize, outerSize, -outerSize], // 2: back-top-right
    [-outerSize, outerSize, -outerSize], // 3: back-top-left
    [-outerSize, -outerSize, outerSize], // 4: front-bottom-left
    [outerSize, -outerSize, outerSize], // 5: front-bottom-right
    [outerSize, outerSize, outerSize], // 6: front-top-right
    [-outerSize, outerSize, outerSize], // 7: front-top-left
  ];

  // 8 vertices of inner cube (concentric, scaled 0.5x)
  const innerCorners = [
    [-innerSize, -innerSize, -innerSize], // 0
    [innerSize, -innerSize, -innerSize], // 1
    [innerSize, innerSize, -innerSize], // 2
    [-innerSize, innerSize, -innerSize], // 3
    [-innerSize, -innerSize, innerSize], // 4
    [innerSize, -innerSize, innerSize], // 5
    [innerSize, innerSize, innerSize], // 6
    [-innerSize, innerSize, innerSize], // 7
  ];

  // ========================================
  // 1. CREATE INNER CUBE WIREFRAME (12 edges)
  // ========================================
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerCubeGroup = new THREE.Group();

  // 12 edges of a cube
  const cubeEdges = [
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

  // Create inner cube edges with cylinders
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerCorners[i]);
    const end = new THREE.Vector3(...innerCorners[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubeGroup.add(cylinderMesh);
  });

  console.log(`Created inner cube wireframe: 12 edges`);

  // ========================================
  // 2. CREATE TESSERACT CONNECTIONS (8 edges)
  // ========================================
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const tesseractConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from merged geometry for precise matching
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
  }

  console.log(`Found ${actualVertices.length} vertices in hypercube geometry`);

  // Nearest vertex matching function
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

  // Create 8 tesseract connections: each outer vertex → corresponding inner vertex
  for (let i = 0; i < 8; i++) {
    const outerVertex = matchVertex(outerCorners[i]);
    const innerVertex = new THREE.Vector3(...innerCorners[i]);
    const distance = outerVertex.distanceTo(innerVertex);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    // Position cylinder between outer and inner vertex
    cylinderMesh.position.copy(
      outerVertex.clone().add(innerVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(innerVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    tesseractConnectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created tesseract connections: 8 edges connecting outer to inner cube`
  );
  console.log(
    `Total tesseract structure: 12 inner edges + 8 connecting edges = 20 edges`
  );

  return {
    centerLines: innerCubeGroup,
    centerLinesMaterial,
    curvedLines: tesseractConnectionGroup,
    curvedLinesMaterial,
  };
}
