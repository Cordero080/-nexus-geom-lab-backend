import * as THREE from "three";

/**
 * Create hyperframe for compound octahedron with dual inner octahedrons and vertex connections
 * Always creates two overlapping wireframe sets for compound geometry pattern
 * @param {THREE.BufferGeometry} geometry - The compound octahedron geometry
 * @param {string} hyperframeColor - Color for inner wireframe
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createOctahedronHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating compound octahedron hyperframe");

  // Canonical vertices for octahedron (6 vertices: ±1 on each axis)
  const rawVertices = [
    [1, 0, 0], // +X
    [-1, 0, 0], // -X
    [0, 1, 0], // +Y (top)
    [0, -1, 0], // -Y (bottom)
    [0, 0, 1], // +Z
    [0, 0, -1], // -Z
  ];

  // Already normalized to radius 1
  const outerVertices = rawVertices;

  // Create rotated second set for compound geometry (45° on Y axis)
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationY(Math.PI / 4);

  const outerVertices2 = rawVertices.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return vec.toArray();
  });

  // Create inner octahedrons (scaled down)
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

  // 1. Create inner octahedron wireframe using thick cylinders
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const innerOctahedronGroup = new THREE.Group();

  // Octahedron edges: each vertex connects to 4 others (all except opposite)
  // Distance between connected vertices is √2 ≈ 1.414
  const edgeThreshold = 1.5;
  let octahedronEdges = [];
  for (let i = 0; i < innerVertices.length; i++) {
    for (let j = i + 1; j < innerVertices.length; j++) {
      const v1 = new THREE.Vector3(...innerVertices[i]);
      const v2 = new THREE.Vector3(...innerVertices[j]);
      const dist = v1.distanceTo(v2);
      if (dist > 0.1 && dist < edgeThreshold) {
        octahedronEdges.push([i, j]);
      }
    }
  }

  octahedronEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerOctahedronGroup.add(cylinderMesh);
  });

  // Add second octahedron wireframe
  let octahedronEdges2 = [];
  for (let i = 0; i < innerVertices2.length; i++) {
    for (let j = i + 1; j < innerVertices2.length; j++) {
      const v1 = new THREE.Vector3(...innerVertices2[i]);
      const v2 = new THREE.Vector3(...innerVertices2[j]);
      const dist = v1.distanceTo(v2);
      if (dist > 0.1 && dist < edgeThreshold) {
        octahedronEdges2.push([i, j]);
      }
    }
  }

  octahedronEdges2.forEach(([i, j]) => {
    const start = new THREE.Vector3(...innerVertices2[i]);
    const end = new THREE.Vector3(...innerVertices2[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerOctahedronGroup.add(cylinderMesh);
  });

  console.log(
    `Created compound octahedron inner wireframes with ${octahedronEdges.length} x2 cylinder edges`
  );

  // 2. Create vertex-to-core connections using thick cylinders
  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const octahedronConnectionGroup = new THREE.Group();

  // Extract actual vertex positions from the merged geometry
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  // Extract unique vertices from merged geometry
  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
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

  // First octahedron connections (6 vertices)
  for (let i = 0; i < 6; i++) {
    const start = matchVertex(outerVertices[i]);
    const end = new THREE.Vector3(...innerVertices[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    octahedronConnectionGroup.add(cylinderMesh);
  }

  // Second octahedron connections (6 vertices)
  for (let i = 0; i < 6; i++) {
    const start = matchVertex(outerVertices2[i]);
    const end = new THREE.Vector3(...innerVertices2[i]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    octahedronConnectionGroup.add(cylinderMesh);
  }

  console.log(
    `Created compound octahedron connections: 12 vertex-to-core connections (6 per octahedron)`
  );

  return {
    centerLines: innerOctahedronGroup,
    centerLinesMaterial,
    curvedLines: octahedronConnectionGroup,
    curvedLinesMaterial,
  };
}
