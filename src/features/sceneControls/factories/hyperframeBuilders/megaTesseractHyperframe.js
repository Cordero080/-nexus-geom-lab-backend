import * as THREE from "three";

export function createMegaTesseractHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating ARCHITECTURAL Mega-Tesseract hyperframe with stellated radial structure");

  // Golden ratio for beautiful proportions
  const phi = (1 + Math.sqrt(5)) / 2;
  
  const outerSize = 0.75;
  const innerSize = 0.375;
  const tinySize = 0.1875;
  const stellatedSize = outerSize * phi; // Stellated points extending beyond
  const radialSize = innerSize / phi; // Inner radial sphere

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

  const cube1Tiny = [
    [-tinySize, -tinySize, -tinySize],
    [tinySize, -tinySize, -tinySize],
    [tinySize, tinySize, -tinySize],
    [-tinySize, tinySize, -tinySize],
    [-tinySize, -tinySize, tinySize],
    [tinySize, -tinySize, tinySize],
    [tinySize, tinySize, tinySize],
    [-tinySize, tinySize, tinySize],
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

  const cube2Tiny = cube1Tiny.map((v) => {
    const vec = new THREE.Vector3(...v);
    vec.applyMatrix4(rotationMatrix);
    return [vec.x, vec.y, vec.z];
  });

  // ARCHITECTURAL ADDITIONS: Stellated points (star projections)
  const stellated1 = cube1Outer.map(v => [v[0] * (stellatedSize / outerSize), v[1] * (stellatedSize / outerSize), v[2] * (stellatedSize / outerSize)]);
  const stellated2 = cube2Outer.map(v => [v[0] * (stellatedSize / outerSize), v[1] * (stellatedSize / outerSize), v[2] * (stellatedSize / outerSize)]);

  // Radial core sphere
  const radialCore = cube1Inner.map(v => [v[0] * (radialSize / innerSize), v[1] * (radialSize / innerSize), v[2] * (radialSize / innerSize)]);

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

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
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

    const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  const curvedLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const connectionsGroup = new THREE.Group();

  // === ARCHITECTURAL ENHANCEMENTS ===
  
  // 1. STELLATED PROJECTIONS - Gothic cathedral spires effect
  console.log("Adding stellated radial projections...");
  for (let i = 0; i < 8; i++) {
    // Radiate from core through inner through outer to stellated points
    const core = new THREE.Vector3(...radialCore[i]);
    const inner = new THREE.Vector3(...cube1Inner[i]);
    const outer = new THREE.Vector3(...cube1Outer[i]);
    const stellar = new THREE.Vector3(...stellated1[i]);
    
    // Core to stellar ray (full radial line)
    const distance = core.distanceTo(stellar);
    const cylinderGeom = new THREE.CylinderGeometry(0.0015, 0.0015, distance, 4);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
    cylinderMesh.position.copy(core.clone().add(stellar).multiplyScalar(0.5));
    cylinderMesh.lookAt(stellar);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  }

  // Second tesseract stellations
  for (let i = 0; i < 8; i++) {
    const inner = new THREE.Vector3(...cube2Inner[i]);
    const outer = new THREE.Vector3(...cube2Outer[i]);
    const stellar = new THREE.Vector3(...stellated2[i]);
    
    const distance = inner.distanceTo(stellar);
    const cylinderGeom = new THREE.CylinderGeometry(0.0015, 0.0015, distance, 4);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
    cylinderMesh.position.copy(inner.clone().add(stellar).multiplyScalar(0.5));
    cylinderMesh.lookAt(stellar);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  }

  // 2. RADIAL CORE SPHERE - Central sunburst
  console.log("Creating radial core structure...");
  for (let i = 0; i < radialCore.length; i++) {
    for (let j = i + 1; j < radialCore.length; j++) {
      const v1 = new THREE.Vector3(...radialCore[i]);
      const v2 = new THREE.Vector3(...radialCore[j]);
      const distance = v1.distanceTo(v2);
      
      const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 4);
      const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
      cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
      cylinderMesh.lookAt(v2);
      cylinderMesh.rotateX(Math.PI / 2);
      innerCubesGroup.add(cylinderMesh);
    }
  }

  // 3. INTER-TESSERACT BRIDGES - Connect where they interpenetrate
  console.log("Creating inter-tesseract bridging arcs...");
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const v1 = new THREE.Vector3(...cube1Inner[i]);
      const v2 = new THREE.Vector3(...cube2Inner[j]);
      const distance = v1.distanceTo(v2);
      
      // Only connect nearby cross-tesseract vertices
      if (distance < 0.7 && distance > 0.1) {
        const cylinderGeom = new THREE.CylinderGeometry(0.0025, 0.0025, distance, 5);
        const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);
        innerCubesGroup.add(cylinderMesh);
      }
    }
  }

  // 4. STELLATED EDGES - Connect stellar points to show outer star
  console.log("Creating stellated outer framework...");
  const stellatedEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],  // Bottom square
    [4, 5], [5, 6], [6, 7], [7, 4],  // Top square
    [0, 4], [1, 5], [2, 6], [3, 7],  // Vertical edges
  ];
  
  stellatedEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...stellated1[i]);
    const end = new THREE.Vector3(...stellated1[j]);
    const distance = start.distanceTo(end);
    
    const cylinderGeom = new THREE.CylinderGeometry(0.0018, 0.0018, distance, 4);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  });

  stellatedEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...stellated2[i]);
    const end = new THREE.Vector3(...stellated2[j]);
    const distance = start.distanceTo(end);
    
    const cylinderGeom = new THREE.CylinderGeometry(0.0018, 0.0018, distance, 4);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);
    connectionsGroup.add(cylinderMesh);
  });

  console.log(
    `Created MEGA-TESSERACT with architectural stellations:
    - Stellated projections: 16 radial rays (phi-based golden proportions)
    - Radial core sphere: ${radialCore.length * (radialCore.length - 1) / 2} connections
    - Inter-tesseract bridges: Dense cross-connections at intersection points
    - Stellated outer framework: 2 rotated star cubes at size ${stellatedSize.toFixed(3)}
    - Total: ${innerCubesGroup.children.length + connectionsGroup.children.length} cylinders
    - Effect: Gothic cathedral spires + radial sunburst + 4D depth`
  );

  return {
    centerLines: innerCubesGroup,
    centerLinesMaterial,
    curvedLines: connectionsGroup,
    curvedLinesMaterial,
  };
}
