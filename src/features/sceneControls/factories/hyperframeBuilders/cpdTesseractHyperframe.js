import * as THREE from "three";

export function createCpdTesseractHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("Creating compound tesseract hyperframe with recursive nesting");

  const outerSize = 0.75;
  const innerSize = 0.375;
  const tinySize = 0.1875; // Half of inner size - recursive nesting

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

  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  const actualVertices = [];
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    actualVertices.push(
      new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2])
    );
  }

  // DON'T search geometry - outer cube corners don't exist as vertices (frustums replace them)
  // Just use the canonical mathematical positions directly

  // First tesseract: 8 connections from outer corners to inner corners
  for (let i = 0; i < 8; i++) {
    const outerVertex = new THREE.Vector3(...cube1Outer[i]); // Use canonical position directly
    const innerVertex = new THREE.Vector3(...cube1Inner[i]);
    const distance = outerVertex.distanceTo(innerVertex);

    const cylinderGeom = new THREE.CylinderGeometry(0.006, 0.006, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(
      outerVertex.clone().add(innerVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(innerVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionsGroup.add(cylinderMesh);
  }

  // First tesseract RECURSIVE: 8 connections from inner (middle) corners to tiny inner corners
  for (let i = 0; i < 8; i++) {
    const middleVertex = new THREE.Vector3(...cube1Inner[i]);
    const tinyVertex = new THREE.Vector3(...cube1Tiny[i]);
    const distance = middleVertex.distanceTo(tinyVertex);

    const cylinderGeom = new THREE.CylinderGeometry(0.005, 0.005, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(
      middleVertex.clone().add(tinyVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(tinyVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  }

  // First tesseract: Add tiny inner cube edges (recursive innermost structure)
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube1Tiny[i]);
    const end = new THREE.Vector3(...cube1Tiny[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  // Second tesseract: 8 connections from outer corners to inner corners
  for (let i = 0; i < 8; i++) {
    const outerVertex = new THREE.Vector3(...cube2Outer[i]); // Use canonical position directly
    const innerVertex = new THREE.Vector3(...cube2Inner[i]);
    const distance = outerVertex.distanceTo(innerVertex);

    const cylinderGeom = new THREE.CylinderGeometry(0.006, 0.006, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(
      outerVertex.clone().add(innerVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(innerVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionsGroup.add(cylinderMesh);
  }

  // Second tesseract RECURSIVE: 8 connections from inner (middle) corners to tiny inner corners
  for (let i = 0; i < 8; i++) {
    const middleVertex = new THREE.Vector3(...cube2Inner[i]);
    const tinyVertex = new THREE.Vector3(...cube2Tiny[i]);
    const distance = middleVertex.distanceTo(tinyVertex);

    const cylinderGeom = new THREE.CylinderGeometry(0.005, 0.005, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(
      middleVertex.clone().add(tinyVertex).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(tinyVertex);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  }

  // Second tesseract: Add tiny inner cube edges (recursive innermost structure)
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube2Tiny[i]);
    const end = new THREE.Vector3(...cube2Tiny[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  // === ADDITIONAL 4D STRUCTURE VISUALIZATION ===

  // 1. Face diagonals on middle cubes (showing 4D face collapse) - AQUA
  const faceDiagonals = [
    // Front face (z-)
    [0, 2],
    [1, 3],
    // Back face (z+)
    [4, 6],
    [5, 7],
    // Top face (y+)
    [2, 6],
    [3, 7],
    // Bottom face (y-)
    [0, 4],
    [1, 5],
    // Left face (x-)
    [0, 7],
    [3, 4],
    // Right face (x+)
    [1, 6],
    [2, 5],
  ];

  // First tesseract face diagonals
  faceDiagonals.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube1Inner[i]);
    const end = new THREE.Vector3(...cube1Inner[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  // Second tesseract face diagonals
  faceDiagonals.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube2Inner[i]);
    const end = new THREE.Vector3(...cube2Inner[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  });

  // 2. Cross-connections between the two middle cubes (showing compound intersection) - AQUA
  // Connect corresponding vertices where the two tesseracts share space
  for (let i = 0; i < 8; i++) {
    const vertex1 = new THREE.Vector3(...cube1Inner[i]);
    const vertex2 = new THREE.Vector3(...cube2Inner[i]);
    const distance = vertex1.distanceTo(vertex2);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0025,
      0.0025,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

    cylinderMesh.position.copy(
      vertex1.clone().add(vertex2).multiplyScalar(0.5)
    );
    cylinderMesh.lookAt(vertex2);
    cylinderMesh.rotateX(Math.PI / 2);

    innerCubesGroup.add(cylinderMesh);
  }

  // 3. Space diagonals from outer corners through center (showing 4D depth) - ORANGE
  const spaceDiagonalPairs = [
    [0, 6], // Bottom-left-back to top-right-front
    [1, 7], // Bottom-right-back to top-left-front
    [2, 4], // Top-left-back to bottom-right-front
    [3, 5], // Top-right-back to bottom-left-front
  ];

  // First tesseract space diagonals
  spaceDiagonalPairs.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube1Outer[i]);
    const end = new THREE.Vector3(...cube1Outer[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0015,
      0.0015,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionsGroup.add(cylinderMesh);
  });

  // Second tesseract space diagonals
  spaceDiagonalPairs.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cube2Outer[i]);
    const end = new THREE.Vector3(...cube2Outer[j]);
    const distance = start.distanceTo(end);

    const cylinderGeom = new THREE.CylinderGeometry(
      0.0015,
      0.0015,
      distance,
      6
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);

    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    connectionsGroup.add(cylinderMesh);
  });

  // === DENSE WEB HYPERFRAME (like compound icosahedron) ===
  // Connect each middle cube vertex to multiple nearby vertices for dense internal web

  const allMiddleVertices = [
    ...cube1Inner.map((v) => new THREE.Vector3(...v)),
    ...cube2Inner.map((v) => new THREE.Vector3(...v)),
  ];

  const allTinyVertices = [
    ...cube1Tiny.map((v) => new THREE.Vector3(...v)),
    ...cube2Tiny.map((v) => new THREE.Vector3(...v)),
  ];

  // Dense connections: Connect each vertex to nearby vertices within threshold distance
  const webThreshold = 0.8; // Connect vertices within this distance
  const webLineRadius = 0.0018; // Very thin for dense web effect

  // Connect middle cube vertices to each other (dense web)
  for (let i = 0; i < allMiddleVertices.length; i++) {
    for (let j = i + 1; j < allMiddleVertices.length; j++) {
      const v1 = allMiddleVertices[i];
      const v2 = allMiddleVertices[j];
      const distance = v1.distanceTo(v2);

      // Only connect if within threshold (creates web, not everything to everything)
      if (distance > 0.01 && distance < webThreshold) {
        const cylinderGeom = new THREE.CylinderGeometry(
          webLineRadius,
          webLineRadius,
          distance,
          4
        );
        const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);

        innerCubesGroup.add(cylinderMesh);
      }
    }
  }

  // Connect tiny cube vertices to each other (dense internal web)
  const tinyWebThreshold = 0.4;
  for (let i = 0; i < allTinyVertices.length; i++) {
    for (let j = i + 1; j < allTinyVertices.length; j++) {
      const v1 = allTinyVertices[i];
      const v2 = allTinyVertices[j];
      const distance = v1.distanceTo(v2);

      if (distance > 0.01 && distance < tinyWebThreshold) {
        const cylinderGeom = new THREE.CylinderGeometry(
          webLineRadius * 0.8,
          webLineRadius * 0.8,
          distance,
          4
        );
        const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);

        innerCubesGroup.add(cylinderMesh);
      }
    }
  }

  // Connect middle vertices to nearby tiny vertices (bridging layers)
  const bridgeThreshold = 0.5;
  for (let i = 0; i < allMiddleVertices.length; i++) {
    for (let j = 0; j < allTinyVertices.length; j++) {
      const v1 = allMiddleVertices[i];
      const v2 = allTinyVertices[j];
      const distance = v1.distanceTo(v2);

      if (distance > 0.01 && distance < bridgeThreshold) {
        const cylinderGeom = new THREE.CylinderGeometry(
          webLineRadius,
          webLineRadius,
          distance,
          4
        );
        const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);

        cylinderMesh.position.copy(v1.clone().add(v2).multiplyScalar(0.5));
        cylinderMesh.lookAt(v2);
        cylinderMesh.rotateX(Math.PI / 2);

        innerCubesGroup.add(cylinderMesh);
      }
    }
  }

  console.log(
    `Created DENSE compound tesseract hyperframe web:
    - ${innerCubesGroup.children.length} aqua/red lines (dense internal web + structure)
    - ${connectionsGroup.children.length} orange lines (outer projections)`
  );

  return {
    centerLines: innerCubesGroup,
    centerLinesMaterial,
    curvedLines: connectionsGroup,
    curvedLinesMaterial,
  };
}
