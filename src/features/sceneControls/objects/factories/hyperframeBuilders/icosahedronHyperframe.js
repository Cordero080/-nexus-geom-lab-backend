import * as THREE from 'three';

/**
 * Create hyperframe for compound icosahedron (merkaba) with dual inner icosahedrons and vertex connections
 * Always creates two overlapping wireframe sets for sacred geometry pattern
 * @param {THREE.BufferGeometry} geometry - The compound icosahedron geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createIcosahedronHyperframe(geometry, hyperframeColor, hyperframeLineColor) {
  console.log('Creating compound icosahedron (merkaba) hyperframe');

  // Golden ratio for icosahedron construction
  const phi = (1 + Math.sqrt(5)) / 2;

  // Canonical vertices for first icosahedron
  const rawVertices = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];

  // Normalize all vertices to radius 1
  const outerVertices = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    return vec.normalize().toArray();
  });

  // Create rotated second set for compound geometry
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationX(Math.PI / 2);
  rotationMatrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 6));

  const outerVertices2 = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return vec.normalize().toArray();
  });

  // Create inner icosahedrons (scaled down)
  const innerScale = 0.5;
  const innerVertices = outerVertices.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  const innerVertices2 = outerVertices2.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  // 1. Create inner icosahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerIcosahedronGroup = new THREE.Group();

  // Find all edges: connect vertices that are distance ≈ 2.0 apart
  const edgeThreshold = 2.1;
  let icosahedronEdges = [];
  for (let i = 0; i < innerVertices.length; i++) {
    for (let j = i + 1; j < innerVertices.length; j++) {
      const v1 = new THREE.Vector3(...innerVertices[i]);
      const v2 = new THREE.Vector3(...innerVertices[j]);
      if (v1.distanceTo(v2) < edgeThreshold) {
        icosahedronEdges.push([i, j]);
      }
    }
  }

  icosahedronEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedronGroup.add(cylinderMesh);
  });

  // Add second icosahedron wireframe
  let icosahedronEdges2 = [];
  for (let i = 0; i < innerVertices2.length; i++) {
    for (let j = i + 1; j < innerVertices2.length; j++) {
      const v1 = new THREE.Vector3(...innerVertices2[i]);
      const v2 = new THREE.Vector3(...innerVertices2[j]);
      if (v1.distanceTo(v2) < edgeThreshold) {
        icosahedronEdges2.push([i, j]);
      }
    }
  }

  icosahedronEdges2.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices2[i]);
    const end = new THREE.Vector3(...innerVertices2[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerIcosahedronGroup.add(cylinderMesh);
  });

  console.log(
    `Created compound icosahedron inner wireframes with ${icosahedronEdges.length} x2 cylinder edges`
  );

  // 2. Create vertex-to-core connections using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const icosahedronConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from the merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  // Extract unique vertices from merged geometry
  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2]));
  }

  // Match each canonical outer vertex to its closest actual vertex
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

  // First icosahedron connections
  for (let i = 0; i < 12; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    icosahedronConnectionGroup.add(cylinderMesh);
  }

  // Second icosahedron connections
  for (let i = 0; i < 12; i++) {
    const start = matchVertex(outerVertices2[i]);
    const end = new THREE.Vector3(...innerVertices2[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    icosahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(`Created compound icosahedron connections: 24 vertex-to-core connections`);

  return {
    centerLines: innerIcosahedronGroup,
    centerLinesMaterial,
    curvedLines: icosahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
