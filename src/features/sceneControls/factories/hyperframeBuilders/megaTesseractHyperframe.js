import * as THREE from "three";

export function createMegaTesseractHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log(
    "Creating TEMPORAL STELLATED CATHEDRAL - Multi-layer 5D projection with golden ratio proportions"
  );

  // Golden ratio for beautiful proportions
  const phi = (1 + Math.sqrt(5)) / 2;

  const outerSize = 0.6;
  const innerSize = 0.3;

  // MULTI-LAYER STELLATIONS at phi powers
  const stellatedSize1 = outerSize * phi; // Φ¹ = 1.618
  const stellatedSize2 = outerSize * phi * phi; // Φ² = 2.618
  const stellatedSize3 = outerSize * phi * phi * phi; // Φ³ = 4.236
  const stellatedSize4 = outerSize * phi * phi * phi * phi; // Φ⁴ = ~6.854 (sparse outermost hints)
  const radialSize = innerSize / phi; // Inner radial sphere

  // Temporal dimension offsets (5D projection)
  const temporalOffset = 0.12; // Slight offset for past/future states

  const cube1Outer = [
    [-outerSize, -outerSize, -outerSize],
    [outerSize, -outerSize, -outerSize],
    [outerSize, outerSize, -outerSize],
    [-outerSize, outerSize, -outerSize],
    [-outerSize, -outerSize, outerSize],
    [outerSize, -outerSize, outerSize],
    [outerSize, outerSize, outerSize],
    [-outerSize, outerSize, outerSize],
  ];

  const cube1Inner = [
    [-innerSize, -innerSize, -innerSize],
    [innerSize, -innerSize, -innerSize],
    [innerSize, innerSize, -innerSize],
    [-innerSize, innerSize, -innerSize],
    [-innerSize, -innerSize, innerSize],
    [innerSize, -innerSize, innerSize],
    [innerSize, innerSize, innerSize],
    [-innerSize, innerSize, innerSize],
  ];

  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationY(Math.PI / 4);

  const cube2Outer = cube1Outer.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return [vec.x, vec.y, vec.z];
  });

  const cube2Inner = cube1Inner.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return [vec.x, vec.y, vec.z];
  });

  // ARCHITECTURAL ADDITIONS: Multiple stellated layers
  const stellated1_layer1 = cube1Outer.map((v) => [
    v[0] * (stellatedSize1 / outerSize),
    v[1] * (stellatedSize1 / outerSize),
    v[2] * (stellatedSize1 / outerSize),
  ]);
  const stellated1_layer2 = cube1Outer.map((v) => [
    v[0] * (stellatedSize2 / outerSize),
    v[1] * (stellatedSize2 / outerSize),
    v[2] * (stellatedSize2 / outerSize),
  ]);
  const stellated1_layer3 = cube1Outer.map((v) => [
    v[0] * (stellatedSize3 / outerSize),
    v[1] * (stellatedSize3 / outerSize),
    v[2] * (stellatedSize3 / outerSize),
  ]);

  const stellated2_layer1 = cube2Outer.map((v) => [
    v[0] * (stellatedSize1 / outerSize),
    v[1] * (stellatedSize1 / outerSize),
    v[2] * (stellatedSize1 / outerSize),
  ]);
  const stellated2_layer2 = cube2Outer.map((v) => [
    v[0] * (stellatedSize2 / outerSize),
    v[1] * (stellatedSize2 / outerSize),
    v[2] * (stellatedSize2 / outerSize),
  ]);
  const stellated2_layer3 = cube2Outer.map((v) => [
    v[0] * (stellatedSize3 / outerSize),
    v[1] * (stellatedSize3 / outerSize),
    v[2] * (stellatedSize3 / outerSize),
  ]);

  // 5D TEMPORAL PROJECTION: Create past/present/future states
  const createTemporalState = (vertices, offset) => {
    return vertices.map((v) => [v[0] + offset, v[1], v[2]]);
  };

  const stellated1_past = createTemporalState(
    stellated1_layer1,
    -temporalOffset
  );
  const stellated1_future = createTemporalState(
    stellated1_layer1,
    temporalOffset
  );
  const stellated2_past = createTemporalState(
    stellated2_layer1,
    -temporalOffset
  );
  const stellated2_future = createTemporalState(
    stellated2_layer1,
    temporalOffset
  );

  // Radial core sphere - dual tesseract centers
  const radialCore = [
    ...cube1Inner.map((v) => [
      v[0] * (radialSize / innerSize),
      v[1] * (radialSize / innerSize),
      v[2] * (radialSize / innerSize),
    ]),
    ...cube2Inner.map((v) => [
      v[0] * (radialSize / innerSize),
      v[1] * (radialSize / innerSize),
      v[2] * (radialSize / innerSize),
    ]),
  ];

  // GRADIENT COLOR SYSTEM
  const createGradientMaterial = (baseColor, opacity, brightness = 1.0) => {
    const color = new THREE.Color(baseColor);
    color.multiplyScalar(brightness);
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });
  };

  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerCubesGroup = new THREE.Group();

  const cubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube1Inner[i]);
    const end = new THREE.Vector3(...cube1Inner[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0016,
      0.0016,
      distance,
      8
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube2Inner[i]);
    const end = new THREE.Vector3(...cube2Inner[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0016,
      0.0016,
      distance,
      8
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  // === NEW: ROTATED INNER CUBE LAYERS (break flat top/bottom symmetry) ===
  const rotX = new THREE.Matrix4().makeRotationX(Math.PI / 6);
  const rotZ = new THREE.Matrix4().makeRotationZ(Math.PI / 6);
  const scaleFactor = 0.85; // Slightly smaller to avoid z-fighting

  // First tesseract rotated inner sets
  const cube1InnerXRot = cube1Inner.map((v) => {
    const vec = new THREE.Vector3(
      v[0] * scaleFactor,
      v[1] * scaleFactor,
      v[2] * scaleFactor
    );
    vec.applyMatrix4(rotX);
    return [vec.x, vec.y, vec.z];
  });
  const cube1InnerZRot = cube1Inner.map((v) => {
    const vec = new THREE.Vector3(
      v[0] * scaleFactor,
      v[1] * scaleFactor,
      v[2] * scaleFactor
    );
    vec.applyMatrix4(rotZ);
    return [vec.x, vec.y, vec.z];
  });

  // Second tesseract rotated inner sets (apply base Y-rotation first)
  const cube2InnerXRot = cube1Inner.map((v) => {
    const vec = new THREE.Vector3(
      v[0] * scaleFactor,
      v[1] * scaleFactor,
      v[2] * scaleFactor
    );
    vec.applyMatrix4(rotationMatrix).applyMatrix4(rotX);
    return [vec.x, vec.y, vec.z];
  });
  const cube2InnerZRot = cube1Inner.map((v) => {
    const vec = new THREE.Vector3(
      v[0] * scaleFactor,
      v[1] * scaleFactor,
      v[2] * scaleFactor
    );
    vec.applyMatrix4(rotationMatrix).applyMatrix4(rotZ);
    return [vec.x, vec.y, vec.z];
  });

  const rotatedWireframeMaterial = new THREE.MeshBasicMaterial({
    color: centerLinesMaterial.color,
    transparent: true,
    opacity: 0.85,
  });

  // Helper to add wireframe edges for a given cube vertex set
  const addCubeWireframe = (verts, radius = 0.0035) => {
    cubeEdges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...verts[i]);
      const end = new THREE.Vector3(...verts[j]);
      const distance = start.distanceTo(end);
      const cyl = new THREE.CylinderGeometry(radius, radius, distance, 8);
      const mesh = new THREE.Mesh(cyl, rotatedWireframeMaterial);
      mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      mesh.lookAt(end);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    });
  };

  // Add the rotated inner wireframes
  addCubeWireframe(cube1InnerXRot);
  addCubeWireframe(cube1InnerZRot);
  addCubeWireframe(cube2InnerXRot);
  addCubeWireframe(cube2InnerZRot);

  // INTRICATE INNER-CUBE CONNECTIONS - Rich cross-connections between the two cubes
  console.log("Creating intricate inner-cube cross-connections...");

  // 1. Face diagonals on each inner cube
  const faceDiagonals = [
    [0, 2],
    [1, 3], // Bottom face diagonals
    [4, 6],
    [5, 7], // Top face diagonals
    [0, 5],
    [1, 4], // Front face diagonals
    [2, 7],
    [3, 6], // Back face diagonals
    [0, 7],
    [3, 4], // Left face diagonals
    [1, 6],
    [2, 5], // Right face diagonals
  ];

  const faceDiagonalMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: true,
    opacity: 0.6,
  });

  faceDiagonals.forEach(([i, j]) => {
    // First cube face diagonals
    const start1 = new THREE.Vector3(...cube1Inner[i]);
    const end1 = new THREE.Vector3(...cube1Inner[j]);
    const dist1 = start1.distanceTo(end1);
    const cyl1 = new THREE.CylinderGeometry(0.0008, 0.0008, dist1, 6);
    const mesh1 = new THREE.Mesh(cyl1, faceDiagonalMaterial);
    mesh1.position.copy(start1.clone().add(end1).multiplyScalar(0.5));
    mesh1.lookAt(end1);
    mesh1.rotateX(Math.PI / 2);
    innerCubesGroup.add(mesh1);

    // Second cube face diagonals
    const start2 = new THREE.Vector3(...cube2Inner[i]);
    const end2 = new THREE.Vector3(...cube2Inner[j]);
    const dist2 = start2.distanceTo(end2);
    const cyl2 = new THREE.CylinderGeometry(0.0008, 0.0008, dist2, 6);
    const mesh2 = new THREE.Mesh(cyl2, faceDiagonalMaterial);
    mesh2.position.copy(start2.clone().add(end2).multiplyScalar(0.5));
    mesh2.lookAt(end2);
    mesh2.rotateX(Math.PI / 2);
    innerCubesGroup.add(mesh2);
  });

  // 2. Space diagonals (corner to opposite corner) through cube center
  const spaceDiagonals = [
    [0, 6],
    [1, 7],
    [2, 4],
    [3, 5],
  ];

  const spaceDiagonalMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: true,
    opacity: 0.8,
  });

  spaceDiagonals.forEach(([i, j]) => {
    // First cube space diagonals
    const start1 = new THREE.Vector3(...cube1Inner[i]);
    const end1 = new THREE.Vector3(...cube1Inner[j]);
    const dist1 = start1.distanceTo(end1);
    const cyl1 = new THREE.CylinderGeometry(0.0012, 0.0012, dist1, 8);
    const mesh1 = new THREE.Mesh(cyl1, spaceDiagonalMaterial);
    mesh1.position.copy(start1.clone().add(end1).multiplyScalar(0.5));
    mesh1.lookAt(end1);
    mesh1.rotateX(Math.PI / 2);
    innerCubesGroup.add(mesh1);

    // Second cube space diagonals
    const start2 = new THREE.Vector3(...cube2Inner[i]);
    const end2 = new THREE.Vector3(...cube2Inner[j]);
    const dist2 = start2.distanceTo(end2);
    const cyl2 = new THREE.CylinderGeometry(0.0012, 0.0012, dist2, 8);
    const mesh2 = new THREE.Mesh(cyl2, spaceDiagonalMaterial);
    mesh2.position.copy(start2.clone().add(end2).multiplyScalar(0.5));
    mesh2.lookAt(end2);
    mesh2.rotateX(Math.PI / 2);
    innerCubesGroup.add(mesh2);
  });

  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const connectionsGroup = new THREE.Group();

  // === SYSTEMATIC VERTEX-TO-INNER CONNECTIONS (like icosahedron) ===
  // The mega tesseract has 4 separate tesseracts, each with its own outer→inner connections
  // We need to define the 4 sets of outer and inner cubes based on the actual geometry

  // INNER PAIR (smaller tesseracts)
  const innerPairOuterSize = 0.75 / 2; // Half-size for outer cube
  const innerPairInnerSize = 0.375 / 2; // Half-size for inner cube

  // OUTER PAIR (larger tesseracts)
  const outerPairOuterSize = 2.0 / 2; // Half-size for outer cube
  const outerPairInnerSize = 1.5 / 2; // Half-size for inner cube

  // Helper to create cube corner positions
  const makeCubeCorners = (halfSize) => [
    [-halfSize, -halfSize, -halfSize],
    [halfSize, -halfSize, -halfSize],
    [halfSize, halfSize, -halfSize],
    [-halfSize, halfSize, -halfSize],
    [-halfSize, -halfSize, halfSize],
    [halfSize, -halfSize, halfSize],
    [halfSize, halfSize, halfSize],
    [-halfSize, halfSize, halfSize],
  ];

  // Tesseract 1: no rotation
  const tess1Outer = makeCubeCorners(innerPairOuterSize);
  const tess1Inner = makeCubeCorners(innerPairInnerSize);

  // Tesseract 2: rotated 45° on Y
  const rot45 = new THREE.Matrix4().makeRotationY(Math.PI / 4);
  const tess2Outer = makeCubeCorners(innerPairOuterSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot45);
    return [vec.x, vec.y, vec.z];
  });
  const tess2Inner = makeCubeCorners(innerPairInnerSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot45);
    return [vec.x, vec.y, vec.z];
  });

  // Tesseract 3: rotated π/8 on Y (larger)
  const rot22_5 = new THREE.Matrix4().makeRotationY(Math.PI / 8);
  const tess3Outer = makeCubeCorners(outerPairOuterSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot22_5);
    return [vec.x, vec.y, vec.z];
  });
  const tess3Inner = makeCubeCorners(outerPairInnerSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot22_5);
    return [vec.x, vec.y, vec.z];
  });

  // Tesseract 4: rotated π/8 + π/4 on Y (larger)
  const rot67_5 = new THREE.Matrix4().makeRotationY(Math.PI / 8 + Math.PI / 4);
  const tess4Outer = makeCubeCorners(outerPairOuterSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot67_5);
    return [vec.x, vec.y, vec.z];
  });
  const tess4Inner = makeCubeCorners(outerPairInnerSize).map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rot67_5);
    return [vec.x, vec.y, vec.z];
  });

  console.log(
    "Creating systematic outer→inner vertex connections for all 4 tesseracts..."
  );

  // Connect each tesseract's outer vertices to its own inner vertices
  const connectTesseract = (outerVerts, innerVerts, radius = 0.003) => {
    for (let i = 0; i < 8; i++) {
      const outerVert = new THREE.Vector3(...outerVerts[i]);
      const innerVert = new THREE.Vector3(...innerVerts[i]);
      const distance = outerVert.distanceTo(innerVert);

      const cylinderGeom = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        6
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
      cylinderMesh.position.copy(
        outerVert.clone().add(innerVert).multiplyScalar(0.5)
      );
      cylinderMesh.lookAt(innerVert);
      cylinderMesh.rotateX(Math.PI / 2);
      connectionsGroup.add(cylinderMesh);
    }
  };

  // Connect all 4 tesseracts
  connectTesseract(tess1Outer, tess1Inner);
  connectTesseract(tess2Outer, tess2Inner);
  connectTesseract(tess3Outer, tess3Inner);
  connectTesseract(tess4Outer, tess4Inner);

  // === NEW: NON-PLANAR BELTS FROM EDGE MIDPOINTS (weave to remove flat silhouette) ===
  const beltMaterial = createGradientMaterial(hyperframeLineColor, 0.55, 0.85);
  const computeEdgeMidpoints = (verts) => {
    const mids = [];
    for (const [a, b] of cubeEdges) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      mids.push(v1.clone().add(v2).multiplyScalar(0.5));
    }
    return mids;
  };

  const mids1 = computeEdgeMidpoints(cube1Inner);
  const mids2 = computeEdgeMidpoints(cube2Inner);

  const sortByAngle = (arr) =>
    arr
      .map((v) => ({ v, angle: Math.atan2(v.z, v.x) }))
      .sort((a, b) => a.angle - b.angle)
      .map((o) => o.v);

  const weaveConnect = (points, radius = 0.0012, mat = beltMaterial) => {
    const ordered = sortByAngle(points);
    for (let i = 0; i < ordered.length; i++) {
      const a = ordered[i];
      const b = ordered[(i + 1) % ordered.length];
      const dist = a.distanceTo(b);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 5);
      const mesh = new THREE.Mesh(cyl, mat);
      mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
      mesh.lookAt(b);
      mesh.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh);

      // Cross weave to opposite point to avoid planar look
      const c = ordered[(i + Math.floor(ordered.length / 2)) % ordered.length];
      const dist2 = a.distanceTo(c);
      const cyl2 = new THREE.CylinderGeometry(
        radius * 0.9,
        radius * 0.9,
        dist2,
        5
      );
      const mesh2 = new THREE.Mesh(cyl2, mat);
      mesh2.position.copy(a.clone().add(c).multiplyScalar(0.5));
      mesh2.lookAt(c);
      mesh2.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh2);
    }
  };

  weaveConnect(mids1);
  weaveConnect(mids2);

  // NEW: OUTER WEAVE BELTS on Φ² shell mid-edges to increase exterior structure
  const computeEdgeMidpointsFromCorners = (cornerVerts) => {
    const mids = [];
    for (const [a, b] of cubeEdges) {
      const v1 = new THREE.Vector3(...cornerVerts[a]);
      const v2 = new THREE.Vector3(...cornerVerts[b]);
      mids.push(v1.clone().add(v2).multiplyScalar(0.5));
    }
    return mids;
  };
  const outerMids1 = computeEdgeMidpointsFromCorners(stellated1_layer2);
  const outerMids2 = computeEdgeMidpointsFromCorners(stellated2_layer2);
  // Slightly brighter belt to be visible outside, modest radius
  const outerBeltMaterial = createGradientMaterial(
    hyperframeLineColor,
    0.6,
    0.95
  );
  weaveConnect(outerMids1, 0.0013, outerBeltMaterial);
  weaveConnect(outerMids2, 0.0013, outerBeltMaterial);

  // === MULTI-LAYER STELLATED CATHEDRAL ===

  // 1. STELLATED PROJECTIONS - Multi-layer with gradient brightness
  console.log("Adding multi-layer stellated radial projections...");

  // Layer 1 (Φ¹) - Brightest
  const layer1Material = createGradientMaterial(hyperframeLineColor, 1.0, 1.0);
  for (let i = 0; i < 8; i++) {
    const core = new THREE.Vector3(...radialCore[i]);
    const stellar = new THREE.Vector3(...stellated1_layer1[i]);
    const distance = core.distanceTo(stellar);
    const cylinderGeom = new THREE.CylinderGeometry(
      0.0024,
      0.0024,
      distance,
      4
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, layer1Material);
    cylinderMesh.position.copy(core.clone().add(stellar).multiplyScalar(0.5));
    cylinderMesh.lookAt(stellar);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  }

  // Layer 2 (Φ²) - Medium brightness
  const layer2Material = createGradientMaterial(hyperframeLineColor, 0.8, 0.85);
  for (let i = 0; i < 8; i++) {
    const core = new THREE.Vector3(...radialCore[i]);
    const stellar = new THREE.Vector3(...stellated1_layer2[i]);
    const distance = core.distanceTo(stellar);
    const cylinderGeom = new THREE.CylinderGeometry(
      0.0018,
      0.0018,
      distance,
      4
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, layer2Material);
    cylinderMesh.position.copy(core.clone().add(stellar).multiplyScalar(0.5));
    cylinderMesh.lookAt(stellar);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  }

  // Layer 3 (Φ³) - Dimmest outer shell
  const layer3Material = createGradientMaterial(hyperframeLineColor, 0.55, 0.7);
  for (let i = 0; i < 8; i++) {
    const core = new THREE.Vector3(...radialCore[i]);
    const stellar = new THREE.Vector3(...stellated1_layer3[i]);
    const distance = core.distanceTo(stellar);
    const cylinderGeom = new THREE.CylinderGeometry(
      0.0013,
      0.0013,
      distance,
      4
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, layer3Material);
    cylinderMesh.position.copy(core.clone().add(stellar).multiplyScalar(0.5));
    cylinderMesh.lookAt(stellar);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  }

  // Second tesseract - all three layers
  for (let i = 0; i < 8; i++) {
    const inner = new THREE.Vector3(...cube2Inner[i]);

    // Layer 1
    const stellar1 = new THREE.Vector3(...stellated2_layer1[i]);
    const dist1 = inner.distanceTo(stellar1);
    const cyl1 = new THREE.CylinderGeometry(0.0024, 0.0024, dist1, 4);
    const mesh1 = new THREE.Mesh(cyl1, layer1Material);
    mesh1.position.copy(inner.clone().add(stellar1).multiplyScalar(0.5));
    mesh1.lookAt(stellar1);
    mesh1.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh1);

    // Layer 2
    const stellar2 = new THREE.Vector3(...stellated2_layer2[i]);
    const dist2 = inner.distanceTo(stellar2);
    const cyl2 = new THREE.CylinderGeometry(0.0018, 0.0018, dist2, 4);
    const mesh2 = new THREE.Mesh(cyl2, layer2Material);
    mesh2.position.copy(inner.clone().add(stellar2).multiplyScalar(0.5));
    mesh2.lookAt(stellar2);
    mesh2.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh2);

    // Layer 3
    const stellar3 = new THREE.Vector3(...stellated2_layer3[i]);
    const dist3 = inner.distanceTo(stellar3);
    const cyl3 = new THREE.CylinderGeometry(0.0013, 0.0013, dist3, 4);
    const mesh3 = new THREE.Mesh(cyl3, layer3Material);
    mesh3.position.copy(inner.clone().add(stellar3).multiplyScalar(0.5));
    mesh3.lookAt(stellar3);
    mesh3.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh3);
  }

  // 1B. 5D TEMPORAL PROJECTION - Ghost trails showing past/future states
  console.log("Adding 5D temporal dimension trails...");
  const temporalMaterial = createGradientMaterial(
    hyperframeLineColor,
    0.3,
    0.6
  );

  for (let i = 0; i < 8; i++) {
    // Connect present → past
    const present = new THREE.Vector3(...stellated1_layer1[i]);
    const past = new THREE.Vector3(...stellated1_past[i]);
    const distPast = present.distanceTo(past);
    const cylPast = new THREE.CylinderGeometry(0.0008, 0.0008, distPast, 3);
    const meshPast = new THREE.Mesh(cylPast, temporalMaterial);
    meshPast.position.copy(present.clone().add(past).multiplyScalar(0.5));
    meshPast.lookAt(past);
    meshPast.rotateX(Math.PI / 2);
    connectionsGroup.add(meshPast);

    // Connect present → future
    const future = new THREE.Vector3(...stellated1_future[i]);
    const distFuture = present.distanceTo(future);
    const cylFuture = new THREE.CylinderGeometry(0.0008, 0.0008, distFuture, 3);
    const meshFuture = new THREE.Mesh(cylFuture, temporalMaterial);
    meshFuture.position.copy(present.clone().add(future).multiplyScalar(0.5));
    meshFuture.lookAt(future);
    meshFuture.rotateX(Math.PI / 2);
    connectionsGroup.add(meshFuture);
  }

  // 1B+. SPARSE OUTERMOST RAYS (Φ⁴) — subtle but longer reach to emphasize exterior
  const layer4Material = createGradientMaterial(hyperframeLineColor, 0.35, 0.9);
  // Build Φ⁴ layer corners by scaling outer cube corners
  const stellated1_layer4 = cube1Outer.map((v) => [
    v[0] * (stellatedSize4 / outerSize),
    v[1] * (stellatedSize4 / outerSize),
    v[2] * (stellatedSize4 / outerSize),
  ]);
  const stellated2_layer4 = cube2Outer.map((v) => [
    v[0] * (stellatedSize4 / outerSize),
    v[1] * (stellatedSize4 / outerSize),
    v[2] * (stellatedSize4 / outerSize),
  ]);

  // Connect inner cube corners out to Φ⁴ (one per corner per tesseract)
  for (let i = 0; i < 8; i++) {
    const core1 = new THREE.Vector3(...cube1Inner[i]);
    const stellar4_1 = new THREE.Vector3(...stellated1_layer4[i]);
    const d1 = core1.distanceTo(stellar4_1);
    const c1 = new THREE.CylinderGeometry(0.001, 0.001, d1, 4);
    const m1 = new THREE.Mesh(c1, layer4Material);
    m1.position.copy(core1.clone().add(stellar4_1).multiplyScalar(0.5));
    m1.lookAt(stellar4_1);
    m1.rotateX(Math.PI / 2);
    connectionsGroup.add(m1);

    const core2 = new THREE.Vector3(...cube2Inner[i]);
    const stellar4_2 = new THREE.Vector3(...stellated2_layer4[i]);
    const d2 = core2.distanceTo(stellar4_2);
    const c2 = new THREE.CylinderGeometry(0.001, 0.001, d2, 4);
    const m2 = new THREE.Mesh(c2, layer4Material);
    m2.position.copy(core2.clone().add(stellar4_2).multiplyScalar(0.5));
    m2.lookAt(stellar4_2);
    m2.rotateX(Math.PI / 2);
    connectionsGroup.add(m2);
  }

  // Second tesseract temporal trails
  for (let i = 0; i < 8; i++) {
    const present = new THREE.Vector3(...stellated2_layer1[i]);
    const past = new THREE.Vector3(...stellated2_past[i]);
    const future = new THREE.Vector3(...stellated2_future[i]);

    const distPast = present.distanceTo(past);
    const cylPast = new THREE.CylinderGeometry(0.0008, 0.0008, distPast, 3);
    const meshPast = new THREE.Mesh(cylPast, temporalMaterial);
    meshPast.position.copy(present.clone().add(past).multiplyScalar(0.5));
    meshPast.lookAt(past);
    meshPast.rotateX(Math.PI / 2);
    connectionsGroup.add(meshPast);

    const distFuture = present.distanceTo(future);
    const cylFuture = new THREE.CylinderGeometry(0.0008, 0.0008, distFuture, 3);
    const meshFuture = new THREE.Mesh(cylFuture, temporalMaterial);
    meshFuture.position.copy(present.clone().add(future).multiplyScalar(0.5));
    meshFuture.lookAt(future);
    meshFuture.rotateX(Math.PI / 2);
    connectionsGroup.add(meshFuture);
  }

  // 1C. STELLATED LAYER EDGES - Connect vertices within each phi shell
  console.log("Creating stellated layer edge frameworks...");
  const stellatedEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // bottom square
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // top square
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // vertical edges
  ];

  // Helper to add face diagonals for a cube-like shell (using cube indexing)
  const addFaceDiagonalsOnShell = (verts, material, radius = 0.0009) => {
    const faceDiagPairs = [
      [0, 2],
      [1, 3], // bottom face
      [4, 6],
      [5, 7], // top face
      [0, 5],
      [1, 4], // front
      [2, 7],
      [3, 6], // back
      [0, 7],
      [3, 4], // left
      [1, 6],
      [2, 5], // right
    ];
    for (const [a, b] of faceDiagPairs) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 3);
      const mesh = new THREE.Mesh(cyl, material);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh);
    }
  };

  // Layer 1 edges (brightest outer shell)
  for (const [a, b] of stellatedEdges) {
    const v1 = new THREE.Vector3(...stellated1_layer1[a]);
    const v2 = new THREE.Vector3(...stellated1_layer1[b]);
    const dist = v1.distanceTo(v2);
    const cyl = new THREE.CylinderGeometry(0.0008, 0.0008, dist, 3);
    const mesh = new THREE.Mesh(cyl, layer1Material);
    mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
    mesh.lookAt(v2);
    mesh.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh);
  }

  // Layer 2 edges (medium shell)
  for (const [a, b] of stellatedEdges) {
    const v1 = new THREE.Vector3(...stellated1_layer2[a]);
    const v2 = new THREE.Vector3(...stellated1_layer2[b]);
    const dist = v1.distanceTo(v2);
    const cyl = new THREE.CylinderGeometry(0.0006, 0.0006, dist, 3);
    const mesh = new THREE.Mesh(cyl, layer2Material);
    mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
    mesh.lookAt(v2);
    mesh.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh);
  }

  // NEW: add face diagonals on Layer 2 to strengthen outer shell presence
  addFaceDiagonalsOnShell(stellated1_layer2, layer2Material, 0.0011);

  // Layer 3 edges (dimmest outer shell)
  for (const [a, b] of stellatedEdges) {
    const v1 = new THREE.Vector3(...stellated1_layer3[a]);
    const v2 = new THREE.Vector3(...stellated1_layer3[b]);
    const dist = v1.distanceTo(v2);
    const cyl = new THREE.CylinderGeometry(0.0005, 0.0005, dist, 3);
    const mesh = new THREE.Mesh(cyl, layer3Material);
    mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
    mesh.lookAt(v2);
    mesh.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh);
  }

  // Second tesseract layer edges
  for (const [a, b] of stellatedEdges) {
    // Layer 1
    const v1_1 = new THREE.Vector3(...stellated2_layer1[a]);
    const v2_1 = new THREE.Vector3(...stellated2_layer1[b]);
    const dist1 = v1_1.distanceTo(v2_1);
    const cyl1 = new THREE.CylinderGeometry(0.0008, 0.0008, dist1, 3);
    const mesh1 = new THREE.Mesh(cyl1, layer1Material);
    mesh1.position.copy(v1_1.clone().add(v2_1).multiplyScalar(0.5));
    mesh1.lookAt(v2_1);
    mesh1.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh1);

    // Layer 2
    const v1_2 = new THREE.Vector3(...stellated2_layer2[a]);
    const v2_2 = new THREE.Vector3(...stellated2_layer2[b]);
    const dist2 = v1_2.distanceTo(v2_2);
    const cyl2 = new THREE.CylinderGeometry(0.0006, 0.0006, dist2, 3);
    const mesh2 = new THREE.Mesh(cyl2, layer2Material);
    mesh2.position.copy(v1_2.clone().add(v2_2).multiplyScalar(0.5));
    mesh2.lookAt(v2_2);
    mesh2.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh2);

    // Layer 3
    const v1_3 = new THREE.Vector3(...stellated2_layer3[a]);
    const v2_3 = new THREE.Vector3(...stellated2_layer3[b]);
    const dist3 = v1_3.distanceTo(v2_3);
    const cyl3 = new THREE.CylinderGeometry(0.0005, 0.0005, dist3, 3);
    const mesh3 = new THREE.Mesh(cyl3, layer3Material);
    mesh3.position.copy(v1_3.clone().add(v2_3).multiplyScalar(0.5));
    mesh3.lookAt(v2_3);
    mesh3.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh3);
  }

  // Add face diagonals on Layer 2 for the second tesseract as well
  addFaceDiagonalsOnShell(stellated2_layer2, layer2Material, 0.0011);

  // 1D. CROSS-LAYER DIAGONAL RAYS - Connect between phi shells for depth
  console.log("Adding cross-layer diagonal connections through phi-space...");
  const crossLayerMaterial = createGradientMaterial(
    hyperframeLineColor,
    0.5,
    0.8
  );

  for (let i = 0; i < 8; i++) {
    // First tesseract: Layer 1 → Layer 2
    const l1_l2_start = new THREE.Vector3(...stellated1_layer1[i]);
    const l1_l2_end = new THREE.Vector3(...stellated1_layer2[i]);
    const dist1_2 = l1_l2_start.distanceTo(l1_l2_end);
    const cyl1_2 = new THREE.CylinderGeometry(0.0006, 0.0006, dist1_2, 3);
    const mesh1_2 = new THREE.Mesh(cyl1_2, crossLayerMaterial);
    mesh1_2.position.copy(
      l1_l2_start.clone().add(l1_l2_end).multiplyScalar(0.5)
    );
    mesh1_2.lookAt(l1_l2_end);
    mesh1_2.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh1_2);

    // First tesseract: Layer 2 → Layer 3
    const l2_l3_start = new THREE.Vector3(...stellated1_layer2[i]);
    const l2_l3_end = new THREE.Vector3(...stellated1_layer3[i]);
    const dist2_3 = l2_l3_start.distanceTo(l2_l3_end);
    const cyl2_3 = new THREE.CylinderGeometry(0.0005, 0.0005, dist2_3, 3);
    const mesh2_3 = new THREE.Mesh(cyl2_3, crossLayerMaterial);
    mesh2_3.position.copy(
      l2_l3_start.clone().add(l2_l3_end).multiplyScalar(0.5)
    );
    mesh2_3.lookAt(l2_l3_end);
    mesh2_3.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh2_3);

    // Second tesseract: Layer 1 → Layer 2
    const s1_l2_start = new THREE.Vector3(...stellated2_layer1[i]);
    const s1_l2_end = new THREE.Vector3(...stellated2_layer2[i]);
    const s_dist1_2 = s1_l2_start.distanceTo(s1_l2_end);
    const s_cyl1_2 = new THREE.CylinderGeometry(0.0006, 0.0006, s_dist1_2, 3);
    const s_mesh1_2 = new THREE.Mesh(s_cyl1_2, crossLayerMaterial);
    s_mesh1_2.position.copy(
      s1_l2_start.clone().add(s1_l2_end).multiplyScalar(0.5)
    );
    s_mesh1_2.lookAt(s1_l2_end);
    s_mesh1_2.rotateX(Math.PI / 2);
    connectionsGroup.add(s_mesh1_2);

    // Second tesseract: Layer 2 → Layer 3
    const s2_l3_start = new THREE.Vector3(...stellated2_layer2[i]);
    const s2_l3_end = new THREE.Vector3(...stellated2_layer3[i]);
    const s_dist2_3 = s2_l3_start.distanceTo(s2_l3_end);
    const s_cyl2_3 = new THREE.CylinderGeometry(0.0005, 0.0005, s_dist2_3, 3);
    const s_mesh2_3 = new THREE.Mesh(s_cyl2_3, crossLayerMaterial);
    s_mesh2_3.position.copy(
      s2_l3_start.clone().add(s2_l3_end).multiplyScalar(0.5)
    );
    s_mesh2_3.lookAt(s2_l3_end);
    s_mesh2_3.rotateX(Math.PI / 2);
    connectionsGroup.add(s_mesh2_3);
  }

  // 1E. FACE-CENTERED STELLATIONS - 6 additional rays per tesseract from face centers
  console.log("Creating face-centered stellated spires...");

  // Calculate face centers for cube (6 faces)
  const faceCenters1 = [
    [0, 0, -innerSize], // front (-Z)
    [0, 0, innerSize], // back (+Z)
    [-innerSize, 0, 0], // left (-X)
    [innerSize, 0, 0], // right (+X)
    [0, -innerSize, 0], // bottom (-Y)
    [0, innerSize, 0], // top (+Y)
  ];

  // Rotate for second tesseract
  const faceCenters2 = faceCenters1.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return [vec.x, vec.y, vec.z];
  });

  // Create stellated projections from face centers at Layer 2 distance only (to avoid clutter)
  const faceMaterial = createGradientMaterial(hyperframeColor, 0.6, 0.9);

  for (let i = 0; i < 6; i++) {
    // First tesseract face stellations
    const center1 = new THREE.Vector3(...faceCenters1[i]);
    const stellar1 = center1.clone().normalize().multiplyScalar(stellatedSize2);
    const dist1 = center1.distanceTo(stellar1);
    const cyl1 = new THREE.CylinderGeometry(0.001, 0.001, dist1, 4);
    const mesh1 = new THREE.Mesh(cyl1, faceMaterial);
    mesh1.position.copy(center1.clone().add(stellar1).multiplyScalar(0.5));
    mesh1.lookAt(stellar1);
    mesh1.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh1);

    // Second tesseract face stellations
    const center2 = new THREE.Vector3(...faceCenters2[i]);
    const stellar2 = center2.clone().normalize().multiplyScalar(stellatedSize2);
    const dist2 = center2.distanceTo(stellar2);
    const cyl2 = new THREE.CylinderGeometry(0.001, 0.001, dist2, 4);
    const mesh2 = new THREE.Mesh(cyl2, faceMaterial);
    mesh2.position.copy(center2.clone().add(stellar2).multiplyScalar(0.5));
    mesh2.lookAt(stellar2);
    mesh2.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh2);
  }

  // 2. RADIAL CORE SPHERE - Central sunburst with bright gradient
  console.log("Creating radial core structure...");
  for (let i = 0; i < radialCore.length; i++) {
    for (let j = i + 1; j < radialCore.length; j++) {
      const v1 = new THREE.Vector3(...radialCore[i]);
      const v2 = new THREE.Vector3(...radialCore[j]);
      const distance = v1.distanceTo(v2);

      const cylinderGeom = new THREE.CylinderGeometry(
        0.002,
        0.002,
        distance,
        4
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
      cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      cylinderMesh.lookAt(v2);
      cylinderMesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(cylinderMesh);
    }
  }

  // 2B. CORE AUGMENTATION (subtle, non-planar) — add rotated tiny cores and spokes
  // Create two tiny rotated cores (X and Z rotations) for each tesseract and connect lightly
  const tinyFactor = (radialSize * 0.7) / innerSize; // smaller than radial core

  const makeTransformed = (baseVerts, transforms) =>
    baseVerts.map((v) => {
      const vec = new THREE.Vector3(
        v[0] * tinyFactor,
        v[1] * tinyFactor,
        v[2] * tinyFactor
      );
      transforms.forEach((m) => vec.applyMatrix4(m));
      return [vec.x, vec.y, vec.z];
    });

  const tinyCore1_X = makeTransformed(cube1Inner, [rotX]);
  const tinyCore1_Z = makeTransformed(cube1Inner, [rotZ]);
  const tinyCore2_X = makeTransformed(cube1Inner, [rotationMatrix, rotX]);
  const tinyCore2_Z = makeTransformed(cube1Inner, [rotationMatrix, rotZ]);

  // Slightly brighter accent for tiny core edges
  const coreAccentColor = new THREE.Color(
    centerLinesMaterial.color
  ).multiplyScalar(1.05);
  const coreAccentMaterial = new THREE.MeshBasicMaterial({
    color: coreAccentColor,
    transparent: true,
    opacity: 0.95,
  });

  const addTinyCoreEdges = (verts, radius = 0.0025) => {
    for (const [a, b] of cubeEdges) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, coreAccentMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  };

  // Add tiny rotated cores (light touch)
  addTinyCoreEdges(tinyCore1_X);
  addTinyCoreEdges(tinyCore1_Z);
  addTinyCoreEdges(tinyCore2_X);
  addTinyCoreEdges(tinyCore2_Z);

  // Spokes: from radial core points to nearest tiny core vertices (2 nearest per point)
  const allTiny = [
    ...tinyCore1_X,
    ...tinyCore1_Z,
    ...tinyCore2_X,
    ...tinyCore2_Z,
  ];
  const spokeMaterial = new THREE.MeshBasicMaterial({
    color: coreAccentColor,
    transparent: true,
    opacity: 0.7,
  });

  for (let i = 0; i < radialCore.length; i++) {
    const r = new THREE.Vector3(...radialCore[i]);
    const sorted = allTiny
      .map((p) => new THREE.Vector3(...p))
      .map((p) => ({ p, d: r.distanceTo(p) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { p, d } of sorted) {
      const cyl = new THREE.CylinderGeometry(0.0012, 0.0012, d, 6);
      const mesh = new THREE.Mesh(cyl, spokeMaterial);
      mesh.position.copy(r.clone().add(p).multiplyScalar(0.5));
      mesh.lookAt(p);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  }

  // 2C. MINI TESSERACT CORE (explicit small tesseract inside each main tesseract)
  // Build a smaller tesseract (outer cube + inner cube + 8 connections) as the red hyperframe core
  const miniOuter = innerSize * 0.66; // Outer half-size of the mini tesseract
  const miniInner = miniOuter * 0.5; // Inner half-size of the mini tesseract

  const makeMiniCubeCorners = (half) => [
    [-half, -half, -half],
    [half, -half, -half],
    [half, half, -half],
    [-half, half, -half],
    [-half, -half, half],
    [half, -half, half],
    [half, half, half],
    [-half, half, half],
  ];

  // First tesseract mini core (aligned with axes)
  const mini1Outer = makeMiniCubeCorners(miniOuter);
  const mini1Inner = makeMiniCubeCorners(miniInner);

  // Second tesseract mini core (merge vertically and horizontally): rotate about X and Z by 45°
  const rotX45 = new THREE.Matrix4().makeRotationX(Math.PI / 4);
  const rotZ45 = new THREE.Matrix4().makeRotationZ(Math.PI / 4);
  const mini2Outer = mini1Outer.map((v) => {
    const vec = new THREE.Vector3(...v)
      .applyMatrix4(rotX45)
      .applyMatrix4(rotZ45);
    return [vec.x, vec.y, vec.z];
  });
  const mini2Inner = mini1Inner.map((v) => {
    const vec = new THREE.Vector3(...v)
      .applyMatrix4(rotX45)
      .applyMatrix4(rotZ45);
    return [vec.x, vec.y, vec.z];
  });

  // Helper to add cube edges with centerLinesMaterial (red)
  const addCubeEdges = (verts, radius = 0.003) => {
    for (const [a, b] of cubeEdges) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  };

  // Helper to add mini tesseract connections (outer→inner, 8 edges)
  const addTesseractConnections = (outerVerts, innerVerts, radius = 0.0025) => {
    for (let i = 0; i < 8; i++) {
      const vOuter = new THREE.Vector3(...outerVerts[i]);
      const vInner = new THREE.Vector3(...innerVerts[i]);
      const dist = vOuter.distanceTo(vInner);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 6);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(vOuter.clone().add(vInner).multiplyScalar(0.5));
      mesh.lookAt(vInner);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  };

  // Helper to add space diagonals within the mini inner cube
  const addSpaceDiagonals = (verts, radius = 0.0022) => {
    const pairs = [
      [0, 6],
      [1, 7],
      [2, 4],
      [3, 5],
    ];
    for (const [a, b] of pairs) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 7);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  };

  // Helper to add face diagonals within the mini inner cube
  const addFaceDiagonalsMini = (verts, radius = 0.0018) => {
    const facePairs = [
      // Bottom face (y-)
      [0, 2],
      [1, 3],
      // Top face (y+)
      [4, 6],
      [5, 7],
      // Front face (z+)
      [4, 5],
      [6, 7],
      // Back face (z-)
      [0, 1],
      [2, 3],
      // Left face (x-)
      [0, 4],
      [3, 7],
      // Right face (x+)
      [1, 5],
      [2, 6],
    ];
    for (const [a, b] of facePairs) {
      const v1 = new THREE.Vector3(...verts[a]);
      const v2 = new THREE.Vector3(...verts[b]);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 6);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(mesh);
    }
  };

  // Build mini tesseracts (red core)
  addCubeEdges(mini1Outer);
  addCubeEdges(mini1Inner);
  addTesseractConnections(mini1Outer, mini1Inner);
  addSpaceDiagonals(mini1Inner);
  addFaceDiagonalsMini(mini1Inner);

  addCubeEdges(mini2Outer);
  addCubeEdges(mini2Inner);
  addTesseractConnections(mini2Outer, mini2Inner);
  addSpaceDiagonals(mini2Inner);
  addFaceDiagonalsMini(mini2Inner);

  // Connect mini tesseract outer corners to the inner corners of the larger tesseract (green)
  const connectMiniToInner = (miniOuterVerts, innerVerts, radius = 0.0016) => {
    for (let i = 0; i < 8; i++) {
      const a = new THREE.Vector3(...miniOuterVerts[i]);
      const b = new THREE.Vector3(...innerVerts[i]);
      const dist = a.distanceTo(b);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 5);
      const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
      mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
      mesh.lookAt(b);
      mesh.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh);
    }
  };

  connectMiniToInner(mini1Outer, cube1Inner);
  connectMiniToInner(mini2Outer, cube2Inner);

  // 3. INTER-TESSERACT BRIDGES - Connect where they interpenetrate
  console.log("Creating inter-tesseract bridging arcs...");
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const v1 = new THREE.Vector3(...cube1Inner[i]);
      const v2 = new THREE.Vector3(...cube2Inner[j]);
      const distance = v1.distanceTo(v2);

      // Only connect nearby cross-tesseract vertices
      if (distance < 0.7 && distance > 0.1) {
        const cylinderGeom = new THREE.CylinderGeometry(
          0.0025,
          0.0025,
          distance,
          5
        );
        const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);
        innerCubesGroup.add(cylinderMesh);
      }
    }
  }

  // === NEW: OUTER→ROTATED INNER MULTI-CONNECTIONS (star web, non-axis aligned) ===
  const connectOuterToNearest = (
    outers,
    inners,
    count = 3,
    radius = 0.0012
  ) => {
    for (let i = 0; i < outers.length; i++) {
      const o = new THREE.Vector3(...outers[i]);
      // compute nearest inner vertices
      const sorted = inners
        .map((p) => new THREE.Vector3(...p))
        .map((p) => ({ p, d: o.distanceTo(p) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, count);
      for (const { p, d } of sorted) {
        const cyl = new THREE.CylinderGeometry(radius, radius, d, 5);
        const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
        mesh.position.copy(o.clone().add(p).multiplyScalar(0.5));
        mesh.lookAt(p);
        mesh.rotateX(Math.PI / 2);
        connectionsGroup.add(mesh);
      }
    }
  };

  // Connect each outer corner to nearest few vertices from the rotated inner sets
  connectOuterToNearest(cube1Outer, cube1InnerXRot);
  connectOuterToNearest(cube1Outer, cube1InnerZRot);
  connectOuterToNearest(cube2Outer, cube2InnerXRot);
  connectOuterToNearest(cube2Outer, cube2InnerZRot);

  // 4. INVERTED HYPERFRAME CONNECTIONS - Pull from outer stellations back to inner structure
  console.log("Creating inverted hyperframe pulls (stellated → inner cube)...");
  const invertedMaterial = new THREE.MeshBasicMaterial({
    color: curvedLinesMaterial.color,
    transparent: true,
    opacity: 0.7,
  });

  // Connect stellated Layer 1 vertices back to opposite inner cube vertices (creates tension)
  for (let i = 0; i < 8; i++) {
    // First tesseract: stellated layer 1 → opposite corner of inner cube
    const stellar1 = new THREE.Vector3(...stellated1_layer1[i]);
    const oppositeIndex = 7 - i; // Opposite corner (0↔7, 1↔6, 2↔5, 3↔4)
    const innerOpposite = new THREE.Vector3(...cube1Inner[oppositeIndex]);

    const dist1 = stellar1.distanceTo(innerOpposite);
    const cyl1 = new THREE.CylinderGeometry(0.0012, 0.0012, dist1, 4);
    const mesh1 = new THREE.Mesh(cyl1, invertedMaterial);
    mesh1.position.copy(
      stellar1.clone().add(innerOpposite).multiplyScalar(0.5)
    );
    mesh1.lookAt(innerOpposite);
    mesh1.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh1);

    // Second tesseract: stellated layer 1 → opposite corner of inner cube
    const stellar2 = new THREE.Vector3(...stellated2_layer1[i]);
    const innerOpposite2 = new THREE.Vector3(...cube2Inner[oppositeIndex]);

    const dist2 = stellar2.distanceTo(innerOpposite2);
    const cyl2 = new THREE.CylinderGeometry(0.0012, 0.0012, dist2, 4);
    const mesh2 = new THREE.Mesh(cyl2, invertedMaterial);
    mesh2.position.copy(
      stellar2.clone().add(innerOpposite2).multiplyScalar(0.5)
    );
    mesh2.lookAt(innerOpposite2);
    mesh2.rotateX(Math.PI / 2);
    connectionsGroup.add(mesh2);
  }

  // Connect stellated Layer 2 (mid shell) to adjacent inner cube edges (softer pull)
  const adjacentPairs = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Bottom face adjacencies
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Top face adjacencies
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // Vertical adjacencies
  ];

  const softInvertedMaterial = new THREE.MeshBasicMaterial({
    color: curvedLinesMaterial.color,
    transparent: true,
    opacity: 0.4,
  });

  for (const [a, b] of adjacentPairs) {
    // First tesseract: stellated layer 2 → adjacent inner edge midpoint
    const stellar1_a = new THREE.Vector3(...stellated1_layer2[a]);
    const inner1_b = new THREE.Vector3(...cube1Inner[b]);
    const dist1 = stellar1_a.distanceTo(inner1_b);

    if (dist1 < 4.0) {
      // Only reasonably close connections
      const cyl1 = new THREE.CylinderGeometry(0.0008, 0.0008, dist1, 3);
      const mesh1 = new THREE.Mesh(cyl1, softInvertedMaterial);
      mesh1.position.copy(stellar1_a.clone().add(inner1_b).multiplyScalar(0.5));
      mesh1.lookAt(inner1_b);
      mesh1.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh1);
    }

    // Second tesseract: stellated layer 2 → adjacent inner edge
    const stellar2_a = new THREE.Vector3(...stellated2_layer2[a]);
    const inner2_b = new THREE.Vector3(...cube2Inner[b]);
    const dist2 = stellar2_a.distanceTo(inner2_b);

    if (dist2 < 4.0) {
      const cyl2 = new THREE.CylinderGeometry(0.0008, 0.0008, dist2, 3);
      const mesh2 = new THREE.Mesh(cyl2, softInvertedMaterial);
      mesh2.position.copy(stellar2_a.clone().add(inner2_b).multiplyScalar(0.5));
      mesh2.lookAt(inner2_b);
      mesh2.rotateX(Math.PI / 2);
      connectionsGroup.add(mesh2);
    }
  }

  console.log(
    `Created DUAL TESSERACT INTRICATE HYPERFRAME:
    - 🎲 TWO interpenetrating tesseracts (45° Y-rotation) with INTRICATE inner connections
    - 🔷 Inner cube enrichment: Face diagonals (${
      faceDiagonals.length * 2
    }) + Space diagonals (${spaceDiagonals.length * 2})
    - 🌟 Multi-layer stellations: 3 shells × 2 tesseracts at Φ¹(${stellatedSize1.toFixed(
      2
    )}), Φ²(${stellatedSize2.toFixed(2)}), Φ³(${stellatedSize3.toFixed(2)})
    - ⏳ 5D temporal projection: ${
      8 * 2 * 2
    } ghost trails showing past/future states
    - 🎨 Gradient depth system: Brightness fades from core (1.0) → mid (0.7) → outer (0.5)
    - 🕸️ Stellated layer edges: ${
      12 * 3 * 2
    } cage connections forming phi-spaced shells
    - 🔀 Cross-layer diagonals: ${8 * 2 * 2} rays connecting between phi shells
    - 🌐 Face-centered stellations: ${6 * 2} spires from cube face centers
    - 🔴 Inverted hyperframe pulls: ${8 * 2} strong (L1→opposite) + ${
      adjacentPairs.length * 2
    } soft (L2→adjacent)
    - ☀️ Radial core sphere: ${
      (radialCore.length * (radialCore.length - 1)) / 2
    } dense sunburst connections (16 vertices)
    - 🌉 Inter-tesseract bridges: Dual cross-connections at interpenetration points
    - 🎯 Total cylinders: ${
      innerCubesGroup.children.length + connectionsGroup.children.length
    }
    - ✨ Effect: FOCUSED compound hyperstructure - dense inner complexity with phi-based outer layers`
  );

  return {
    centerLines: innerCubesGroup,
    centerLinesMaterial,
    curvedLines: connectionsGroup,
    curvedLinesMaterial,
  };
}
