import * as THREE from "three";

/**
 * Create hyperframe for compound mega tesseract (8 tesseracts)
 *
 * This hyperframe accurately reflects the 8-tesseract compound structure:
 * - First mega set: 4 tesseracts (original rotations)
 * - Second mega set: 4 tesseracts (cross angles with X/Z rotations)
 *
 * Each tesseract contributes an inner cube wireframe at its specific rotation and scale,
 * maintaining geometric truth similar to the compound icosahedron approach.
 *
 * @param {THREE.BufferGeometry} geometry - The compound mega tesseract geometry
 * @param {string} hyperframeColor - Color for inner wireframes
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createCompoundMegaTesseractHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log(
    "Creating COMPOUND MEGA TESSERACT hyperframe - 8 inner cube wireframes with radial connections"
  );

  // Match the scale factor from compoundMegaTesseract.js
  const scale = 0.88;

  // Match the updated sizes from compoundMegaTesseract.js
  // Small pair (scaled up): 1.2/0.6, Large pair: 2.0/1.5
  const innerSize1 = 0.6 * scale;  // Inner cube for first pair (smaller, now scaled up)
  const innerSize2 = 1.5 * scale;   // Inner cube for outer pair (larger)

  // SECOND CROSS SET - 4 tesseracts (perpendicular orientations)
  // Uses same sizes but different rotations

  // Helper to create cube corner coordinates
  const makeCubeCorners = (size) => [
    [-size, -size, -size],
    [size, -size, -size],
    [size, size, -size],
    [-size, size, -size],
    [-size, -size, size],
    [size, -size, size],
    [size, size, size],
    [-size, size, size],
  ];

  // Helper to apply rotation matrix to vertices
  const rotateVertices = (vertices, rotationMatrix) => {
    return vertices.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyMatrix4(rotationMatrix);
      return [vec.x, vec.y, vec.z];
    });
  };

  // FIRST MEGA SET - 4 tesseracts
  // Mega 1: No rotation
  const mega1Inner = makeCubeCorners(innerSize1);

  // Mega 2: Y rotation π/4
  const rotMega2 = new THREE.Matrix4().makeRotationY(Math.PI / 4);
  const mega2Inner = rotateVertices(makeCubeCorners(innerSize1), rotMega2);

  // Mega 3: Y rotation π/8
  const rotMega3 = new THREE.Matrix4().makeRotationY(Math.PI / 8);
  const mega3Inner = rotateVertices(makeCubeCorners(innerSize2), rotMega3);

  // Mega 4: Y rotation π/8 + π/4
  const rotMega4 = new THREE.Matrix4().makeRotationY(Math.PI / 8 + Math.PI / 4);
  const mega4Inner = rotateVertices(makeCubeCorners(innerSize2), rotMega4);

  // SECOND CROSS SET - 4 tesseracts with perpendicular rotations
  // Cross 1: Y rotation π/6, then X rotation π/2
  const rotCross1Y = new THREE.Matrix4().makeRotationY(Math.PI / 6);
  const rotCross1X = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  const rotCross1 = new THREE.Matrix4().multiplyMatrices(
    rotCross1X,
    rotCross1Y
  );
  const cross1Inner = rotateVertices(makeCubeCorners(innerSize1), rotCross1);

  // Cross 2: Y rotation π/6 + π/4, then X rotation π/2
  const rotCross2Y = new THREE.Matrix4().makeRotationY(
    Math.PI / 6 + Math.PI / 4
  );
  const rotCross2X = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  const rotCross2 = new THREE.Matrix4().multiplyMatrices(
    rotCross2X,
    rotCross2Y
  );
  const cross2Inner = rotateVertices(makeCubeCorners(innerSize1), rotCross2);

  // Cross 3: Y rotation π/5, then Z rotation π/2
  const rotCross3Y = new THREE.Matrix4().makeRotationY(Math.PI / 5);
  const rotCross3Z = new THREE.Matrix4().makeRotationZ(Math.PI / 2);
  const rotCross3 = new THREE.Matrix4().multiplyMatrices(
    rotCross3Z,
    rotCross3Y
  );
  const cross3Inner = rotateVertices(makeCubeCorners(innerSize2), rotCross3);

  // Cross 4: Y rotation π/5 + π/4, then Z rotation π/2
  const rotCross4Y = new THREE.Matrix4().makeRotationY(
    Math.PI / 5 + Math.PI / 4
  );
  const rotCross4Z = new THREE.Matrix4().makeRotationZ(Math.PI / 2);
  const rotCross4 = new THREE.Matrix4().multiplyMatrices(
    rotCross4Z,
    rotCross4Y
  );
  const cross4Inner = rotateVertices(makeCubeCorners(innerSize2), rotCross4);

  // Collect all 8 inner cubes
  const allInnerCubes = [
    mega1Inner,
    mega2Inner,
    mega3Inner,
    mega4Inner,
    cross1Inner,
    cross2Inner,
    cross3Inner,
    cross4Inner,
  ];

  // Materials
  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: true,
    opacity: 0.6,
  });

  const innerCubesGroup = new THREE.Group();
  const radialConnectionsGroup = new THREE.Group();

  // Cube edge pairs (12 edges per cube)
  const cubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Bottom face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Top face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // Vertical edges
  ];

  // Create wireframe for each of the 8 inner cubes
  allInnerCubes.forEach((cubeVertices, cubeIndex) => {
    cubeEdges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...cubeVertices[i]);
      const end = new THREE.Vector3(...cubeVertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(
        0.003,
        0.003,
        distance,
        8
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      innerCubesGroup.add(cylinderMesh);
    });
  });

  console.log(
    `Created 8 inner cube wireframes (12 edges × 8 cubes = 96 edges)`
  );

  // Create radial connections from each inner cube to outer stellated layers
  const phi = (1 + Math.sqrt(5)) / 2;
  const outerScale = phi * phi; // Φ² stellated layer

  allInnerCubes.forEach((cubeVertices, cubeIndex) => {
    cubeVertices.forEach((vertex) => {
      const innerPoint = new THREE.Vector3(...vertex);
      // Project outward along radial direction
      const outerPoint = innerPoint
        .clone()
        .normalize()
        .multiplyScalar(outerScale);

      const distance = innerPoint.distanceTo(outerPoint);
      const cylinderGeom = new THREE.CylinderGeometry(
        0.003,
        0.003,
        distance,
        8
      );
      const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

      cylinderMesh.position.copy(
        innerPoint.clone().add(outerPoint).multiplyScalar(0.5)
      );
      cylinderMesh.lookAt(outerPoint);
      cylinderMesh.rotateX(Math.PI / 2);

      radialConnectionsGroup.add(cylinderMesh);
    });
  });

  console.log(
    `Created radial connections: 8 vertices × 8 cubes = 64 radial connections`
  );

  return {
    centerLines: innerCubesGroup,
    centerLinesMaterial: centerLinesMaterial,
    curvedLines: radialConnectionsGroup,
    curvedLinesMaterial: curvedLinesMaterial,
  };
}
