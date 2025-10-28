import * as THREE from "three";

/**
 * Create hyperframe for 24-cell (4D polytope of 24 octahedra)
 * Self-dual structure unique to 4D space
 * Shows 3D shadow with nested octahedra and vertex connections
 * @param {THREE.BufferGeometry} geometry - The merged 24-cell geometry
 * @param {string} hyperframeColor - Color for inner octahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function create24CellHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating 24-cell hyperframe");

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 1.0,
    layer1: 0.7,
    layer2: 0.45,
    inner: 0.25,
  };

  // Canonical octahedron vertices (6 vertices: ±1 on each axis)
  const normalizedVertices = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  // Create scaled vertices for all inner layers
  const layer1Vertices = normalizedVertices.map((v) => [
    v[0] * layers.layer1,
    v[1] * layers.layer1,
    v[2] * layers.layer1,
  ]);

  const layer2Vertices = normalizedVertices.map((v) => [
    v[0] * layers.layer2,
    v[1] * layers.layer2,
    v[2] * layers.layer2,
  ]);

  const innerVertices = normalizedVertices.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // ========================================
  // 1. CREATE INNER OCTAHEDRA WIREFRAMES
  // ========================================
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerOctahedraGroup = new THREE.Group();

  // Octahedron edges: each vertex connects to 4 others
  // Edge pairs for octahedron (12 edges total)
  const octahedronEdges = [
    // Top vertex (2) to middle ring
    [2, 0],
    [2, 4],
    [2, 1],
    [2, 5],
    // Bottom vertex (3) to middle ring
    [3, 0],
    [3, 4],
    [3, 1],
    [3, 5],
    // Middle ring square
    [0, 4],
    [4, 1],
    [1, 5],
    [5, 0],
  ];

  // Helper to create edges for a layer
  const createLayerEdges = (vertices, radius, segments) => {
    octahedronEdges.forEach(([i, j]) => {
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

      innerOctahedraGroup.add(cylinderMesh);
    });
  };

  // Create wireframes for all inner layers with decreasing thickness
  createLayerEdges(layer1Vertices, 0.002, 6);
  createLayerEdges(layer2Vertices, 0.0016, 6);
  createLayerEdges(innerVertices, 0.0012, 6);

  console.log(
    `Created 24-cell inner octahedra: 3 layers × 12 edges = 36 edges`
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

  // Connect outer to layer1 vertices
  for (let i = 0; i < 6; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...layer1Vertices[i]);
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

  // Connect layer1 to layer2 vertices
  for (let i = 0; i < 6; i++) {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Connect layer2 to inner vertices
  for (let i = 0; i < 6; i++) {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0016,
      0.0016,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created 24-cell connections: 6 outer→layer1, 6 layer1→layer2, 6 layer2→inner = 18 total`
  );

  // ========================================
  // 3. ADD SPACE DIAGONALS (optional for 24-cell)
  // ========================================
  // Octahedron has 3 space diagonals through center (connecting opposite vertices)
  const spaceDiagonalPairs = [
    [0, 1], // X-axis
    [2, 3], // Y-axis
    [4, 5], // Z-axis
  ];

  const addSpaceDiagonals = (vertices, radius) => {
    spaceDiagonalPairs.forEach(([i, j]) => {
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

  // Add space diagonals to inner layers (very thin)
  addSpaceDiagonals(layer1Vertices, 0.0008);
  addSpaceDiagonals(layer2Vertices, 0.0006);
  addSpaceDiagonals(innerVertices, 0.0005);

  console.log(`Added space diagonals to 3 inner layers`);

  return {
    centerLines: innerOctahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
