import * as THREE from "three";

export function createCpdTesseractHyperframe(
  geometry,
  hyperframeColor,
  hyperframeLineColor
) {
  console.log("✨ IMPROVED: Proper 4D compound tesseract with complete faces");

  const outerSize = 0.75;
  const innerSize = 0.375;
  const innerInnerSize = 0.2;
  const tinySize = 0.1;

  // Helper: Create compound tesseract (two rotated cubes)
  const createCompoundTesseract = (size) => {
    const cube1 = [
      [-size, -size, -size], [size, -size, -size],
      [size, size, -size], [-size, size, -size],
      [-size, -size, size], [size, -size, size],
      [size, size, size], [-size, size, size],
    ];
    
    const rotationMatrix = new THREE.Matrix4().makeRotationY(Math.PI / 4);
    const cube2 = cube1.map((v) => {
      const vec = new THREE.Vector3(...v);
      vec.applyMatrix4(rotationMatrix);
      return [vec.x, vec.y, vec.z];
    });
    
    return { cube1, cube2 };
  };

  // Create nested 4D layers
  const outer = createCompoundTesseract(outerSize);
  const inner = createCompoundTesseract(innerSize);
  const innerInner = createCompoundTesseract(innerInnerSize);
  const tiny = createCompoundTesseract(tinySize);

  const hyperframeMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeColor,
    transparent: false,
    opacity: 1.0,
  });

  const edgeLinesMaterial = new THREE.MeshBasicMaterial({
    color: hyperframeLineColor,
    transparent: false,
    opacity: 1.0,
  });

  const hyperframeGroup = new THREE.Group();
  const edgeLinesGroup = new THREE.Group();

  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  // Helper: Add cylinder
  const addCylinder = (start, end, radius, material, group) => {
    const distance = start.distanceTo(end);
    if (distance < 0.001) return;
    
    const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 6);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, material);
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);
    group.add(cylinderMesh);
  };

  // Helper: Complete square face (4 edges + 2 diagonals)
  const createCompleteSquareFace = (v0, v1, v2, v3, radius, material, group) => {
    addCylinder(v0, v1, radius, material, group);
    addCylinder(v1, v2, radius, material, group);
    addCylinder(v2, v3, radius, material, group);
    addCylinder(v3, v0, radius, material, group);
    addCylinder(v0, v2, radius * 0.8, material, group);
    addCylinder(v1, v3, radius * 0.8, material, group);
  };

  // Helper: All 6 cube faces
  const createCompleteCubeFaces = (cubeVerts, radius, material, group) => {
    const faces = [
      [0, 1, 2, 3], // bottom
      [4, 5, 6, 7], // top
      [0, 1, 5, 4], // front
      [3, 2, 6, 7], // back
      [0, 3, 7, 4], // left
      [1, 2, 6, 5], // right
    ];
    faces.forEach(([a, b, c, d]) => {
      createCompleteSquareFace(
        new THREE.Vector3(...cubeVerts[a]),
        new THREE.Vector3(...cubeVerts[b]),
        new THREE.Vector3(...cubeVerts[c]),
        new THREE.Vector3(...cubeVerts[d]),
        radius, material, group
      );
    });
  };

  // === HYPERFRAME: DENSE 4D CORE ===
  
  // 1. Tiny tesseract
  createCompleteCubeFaces(tiny.cube1, 0.0015, hyperframeMaterial, hyperframeGroup);
  createCompleteCubeFaces(tiny.cube2, 0.0015, hyperframeMaterial, hyperframeGroup);
  
  [[0,6],[1,7],[2,4],[3,5]].forEach(([i,j]) => {
    addCylinder(new THREE.Vector3(...tiny.cube1[i]), new THREE.Vector3(...tiny.cube1[j]), 0.0012, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...tiny.cube2[i]), new THREE.Vector3(...tiny.cube2[j]), 0.0012, hyperframeMaterial, hyperframeGroup);
  });
  
  for (let i = 0; i < 8; i++) {
    addCylinder(new THREE.Vector3(...tiny.cube1[i]), new THREE.Vector3(...tiny.cube2[i]), 0.0015, hyperframeMaterial, hyperframeGroup);
  }

  // 2. InnerInner tesseract
  createCompleteCubeFaces(innerInner.cube1, 0.002, hyperframeMaterial, hyperframeGroup);
  createCompleteCubeFaces(innerInner.cube2, 0.002, hyperframeMaterial, hyperframeGroup);
  
  [[0,6],[1,7],[2,4],[3,5]].forEach(([i,j]) => {
    addCylinder(new THREE.Vector3(...innerInner.cube1[i]), new THREE.Vector3(...innerInner.cube1[j]), 0.0018, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...innerInner.cube2[i]), new THREE.Vector3(...innerInner.cube2[j]), 0.0018, hyperframeMaterial, hyperframeGroup);
  });
  
  for (let i = 0; i < 8; i++) {
    addCylinder(new THREE.Vector3(...innerInner.cube1[i]), new THREE.Vector3(...innerInner.cube2[i]), 0.002, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...tiny.cube1[i]), new THREE.Vector3(...innerInner.cube1[i]), 0.0018, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...tiny.cube2[i]), new THREE.Vector3(...innerInner.cube2[i]), 0.0018, hyperframeMaterial, hyperframeGroup);
  }

  // 3. Main inner tesseract
  createCompleteCubeFaces(inner.cube1, 0.0025, hyperframeMaterial, hyperframeGroup);
  createCompleteCubeFaces(inner.cube2, 0.0025, hyperframeMaterial, hyperframeGroup);
  
  [[0,6],[1,7],[2,4],[3,5]].forEach(([i,j]) => {
    addCylinder(new THREE.Vector3(...inner.cube1[i]), new THREE.Vector3(...inner.cube1[j]), 0.0022, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...inner.cube2[i]), new THREE.Vector3(...inner.cube2[j]), 0.0022, hyperframeMaterial, hyperframeGroup);
  });
  
  for (let i = 0; i < 8; i++) {
    addCylinder(new THREE.Vector3(...inner.cube1[i]), new THREE.Vector3(...inner.cube2[i]), 0.003, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...innerInner.cube1[i]), new THREE.Vector3(...inner.cube1[i]), 0.0025, hyperframeMaterial, hyperframeGroup);
    addCylinder(new THREE.Vector3(...innerInner.cube2[i]), new THREE.Vector3(...inner.cube2[i]), 0.0025, hyperframeMaterial, hyperframeGroup);
  }

  // 4. Dense web
  const allInnerVerts = [
    ...inner.cube1.map(v => new THREE.Vector3(...v)),
    ...inner.cube2.map(v => new THREE.Vector3(...v)),
    ...innerInner.cube1.map(v => new THREE.Vector3(...v)),
    ...innerInner.cube2.map(v => new THREE.Vector3(...v)),
  ];

  for (let i = 0; i < allInnerVerts.length; i++) {
    for (let j = i + 1; j < allInnerVerts.length; j++) {
      const dist = allInnerVerts[i].distanceTo(allInnerVerts[j]);
      if (dist > 0.01 && dist < innerSize * 1.3) {
        addCylinder(allInnerVerts[i], allInnerVerts[j], 0.0012, hyperframeMaterial, hyperframeGroup);
      }
    }
  }

  // 5. Intermediate faces
  [0.3, 0.6].forEach((depth) => {
    const interpVerts1 = [];
    const interpVerts2 = [];
    
    for (let i = 0; i < 8; i++) {
      interpVerts1.push(new THREE.Vector3(...tiny.cube1[i]).lerp(new THREE.Vector3(...inner.cube1[i]), depth));
      interpVerts2.push(new THREE.Vector3(...tiny.cube2[i]).lerp(new THREE.Vector3(...inner.cube2[i]), depth));
    }
    
    [[0,1,2,3],[4,5,6,7]].forEach(face => {
      createCompleteSquareFace(interpVerts1[face[0]], interpVerts1[face[1]], interpVerts1[face[2]], interpVerts1[face[3]], 0.0015, hyperframeMaterial, hyperframeGroup);
      createCompleteSquareFace(interpVerts2[face[0]], interpVerts2[face[1]], interpVerts2[face[2]], interpVerts2[face[3]], 0.0015, hyperframeMaterial, hyperframeGroup);
    });
  });

  // 6. Cross-tesseract faces
  for (let i = 0; i < 4; i++) {
    const v1a = new THREE.Vector3(...inner.cube1[i]);
    const v1b = new THREE.Vector3(...inner.cube1[(i + 1) % 4]);
    const v2a = new THREE.Vector3(...inner.cube2[i]);
    const v2b = new THREE.Vector3(...inner.cube2[(i + 1) % 4]);
    createCompleteSquareFace(v1a, v2a, v2b, v1b, 0.002, hyperframeMaterial, hyperframeGroup);
    
    const v1c = new THREE.Vector3(...inner.cube1[i + 4]);
    const v1d = new THREE.Vector3(...inner.cube1[((i + 1) % 4) + 4]);
    const v2c = new THREE.Vector3(...inner.cube2[i + 4]);
    const v2d = new THREE.Vector3(...inner.cube2[((i + 1) % 4) + 4]);
    createCompleteSquareFace(v1c, v2c, v2d, v1d, 0.002, hyperframeMaterial, hyperframeGroup);
  }

  // === EDGE LINES: RADIAL SPOKES ===
  
  // 1. Direct spokes
  for (let i = 0; i < 8; i++) {
    addCylinder(new THREE.Vector3(...inner.cube1[i]), new THREE.Vector3(...outer.cube1[i]), 0.004, edgeLinesMaterial, edgeLinesGroup);
    addCylinder(new THREE.Vector3(...inner.cube2[i]), new THREE.Vector3(...outer.cube2[i]), 0.004, edgeLinesMaterial, edgeLinesGroup);
  }

  // 2. Diagonal star pattern
  const diagonalConnections = [
    [0,6],[1,7],[2,4],[3,5],
    [0,2],[1,3],[4,6],[5,7],
    [0,5],[1,4],[2,7],[3,6],
  ];

  diagonalConnections.forEach(([innerIdx, outerIdx]) => {
    addCylinder(new THREE.Vector3(...inner.cube1[innerIdx]), new THREE.Vector3(...outer.cube1[outerIdx]), 0.003, edgeLinesMaterial, edgeLinesGroup);
    addCylinder(new THREE.Vector3(...inner.cube2[innerIdx]), new THREE.Vector3(...outer.cube2[outerIdx]), 0.003, edgeLinesMaterial, edgeLinesGroup);
  });

  // 3. Outer space diagonals
  [[0,6],[1,7],[2,4],[3,5]].forEach(([i,j]) => {
    addCylinder(new THREE.Vector3(...outer.cube1[i]), new THREE.Vector3(...outer.cube1[j]), 0.002, edgeLinesMaterial, edgeLinesGroup);
    addCylinder(new THREE.Vector3(...outer.cube2[i]), new THREE.Vector3(...outer.cube2[j]), 0.002, edgeLinesMaterial, edgeLinesGroup);
  });

  // 4. Intermediate layers
  [0.25, 0.5, 0.75].forEach((depth) => {
    for (let i = 0; i < 8; i++) {
      const inter1 = new THREE.Vector3(...inner.cube1[i]).lerp(new THREE.Vector3(...outer.cube1[i]), depth);
      const inter2 = new THREE.Vector3(...inner.cube2[i]).lerp(new THREE.Vector3(...outer.cube2[i]), depth);
      addCylinder(inter1, inter2, 0.0025, edgeLinesMaterial, edgeLinesGroup);
    }
    
    cubeEdges.forEach(([i, j]) => {
      const inter1i = new THREE.Vector3(...inner.cube1[i]).lerp(new THREE.Vector3(...outer.cube1[i]), depth);
      const inter1j = new THREE.Vector3(...inner.cube1[j]).lerp(new THREE.Vector3(...outer.cube1[j]), depth);
      addCylinder(inter1i, inter1j, 0.002, edgeLinesMaterial, edgeLinesGroup);
      
      const inter2i = new THREE.Vector3(...inner.cube2[i]).lerp(new THREE.Vector3(...outer.cube2[i]), depth);
      const inter2j = new THREE.Vector3(...inner.cube2[j]).lerp(new THREE.Vector3(...outer.cube2[j]), depth);
      addCylinder(inter2i, inter2j, 0.002, edgeLinesMaterial, edgeLinesGroup);
    });
  });

  // 5. Deep radial spokes
  for (let i = 0; i < 8; i++) {
    addCylinder(new THREE.Vector3(...innerInner.cube1[i]), new THREE.Vector3(...outer.cube1[i]), 0.0025, edgeLinesMaterial, edgeLinesGroup);
    addCylinder(new THREE.Vector3(...innerInner.cube2[i]), new THREE.Vector3(...outer.cube2[i]), 0.0025, edgeLinesMaterial, edgeLinesGroup);
  }

  console.log(
    `✅ Proper compound tesseract: ${hyperframeGroup.children.length} hyperframe + ${edgeLinesGroup.children.length} edge lines`
  );

  return {
    centerLines: hyperframeGroup,
    centerLinesMaterial: hyperframeMaterial,
    curvedLines: edgeLinesGroup,
    curvedLinesMaterial: edgeLinesMaterial,
  };
}
