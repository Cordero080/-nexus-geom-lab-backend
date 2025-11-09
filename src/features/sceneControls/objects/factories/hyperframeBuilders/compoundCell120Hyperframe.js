import * as THREE from "three";

/**
 * Creates a hyperframe for the Compound 120-cell 4D polytope
 *
 * Compound of two 120-cells at cross-axes:
 * - 240 dodecahedral cells total (120 × 2)
 * - 1200 vertices total (600 × 2)
 * - THE ULTIMATE 4D POLYTOPE COMPOUND
 *
 * Uses dual hyperframe approach with shared materials for performance:
 * - Two complete 120-cell hyperframes rotated using golden angle
 * - Shared materials for optimal performance
 * - Shows the pinnacle of 4D polytope symmetry
 *
 * @param {THREE.BufferGeometry} geometry - The merged compound 120-cell geometry
 * @param {string} hyperframeColor - Color for inner dodecahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createCompound120CellHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log(
    "Creating compound 120-cell hyperframe (ULTIMATE dual structure)"
  );

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 1.2,
    layer1: 0.96,
    layer2: 0.72,
    layer3: 0.54,
    inner: 0.36,
  };

  // Golden ratio for dodecahedron construction
  const phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618

  // Canonical dodecahedron vertices (20 vertices)
  const t = 1.0;
  const cubeVertices = [
    [t, t, t],
    [t, t, -t],
    [t, -t, t],
    [t, -t, -t],
    [-t, t, t],
    [-t, t, -t],
    [-t, -t, t],
    [-t, -t, -t],
  ];

  const rectVertices = [
    [0, phi, 1 / phi],
    [0, phi, -1 / phi],
    [0, -phi, 1 / phi],
    [0, -phi, -1 / phi],
    [1 / phi, 0, phi],
    [1 / phi, 0, -phi],
    [-1 / phi, 0, phi],
    [-1 / phi, 0, -phi],
    [phi, 1 / phi, 0],
    [phi, -1 / phi, 0],
    [-phi, 1 / phi, 0],
    [-phi, -1 / phi, 0],
  ];

  const rawVertices = [...cubeVertices, ...rectVertices];

  // Normalize to unit sphere
  const normalizedVertices = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    return vec.normalize().toArray();
  });

  // Helper to rotate vertices
  const goldenAngle = (2 * Math.PI) / (phi * phi);
  const rotateVertices = (vertices) => {
    return vertices.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), goldenAngle);
      vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 5);
      vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), goldenAngle / 2);
      return vec.toArray();
    });
  };

  // Create vertices for both 120-cells
  // First 120-cell (standard orientation) - only inner layers for performance
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

  // Second 120-cell (rotated with golden angle)
  const rotatedNormalized = rotateVertices(normalizedVertices);
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

  const innerDodecahedraGroup = new THREE.Group();
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
        if (dist < edgeThreshold * Math.max(1, vertices[i][0])) {
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

      innerDodecahedraGroup.add(cylinderMesh);
    });
  };

  // ========================================
  // BUILD FIRST 120-CELL HYPERFRAME (A)
  // ========================================
  const layer1Edges_A = findEdges(layer1Vertices_A);
  createEdgeCylinder(
    layer1Vertices_A,
    layer1Edges_A,
    0.0015,
    centerLinesMaterial
  );

  const layer2Edges_A = findEdges(layer2Vertices_A);
  createEdgeCylinder(
    layer2Vertices_A,
    layer2Edges_A,
    0.0012,
    centerLinesMaterial
  );

  const layer3Edges_A = findEdges(layer3Vertices_A);
  createEdgeCylinder(
    layer3Vertices_A,
    layer3Edges_A,
    0.001,
    centerLinesMaterial
  );

  const innerEdges_A = findEdges(innerVertices_A);
  createEdgeCylinder(
    innerVertices_A,
    innerEdges_A,
    0.0008,
    centerLinesMaterial
  );

  // ========================================
  // BUILD SECOND 120-CELL HYPERFRAME (B)
  // ========================================
  const layer1Edges_B = findEdges(layer1Vertices_B);
  createEdgeCylinder(
    layer1Vertices_B,
    layer1Edges_B,
    0.0015,
    centerLinesMaterial
  );

  const layer2Edges_B = findEdges(layer2Vertices_B);
  createEdgeCylinder(
    layer2Vertices_B,
    layer2Edges_B,
    0.0012,
    centerLinesMaterial
  );

  const layer3Edges_B = findEdges(layer3Vertices_B);
  createEdgeCylinder(
    layer3Vertices_B,
    layer3Edges_B,
    0.001,
    centerLinesMaterial
  );

  const innerEdges_B = findEdges(innerVertices_B);
  createEdgeCylinder(
    innerVertices_B,
    innerEdges_B,
    0.0008,
    centerLinesMaterial
  );

  console.log(
    `Created compound 120-cell: ${
      (layer1Edges_A.length +
        layer2Edges_A.length +
        layer3Edges_A.length +
        innerEdges_A.length) *
      2
    } edges total (both components)`
  );

  // ========================================
  // ADD FACE DIAGONALS (reduced for performance)
  // ========================================
  const addFaceDiagonals = (vertices, radius, material) => {
    const diagonalThreshold = 1.7;
    let count = 0;

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        // Sample every 3rd diagonal to reduce density
        if ((i + j) % 3 !== 0) continue;

        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        if (
          dist > edgeThreshold * Math.max(1, vertices[i][0]) &&
          dist < diagonalThreshold * Math.max(1, vertices[i][0])
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

          innerDodecahedraGroup.add(cylinderMesh);
          count++;
        }
      }
    }
    return count;
  };

  // Add sampled face diagonals to both components (reduced density)
  addFaceDiagonals(layer1Vertices_A, 0.0012, centerLinesMaterial);
  addFaceDiagonals(layer2Vertices_A, 0.001, centerLinesMaterial);
  addFaceDiagonals(layer3Vertices_A, 0.0008, centerLinesMaterial);

  addFaceDiagonals(layer1Vertices_B, 0.0012, centerLinesMaterial);
  addFaceDiagonals(layer2Vertices_B, 0.001, centerLinesMaterial);
  addFaceDiagonals(layer3Vertices_B, 0.0008, centerLinesMaterial);

  console.log("Added sampled face diagonals to both 120-cell components");

  // ========================================
  // VERTEX CONNECTIONS (sampled for performance)
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

  // Add key connections (sample every 2nd vertex for performance)
  for (let i = 0; i < 20; i += 2) {
    // Component A
    const startA = new THREE.Vector3(...layer1Vertices_A[i]);
    const endA = matchVertex(outerVertices_A[i]);
    const distanceA = startA.distanceTo(endA);

    const cylinderGeomA = new THREE.CylinderGeometry(
      0.002,
      0.002,
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
    const endB = matchVertex(outerVertices_B[i]);
    const distanceB = startB.distanceTo(endB);

    const cylinderGeomB = new THREE.CylinderGeometry(
      0.002,
      0.002,
      distanceB,
      6
    );
    const cylinderMeshB = new THREE.Mesh(cylinderGeomB, curvedLinesMaterial);

    cylinderMeshB.position.copy(startB.clone().add(endB).multiplyScalar(0.5));
    cylinderMeshB.lookAt(endB);
    cylinderMeshB.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMeshB);
  }

  console.log(
    "Compound 120-cell hyperframe complete - THE ULTIMATE 4D STRUCTURE!"
  );

  return {
    centerLines: innerDodecahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
