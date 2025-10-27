import * as THREE from "three";
import { nearestVertexIndex } from "../../utils/geometryHelpers";

/**
 * Create a thick wireframe for BoxGeometry using cylinders
 * @param {THREE.BufferGeometry} geometry - The box geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group with edge pairs in userData
 */
export function createBoxWireframe(geometry, wireframeMaterial) {
  // Create thick wireframe using cylinders for cube edges
  const cubeWireframeGroup = new THREE.Group();
  const cubeEdgePairs = [];

  // Halo material and settings
  const MAIN_RADIUS = 0.015; // Keep consistent with existing thickness
  const HALO_RADIUS_FACTOR = 1.35; // slightly slimmer halo
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: wireframeMaterial.color?.clone?.() || new THREE.Color("#ffffff"),
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Subgroup for vertex nodes (avoid interfering with update logic)
  const nodesGroup = new THREE.Group();
  nodesGroup.name = "wireframeVertexNodes";
  cubeWireframeGroup.add(nodesGroup);

  // Get the 8 corners of the cube
  const size = 0.75; // Half of 1.5
  const cubeCorners = [
    [-size, -size, -size],
    [size, -size, -size],
    [size, size, -size],
    [-size, size, -size], // Back face
    [-size, -size, size],
    [size, -size, size],
    [size, size, size],
    [-size, size, size], // Front face
  ];

  // Define the 12 edges of the cube
  const cubeEdges = [
    // Back face edges
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Front face edges
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Connecting edges between front and back
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  // Create cylinder for each cube edge
  cubeEdges.forEach(([i, j]) => {
    const start = new THREE.Vector3(...cubeCorners[i]);
    const end = new THREE.Vector3(...cubeCorners[j]);
    const distance = start.distanceTo(end);

    // Create thick cylinder for cube edge - ADJUST 0.015 TO CHANGE MAIN WIREFRAME THICKNESS
    const cylinderGeom = new THREE.CylinderGeometry(
      MAIN_RADIUS,
      MAIN_RADIUS,
      distance,
      8
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder between start and end points
    cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    const iA_c = nearestVertexIndex(geometry, start);
    const iB_c = nearestVertexIndex(geometry, end);
    cubeEdgePairs.push([iA_c, iB_c]);

    // Add halo cylinder as a child so it inherits transforms
    const haloGeom = new THREE.CylinderGeometry(
      MAIN_RADIUS * HALO_RADIUS_FACTOR,
      MAIN_RADIUS * HALO_RADIUS_FACTOR,
      distance,
      8
    );
    const haloMesh = new THREE.Mesh(haloGeom, haloMaterial);
    haloMesh.name = "edgeHalo";
    haloMesh.position.set(0, 0, 0);
    haloMesh.rotation.set(0, 0, 0);
    cylinderMesh.add(haloMesh);
    cubeWireframeGroup.add(cylinderMesh);
  });

  cubeWireframeGroup.userData.edgePairs = cubeEdgePairs;

  // Create vertex nodes at the 8 cube corners
  const NODE_RADIUS = MAIN_RADIUS * 1.5;
  const sphereGeom = new THREE.SphereGeometry(NODE_RADIUS, 10, 10);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: wireframeMaterial.color?.clone?.() || new THREE.Color("#ffffff"),
    emissive: (
      wireframeMaterial.emissive?.clone?.() || new THREE.Color("#ffffff")
    ).multiplyScalar(0.5),
    emissiveIntensity: 1,
    metalness: 0.0,
    roughness: 0.4,
    transparent: true,
    opacity: Math.min(1, (wireframeMaterial.opacity ?? 0.6) + 0.2),
  });
  const instances = new THREE.InstancedMesh(
    sphereGeom,
    nodeMaterial,
    cubeCorners.length
  );
  instances.name = "vertexNodes";
  const m = new THREE.Matrix4();
  for (let idx = 0; idx < cubeCorners.length; idx++) {
    const v = new THREE.Vector3(...cubeCorners[idx]);
    m.makeTranslation(v.x, v.y, v.z);
    instances.setMatrixAt(idx, m);
  }
  instances.instanceMatrix.needsUpdate = true;
  nodesGroup.add(instances);

  console.log(
    "Created thick wireframe for cube with",
    cubeEdges.length,
    "cylinder edges"
  );

  return cubeWireframeGroup;
}
