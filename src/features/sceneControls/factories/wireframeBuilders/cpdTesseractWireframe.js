import * as THREE from "three";

/**
 * Create a wireframe for compound tesseract that shows all edges
 * Compound tesseract = 2 complete tesseracts (each with outer cube, inner cube, 6 frustums)
 * Second tesseract rotated 45° on Y-axis
 *
 * @param {THREE.BufferGeometry} geometry - The merged compound tesseract geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group
 */
export function createCpdTesseractWireframe(geometry, wireframeMaterial) {
  console.log(
    "Creating compound tesseract wireframe from actual geometry edges"
  );

  const wireframeGroup = new THREE.Group();

  // Extract all edges from the merged geometry
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const positions = edgesGeometry.attributes.position.array;

  // Create cylinders for each edge
  for (let i = 0; i < positions.length; i += 6) {
    const start = new THREE.Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    );
    const end = new THREE.Vector3(
      positions[i + 3],
      positions[i + 4],
      positions[i + 5]
    );

    const distance = start.distanceTo(end);

    // Skip extremely short edges (degenerate edges from geometry merging)
    if (distance < 0.001) continue;

    // Create cylinder for this edge
    const cylinderGeom = new THREE.CylinderGeometry(0.015, 0.015, distance, 8);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);

    // Position cylinder between start and end points
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    cylinderMesh.position.copy(midpoint);
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    wireframeGroup.add(cylinderMesh);
  }

  console.log(
    `Created compound tesseract wireframe with ${wireframeGroup.children.length} edge cylinders`
  );

  return wireframeGroup;
}
