import * as THREE from "three";

/**
 * Create intricate hyper-icosahedron wireframe with inner icosahedron and vertex connections
 * @param {THREE.BufferGeometry} geometry - The icosahedron geometry
 * @param {string} intricateWireframeSpiralColor - Color for inner wireframe
 * @param {string} intricateWireframeEdgeColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createIcosahedronIntricateWireframe(
  geometry,
  intricateWireframeSpiralColor,
  intricateWireframeEdgeColor
) {
  console.log('Creating hyper-icosahedron wireframe for IcosahedronGeometry');

  // Golden ratio for icosahedron construction
  const phi = (1 + Math.sqrt(5)) / 2;

  // Canonical vertices
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

  // Create inner icosahedron (scaled down)
  const innerScale = 0.5;
  const innerVertices = outerVertices.map((vertex) => [
    vertex[0] * innerScale,
    vertex[1] * innerScale,
    vertex[2] * innerScale,
  ]);

  // 1. Create inner icosahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: intricateWireframeSpiralColor,
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

  console.log(
    `Created hyper-icosahedron inner wireframe with ${icosahedronEdges.length} cylinder edges`
  );

  // 2. Create hyper-icosahedron connections (vertex to vertex) using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: intricateWireframeEdgeColor,
    transparent: false,
    opacity: 1.0,
  });

  const icosahedronConnectionGroup = new THREE.Group();

  for (let i = 0; i < 12; i++) {
    const start = new THREE.Vector3(...outerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    icosahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(`Created hyper-icosahedron connections: 12 vertex-to-vertex connections`);

  return {
    centerLines: innerIcosahedronGroup,
    centerLinesMaterial,
    curvedLines: icosahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
