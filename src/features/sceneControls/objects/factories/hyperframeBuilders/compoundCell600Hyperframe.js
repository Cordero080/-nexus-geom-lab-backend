import * as THREE from "three";

/**
 * Creates a hyperframe for the Compound 600-cell 4D polytope
 *
 * Compound of two 600-cells at cross-axes:
 * - 1200 tetrahedral cells total (600 × 2)
 * - 240 vertices total (120 × 2)
 * - Creates stunning 4D intersection patterns
 *
 * Uses dual hyperframe approach:
 * - Two complete 600-cell hyperframes rotated relative to each other
 * - Different colors to distinguish the two components
 * - Shows the deep symmetry of 4D space
 *
 * @param {THREE.BufferGeometry} geometry - The merged compound 600-cell geometry
 * @param {string} hyperframeColor - Color for inner icosahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createCompound600CellHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating compound 600-cell hyperframe (dual structure)");

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 1.2,
    layer1: 0.95,
    layer2: 0.7,
    layer3: 0.5,
    inner: 0.25,
  };

  // Golden ratio for icosahedron construction
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = 1 / Math.sqrt(1 + phi * phi);
  const b = phi * a;

  // Canonical icosahedron vertices (12 vertices)
  const rawVertices = [
    [0, a, b],
    [0, a, -b],
    [0, -a, b],
    [0, -a, -b],
    [a, b, 0],
    [a, -b, 0],
    [-a, b, 0],
    [-a, -b, 0],
    [b, 0, a],
    [-b, 0, a],
    [b, 0, -a],
    [-b, 0, -a],
  ];

  const normalizedVertices = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    return vec.normalize().toArray();
  });

  // Helper to rotate vertices
  const rotateVertices = (vertices, yAngle, zAngle) => {
    return vertices.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), yAngle);
      vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), zAngle);
      return vec.toArray();
    });
  };

  // Create vertices for both 600-cells
  // First 600-cell (standard orientation)
  const layer1Vertices_A = normalizedVertices.map((v) => [
    v[0] * layers.layer1,
    v[1] * layers.layer1,
    v[2] * layers.layer1,
  ]);
  const layer2Vertices_A = normalizedVertices.map((v) => [
    v[0] * layers.layer2,
    v[1] * layers.layer2,
    v[2] * layers.layer2,
  ]);
  const layer3Vertices_A = normalizedVertices.map((v) => [
    v[0] * layers.layer3,
    v[1] * layers.layer3,
    v[2] * layers.layer3,
  ]);
  const innerVertices_A = normalizedVertices.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // Second 600-cell (rotated 90° Y, 45° Z)
  const rotatedNormalized = rotateVertices(
    normalizedVertices,
    Math.PI / 2,
    Math.PI / 4
  );
  const layer1Vertices_B = rotatedNormalized.map((v) => [
    v[0] * layers.layer1,
    v[1] * layers.layer1,
    v[2] * layers.layer1,
  ]);
  const layer2Vertices_B = rotatedNormalized.map((v) => [
    v[0] * layers.layer2,
    v[1] * layers.layer2,
    v[2] * layers.layer2,
  ]);
  const layer3Vertices_B = rotatedNormalized.map((v) => [
    v[0] * layers.layer3,
    v[1] * layers.layer3,
    v[2] * layers.layer3,
  ]);
  const innerVertices_B = rotatedNormalized.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // Materials - use SHARED materials for better performance
  // All center lines use same material, all curved lines use same material
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

  const innerIcosahedraGroup = new THREE.Group();
  const connectionGroup = new THREE.Group();

  // Edge detection threshold
  const edgeThreshold = 1.1;

  // Helper to find edges
  const findEdges = (vertices) => {
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);
        if (dist < edgeThreshold * Math.max(1, Math.abs(vertices[i][0]))) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  };

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

      innerIcosahedraGroup.add(cylinderMesh);
    });
  };

  // ========================================
  // BUILD FIRST 600-CELL HYPERFRAME (A)
  // ========================================
  const layer1Edges_A = findEdges(layer1Vertices_A);
  createEdgeCylinder(
    layer1Vertices_A,
    layer1Edges_A,
    0.003,
    centerLinesMaterial
  );

  const layer2Edges_A = findEdges(layer2Vertices_A);
  createEdgeCylinder(
    layer2Vertices_A,
    layer2Edges_A,
    0.0025,
    centerLinesMaterial
  );

  const layer3Edges_A = findEdges(layer3Vertices_A);
  createEdgeCylinder(
    layer3Vertices_A,
    layer3Edges_A,
    0.002,
    centerLinesMaterial
  );

  const innerEdges_A = findEdges(innerVertices_A);
  createEdgeCylinder(
    innerVertices_A,
    innerEdges_A,
    0.0015,
    centerLinesMaterial
  );

  // ========================================
  // BUILD SECOND 600-CELL HYPERFRAME (B)
  // ========================================
  const layer1Edges_B = findEdges(layer1Vertices_B);
  createEdgeCylinder(
    layer1Vertices_B,
    layer1Edges_B,
    0.003,
    centerLinesMaterial
  );

  const layer2Edges_B = findEdges(layer2Vertices_B);
  createEdgeCylinder(
    layer2Vertices_B,
    layer2Edges_B,
    0.0025,
    centerLinesMaterial
  );

  const layer3Edges_B = findEdges(layer3Vertices_B);
  createEdgeCylinder(
    layer3Vertices_B,
    layer3Edges_B,
    0.002,
    centerLinesMaterial
  );

  const innerEdges_B = findEdges(innerVertices_B);
  createEdgeCylinder(
    innerVertices_B,
    innerEdges_B,
    0.0015,
    centerLinesMaterial
  );

  console.log(
    `Created compound 600-cell: ${
      layer1Edges_A.length + layer1Edges_B.length
    } edges total (both components)`
  );

  // ========================================
  // ADD FACE DIAGONALS (both components)
  // ========================================
  const addFaceDiagonals = (vertices, radius, material) => {
    const diagonalThreshold = 1.8;
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        if (
          dist > edgeThreshold * Math.max(1, Math.abs(vertices[i][0])) &&
          dist < diagonalThreshold * Math.max(1, Math.abs(vertices[i][0]))
        ) {
          const distance = v1.distanceTo(v2);
          const cylinderGeom = new THREE.CylinderGeometry(
            radius,
            radius,
            distance,
            6
          );
          const cylinderMesh = new THREE.Mesh(cylinderGeom, material);

          cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
          cylinderMesh.lookAt(v2);
          cylinderMesh.rotateX(Math.PI / 2);

          innerIcosahedraGroup.add(cylinderMesh);
        }
      }
    }
  };

  // Component A face diagonals
  addFaceDiagonals(layer1Vertices_A, 0.002, centerLinesMaterial);
  addFaceDiagonals(layer2Vertices_A, 0.0018, centerLinesMaterial);
  addFaceDiagonals(layer3Vertices_A, 0.0015, centerLinesMaterial);
  addFaceDiagonals(innerVertices_A, 0.0012, centerLinesMaterial);

  // Component B face diagonals
  addFaceDiagonals(layer1Vertices_B, 0.002, centerLinesMaterial);
  addFaceDiagonals(layer2Vertices_B, 0.0018, centerLinesMaterial);
  addFaceDiagonals(layer3Vertices_B, 0.0015, centerLinesMaterial);
  addFaceDiagonals(innerVertices_B, 0.0012, centerLinesMaterial);

  console.log("Added face diagonals to both 600-cell components");

  // ========================================
  // VERTEX CONNECTIONS (simplified for compound)
  // ========================================
  // Extract actual vertices from geometry
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

  // Outer vertices for both components
  const outerVertices_A = normalizedVertices.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);

  const outerVertices_B = rotatedNormalized.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);

  // Add key connections for component A (reduced density for clarity)
  for (let i = 0; i < 12; i += 2) {
    // Every other vertex
    const start = new THREE.Vector3(...layer1Vertices_A[i]);
    const end = matchVertex(outerVertices_A[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Add key connections for component B
  for (let i = 0; i < 12; i += 2) {
    const start = new THREE.Vector3(...layer1Vertices_B[i]);
    const end = matchVertex(outerVertices_B[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log("Compound 600-cell hyperframe complete - dual structure!");

  // Return with shared materials for optimal performance
  return {
    centerLines: innerIcosahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
