import * as THREE from "three";

/**
 * Create intricate hyper-tetrahedron wireframe with inner tetrahedron and vertex connections
 * @param {THREE.BufferGeometry} geometry - The tetrahedron geometry
 * @param {string} intricateWireframeSpiralColor - Color for inner wireframe
 * @param {string} intricateWireframeEdgeColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createTetrahedronIntricateWireframe(
  geometry,
  intricateWireframeSpiralColor,
  intricateWireframeEdgeColor
) {
  console.log("*** ENTERING TETRAHEDRON SECTION ***");
  console.log(
    "Creating hyper-tetrahedron with inner tetrahedron and vertex connections"
  );

  // Get the 4 vertices from the tetrahedron geometry
  const vertices = geometry.attributes.position.array;
  const outerVertices = [];
  for (let v = 0; v < 4; v++) {
    outerVertices.push([
      vertices[v * 3], // x
      vertices[v * 3 + 1], // y
      vertices[v * 3 + 2], // z
    ]);
  }

  console.log("Outer tetrahedron vertices:", outerVertices);

  // Create inner tetrahedron vertices (scaled down by 0.5 from center)
  const innerVertices = outerVertices.map((vertex) => [
    vertex[0] * 0.5,
    vertex[1] * 0.5,
    vertex[2] * 0.5,
  ]);

  console.log("Inner tetrahedron vertices:", innerVertices);

  // 1. Create inner tetrahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(intricateWireframeSpiralColor),
    transparent: false,
    opacity: 1.0,
  });

  const innerTetrahedronGroup = new THREE.Group();

  // Tetrahedron edges: connect every vertex to every other vertex (6 edges total)
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3], // From vertex 0 to others
    [1, 2],
    [1, 3], // From vertex 1 to remaining
    [2, 3], // From vertex 2 to 3
  ];

  // Create cylinder for each inner tetrahedron edge
  edges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    // Create thick cylinder for inner tetrahedron edge
    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerTetrahedronGroup.add(cylinderMesh);
  });

  console.log(`Created inner tetrahedron: 6 thick cylinder edges`);

  // 2. Create hyper-tetrahedron connections (vertex to vertex) using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(intricateWireframeEdgeColor),
    transparent: false,
    opacity: 1.0,
  });

  // Create thick connection lines using cylinder geometry
  const tetrahedronConnectionGroup = new THREE.Group();

  // Connect each outer vertex to corresponding inner vertex (4 connections going INWARD)
  for (let v = 0; v < 4; v++) {
    const start = new THREE.Vector3(...outerVertices[v]);
    const end = new THREE.Vector3(...innerVertices[v]);
    const distance = start.distanceTo(end);

    // Create cylinder for each connection line
    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    tetrahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created hyper-tetrahedron connections: 4 thick vertex-to-vertex connections`
  );

  return {
    centerLines: innerTetrahedronGroup,
    centerLinesMaterial,
    curvedLines: tetrahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
