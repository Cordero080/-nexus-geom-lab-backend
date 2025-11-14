import * as THREE from 'three';

/**
 * Create hyperframe for compound hypercube - 9 complete hypercube hyperframes
 * Each hypercube gets:
 * - Inner cube wireframe (12 edges)
 * - Outer-to-inner vertex connections (8 lines)
 *
 * @param {THREE.BufferGeometry} geometry - The compound hypercube geometry
 * @param {string} hyperframeColor - Color for inner wireframes
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createCompoundHypercubeHyperframe(geometry, hyperframeColor, hyperframeLineColor) {
  console.log('Creating 9-compound hypercube hyperframe');

  const outerScale = geometry.userData.outerScale || 1.0;
  const innerScale = geometry.userData.innerScale || 0.5;
  const compoundCount = geometry.userData.compoundCount || 9;
  const rotations = geometry.userData.rotations || [];

  // Define 8 vertices of a cube
  const cubeVertices = [
    [-1, -1, -1], // 0
    [1, -1, -1], // 1
    [1, 1, -1], // 2
    [-1, 1, -1], // 3
    [-1, -1, 1], // 4
    [1, -1, 1], // 5
    [1, 1, 1], // 6
    [-1, 1, 1], // 7
  ];

  // Define the 12 edges of a cube (vertex index pairs)
  const cubeEdges = [
    // Bottom face
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Top face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Vertical edges
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  // Materials
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

  const allInnerWireframes = new THREE.Group();
  const allConnections = new THREE.Group();

  // Create hyperframe for all hypercubes in the compound
  for (let hypercubeIndex = 0; hypercubeIndex < compoundCount; hypercubeIndex++) {
    // Get rotation for this hypercube
    const rotation = rotations[hypercubeIndex] || new THREE.Euler(0, 0, 0);

    // Outer cube vertices (scaled and rotated)
    const outerVertices = cubeVertices.map((v) => {
      const vec = new THREE.Vector3(v[0] * outerScale, v[1] * outerScale, v[2] * outerScale);
      vec.applyEuler(rotation);
      return [vec.x, vec.y, vec.z];
    });

    // Inner cube vertices (scaled and rotated)
    const innerVertices = cubeVertices.map((v) => {
      const vec = new THREE.Vector3(v[0] * innerScale, v[1] * innerScale, v[2] * innerScale);
      vec.applyEuler(rotation);
      return [vec.x, vec.y, vec.z];
    });

    // 1. Create inner cube wireframe using thick cylinders
    cubeEdges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...innerVertices[i]);
      const end = new THREE.Vector3(...innerVertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      allInnerWireframes.add(cylinderMesh);
    });

    // 2. Create vertex-to-vertex connections (outer to inner)
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

    // Connect each outer vertex to its corresponding inner vertex
    for (let i = 0; i < 8; i++) {
      const start = matchVertex(outerVertices[i]);
      const end = new THREE.Vector3(...innerVertices[i]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
      const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      allConnections.add(cylinderMesh);
    }
  }

  console.log(
    `Created 9-compound hypercube inner wireframes: ${
      cubeEdges.length * compoundCount
    } cylinder edges (12 per hypercube)`
  );
  console.log(
    `Created 9-compound hypercube connections: ${
      8 * compoundCount
    } vertex-to-vertex connections (8 per hypercube)`
  );

  return {
    centerLines: allInnerWireframes,
    centerLinesMaterial,
    curvedLines: allConnections,
    curvedLinesMaterial,
  };
}
