import * as THREE from "three";

/**
 * Create intricate compound tetrahedron wireframe with dual inner tetrahedrons and vertex connections
 * Always creates two overlapping wireframe sets for compound geometry pattern
 * @param {THREE.BufferGeometry} geometry - The compound tetrahedron geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createTetrahedronIntricateWireframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating compound tetrahedron wireframe");

  // Canonical vertices for tetrahedron (4 vertices forming a pyramid)
  // Use Three.js standard tetrahedron vertex calculation
  const a = 1.2 / Math.sqrt(3); // radius 1.2 to match geometry size

  const cmpTetrahedronOuter1 = [
    [a, a, a],
    [-a, -a, a],
    [-a, a, -a],
    [a, -a, -a],
  ];

  // Create rotated second set for compound geometry (scale inversion for dual tetrahedron)
  const cmpTetrahedronOuter2 = cmpTetrahedronOuter1.map((v) => [
    -v[0],
    -v[1],
    -v[2],
  ]);

  // Create inner tetrahedrons (scaled down)
  const innerScale = 0.5;
  const cmpTetrahedronInner1 = cmpTetrahedronOuter1.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  const cmpTetrahedronInner2 = cmpTetrahedronOuter2.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  // 1. Create inner compound tetrahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerCmpTetrahedronGroup = new THREE.Group();

  // Tetrahedron edges: connect every vertex to every other vertex (6 edges total)
  const cmpTetrahedronEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  // First compound tetrahedron inner wireframe
  cmpTetrahedronEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cmpTetrahedronInner1[i]);
    const end = new THREE.Vector3(...cmpTetrahedronInner1[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCmpTetrahedronGroup.add(cylinderMesh);
  });

  // Second compound tetrahedron inner wireframe
  cmpTetrahedronEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cmpTetrahedronInner2[i]);
    const end = new THREE.Vector3(...cmpTetrahedronInner2[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCmpTetrahedronGroup.add(cylinderMesh);
  });

  console.log(
    `Created compound tetrahedron inner wireframes with ${cmpTetrahedronEdges.length} x2 cylinder edges`
  );

  // 2. Create vertex-to-core connections using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const cmpTetrahedronConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from the merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  // Extract all vertices from merged geometry
  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
  }

  console.log(
    `Found ${actualVertices.length} vertices in compound tetrahedron`
  );

  // Match each canonical outer vertex to its closest actual vertex (nearest-vertex matching)
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

  // First compound tetrahedron connections (4 vertices)
  for (let i = 0; i < 4; i++) {
    const start = matchVertex(cmpTetrahedronOuter1[i]);
    const end = new THREE.Vector3(...cmpTetrahedronInner1[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cmpTetrahedronConnectionGroup.add(cylinderMesh);
  }

  // Second compound tetrahedron connections (4 vertices)
  for (let i = 0; i < 4; i++) {
    const start = matchVertex(cmpTetrahedronOuter2[i]);
    const end = new THREE.Vector3(...cmpTetrahedronInner2[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cmpTetrahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created compound tetrahedron connections: 8 vertex-to-core connections (4 per tetrahedron)`
  );

  return {
    centerLines: innerCmpTetrahedronGroup,
    centerLinesMaterial,
    curvedLines: cmpTetrahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
