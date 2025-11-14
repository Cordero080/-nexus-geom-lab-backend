import * as THREE from 'three';

/**
 * Create hyperframe for 120-cell (4D polytope of 120 dodecahedra)
 * Shows 3D shadow with nested dodecahedra and vertex connections
 * @param {THREE.BufferGeometry} geometry - The merged 120-cell geometry
 * @param {string} hyperframeColor - Color for inner dodecahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function create120CellHyperframe(geometry, hyperframeColor, hyperframeLineColor) {
  console.log('Creating 120-cell hyperframe');

  // Get layer sizes from geometry metadata
  const layers = geometry.userData.layers || {
    outer: 2.0,
    layer1: 1.6,
    layer2: 1.2,
    layer3: 0.9,
    inner: 0.6,
  };

  // Golden ratio for dodecahedron construction
  const phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618

  // Canonical dodecahedron vertices (20 vertices)
  // 8 vertices of a cube
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

  // 12 vertices on rectangular faces (golden ratio rectangles)
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

  const layer3Vertices = normalizedVertices.map((v) => [
    v[0] * layers.layer3,
    v[1] * layers.layer3,
    v[2] * layers.layer3,
  ]);

  const innerVertices = normalizedVertices.map((v) => [
    v[0] * layers.inner,
    v[1] * layers.inner,
    v[2] * layers.inner,
  ]);

  // ========================================
  // 1. CREATE INNER DODECAHEDRA WIREFRAMES
  // ========================================
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerDodecahedraGroup = new THREE.Group();

  // Find dodecahedron edges (each vertex connects to 3 others)
  // Dodecahedron edge length ≈ 1.05 for normalized vertices
  const edgeThreshold = 1.1;

  // Helper to find edges for a given set of vertices
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

  // Create wireframes for all inner layers with decreasing thickness
  const layer1Edges = findEdges(layer1Vertices);
  layer1Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer1Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerDodecahedraGroup.add(cylinderMesh);
  });

  const layer2Edges = findEdges(layer2Vertices);
  layer2Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0016, 0.0016, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerDodecahedraGroup.add(cylinderMesh);
  });

  const layer3Edges = findEdges(layer3Vertices);
  layer3Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer3Vertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0013, 0.0013, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerDodecahedraGroup.add(cylinderMesh);
  });

  const innerEdges = findEdges(innerVertices);
  innerEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.001, 0.001, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerDodecahedraGroup.add(cylinderMesh);
  });

  console.log(
    `Created 120-cell inner dodecahedra: ${layer1Edges.length} layer1, ${layer2Edges.length} layer2, ${layer3Edges.length} layer3, ${innerEdges.length} inner edges`
  );

  // ========================================
  // 1B. ADD FACE DIAGONALS
  // ========================================
  // Dodecahedron has 12 pentagonal faces
  // Each pentagon has 5 diagonals, but we'll add a subset to avoid clutter
  // We'll identify face groups and add diagonals across them

  // Helper to add face diagonals for a layer
  const addFaceDiagonals = (vertices, radius) => {
    // For each vertex, find its 3 neighbors (dodecahedron has 3 edges per vertex)
    // Then connect to non-adjacent vertices on the same face
    const diagonalThreshold = 1.7; // Slightly longer than edge length

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        // Face diagonals are longer than edges but shorter than space diagonals
        if (
          dist > edgeThreshold * Math.max(1, vertices[i][0]) &&
          dist < diagonalThreshold * Math.max(1, vertices[i][0])
        ) {
          const distance = v1.distanceTo(v2);
          const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

          cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
          cylinderMesh.lookAt(v2);
          cylinderMesh.rotateX(Math.PI / 2);

          innerDodecahedraGroup.add(cylinderMesh);
        }
      }
    }
  };

  // Add face diagonals to each layer (very thin to avoid clutter)
  addFaceDiagonals(layer1Vertices, 0.0015);
  addFaceDiagonals(layer2Vertices, 0.0012);
  addFaceDiagonals(layer3Vertices, 0.001);
  addFaceDiagonals(innerVertices, 0.0008);

  console.log(`Added face diagonals to all 4 inner layers`);

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
    actualVertices.push(new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2]));
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
  for (let i = 0; i < 20; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...layer1Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Connect layer1 to layer2 vertices
  for (let i = 0; i < 20; i++) {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0028, 0.0028, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Connect layer2 to layer3 vertices
  for (let i = 0; i < 20; i++) {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0026, 0.0026, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Connect layer3 to inner vertices
  for (let i = 0; i < 20; i++) {
    const start = new THREE.Vector3(...layer3Vertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0024, 0.0024, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created 120-cell connections: 20 outer→layer1, 20 layer1→layer2, 20 layer2→layer3, 20 layer3→inner = 80 total`
  );

  // ========================================
  // 3. ADD SPACE DIAGONALS
  // ========================================
  // Space diagonals connect opposite vertices through the center
  // For a dodecahedron with 20 vertices, there are 10 pairs of opposite vertices

  const addSpaceDiagonals = (vertices, radius) => {
    // Find pairs of vertices that are furthest apart (opposite through center)
    const spaceDiagonalThreshold = 1.9; // Much longer than edges or face diagonals

    const processed = new Set();
    for (let i = 0; i < vertices.length; i++) {
      if (processed.has(i)) continue;

      let maxDist = 0;
      let oppositeIdx = -1;

      for (let j = i + 1; j < vertices.length; j++) {
        if (processed.has(j)) continue;
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        if (dist > maxDist && dist > spaceDiagonalThreshold * Math.max(1, vertices[i][0])) {
          maxDist = dist;
          oppositeIdx = j;
        }
      }

      if (oppositeIdx !== -1) {
        processed.add(i);
        processed.add(oppositeIdx);

        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[oppositeIdx]);
        const distance = v1.distanceTo(v2);

        const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 6);
        const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);

        connectionGroup.add(cylinderMesh);
      }
    }
  };

  // Add space diagonals to inner layers (very thin)
  addSpaceDiagonals(layer1Vertices, 0.0012);
  addSpaceDiagonals(layer2Vertices, 0.001);
  addSpaceDiagonals(layer3Vertices, 0.0008);
  addSpaceDiagonals(innerVertices, 0.0006);

  console.log(`Added space diagonals to all 4 inner layers`);

  // ========================================
  // 4. ADD CROSS-LAYER CONNECTIONS
  // ========================================
  // Connect non-adjacent layers to show dimensional folding

  // Outer to layer2 (skip layer1)
  for (let i = 0; i < 20; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0015, 0.0015, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Layer1 to layer3 (skip layer2)
  for (let i = 0; i < 20; i++) {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0013, 0.0013, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // Layer2 to inner (skip layer3)
  for (let i = 0; i < 20; i++) {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0011, 0.0011, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(`Added 60 cross-layer connections (outer→layer2, layer1→layer3, layer2→inner)`);

  return {
    centerLines: innerDodecahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
