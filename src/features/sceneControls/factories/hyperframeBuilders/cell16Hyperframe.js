import * as THREE from "three";

/**
 * Create hyperframe for 16-cell (hyperdiamond/hyperoctahedron)
 * Simplest regular 4D polytope, dual of 24-cell
 * Made of 16 tetrahedra with 8 vertices
 * @param {THREE.BufferGeometry} geometry - The merged 16-cell geometry
 * @param {string} hyperframeColor - Color for inner tetrahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function create16CellHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating 16-cell hyperframe");

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 1.2,
    middle: 0.7,
    inner: 0.35,
  };

  // Canonical tetrahedron vertices (4 vertices)
  // Regular tetrahedron inscribed in sphere
  const a = 1 / Math.sqrt(3);
  const normalizedVertices = [
    [a, a, a],
    [a, -a, -a],
    [-a, a, -a],
    [-a, -a, a],
  ];

  // Create scaled vertices for inner layers
  const middleVertices = normalizedVertices.map((v) => [
    v[0] * layers.middle,
    v[1] * layers.middle,
    v[2] * layers.middle,
  ]);

  const innerVertices = normalizedVertices.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // ========================================
  // 1. CREATE INNER TETRAHEDRA WIREFRAMES
  // ========================================
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerTetrahedraGroup = new THREE.Group();

  // Tetrahedron edges: 6 edges connecting all 4 vertices
  const tetrahedronEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  // Helper to create edges for a layer
  const createLayerEdges = (vertices, radius, segments) => {
    tetrahedronEdges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...vertices[i]);
      const end = new THREE.Vector3(...vertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        segments
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      innerTetrahedraGroup.add(cylinderMesh);
    });
  };

  // Create wireframes for inner layers (thin lines)
  createLayerEdges(middleVertices, 0.002, 6);
  createLayerEdges(innerVertices, 0.0015, 6);

  console.log(
    `Created 16-cell inner tetrahedra: 2 layers × 6 edges = 12 edges`
  );

  // ========================================
  // 2. CREATE VERTEX CONNECTIONS
  // ========================================
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const connectionGroup = new THREE.Group();

  // Extract actual vertex positions from merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
  }

  // Match canonical vertex to closest actual vertex
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

  // Outer vertices (scaled to outer size)
  const outerVertices = normalizedVertices.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);

  // Connect outer to middle vertices
  for (let i = 0; i < 4; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...middleVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0025,
      0.0025,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Connect middle to inner vertices
  for (let i = 0; i < 4; i++) {
    const start = new THREE.Vector3(...middleVertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created 16-cell connections: 4 outer→middle, 4 middle→inner = 8 total`
  );

  // ========================================
  // 3. ADD SPACE DIAGONALS (optional)
  // ========================================
  // Tetrahedron has no direct opposite vertices, so we'll connect
  // vertices that are furthest apart (the two pairs)

  const addSpaceDiagonals = (vertices, radius) => {
    // Connect pairs that maximize distance
    const diagonalPairs = [
      [0, 1],
      [2, 3],
    ];

    diagonalPairs.forEach(([i, j]) => {
      const v1 = new THREE.Vector3(...vertices[i]);
      const v2 = new THREE.Vector3(...vertices[j]);
      const distance = v1.distanceTo(v2);

      const cylinderGeom = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        6
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

      cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      cylinderMesh.lookAt(v2);
      cylinderMesh.rotateX(Math.PI / 2);

      connectionGroup.add(cylinderMesh);
    });
  };

  // Add subtle space diagonals to inner layers
  addSpaceDiagonals(middleVertices, 0.0008);
  addSpaceDiagonals(innerVertices, 0.0006);

  console.log(`Added space diagonals to 2 inner layers`);

  return {
    centerLines: innerTetrahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
