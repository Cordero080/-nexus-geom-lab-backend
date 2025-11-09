import * as THREE from "three";
import { nearestVertexIndex } from "../../../utils/geometryHelpers";

/**
 * Create a wireframe for compound tesseract that shows all edges
 * Compound tesseract = 2 complete tesseracts (each with outer cube, inner cube, 6 frustums)
 * Second tesseract rotated 45° on Y-axis
 *
 * @param {THREE.BufferGeometry} geometry - The merged compound tesseract geometry
 * @param {THREE.Material} wireframeMaterial - Material for the wireframe
 * @returns {THREE.Group} The wireframe group
 */
export function createCpdTesseractWireframe(
  geometry,
  wireframeMaterial,
  options = {}
) {
  console.log(
    "Creating compound tesseract wireframe from actual geometry edges"
  );

  const wireframeGroup = new THREE.Group();
  const edgePairs = [];

  const edgeMaterial = wireframeMaterial.clone?.() || wireframeMaterial;
  if (edgeMaterial) {
    edgeMaterial.transparent = false;
    edgeMaterial.opacity = 1;
    edgeMaterial.depthWrite = true;
    edgeMaterial.needsUpdate = true;
  }

  const { radiusScale = 1 } = options;

  // Extract all edges from the merged geometry
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const positions = edgesGeometry.attributes.position.array;

  // Halo material and settings
  const BASE_RADIUS = 0.008;
  const MAIN_RADIUS = BASE_RADIUS * radiusScale;
  const HALO_RADIUS_FACTOR = 1.35; // slightly slimmer halo
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: wireframeMaterial.color?.clone?.() || new THREE.Color("#ffffff"),
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Subgroup for vertex nodes (kept out of top-level for update compatibility)
  const nodesGroup = new THREE.Group();
  nodesGroup.name = "wireframeVertexNodes";
  wireframeGroup.add(nodesGroup);

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
    const cylinderGeom = new THREE.CylinderGeometry(
      MAIN_RADIUS,
      MAIN_RADIUS,
      distance,
      8
    );
    const cylinderMesh = new THREE.Mesh(cylinderGeom, edgeMaterial);

    // Position cylinder between start and end points
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    cylinderMesh.position.copy(midpoint);
    cylinderMesh.lookAt(end);
    cylinderMesh.rotateX(Math.PI / 2);

    cylinderMesh.userData.baseLength = distance;
    // Track edge indices for deformation updates
    const iA = nearestVertexIndex(geometry, start);
    const iB = nearestVertexIndex(geometry, end);
    edgePairs.push([iA, iB]);

    // Add halo cylinder as child to inherit transforms
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
    wireframeGroup.add(cylinderMesh);
  }

  // Create unique vertex nodes using instancing
  const key = (v) => `${v.x.toFixed(3)}_${v.y.toFixed(3)}_${v.z.toFixed(3)}`;
  const uniq = new Map();
  for (let i = 0; i < positions.length; i += 3) {
    const v = new THREE.Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    );
    const k = key(v);
    if (!uniq.has(k)) uniq.set(k, v);
  }
  const verts = Array.from(uniq.values());
  if (verts.length) {
    const NODE_RADIUS = MAIN_RADIUS * 1.5;
    const nodeGeom = new THREE.SphereGeometry(NODE_RADIUS, 10, 10);
    const nodeMat = new THREE.MeshStandardMaterial({
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
    const inst = new THREE.InstancedMesh(nodeGeom, nodeMat, verts.length);
    inst.name = "vertexNodes";
    const m = new THREE.Matrix4();
    for (let i = 0; i < verts.length; i++) {
      m.makeTranslation(verts[i].x, verts[i].y, verts[i].z);
      inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true;
    nodesGroup.add(inst);
  }

  // Expose edge pairs for deformation updates
  wireframeGroup.userData.edgePairs = edgePairs;

  console.log(
    `Created compound tesseract wireframe with ${wireframeGroup.children.length} edge cylinders`
  );

  return wireframeGroup;
}
