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
  const tinySize = innerSize * 0.5; // Nested hypercube inside inner cube

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

  // 8 vertices of tiny inner cube (nested hypercube target)
  const tinyCorners = [
    [-tinySize, -tinySize, -tinySize], // 0
    [tinySize, -tinySize, -tinySize], // 1
    [tinySize, tinySize, -tinySize], // 2
    [-tinySize, tinySize, -tinySize], // 3
    [-tinySize, -tinySize, tinySize], // 4
    [tinySize, -tinySize, tinySize], // 5
    [tinySize, tinySize, tinySize], // 6
    [-tinySize, tinySize, tinySize], // 7
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
  // 1B. CREATE NESTED TINY CUBE WIREFRAME (12 edges)
  // ========================================
  const tinyCubeGroup = new THREE.Group();
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...tinyCorners[i]);
    const end = new THREE.Vector3(...tinyCorners[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    tinyCubeGroup.add(cylinderMesh);
  });
  innerCubeGroup.add(tinyCubeGroup);
  console.log(`Created nested tiny cube wireframe: 12 edges`);

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

  // ========================================
  // 2B. CREATE NESTED TESSERACT CONNECTIONS (8 edges: inner → tiny)
  // ========================================
  for (let i = 0; i < 8; i++) {
    const innerVertex = new THREE.Vector3(...innerCorners[i]);
    const tinyVertex = new THREE.Vector3(...tinyCorners[i]);
    const distance = innerVertex.distanceTo(tinyVertex);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0025,
      0.0025,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(
      innerVertex.clone().add(tinyVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(tinyVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    tesseractConnectionGroup.add(cylinderMesh);
  }
  console.log(`Created nested tesseract connections: inner → tiny (8 edges)`);

  console.log(
    `Total with nested: ` +
      `12 inner + 12 tiny + 8 outer→inner + 8 inner→tiny = 40 edges`
  );

  // ========================================
  // 3. DUPLICATE: Rotated compound hypercube merged into current
  // ========================================
  const rot = new THREE.Matrix4().makeRotationY(Math.PI / 4);
  const scale = 0.98;
  const RS = (x, y, z) =>
    new THREE.Vector3(x, y, z).applyMatrix4(rot).multiplyScalar(scale);

  const outerCornersRot = [
    RS(-outerSize, -outerSize, -outerSize),
    RS(outerSize, -outerSize, -outerSize),
    RS(outerSize, outerSize, -outerSize),
    RS(-outerSize, outerSize, -outerSize),
    RS(-outerSize, -outerSize, outerSize),
    RS(outerSize, -outerSize, outerSize),
    RS(outerSize, outerSize, outerSize),
    RS(-outerSize, outerSize, outerSize),
  ];
  const innerCornersRot = [
    RS(-innerSize, -innerSize, -innerSize),
    RS(innerSize, -innerSize, -innerSize),
    RS(innerSize, innerSize, -innerSize),
    RS(-innerSize, innerSize, -innerSize),
    RS(-innerSize, -innerSize, innerSize),
    RS(innerSize, -innerSize, innerSize),
    RS(innerSize, innerSize, innerSize),
    RS(-innerSize, innerSize, innerSize),
  ];
  const tinyCornersRot = [
    RS(-tinySize, -tinySize, -tinySize),
    RS(tinySize, -tinySize, -tinySize),
    RS(tinySize, tinySize, -tinySize),
    RS(-tinySize, tinySize, -tinySize),
    RS(-tinySize, -tinySize, tinySize),
    RS(tinySize, -tinySize, tinySize),
    RS(tinySize, tinySize, tinySize),
    RS(-tinySize, tinySize, tinySize),
  ];

  // Helper to add cube edges to innerCubeGroup using centerLinesMaterial
  const addCubeEdges = (verts, radius = 0.004) => {
    const edges = [
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
    edges.forEach(([i, j]) => {
      const v1 = verts[i];
      const v2 = verts[j];
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubeGroup.add(mesh);
    });
  };
  // Rotated inner cube edges
  addCubeEdges(innerCornersRot);
  // Rotated tiny cube edges
  addCubeEdges(tinyCornersRot, 0.003);

  // Rotated tesseract connections: outer→inner
  for (let i = 0; i < 8; i++) {
    const outerV = outerCornersRot[i];
    const innerV = innerCornersRot[i];
    const d = outerV.distanceTo(innerV);
    const cyl = new THREE.CylinderGeometry(0.003, 0.003, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(outerV.clone().add(innerV).multiplyScalar(0.5));
    mesh.lookAt(innerV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }
  // Rotated nested connections: inner→tiny
  for (let i = 0; i < 8; i++) {
    const innerV = innerCornersRot[i];
    const tinyV = tinyCornersRot[i];
    const d = innerV.distanceTo(tinyV);
    const cyl = new THREE.CylinderGeometry(0.0025, 0.0025, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(innerV.clone().add(tinyV).multiplyScalar(0.5));
    mesh.lookAt(tinyV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }

  console.log("Added rotated compound hypercube (edges + connections)");

  // ========================================
  // 3B. DUPLICATE: Symmetric -45° Y-rotated hypercube
  // ========================================
  const rotNeg = new THREE.Matrix4().makeRotationY(-Math.PI / 4);
  const scaleNeg = 0.98;
  const RSN = (x, y, z) =>
    new THREE.Vector3(x, y, z).applyMatrix4(rotNeg).multiplyScalar(scaleNeg);

  const outerCornersRotNeg = [
    RSN(-outerSize, -outerSize, -outerSize),
    RSN(outerSize, -outerSize, -outerSize),
    RSN(outerSize, outerSize, -outerSize),
    RSN(-outerSize, outerSize, -outerSize),
    RSN(-outerSize, -outerSize, outerSize),
    RSN(outerSize, -outerSize, outerSize),
    RSN(outerSize, outerSize, outerSize),
    RSN(-outerSize, outerSize, outerSize),
  ];
  const innerCornersRotNeg = [
    RSN(-innerSize, -innerSize, -innerSize),
    RSN(innerSize, -innerSize, -innerSize),
    RSN(innerSize, innerSize, -innerSize),
    RSN(-innerSize, innerSize, -innerSize),
    RSN(-innerSize, -innerSize, innerSize),
    RSN(innerSize, -innerSize, innerSize),
    RSN(innerSize, innerSize, innerSize),
    RSN(-innerSize, innerSize, innerSize),
  ];
  const tinyCornersRotNeg = [
    RSN(-tinySize, -tinySize, -tinySize),
    RSN(tinySize, -tinySize, -tinySize),
    RSN(tinySize, tinySize, -tinySize),
    RSN(-tinySize, tinySize, -tinySize),
    RSN(-tinySize, -tinySize, tinySize),
    RSN(tinySize, -tinySize, tinySize),
    RSN(tinySize, tinySize, tinySize),
    RSN(-tinySize, tinySize, tinySize),
  ];

  const addCubeEdgesNeg = (verts, radius = 0.004) => {
    const edges = [
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
    edges.forEach(([i, j]) => {
      const v1 = verts[i];
      const v2 = verts[j];
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubeGroup.add(mesh);
    });
  };

  // Rotated (-45°) inner cube edges
  addCubeEdgesNeg(innerCornersRotNeg);
  // Rotated (-45°) tiny cube edges
  addCubeEdgesNeg(tinyCornersRotNeg, 0.003);

  // Rotated (-45°) tesseract connections: outer→inner
  for (let i = 0; i < 8; i++) {
    const outerV = outerCornersRotNeg[i];
    const innerV = innerCornersRotNeg[i];
    const d = outerV.distanceTo(innerV);
    const cyl = new THREE.CylinderGeometry(0.003, 0.003, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(outerV.clone().add(innerV).multiplyScalar(0.5));
    mesh.lookAt(innerV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }

  // Rotated (-45°) nested connections: inner→tiny
  for (let i = 0; i < 8; i++) {
    const innerV = innerCornersRotNeg[i];
    const tinyV = tinyCornersRotNeg[i];
    const d = innerV.distanceTo(tinyV);
    const cyl = new THREE.CylinderGeometry(0.0025, 0.0025, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(innerV.clone().add(tinyV).multiplyScalar(0.5));
    mesh.lookAt(tinyV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }

  console.log("Added symmetric -45° rotated hypercube (edges + connections)");

  // ========================================
  // 3C. DUPLICATE: +45° X-rotated hypercube
  // ========================================
  const rotX = new THREE.Matrix4().makeRotationX(Math.PI / 4);
  const scaleX = 0.98;
  const RSX = (x, y, z) =>
    new THREE.Vector3(x, y, z).applyMatrix4(rotX).multiplyScalar(scaleX);

  const outerCornersRotX = [
    RSX(-outerSize, -outerSize, -outerSize),
    RSX(outerSize, -outerSize, -outerSize),
    RSX(outerSize, outerSize, -outerSize),
    RSX(-outerSize, outerSize, -outerSize),
    RSX(-outerSize, -outerSize, outerSize),
    RSX(outerSize, -outerSize, outerSize),
    RSX(outerSize, outerSize, outerSize),
    RSX(-outerSize, outerSize, outerSize),
  ];
  const innerCornersRotX = [
    RSX(-innerSize, -innerSize, -innerSize),
    RSX(innerSize, -innerSize, -innerSize),
    RSX(innerSize, innerSize, -innerSize),
    RSX(-innerSize, innerSize, -innerSize),
    RSX(-innerSize, -innerSize, innerSize),
    RSX(innerSize, -innerSize, innerSize),
    RSX(innerSize, innerSize, innerSize),
    RSX(-innerSize, innerSize, innerSize),
  ];
  const tinyCornersRotX = [
    RSX(-tinySize, -tinySize, -tinySize),
    RSX(tinySize, -tinySize, -tinySize),
    RSX(tinySize, tinySize, -tinySize),
    RSX(-tinySize, tinySize, -tinySize),
    RSX(-tinySize, -tinySize, tinySize),
    RSX(tinySize, -tinySize, tinySize),
    RSX(tinySize, tinySize, tinySize),
    RSX(-tinySize, tinySize, tinySize),
  ];

  const addCubeEdgesX = (verts, radius = 0.004) => {
    const edges = [
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
    edges.forEach(([i, j]) => {
      const v1 = verts[i];
      const v2 = verts[j];
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubeGroup.add(mesh);
    });
  };

  addCubeEdgesX(innerCornersRotX);
  addCubeEdgesX(tinyCornersRotX, 0.003);

  for (let i = 0; i < 8; i++) {
    const outerV = outerCornersRotX[i];
    const innerV = innerCornersRotX[i];
    const d = outerV.distanceTo(innerV);
    const cyl = new THREE.CylinderGeometry(0.003, 0.003, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(outerV.clone().add(innerV).multiplyScalar(0.5));
    mesh.lookAt(innerV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }
  for (let i = 0; i < 8; i++) {
    const innerV = innerCornersRotX[i];
    const tinyV = tinyCornersRotX[i];
    const d = innerV.distanceTo(tinyV);
    const cyl = new THREE.CylinderGeometry(0.0025, 0.0025, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(innerV.clone().add(tinyV).multiplyScalar(0.5));
    mesh.lookAt(tinyV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }

  console.log("Added +45° X rotated hypercube (edges + connections)");

  // ========================================
  // 3D. DUPLICATE: +45° Z-rotated hypercube
  // ========================================
  const rotZ = new THREE.Matrix4().makeRotationZ(Math.PI / 4);
  const scaleZ = 0.98;
  const RSZ = (x, y, z) =>
    new THREE.Vector3(x, y, z).applyMatrix4(rotZ).multiplyScalar(scaleZ);

  const outerCornersRotZ = [
    RSZ(-outerSize, -outerSize, -outerSize),
    RSZ(outerSize, -outerSize, -outerSize),
    RSZ(outerSize, outerSize, -outerSize),
    RSZ(-outerSize, outerSize, -outerSize),
    RSZ(-outerSize, -outerSize, outerSize),
    RSZ(outerSize, -outerSize, outerSize),
    RSZ(outerSize, outerSize, outerSize),
    RSZ(-outerSize, outerSize, outerSize),
  ];
  const innerCornersRotZ = [
    RSZ(-innerSize, -innerSize, -innerSize),
    RSZ(innerSize, -innerSize, -innerSize),
    RSZ(innerSize, innerSize, -innerSize),
    RSZ(-innerSize, innerSize, -innerSize),
    RSZ(-innerSize, -innerSize, innerSize),
    RSZ(innerSize, -innerSize, innerSize),
    RSZ(innerSize, innerSize, innerSize),
    RSZ(-innerSize, innerSize, innerSize),
  ];
  const tinyCornersRotZ = [
    RSZ(-tinySize, -tinySize, -tinySize),
    RSZ(tinySize, -tinySize, -tinySize),
    RSZ(tinySize, tinySize, -tinySize),
    RSZ(-tinySize, tinySize, -tinySize),
    RSZ(-tinySize, -tinySize, tinySize),
    RSZ(tinySize, -tinySize, tinySize),
    RSZ(tinySize, tinySize, tinySize),
    RSZ(-tinySize, tinySize, tinySize),
  ];

  const addCubeEdgesZ = (verts, radius = 0.004) => {
    const edges = [
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
    edges.forEach(([i, j]) => {
      const v1 = verts[i];
      const v2 = verts[j];
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.CylinderGeometry(radius, radius, dist, 8);
      const mesh = new THREE.Mesh(cyl, centerLinesMaterial);
      mesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      mesh.lookAt(v2);
      mesh.rotateX(Math.PI / 2);
      innerCubeGroup.add(mesh);
    });
  };

  addCubeEdgesZ(innerCornersRotZ);
  addCubeEdgesZ(tinyCornersRotZ, 0.003);

  for (let i = 0; i < 8; i++) {
    const outerV = outerCornersRotZ[i];
    const innerV = innerCornersRotZ[i];
    const d = outerV.distanceTo(innerV);
    const cyl = new THREE.CylinderGeometry(0.003, 0.003, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(outerV.clone().add(innerV).multiplyScalar(0.5));
    mesh.lookAt(innerV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }
  for (let i = 0; i < 8; i++) {
    const innerV = innerCornersRotZ[i];
    const tinyV = tinyCornersRotZ[i];
    const d = innerV.distanceTo(tinyV);
    const cyl = new THREE.CylinderGeometry(0.0025, 0.0025, d, 6);
    const mesh = new THREE.Mesh(cyl, curvedLinesMaterial);
    mesh.position.copy(innerV.clone().add(tinyV).multiplyScalar(0.5));
    mesh.lookAt(tinyV);
    mesh.rotateX(Math.PI / 2);
    tesseractConnectionGroup.add(mesh);
  }

  console.log("Added +45° Z rotated hypercube (edges + connections)");

  return {
    centerLines: innerCubeGroup,
    centerLinesMaterial,
    curvedLines: tesseractConnectionGroup,
    curvedLinesMaterial,
  };
}
