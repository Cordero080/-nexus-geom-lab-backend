import * as THREE from "three";

/**
 * Creates a hyperframe for the Compound 24-cell 4D polytope
 *
 * Compound of two 24-cells at cross-axes:
 * - 48 octahedral cells total (24 × 2)
 * - 48 vertices total (24 × 2)
 * - The 24-cell is self-dual, creating perfect symmetry
 *
 * Uses dual hyperframe approach with shared materials for performance:
 * - Two complete 24-cell hyperframes rotated relative to each other
 * - Shared materials for optimal color-change performance
 * - Shows the perfect 4D self-dual symmetry
 *
 * @param {THREE.BufferGeometry} geometry - The merged compound 24-cell geometry
 * @param {string} hyperframeColor - Color for inner octahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createCompound24CellHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating compound 24-cell hyperframe (dual structure)");

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 1.0,
    layer1: 0.7,
    layer2: 0.45,
    inner: 0.25,
  };

  // Octahedron vertices (6 vertices at ±1 on each axis)
  const octaVertices = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  // Helper to rotate vertices
  const rotateVertices = (vertices, xAngle, yAngle, zAngle) => {
    return vertices.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), xAngle);
      vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), yAngle);
      vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), zAngle);
      return vec.toArray();
    });
  };

  // Create vertices for both 24-cells
  // First 24-cell (standard orientation)
  const outerVertices_A = octaVertices.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);
  const layer1Vertices_A = octaVertices.map((v) => [
    v[0] * layers.layer1,
    v[1] * layers.layer1,
    v[2] * layers.layer1,
  ]);
  const layer2Vertices_A = octaVertices.map((v) => [
    v[0] * layers.layer2,
    v[1] * layers.layer2,
    v[2] * layers.layer2,
  ]);
  const innerVertices_A = octaVertices.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // Second 24-cell (rotated 45° X, 45° Y, 30° Z)
  const rotatedOcta = rotateVertices(
    octaVertices,
    Math.PI / 4,
    Math.PI / 4,
    Math.PI / 6
  );
  const outerVertices_B = rotatedOcta.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);
  const layer1Vertices_B = rotatedOcta.map((v) => [
    v[0] * layers.layer1,
    v[1] * layers.layer1,
    v[2] * layers.layer1,
  ]);
  const layer2Vertices_B = rotatedOcta.map((v) => [
    v[0] * layers.layer2,
    v[1] * layers.layer2,
    v[2] * layers.layer2,
  ]);
  const innerVertices_B = rotatedOcta.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // Shared materials for optimal performance
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerOctahedraGroup = new THREE.Group();
  const connectionGroup = new THREE.Group();

  // Octahedron edges (12 edges connecting 6 vertices)
  const octaEdges = [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5], // +X to all
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5], // -X to all
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5], // Y to Z
  ];

  // Helper to create cylinders
  const createEdgeCylinder = (vertices, edges, radius, material) => {
    edges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...vertices[i]);
      const end = new THREE.Vector3(...vertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        6
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, material);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      innerOctahedraGroup.add(cylinderMesh);
    });
  };

  // ========================================
  // BUILD FIRST 24-CELL HYPERFRAME (A)
  // ========================================
  createEdgeCylinder(layer1Vertices_A, octaEdges, 0.005, centerLinesMaterial);
  createEdgeCylinder(layer2Vertices_A, octaEdges, 0.004, centerLinesMaterial);
  createEdgeCylinder(innerVertices_A, octaEdges, 0.003, centerLinesMaterial);

  // ========================================
  // BUILD SECOND 24-CELL HYPERFRAME (B)
  // ========================================
  createEdgeCylinder(layer1Vertices_B, octaEdges, 0.005, centerLinesMaterial);
  createEdgeCylinder(layer2Vertices_B, octaEdges, 0.004, centerLinesMaterial);
  createEdgeCylinder(innerVertices_B, octaEdges, 0.003, centerLinesMaterial);

  console.log(
    `Created compound 24-cell: ${octaEdges.length * 6} edges (both components)`
  );

  // ========================================
  // ADD FACE DIAGONALS (square faces)
  // ========================================
  // Octahedron has 8 triangular faces, but we can add diagonals across square cross-sections
  const addSquareDiagonals = (vertices, radius) => {
    // Connect opposite edges to create square diagonals
    const squareDiagonals = [
      [2, 3], // Y opposite
      [4, 5], // Z opposite
    ];

    squareDiagonals.forEach(([i, j]) => {
      const start = new THREE.Vector3(...vertices[i]);
      const end = new THREE.Vector3(...vertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        6
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      innerOctahedraGroup.add(cylinderMesh);
    });
  };

  // Add diagonals to both components
  addSquareDiagonals(layer1Vertices_A, 0.003);
  addSquareDiagonals(layer2Vertices_A, 0.0025);
  addSquareDiagonals(innerVertices_A, 0.002);

  addSquareDiagonals(layer1Vertices_B, 0.003);
  addSquareDiagonals(layer2Vertices_B, 0.0025);
  addSquareDiagonals(innerVertices_B, 0.002);

  console.log("Added square diagonals to both 24-cell components");

  // ========================================
  // VERTEX CONNECTIONS
  // ========================================
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
  }

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

  // Add radial connections from outer to inner layers
  // Component A
  for (let i = 0; i < 6; i++) {
    const start = matchVertex(outerVertices_A[i]);
    const end = new THREE.Vector3(...layer1Vertices_A[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.006, 0.006, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Component B
  for (let i = 0; i < 6; i++) {
    const start = matchVertex(outerVertices_B[i]);
    const end = new THREE.Vector3(...layer1Vertices_B[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.006, 0.006, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Add deeper connections (layer1 → layer2)
  for (let i = 0; i < 6; i++) {
    // Component A
    const startA = new THREE.Vector3(...layer1Vertices_A[i]);
    const endA = new THREE.Vector3(...layer2Vertices_A[i]);
    const distanceA = startA.distanceTo(endA);

    const cylinderGeomA = new THREE.CylinderGeometry(
      0.005,
      0.005,
      distanceA,
      6
    );
    const cylinderMeshA = new THREE.Mesh(cylinderGeomA, curvedLinesMaterial);

    cylinderMeshA.position.copy(startA.clone().add(endA).multiplyScalar(0.5));
    cylinderMeshA.lookAt(endA);
    cylinderMeshA.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMeshA);

    // Component B
    const startB = new THREE.Vector3(...layer1Vertices_B[i]);
    const endB = new THREE.Vector3(...layer2Vertices_B[i]);
    const distanceB = startB.distanceTo(endB);

    const cylinderGeomB = new THREE.CylinderGeometry(
      0.005,
      0.005,
      distanceB,
      6
    );
    const cylinderMeshB = new THREE.Mesh(cylinderGeomB, curvedLinesMaterial);

    cylinderMeshB.position.copy(startB.clone().add(endB).multiplyScalar(0.5));
    cylinderMeshB.lookAt(endB);
    cylinderMeshB.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMeshB);
  }

  console.log("Compound 24-cell hyperframe complete - self-dual structure!");

  return {
    centerLines: innerOctahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
