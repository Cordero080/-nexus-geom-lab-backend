import * as THREE from "three";

/**
 * Create hyperframe for mega tesseract (4 tesseracts) - SIMPLIFIED CONSISTENT VERSION
 * 
 * This hyperframe accurately reflects the 4-tesseract structure:
 * - Inner pair: 2 smaller tesseracts (outerSize=0.75, innerSize=0.375)
 * - Outer pair: 2 larger tesseracts (outerSize=2.0, innerSize=1.5)
 * 
 * Shows 4 inner cube wireframes matching the 4 actual merged tesseracts,
 * maintaining consistency with compound icosahedron and compound mega tesseract.
 * 
 * @param {THREE.BufferGeometry} geometry - The mega tesseract geometry
 * @param {string} hyperframeColor - Color for inner wireframes
 * @param {string} hyperframeLineColor - Color for connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function createMegaTesseractHyperframeSimple(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log(
    "Creating MEGA TESSERACT hyperframe - 4 inner cube wireframes matching actual structure"
  );

  // Match sizes from megaTesseract.js
  const innerSize1 = 0.375; // Inner pair (smaller tesseracts)
  const innerSize2 = 1.5;   // Outer pair (larger tesseracts)

  // Helper to create cube corners
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

  // Helper to apply rotation
  const rotateVertices = (vertices, rotationMatrix) => {
    return vertices.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyMatrix4(rotationMatrix);
      return [vec.x, vec.y, vec.z];
    });
  };

  // INNER PAIR - 2 smaller tesseracts
  // Tesseract 1: No rotation
  const tess1Inner = makeCubeCorners(innerSize1);

  // Tesseract 2: Y rotation π/4
  const rotTess2 = new THREE.Matrix4().makeRotationY(Math.PI / 4);
  const tess2Inner = rotateVertices(makeCubeCorners(innerSize1), rotTess2);

  // OUTER PAIR - 2 larger tesseracts
  // Tesseract 3: Y rotation π/8
  const rotTess3 = new THREE.Matrix4().makeRotationY(Math.PI / 8);
  const tess3Inner = rotateVertices(makeCubeCorners(innerSize2), rotTess3);

  // Tesseract 4: Y rotation π/8 + π/4
  const rotTess4 = new THREE.Matrix4().makeRotationY(Math.PI / 8 + Math.PI / 4);
  const tess4Inner = rotateVertices(makeCubeCorners(innerSize2), rotTess4);

  // Collect all 4 inner cubes
  const allInnerCubes = [tess1Inner, tess2Inner, tess3Inner, tess4Inner];

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
    [0, 1], [1, 2], [2, 3], [3, 0], // Bottom face
    [4, 5], [5, 6], [6, 7], [7, 4], // Top face
    [0, 4], [1, 5], [2, 6], [3, 7], // Vertical edges
  ];

  // Create wireframe for each of the 4 inner cubes
  allInnerCubes.forEach((cubeVertices, cubeIndex) => {
    cubeEdges.forEach(([i, j]) => {
      const start = new THREE.Vector3(...cubeVertices[i]);
      const end = new THREE.Vector3(...cubeVertices[j]);
      const distance = start.distanceTo(end);

      const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 8);
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

      cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      cylinderMesh.lookAt(end);
      cylinderMesh.rotateX(Math.PI / 2);

      innerCubesGroup.add(cylinderMesh);
    });
  });

  console.log(`Created 4 inner cube wireframes (12 edges × 4 cubes = 48 edges)`);

  // Create radial connections from each inner cube to stellated layers
  const phi = (1 + Math.sqrt(5)) / 2;
  const outerScale = phi * phi; // Φ² stellated layer

  allInnerCubes.forEach((cubeVertices) => {
    cubeVertices.forEach((vertex) => {
      const innerPoint = new THREE.Vector3(...vertex);
      // Project outward along radial direction
      const outerPoint = innerPoint.clone().normalize().multiplyScalar(outerScale);
      
      const distance = innerPoint.distanceTo(outerPoint);
      const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 8);
      const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

      cylinderMesh.position.copy(innerPoint.clone().add(outerPoint).multiplyScalar(0.5));
      cylinderMesh.lookAt(outerPoint);
      cylinderMesh.rotateX(Math.PI / 2);

      radialConnectionsGroup.add(cylinderMesh);
    });
  });

  console.log(
    `Created radial connections: 8 vertices × 4 cubes = 32 radial connections`
  );

  return {
    centerLines: innerCubesGroup,
    centerLinesMaterial: centerLinesMaterial,
    curvedLines: radialConnectionsGroup,
    curvedLinesMaterial: curvedLinesMaterial,
  };
}
