import * as THREE from 'three';

/**
 * Creates a hyperframe for the 600-cell 4D polytope
 *
 * The 600-cell is the most complex regular 4D polytope:
 * - 600 tetrahedral cells
 * - 120 vertices (projecting onto icosahedral symmetry)
 * - 1200 triangular faces
 * - Dual of the 120-cell
 *
 * Uses same detailed approach as 120-cell:
 * - 4 inner icosahedra wireframes showing dimensional collapse
 * - Face diagonals across triangular faces
 * - Space diagonals through centers
 * - Vertex connections between all adjacent layers
 * - Cross-layer connections showing deep 4D structure
 *
 * @param {THREE.BufferGeometry} geometry - The merged 600-cell geometry
 * @param {string} hyperframeColor - Color for inner icosahedra wireframes
 * @param {string} hyperframeLineColor - Color for vertex connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function create600CellHyperframe(geometry, hyperframeColor, hyperframeLineColor) {
  console.log('Creating 600-cell hyperframe (detailed structure)');

  // Get layer sizes from geometry metadata (5 nested icosahedra - matching 120-cell structure)
  const layers = geometry.userData.layers || {
    outer: 1.2,
    layer1: 0.95,
    layer2: 0.7,
    layer3: 0.5,
    inner: 0.25,
  };

  // Golden ratio for icosahedron construction
  const phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618
  const a = 1 / Math.sqrt(1 + phi * phi); // Normalization factor
  const b = phi * a;

  // Canonical icosahedron vertices (12 vertices)
  const rawVertices = [
    // Rectangle in xy-plane
    [0, a, b],
    [0, a, -b],
    [0, -a, b],
    [0, -a, -b],
    // Rectangle in yz-plane
    [a, b, 0],
    [a, -b, 0],
    [-a, b, 0],
    [-a, -b, 0],
    // Rectangle in zx-plane
    [b, 0, a],
    [-b, 0, a],
    [b, 0, -a],
    [-b, 0, -a],
  ];

  // Normalize to unit sphere
  const normalizedVertices = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    return vec.normalize().toArray();
  });

  // Create scaled vertices for ALL 5 inner layers (matching 120-cell: 5 nested shapes)
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
  // 1. CREATE INNER ICOSAHEDRA WIREFRAMES
  // ========================================
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerIcosahedraGroup = new THREE.Group();

  // Find icosahedron edges (each vertex connects to 5 others)
  // Icosahedron edge length ≈ 1.05 for normalized vertices
  const edgeThreshold = 1.1;

  // Helper to find edges for a given set of vertices
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

  // Create wireframes for all 3 inner layers with decreasing thickness
  const layer1Edges = findEdges(layer1Vertices);
  layer1Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer1Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedraGroup.add(cylinderMesh);
  });

  const layer2Edges = findEdges(layer2Vertices);
  layer2Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedraGroup.add(cylinderMesh);
  });

  const layer3Edges = findEdges(layer3Vertices);
  layer3Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...layer3Vertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0025, 0.0025, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedraGroup.add(cylinderMesh);
  });

  const innerEdges = findEdges(innerVertices);
  layer3Edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedraGroup.add(cylinderMesh);
  });

  console.log(
    `Created 600-cell inner icosahedra: ${layer1Edges.length} layer1, ${layer2Edges.length} layer2, ${layer3Edges.length} layer3, ${innerEdges.length} inner edges`
  );

  // ========================================
  // 1B. ADD FACE DIAGONALS (triangular faces)
  // ========================================
  // Icosahedron has 20 triangular faces
  // Add diagonals across faces to show tetrahedral cell structure

  const addFaceDiagonals = (vertices, radius) => {
    const diagonalThreshold = 1.8; // Slightly longer than edge length

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        // Face diagonals are longer than edges but shorter than space diagonals
        if (
          dist > edgeThreshold * Math.max(1, Math.abs(vertices[i][0])) &&
          dist < diagonalThreshold * Math.max(1, Math.abs(vertices[i][0]))
        ) {
          const distance = v1.distanceTo(v2);
          const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

          cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
          cylinderMesh.lookAt(v2);
          cylinderMesh.rotateX(Math.PI / 2);

          innerIcosahedraGroup.add(cylinderMesh);
        }
      }
    }
  };

  // Add face diagonals to each layer (very thin)
  addFaceDiagonals(layer1Vertices, 0.003);
  addFaceDiagonals(layer2Vertices, 0.0025);
  addFaceDiagonals(layer3Vertices, 0.002);
  addFaceDiagonals(innerVertices, 0.0015);

  console.log(`Added face diagonals to all 4 inner layers`);

  // ========================================
  // 1C. ADD SPACE DIAGONALS
  // ========================================
  // Connect opposite vertices through the center

  const addSpaceDiagonals = (vertices, radius) => {
    const spaceDiagonalThreshold = 1.9;

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = new THREE.Vector3(...vertices[i]);
        const v2 = new THREE.Vector3(...vertices[j]);
        const dist = v1.distanceTo(v2);

        // Space diagonals are the longest connections
        if (dist > spaceDiagonalThreshold * Math.max(1, Math.abs(vertices[i][0]))) {
          const distance = v1.distanceTo(v2);
          const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

          cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
          cylinderMesh.lookAt(v2);
          cylinderMesh.rotateX(Math.PI / 2);

          innerIcosahedraGroup.add(cylinderMesh);
        }
      }
    }
  };

  // Add space diagonals (very thin)
  addSpaceDiagonals(layer1Vertices, 0.0025);
  addSpaceDiagonals(layer2Vertices, 0.002);
  addSpaceDiagonals(layer3Vertices, 0.0018);
  addSpaceDiagonals(innerVertices, 0.0015);

  console.log(`Added space diagonals to all 4 inner layers`);

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

  // Outer vertices (from geometry)
  const outerVertices = normalizedVertices.map((v) => [
    v[0] * layers.outer,
    v[1] * layers.outer,
    v[2] * layers.outer,
  ]);

  // 2A. ADJACENT LAYER CONNECTIONS (48 total: 12 per transition)
  // layer1 → outer
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = matchVertex(outerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.005, 0.005, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // layer2 → layer1
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...layer1Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // layer3 → layer2
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...layer3Vertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0035, 0.0035, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // inner → layer3
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(`Added 48 vertex connections between adjacent layers`);

  // 2B. CROSS-LAYER CONNECTIONS (showing deep 4D structure)
  // Connect non-adjacent layers: outer→layer2, layer1→layer3, layer2→inner

  // Outer → layer2 (skip layer1)
  for (let i = 0; i < 12; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...layer2Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0025, 0.0025, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // layer1 → layer3 (skip layer2)
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...layer1Vertices[i]);
    const end = new THREE.Vector3(...layer3Vertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  // layer2 → inner (skip layer3)
  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...layer2Vertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.0018, 0.0018, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionGroup.add(cylinderMesh);
  }

  console.log(`Added 36 cross-layer connections (outer→layer2, layer1→layer3, layer2→inner)`);

  console.log('600-cell hyperframe complete - detailed structure matching 120-cell complexity!');

  return {
    centerLines: innerIcosahedraGroup,
    centerLinesMaterial,
    curvedLines: connectionGroup,
    curvedLinesMaterial,
  };
}
